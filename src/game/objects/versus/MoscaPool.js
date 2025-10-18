import Mosca from "./Mosca.js";

export default class MoscaPool {
    constructor(scene, cantidad = 20) {
        this.scene = scene;
        this.pool = [];

        for (let i = 0; i < cantidad; i++) {
            const mosca = new Mosca(scene, -100, -100); // fuera de pantalla
            this.pool.push(mosca);
        }

        this.spawnTimer = 0;
    }

    spawnMosca() {
  const libre = this.pool.find(m => !m.active);
  if (!libre) return;

  const lado = Phaser.Math.Between(0, 1);
  let x, direccion;
  const y = Phaser.Math.Between(100, 300);

  if (lado === 0) {
    x = 30;
    direccion = 1;
  } else {
    x = this.scene.sys.canvas.width - 30;
    direccion = -1;
  }

  // spawn fuera de pantalla en la dirección correcta para evitar salir instantáneamente
  const margin = 40;
  const canvasW = this.scene.sys.canvas.width;
  const spawnX = direccion > 0 ? -margin : canvasW + margin;
  libre.spawn(spawnX, y, direccion);

  // aplicar efectos persistentes del Modificador a moscas nuevas
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
            libre._fantasmaTween = this.scene.tweens.add({
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
        // Spawn automático cada cierto tiempo
        this.spawnTimer += delta;
        if (this.spawnTimer > 1000) { // cada 1.5s
            this.spawnMosca();
            this.spawnTimer = 0;
        }

        this.pool.forEach(m => m.update(time, delta));
    }
}
