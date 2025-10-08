import { Scene } from 'phaser';
import Reticle from "../objects/versus/Reticula.js";
import Personaje from "../objects/versus/Personaje.js";
import MoscaPool from "../objects/versus/MoscaPool.js";
import WeaponManager from "../objects/versus/WeaponManager.js";
import ScoreManager from '../objects/versus/ScoreManager.js';
import MoscaDoradaPool from '../objects/versus/MoscaDoradaPool.js';

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
    this.add.image(480, 270, 'fondo');

    // Retículas
    this.reticle1 = new Reticle(this, 200, 100, 0x00ff00, {
        left: this.input.keyboard.addKey("A"),
        right: this.input.keyboard.addKey("D"),
        up: this.input.keyboard.addKey("W"),
        down: this.input.keyboard.addKey("S"),
    }, 'MiraRana');

    this.reticle2 = new Reticle(this, 700, 100, 0xaaaaaa, {
        left: this.input.keyboard.addKey("LEFT"),
        right: this.input.keyboard.addKey("RIGHT"),
        up: this.input.keyboard.addKey("UP"),
        down: this.input.keyboard.addKey("DOWN"),
    }, 'MiraRata');

    // Personajes
    this.rana = new Personaje(this, 300, 480, 0x00ff00, this.reticle1, "Q", 'player1');
    this.rata = new Personaje(this, 600, 480, 0xaaaaaa, this.reticle2, "P", 'player2');

    // Managers de armas
    this.weaponRana = new WeaponManager(this, this.rana, this.reticle1, 0x00ff00);
    this.weaponRata = new WeaponManager(this, this.rata, this.reticle2, 0x808080);

    // Pools de moscas
    this.moscaPool = new MoscaPool(this, 25);
    this.moscaDoradaPool = new MoscaDoradaPool(this, 5); // ← NUEVO: pool de moscas doradas

    // Controles de disparo
    this.input.keyboard.on("keydown_Q", () => this.weaponRana.shoot());
    this.input.keyboard.on("keydown_P", () => this.weaponRata.shoot());

    // ScoreManager
    this.scoreManager = new ScoreManager(this);

    this.anims.create({
        key: 'mosca_fly',
        frames: this.anims.generateFrameNumbers('mosca spritesheet', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'mosca_fly_golden',
        frames: this.anims.generateFrameNumbers('mosca dorada spritesheet', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });
}

  update(time, delta) {
    this.reticle1.update(time, delta);
    this.reticle2.update(time, delta);

    this.rana.update(time, delta, this.moscaPool, this.moscaDoradaPool);
    this.rata.update(time, delta, this.moscaPool, this.moscaDoradaPool);

    this.moscaPool.update(time, delta);
    this.moscaDoradaPool.update(time, delta);

    this.weaponRana.update(this.moscaPool, this.moscaDoradaPool);
    this.weaponRata.update(this.moscaPool, this.moscaDoradaPool);
  }
}

