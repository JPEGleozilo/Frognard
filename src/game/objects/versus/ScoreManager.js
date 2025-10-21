export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            player1: 0,
            player2: 0
        };
    }


    // ahora acepta (playerId, puntos = 1, x, y)
    onMoscaCaptured(playerId, puntos = 1, x = null, y = null) {
        if (!this.scores[playerId]) this.scores[playerId] = 0;
        this.scores[playerId] += puntos;

        // actualizar UI 
        if (this.updateUI) this.updateUI(playerId);

        // emitir popup para que la escena muestre la animacion
        if (this.scene && this.scene.events) {
            // si no vienen coords, intentar obtener la posición del personaje
            if (x == null || y == null) {
                const p = (playerId === 'player1') ? this.scene.rana : this.scene.rata;
                if (p) { x = p.x; y = p.y; }
            }
            this.scene.events.emit('scorePopup', { x, y, value: puntos, player: playerId });
        }
    }

    // Refrescar textos
    updateUI(playerId) {
        if (!this.scene) return;
        if (playerId === 'player1' && this.scene.scoreTextP1) {
            this.scene.scoreTextP1.setText(String(this.scores.player1));
        } else if (playerId === 'player2' && this.scene.scoreTextP2) {
            this.scene.scoreTextP2.setText(String(this.scores.player2));
        }
    }

    getScores() {
        return { ...this.scores };
    }
}

