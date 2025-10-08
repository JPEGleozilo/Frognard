import Disparo from "./Disparo.js";

export default class Personaje extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, color, reticula, teclaDisparo, playerId) {
        super(scene, x, y, 40, 40, color);
        this.scene = scene;
        this.reticula = reticula;

        this.scene.add.existing(this);

        // Haz el rectángulo invisible
        this.setAlpha(0);

        // --- Elige el sprite según el color ---
        let spriteKey;
        if (color === 0xaaaaaa) { // Azul
            spriteKey = 'rata';   // Key del spritesheet de la rata
        } else {
            spriteKey = 'rana';   // Key del spritesheet de la rana
        }

        this.sprite = this.scene.add.sprite(x, y, spriteKey);
        this.sprite.setScale(2);
        this.sprite.setOrigin(0.5);
        this.sprite.setDepth(1);

        this.disparo = new Disparo(scene, this, this.reticula, color);
        this.teclaDisparo = this.scene.input.keyboard.addKey(teclaDisparo);
        this.playerId = playerId;
        this.capturedMosca = null;
    }

    update(time, delta, moscaPool) {
        this.disparo.update(moscaPool);

        // --- Sincroniza el sprite con el rectángulo ---
        this.sprite.x = this.x;
        this.sprite.y = this.y;

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

