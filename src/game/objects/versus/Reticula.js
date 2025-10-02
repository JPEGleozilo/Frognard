import Phaser from "phaser";

export default class Reticle extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, color, keys, bounds = { minX: 0, maxX: 958, minY: 0, maxY: 360 }) {
    super(scene, x, y, 20, 20, color); 
    scene.add.existing(this);

    this.setAlpha(0); // ← Haz el rectángulo invisible

    // --- Sprite visual de la mira ---
    this.miraSprite = scene.add.sprite(x, y, 'mira');
    this.miraSprite.setOrigin(0.5);
    this.miraSprite.setDepth(100);

    this.keys = keys;
    this.speed = 200;

    // límites de la caja invisible
    this.minX = bounds.minX;
    this.maxX = bounds.maxX;
    this.minY = bounds.minY;
    this.maxY = bounds.maxY;
  }

  update(time, delta) {
    const velocity = this.speed * (delta / 1000);

    if (this.keys.left.isDown && this.x - velocity >= this.minX) this.x -= velocity;
    if (this.keys.right.isDown && this.x + velocity <= this.maxX) this.x += velocity;
    if (this.keys.up.isDown && this.y - velocity >= this.minY) this.y -= velocity;
    if (this.keys.down.isDown && this.y + velocity <= this.maxY) this.y += velocity;

    // --- Actualiza la posición del sprite de la mira ---
    if (this.miraSprite) {
      this.miraSprite.x = this.x;
      this.miraSprite.y = this.y;
    }
  }
}
