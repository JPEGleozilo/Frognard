import Phaser from 'phaser';
import InputSystem from '../../utils/InputSystem';

export default class Frognard extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'frognard');

        //Existencia
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Físicas
        this.setOrigin(0.5, 0.75);
        this.setCollideWorldBounds(true);
        this.setCollisionCategory([1]);
        this.setCollidesWith([1, 2, 3]);
        this.body.setSize(this.width * 0.5, this.height - 4);
        this.body.setOffset(this.width * 0.25, 0);
        this.velocidad = 225;
        this.salto = -500;
        this.gravedadBaja = -400;
        this.currentAngle = {x: 1 ,y: 0};

        this.inputSystem = new InputSystem(this.input);
        this.inputSystem.configureKeyboard({
            [INPUT_ACTIONS.LEFT]: [Phaser.Input.Keyboard.KeyCodes.A],
            [INPUT_ACTIONS.RIGHT]: [Phaser.Input.Keyboard.KeyCodes.D],
            [INPUT_ACTIONS.SOUTH]: [Phaser.Input.Keyboard.KeyCodes.T]
        }, "player1");
        this.inputSystem.configureKeyboard({
            [INPUT_ACTIONS.UP]: [Phaser.Input.Keyboard.KeyCodes.UP],
            [INPUT_ACTIONS.DOWN]: [Phaser.Input.Keyboard.KeyCodes.DOWN],
            [INPUT_ACTIONS.LEFT]: [Phaser.Input.Keyboard.KeyCodes.LEFT],
            [INPUT_ACTIONS.RIGHT]: [Phaser.Input.Keyboard.KeyCodes.RIGHT],
            [INPUT_ACTIONS.SOUTH]: [Phaser.Input.Keyboard.KeyCodes.L]
        }, "player2");
    }
      
    
    update() {
        this.setVelocityX (0);

        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.RIGHT, "player1")) {
            this.setVelocityX(this.velocidad);
            this.currentAngle = {x: 1, y: 0};
        };
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.LEFT, "player1")) {
            this.setVelocityX(-this.velocidad);
            this.currentAngle = {x: -1, y: 0};
        };
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player2") && this.body.onFloor()) {
            this.setVelocityY(this.salto);
        } else if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player2") && !this.body.onFloor()) {
            this.setGravityY(this.gravedadBaja);
        } else {
            this.setGravityY(0);
        };

        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player1")) {
            this.scene.inputLengua = true
        } else {
            this.scene.inputLengua = false
        };

        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.RIGHT, "player2")){
            this.currentAngle.x = 1;
            if (this.currentAngle.y != 0){
                this.currentAngle.x = Math.sqrt(1)
            };
        } else if (this.inputSystem.isJustPressed(INPUT_ACTIONS.LEFT, "player2")){
            this.currentAngle.x = -1;
            if (this.currentAngle.y != 0){
                this.currentAngle.x = -Math.sqrt(1)
            };
        }

        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.UP, "player2")){
            this.currentAngle.y = -1;
            if (this.currentAngle.x != 0){
                this.currentAngle.y = -Math.sqrt(1)
            };
        } else if (this.inputSystem.isJustPressed(INPUT_ACTIONS.DOWN, "player2")){
            this.currentAngle.y = 1;
            if (this.currentAngle.x != 0){
                this.currentAngle.y = Math.sqrt(1)
            };
        }

        this.currentAngle = {x: 0, y: 0};
    }

    getCurrentAngle() {
        return {x: this.currentAngle.x, y:this.currentAngle.y};
    }

    getInputLengua() {
        return this.scene.inputLengua
    }
}