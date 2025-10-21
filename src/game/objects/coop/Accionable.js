import Phaser from 'phaser';

export class Accionable extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distintivo, tipo) {
        super(scene, x, y);

        this.y = y;
        this.distintivo = distintivo;
        this.tipo = tipo;
    
        if (this.tipo === "puerta") {
            this.setTexture("puerta");
            this.scene.accionable.add(this);
            this.y;
        }

        this.anims.create({
            key: "puerta abrir",
            frames: this.anims.generateFrameNumbers("puerta", { start: 0, end: 3}),
            frameRate: 12,
            loop:false
        });
        
        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.abierto = false;
        this.abriendo = false;
        this.cerrando = false;

        this.setOrigin(0.5, 1);
        this.setScale(1);
        this.setCollisionCategory([2]);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

//        this.on("animationcomplete", (anim, frame, gameObject) => {
//            this.frame = frame.index
//        });
    }

    toggle(interruptor, valor) {

        if (!this.anims.exists("puerta abrir")) {
        console.error("La animación 'puerta abrir' no está creada.");
        }
    
        this.interruptor = interruptor;
        if (this.interruptor === this.distintivo) {
            if (this.tipo === "puerta") {
                if (this.abierto === false && valor !== this.abierto && (this.abriendo === false && this.cerrando === false)) {
                    console.log("abriendo")
                    this.anims.play("puerta abrir", true);
                    this.abriendo = true;
                } else if (this.abierto === true && valor !== this.abierto && (this.abriendo === false && this.cerrando === false)) {
                    console.log("cerrando")
                    this.setVisible(true);
                    this.body.enable = true;
                    this.anims.playReverse("puerta abrir", true);
                    this.cerrando = true
                }
            }
        }   
    }
    
    frenada() {

        this.on("animationcomplete", (anim, frame) => {
            if (anim.key === "puerta abrir") {
                if (this.abriendo) {
                    this.abierto = true;
                    this.abriendo = false;
                    this.setVisible(false);
                    this.body.enable = false;
                    console.log("Puerta abierta");
                } else if (this.cerrando) {
                    this.abierto = false;
                    this.cerrando = false;
                    console.log("Puerta cerrada");
                }
            }

        });
    }
}

export class Sirena extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, posX, posY) {
        super (scene, posX, posY, "luz alarma", 0);

//        scene.physics.add.existing(this);
//        this.body.setImmovable(true);
//        this.body.setAllowGravity(false);
//
//        this.setFlipY(true);
//        this.setOrigin(0);
//        
//        this.scene.sirenas.add(this);
    }

    setOn(valor) {
        this.setFrame(valor ? 1 : 0)
    }
}