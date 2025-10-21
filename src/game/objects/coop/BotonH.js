import Phaser from 'phaser';

export default class BotonH extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'boton horizontal', 0); // Frame 0 por defecto
        this.distintivo = distintivo;
        this.apretado = false;
        this.activado = false

        // Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(this.width, this.height - 8);
        this.body.setOffset(0, 8);

        this.setOrigin(1, 1);
        this.setScale(1); // Usa 1 para no distorsionar el sprite
        this.setCollisionCategory([3]);

        this.scene.botonesH.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    setApretado(valor) {
        this.apretado = valor;
        this.setFrame(valor ? 1 : 0); // Frame 1 si apretado, 0 si no
        if (valor === true) {
            this.scene.accionable.children.iterate(obj => {
            obj.toggle(this.distintivo, valor);
            });
        } else {
            this.scene.accionable.children.iterate(obj => {
            obj.toggle(this.distintivo, valor);
            });
        }
    }

    update() {
        if (!this.body.touching.none) {
            this.setApretado(true);
        } else {
            this.setApretado(false);
        }
    }
}