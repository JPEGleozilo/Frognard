import Phaser from 'phaser';
import GamePadController from '../../utils/GamepadController.js';
import AnimController from "./AnimController.js"

export default class Frognard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
    super(scene, x, y, 'frognard idle', 0);

        // === Añadir a escena y física ===
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.animController = new AnimController(this.scene, this)
        this.animController.createAnims();
        this.animacionActual = null;
        this.flipActual = false;
        this._canPlayJumpSound = true;
        this.ultimoFlip = false;

        this.scene.angulo = null;

        // === Físicas ===
        this.setOrigin(0.5, 0.75);
        this.setCollideWorldBounds(true);
        this.setCollidesWith([0, 1, 2, 3, 4, 5]);
        this.body.setSize(this.width * 0.25, this.height - 4);
        this.body.setOffset(this.width * 0.35, 0);

        // === Propiedades ===
        this.velocidad = 225;
        this.salto = -500;
        this.gravedadBaja = -400;
        this.currentAngle = { x: 1, y: 0 };
        this.lenguaCooldown = false; // Evita mantener presionado
        this.flipActual = false;

        // === Controles de teclado ===
        this.scene.cursors = this.scene.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,A,D,L,T");

        // === Gamepads ===
        this.gamepadController = new GamePadController(this.scene);
        this.gamepads = this.gamepadController.getGamepads();
        this.getInput = this.gamepadController.getInput()
    }

    update() {
        if (!this.body) return;

        this.setVelocityX(0);

        this.gamepadController.update();
        this.getInput = this.gamepadController.getInput();

        // === Saltar (teclado o botón A de cualquier mando) ===
        const saltoTeclado = this.scene.cursors.L.isDown;

        if (this.scene.cursors.D.isDown || this.getInput.joy1.x > 0.1) {
            this.setVelocityX(this.velocidad);
            this.currentAngle = {x: 1, y: 0};
            this.scene.angulo = "E"
            this.flipActual = false;
            if (this.body.onFloor()) {
                this.animacionActual = "CaminarE"
            };
        } else if (this.scene.cursors.A.isDown || this.getInput.joy1.x < -0.1) {
            this.setVelocityX(-this.velocidad);
            this.currentAngle = {x: -1, y: 0};
            this.scene.angulo = "O"
            this.flipActual = true;
            if (this.body.onFloor()) {
                this.animacionActual = "CaminarE"
            };
        };

        if(this.scene.cursors.UP.isDown || this.getInput.joy2.y < -0) {
            this.currentAngle = {x: 0, y: -1}
            this.scene.angulo = "N";
        } else if (this.scene.cursors.DOWN.isDown || this.getInput.joy2.y > 0.2) {
            this.currentAngle = {x: 0, y: 1}
            this.scene.angulo = "S"
        } else {
            this.currentAngle.y = 0;        
        };

        if(this.scene.cursors.RIGHT.isDown || this.getInput.joy2.x > 0.2) {
            this.currentAngle = {x: 1, y: 0};
            if(this.scene.cursors.UP.isDown || this.getInput.joy2.y < -0.2) {
                this.currentAngle = {x: 0.7, y: -0.7};
            } else if (this.scene.cursors.DOWN.isDown || this.getInput.joy2.y > 0.2) {
                this.currentAngle = {x: 0.7, y: 0.7};
            };
        } else if (this.scene.cursors.LEFT.isDown || this.getInput.joy2.x < -0.2) {
            this.currentAngle = {x: -1, y: 0}
            if(this.scene.cursors.UP.isDown || this.getInput.joy2.y < -0.2) {
                this.currentAngle = {x: -0.7, y: -0.7};
            } else if (this.scene.cursors.DOWN.isDown || this.getInput.joy2.y > 0.2) {
                this.currentAngle = {x: -0.7, y: 0.7};
            };
        };
        
        if (this.currentAngle.x > 0 && this.body.velocity.x < 0) {
            this.animacionActual = "CaminarO";
            this.scene.angulo = "O"
        } else if (this.currentAngle.x < 0 && this.body.velocity.x > 0) {
            this.animacionActual = "CaminarO";
            this.scene.angulo = "E"
        };

        if (this.currentAngle.y > 0) {
            if (this.currentAngle.x > 0) {
                this.animacionActual = "CaminarSE";
                this.scene.angulo = "SE"
                if(this.body.velocity.x < 0) {
                    this.scene.angulo = "SE"
                    this.animacionActual = "CaminarSO";
                };
            } else if (this.currentAngle.x < 0) {
                this.animacionActual = "CaminarSO";
                this.scene.angulo = "SO"
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarSE";
                    this.scene.angulo = "SO"
                };
            }
        } else if (this.currentAngle.y < 0) {
            if (this.currentAngle.x > 0) {
                this.animacionActual = "CaminarNE";
                this.scene.angulo = "NE"
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarNO";
                    this.scene.angulo = "NE"
                };
            } else if (this.currentAngle.x < 0) {
                this.animacionActual = "CaminarNO";
                this.scene.angulo = "NO"
                if(this.body.velocity.x < 0) {
                    this.animacionActual = "CaminarNE";
                    this.scene.angulo = "NO"
                };
            }
        };

        if (this.currentAngle.y < 0 && this.currentAngle.x === 0) {
            this.animacionActual = "CaminarN";
            this.scene.angulo = "N"
        } else if (this.currentAngle.y > 0 && this.currentAngle.x === 0) {
            this.animacionActual = "CaminarS";
            this.scene.angulo = "S"
        }

        // === Disparo de lengua (solo un toque) ===
        const disparoTeclado = Phaser.Input.Keyboard.JustDown(this.scene.cursors.T);

        // Evita mantener presionado
        if ((disparoTeclado || this.getInput.joy1.accion === true) && this.scene.lengua.getLenguaOut() === false && (this.currentAngle.x !== 0 || this.currentAngle.y !== 0)) {
            this.scene.inputLengua = true;
            this.lenguaCooldown = true;
        } else {
            this.scene.inputLengua = false;
        }

        // === Activación anims ===
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0 && this.scene.cursors.D.isUp && this.scene.cursors.A.isUp) {
            if (this.currentAngle.x === 0 && this.currentAngle.y === 0) {
                this.animacionActual = "Idle";
                this.flipActual = false;
            } else if (this.currentAngle.x > 0 && this.currentAngle.y === 0) {
                this.animacionActual = "IdleO";
                this.flipActual = true;
            } else if (this.currentAngle.x < 0 && this.currentAngle.y === 0) {
                this.animacionActual = "IdleO"
                this.flipActual = false;
            } else if (this.currentAngle.y > 0) {
                if (this.currentAngle.x === 0) {
                    this.animacionActual = "IdleS";
                    this.flipActual = false;
                } else if (this.currentAngle.x > 0) {
                    this.animacionActual = "IdleSO";
                    this.flipActual = true;
                } else if (this.currentAngle.x < 0) {
                    this.animacionActual = "IdleSO";
                    this.flipActual = false;
                };
            } else if (this.currentAngle.y < 0) {
                if (this.currentAngle.x === 0) {
                    this.animacionActual = "IdleN";
                    this.flipActual = false;
                } else if (this.currentAngle.x > 0) {
                    this.animacionActual = "IdleNO";
                    this.flipActual = true;
                } else if (this.currentAngle.x < 0) {
                    this.animacionActual = "IdleNO";
                    this.flipActual = false;
                };
            };
        };


        if ((saltoTeclado || this.getInput.joy2.accion === true) && this.body.onFloor()) {
            this.setVelocityY(this.salto);
            this.animacionActual = "Salto inicio";

            if (this._canPlayJumpSound) {
                try {
                    if (this.scene && this.scene.sound) {
                        const inst = this.scene.sound.get('salto');
                        if (inst) inst.play();
                        else this.scene.sound.play('salto');
                    }
                } catch (e) {}
                this._canPlayJumpSound = false;
            }
        } else if ((saltoTeclado || this.getInput.joy2.accion === true) && !this.body.onFloor()) {
            this.setGravityY(this.gravedadBaja);
        } else {
            this.setGravityY(0);
        }

        if (this.body.onFloor() && !(saltoTeclado || this.getInput.joy2.accion === true)) {
            this._canPlayJumpSound = true;
        }

        if (!this.body.onFloor()) {
            if (this.body.velocity.y < 0) {
                this.animacionActual = "Salto subida";
            } else if (this.body.velocity.y > 0) {
                this.animacionActual = "Salto bajada";
            }
        }
        this.animController.playAnim(this.animacionActual, this.flipActual, this.scene.angulo);
        if (this.getInput.joy1.restart === true || this.getInput.joy2.restart === true) {
            this.setTint(0xFF0000)
            if (this.getInput.joy1.restart === true && this.getInput.joy2.restart === true) {
                this.scene.reinicio();
            }
        } else if (this.getInput.joy1.restart === false && this.getInput.joy2.restart === false) {
            this.clearTint();
        }
    }

    getCurrentAngle() {
        return { x: this.currentAngle.x, y: this.currentAngle.y };
    }

    getInputLengua() {
        return this.scene.inputLengua;
    }
}
