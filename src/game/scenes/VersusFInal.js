import { Scene } from 'phaser';

export class VersusFinal extends Scene {
    constructor() {
        super({ key: 'VersusFinal' });
    }

    init(data) {
        // Recibe: { winner, frogFlies, ratFlies, scores }
        this.winner = data.winner;
        this.frogFlies = data.frogFlies || 0;
        this.ratFlies = data.ratFlies || 0;
        this.scores = data.scores || {};
    }

    create() {
        // Mostrar ganador o empate
        if (this.winner === 'empate') {
            // Muestra ambos sprites, uno a la izquierda y otro a la derecha
            this.add.image(400, 200, 'rana').setScale(2).setOrigin(0.5);
            this.add.image(560, 200, 'rata').setScale(2).setOrigin(0.5);

            this.add.text(480, 350, '¡Empate!', {
                fontSize: '32px',
                color: '#fff',
                fontFamily: 'Arial',
            }).setOrigin(0.5);
        } else {
            // Muestra solo el sprite del ganador
            const winnerSprite = this.winner === 'rana' ? 'rana' : 'rata';
            this.add.image(480, 200, winnerSprite).setScale(2).setOrigin(0.5);

            this.add.text(480, 350, `¡${this.winner === 'rana' ? 'La Rana' : 'La Rata'} ganó!`, {
                fontSize: '32px',
                color: '#fff',
                fontFamily: 'Arial',
            }).setOrigin(0.5);
        }

        // Mostrar cantidad de moscas recolectadas
        this.add.text(480, 420, `Moscas recolectadas:\nRana: ${this.frogFlies}\nRata: ${this.ratFlies}`, {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            align: 'center',
        }).setOrigin(0.5);

        // Botón para volver al menú
        const btn = this.add.text(480, 500, 'Volver al menú', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#222',
            padding: { x: 10, y: 5 },
            fontFamily: 'Arial',
        }).setOrigin(0.5).setInteractive();

        btn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}