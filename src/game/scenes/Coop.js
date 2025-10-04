import { Scene } from 'phaser';
import Frognard from "../objects/coop/Frognard.js";
import Lengua from "../objects/coop/Lengua.js";
import BotonH from '../objects/coop/BotonH.js';
import BotonV from '../objects/coop/BotonV.js';
import Palanca from '../objects/coop/Palanca.js';

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

        this.botonesH = this.physics.add.group();
        this.botonesV = this.physics.add.group();
        this.palancas = this.physics.add.group();

        this.capaInterruptores = mapa1.getObjectLayer("interruptores");
        this.capaInterruptores.objects.forEach(objeto => {
            if (objeto.type === "Horizontal") {
                new BotonH (this, objeto.x, objeto.y, objeto.name);
                console.log(objeto.name, " horizontal");
            } else if (objeto.type === "Vertical") {
                new BotonV (this, objeto.x, objeto.y, objeto.name);
                console.log(objeto.name, " vertical");
            } else if (objeto.type === "Palanca") {
                new Palanca (this, objeto.x, objeto.y, objeto.name);
                console.log(objeto.name, " palanca");
            }
        })

        piso.setCollisionByProperty({collider: true});
        piso.setCollisionCategory([2]);

        this.physics.add.collider(this.frognard, piso);
        this.physics.add.collider(this.lengua, piso, () => {
            this.lengua.triggerVuelta();
        }, null, this.lengua);

        this.physics.add.overlap(this.frognard, this.lengua, () => {
            this.lengua.desactivar();
        })

        this.physics.world.on("worldbounds", (body) => {
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
