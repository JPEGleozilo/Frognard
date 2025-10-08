import Phaser from 'phaser';

export default class BotonV extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'boton vertical', 0); // Frame 0 por defecto
        this.distintivo = distintivo;
        this.apretado = false;

        // Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(1, 0.6);
        this.setScale(1); // Usa 1 para no distorsionar el sprite

        this.scene.botonesV.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.physics.add.collider(this, scene.lengua, () => {
            this.setApretado(true);
            console.log(this.distintivo);
            scene.lengua.triggerVuelta();
            this.scene.accionable.children.iterate(obj => {
                obj.toggle(this.distintivo);
            });
        });
    }

    setApretado(valor) {
        this.apretado = valor;
        this.setFrame(valor ? 1 : 0); // Cambia el frame según el estado
    }
}