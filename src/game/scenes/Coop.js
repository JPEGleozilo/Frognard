import { Scene } from 'phaser';
import Frognard from "../objects/coop/Frognard.js";

export class Coop extends Scene
{
    constructor ()
    {
        super('Coop');
    }

    create ()
    {
        this.frognard = new Frognard(this, 200, 200);

        if (!this.physics) {
            console.error('Physics plugin no habilitado. Añade physics:{ default: "arcade", ... } al config de Phaser.');
        return;
        }
    }

    update ()
    {
        this.frognard.update();
    }
}
