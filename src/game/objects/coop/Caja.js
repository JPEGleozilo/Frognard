import Phaser from "phaser";

export default class Caja extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "caja");

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene.cajas.add(this);

        //Físicas
        this.setCollideWorldBounds(true);
        this.setCollidesWith([0, 1, 2, 3, 4]);
        this.setOrigin(0.5, 1);
        this.body.setSize(this.width, this.height - 4);
        this.setMass(0.1);
    }

    update(){
        this.setVelocityX(0);
    }
}