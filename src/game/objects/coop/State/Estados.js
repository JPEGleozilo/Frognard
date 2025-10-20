 import Phaser from 'phaser';
 import { State } from './StateMachine.js';
 
 export class Inicio extends State {
    constructor (scene, mins) {
    super();        
        this.scene = scene;
        this.tiempo = mins * 60000;
    }
    
    enter() {
        this.alarma = false;
        this.timer = this.scene.time.addEvent({
            delay: this.tiempo, //ms
            callback: () => {
                this.alarma = true
            },
            loop: false
        });
    };

    execute() {
        return this.alarma;
    };

    exit() {
       this.timer = null
       this.alarma = false
    };
 }

 export class Alarma extends State {
    constructor (scene) {
    super();        
        this.scene = scene;
    }

    enter () {
        this.tinte = this.scene.add.image("luz roja").setVisible(false).setScale(960).setDepth(10);
        this.tinteOn = false;
        this.sirenas = this.scene.sirenas.getChildren()
        this.gameOver = false;

        this.luces = this.scene.time.addEvent({
            delay: 1500, //1.5s
            callback: () => {
                if (this.tinteOn === false) {
                    this.tinte.setVisible(true);
                    this.sirenas.setOn(true);
                    this.tinteOn = true;
                } else if (this.tinteOn == true) {
                    this.tinte.setVisible(false);
                    this.sirenas.setOn(false);
                    this.tinteOn = false;
                }
            },
            loop: true
        });

        this.countdown = this.scene.time.addEvent({
            delay: 10000, // 10s
            callback: () => {
                this.gameOver = true;
            },
            loop: false
        });
    };

    execute () {
        return this.gameOver;
    };

    exit() {
        this.luces = null;
        this.countdown = null;
        this.gameOver = false;
        this.tinte.setVisible(false);
        this.sirenas.setOn(false);
        this.tinteOn = false;

    };
 }

export class GameOver extends State {

    constructor (scene, posX, posY) {
    super();
        this.scene = scene;
        this.x = posX;
        this.y = posY;
    }
    
    enter () {
        this.scene.add.sprite("Game Over", this.x, this.y, 0).setVisible(false).setOrigin(0.5).setDepth(1);

        this.gameOverAnim = this.scene.anims.create({
            key: "Secuencia Game Over",
            frames: this.anims.generateFrameNumbers('Game Over', { start: 0, end: 6 }),
            frameRate: 6,
            loop: false
        });
    }

    execute () {
        this.scene.frognard.setVisible(false);
        this.setVisible(true)
        this.gameOverAnim.play();
    }

    exit() {
    }
}