import MoscaDorada from "./MoscaDorada.js";

export default class MoscaDoradaPool {
    constructor(scene, cantidad = 20) {
        this.scene = scene;
        this.pool = [];

        for (let i = 0; i < cantidad; i++) {
            const mosca = new MoscaDorada(scene, -100, -100); // fuera de pantalla
            this.pool.push(mosca);
        }

        this.spawnTimer = 0;
    }

    spawnMoscaDorada() {
        const libre = this.pool.find(m => !m.active);
        if (!libre) return;

        // Decide aleatoriamente el lado de aparición
        const lado = Phaser.Math.Between(0, 1); // 0 = izquierda, 1 = derecha
        let x, direccion;
        const y = Phaser.Math.Between(100, 300);

        if (lado === 0) {
            // Aparece en el borde izquierdo y va a la derecha
            x = 30;
            direccion = 1;
        } else {
            // Aparece en el borde derecho y va a la izquierda
            x = this.scene.sys.canvas.width - 30;
            direccion = -1;
        }

        libre.spawn(x, y, direccion);
    }

    update(time, delta) {
        // Spawn automático cada cierto tiempo
        this.spawnTimer += delta;
        if (this.spawnTimer > 5000) { // cada 1.5s
            this.spawnMoscaDorada();
            this.spawnTimer = 0;
        }

        this.pool.forEach(m => m.update(time, delta));
    }
}
