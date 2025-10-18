import MoscaDorada from "./MoscaDorada.js";

export default class MoscaDoradaPool {
    constructor(scene, cantidad = 20) {
        this.scene = scene;
        this.pool = [];
        for (let i = 0; i < cantidad; i++) {
            const mosca = new MoscaDorada(scene, -100, -100);
            this.pool.push(mosca);
        }
        this.spawnTimer = 0;
        this.baseSpawnInterval = 1000; // intervalo base en ms (ajusta si tu juego usa otro)
    }

    spawnMoscaDorada() {
        const libre = this.pool.find(m => !m.active);
        if (!libre) return;

        const lado = Phaser.Math.Between(0, 1);
        let x, direccion;
        const y = Phaser.Math.Between(100, 300);

        const canvasW = this.scene.sys.canvas.width;
        const margin = 40;
        if (lado === 0) {
            x = -margin;
            direccion = 1;
        } else {
            x = canvasW + margin;
            direccion = -1;
        }
        libre.spawn(x, y, direccion);

        // aplicar efectos persistentes del Modificador (igual que MoscaPool.spawn)
        const efectos = this.scene.modManager?.efectosMosca;
        if (efectos) {
            if (efectos.escalar !== 1) {
                if (libre.baseScaleOriginal == null) libre.baseScaleOriginal = libre.scaleX ?? 1;
                libre.setScale(efectos.escalar);
            }
            if (efectos.velMultiplicador !== 1) {
                if (libre.baseVelXOriginal == null) libre.baseVelXOriginal = libre.velX;
                libre.velX = libre.baseVelXOriginal * efectos.velMultiplicador;
            }
            if (efectos.fantasmas) {
                if (!libre._fantasmaTween) {
                    this.scene.tweens.add({
                        targets: libre,
                        alpha: { from: 0.1, to: 1 },
                        duration: 3500,
                        yoyo: true,
                        repeat: -1,
                    });
                }
            }
        }
    }

    update(time, delta) {
        this.spawnTimer += delta;
        const efectos = this.scene.modManager?.efectosMosca;
        const mult = efectos?.spawnMultDorada ?? 1;
        const interval = Math.max(50, this.baseSpawnInterval * mult); // evita interval 0
        if (this.spawnTimer >= interval) {
            this.spawnMoscaDorada();
            this.spawnTimer = 0;
        }

        this.pool.forEach(m => m.update(time, delta));
    }
}
