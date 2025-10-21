import { Scene } from 'phaser';

const MODIFICADORES_INFO = [
  { key: 'pantallaInvertida', nombre: 'Pantalla Invertida', descripcion: 'La pantalla se muestra al revés.', icono: 'pantalla_invertida' },
  { key: 'moscasPequeñas', nombre: 'Moscas Pequeñas', descripcion: 'Las moscas son más pequeñas y difíciles de ver.', icono: 'moscas_pequeñas' },
  { key: 'moscasGrandes', nombre: 'Moscas Grandes', descripcion: 'Las moscas son más grandes.', icono: 'moscas_grandes' },
  { key: 'moscasRapidas', nombre: 'Moscas Rápidas', descripcion: 'Las moscas se mueven más rápido.', icono: 'moscas_rapidas' },
  { key: 'moscasFantasmas', nombre: 'Moscas Fantasmas', descripcion: 'Las moscas se vuelven parcialmente transparentes.', icono: 'moscas_fantasmas' },
  { key: 'mirasLentas', nombre: 'Miras Lentas', descripcion: 'Las miras de ambos jugadores se mueven más despacio.', icono: 'miras_lentas' },
  { key: 'mirasRapidas', nombre: 'Miras Rápidas', descripcion: 'Las miras de ambos jugadores se mueven más rápido.', icono: 'miras_rapidas' },
  { key: 'disparosLentos', nombre: 'Disparos Lentos', descripcion: 'Los disparos de ambos jugadores se ejecutarán más lento.', icono: 'disparos_lentos' },
  { key: 'disparosRapidos', nombre: 'Disparos Rápidos', descripcion: 'Los disparos de ambos jugadores se ejecutarán más rápido.', icono: 'disparos_rapidos' },
  { key: 'fiebreDeMoscasDoradas', nombre: 'Fiebre Dorada', descripcion: 'Las moscas doradas aparecerán más seguido!!', icono: 'fiebre_moscasdoradas' },
  { key: 'fiebreDeMoscasImpostoras', nombre: 'Fiebre Impostora', descripcion: 'Las moscas impostoras aparecerán más seguido.', icono: 'fiebre_moscasimpostoras' },
];

export class ModificadorRuleta extends Scene {
  constructor() {
    super('ModificadorRuleta');
  }

  init(data) {
    this.modificadores = data.modificadores || [];
    this.onResultado = data.onResultado;
    this.confirmKeys = data.confirmKeys || null;
  }

  create() {
    // pausar la escena Versus para que el juego no avance mientras la ruleta está activa
    if (this.scene.isActive('Versus')) this.scene.pause('Versus');

    this.anims.create({
      key: 'animacion_presionar_a',
      frames: this.anims.generateFrameNumbers('animacion_presionar_a', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    const centerX = (this.scale.width / 2);
    const centerY = (this.scale.height / 2) - 50;

    this.add.rectangle(centerX, centerY + 50, this.scale.width, this.scale.height, 0x000000, 0.9);
    this.add.text(centerX, 40, 'Ruleta de Modificadores', {
      fontSize: '28px',
      color: '#fff',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Normalizar modificadores
    this.itemsData = this.modificadores.map(m => {
      const originalKey = (typeof m === 'string') ? m : (m.key || m.nombre || '');
      const full = MODIFICADORES_INFO.find(x =>
        x.key === originalKey || x.nombre === (typeof m === 'object' ? m.nombre : undefined)
      );
      return full || {
        nombre: (typeof m === 'object' ? m.nombre : originalKey),
        descripcion: (typeof m === 'object' ? m.descripcion : ''),
        icono: (typeof m === 'object' && m.icono) ? m.icono : 'default_icon'
      };
    });

    // Configuración del carrusel
    this.windowWidth = 600;
    this.windowHeight = 160;

    const maskShape = this.make.graphics({ x: centerX - this.windowWidth / 2, y: centerY - this.windowHeight / 2, add: false });
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(0, 0, this.windowWidth, this.windowHeight);
    const mask = maskShape.createGeometryMask();

    this.carousel = this.add.container(centerX, centerY);
    this.carousel.setMask(mask);

    // Duplicamos lista para loop continuo
    this.itemsLoop = [...this.itemsData, ...this.itemsData, ...this.itemsData];
    this.spacing = 150;

    this.icons = this.itemsLoop.map((mod, i) => {
      const icon = this.add.image(i * this.spacing, 0, mod.icono)
        .setScale(2)
        .setAlpha(0.6)
        .setOrigin(0.5);
      this.carousel.add(icon);
      return icon;
    });

    // Alineación inicial precisa
    this.carousel.x -= (this.icons[0].width * this.icons[0].scaleX) * 0.7;

    // Indicador central
    this.highlight = this.add.rectangle(centerX - 5, centerY, this.spacing, this.spacing)
      .setStrokeStyle(4, 0xffd700)
      .setAlpha(0.9);

    this.centerText = this.add.text(centerX, centerY + 130, '', {
      fontSize: '26px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.centerDesc = this.add.text(centerX, centerY + 165, '', {
      fontSize: '18px',
      color: '#ccc',
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5);

    // textos de confirmación por jugador
    this.readyTextP1 = this.add.text(centerX - 180, centerY + 220, 'P1: Esperando ', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.readyTextP2 = this.add.text(centerX + 180, centerY + 220, 'P2: Esperando ', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.instructionText = this.add.text(centerX, centerY + 300, '', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    // sprite de animación para "presionar A" (oculto hasta finish)
    this.pressAnim = this.add.sprite(centerX, centerY + 260, 'animacion_presionar_a')
      .setOrigin(0.5)
      .setVisible(false);
    this.pressAnim.setScale(2);

    // control para evitar skip rápido
    this.canConfirm = false;

    this.selectedIndex = Phaser.Math.Between(0, this.itemsLoop.length - 1);
    this.offset = this.selectedIndex * this.spacing;

    // estado confirmación
    this.p1Ready = false;
    this.p2Ready = false;
    this.finalChoice = null;

    // configurar controles de confirmación (teclado + gamepads)
    this.setupConfirmControls();

    this.rollAnimation();
  }

  setupConfirmControls() {
    // teclas por defecto (pueden pasarse con data.confirmKeys)
    const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    const p1KeyCode = (this.confirmKeys && this.confirmKeys.p1) ? this.confirmKeys.p1 : KeyCodes.T;
    const p2KeyCode = (this.confirmKeys && this.confirmKeys.p2) ? this.confirmKeys.p2 : KeyCodes.L;

    this.keys = {
      p1: this.input.keyboard.addKey(p1KeyCode),
      p2: this.input.keyboard.addKey(p2KeyCode)
    };

    this.keys.p1.on('down', () => this.onConfirm(1));
    this.keys.p2.on('down', () => this.onConfirm(2));

    // GAMEPAD: evitar contar pulsaciones que ya estaban mantenidas al abrir la ruleta.
    this._padAwaitRelease = {};
    // mapa pad.index -> player (1 or 2)
    this.padToPlayer = {};

    // Inicializar estado para pads ya conectados (al abrir la ruleta)
    if (this.input.gamepad && this.input.gamepad.gamepads) {
      this.input.gamepad.gamepads.forEach(pad => {
        if (!pad) return;
        const anyDown = pad.buttons.some(b => b && (b.value > 0 || b.pressed));
        this._padAwaitRelease[pad.index] = !!anyDown;
        // asignar pad al primer jugador libre (no reasignar si ya existe)
        if (this.padToPlayer[pad.index] == null) {
          const used = Object.values(this.padToPlayer);
          if (!used.includes(1)) this.padToPlayer[pad.index] = 1;
          else if (!used.includes(2)) this.padToPlayer[pad.index] = 2;
        }
      });
    }

    // manejar conexión de nuevos pads
    this._onPadConnect = (pad) => {
      const anyDown = pad.buttons.some(b => b && (b.value > 0 || b.pressed));
      this._padAwaitRelease[pad.index] = !!anyDown;
      if (this.padToPlayer[pad.index] == null) {
        const used = Object.values(this.padToPlayer);
        if (!used.includes(1)) this.padToPlayer[pad.index] = 1;
        else if (!used.includes(2)) this.padToPlayer[pad.index] = 2;
      }
    };
    this.input.gamepad.on('connected', this._onPadConnect);

    // 'down' -> contar solo si no estamos esperando release, mapear pad a player de forma determinista
    this._onPadDown = (pad, button, value) => {
      if (this._padAwaitRelease[pad.index]) {
        // ignorar primer down si pad mantenido; espera a up para 'armar' el pad
        return;
      }
      // asignar si no estaba asignado (fallback: index 0 -> player1)
      if (this.padToPlayer[pad.index] == null) {
        this.padToPlayer[pad.index] = (pad.index === 0) ? 1 : 2;
      }
      const player = this.padToPlayer[pad.index];
      if (player === 1) this.onConfirm(1);
      else if (player === 2) this.onConfirm(2);
    };
    this.input.gamepad.on('down', this._onPadDown);

    // 'up' -> libera el pad para aceptar el siguiente down
    this._onPadUp = (pad, button, value) => {
      this._padAwaitRelease[pad.index] = false;
    };
    this.input.gamepad.on('up', this._onPadUp);
  }

  onConfirm(player) {
    if (player === 1) {
      this.p1Ready = true;
      this.readyTextP1.setText('P1: Listo');
      this.readyTextP1.setColor('#00ff00');
    } else {
      this.p2Ready = true;
      this.readyTextP2.setText('P2: Listo');
      this.readyTextP2.setColor('#00ff00');
    }

    // si aún no terminó el giro, informar
    if (!this.finalChoice) {
      this.instructionText.setText('Esperando que termine la ruleta...');
      return;
    }

    // si la ruleta terminó pero aún no pasó el mínimo tiempo, mostrar mensaje y no finalizar
    if (!this.canConfirm) {
      const remaining = Math.ceil(Math.max(0, (this._confirmEnableTime || 0) - this.time.now) / 1000);
      this.instructionText.setText(``);
      return;
    }

    // si se puede confirmar, intentar finalizar
    this.instructionText.setText('Confirmado: esperando al otro jugador...');
    this.checkBothReady();
  }

  checkBothReady() {
    // Solo finalizar si ambos están listos y se cumplió el tiempo mínimo
    if (this.p1Ready && this.p2Ready && this.canConfirm) {
       // limpieza de listeners
       this.cleanupConfirmControls();

       // reanudar Versus si estaba pausada
       if (this.scene.isPaused('Versus')) this.scene.resume('Versus');

       // llamar callback con la elección final
       if (this.onResultado) this.onResultado(this.finalChoice);

       // cerrar la escena ruleta
       this.scene.stop();
    } else if (this.p1Ready && this.p2Ready && !this.canConfirm) {
      // ambos listos pero aún no puede confirmarse
      const remaining = Math.ceil(Math.max(0, (this._confirmEnableTime || 0) - this.time.now) / 1000);
      this.instructionText.setText();
    }
  }

  cleanupConfirmControls() {
    if (this.keys) {
      if (this.keys.p1) this.keys.p1.off('down');
      if (this.keys.p2) this.keys.p2.off('down');
    }
    if (this._onPadDown) this.input.gamepad.off('down', this._onPadDown);
    if (this._onPadUp) this.input.gamepad.off('up', this._onPadUp);
    if (this._onPadConnect) this.input.gamepad.off('connected', this._onPadConnect);

    // limpiar estado
    this._padAwaitRelease = {};
    this.padToPlayer = {};
  }

  rollAnimation() {
    const totalSpins = 45;
    let step = 0;
    let speed = 10; // desplazamiento por frame
    let moving = true;

    const spin = () => {
      if (!moving) return;

      // Mover carrusel
      this.offset += speed;
      const totalWidth = this.itemsLoop.length * this.spacing;

      // Loop continuo sin saltos
      this.offset %= totalWidth;
      this.carousel.x = this.scale.width / 2 - (this.offset % totalWidth);

      // Calcular icono más cercano al centro
      const center = this.scale.width / 2;
      let closestIcon = null;
      let closestDist = Infinity;
      this.icons.forEach(icon => {
        const worldX = icon.x + this.carousel.x;
        const dist = Math.abs(center - worldX);
        if (dist < closestDist) {
          closestDist = dist;
          closestIcon = icon;
        }
        const t = Phaser.Math.Clamp(1 - dist / 300, 0.4, 1);
        icon.setScale(1 + 0.8 * t);
        icon.setAlpha(0.4 + 0.6 * t);
      });

      // Actualizar texto central
      const index = this.icons.indexOf(closestIcon);
      const mod = this.itemsLoop[index];
      this.centerText.setText(mod.nombre);
      this.centerDesc.setText(mod.descripcion);

      // Desacelerar suavemente
      step++;
      if (step > totalSpins) {
        speed *= 0.97;
        if (speed < 0.8) {
          moving = false;
          this.finishRuleta(mod);
          return;
        }
      }

      this.time.delayedCall(16, spin, [], this);
    };

    spin();
  }

  finishRuleta(elegido) {
    // guardar elección pero no finalizar hasta que ambos confirmen
    this.finalChoice = elegido;

    this.tweens.add({
      targets: this.highlight,
      scale: 1.5,
      yoyo: true,
      duration: 400,
    });

    // mostrar animación de "presionar A" en lugar de texto
    this.instructionText.setText(''); // limpiar texto
    this.pressAnim.setVisible(true);
    this.pressAnim.play('animacion_presionar_a');

    // bloquear confirmaciones por al menos 4 segundos
    this.canConfirm = false;
    // guardar tiempo de habilitación para mostrar cuenta regresiva
    this._confirmEnableTime = this.time.now + 3000;
    this.time.delayedCall(4000, () => {
      this.canConfirm = true;
      // si ambos ya habían presionado antes del timeout, finalizar ahora
      if (this.p1Ready && this.p2Ready) {
        this.checkBothReady();
      }
    }, [], this);

    // pequeña espera para permitir UI updates antes del timeout check
    this.time.delayedCall(200, () => {
      if (this.p1Ready && this.p2Ready && this.canConfirm) {
        this.checkBothReady();
      }
    });
  }
}
