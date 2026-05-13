import { Scene } from 'phaser';
import Reticle from "../objects/versus/Reticula.js";
import Personaje from "../objects/versus/Personaje.js";
import WeaponManager from "../objects/versus/WeaponManager.js";
import ScoreManager from '../objects/versus/ScoreManager.js';
import MoscaPool from "../objects/versus/MoscaPool.js";
import MoscaDoradaPool from '../objects/versus/MoscaDoradaPool.js';
import MoscaImpostorPool from '../objects/versus/MoscaImpostorPool.js';
import RoundManager from "../objects/versus/RoundManager.js";
import ModificadorManager from "../objects/versus/ModificadorManager.js";
import GamePadController from '../utils/GamepadController.js';
import { EventBus } from '../utils/EventBus.js';
import { crearAnimacionesVersus } from '../utils/AnimacionesVersus.js';

export class Versus extends Scene {
    constructor() {
        super('Versus');
    }

    create() {
        this.scene.launch('VersusUI');
        this.add.image(480, 270, 'fondo_versus');
        this.cameras.main.setBounds(0, 0, 960, 540);

        this.roundManager = new RoundManager(this, 30000, 3);
        this.modManager = new ModificadorManager(this);

        this.reticle1 = new Reticle(this, 200, 80, 0x00ff00, {
            left: this.input.keyboard.addKey("A"),
            right: this.input.keyboard.addKey("D"),
            up: this.input.keyboard.addKey("W"),
            down: this.input.keyboard.addKey("S"),
        }, 'MiraRana');

        this.reticle2 = new Reticle(this, 700, 100, 0xaaaaaa, {
            left: this.input.keyboard.addKey("LEFT"),
            right: this.input.keyboard.addKey("RIGHT"),
            up: this.input.keyboard.addKey("UP"),
            down: this.input.keyboard.addKey("DOWN"),
        }, 'MiraRata');

        this.rana = new Personaje(this, 325, 480, 0x00ff00, this.reticle1, "T", 'player1');
        this.rata = new Personaje(this, 650, 480, 0xaaaaaa, this.reticle2, "L", 'player2');

        this.weaponRana = new WeaponManager(this, this.rana, this.reticle1, 0x00ff00);
        this.weaponRata = new WeaponManager(this, this.rata, this.reticle2, 0x808080);

        this.disparoHold = { p1: false, p2: false };

        this.moscaPool = new MoscaPool(this, 25);
        this.moscaDoradaPool = new MoscaDoradaPool(this, 5);
        this.moscaImpostorPool = new MoscaImpostorPool(this, 10);

        this.input.keyboard.on("keydown_Q", () => this.weaponRana.shoot());
        this.input.keyboard.on("keydown_P", () => this.weaponRata.shoot());

        this.gamepadController = new GamePadController(this);
        this.gamepads = this.gamepadController.getGamepads();
        this.getInput = this.gamepadController.getInput();

        this.scoreManager = new ScoreManager(this);
        this.time.delayedCall(100, () => {
            this.scoreManager.updateUI('player1');
            this.scoreManager.updateUI('player2');
        });

        crearAnimacionesVersus(this);

        this.gameplayEnabled = false;
        this.cursors = this.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,W,A,S,D,Q,K");

        this.events.on("roundStart", ({ round }) => {
            this.gameplayEnabled = true;
            this.modManager.aplicarModificadoresActivos();
            if (this.moscaPool?.resume) this.moscaPool.resume();
            EventBus.emit('roundStart', { round });
        });

        this.events.on("roundTick", ({ seconds }) => {
            EventBus.emit('timerTick', { seconds });
        });

        this.events.on("roundEnd", ({ round }) => {
            EventBus.emit('timerTick', { seconds: 0 });
            this.gameplayEnabled = false;
            if (this.moscaPool?.pause) this.moscaPool.pause();
            try { this.sound.play('ronda_terminada', { volume: 0.5 }); } catch (e) { }
            this.showRoundBanner('');
            if (round < this.roundManager.maxRounds) {
                this.mostrarRuletaModificadores(round + 1);
            }
        });

        this.events.on("roundsComplete", () => {
            this.gameplayEnabled = false;
            this.endGameSequence();
        });

        this.events.on('shutdown', this.shutdown, this);

        this.roundManager.startAll();

        try {
            this.versusMusic = this.sound.add('musica_versus', { loop: true, volume: 0.6 });
            this.versusMusic.play();
        } catch (e) { }
    }

    update(time, delta) {
        this.gamepadController.update();
        this.getInput = this.gamepadController.getInput();

        this._moverReticulas(delta);
        this._manejarDisparos();

        this.reticle1.update(time, delta);
        this.reticle2.update(time, delta);
        this.roundManager.update(time, delta);

        this.rana.update(time, delta, this.moscaPool, this.moscaDoradaPool, this.moscaImpostorPool);
        this.rata.update(time, delta, this.moscaPool, this.moscaDoradaPool, this.moscaImpostorPool);
        this.moscaPool.update(time, delta);
        this.moscaDoradaPool.update(time, delta);
        this.moscaImpostorPool.update(time, delta);

        this.weaponRana.update(this.moscaPool, this.moscaDoradaPool, this.moscaImpostorPool);
        this.weaponRata.update(this.moscaPool, this.moscaDoradaPool, this.moscaImpostorPool);
    }

    _moverReticulas(delta) {
        let dx1 = 0, dy1 = 0;
        if (this.cursors.A.isDown) dx1 -= 1;
        if (this.cursors.D.isDown) dx1 += 1;
        if (this.cursors.W.isDown) dy1 -= 1;
        if (this.cursors.S.isDown) dy1 += 1;
        if (this.getInput.joy1.x < -0.2) dx1 -= 2;
        if (this.getInput.joy1.x > 0.2) dx1 += 2;
        if (this.getInput.joy1.y < -0.2) dy1 -= 2;
        if (this.getInput.joy1.y > 0.2) dy1 += 2;
        const velocidad1 = (this.reticle1.speed || 10) * (this.velocidadReticula ?? 1) * (delta / 1000);
        this.reticle1.x = Phaser.Math.Clamp(this.reticle1.x + dx1 * velocidad1, this.reticle1.minX, this.reticle1.maxX);
        this.reticle1.y = Phaser.Math.Clamp(this.reticle1.y + dy1 * velocidad1, this.reticle1.minY, this.reticle1.maxY);

        let dx2 = 0, dy2 = 0;
        if (this.cursors.LEFT.isDown) dx2 -= 1;
        if (this.cursors.RIGHT.isDown) dx2 += 1;
        if (this.cursors.UP.isDown) dy2 -= 1;
        if (this.cursors.DOWN.isDown) dy2 += 1;
        if (this.getInput.joy2.x < -0.2) dx2 -= 2;
        if (this.getInput.joy2.x > 0.2) dx2 += 2;
        if (this.getInput.joy2.y < -0.2) dy2 -= 2;
        if (this.getInput.joy2.y > 0.2) dy2 += 2;
        const velocidad2 = (this.reticle2.speed || 200) * (this.velocidadReticula ?? 1) * (delta / 1000);
        this.reticle2.x = Phaser.Math.Clamp(this.reticle2.x + dx2 * velocidad2, this.reticle2.minX, this.reticle2.maxX);
        this.reticle2.y = Phaser.Math.Clamp(this.reticle2.y + dy2 * velocidad2, this.reticle2.minY, this.reticle2.maxY);
    }

    _manejarDisparos() {
        const shootKey1 = this.cursors.Q;
        const shootKey2 = this.cursors.K;

        if (this.disparoHold.p1 && this.getInput.joy1.accion === false && shootKey1.isUp) this.disparoHold.p1 = false;
        if (this.disparoHold.p2 && this.getInput.joy2.accion === false && shootKey2.isUp) this.disparoHold.p2 = false;

        if (Phaser.Input.Keyboard.JustDown(shootKey1) && !this.disparoHold.p1) {
            this.weaponRana.shoot();
            this.disparoHold.p1 = true;
        }
        if (Phaser.Input.Keyboard.JustDown(shootKey2) && !this.disparoHold.p2) {
            this.weaponRata.shoot();
            this.disparoHold.p2 = true;
        }
        if (this.getInput.joy1.accion === true && !this.disparoHold.p1) {
            this.weaponRana.shoot();
            this.disparoHold.p1 = true;
        }
        if (this.getInput.joy2.accion === true && !this.disparoHold.p2) {
            this.weaponRata.shoot();
            this.disparoHold.p2 = true;
        }
    }

    showRoundBanner(text) {
        const b = this.add.text(this.scale.width / 2, 80, text, { fontSize: "28px", color: "#ff0" }).setOrigin(0.5);
        this.tweens.add({
            targets: b,
            alpha: 0,
            duration: 1500,
            ease: "Power2",
            onComplete: () => b.destroy()
        });
    }

    endGameSequence() {
        const scores = this.scoreManager.getScores();
        let winner = 'empate';
        if (scores.player1 > scores.player2) winner = 'rana';
        else if (scores.player2 > scores.player1) winner = 'rata';
        this.scene.start('VersusFinal', {
            winner,
            frogFlies: scores.player1,
            ratFlies: scores.player2,
            scores
        });
    }

    mostrarRuletaModificadores(proximaRonda) {
        this.scene.pause('Versus');
        const todos = this.modManager.todosLosModificadores || [];
        const usados = this.modManager.modificadoresActivos || [];
        const disponibles = todos.filter(m => !usados.includes(m));
        const opciones = disponibles.length ? disponibles : todos;

        this.scene.launch('ModificadorRuleta', {
            modificadores: opciones,
            onResultado: (elegido) => {
                this.scene.resume('Versus');
                this.modManager.addModificador(elegido);
                this.scene.stop('ModificadorRuleta');
                this.roundManager.startNextRound(proximaRonda);
            },
            onCancel: () => {
                this.scene.resume('Versus');
                this.scene.stop('ModificadorRuleta');
            }
        });
    }

    shutdown() {
        this.scene.stop('VersusUI');
        EventBus.off('pantallaInvertida', this._onPantallaInvertida, this);
        if (this.gamepads?.joystick1) this.gamepads.joystick1.removeAllListeners();
        if (this.gamepads?.joystick2) this.gamepads.joystick2.removeAllListeners();
        if (this.versusMusic) {
            try {
                if (this.versusMusic.isPlaying) this.versusMusic.stop();
                this.versusMusic.destroy();
            } catch (e) { }
            this.versusMusic = null;
        }
    }
}