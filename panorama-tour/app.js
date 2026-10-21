Promise.all([
  fetch('photos.json').then(r=>r.json()),
  fetch('hotspots.json').then(r=>r.json())
]).then(([PHOTOS, HOTSPOTS]) => {

  // ---------- Генератор сцен ----------
  function buildScenes() {
    const common = { 
      type: "equirectangular", 
      autoLoad: true, 
      hfov: 100, 
      minHfov: 50, 
      maxHfov: 120 
    };
    const scenes = {};
  
    for (const [sceneId, data] of Object.entries(HOTSPOTS)) {
      const photo = PHOTOS[data.pano];
      if (!photo) {
        console.error(`Нет фото для pano="${data.pano}" (sceneId="${sceneId}")`);
        continue;
      }
  
      scenes[sceneId] = { 
        ...common, 
        panorama: photo.src, 
        hotSpots: [], 
        roll: photo.roll || 0,      // ← вот оно
        yaw: photo.yaw || 0,        // ← можно тоже использовать
        pitch: photo.pitch || 0     // ← и это тоже
      };
  
      data.hotSpots.forEach(h => {
        scenes[sceneId].hotSpots.push({
          pitch: h.pitch, 
          yaw: h.yaw, 
          type: h.type, 
          sceneId: h.sceneId,
          text: h.text,
          createTooltipFunc: makeDot,
          createTooltipArgs: { kind: h.kind, tip: h.text, url: h.url || null }
        });
      });
    }
    return scenes;
  }


  // ---------- Pannellum ----------
  window.viewer = pannellum.viewer('panorama', {
    "default": { "firstScene": "studio1", "sceneFadeDuration": 400, "autoLoad": true },
    "scenes": buildScenes()
  });

  // ---------- Рисуем кружки ----------
  function makeDot(hotSpotDiv, args){
    hotSpotDiv.style.background = 'none';
    hotSpotDiv.classList.add('dot', args?.kind === 'nav' ? 'nav' : 'info');
  
    // -------- info tooltips ----------
    if (args?.kind === 'info' && args?.tip) {
      hotSpotDiv.setAttribute('data-tip', args.tip);
    }
  
    // -------- nav и link ----------
    if (args?.kind === 'nav' || args?.kind === 'link') {
      hotSpotDiv.style.cursor = 'pointer';
  
      if (args?.tip) {
        const label = document.createElement('span');
        label.className = 'hotspot-label';
        label.textContent = args.tip;
        hotSpotDiv.appendChild(label);
      }
    }
  
    // -------- link with popup ----------
    if (args?.kind === 'link' && args?.url) {
      hotSpotDiv.addEventListener('click', () => {
        const box = document.createElement('div');
        box.className = 'hotspot-box';
        box.innerHTML = `
          <div class="hotspot-content">
            <p>${args.tip || 'More info'}</p>
            <button class="hotspot-btn">Open</button>
          </div>
        `;
        document.body.appendChild(box);
    
        box.querySelector('.hotspot-btn').addEventListener('click', () => {
          window.open(args.url, '_blank');
          box.remove();
        });
    
        box.addEventListener('click', (e) => {
          if (e.target === box) box.remove();
        });
      });
    }
  }
  
  // ---------- Автогенерация кнопок ----------
  const navContainer = document.querySelector('.scene-nav');
  Object.entries(HOTSPOTS).forEach(([sceneId, data], i) => {
    const btn = document.createElement('button');
    btn.className = 'scene-btn' + (i===0 ? ' active' : '');
    btn.dataset.scene = sceneId;
    
    const photoKey = data.pano;  // например "p11"
    const label = PHOTOS[photoKey]?.title || sceneId;
    btn.textContent = label;
    
    navContainer.appendChild(btn);
    btn.addEventListener('click', ()=>{
      viewer.loadScene(sceneId);
      updateSceneButtons(sceneId);
    });
  });


  // ---------- Подсветка активной кнопки ----------
  function updateSceneButtons(active){
    document.querySelectorAll('.scene-btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.scene === active);
    });
  }

  updateSceneButtons('studio1');
});
