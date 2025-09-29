export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            player1: 0,
            player2: 0
        };

        // Textos en pantalla
        this.scoreTextP1 = scene.add.text(20, 20, 'Jugador 1: 0', { fontSize: '16px', fill: '#fff' });
        this.scoreTextP2 = scene.add.text(20, 40, 'Jugador 2: 0', { fontSize: '16px', fill: '#fff' });
    }

    // Observer: recibe notificación de captura
    onMoscaCaptured(playerId) {
        this.scores[playerId] += 1;
        this.updateUI(playerId);
    }

    // Refrescar textos
    updateUI(playerId) {
        if (playerId === 'player1') {
            this.scoreTextP1.setText('Jugador 1: ' + this.scores.player1);
        } else if (playerId === 'player2') {
            this.scoreTextP2.setText('Jugador 2: ' + this.scores.player2);
        }
    }
}
