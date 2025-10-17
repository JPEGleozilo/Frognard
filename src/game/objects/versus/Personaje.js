import Disparo from "./Disparo.js";
import MoscaDoradaPool from "./MoscaDoradaPool.js";

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
        this.sprite.setOrigin(0.5, 0.6);
        this.sprite.setDepth(1);

        this.teclaDisparo = this.scene.input.keyboard.addKey(teclaDisparo);
        this.playerId = playerId;
        this.capturedMosca = null;

        this.sprite.on('animationcomplete', (anim) => {
            if (anim.key === 'rana_disparo_anim') {
                this.sprite.setTexture('rana');
            }
        });
        this.sprite.on('animationcomplete', (anim) => {
            if (anim.key === 'rata_disparo_anim') {
                this.sprite.setTexture('rata');
                this.sprite.setDepth(200);
            }
         
        });
        
    }

    update(time, delta, moscaPool, moscaDoradaPool) {
        // Solo actualiza el disparo si existe
        if (this.disparo) {
            this.disparo.update(moscaPool, moscaDoradaPool);
        }

        // --- Sincroniza el sprite con el rectángulo ---
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo)) {
            // Crea el disparo solo si no existe o no está activo
            if (!this.disparo || !this.disparo.active) {
                this.disparo = new Disparo(this.scene, this, this.reticula, this.fillColor);
                this.disparo.disparar();

                // Si es la rana, cambia el sprite y reproduce la animación de disparo
                if (this.playerId === 'player1') {
                    this.sprite.setTexture('rana disparo');
                    this.sprite.play('rana_disparo_anim');
                }
                if (this.playerId === 'player2') {
                    this.sprite.setTexture('rata disparo');
                    this.sprite.play('rata_disparo_anim');
                    this.sprite.setDepth(200);
                }
            }
        }
    }
    captureMosca(mosca) {
        if (!this.capturedMosca) {
            this.capturedMosca = mosca;
            // Detecta si es dorada
            const puntos = mosca.texture.key === 'mosca dorada spritesheet' ? 5 : 1;
            // Avisar al ScoreManager con el puntaje
            this.scene.scoreManager.onMoscaCaptured(this.playerId, puntos);
        }
    }
}

