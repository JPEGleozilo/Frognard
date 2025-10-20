export default class MoscaImpostor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mosca_impostor');
        this.scene = scene;
        this.scene.add.existing(this);

        this.velX = 0;
        this.amplitud = 0;
        this.tiempo = 0;

        this.setVisible(false);
        this.setActive(false);
        this.setScale(1);

        this.baseVelXOriginal = null;
        this.baseAmplitudOriginal = null;
        this._timeSinceSpawn = 0;
        this._spawnGrace = 200; // ms
    }

    spawn(x, y, direccion) {
        this.x = x;
        this.y = y;

        this.velX = direccion * Phaser.Math.Between(100, 150);
        this.amplitud = Phaser.Math.Between(5, 20);
        this.tiempo = 0;

        if (this.baseVelXOriginal == null) this.baseVelXOriginal = this.velX;
        if (this.baseAmplitudOriginal == null) this.baseAmplitudOriginal = this.amplitud;

        this.setVisible(true);
        this.setActive(true);

        this._timeSinceSpawn = 0;
    }

    update(time, delta) {
        if (!this.active) return;

        this._timeSinceSpawn += delta;
        this.tiempo += delta * 0.005;
        this.x += this.velX * (delta / 1000);
        this.y += Math.sin(this.tiempo) * 0.8;

        if (this._timeSinceSpawn > this._spawnGrace) {
            if (this.x < -20 || this.x > this.scene.sys.canvas.width + 20) {
                this.despawn();
            }
        }
    }

    despawn() {
        this.setVisible(false);
        this.setActive(false);

        if (this.baseVelXOriginal != null) this.velX = this.baseVelXOriginal;
        if (this.baseAmplitudOriginal != null) this.amplitud = this.baseAmplitudOriginal;

        if (this._fantasmaTween) {
            this._fantasmaTween.stop();
            this._fantasmaTween = null;
            this.alpha = 1;
        }
    }
}
