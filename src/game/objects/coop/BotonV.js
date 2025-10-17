import Phaser from 'phaser';

export default class BotonV extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo, delay) {
        super(scene, x, y, 'boton vertical', 0); // Frame 0 por defecto
        this.distintivo = distintivo;
        this.apretado = false;
        this.delay = delay

        // Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(1, 0.6);
        this.setScale(1); // Usa 1 para no distorsionar el sprite
        this.setCollisionCategory([3]);

        this.scene.botonesV.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
        
        this.scene.physics.add.collider(this, scene.lengua, () => {
            scene.lengua.triggerVuelta();
            const PUERTAMOVIENDOSE = this.scene.accionable.getChildren().some(a => a.distintivo === this.distintivo && a.activo === true);
            if (PUERTAMOVIENDOSE) return;
            if (this.apretado === true) return;
            this.setApretado(true);
            console.log(this.distintivo, " apretado");
            this.scene.accionable.children.iterate(obj => {
                obj.toggle(this.distintivo);
            });
            this.scene.time.delayedCall(this.delay, () => {
                if (this.apretado === false) return;
                console.log ("delay ", this.delay);
                this.apretado = false;
                this.setApretado(false);
                this.scene.accionable.children.iterate(obj => {
                    obj.toggle(this.distintivo);
                });
            })
        });
    }

    setApretado(valor) {
        this.apretado = valor;
        this.setFrame(valor ? 1 : 0); // Cambia el frame según el estado
    }
}