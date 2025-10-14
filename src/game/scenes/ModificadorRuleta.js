import { Scene } from 'phaser';

const MODIFICADORES_INFO = [
  { key: 'pantalla_invertida', nombre: 'Pantalla Invertida', descripcion: 'La pantalla se muestra al revés.', icono: 'pantalla_invertida' },
  { key: 'moscas_pequeñas', nombre: 'Moscas Pequeñas', descripcion: 'Las moscas son más pequeñas y difíciles de ver.', icono: 'moscas_pequeñas' },
  { key: 'moscas_rapidas', nombre: 'Moscas Rápidas', descripcion: 'Las moscas se mueven más rápido.', icono: 'moscas_rapidas' },
  { key: 'moscas_fantasmas', nombre: 'Moscas Fantasmas', descripcion: 'Las moscas se vuelven parcialmente transparentes.', icono: 'moscas_fantasmas' },
  { key: 'moscas_locas', nombre: 'Moscas Locas', descripcion: 'Las moscas cambian de dirección erráticamente.', icono: 'moscas_locas' },
  { key: 'reticulas_lentas', nombre: 'Retículas Lentas', descripcion: 'Las retículas de ambos jugadores se mueven más despacio.', icono: 'reticulas_lentas' },
  { key: 'reticulas_rapidas', nombre: 'Retículas Rápidas', descripcion: 'Las retículas de ambos jugadores se mueven más rápido.', icono: 'reticulas_rapidas' },
];

export class ModificadorRuleta extends Scene {
  constructor() {
    super('ModificadorRuleta');
  }

  init(data) {
    this.modificadores = data.modificadores || [];
    this.onResultado = data.onResultado;
  }

  create() {
  const centerX = this.scale.width / 2;
  const centerY = this.scale.height / 2;

  this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x000000, 0.9);
  this.add.text(centerX, 80, '🎯 Ruleta de Modificadores', {
    fontSize: '28px',
    color: '#fff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  // Normalizar modificadores
  this.itemsData = this.modificadores.map(m => {
    let key = typeof m === 'string' ? m : m.key || m.nombre;
    key = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    const full = MODIFICADORES_INFO.find(x => x.key === key || x.nombre === m.nombre);
    return full || { nombre: m.nombre || key, icono: 'default_icon' };
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
  this.add.circle(centerX, centerY, 5, 0xff0000);

  this.icons = this.itemsLoop.map((mod, i) => {
    const icon = this.add.image(i * this.spacing, 0, mod.icono)
      .setScale(0.9)
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
    wordWrap: { width: 500 }
  }).setOrigin(0.5);

  this.selectedIndex = Phaser.Math.Between(0, this.itemsLoop.length - 1);
  this.offset = this.selectedIndex * this.spacing;

  this.rollAnimation();
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
      icon.setScale(0.8 + 0.4 * t);
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
    this.tweens.add({
      targets: this.highlight,
      scale: 1.1,
      yoyo: true,
      duration: 400,
    });

    this.time.delayedCall(1000, () => {
      if (this.onResultado) this.onResultado(elegido);
      this.scene.stop();
    });
  }
}
