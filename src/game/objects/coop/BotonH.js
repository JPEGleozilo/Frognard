import Phaser from 'phaser';

export default class BotonH extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'boton horizontal', 0); // Frame 0 por defecto
        this.distintivo = distintivo;
        this.apretado = false;

        // Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(1, 1);
        this.setScale(1); // Usa 1 para no distorsionar el sprite
        this.setCollisionCategory([3]);

        this.scene.botonesH.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.physics.add.collider(this, scene.frognard, () => {
            this.setApretado(true);
        });
    }

    setApretado(valor) {
        this.apretado = valor;
        this.setFrame(valor ? 1 : 0); // Frame 1 si apretado, 0 si no
    }

    // Si quieres que se desactive cuando el jugador se va:
    update() {
        // Aquí puedes checar si sigue colisionando, si no, desactiva
        // Ejemplo simple (ajusta según tu lógica):
        if (!this.body.touching.none) {
            this.setApretado(true);
        } else {
            this.setApretado(false);
        }
    }
}