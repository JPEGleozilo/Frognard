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


export class Coop extends Scene
{
    constructor ()
    {
        super('Coop');
    }

    create ()
    {
       // reproducir musica de fondo del modo Coop sin reiniciarla entre niveles
       try {
         const key = 'musica_coop';
         let coopMusic = this.sound.get(key);
         if (coopMusic) {
           if (!coopMusic.isPlaying) coopMusic.play({ loop: true, volume: 0.6 });
         } else {
           coopMusic = this.sound.add(key, { loop: true, volume: 0.6 });
           coopMusic.play();
         }
       } catch (e) {
         console.warn('musica_coop no disponible:', e);
       }

        this.add.image(480, 270, 'fondo').setDepth(-1)        

        var mapa1 = this.make.tilemap({key: "mapaNivel1"});
        var patrones = mapa1.addTilesetImage("tileset", "patrones");
        var piso = mapa1.createLayer("bloques", patrones, 0, 0).setDepth(2);
        var paredes = mapa1.createLayer("paredes", patrones,0 ,0).setDepth(2);
        mapa1.createLayer("superficie", patrones, 0 , 0).setDepth(1);
        var final = mapa1.createLayer("final", patrones, 0, 0).setDepth(3);
        var rejillas = mapa1.createLayer("rejillas", patrones,0 ,0).setDepth(2);

        this.cajas = this.physics.add.group();

        this.capaSpawns = mapa1.getObjectLayer("spawn");
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

        this.capaInterruptores = mapa1.getObjectLayer("interruptores");
        this.capaInterruptores.objects.forEach(objeto => {
            if (objeto.type === "Horizontal") {
                new BotonH (this, objeto.x, objeto.y, objeto.name);
            } else if (objeto.type === "Vertical") {
                new BotonV (this, objeto.x, objeto.y, objeto.name, objeto.properties[0].value, objeto.properties[1].value, objeto.properties[2].value);
            } else if (objeto.type === "Palanca") {
                new Palanca (this, objeto.x, objeto.y, objeto.name, objeto.properties[0].value);
            }
        });

        this.tutorial = this.add.sprite(768, 448, "tutorial coop").setDepth(10).setScale(2);

        this.anims.create({
            key: "tutorialCoop",
            frames: this.frognard.anims.generateFrameNumbers('tutorial coop', { start: 0, end: 20 }),
            frameRate: 8,
            repeat: -1
        })

        this.tutorial.anims.play ("tutorialCoop", true);

        this.capaAccionables = mapa1.getObjectLayer("accionables");
        this.capaAccionables.objects.forEach(objeto => {
            new Accionable (this, objeto.x, objeto.y, objeto.name, objeto.type);
        });


        piso.setCollisionByProperty({collider: true});
        piso.setCollisionCategory([2]);

        rejillas.setCollisionByProperty({rejilla: true});
        rejillas.setCollisionCategory([5]);

        final.setCollisionByProperty({final: true});

        paredes.setCollisionByProperty({immovable: true});
        paredes.setCollisionCategory([2]);

        this.physics.add.collider(this.frognard, piso);
        this.physics.add.collider(this.lengua, this.accionable, () => {
            this.lengua.triggerVuelta();
        })
        this.physics.add.collider(this.frognard, paredes);
        this.physics.add.collider(this.lengua, paredes, () => {
            this.lengua.triggerVuelta();
        }, null, this.lengua);
        this.physics.add.collider(this.lengua, piso, () => {
            this.lengua.triggerVuelta();
        }, null, this.lengua);
        this.physics.add.collider(this.frognard, this.accionable);
        this.physics.add.overlap(this.frognard, this.lengua, () => {
            this.lengua.desactivar();
        })
        this.physics.add.collider(this.frognard, rejillas);
        this.physics.add.collider(this.cajas, rejillas);

        this.physics.add.collider(this.frognard, final, () => {
            this.scene.start ("Coop nivel2")
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
            this.alarmaSM.transicion(alarma);
        };
        if (this.alarmaSM.estadoActual === "alarma" && this.alarmaSM.estados["alarma"].execute() === true) {
            this.alarmaSM.transicion(gameOver);
        }

        this.frognard.update();
        this.inputLengua = this.frognard.getInputLengua();
        this.lengua.volviendo(this.frognard.body.x, this.frognard.body.y);
        this.lengua.lenguaLargo(this.frognard.body.x, this.frognard.body.y);
        this.lengua.getLenguaOut()

        if (this.inputLengua === true) {
            this.angulo = this.frognard.getCurrentAngle();
            this.lengua.disparar(this.frognard.body.x + 16, this.frognard.body.y, this.angulo);
        };

        this.accionable.children.iterate(obj => {
            obj.frenada();
        });
    }

    reinicio() {
        this.scene.restart();
    }
}