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

        this.physics.add.collider(this.frognard, piso);
        this.physics.add.collider(this.lengua, piso, this.lengua.volver(this.frognard.body.x, this.frognard.body.y), null, this.lengua);

        this.lenguaOut = false;
    }

    update ()
    {
        this.frognard.update();
        this.inputLengua = this.frognard.getInputLengua();

        if (this.inputLengua === true && this.lenguaOut === false) {
            console.log("hola")
            this.lenguaOut = true
            this.angulo = this.frognard.getCurrentAngle();
            this.lengua.disparar(this.frognard.body.x, this.frognard.body.y, this.angulo);
        } else if (this.inputLengua === false || this.lenguaOut === true){
            this.angulo = null
        };
    }
}
