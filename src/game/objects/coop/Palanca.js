import Phaser from 'phaser';

export default class Palanca extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo) {
        super(scene, x, y, 'palanca', 0);
        this.distintivo = distintivo;
        this.apretado = false;

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setScale(1);
        this.setCollisionCategory([3]);

        this.scene.palancas.add(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.physics.add.collider(this, scene.frognard, () => {
            const PUERTAMOVIENDOSE = this.scene.accionable.getChildren().some(a => a.distintivo === this.distintivo && a.activo === true);
            if (PUERTAMOVIENDOSE) return;
            if (this.apretado === true) {

            };
            this.apretado = true;
            this.togglePalanca(true);
            this.scene.accionable.children.iterate(obj => {
                obj.toggle(this.distintivo);
            });
        })
        
        this.scene.physics.add.collider(this, scene.lengua, () => {
            scene.lengua.triggerVuelta();
            if (this.apretado === true) {
                this.togglePalanca(false);
            } else if (this.apretado === false) {
                this.togglePalanca(true);
            }
            
        });
    }
    
    togglePalanca(valor) {
        this.apretado = valor;
        const PUERTAMOVIENDOSE = this.scene.accionable.getChildren().some(a => a.distintivo === this.distintivo && a.activo === true);
        if (PUERTAMOVIENDOSE) return;
        this.scene.accionable.children.iterate(obj => {
            obj.toggle(this.distintivo);
        });
        this.setFrame(valor ? 1 : 0); // Cambia el frame según el estado
    }
}