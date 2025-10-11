import Phaser from "phaser";

export default class Reticle extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, color, keys, spriteName = 'mira', bounds = { minX: 0, maxX: 958, minY: 0, maxY: 360 }) {
    super(scene, x, y, 20, 20, color); 
    scene.add.existing(this);

    this.setAlpha(0); // ← Haz el rectángulo invisible

    // --- Sprite visual de la mira ---
    this.miraSprite = scene.add.sprite(x, y, spriteName);
    this.miraSprite.setOrigin(0.5);
    this.miraSprite.setDepth(100);
    this.miraSprite.setScale(1);
    this.keys = keys;
    this.speed = 200;

    // límites de la caja invisible
    this.minX = bounds.minX;
    this.maxX = bounds.maxX;
    this.minY = bounds.minY;
    this.maxY = bounds.maxY;
  }

  update(time, delta) {
    const velocidadBase = this.speed || 200;
    const velocidad = velocidadBase * (this.scene.velocidadReticula ?? 1) * (delta / 1000);

    // Si controles invertidos está activo, multiplica la dirección por -1
    const invertido = this.scene.controlesInvertidos ? -1 : 1;

    if (this.keys.left.isDown && this.x - velocidad * invertido >= this.minX) this.x -= velocidad * invertido;
    if (this.keys.right.isDown && this.x + velocidad * invertido <= this.maxX) this.x += velocidad * invertido;
    if (this.keys.up.isDown && this.y - velocidad * invertido >= this.minY) this.y -= velocidad * invertido;
    if (this.keys.down.isDown && this.y + velocidad * invertido <= this.maxY) this.y += velocidad * invertido;

    if (this.miraSprite) {
        this.miraSprite.x = this.x;
        this.miraSprite.y = this.y;
    }
  }
}
