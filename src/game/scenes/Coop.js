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
import { Nivel1, Nivel2, Nivel3, Nivel4, Nivel5, Nivel6, NivelController } from '../objects/coop/Niveles.js';


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
        
        this.lengua = new Lengua(this);
        this.frognard = new Frognard(this, 0, 0).setDepth(2);

        this.cambioNivelOn = false;
        
        this.nivelController = new NivelController(this);
    }

    update ()
    {
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

        if (this.cambioNivelOn === true) {
            this.cambioNivelOn = false;
            this.nivelController.cambioNivel(1);
        }

    }

    reinicio() {
        this.nivelController.cambioNivel(0);
    }
}