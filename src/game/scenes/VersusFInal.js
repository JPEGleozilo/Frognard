import { Scene } from 'phaser';

export class VersusFinal extends Scene {
    constructor() {
        super({ key: 'VersusFinal' });
    }

    init(data) {
        this.winner = data.winner;
        this.frogFlies = data.frogFlies || 0;
        this.ratFlies = data.ratFlies || 0;
        this.scores = data.scores || {};
    }

    create() {
        // Fondo oscuro inicial
        this.cameras.main.setBackgroundColor('#222222');

        // Escenario
        const stage = this.add.rectangle(280, 380, 300, 120, 0x444444).setOrigin(0.5);

        //  Luces tipo reflectores (círculos)
        const leftLight = this.add.circle(100, 100, 100, 0xffffcc, 0.4).setBlendMode('ADD').setAlpha(0);
        const rightLight = this.add.circle(460, 100, 100, 0xffffcc, 0.4).setBlendMode('ADD').setAlpha(0);

        //  Sprites
        const rana = this.add.image(200, 215, 'rana').setScale(3).setOrigin(0.5);
        const rata = this.add.image(360, 215, 'rata').setScale(3).setOrigin(0.5);

        rana.setTint(0x000000);
        rata.setTint(0x000000);
        rana.setAlpha(0);
        rata.setAlpha(0);

        //  Posicionar directamente según el ganador
        if (this.winner === 'rana') {
            rana.x = 280; // al centro
            rata.x = 360;
        } else if (this.winner === 'rata') {
            rata.x = 276; // al centro
            rana.x = 200;
        } else if (this.winner === 'empate') {
            rana.x = 200;
            rata.x = 360;
        }

        // Textos
        const resultText = this.add.text(280, 350, '', {
            fontSize: '32px',
            color: '#e9e9e9ff',
            fontFamily: 'Arial',
        }).setOrigin(0.5).setAlpha(0);

        const statsText = this.add.text(680, 100, '', {
            fontSize: '38px',
            color: '#e9e9e9ff',
            fontFamily: 'Arial',
            align: 'center',
        }).setOrigin(0.5).setAlpha(0);

        const btn = this.add.text(680, 450, 'Volver al menú', {
            fontSize: '24px',
            color: '#00aa00',
            backgroundColor: '#cccccc',
            padding: { x: 10, y: 5 },
            fontFamily: 'Arial',
        }).setOrigin(0.5).setInteractive().setAlpha(0);

        btn.on('pointerdown', () => {
            this.scene.stop('Versus');
            this.scene.start('MainMenu');
        });

        // Aparecen las luces moviéndose
        this.time.delayedCall(400, () => {
            this.tweens.add({
                targets: leftLight,
                alpha: { from: 0, to: 0.6 },
                x: { from: 50, to: 200 },
                y: { from: 80, to: 220 },
                duration: 1500,
                ease: 'Sine.easeInOut'
            });

            this.tweens.add({
                targets: rightLight,
                alpha: { from: 0, to: 0.6 },
                x: { from: 510, to: 360 },
                y: { from: 80, to: 220 },
                duration: 1500,
                ease: 'Sine.easeInOut'
            });
        });

        // Las luces convergen y muestran la silueta
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: [leftLight, rightLight],
                x: 280,
                y: 220,
                alpha: { from: 0.6, to: 0.8 },
                duration: 800,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    // Mostrar silueta negra
                    if (this.winner === 'empate') {
                        rana.setAlpha(1);
                        rata.setAlpha(1);
                    } else if (this.winner === 'rana') {
                        rana.setAlpha(1);
                    } else {
                        rata.setAlpha(1);
                    }
                }
            });
        });

        // Revela al ganador
        this.time.delayedCall(3500, () => {
            if (this.winner === 'empate') {
                rana.clearTint();
                rata.clearTint();
                resultText.setText('¡Empate!');
            } else if (this.winner === 'rana') {
                rana.clearTint();
                resultText.setText('¡La Rana ganó!');
                // Atenuar la luz contraria
                this.tweens.add({ targets: rightLight, alpha: 0.3, duration: 1000 });
            } else {
                rata.clearTint();
                resultText.setText('¡La Rata ganó!');
                this.tweens.add({ targets: leftLight, alpha: 0.3, duration: 1000 });
            }

            this.tweens.add({
                targets: resultText,
                alpha: { from: 0, to: 1 },
                duration: 600,
                ease: 'Sine.easeIn'
            });
        });

        // Estadísticas finales
        this.time.delayedCall(5000, () => {
            statsText.setText(
                `Moscas recolectadas:\n\n     Rana: ${this.frogFlies}\n   Rata: ${this.ratFlies}`
            );

            this.tweens.add({
                targets: [statsText, btn],
                alpha: { from: 0, to: 1 },
                duration: 800,
                ease: 'Sine.easeIn'
            });
        });
    }
}
