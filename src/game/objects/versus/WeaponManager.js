import Disparo from "./Disparo.js";

export default class WeaponManager {
    constructor(scene, jugador, mira, color) {
        this.scene = scene;
        this.jugador = jugador;
        this.mira = mira;
        this.color = color;
        this.disparo = null;
    }

    shoot() {
        if (!this.mira) {
            console.warn("No hay retícula asignada al WeaponManager.");
            return;
        }

        if (!this.disparo || !this.disparo.active) {
            // toma la velocidad configurada por el modificador (o el base por defecto)
            const speed = this.scene.disparoSpeed ?? this.scene.disparoSpeedBase ?? 12;
            this.disparo = new Disparo(this.scene, this.jugador, this.mira, this.color, speed);
            this.disparo.disparar();
            // Si el personaje tiene animación de disparo, actívala aquí
            if (this.jugador.playerId === 'player1') {
                this.jugador.sprite.setTexture('rana disparo');
                this.jugador.sprite.play('rana_disparo_anim');
            }
            if (this.jugador.playerId === 'player2') {
                this.jugador.sprite.setTexture('rata disparo');
                this.jugador.sprite.play('rata_disparo_anim');
                this.jugador.sprite.setDepth(200);
            }
        }
    }

    update(moscaPool, moscaDoradaPool, moscaImpostorPool) {
        if (this.disparo && this.disparo.active) {
            this.disparo.update(moscaPool, moscaDoradaPool, moscaImpostorPool);
        }
       
    }
    
}

