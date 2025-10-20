import { Scene } from 'phaser';
import GamePadController from '../utils/GamepadController';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(480, 270, 'fondo').setDepth(-1)     
        this.add.image(600/1.3 , 300/2, 'logo');

        this.cursor = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.state = "neutral";

        // Posiciones de los textos
        const coopX = 960/3;
        const vsX = (960/3)*2;
        const textY = 400;

        // Agrega los iconos arriba de los textos y guarda las referencias
        this.frognardIcon = this.add.image(coopX, textY - 40, 'frognard').setOrigin(0.5, 1).setScale(1.5).setDepth(1);
        this.ranaIcon = this.add.image(vsX - 30, textY - 40, 'rana').setOrigin(0.5, 1).setScale(2).setDepth(2);
        this.rataIcon = this.add.image(vsX + 30, textY - 40, 'rata').setOrigin(0.5, 1).setScale(2).setDepth(1);

        this.coopText = this.add.text(coopX, textY, 'COOPERATIVO', {
            fontFamily: '"VT323", monospace',
            fontSize: 38,
            color: '#1fd70eff',
            stroke: '#536066ff',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.vsText = this.add.text(vsX, textY, 'VERSUS', {
            fontFamily: '"VT323", monospace',
            fontSize: 38,
            color: '#536066ff',
            stroke: '#1fd70eff',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.inputRecieve = false

        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.inputRecieve = true
            },
            loop: false
        });

        this.gamepadController = new GamePadController(this);
        this.gamepads = this.gamepadController.getGamepads();
        this.getInput = this.gamepadController.getInput()

    }

    update () {
        //estado para los assets de la rata y la rana cuando no estan seleccionados 
        if (this.state === "neutral") {
            this.vsText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.coopText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.frognardIcon.setAlpha(0.5);
            this.ranaIcon.setAlpha(0.5);
            this.rataIcon.setAlpha(0.5);
        }

        this.gamepadController.update();
        this.getInput = this.gamepadController.getInput();

        if(this.inputRecieve === true) {
            // Cambia el estado basado en la entrada del cursor
            if ((this.cursor.right.isDown || (this.getInput.joy1.x  > 0.2 || this.getInput.joy2.x > 0.2)) && this.state != "vs"){
                this.state = "vs";
            } else if ((this.cursor.left.isDown || (this.getInput.joy1.x  < -0.2 || this.getInput.joy2.x < -0.2)) && this.state != "coop"){
                this.state = "coop";
            }
            //estado para los assets de la rata y la rana cuando no estan seleccionados 
            if (this.cursor.left.isUp && this.cursor.right.isUp && this.state === "neutral") {
                this.state = "coop"; // Por defecto, selecciona "coop"
            }
            
            if (this.enter.isDown || (this.getInput.joy1.accion === true || this.getInput.joy2.accion === true)) {
                if (this.state === "coop") {
                    this.scene.start("Coop");
                } else if (this.state === "vs") {
                    this.scene.start("Versus")
                };
            };
        }

        // Usar una variable para guardar el tamaño actual
        if (!this.vsFontSize) this.vsFontSize = 38;
        if (!this.coopFontSize) this.coopFontSize = 38;

        if (this.state === "vs" && this.vsFontSize !== 48) {
            this.vsText.setColor("#7deeffff").setStroke("#399295ff").setFontSize(44).setAlpha(1);
            this.vsFontSize = 48;
            this.coopText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.coopFontSize = 38;
        } else if (this.state === "coop" && this.coopFontSize !== 48) {
            this.coopText.setColor("#7deeffff").setStroke("#399295ff").setFontSize(44).setAlpha(1);
            this.coopFontSize = 48;
            this.vsText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.vsFontSize = 38;
        };

        // Cambia la transparencia según el estado seleccionado
        if (this.state === "coop") {
            this.frognardIcon.setAlpha(1);
            this.ranaIcon.setAlpha(0.5);
            this.rataIcon.setAlpha(0.5);
            this.coopText.setAlpha(1);
            this.vsText.setAlpha(0.5);
        } else if (this.state === "vs") {
            this.frognardIcon.setAlpha(0.5);
            this.ranaIcon.setAlpha(1);
            this.rataIcon.setAlpha(1);
            this.coopText.setAlpha(0.5);
            this.vsText.setAlpha(1);
        }
    }
    shutdown() {
        if (this.gamepads && this.gamepads.joystick1) {
            this.gamepads.joystick1.removeAllListeners();
        }
        if (this.gamepads && this.gamepads.joystick2) {
            this.gamepads.joystick2.removeAllListeners();
        }
    }
}
