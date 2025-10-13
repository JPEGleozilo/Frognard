import Phaser from 'phaser';

export default class Accionable extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo, tipo) {
        super(scene, x, y);

        this.y = y;
        this.scene.y = y;
        this.distintivo = distintivo;
        this.tipo = tipo;
    
        if (this.tipo === "puerta") {
            this.setTexture("puerta");
            this.scene.accionable.add(this);
            this.y -= 2;
        }
        
        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.abierto = false;
        this.activo = false;

        this.setOrigin(0.5, 1);
        this.setScale(1);
        this.setCollisionCategory([2]);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    toggle(interruptor) {
        this.interruptor = interruptor;
        if (this.interruptor === this.distintivo) {
            if (this.tipo === "puerta") {
                if (this.abierto === false && this.activo === false) {
                        this.setVelocityY(-120);
                        this.activo = true;
                } else if (this.abierto === true && this.activo === false) {
                        this.setVelocityY(120);
                        this.activo = true;
                        
                }
            }
        }   
    }
    
    frenada(){
        if (this.activo === true){
            console.log (this.scene.y);
            if (this.y < (this.scene.y - 65) || this.y > this.scene.y + 2) {
                console.log(this.y);
                this.setVelocityY(0);
                this.abierto = true;
                this.activo = false;

                if (this.y < (this.scene.y - 65)){
                    this.abierto = true;
                    this.y += 6;
                } else {
                    this.abierto = false;
                    this.y -= 6;
                }
            }
        }
    }
}