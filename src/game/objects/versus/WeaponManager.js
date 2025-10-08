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
        // Solo permite UN disparo activo
        if (!this.disparo || !this.disparo.active) {
            this.disparo = new Disparo(this.scene, this.jugador, this.mira, this.color);
        }
    }

    update(moscaPool, moscaDoradaPool) {
        if (this.disparo && this.disparo.active) {
            this.disparo.update(moscaPool, moscaDoradaPool);
        }
    }
}
