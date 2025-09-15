(function () {
  const notReady = () =>
    console.warn("⚠️ viewer ещё не готов. Подожди пока загрузится и повтори команду.");

  function withViewer(fn) {
    if (window.viewer) return fn(window.viewer);
    notReady();
  }

  // set angles
  window.setAngles = function ({ roll, yaw, pitch } = {}) {
    withViewer((v) => {
      const sceneId = v.getScene();
      const cfg = v.getConfig();
      cfg.scenes[sceneId] ||= {};

      let needReload = false;

      if (typeof roll === "number") {
        cfg.scenes[sceneId].roll = roll;
        needReload = true;
      }
      if (typeof yaw === "number") v.setYaw(yaw);
      if (typeof pitch === "number") v.setPitch(pitch);

      if (needReload) v.loadScene(sceneId, cfg.scenes[sceneId]);
      console.log("✅ setAngles:", { roll, yaw, pitch });
    });
  };

  // Shortcuts
  window.setRoll  = (r) => window.setAngles({ roll:  r });
  window.setYaw   = (y) => window.setAngles({ yaw:   y });
  window.setPitch = (p) => window.setAngles({ pitch: p });

  // Get angles
  window.getAngles = function () {
    return withViewer((v) => {
      const sceneId = v.getScene();
      const sc = v.getConfig().scenes[sceneId] || {};
      const data = { roll: sc.roll || 0, yaw: v.getYaw(), pitch: v.getPitch() };
      console.log("ℹ️ getAngles:", data);
      return data;
    });
  };

  // Dump JSON
  window.dumpSceneAngles = function () {
    return withViewer((v) => {
      const sceneId = v.getScene();
      const sc = v.getConfig().scenes[sceneId] || {};
      const obj = {
        sceneId,
        roll: sc.roll || 0,
        yaw: Number(v.getYaw().toFixed(3)),
        pitch: Number(v.getPitch().toFixed(3))
      };
      const json = JSON.stringify(obj, null, 2);
      console.log(json);
      return json;
    });
  };

  console.log("🎛 pano-console загружен. Доступно: setRoll(y), setYaw(y), setPitch(p), setAngles({...}), getAngles(), dumpSceneAngles().");
})();
