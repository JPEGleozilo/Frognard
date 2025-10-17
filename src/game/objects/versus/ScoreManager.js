export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            player1: 0,
            player2: 0
            
        };
        
        // Textos en pantalla
        //texto verde 
        this.scoreTextP1 = scene.add.text(200, 450, '', {
            fontSize: '38px',          
            fill: 'rgba(16, 145, 15, 1)',
            fontFamily: "PIXELYA",
            fontStyle: 'bold',
        });
    

        //texto azul
        this.scoreTextP2 = scene.add.text(700, 450, '', {
            fontSize: '38px',
            fill: 'rgba(91, 100, 129, 1)',
            fontFamily: "PIXELYA",
            fontStyle: 'bold',
            
        });
        this.updateUI('player1');
        this.updateUI('player2');
    }

    // Observer: recibe notificación de captura
    onMoscaCaptured(playerId, puntos = 1) {
        this.scores[playerId] += puntos;
        if (this.scores[playerId] < 0) {
        this.scores[playerId] = 0;
    }
        this.updateUI(playerId);
    }

    // Refrescar textos
updateUI(playerId) {
    const scoreStrP1 = String(this.scores.player1).padStart(3, '000');
    const scoreStrP2 = String(this.scores.player2).padStart(3, '000');
    if (playerId === 'player1') {
        this.scoreTextP1.setText(scoreStrP1);
    } else if (playerId === 'player2') {
        this.scoreTextP2.setText(scoreStrP2);
    }
}

    //actualizar puntajes al inico
    updateScores(player1Score, player2Score) {
        this.scores.player1 = player1Score;
        this.scores.player2 = player2Score;
        this.updateUI('player1');
        this.updateUI('player2');
    }

    
    getScores() {
        return {
            player1: this.scores.player1,
            player2: this.scores.player2
        };
    }
}

