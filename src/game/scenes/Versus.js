import { Scene } from 'phaser';
import Reticle from "../objects/Reticula.js";
import Personaje from "../objects/Personaje.js";
import MoscaPool from "../objects/MoscaPool.js";
import WeaponManager from "../objects/WeaponManager.js";
import ScoreManager from '../objects/ScoreManager.js';

export class Versus extends Scene
{
    constructor ()
    {
        super('Versus');
    }

  preload() {
    this.load.spritesheet('mosca spritesheet', 'assets/mosca spritesheet.png', {
        frameWidth: 24, // ajusta según tu imagen
        frameHeight: 24 // ajusta según tu imagen
    });
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
    this.rana = new Personaje(this, 300, 500, 0x00ff00, this.reticle1, "Q", 'player1');
    this.rata = new Personaje(this, 600, 500, 0xaaaaaa, this.reticle2, "P", 'player2');

    

    // Managers de armas
    this.weaponRana = new WeaponManager(this, this.rana, this.miraRana, 0x00ff00);
    this.weaponRata = new WeaponManager(this, this.rata, this.miraRata, 0x808080);

    this.moscaPool = new MoscaPool(this, 25); // pool de 15 moscas

    // Controles de disparo
    this.input.keyboard.on("keydown_Q", () => this.weaponRana.shoot());
    this.input.keyboard.on("keydown_P", () => this.weaponRata.shoot());

    // Crear ScoreManager
    this.scoreManager = new ScoreManager(this);

    this.anims.create({
        key: 'mosca_fly',
        frames: this.anims.generateFrameNumbers('mosca spritesheet', { start: 0, end: 2 }), // ajusta los frames
        frameRate: 8,
        repeat: -1
    });

    
}

  update(time, delta) {
    this.reticle1.update(time, delta);
    this.reticle2.update(time, delta);

    this.rana.update(time, delta, this.moscaPool);
    this.rata.update(time, delta, this.moscaPool);

    this.moscaPool.update(time, delta);

    this.weaponRana.update(this.moscaPool);
    this.weaponRata.update(this.moscaPool);
  }
}

