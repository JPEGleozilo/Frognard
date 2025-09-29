export default class Disparo {
    constructor(scene, jugador, reticula, color = 0xff0000) {
        this.scene = scene;
        this.jugador = jugador;
        this.reticula = reticula;
        this.color = color;

        // Línea que conecta jugador ↔ punta
        this.linea = this.scene.add.line(0, 0, 0, 0, 0, 0, color)
            .setOrigin(0, 0)
            .setLineWidth(4)
            .setVisible(false);

        // Bolita en la punta
        this.punta = this.scene.add.circle(jugador.x, jugador.y, 8, color)
            .setVisible(false);

        this.velocidad = 800;
        this.atacando = false;
        this.fase = "ida";
    }

    disparar() {
        if (this.atacando) return;
        this.atacando = true;
        this.fase = "ida";

        this.punta.setPosition(this.jugador.x, this.jugador.y);
        this.linea.setVisible(true);
        this.punta.setVisible(true);
    }

    update(time, delta) {
        if (!this.atacando) return;

        let objetivo = (this.fase === "ida") ? this.reticula : this.jugador;
        let dx = objetivo.x - this.punta.x;
        let dy = objetivo.y - this.punta.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 5) {
            if (this.fase === "ida") {
                this.fase = "vuelta";
            } else {
                this.resetear();
            }
            return;
        }

        let dirX = dx / dist;
        let dirY = dy / dist;
        this.punta.x += dirX * this.velocidad * (delta/1000);
        this.punta.y += dirY * this.velocidad * (delta/1000);

        // 🔴 Actualizar la línea cada frame
        this.linea.setTo(
            this.jugador.x, this.jugador.y,
            this.punta.x, this.punta.y
        );
    }

    resetear() {
        this.atacando = false;
        this.linea.setVisible(false);
        this.punta.setVisible(false);
    }
}
