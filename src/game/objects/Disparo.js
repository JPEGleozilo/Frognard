export default class Disparo {
    constructor(scene, jugador, mira, color) {
        this.scene = scene;
        this.jugador = jugador;
        this.mira = mira;
        this.color = color;

        this.maxLength = Phaser.Math.Distance.Between(jugador.x, jugador.y, mira.x, mira.y);
        this.speed = 12;
        this.extending = true;
        this.length = 0;

        this.line = this.scene.add.line(0, 0, 0, 0, 0, 0, color).setOrigin(0, 0);
        this.line.setLineWidth(6);

        this.angle = Phaser.Math.Angle.Between(jugador.x, jugador.y, mira.x, mira.y);

        this.targetMosca = null; // ← guarda la mosca atrapada
        this.active = true;
    }

    update(moscaPool) {
        if (!this.active || !this.line) return; // <-- evita el error si la línea no existe

        if (this.extending) {
            this.length += this.speed;
            if (this.length >= this.maxLength) {
                this.extending = false; // empieza a retraerse
            }
        } else {
            this.length -= this.speed;
            if (this.length <= 0) {
                this.destroy();
                return; // <-- termina la función después de destruir
            }
        }

        // actualizar visual
        let endX = this.jugador.x + Math.cos(this.angle) * this.length;
        let endY = this.jugador.y + Math.sin(this.angle) * this.length;

        // Solo actualiza la línea si existe
        if (this.line) {
            this.line.setTo(this.jugador.x, this.jugador.y, endX, endY);
        }

        // si atrapó mosca → moverla con el disparo
        if (this.targetMosca) {
            this.targetMosca.x = endX;
            this.targetMosca.y = endY;
        }

        // check colisiones solo cuando se extiende y no tiene mosca
        if (this.extending && !this.targetMosca) {
            moscaPool.pool.forEach(m => {
                if (m.active && Phaser.Math.Distance.Between(m.x, m.y, endX, endY) < 15) {
                    this.targetMosca = m;
                    m.active = false; // bloquear para que no lo agarre otro
                    // Notificar al personaje que atrapó una mosca
                    if (this.jugador.captureMosca) {
                        this.jugador.captureMosca(m);
                    }
                }
            });
        }
    }

    destroy() {
        if (this.line) {
            this.line.destroy();
            this.line = null;
        }
        if (this.targetMosca) {
            this.targetMosca.x = this.jugador.x;
            this.targetMosca.y = this.jugador.y;
            this.targetMosca.despawn(); // aquí se oculta y vuelve al pool
            this.targetMosca = null;
            if (this.jugador.capturedMosca) {
                this.jugador.capturedMosca = null;
            }
        }
        this.active = false;
    }

    disparar() {
        if (!this.active) {
            this.length = 0;
            this.extending = true;
            this.active = true;
            this.angle = Phaser.Math.Angle.Between(this.jugador.x, this.jugador.y, this.mira.x, this.mira.y);
            this.maxLength = Phaser.Math.Distance.Between(this.jugador.x, this.jugador.y, this.mira.x, this.mira.y);

            // Si la línea fue destruida, créala de nuevo
            if (!this.line) {
                this.line = this.scene.add.line(0, 0, 0, 0, 0, 0, this.color).setOrigin(0, 0);
                this.line.setLineWidth(6);
            }

            this.line.setVisible(true);
        }
    }
}
