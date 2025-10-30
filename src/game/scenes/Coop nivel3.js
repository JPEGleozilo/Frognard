import { Scene } from 'phaser';
import Frognard from "../objects/coop/Frognard.js";
import Lengua from "../objects/coop/Lengua.js";
import BotonH from '../objects/coop/BotonH.js';
import BotonV from '../objects/coop/BotonV.js';
import Palanca from '../objects/coop/Palanca.js';
import Caja from '../objects/coop/Caja.js';
import { Accionable, Sirena } from "../objects/coop/Accionable.js";
import StateMachine from '../objects/coop/State/StateMachine.js';
import {Inicio, Alarma, GameOver} from "../objects/coop/State/Estados.js";


export class CoopNivel3 extends Scene
{
    constructor ()
    {
        super('Coop nivel3');
    }

    create ()
    {
        this.add.image(480, 270, 'fondo').setDepth(-1)        

        var mapa3 = this.make.tilemap({key: "mapaNivel3"});
        var patrones = mapa3.addTilesetImage("tileset", "patrones");
        var piso = mapa3.createLayer("bloques", patrones, 0, 0).setDepth(2);
        var paredes = mapa3.createLayer("paredes", patrones,0 ,0).setDepth(2);
        mapa3.createLayer("superficie", patrones, 0 , 0).setDepth(1);
        var final = mapa3.createLayer("final", patrones, 0, 0).setDepth(3);

        this.cajas = this.physics.add.group();

        this.capaSpawns = mapa3.getObjectLayer("spawn");
        this.capaSpawns.objects.forEach(objeto => {
            if (objeto.name === "Frognard") {
                this.spawnX = objeto.x;
                this.spawnY = objeto.y;
            } else if (objeto.name === "Caja") {
                this.spawnCaja = {
                    x: objeto.x,
                    y: objeto.y
                }
                new Caja (this, this.spawnCaja.x, this.spawnCaja.y)
            }
        })

        this.frognard = new Frognard(this, this.spawnX, this.spawnY - 2).setDepth(2);
        this.lengua = new Lengua(this);

        this.botonesH = this.physics.add.group();
        this.botonesV = this.physics.add.group();
        this.palancas = this.physics.add.group();
        
        this.accionable = this.physics.add.group();
        this.sirenas = this.physics.add.group();

        this.capaInterruptores = mapa3.getObjectLayer("interruptores");
        this.capaInterruptores.objects.forEach(objeto => {
            if (objeto.type === "Horizontal") {
                new BotonH (this, objeto.x, objeto.y, objeto.name);
                console.log(objeto.name, " horizontal");
            } else if (objeto.type === "Vertical") {
                new BotonV (this, objeto.x, objeto.y, objeto.name, objeto.properties[0].value, objeto.properties[1].value);
                console.log(objeto.name, " vertical");
            } else if (objeto.type === "Palanca") {
                new Palanca (this, objeto.x, objeto.y, objeto.name);
                console.log(objeto.name, " palanca");
            }
        });

        this.capaAccionables = mapa3.getObjectLayer("accionables");
        this.capaAccionables.objects.forEach(objeto => {
            new Accionable (this, objeto.x, objeto.y, objeto.name, objeto.type);
            console.log(objeto.name, " puerta");
        });

        // this.capaSirenas = mapa3.getObjectLayer("sirenas");
        // this.capaSirenas.objects.forEach(objeto => {
        //     new Sirena (this, objeto.x, objeto.y)
        // });


        piso.setCollisionByProperty({collider: true});
        piso.setCollisionCategory([2]);

        final.setCollisionByProperty({final: true});

        paredes.setCollisionByProperty({immovable: true});
        paredes.setCollisionCategory([2]);

        this.physics.add.collider(this.frognard, piso);
        this.physics.add.collider(this.frognard, paredes);
        this.physics.add.collider(this.lengua, paredes, () => {
            this.lengua.triggerVuelta();
        }, null, this.lengua);
        this.physics.add.collider(this.lengua, piso, () => {
            this.lengua.triggerVuelta();
        }, null, this.lengua);
        this.physics.add.collider(this.frognard, this.botonesH);
        this.physics.add.collider(this.frognard, this.accionable);
        this.physics.add.overlap(this.frognard, this.lengua, () => {
            this.lengua.desactivar();
        })

        this.physics.add.collider(this.cajas, piso);
        this.physics.add.collider(this.cajas, paredes);
        this.physics.add.collider(this.cajas, this.accionable);
        this.physics.add.collider(this.cajas, this.botonesH);
        this.physics.add.collider(this.cajas, this.frognard);

        this.physics.add.collider(this.frognard, final, () => {
            this.scene.start ("Coop nivel4")
        })

        this.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === this.lengua) {
                this.lengua.triggerVuelta();
            };
        })

        this.alarmaSM = new StateMachine ("inicio", {
            inicio: new Inicio(this, 0.3
            ),
            alarma: new Alarma(this),
            gameOver: new GameOver(this, this.frognard.x, this.frognard.y)
        }, [this, 2]);
    }

    update ()
    {
        this.alarmaSM.step();
        if (this.alarmaSM.estadoActual === "inicio" && this.alarmaSM.estados["inicio"].execute() === true) {
            console.log("transicion");
            this.alarmaSM.transicion(alarma);
        };
        if (this.alarmaSM.estadoActual === "alarma" && this.alarmaSM.estados["alarma"].execute() === true) {
            console.log("transicion");
            this.alarmaSM.transicion(gameOver);
        }

        this.frognard.update();
        this.inputLengua = this.frognard.getInputLengua();
        this.lengua.volviendo(this.frognard.body.x, this.frognard.body.y);
        this.lengua.lenguaLargo(this.frognard.body.x, this.frognard.body.y);
        this.lengua.getLenguaOut()

        if (this.inputLengua === true) {
            this.angulo = this.frognard.getCurrentAngle();
            this.lengua.disparar(this.frognard.body.x, this.frognard.body.y, this.angulo);
        };
        
        this.botonesH.children.iterate(obj => {
            obj.update();
        });
        this.accionable.children.iterate(obj => {
            obj.frenada();
        });
    }
    
    reinicio() {
        this.scene.restart();
    }
}