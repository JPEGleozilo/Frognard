import Phaser from 'phaser';
import InputSystem from '../../utils/InputSystem';

export default class Frognard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'frognard');

        // === Añadir a escena y física ===
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // === Físicas ===
        this.setOrigin(0.5, 0.75);
        this.setCollideWorldBounds(true);
        this.setCollidesWith([0, 1, 2, 3, 4]);
        this.body.setSize(this.width * 0.5, this.height - 4);
        this.body.setOffset(this.width * 0.25, 0);

        // === Propiedades ===
        this.velocidad = 225;
        this.salto = -500;
        this.gravedadBaja = -400;
        this.currentAngle = { x: 1, y: 0 };
        this.lenguaCooldown = false; // Evita mantener presionado

        // === Controles de teclado ===
        this.scene.cursors = this.scene.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,A,D,L,T");

        // === Gamepads ===
        this.joystick1 = null;
        this.joystick2 = null;

        if (scene.input.gamepad && scene.input.gamepad.total > 0) {
            const pads = scene.input.gamepad.gamepads;
            this.joystick1 = pads[0] ?? null;
            this.joystick2 = pads[1] ?? null;
        }

        // Evento cuando se conecta un mando
        scene.input.gamepad.on('connected', (pad) => {
            if (!this.joystick1) {
                this.joystick1 = pad;
                console.log("🎮 Joystick 1 conectado:", pad.id);
            } else if (!this.joystick2) {
                this.joystick2 = pad;
                console.log("🎮 Joystick 2 conectado:", pad.id);
            }
        });

        // Evento cuando se desconecta
        scene.input.gamepad.on('disconnected', (pad) => {
            if (this.joystick1 === pad) this.joystick1 = null;
            if (this.joystick2 === pad) this.joystick2 = null;
        });
    }

    update() {
        if (!this.body) return;

        this.setVelocityX(0);

        // === Movimiento con teclado o primer joystick ===
        const axis1 = this.joystick1?.axes?.[0]?.getValue?.() ?? 0;

        if (this.scene.cursors.D.isDown || axis1 > 0.1) {
            this.setVelocityX(this.velocidad);
            this.currentAngle = { x: 1, y: 0 };
        } else if (this.scene.cursors.A.isDown || axis1 < -0.1) {
            this.setVelocityX(-this.velocidad);
            this.currentAngle = { x: -1, y: 0 };
        }

        // === Saltar (teclado o botón A de cualquier mando) ===
        const saltoTeclado = this.scene.cursors.L.isDown;
        const saltoJoy = this.joystick2?.buttons?.[0]?.pressed ?? false;

        if ((saltoTeclado || saltoJoy) && this.body.onFloor()) {
            this.setVelocityY(this.salto);
        } else if ((saltoTeclado || saltoJoy) && !this.body.onFloor()) {
            this.setGravityY(this.gravedadBaja);
        } else {
            this.setGravityY(0);
        }

        // === Control de dirección con segundo joystick ===
        const joy2x = this.joystick2?.axes?.[0]?.getValue?.() ?? 0;
        const joy2y = this.joystick2?.axes?.[1]?.getValue?.() ?? 0;

        if (Math.abs(joy2x) > 0.2 || Math.abs(joy2y) > 0.2) {
            this.currentAngle = {
                x: Phaser.Math.Clamp(joy2x, -1, 1),
                y: Phaser.Math.Clamp(joy2y, -1, 1)
            };
        } else {
            // Si no hay joystick 2, usa las teclas de dirección
            const { UP, DOWN, LEFT, RIGHT } = this.scene.cursors;
            if (RIGHT.isDown && UP.isDown) this.currentAngle = { x: 0.7, y: -0.7 };
            else if (LEFT.isDown && UP.isDown) this.currentAngle = { x: -0.7, y: -0.7 };
            else if (RIGHT.isDown && DOWN.isDown) this.currentAngle = { x: 0.7, y: 0.7 };
            else if (LEFT.isDown && DOWN.isDown) this.currentAngle = { x: -0.7, y: 0.7 };
            else if (UP.isDown) this.currentAngle = { x: 0, y: -1 };
            else if (DOWN.isDown) this.currentAngle = { x: 0, y: 1 };
            else if (RIGHT.isDown) this.currentAngle = { x: 1, y: 0 };
            else if (LEFT.isDown) this.currentAngle = { x: -1, y: 0 };
        }

        // === Disparo de lengua (solo un toque) ===
        const disparoTeclado = Phaser.Input.Keyboard.JustDown(this.scene.cursors.T);
        const disparoJoy = this.joystick1?.buttons?.[0]?.pressed ?? false;

        // Evita mantener presionado
        if ((disparoTeclado || disparoJoy) && !this.lenguaCooldown) {
            this.scene.inputLengua = true;
            this.lenguaCooldown = true;

            // Evita mantener el disparo presionado
            this.scene.time.delayedCall(300, () => {
                this.scene.inputLengua = false;
                this.lenguaCooldown = false;
            });
        } else {
            this.scene.inputLengua = false;
        }
    }

    getCurrentAngle() {
        return { x: this.currentAngle.x, y: this.currentAngle.y };
    }

    getInputLengua() {
        return this.scene.inputLengua;
    }
}
