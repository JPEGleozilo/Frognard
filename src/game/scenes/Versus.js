import { Scene } from 'phaser';
import Reticle from "../objects/Reticula.js";
import Personaje from "../objects/Personaje.js";
import MoscaPool from "../objects/MoscaPool.js";

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

    this.reticle2 = new Reticle(this, 700, 100, 0x0000ff, {
      left: this.input.keyboard.addKey("LEFT"),
      right: this.input.keyboard.addKey("RIGHT"),
      up: this.input.keyboard.addKey("UP"),
      down: this.input.keyboard.addKey("DOWN"),
    });

    // Personajes (jugador 1 y jugador 2)
    this.rana = new Personaje(this, 300, 500, 0x00ff00, this.reticle1, "SPACE");
    this.rata = new Personaje(this, 600, 500, 0xaaaaaa, this.reticle2, "ENTER");

    this.moscaPool = new MoscaPool(this, 25); // pool de 15 moscas
}

  update(time, delta) {
    this.reticle1.update(time, delta);
    this.reticle2.update(time, delta);

    this.rana.update(time, delta);
    this.rata.update(time, delta);

    this.moscaPool.update(time, delta);
  }
}

