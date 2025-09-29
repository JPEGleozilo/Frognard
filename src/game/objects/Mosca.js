export default class Mosca extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mosca spritesheet'); // usa el mismo key
        this.scene = scene;
        this.scene.add.existing(this);

        this.velX = 0;
        this.amplitud = 0;
        this.tiempo = 0;

        this.setVisible(false);
        this.setActive(false);
        this.setScale(1.5); // ajusta el tamaño si es necesario
    }

    // Activar mosca desde pool
    spawn(x, y, direccion) {
        this.x = x;
        this.y = y;

        this.velX = direccion * Phaser.Math.Between(100, 150);
        this.amplitud = Phaser.Math.Between(5, 20);
        this.tiempo = 0;

        this.setVisible(true);
        this.setActive(true);

        this.play('mosca_fly'); // ← reproduce la animación
    }

    // Movimiento errático
    update(time, delta) {
        if (!this.active) return;

        this.tiempo += delta * 0.005; // control de oscilación
        this.x += this.velX * (delta / 1000);
        this.y += Math.sin(this.tiempo) * 0.8; // zig-zag suave

        // Si se va de pantalla → return to pool
        if (this.x < -20 || this.x > this.scene.sys.canvas.width + 20) {
            this.despawn();
        }
    }

    // Resetear y volver a pool
    despawn() {
        this.setVisible(false);
        this.setActive(false);
    }
}
