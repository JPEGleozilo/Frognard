import { Scene } from 'phaser';
import Reticle from "../objects/versus/Reticula.js";
import Personaje from "../objects/versus/Personaje.js";
import MoscaPool from "../objects/versus/MoscaPool.js";
import WeaponManager from "../objects/versus/WeaponManager.js";
import ScoreManager from '../objects/versus/ScoreManager.js';
import MoscaDoradaPool from '../objects/versus/MoscaDoradaPool.js';
import RoundManager from "../objects/versus/RoundManager.js";
import ModificadorManager from "../objects/versus/ModificadorManager.js";

function keyToInternalName(key) {
  switch (key) {
    case "pantalla_invertida": return "pantallaInvertida";
    case "moscas_pequeñas": return "moscasPequeñas";
    case "moscas_rapidas": return "moscasRapidas";
    case "moscas_fantasmas": return "moscasFantasmas";
    case "moscas_locas": return "moscasLocas";
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

    // Crear manejadores
    this.roundManager = new RoundManager(this, 30000, 3); // 1 min por ronda
    this.modManager = new ModificadorManager(this);

    // HUD simple
    this.roundText = this.add.text(16, 16, "Ronda: -", { fontSize: "18px", color: "#ffffff" });
    this.timerText = this.add.text(16, 40, "Tiempo: 0", { fontSize: "18px", color: "#ffffff" });

    // Retículas
    this.reticle1 = new Reticle(this, 200, 100, 0x00ff00, {
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
    this.rana = new Personaje(this, 300, 480, 0x00ff00, this.reticle1, "Q", 'player1');
    this.rata = new Personaje(this, 600, 480, 0xaaaaaa, this.reticle2, "P", 'player2');

    // Managers de armas
    this.weaponRana = new WeaponManager(this, this.rana, this.reticle1, 0x00ff00);
    this.weaponRata = new WeaponManager(this, this.rata, this.reticle2, 0x808080);

    // Pools de moscas
    this.moscaPool = new MoscaPool(this, 25);
    this.moscaDoradaPool = new MoscaDoradaPool(this, 5);

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
      } else if (!this.gamepad2) {
        this.gamepad2 = pad;
        console.log("Gamepad 2 conectado:", pad.id);
      }
    });

    // ScoreManager
    this.scoreManager = new ScoreManager(this);

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
      frameRate: 10,
      repeat: 0
    });

    // Bloquear inputs hasta que empiece la ronda
    this.gameplayEnabled = false;

    // --- EVENTOS DEL ROUND MANAGER ---
    this.events.on("roundStart", ({ round, maxRounds }) => {
      this.roundText.setText(`Ronda: ${round} / ${maxRounds}`);
      this.timerText.setText("Tiempo: 60");
      this.gameplayEnabled = true;

      // reaplicar efectos acumulados (en caso de que estén)
        this.modManager.aplicarModificadoresActivos();


      if (this.moscaPool?.resume) this.moscaPool.resume();
    });

    this.events.on("roundTick", ({ seconds }) => {
      this.timerText.setText(`Tiempo: ${seconds}`);
    });

    this.events.on("roundEnd", ({ round }) => {
      this.timerText.setText("Tiempo: 0");
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

    // Iniciar todas las rondas
    this.roundManager.startAll();
  }

  update(time, delta) {
    // Movimiento con joystick izquierdo para jugador 1
    if (this.gamepad1) {
      const axisX = this.gamepad1.axes.length > 0 ? this.gamepad1.axes[0].getValue() : 0;
      const axisY = this.gamepad1.axes.length > 1 ? this.gamepad1.axes[1].getValue() : 0;
      const deadzone = 0.2;
      const velocidad = (this.reticle1.speed || 200) * (this.velocidadReticula ?? 1) * (delta / 1000);

      if (Math.abs(axisX) > deadzone) {
        this.reticle1.x += axisX * velocidad ;
        this.reticle1.x = Phaser.Math.Clamp(this.reticle1.x, this.reticle1.minX, this.reticle1.maxX);
      }
      if (Math.abs(axisY) > deadzone) {
        this.reticle1.y += axisY * velocidad;
        this.reticle1.y = Phaser.Math.Clamp(this.reticle1.y, this.reticle1.minY, this.reticle1.maxY);
      }
    }

    // Movimiento con joystick izquierdo para jugador 2
    if (this.gamepad2) {
      const axisX = this.gamepad2.axes.length > 0 ? this.gamepad2.axes[0].getValue() : 0;
      const axisY = this.gamepad2.axes.length > 1 ? this.gamepad2.axes[1].getValue() : 0;
      const deadzone = 0.2;
      const velocidad = (this.reticle2.speed || 200) * (this.velocidadReticula ?? 1) * (delta / 1000);


      if (Math.abs(axisX) > deadzone) {
        this.reticle2.x += axisX * velocidad
        this.reticle2.x = Phaser.Math.Clamp(this.reticle2.x, this.reticle2.minX, this.reticle2.maxX);
      }
      if (Math.abs(axisY) > deadzone) {
        this.reticle2.y += axisY * velocidad;
        this.reticle2.y = Phaser.Math.Clamp(this.reticle2.y, this.reticle2.minY, this.reticle2.maxY);
      }
    }

    this.reticle1.update(time, delta);
    this.reticle2.update(time, delta);
    this.roundManager.update(time, delta);

    this.rana.update(time, delta, this.moscaPool, this.moscaDoradaPool);
    this.rata.update(time, delta, this.moscaPool, this.moscaDoradaPool);
    this.moscaPool.update(time, delta);
    this.moscaDoradaPool.update(time, delta);

    // --- Disparo con gamepad SOUTH ---
    // Jugador 1
    if (this.gameplayEnabled && this.gamepad1) {
      const pressed = this.gamepad1.buttons[0].pressed;
      if (pressed && !this.prevPad1Pressed) {
        this.weaponRana.shoot();
        console.log("Disparo jugador 1 con botón 0");
      }
      this.prevPad1Pressed = pressed;
    }

    // Jugador 2
    if (this.gameplayEnabled && this.gamepad2) {
      const pressed = this.gamepad2.buttons[0].pressed;
      if (pressed && !this.prevPad2Pressed) {
        this.weaponRata.shoot();
        console.log("Disparo jugador 2 con botón 0");
      }
      this.prevPad2Pressed = pressed;
    }

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
    // ejemplo: this.scene.start('Resultados', { scores: this.scoreManager.getScores() });
  }

  mostrarRuletaModificadores(proximaRonda) {
  const posiblesMods = this.modManager.todosLosModificadores;

  this.scene.launch('ModificadorRuleta', {
    modificadores: posiblesMods, // se pasa lista completa con key, nombre, icono, etc.
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


}
