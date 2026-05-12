import { Scene } from 'phaser';
import { EventBus } from '../utils/EventBus.js';

export class VersusUI extends Scene {
    constructor() {
        super({ key: 'VersusUI' });
    }

    create() {
        const centerX = this.scale.width / 2;
        const timerY = 35;
        EventBus.on('pantallaInvertida', this._onPantallaInvertida, this);

        // Fondo timer
        this.add.rectangle(centerX, 20, 120, 100, 0x000000)
            .setAlpha(0.9)
            .setDepth(0.1)
            .setOrigin(0.5);

        // Timer
        this.timerText = this.add.text(centerX + 2, timerY, "00", {
            fontFamily: "PIXELYA",
            fontSize: "54px",
            color: "#ff0000"
        }).setOrigin(0.5).setDepth(0.2);

        // Luces de ronda
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

        // Panel de moscas
        this._crearPanelMoscas();

        // Escuchar eventos del EventBus
        EventBus.on('timerTick', this._onTimerTick, this);
        EventBus.on('roundStart', this._onRoundStart, this);
        EventBus.on('scorePopup', this._onScorePopup, this);

        // Limpiar listeners al cerrar
        this.events.on('shutdown', this._cleanup, this);
        this.events.on('destroy', this._cleanup, this);
    }

    _crearPanelMoscas() {
        const centerX = this.scale.width / 2;
        const panelY = 485;

        this.add.rectangle(centerX, panelY, 130, 100, 0x000000, 0.4)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffffff)
            .setDepth(200);

        const estiloTexto = {
            fontFamily: 'vhs-gothic',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        };

        const espacio = 30;
        const baseY = panelY;

        // Mosca normal
        const moscaNormal = this.add.sprite(centerX - 35, baseY - espacio, 'mosca spritesheet').setScale(1).setDepth(201);
        this.add.text(moscaNormal.x + 20, baseY - espacio, '= +1', estiloTexto).setOrigin(0, 0.5).setDepth(201);

        // Mosca dorada
        const moscaDorada = this.add.sprite(centerX - 35, baseY, 'mosca dorada spritesheet').setScale(1).setDepth(201);
        this.add.text(moscaDorada.x + 20, baseY, '= +5', estiloTexto).setOrigin(0, 0.5).setDepth(201);

        // Mosca impostora
        const moscaImpostor = this.add.sprite(centerX - 35, baseY + espacio, 'mosca_impostor').setScale(1).setDepth(201);
        this.add.text(moscaImpostor.x + 20, baseY + espacio, '= -3', estiloTexto).setOrigin(0, 0.5).setDepth(201);

        // Animaciones a los lados
        this.add.sprite(120, panelY + 20, 'animacion_controles_vs').setScale(1).setDepth(201).play('animacion_controles_vs');
        this.add.sprite(840, panelY + 20, 'animacion_controles_vs').setScale(1).setDepth(201).play('animacion_controles_vs');
    }

    _onTimerTick({ seconds }) {
        const formatted = seconds < 10 ? `0${seconds}` : `${seconds}`;
        this.timerText.setText(formatted);
    }

    _onRoundStart({ round }) {
        this.timerText.setText("60");
        for (let i = 0; i < this.rondaLights.length; i++) {
            this.rondaLights[i].setFillStyle(i < round ? 0xffd700 : 0x444444);
        }
    }

    _onScorePopup({ x, y, value, player }) {
        y = (y ?? this.scale.height / 2) - 10;

        let color;
        if (value < 0) {
            color = '#ff4444';
        } else {
            color = player === 'player1' ? '#00ff66' : '#66ccff';
        }

        const text = value > 0 ? `+${value}` : `${value}`;
        const txt = this.add.text(x, y, text, {
            fontFamily: 'vhs-gothic',
            fontSize: '24px',
            color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(1000).setAlpha(0.95).setScale(0.9);

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

    _cleanup() {
        EventBus.off('timerTick', this._onTimerTick, this);
        EventBus.off('roundStart', this._onRoundStart, this);
        EventBus.off('scorePopup', this._onScorePopup, this);
        EventBus.off('pantallaInvertida', this._onPantallaInvertida, this);
    }
    _onPantallaInvertida(activa) {
    this.cameras.main.setRotation(activa ? Phaser.Math.DegToRad(180) : 0);
}
}