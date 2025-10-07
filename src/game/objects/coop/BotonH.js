import Phaser from 'phaser';

export default class BotonH extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'boton horizontal');
        this.distintivo = distintivo;

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(1, 1);
        this.setScale(32);
        this.setCollisionCategory([3]);

        this.scene.botonesH.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.physics.add.collider(this, scene.frognard, () => {
        });
    }
}