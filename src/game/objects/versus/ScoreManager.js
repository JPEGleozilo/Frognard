export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            player1: 0,
            player2: 0
        };

        // Textos en pantalla
        //texto verde 
        this.scoreTextP1 = scene.add.text(200, 510, '0', {
            fontSize: '24px',           // aumenta el tamaño
            fill: 'rgba(32, 209, 32, 1)',
            fontFamily: 'Arial Black',
            fontStyle: 'bold',
            stroke: '#000',             // borde negro
            strokeThickness: 4          // grosor del borde
        });
        this.scoreTextP1.setStyle({ fontWeight: 'bold' });

        //texto azul
        this.scoreTextP2 = scene.add.text(700, 510, '0', {
            fontSize: '24px',
            fill: 'rgba(91, 100, 129, 1)',
            fontFamily: 'Arial Black',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        });
        this.scoreTextP2.setStyle({ fontWeight: 'bold' });
    }

    // Observer: recibe notificación de captura
    onMoscaCaptured(playerId) {
        this.scores[playerId] += 1;
        this.updateUI(playerId);
    }

    // Refrescar textos
    updateUI(playerId) {
        if (playerId === 'player1') {
            this.scoreTextP1.setText(this.scores.player1);
        } else if (playerId === 'player2') {
            this.scoreTextP2.setText(this.scores.player2);
        }
    }
}
