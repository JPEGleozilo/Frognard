import Phaser from "phaser";

export default class Reticle extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, color, keys) {
    super(scene, x, y, 20, 20, color); 
    scene.add.existing(this);

    this.keys = keys;
    this.speed = 200;
  }

  update(time, delta) {
    const velocity = this.speed * (delta / 1000);

    if (this.keys.left.isDown) this.x -= velocity;
    if (this.keys.right.isDown) this.x += velocity;
    if (this.keys.up.isDown) this.y -= velocity;
    if (this.keys.down.isDown) this.y += velocity;
  }
}
