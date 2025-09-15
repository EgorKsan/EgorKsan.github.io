Promise.all([
  fetch('photos.json').then(r=>r.json()),
  fetch('hotspots.json').then(r=>r.json())
]).then(([PHOTOS, HOTSPOTS]) => {

  // ---------- Генератор сцен ----------
  function buildScenes(){
    const common = { type:"equirectangular", autoLoad:true, hfov:100, minHfov:50, maxHfov:120 };
    const scenes = {};
    for (const [sceneId, data] of Object.entries(HOTSPOTS)){
      const photo = PHOTOS[data.pano];   // <-- вот это нужно
      const panoFile = photo.src;
      scenes[sceneId] = { ...common, panorama: panoFile, hotSpots: [], roll: photo.roll || 0, yaw: photo.yaw || 0 , pitch: photo.pitch || 0};
      data.hotSpots.forEach(h=>{
        scenes[sceneId].hotSpots.push({
          pitch:h.pitch, yaw:h.yaw, type:h.type, sceneId:h.sceneId,
          text:h.text,
          createTooltipFunc: makeDot,
          createTooltipArgs:{ kind:h.kind, tip:h.text }
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
    if (args?.kind === 'info' && args?.tip) {
      hotSpotDiv.setAttribute('data-tip', args.tip);
    }
    if (args?.kind === 'nav') {
      hotSpotDiv.style.cursor = 'pointer';
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
