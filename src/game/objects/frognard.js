import Phaser from 'phaser';

export default class Frognard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'frognard');

        // Añadir al display y al sistema de física
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajustes físicos y de origen
        this.setOrigin(0, 1);
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.5, this.height);
        this.body.setOffset(this.width * 0.25, 0);

        // Parámetros de movimiento
        this.speed = 210;
        this.jumpSpeed = -500;
        this.lowGrav = -400;

        // Estado interno
        this.isDead = false;
        this.scene = scene;

        this.inputKeys = null;
    }
    
    setInput(keys) {
        this.inputKeys = keys;
    }

    // input puede ser this.p1 (objeto con Keys) o un objeto con { left, right, up, jump }
    update(input) {
        if (!this.body || this.isDead) return;

        // Determinar controles (permite compatibilidad con diferentes shapes)
        const izquierdaInput = input && (input.A?.isDown);
        const derechaInput = input && (input.D?.isDown);
        const saltoInput = input && (input.L?.isDown);

        const miraN = input && (input.up?.isDown);
        const miraNE = input && (input.up?.isDown && input.right?.isDown);
        const miraNO = input && (input.up?.isDown && input.left?.isDown);
        const miraE = input && (input.right?.isDown && !input.up?.isDown && !input.down?.isDown);
        const miraO = input && (input.left?.isDown && !input.up?.isDown && !input.down?.isDown);
        const miraS = input && (input.down?.isDown);
        const miraSE = input && (input.down?.isDown && input.right?.isDown);
        const miraSO = input && (input.down?.isDown && input.left?.isDown);

        // Movimiento horizontal
        if (izquierdaInput) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.anims && this.anims.play('run', true);
        } else if (derechaInput) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            this.anims && this.anims.play('run', true);
        } else {
            this.setVelocityX(0);
            this.anims && this.anims.play('idle', true);
        }

        // Salto: sólo si está tocando el suelo
        const onGround = this.body.blocked.down || this.body.onFloor?.();
        if (saltoInput && onGround) {
            this.setVelocityY(this.jumpSpeed);
            this.anims && this.anims.play('jump', true);
        }

        if (saltoInput && !this.player.body.onFloor()){
            this.player.body.setGravityY(this.lowGrav);
        } else {
            this.player.body.setGravityY(0);
        }
    }

    // llamada al morir
    die() {
        this.isDead = true;
        this.setVelocity(0, 0);
        this.anims && this.anims.play('dead', true);
        // desactivar cuerpo para evitar más colisiones si quieres
        // this.body.enable = false;
    }

    // reset simple
    respawn(x, y) {
        this.isDead = false;
        this.clearTint();
        this.setPosition(x, y);
        this.setVelocity(0, 0);
        this.body.enable = true;
    }
}