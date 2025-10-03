import { Scene } from 'phaser';
import Frognard from "../objects/coop/Frognard.js";
import Lengua from "../objects/coop/Lengua.js";

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
        this.lengua = new Lengua(this);

        var mapa1 = this.make.tilemap({key: "mapaNivel1"});
        var patrones = mapa1.addTilesetImage("tileset", "patrones");
        var piso = mapa1.createLayer("bloques", patrones, 0, 0).setDepth(2);
        mapa1.createLayer("superficie", patrones, 0 , 0).setDepth(1);

        piso.setCollisionByProperty({collider: true});
        piso.setCollisionCategory([2]);

        this.physics.add.collider(this.frognard, piso);
        this.physics.add.collider(this.lengua, piso, () => {
            this.lengua.triggerVuelta();
        }, null, this.lengua);

        this.physics.add.overlap(this.frognard, this.lengua, () => {
            this.lengua.desactivar();
        })

        this.physics.world.on("worldbounds", (body,up,down,left,right) => {
            if (body.gameObject === this.lengua) {
                this.lengua.triggerVuelta();
            };
        })
    }

    update ()
    {
        this.frognard.update();
        this.inputLengua = this.frognard.getInputLengua();
        this.lengua.volviendo(this.frognard.body.x, this.frognard.body.y);

        if (this.inputLengua === true) {
            this.angulo = this.frognard.getCurrentAngle();
            this.lengua.disparar(this.frognard.body.x, this.frognard.body.y, this.angulo);
        };
    }
}
