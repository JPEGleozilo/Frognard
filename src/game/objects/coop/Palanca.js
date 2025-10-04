import Phaser from 'phaser';

export default class Palanca extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'boton');
        this.distintivo = distintivo;

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(1, 1);
        this.setScale(32);
        this.setCollisionCategory([3]);

        this.scene.palancas.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.physics.add.collider(this, scene.frognard, () => {
            console.log(this.distintivo);
        })
        
        this.scene.physics.add.collider(this, scene.lengua, () => {
            console.log(this.distintivo);
            scene.lengua.triggerVuelta();
        });
    }
}