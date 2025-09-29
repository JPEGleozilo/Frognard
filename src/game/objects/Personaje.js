import Disparo from "./Disparo.js";

export default class Personaje extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, color, reticula, teclaDisparo, playerId) {
        super(scene, x, y, 40, 40, color);
        this.scene = scene;
        this.reticula = reticula;

        this.scene.add.existing(this);

        this.disparo = new Disparo(scene, this, this.reticula, color);
        this.teclaDisparo = this.scene.input.keyboard.addKey(teclaDisparo);3
        this.playerId = playerId;
        this.capturedMosca = null;
    }

    update(time, delta, moscaPool) {
        this.disparo.update(moscaPool);

        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo)) {
            this.disparo.disparar();
        }
    }
    captureMosca(mosca) {
        if (!this.capturedMosca) {
            this.capturedMosca = mosca;

            // 🔔 Avisar al ScoreManager de la escena
            this.scene.scoreManager.onMoscaCaptured(this.playerId);
        }
    }
}

