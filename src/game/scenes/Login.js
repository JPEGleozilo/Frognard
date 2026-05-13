import Phaser from 'phaser';
import GamePadController from '../utils/GamepadController';
import { getPhrase } from '../../services/translations';

export default class Login extends Phaser.Scene {
  constructor() {
    super("Login");
  }

  create() {
    // agregar un texto "Login" en la parte superior de la pantalla

    this.add.sprite(480, 270, 'fondo2').setScale(0.5).setDepth(-2); 

    this.loginTexto = this.add
      .text(480, 100, "Login", {
        fontSize: 48,
        color: 'rgb(75, 90, 206)',
        stroke: 'rgb(79, 128, 212)',
        strokeThickness: 8,
        align: 'center'
    })
    .setOrigin(0.5);
    // agregar un texto Ingresar con Email y contraseña que al hacer clic me levante un popup js para ingresar los datos
    this.emailTexto = this.add.text(480, 250, "Ingresar con Email y contraseña", {
        fontFamily: '"VT323", monospace',
        fontSize: 38,
        color: '#7deeffff',
        stroke: '#399295ff',
        strokeThickness: 8,
        align: 'center'
    })
    .setOrigin(0.5).setAlpha(1)

    // Agregar un texto "Ingresas de forma Anonima" que al hacer clic me levante un popup js para ingresar los datos
    this.anonTexto = this.add.text(480, 350, "Ingresar de forma Anonima", {
        fontFamily: '"VT323", monospace',
        fontSize: 38,
        color: '#444343ff',
        stroke: '#4e4e4eff',
        strokeThickness: 8,
        align: 'center'
    })
    .setOrigin(0.5).setAlpha(0.75)

    this.eleccionActual = 'Email'

    this.gamepadController = new GamePadController(this);
    this.gamepads = this.gamepadController.getGamepads();
    this.getInput = this.gamepadController.getInput()
    }

    update () {

        this.gamepadController.update();
        this.getInput = this.gamepadController.getInput();

        this.cursor = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

            if ((this.cursor.up.isDown || (this.getInput.joy1.y  < -0.2 || this.getInput.joy2.y < -0.2)) && this.state != "Email"){
                this.eleccionActual = "Email";
            } else if ((this.cursor.down.isDown || (this.getInput.joy1.y  > 0.2 || this.getInput.joy2.y > 0.2)) && this.state != "Anon"){
                this.eleccionActual = "Anon";
            }

            if (this.enter.isDown || (this.getInput.joy1.accion === true || this.getInput.joy2.accion === true)) {
                if (this.eleccionActual === 'Email') {
                    const email = prompt("Email");
                    const password = prompt("Password");
                    this.firebase.signInWithEmail(email, password)
                    .then(() => {
                    this.scene.start("MainMenu");
                })
                .catch(() => {
                    const crearUsuario = window.confirm(
                    "Email no encontrado. \n ¿Desea crear un usuario?"
                    );
                    if (crearUsuario) {
                        this.firebase
                        .createUserWithEmail(email, password)
                        .then(() => {
                            this.scene.start("MainMenu");
                        })
                        .catch((createUserError) => {
                            console.log(
                            "🚀 ~ file: Login.js:120 ~ .catch ~ error",
                            createUserError
                            );
                        });
                    }
                });
                }else if (this.eleccionActual === 'Anon') {
                    this.firebase
                    .signInAnonymously()
                    .then(() => {
                        this.scene.start("MainMenu");
                    })
                    .catch((error) => {
                        console.log("🚀 ~ file: Login.js:74 ~ .catch ~ error", error);
                    });
                }
            }

        if (this.eleccionActual === 'Email') {
            this.emailTexto.setColor('#7deeffff').setStroke('#399295ff').setAlpha(1).setFontSize(48);
            this.anonTexto.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.75);
        } else if (this.eleccionActual === 'Anon') {
            this.anonTexto.setColor('#7deeffff').setStroke('#399295ff').setAlpha(1).setFontSize(48);
            this.emailTexto.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.75);
        }
    }
}