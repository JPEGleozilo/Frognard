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

export class Versus extends Scene {
  constructor() {
    super('Versus');
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

    this.disparoHold = {
      p1: false,
      p2: false
    };

    // Pools de moscas
    this.moscaPool = new MoscaPool(this, 25);
    this.moscaDoradaPool = new MoscaDoradaPool(this, 5);
    this.moscaImpostorPool = new MoscaImpostorPool(this, 10);

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

    // registrar popup de puntaje (animación flotante)
    this.events.on('scorePopup', this.spawnFloatingScore, this);

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
    this.cursors = this.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,W,A,S,D,Q,K");

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
        fontFamily: 'vhs-gothic',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center'
    };

    // Iconos + texto
    const baseY = panelY ;
    const espacio = 30;

    // Mosca normal
    const moscaNormal = this.add.sprite(panelX - 35, baseY - espacio, 'mosca spritesheet').setScale(1).setDepth(201);
    this.add.text(moscaNormal.x + 20, baseY - espacio, '= +1', estiloTexto).setOrigin(0, 0.5).setDepth(201);

    // Mosca dorada
    const moscaDorada = this.add.sprite(panelX - 35, baseY, 'mosca dorada spritesheet').setScale(1).setDepth(201);
    this.add.text(moscaDorada.x + 20, baseY, '= +5', estiloTexto).setOrigin(0, 0.5).setDepth(201);

    // Mosca impostora
    const moscaImpostor = this.add.sprite(panelX - 35, baseY + espacio, 'mosca_impostor').setScale(1).setDepth(201);
    this.add.text(moscaImpostor.x + 20, baseY + espacio, '= -3', estiloTexto).setOrigin(0, 0.5).setDepth(201);

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

      // reproducir sonido al terminar la ronda
      try {
        const key = 'ronda_terminada';
        if (this.cache && this.cache.audio && this.cache.audio.exists && this.cache.audio.exists(key)) {
          this.sound.play(key, { volume: 0.5 });
        } else {
          this.sound.play(key);
        }
      } catch (e) {
        // silencioso si el audio no está disponible
      }

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

    const musicKey = 'musica_versus';
    if (this.cache && this.cache.audio && this.cache.audio.exists && this.cache.audio.exists(musicKey)) {
        this.versusMusic = this.sound.add(musicKey, { loop: true, volume: 0.6 });
        this.versusMusic.play();
    } 
  }

  update(time, delta) {

    this.gamepadController.update();
    this.getInput = this.gamepadController.getInput();

    if (this.disparoHold.p1 === true && (this.getInput.joy1.accion === false && this.cursors.Q.isUp)) this.disparoHold.p1 = false;
    if (this.disparoHold.p2 === true && (this.getInput.joy2.accion === false && this.cursors.K.isUp)) this.disparoHold.p2 = false;


    // --- Movimiento retícula jugador 1 ---
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

    // Teclado
    this.reticle1.x = Phaser.Math.Clamp(this.reticle1.x + dx1 * velocidad1, this.reticle1.minX, this.reticle1.maxX);
    this.reticle1.y = Phaser.Math.Clamp(this.reticle1.y + dy1 * velocidad1, this.reticle1.minY, this.reticle1.maxY);

    // --- Movimiento retícula jugador 2 ---
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
  if (this.gamepads && this.gamepads.joystick1) {
        this.gamepads.joystick1.removeAllListeners();
  }
  if (this.gamepads && this.gamepads.joystick2) {
        this.gamepads.joystick2.removeAllListeners();
  }
  if (this.versusMusic) {
        try {
            if (this.versusMusic.isPlaying) this.versusMusic.stop();
            this.versusMusic.destroy();
        } catch (e) { /* ignore */ }
        this.versusMusic = null;
    }
}

 spawnFloatingScore({ x, y, value, player }) {
    // fallback coords sobre el personaje si no vienen
    if (x == null || y == null) {
      const p = (player === 'player1') ? this.rana : this.rata;
      if (p) { x = p.x; y = p.y - 40; } else { x = this.scale.width / 2; y = this.scale.height / 2; }
    }
    y = y - 10;

    // Si es puntuación negativa mostrar en rojo
    let color;
    if (value < 0) {
      color = '#ff4444'; 
    } else {
      const colorMap = {
        player1: '#00ff66', 
        player2: '#66ccff' 
      };
      color = colorMap[player] || '#ffffff';
    }

    // reproducir sonido de sumar puntos solo para valores positivos (mosca normal / dorada)
    if (value > 0) {
      try {
        if (this.cache && this.cache.audio && this.cache.audio.exists && this.cache.audio.exists('sumar_puntos')) {
          this.sound.play('sumar_puntos', { volume: 0.4 });
        } else {
          this.sound.play('sumar_puntos');
        }
      } catch (e) { /* silencioso si no existe o falla */ }
    }

    const text = value > 0 ? `+${value}` : `${value}`;
    const txt = this.add.text(x, y, text, {
      fontFamily: 'vhs-gothic',
      fontSize: '24px',
      color: color,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(1000);
    txt.setAlpha(0.95);
    txt.setScale(0.9);

    this.tweens.add({
      targets: txt,
      y: y - 60,
      alpha: 0,
      scale: 1.4,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy()
    });
 }
 }


