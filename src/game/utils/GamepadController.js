import Phaser  from "phaser";

export default class GamePadController{
    constructor(scene, joy1 = null, joy2 = null){
        this.scene = scene
        this.joystick1 = joy1;
        this.joystick2 = joy2;

        this.inputValues = {
            joy1: {
                x: null,
                y: null,
                accion: null
            },
            joy2: {
                x: null,
                y: null,
                accion: null
            }};

        if (scene.input.gamepad && scene.input.gamepad.total > 0) {
            const pads = scene.input.gamepad.gamepads;
            this.joystick1 = pads[0] ?? null;
            this.joystick2 = pads[1] ?? null;
        };

        // Evento cuando se conecta un mando
        scene.input.gamepad.on('connected', (pad) => {
            if (this.joystick1 === null) {
                this.joystick1 = pad;
                console.log("Joystick 1 conectado:", pad.id);
            } else if (this.joystick2 === null) {
                this.joystick2 = pad;
                console.log("Joystick 2 conectado:", pad.id);
            } else {
                console.warn ("cantidad máxima de joysticks alcanzada");
            }
        });

        // Evento cuando se desconecta
        scene.input.gamepad.on('disconnected', (pad) => {
            if (this.joystick1 === pad) this.joystick1 = null;
            if (this.joystick2 === pad) this.joystick2 = null;
        });
    }

    update() {
        if(this.joystick1 || this.joystick2) {
            this.joy1x = this.joystick1?.axes?.[0]?.getValue?.() ?? 0;
            this.joy1y = this.joystick1?.axes?.[1]?.getValue?.() ?? 0;

            this.botonJoy1 = this.joystick1?.buttons?.[0]?.pressed ?? false;

            this.joy2x = this.joystick2?.axes?.[0]?.getValue?.() ?? 0;
            this.joy2y = this.joystick2?.axes?.[1]?.getValue?.() ?? 0;

            this.botonJoy2 = this.joystick2?.buttons?.[0]?.pressed ?? false;

             if (this.joystick1 === null) {
            this.inputValues.joy1 = {
                x: null,
                y: null,
                accion: null
            }
        } else {
            this.inputValues.joy1 = {
                x: this.joy1x,
                y: this.joy1y,
                accion: this.botonJoy1
            }};
        if (this.joystick2 === null) {
            this.inputValues.joy2 = {
                x: null,
                y: null,
                action: null
            }
        } else {
            this.inputValues.joy2 = {
                x: this.joy2x,
                y: this.joy2y,
                accion: this.botonJoy2
            }};
        }
    }

    getGamepads() {
        if(this.joystick1 === null && this.joystick2 === null) {
            return console.warn("no hay joysticks conectados");
        } else {
            return this.joystick1, this.joystick2;
        }
    }

    getInput() {
        return this.inputValues;
    }
}