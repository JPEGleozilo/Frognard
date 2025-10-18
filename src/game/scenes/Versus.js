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
import { INPUT_ACTIONS } from "../utils/InputSystem.js";


const PLAYER_INPUTS = {
  player1: {
    [INPUT_ACTIONS.LEFT]: ["A"],
    [INPUT_ACTIONS.RIGHT]: ["D"],
    [INPUT_ACTIONS.UP]: ["W"],
    [INPUT_ACTIONS.DOWN]: ["S"],
    [INPUT_ACTIONS.SOUTH]: ["T", { type: "gamepad", index: 0 }]
  },
  player2: {
    [INPUT_ACTIONS.LEFT]: ["LEFT"],
    [INPUT_ACTIONS.RIGHT]: ["RIGHT"],
    [INPUT_ACTIONS.UP]: ["UP"],
    [INPUT_ACTIONS.DOWN]: ["DOWN"],
    [INPUT_ACTIONS.SOUTH]: ["L", { type: "gamepad", index: 0 }]
  }
};

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
    this.add.image(480, 270, 'fondo_versus');

    //crear camara
    this.cameras.main.setBounds(0, 0, 960, 540);

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
    this.rana = new Personaje(this, 325, 480, 0x00ff00, this.reticle1, "T", 'player1');
    this.rata = new Personaje(this, 650, 480, 0xaaaaaa, this.reticle2, "L", 'player2');

    // Managers de armas
    this.weaponRana = new WeaponManager(this, this.rana, this.reticle1, 0x00ff00);
    this.weaponRata = new WeaponManager(this, this.rata, this.reticle2, 0x808080);

    // Pools de moscas
    this.moscaPool = new MoscaPool(this, 25);
    this.moscaDoradaPool = new MoscaDoradaPool(this, 5);
    this.moscaImpostorPool = new MoscaImpostorPool(this, 10);

    // Controles de disparo
    this.input.keyboard.on("keydown_Q", () => this.weaponRana.shoot());
    this.input.keyboard.on("keydown_P", () => this.weaponRata.shoot());

    // Guardar referencia a los gamepads
    this.gamepad1 = null;
    this.gamepad2 = null;

    this.input.gamepad.on('connected', pad => {
      if (!this.gamepad1) {
        this.gamepad1 = pad;
        console.log("Gamepad 1 conectado:", pad.id);
      } else if (this.gamepad1) {
        this.gamepad2 = pad;
        console.log("Gamepad 2 conectado :", pad.id)
      };
    });

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
      frameRate: 7,
      repeat: 0
    });
    this.anims.create({
      key: 'rata_disparo_anim',
      frames: this.anims.generateFrameNumbers('rata disparo', { start: 0, end: 8 }),
      frameRate: 7,
      repeat: 0
    });
    this.anims.create({
      key: 'animacion_controles_vs',
      frames: this.anims.generateFrameNumbers('animacion_controles_vs', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    });
    // Bloquear inputs hasta que empiece la ronda
    this.gameplayEnabled = false;

    // Registrar teclas para ambos jugadores
    this.keys = {
      player1: {},
      player2: {}
    };

    Object.entries(PLAYER_INPUTS.player1).forEach(([action, inputs]) => {
      this.keys.player1[action] = inputs
        .filter(i => typeof i === "string")
        .map(k => this.input.keyboard.addKey(k));
    });
    Object.entries(PLAYER_INPUTS.player2).forEach(([action, inputs]) => {
      this.keys.player2[action] = inputs
        .filter(i => typeof i === "string")
        .map(k => this.input.keyboard.addKey(k));
    });

    // --- EVENTOS DEL ROUND MANAGER ---
    this.events.on("roundStart", ({ round, maxRounds }) => {
      this.timerText.setText("60");
      this.gameplayEnabled = true;
      this.modManager.aplicarModificadoresActivos();
      if (this.moscaPool?.resume) this.moscaPool.resume();

     // === PANEL DE INFORMACIÓN DE MOSCAS ===
    const panelX = this.cameras.main.width / 2;
    const panelY = 485;

    // === animacion controles versus a los lados==
    const animacionIzquierda = this.add.sprite(120, panelY + 20, 'animacion_controles_vs').setScale(1).setDepth(201);
    animacionIzquierda.play('animacion_controles_vs');
    const animacionDerecha = this.add.sprite(840, panelY + 20, 'animacion_controles_vs').setScale(1).setDepth(201);
    animacionDerecha.play('animacion_controles_vs');

    const fondoPanel = this.add.rectangle(panelX, panelY, 130, 100, 0x000000, 0.4)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0xffffff)
        .setDepth(200);

    const estiloTexto = {
        fontFamily: 'pixelFont',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
    };

    // Iconos + texto
    const baseY = panelY ;
    const espacio = 30;

    // Mosca normal
    const moscaNormal = this.add.sprite(panelX - 25, baseY - espacio, 'mosca spritesheet').setScale(1).setDepth(201);
    this.add.text(moscaNormal.x + 20, baseY - espacio, '=  + 1', estiloTexto).setOrigin(0, 0.5).setDepth(201);

    // Mosca dorada
    const moscaDorada = this.add.sprite(panelX - 25, baseY, 'mosca dorada spritesheet').setScale(1).setDepth(201);
    this.add.text(moscaDorada.x + 20, baseY, '=  + 5', estiloTexto).setOrigin(0, 0.5).setDepth(201);

    // Mosca impostora
    const moscaImpostor = this.add.sprite(panelX - 25, baseY + espacio, 'mosca_impostor').setScale(1).setDepth(201);
    this.add.text(moscaImpostor.x + 20, baseY + espacio, '=  - 3', estiloTexto).setOrigin(0, 0.5).setDepth(201);

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

      this.showRoundBanner(``);

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
    // --- Movimiento retícula jugador 1 ---
    let dx1 = 0, dy1 = 0;
    if (this.keys.player1[INPUT_ACTIONS.LEFT].some(k => k.isDown)) dx1 -= 1;
    if (this.keys.player1[INPUT_ACTIONS.RIGHT].some(k => k.isDown)) dx1 += 1;
    if (this.keys.player1[INPUT_ACTIONS.UP].some(k => k.isDown)) dy1 -= 1;
    if (this.keys.player1[INPUT_ACTIONS.DOWN].some(k => k.isDown)) dy1 += 1;

    const velocidad1 = (this.reticle1.speed || 10) * (this.velocidadReticula ?? 1) * (delta / 1000);

    // Teclado
    this.reticle1.x = Phaser.Math.Clamp(this.reticle1.x + dx1 * velocidad1, this.reticle1.minX, this.reticle1.maxX);
    this.reticle1.y = Phaser.Math.Clamp(this.reticle1.y + dy1 * velocidad1, this.reticle1.minY, this.reticle1.maxY);

    // Joystick izquierdo
    if (this.gamepad1) {
      const axisX = this.gamepad1.axes.length > 0 ? this.gamepad1.axes[0].getValue() : 0;
      const axisY = this.gamepad1.axes.length > 1 ? this.gamepad1.axes[1].getValue() : 0;
      const deadzone = 0.2;
      if (Math.abs(axisX) > deadzone) {
        this.reticle1.x = Phaser.Math.Clamp(this.reticle1.x + axisX * velocidad1 * 2, this.reticle1.minX, this.reticle1.maxX);
      }
      if (Math.abs(axisY) > deadzone) {
        this.reticle1.y = Phaser.Math.Clamp(this.reticle1.y + axisY * velocidad1 * 2, this.reticle1.minY, this.reticle1.maxY);
      }
    }

    // --- Movimiento retícula jugador 2 ---
    let dx2 = 0, dy2 = 0;
    if (this.keys.player2[INPUT_ACTIONS.LEFT].some(k => k.isDown)) dx2 -= 1;
    if (this.keys.player2[INPUT_ACTIONS.RIGHT].some(k => k.isDown)) dx2 += 1;
    if (this.keys.player2[INPUT_ACTIONS.UP].some(k => k.isDown)) dy2 -= 1;
    if (this.keys.player2[INPUT_ACTIONS.DOWN].some(k => k.isDown)) dy2 += 1;

    const velocidad2 = (this.reticle2.speed || 200) * (this.velocidadReticula ?? 1) * (delta / 1000);

    // Teclado
    this.reticle2.x = Phaser.Math.Clamp(this.reticle2.x + dx2 * velocidad2, this.reticle2.minX, this.reticle2.maxX);
    this.reticle2.y = Phaser.Math.Clamp(this.reticle2.y + dy2 * velocidad2, this.reticle2.minY, this.reticle2.maxY);

    // Joystick izquierdo
    if (this.gamepad2) {
      const axisX = this.gamepad2.axes.length > 0 ? this.gamepad2.axes[0].getValue() : 0;
      const axisY = this.gamepad2.axes.length > 1 ? this.gamepad2.axes[1].getValue() : 0;
      const deadzone = 0.2;
      if (Math.abs(axisX) > deadzone) {
        this.reticle2.x = Phaser.Math.Clamp(this.reticle2.x + axisX * velocidad2 * 2, this.reticle2.minX, this.reticle2.maxX);
      }
      if (Math.abs(axisY) > deadzone) {
        this.reticle2.y = Phaser.Math.Clamp(this.reticle2.y + axisY * velocidad2 * 2, this.reticle2.minY, this.reticle2.maxY);
      }
    }

    // --- Disparo jugador 1 ---
    const shootKey1 = this.keys.player1[INPUT_ACTIONS.SOUTH][0];
    const shootKey2 = this.keys.player2[INPUT_ACTIONS.SOUTH][0];

    // Teclado
    if (Phaser.Input.Keyboard.JustDown(shootKey1)) this.weaponRana.shoot();
    if (Phaser.Input.Keyboard.JustDown(shootKey2)) this.weaponRata.shoot();

    // Gamepad
    if (this.gamepad1 && this.gamepad1.buttons[0].pressed && !this.prevPad1Pressed) {
      this.weaponRana.shoot();
    }
    this.prevPad1Pressed = this.gamepad1 ? this.gamepad1.buttons[0].pressed : false;

    if (this.gamepad2 && this.gamepad2.buttons[0].pressed && !this.prevPad2Pressed) {
      this.weaponRata.shoot();
    }
    this.prevPad2Pressed = this.gamepad2 ? this.gamepad2.buttons[0].pressed : false;

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

    this.scene.pause('Versus');
    // obtener todos y los ya usados
    const todos = this.modManager.todosLosModificadores || [];
    const usados = this.modManager.modificadoresActivos || [];

    // filtrar: disponibles = todos - usados; si queda vacío, usar todos (fallback)
    const disponibles = todos.filter(m => !usados.includes(m));
    const opciones = disponibles.length ? disponibles : todos;

    this.scene.launch('ModificadorRuleta', {
        modificadores: opciones,
        onResultado: (elegido) => {
      // reanudar Versus y aplicar resultado
      this.scene.resume('Versus');
      this.modManager.addModificador(elegido);
      this.scene.stop('ModificadorRuleta');
      this.roundManager.startNextRound(proximaRonda);
    },
    onCancel: () => {
      // si hay opción de cancelar, reanudar Versus también
      this.scene.resume('Versus');
      this.scene.stop('ModificadorRuleta');
    }
  });
}
shutdown() {
  this.gamepad1 = null;
  this.gamepad2 = null;
  this.prevPad1Pressed = false;
  this.prevPad2Pressed = false;
}
}


