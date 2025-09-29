export default class Mosca extends Phaser.GameObjects.Ellipse {
    constructor(scene, x, y) {
        super(scene, x, y, 16, 12, 0x000000); // mosca simple (ovalito negro)
        this.scene = scene;
        this.scene.add.existing(this);

        this.velX = 0;
        this.amplitud = 0;
        this.tiempo = 0;

        this.setVisible(false);
        this.setActive(false);
    }

    // Activar mosca desde pool
    spawn(x, y, direccion) {
        this.x = x;
        this.y = y;

        this.velX = direccion * Phaser.Math.Between(100, 150); // izquierda o derecha
        this.amplitud = Phaser.Math.Between(5, 20);           // oscilación vertical
        this.tiempo = 0;

        this.setVisible(true);
        this.setActive(true);
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
