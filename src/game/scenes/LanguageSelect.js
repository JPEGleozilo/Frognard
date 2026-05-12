import { Scene } from 'phaser';
import { getTranslations } from '../../services/translations';
import { ES, EN } from '../../enums/languages';
import GamePadController from '../utils/GamepadController';

export class LanguageSelect extends Scene {
    constructor() {
        super('LanguageSelect');
    }

    init() {
        this.selectedIndex = 0;
        this.options = [ES, EN];
        this.canInput = true;
    }

    create() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        // Fondo
        this.add.rectangle(centerX, centerY, width, height, 0x0a0a0a);

        const esX = centerX - 160;
        const enX = centerX + 160;
        const flagY = centerY;
        const flagW = 180;
        const flagH = 120;

        // --- Bandera España ---
        // Franja roja arriba
        this.add.rectangle(esX, flagY - flagH/2 + flagH/6, flagW, flagH/3, 0xc60b1e);
        // Franja amarilla
        this.add.rectangle(esX, flagY, flagW, flagH/3, 0xffc400);
        // Franja roja abajo
        this.add.rectangle(esX, flagY + flagH/2 - flagH/6, flagW, flagH/3, 0xc60b1e);

        // --- Bandera UK ---
        // Fondo azul
        this.add.rectangle(enX, flagY, flagW, flagH, 0x012169);
        // Diagonales blancas (X)
        this.drawDiagonal(enX, flagY, flagW, flagH, 0xffffff, 14);
        // Diagonales rojas (X)
        this.drawDiagonal(enX, flagY, flagW, flagH, 0xc8102e, 7);
        // Cruz blanca horizontal y vertical
        this.add.rectangle(enX, flagY, flagW, 20, 0xffffff);
        this.add.rectangle(enX, flagY, 20, flagH, 0xffffff);
        // Cruz roja horizontal y vertical
        this.add.rectangle(enX, flagY, flagW, 10, 0xc8102e);
        this.add.rectangle(enX, flagY, 10, flagH, 0xc8102e);

        // Selector
        this.selector = this.add.rectangle(esX, flagY, flagW + 10, flagH + 10)
            .setStrokeStyle(3, 0x7deeff)
            .setFillStyle(0x7deeff, 0.08);

        this.selectorPositions = [esX, enX];

        // Texto ENTER
        this.add.text(centerX, centerY + 130, 'ENTER', {
            fontFamily: 'vhs-gothic',
            fontSize: '28px',
            color: '#7deeffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.gamepadController = new GamePadController(this);
        this.gamepadController.getGamepads();
    }

    drawDiagonal(cx, cy, w, h, color, thickness) {
        const graphics = this.add.graphics();
        graphics.lineStyle(thickness, color, 1);
        // diagonal \
        graphics.beginPath();
        graphics.moveTo(cx - w/2, cy - h/2);
        graphics.lineTo(cx + w/2, cy + h/2);
        graphics.strokePath();
        // diagonal /
        graphics.beginPath();
        graphics.moveTo(cx + w/2, cy - h/2);
        graphics.lineTo(cx - w/2, cy + h/2);
        graphics.strokePath();
    }

    update() {
        this.gamepadController.update();
        const input = this.gamepadController.getInput();

        const goLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left) || input.joy1.izquierda || input.joy2.izquierda;
        const goRight = Phaser.Input.Keyboard.JustDown(this.cursors.right) || input.joy1.derecha || input.joy2.derecha;
        const confirm = Phaser.Input.Keyboard.JustDown(this.enterKey) || input.joy1.accion || input.joy2.accion;

        if (goLeft && this.selectedIndex > 0) {
            this.selectedIndex--;
            this.selector.x = this.selectorPositions[this.selectedIndex];
        }

        if (goRight && this.selectedIndex < this.options.length - 1) {
            this.selectedIndex++;
            this.selector.x = this.selectorPositions[this.selectedIndex];
        }

        if (confirm && this.canInput) {
            this.canInput = false;
            const lang = this.options[this.selectedIndex];
            getTranslations(lang, () => {
                this.scene.start('MainMenu');
            });
        }
    }
}