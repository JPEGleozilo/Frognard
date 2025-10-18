import { Scene } from 'phaser';

const MODIFICADORES_INFO = [
  { key: 'pantallaInvertida', nombre: 'Pantalla Invertida', descripcion: 'La pantalla se muestra al revés.', icono: 'pantalla_invertida' },
  { key: 'moscasPequeñas', nombre: 'Moscas Pequeñas', descripcion: 'Las moscas son más pequeñas y difíciles de ver.', icono: 'moscas_pequeñas' },
  { key: 'moscasGrandes', nombre: 'Moscas Grandes', descripcion: 'Las moscas son más grandes.', icono: 'moscas_grandes' },
  { key: 'moscasRapidas', nombre: 'Moscas Rápidas', descripcion: 'Las moscas se mueven más rápido.', icono: 'moscas_rapidas' },
  { key: 'moscasFantasmas', nombre: 'Moscas Fantasmas', descripcion: 'Las moscas se vuelven parcialmente transparentes.', icono: 'moscas_fantasmas' },
  { key: 'reticulasLentas', nombre: 'Retículas Lentas', descripcion: 'Las retículas de ambos jugadores se mueven más despacio.', icono: 'reticulas_lentas' },
  { key: 'reticulasRapidas', nombre: 'Retículas Rápidas', descripcion: 'Las retículas de ambos jugadores se mueven más rápido.', icono: 'reticulas_rapidas' },
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
    // opcional: permitir pasar teclas desde Versus por data.confirmKeys = { p1: KeyCode, p2: KeyCode }
    this.confirmKeys = data.confirmKeys || null;
  }

  create() {
    // pausar la escena Versus para que el juego no avance mientras la ruleta está activa
    if (this.scene.isActive('Versus')) this.scene.pause('Versus');

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x000000, 0.9);
    this.add.text(centerX, 80, 'Ruleta de Modificadores', {
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
    this.highlight = this.add.rectangle(centerX, centerY, this.spacing, this.spacing)
      .setStrokeStyle(4, 0xffd700)
      .setAlpha(0.9);

    this.centerText = this.add.text(centerX, centerY + 130, '', {
      fontSize: '26px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.centerDesc = this.add.text(centerX, centerY + 180, '', {
      fontSize: '18px',
      color: '#ccc',
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5);

    // textos de confirmación por jugador
    this.readyTextP1 = this.add.text(centerX - 180, centerY + 220, 'P1: Esperando (T)', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.readyTextP2 = this.add.text(centerX + 180, centerY + 220, 'P2: Esperando (L)', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.instructionText = this.add.text(centerX, centerY + 260, '', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

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

    // gamepad: cualquier botón del pad 0 = P1, pad 1 = P2
    this.input.gamepad.once('connected', pad => {
      // noop: ensure gamepad plugin active
    });

    this._onPadDown = (pad, button, value) => {
      if (pad.index === 0) this.onConfirm(1);
      if (pad.index === 1) this.onConfirm(2);
    };
    this.input.gamepad.on('down', this._onPadDown);
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

    // si ya hay elección final (ruleta terminó), comprobar ambas listas
    if (this.finalChoice) {
      this.instructionText.setText('Confirmado: esperando al otro jugador...');
      this.checkBothReady();
    } else {
      // si confirman antes de que termine el giro, informar al usuario
      this.instructionText.setText('Esperando que termine la ruleta...');
    }
  }

  checkBothReady() {
    if (this.p1Ready && this.p2Ready) {
      // limpieza de listeners
      this.cleanupConfirmControls();

      // reanudar Versus si estaba pausada
      if (this.scene.isPaused('Versus')) this.scene.resume('Versus');

      // llamar callback con la elección final
      if (this.onResultado) this.onResultado(this.finalChoice);

      // cerrar la escena ruleta
      this.scene.stop();
    }
  }

  cleanupConfirmControls() {
    if (this.keys) {
      if (this.keys.p1) this.keys.p1.off('down');
      if (this.keys.p2) this.keys.p2.off('down');
    }
    if (this._onPadDown) this.input.gamepad.off('down', this._onPadDown);
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

    // mostrar instrucciones para confirmar
    this.instructionText.setText('Presionen DISPARAR para confirmar (P1: T / P2: L o botones de gamepad)');

    // si ambos ya presionaron antes del finish, finalizar inmediatamente
    this.time.delayedCall(200, () => {
      if (this.p1Ready && this.p2Ready) {
        this.checkBothReady();
      }
    });
  }
}
