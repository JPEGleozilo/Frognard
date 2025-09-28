import { Scene } from 'phaser';
import Reticle from "../objects/Reticula.js";

export class Versus extends Scene
{
    constructor ()
    {
        super('Versus');
    }
create() {
     // Retículas (jugador 1 con WASD, jugador 2 con flechas)
    this.reticle1 = new Reticle(this, 200, 100, 0xff0000, {
      left: this.input.keyboard.addKey("A"),
      right: this.input.keyboard.addKey("D"),
      up: this.input.keyboard.addKey("W"),
      down: this.input.keyboard.addKey("S"),
    });

    this.reticle2 = new Reticle(this, 600, 100, 0x0000ff, {
      left: this.input.keyboard.addKey("LEFT"),
      right: this.input.keyboard.addKey("RIGHT"),
      up: this.input.keyboard.addKey("UP"),
      down: this.input.keyboard.addKey("DOWN"),
    });
  }

  update(time, delta) {
    this.reticle1.update(time, delta);
    this.reticle2.update(time, delta);
  }
}

