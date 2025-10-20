import { Scene } from 'phaser';
import Reticle from "../objects/versus/Reticula.js";
import Personaje from "../objects/versus/Personaje.js";
import MoscaPool from "../objects/versus/MoscaPool.js";
import WeaponManager from "../objects/versus/WeaponManager.js";
import ScoreManager from '../objects/versus/ScoreManager.js';
import MoscaDoradaPool from '../objects/versus/MoscaDoradaPool.js';
import RoundManager from "../objects/versus/RoundManager.js";
import ModificadorManager from "../objects/versus/ModificadorManager.js";
import GamePadController from '../utils/GamepadController.js';

function keyToInternalName(key) {
  switch (key) {
    case "pantalla_invertida": return "pantallaInvertida";
    case "moscas_pequeñas": return "moscasPequeñas";
    case "moscas_rapidas": return "moscasRapidas";
    case "moscas_fantasmas": return "moscasFantasmas";
    case "reticulas_lentas": return "reticulasLentas";
    case "reticulas_rapidas": return "reticulasRapidas";
    default: return key;
  }
}


export class Versus extends Scene {
  constructor() {
    super('Versus');
    this.prevPad1Pressed = false;
    this.prevPad2Pressed = false;
  }

  create() {
    this.add.image(480, 270, 'fondo');

    //crear camara
    this.cameras.main.setBounds(0, 0, 960, 540);

    //agregar un suelo 
    const suelo = this.add.rectangle(480, 540, 960, 80, 0x8a8a8a);

    // Crear manejadores
    this.roundManager = new RoundManager(this, 30000, 3);
    this.modManager = new ModificadorManager(this);

    // HUD simple
    const centerX = this.scale.width / 2;
    const timerY = 35;

    // Timer y fondo
    this.timerText = this.add.text(centerX + 2, timerY, "00", {
      fontFamily: "PIXELYA",
      fontSize: "54px",
      color: "#ff0000"
      }).setOrigin(0.5); 
    this.timerText.setDepth(0.2);

    this.pantallaTimer = this.add.rectangle(centerX, 20, 120, 100, 0x000000)
      .setAlpha(0.9)
      .setDepth(0.1)
      .setOrigin(0.5);

    // --- LUCES DE RONDA ---
    this.rondaLights = [];
    const lightsY = timerY + 60; 
    const lightsSpacing = 40;
    for (let i = 0; i < 3; i++) {
      const x = centerX + lightsSpacing * (i - 1); 
      const circle = this.add.circle(x, lightsY, 10, 0x444444)
        .setStrokeStyle(2, 0xffffff)
        .setDepth(0.3);
      this.rondaLights.push(circle);
    }

        // Retículas
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

    // Personajes
    this.rana = new Personaje(this, 325, 480, 0x00ff00, this.reticle1, "Q", 'player1');
    this.rata = new Personaje(this, 650, 480, 0xaaaaaa, this.reticle2, "P", 'player2');

    // Managers de armas
    this.weaponRana = new WeaponManager(this, this.rana, this.reticle1, 0x00ff00);
    this.weaponRata = new WeaponManager(this, this.rata, this.reticle2, 0x808080);

    this.disparoHold = {
      p1: false,
      p2: false
    };

    // Pools de moscas
    this.moscaPool = new MoscaPool(this, 25);
    this.moscaDoradaPool = new MoscaDoradaPool(this, 5);

    // Controles de disparo
    this.input.keyboard.on("keydown_Q", () => this.weaponRana.shoot());
    this.input.keyboard.on("keydown_P", () => this.weaponRata.shoot());
    
    // Guardar referencia a los gamepads
    this.gamepadController = new GamePadController(this);
    this.gamepads = this.gamepadController.getGamepads();
    this.getInput = this.gamepadController.getInput();

    // ScoreManager
    this.scoreManager = new ScoreManager(this);

    this.time.delayedCall(100, () => {
  this.scoreManager.updateUI('player1');
  this.scoreManager.updateUI('player2');
  });

    // Animaciones
    this.anims.create({
      key: 'mosca_fly',
      frames: this.anims.generateFrameNumbers('mosca spritesheet', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'mosca_fly_golden',
      frames: this.anims.generateFrameNumbers('mosca dorada spritesheet', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'rana_disparo_anim',
      frames: this.anims.generateFrameNumbers('rana disparo', { start: 0, end: 8 }),
      frameRate: 9,
      repeat: 0
    });
    this.anims.create({
      key: 'rata_disparo_anim',
      frames: this.anims.generateFrameNumbers('rata disparo', { start: 0, end: 8 }),
      frameRate: 9,
      repeat: 0
    });

    // Bloquear inputs hasta que empiece la ronda
    this.gameplayEnabled = false;

    // Registrar teclas para ambos jugadores
    this.cursors = this.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,W,A,S,D,Q,K");

    // --- EVENTOS DEL ROUND MANAGER ---
    this.events.on("roundStart", ({ round, maxRounds }) => {
      this.timerText.setText("60");
      this.gameplayEnabled = true;
      this.modManager.aplicarModificadoresActivos();
      if (this.moscaPool?.resume) this.moscaPool.resume();

      // Actualiza las luces de ronda (de izquierda a derecha)
      for (let i = 0; i < this.rondaLights.length; i++) {
        if (i < round) {
          this.rondaLights[i].setFillStyle(0xffd700); // Encendida (amarillo/dorado)
        } else {
          this.rondaLights[i].setFillStyle(0x444444); // Apagada (gris)
        }
      }
    });

    this.events.on("roundTick", ({ seconds }) => {
  const formatted = seconds < 10 ? `0${seconds}` : `${seconds}`;
  this.timerText.setText(formatted);
});

    this.events.on("roundEnd", ({ round }) => {
      this.timerText.setText("00");
      this.gameplayEnabled = false;
      if (this.moscaPool?.pause) this.moscaPool.pause();

      this.showRoundBanner(`Ronda ${round} finalizada`);

      if (round < this.roundManager.maxRounds) {
        this.mostrarRuletaModificadores(round + 1);
      }
    });

    this.events.on("roundsComplete", () => {
      this.gameplayEnabled = false;
      this.endGameSequence();
    });

    this.events.on('shutdown', this.shutdown, this);

    // Iniciar todas las rondas
    this.roundManager.startAll();
  }

  update(time, delta) {

    this.gamepadController.update();
    this.getInput = this.gamepadController.getInput();

    if (this.disparoHold.p1 === true && (this.getInput.joy1.accion === false && this.cursors.Q.isUp)) this.disparoHold.p1 = false;
    if (this.disparoHold.p2 === true && (this.getInput.joy2.accion === false && this.cursors.K.isUp)) this.disparoHold.p2 = false;


    // --- Movimiento retícula jugador 1 ---
    let dx1 = 0, dy1 = 0;
    if (this.cursors.A.isDown || this.getInput.joy1.x < -0.2) dx1 -= 1;
    if (this.cursors.D.isDown || this.getInput.joy1.x > 0.2) dx1 += 1;
    if (this.cursors.W.isDown || this.getInput.joy1.y < -0.2) dy1 -= 1;
    if (this.cursors.S.isDown || this.getInput.joy1.y > 0.2) dy1 += 1;

    const velocidad1 = (this.reticle1.speed || 10) * (this.velocidadReticula ?? 1) * (delta / 1000);

    // Teclado
    this.reticle1.x = Phaser.Math.Clamp(this.reticle1.x + dx1 * velocidad1, this.reticle1.minX, this.reticle1.maxX);
    this.reticle1.y = Phaser.Math.Clamp(this.reticle1.y + dy1 * velocidad1, this.reticle1.minY, this.reticle1.maxY);

    // --- Movimiento retícula jugador 2 ---
    let dx2 = 0, dy2 = 0;
    if (this.cursors.LEFT.isDown || this.getInput.joy2.x < -0.2) dx2 -= 1;
    if (this.cursors.RIGHT.isDown || this.getInput.joy2.x > 0.2) dx2 += 1;
    if (this.cursors.UP.isDown || this.getInput.joy2.y < -0.2) dy2 -= 1;
    if (this.cursors.DOWN.isDown || this.getInput.joy2.y > 0.2) dy2 += 1;

    const velocidad2 = (this.reticle2.speed || 200) * (this.velocidadReticula ?? 1) * (delta / 1000);

    // Teclado
    this.reticle2.x = Phaser.Math.Clamp(this.reticle2.x + dx2 * velocidad2, this.reticle2.minX, this.reticle2.maxX);
    this.reticle2.y = Phaser.Math.Clamp(this.reticle2.y + dy2 * velocidad2, this.reticle2.minY, this.reticle2.maxY);

    

    // --- Disparo jugador 1 ---
    const shootKey1 = this.cursors.Q;
    const shootKey2 = this.cursors.K;

    // Teclado
    if (Phaser.Input.Keyboard.JustDown(shootKey1) && this.disparoHold.p1 === false) {
      this.weaponRana.shoot();
      this.disparoHold.p1 = true;
    }
    if (Phaser.Input.Keyboard.JustDown(shootKey2) && this.disparoHold.p2 === false) {
      this.weaponRata.shoot();
      this.disparoHold.p1 = true;
    }

    // Gamepad
    if (this.getInput.joy1.accion === true && this.disparoHold.p1 === false) {
      this.weaponRana.shoot();
      this.disparoHold.p1 = true;
    }

    if (this.getInput.joy2.accion === true && this.disparoHold.p2 === false) {
      this.weaponRata.shoot();
      this.disparoHold.p2 = true;
    }

    this.reticle1.update(time, delta);
    this.reticle2.update(time, delta);
    this.roundManager.update(time, delta);

    this.rana.update(time, delta, this.moscaPool, this.moscaDoradaPool);
    this.rata.update(time, delta, this.moscaPool, this.moscaDoradaPool);
    this.moscaPool.update(time, delta);
    this.moscaDoradaPool.update(time, delta);

    this.weaponRana.update(this.moscaPool, this.moscaDoradaPool);
    this.weaponRata.update(this.moscaPool, this.moscaDoradaPool);
  }

  showRoundBanner(text) {
    const b = this.add.text(this.scale.width / 2, 80, text, { fontSize: "28px", color: "#ff0" }).setOrigin(0.5);
    this.tweens.add({
      targets: b,
      alpha: { from: 1, to: 0 },
      duration: 1500,
      ease: "Power2",
      onComplete: () => b.destroy()
    });
  }

  endGameSequence() {
    console.log("🏁 Rondas finalizadas. Mostrar resultados o pantalla final.");

    // Obtén los scores
    const scores = this.scoreManager.getScores();

    // Determina el ganador
    let winner = 'empate';
    if (scores.player1 > scores.player2) winner = 'rana';
    else if (scores.player2 > scores.player1) winner = 'rata';

    // Envía los datos a la escena final
    this.scene.start('VersusFinal', {
      winner,
      frogFlies: scores.player1,
      ratFlies: scores.player2,
      scores
    });
  }

  mostrarRuletaModificadores(proximaRonda) {
  const posiblesMods = this.modManager.todosLosModificadores;

  this.scene.launch('ModificadorRuleta', {
    modificadores: posiblesMods,
    onResultado: (elegido) => {
      const internalName = keyToInternalName(elegido.key);
      if (!this.modManager.modificadoresActivos.includes(internalName)) {
        this.modManager.modificadoresActivos.push(internalName);
      }
      this.modManager.aplicarModificadoresActivos();
      this.scene.stop('ModificadorRuleta');
      this.roundManager.startNextRound(proximaRonda);
    }
  });
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


