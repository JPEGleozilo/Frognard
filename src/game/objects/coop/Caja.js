import Phaser from "phaser";

export default class Caja extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "caja");

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Físicas
        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width, this.height - 4);
        this.setMass(3);
    }
}