import Phaser from 'phaser';

export default class Frognard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'frognard');

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Physics
        this.setOrigin(0, 1);
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.5, this.height);
        this.body.setOffset(this.width * 0.25, 0);
        this.velocidad = 200;
        this.salto = -500;
        this.gravedadBaja = -400;

        //Controles
        this.scene.cursors = this.scene.input.keyboard.addKeys ("UP, DOWN, LEFT, RIGHT, ,A ,D, L, T");
    }
      
    
    update() {
        this.setVelocityX (0);

        if (this.scene.cursors.D.isDown) {
            this.setVelocityX(this.velocidad);
        } 
        if (this.scene.cursors.A.isDown) {
            this.setVelocityX(-this.velocidad);
        }
        if (this.scene.cursors.L.isDown && this.body.onFloor()) {
            this.setVelocityY(this.salto);
        } else if (this.scene.cursors.L.isDown && !this.body.onFloor()) {
            this.setGravityY(this.gravedadBaja);
        } else {
            this.setGravityY(0);
        }
    }
}