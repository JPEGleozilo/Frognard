import Disparo from "./Disparo.js";

export default class Personaje extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, color, reticula, teclaDisparo) {
        super(scene, x, y, 40, 40, color);
        this.scene = scene;
        this.reticula = reticula;

        this.scene.add.existing(this);

        this.disparo = new Disparo(scene, this, this.reticula, color);
        this.teclaDisparo = this.scene.input.keyboard.addKey(teclaDisparo);
    }

    update(time, delta) {
        this.disparo.update(time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo)) {
            this.disparo.disparar();
        }
    }
}

