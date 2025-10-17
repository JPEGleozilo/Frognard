import Phaser from 'phaser';
import InputSystem from '../../utils/InputSystem';

export default class Frognard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'frognard idle', 0);

        // === Añadir a escena y física ===
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // ===Anims ===
        this.anims.create({
            key: "Idle",
            frames: this.anims.generateFrameNumbers('frognard idle', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "IdleN",
            frames: this.anims.generateFrameNumbers('frognard idle', { start: 3, end: 5 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "IdleS",
            frames: this.anims.generateFrameNumbers('frognard idle', { start: 6, end: 8 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "IdleSO",
            frames: this.anims.generateFrameNumbers('frognard idle', { start: 9, end: 11 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "IdleO",
            frames: this.anims.generateFrameNumbers('frognard idle', { start: 12, end: 14 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "IdleNO",
            frames: this.anims.generateFrameNumbers('frognard idle', { start: 15, end: 17 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "CaminarN",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.anims.create({
            key: "CaminarNE",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 7, end: 13 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "CaminarE",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 14, end: 20 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "CaminarSE",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 21, end: 27 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.anims.create({
            key: "CaminarGirar",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 28, end: 34 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "CaminarS",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 35, end: 41 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "CaminarSO",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 42, end: 48 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "CaminarO",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 49, end: 55 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "CaminarNO",
            frames: this.anims.generateFrameNumbers('frognard caminar', { start: 56, end: 62 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "Salto",
            frames: this.anims.generateFrameNumbers('frognard salto', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: 0
        });

        this.animacionActual = null

        // === Físicas ===
        this.setOrigin(0.5, 0.75);
        this.setCollideWorldBounds(true);
        this.setCollidesWith([0, 1, 2, 3, 4]);
        this.body.setSize(this.width * 0.25, this.height);
        this.body.setOffset(this.width * 0.35, 0);

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
                console.log("Joystick 1 conectado:", pad.id);
            } else if (!this.joystick2) {
                this.joystick2 = pad;
                console.log("Joystick 2 conectado:", pad.id);
            }
        });

        // Evento cuando se desconecta
        scene.input.gamepad.on('disconnected', (pad) => {
            if (this.joystick1 === pad) this.joystick1 = null;
            if (this.joystick2 === pad) this.joystick2 = null;
        });
    }

    playAnim (key, force = false) {
        if (!key) return;
        const cur = this.anims.currentAnim && this.anims.currentAnim.key;
        if (!force && cur === key) return; // ya se está reproduciendo -> no reiniciar
        this.anims.play(key, true);
    }

    update() {
        if (!this.body) return;

        this.setVelocityX(0);

        // === Movimiento con teclado o primer joystick ===
        const axis1 = this.joystick1?.axes?.[0]?.getValue?.() ?? 0;

        if (this.scene.cursors.D.isDown || axis1 > 0.1) {
            this.setVelocityX(this.velocidad);
            this.currentAngle = { x: 1, y: 0 };
            if (this.body.onFloor) {
                this.animacionActual = "CaminarE";
                this.setFlipX(false);
            };
        } else if (this.scene.cursors.A.isDown || axis1 < -0.1) {
            this.setVelocityX(-this.velocidad);
            this.currentAngle = { x: -1, y: 0 };
            if (this.body.onFloor) {
                this.animacionActual = "CaminarE";
                this.setFlipX(true);
            };
        }

        // === Saltar (teclado o botón A de cualquier mando) ===
        const saltoTeclado = this.scene.cursors.L.isDown;
        const saltoJoy = this.joystick2?.buttons?.[0]?.pressed ?? false;

        if ((saltoTeclado || saltoJoy) && this.body.onFloor()) {
            this.animacionActual = "Salto";
            this.setVelocityY(this.salto);
        } else if ((saltoTeclado || saltoJoy) && !this.body.onFloor()) {
            this.setGravityY(this.gravedadBaja);
        } else {
            this.setGravityY(0);
        }

        if(this.scene.cursors.UP.isDown) {
            this.currentAngle.y = -1
        } else if (this.scene.cursors.DOWN.isDown) {
            this.currentAngle.y = 1
        } else {
            this.currentAngle.y = 0;        
        };

        if(this.scene.cursors.RIGHT.isDown) {
            this.currentAngle.x = 1
            if(this.scene.cursors.UP.isDown) {
                this.currentAngle = {x: 0.7, y: -0.7};
            } else if (this.scene.cursors.DOWN.isDown) {
                this.currentAngle = {x: 0.7, y: 0.7};
            };
        } else if (this.scene.cursors.LEFT.isDown) {
            this.currentAngle.x = -1
            if(this.scene.cursors.UP.isDown) {
                this.currentAngle = {x: -0.7, y: -0.7};
            } else if (this.scene.cursors.DOWN.isDown) {
                this.currentAngle = {x: -0.7, y: 0.7};
            };
        } else {
            if (this.scene.cursors.D.isUp && this.scene.cursors.A.isUp){
                this.currentAngle.x = 0;
            }
        };

        // === Control de dirección con segundo joystick ===
        const joy2x = this.joystick2?.axes?.[0]?.getValue?.() ?? 0;
        const joy2y = this.joystick2?.axes?.[1]?.getValue?.() ?? 0;

        if (Math.abs(joy2x) > 0.2 || Math.abs(joy2y) > 0.2) {
            this.currentAngle = {
                x: Phaser.Math.Clamp(joy2x, -1, 1),
                y: Phaser.Math.Clamp(joy2y, -1, 1)
            };
        };
        
        if (this.currentAngle.x > 0 && this.body.velocity.x < 0 && this.currentAngle.y === 0) {
                this.animacionActual = "CaminarO";
                this.setFlipX(true)
        } else if (this.currentAngle.x < 0 && this.body.velocity.x > 0  && this.currentAngle.y === 0) {
            this.animacionActual = "CaminarO";
            this.setFlipX(false);
        };

        if (this.currentAngle.y > 0) {
            this.animacionActual = "CaminarS";
            this.setFlipX(false);
            if(this.body.velocity.x < 0) {
                this.setFlipX(true)
            };
            if (this.currentAngle.x > 0) {
                this.animacionActual = "CaminarSE";
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarSO";
                };
            } else if (this.currentAngle.x < 0) {
                this.animacionActual = "CaminarSO";
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarSE";
                };
            }
        } else if (this.currentAngle.y < 0) {
            this.animacionActual = "CaminarN";
            this.setFlipX(false);
            if(this.body.velocity.x < 0) {
                this.setFlipX(true)
            };
            if (this.currentAngle.x > 0) {
                this.animacionActual = "CaminarNE";
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarNO";
                };
            } else if (this.currentAngle.x < 0) {
                this.animacionActual = "CaminarNO";
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarNE";
                };
            }
        }
        

        // === Disparo de lengua (solo un toque) ===
        const disparoTeclado = Phaser.Input.Keyboard.JustDown(this.scene.cursors.T);
        const disparoJoy = this.joystick1?.buttons?.[0]?.pressed ?? false;

        // Evita mantener presionado
        if ((disparoTeclado || disparoJoy) && !this.lenguaCooldown && (this.currentAngle.x !== 0 || this.currentAngle.y !== 0)) {
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

        // === Activación anims ===
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0 && this.scene.cursors.D.isUp && this.scene.cursors.A.isUp) {
            if (this.currentAngle.x === 0 && this.currentAngle.y === 0) {
                this.animacionActual = "Idle";
                this.setFlipX(false);
            } else if (this.currentAngle.x > 0 && this.currentAngle.y === 0) {
                this.animacionActual = "IdleO";
                this.setFlipX(true);
            } else if (this.currentAngle.x < 0 && this.currentAngle.y === 0) {
                this.animacionActual = "IdleO"
                this.setFlipX(false);
            } else if (this.currentAngle.y > 0) {
                if (this.currentAngle.x === 0) {
                    this.animacionActual = "IdleS";
                    this.setFlipX(false);
                } else if (this.currentAngle.x > 0) {
                    this.animacionActual = "IdleSO";
                    this.setFlipX(true);
                } else if (this.currentAngle.x < 0) {
                    this.animacionActual = "IdleSO";
                    this.setFlipX(false);
                };
            } else if (this.currentAngle.y < 0) {
                if (this.currentAngle.x === 0) {
                    this.animacionActual = "IdleN";
                    this.setFlipX(false);
                } else if (this.currentAngle.x > 0) {
                    this.animacionActual = "IdleNO";
                    this.setFlipX(true);
                } else if (this.currentAngle.x < 0) {
                    this.animacionActual = "IdleNO";
                    this.setFlipX(false);
                };
            };
        };
        if (this.body.velocity.y < 20 && !this.body.onFloor) {
            this.animacionActual = "Salto";
        } else if (this.body.velocity.y > 20 && !this.body.onFloor) {
            this.animacionActual = "Salto";
        };
        this.playAnim(this.animacionActual)
    }

    getCurrentAngle() {
        return { x: this.currentAngle.x, y: this.currentAngle.y };
    }

    getInputLengua() {
        return this.scene.inputLengua;
    }
}
