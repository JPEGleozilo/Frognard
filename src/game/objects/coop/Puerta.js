import Phaser from 'phaser';

export default class Puerta extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'puerta');
        
        this.y = y
        
        this.distintivo = distintivo;

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.abierto = false;
        this.activo = false;

        this.setOrigin(0.5, 1);
        this.setScale(1);
        this.setCollisionCategory([2]);

        this.scene.puertas.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    toggle() {
        if (this.abierto === false && this.activo === false) {
            if (this.body.y >= this.y - 64) {
                this.activo = true;
                this.setVelocityY(-120);
            } else {
                this.setVelocityY(0);
                this.abierto = true;
                this.activo = false;
            }
        } else if (this.abierto === true && this.activo === false) {
            if (this.body.y <= this.y) {
                this.activo = true;
                this.setVelocityY(120);
            } else {
                this.setVelocityY(0);
                this.abierto = false;
                this.activo = false;
            }
        }
    }

}