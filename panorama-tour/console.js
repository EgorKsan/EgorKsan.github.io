(function() {
    if (!window.viewer) {
        console.warn("⚠️ Pannellum viewer ещё не инициализирован!");
        return;
    }

    // Установка углов (roll, yaw, pitch)
    window.setAngles = function({roll, yaw, pitch}) {
        const sceneId = viewer.getScene();
        const config = viewer.getConfig();

        if (!config.scenes[sceneId]) {
            console.error("❌ Сцена не найдена:", sceneId);
            return;
        }

        if (typeof roll === "number") config.scenes[sceneId].roll = roll;
        if (typeof yaw === "number") config.scenes[sceneId].yaw = yaw;
        if (typeof pitch === "number") config.scenes[sceneId].pitch = pitch;

        // Перезагружаем сцену с новыми параметрами
        viewer.loadScene(sceneId, config.scenes[sceneId]);
        console.log("✅ Обновлено:", { roll, yaw, pitch });
    };

    // Быстрые хелперы
    window.setRoll = r => setAngles({roll: r});
    window.setYaw  = y => setAngles({yaw: y});
    window.setPitch= p => setAngles({pitch: p});

    console.log("🎛 Панорамная консоль подключена!");
    console.log("Используй: setRoll(число), setYaw(число), setPitch(число) или setAngles({roll,yaw,pitch})");
})();
