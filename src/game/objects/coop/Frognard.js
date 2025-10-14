import Phaser from 'phaser';

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

        //Controles teclado
        this.scene.cursors = this.scene.input.keyboard.addKeys ("UP, DOWN, LEFT, RIGHT, ,A ,D, L, T");

        //Controles gamepad
        this.joystick = null;
        this.input.gamepad.on('connected', pad => {
            this.joystick = pad;
        });
        this.input.gamepad.on("down", pad => {
            if (this.joystick === null) {
                this.joystick = pad;
            }
        })     
    }
      
    
    update() {
        this.setVelocityX (0);

        if (this.scene.cursors.D.isDown || this.joystick?.axes[0].getValue()  > 0.1) {
            this.setVelocityX(this.velocidad);
            this.currentAngle = {x: 1, y: 0};
        };
        if (this.scene.cursors.A.isDown || this.joystick?.axes[0].getValue()  < -0.1) {
            this.setVelocityX(-this.velocidad);
            this.currentAngle = {x: -1, y: 0};
        };
        if (this.scene.cursors.L.isDown && this.body.onFloor()) {
            this.setVelocityY(this.salto);
        } else if (this.scene.cursors.L.isDown && !this.body.onFloor()) {
            this.setGravityY(this.gravedadBaja);
        } else {
            this.setGravityY(0);
        };

        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.T)) {
            this.scene.inputLengua = true
        } else {
            this.scene.inputLengua = false
        };

        if (this.scene.cursors.RIGHT.isDown && this.scene.cursors.UP.isDown && this.scene.cursors.DOWN.isUp){
            this.currentAngle = {x: Math.sqrt(1), y: -Math.sqrt(1)};
        } else if (this.scene.cursors.LEFT.isDown && this.scene.cursors.UP.isDown && this.scene.cursors.DOWN.isUp){
            this.currentAngle = {x: -Math.sqrt(1), y: -Math.sqrt(1)};
        }  else if (this.scene.cursors.RIGHT.isDown && this.scene.cursors.UP.isUp && this.scene.cursors.DOWN.isDown){
            this.currentAngle = {x: Math.sqrt(1), y: Math.sqrt(1)};
        }  else if (this.scene.cursors.LEFT.isDown && this.scene.cursors.UP.isUp && this.scene.cursors.DOWN.isDown){
            this.currentAngle = {x: -Math.sqrt(1), y: Math.sqrt(1)};
        } else if (this.scene.cursors.UP.isDown && this.scene.cursors.RIGHT.isUp && this.scene.cursors.LEFT.isUp){
            this.currentAngle = {x: 0, y: -1};
        } else if (this.scene.cursors.DOWN.isDown && this.scene.cursors.RIGHT.isUp && this.scene.cursors.LEFT.isUp){
            this.currentAngle = {x: 0, y: 1};
        } else if (this.scene.cursors.RIGHT.isDown && this.scene.cursors.UP.isUp && this.scene.cursors.DOWN.isUp){
            this.currentAngle = {x: 1, y: 0};
        } else if (this.scene.cursors.LEFT.isDown && this.scene.cursors.UP.isUp && this.scene.cursors.DOWN.isUp){
            this.currentAngle = {x: -1, y: 0};
        };
    }

    getCurrentAngle() {
        return {x: this.currentAngle.x, y:this.currentAngle.y};
    }

    getInputLengua() {
        return this.scene.inputLengua
    }
}