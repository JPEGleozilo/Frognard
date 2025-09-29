export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            player1: 0,
            player2: 0
        };

        // Textos en pantalla
        //texto verde 
        this.scoreTextP1 = scene.add.text(200, 510, '0', { fontSize: '32px', fill: '#0f0' });
        //texto rojo
        this.scoreTextP2 = scene.add.text(700, 510, '0', { fontSize: '32px', fill: '#f00' });
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
