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
        this.add.image(480, 270, 'fondo').setDepth(-1)        
        
        this.frognard = new Frognard(this, 200, 200).setDepth(2);

        var mapa1 = this.make.tilemap({key: "mapaNivel1"});
        var patrones = mapa1.addTilesetImage("tileset", "patrones");
        var piso = mapa1.createLayer("bloques", patrones, 0, 0).setDepth(2);
        mapa1.createLayer("superficie", patrones, 0 , 0).setDepth(1);

        piso.setCollisionByProperty({collider: true});

        this.physics.add.collider(this.frognard, piso);

    }

    update ()
    {
        this.frognard.update();
    }
}
