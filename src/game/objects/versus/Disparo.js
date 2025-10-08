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
        this.line.setAlpha(0); // ← Haz la línea invisible

        // --- Sprite visual de la lengua ---
        this.lengua = this.scene.add.sprite(jugador.x, jugador.y, 'lengua');
        this.lengua.setScale(2);
        this.lengua.setOrigin(0, 0.5);
        this.lengua.setVisible(false);
        this.lengua.setDepth(100);

        this.angle = Phaser.Math.Angle.Between(jugador.x, jugador.y, mira.x, mira.y);

        this.targetMosca = null; // ← guarda la mosca atrapada
        this.active = true;
    }

    update(moscaPool, moscaDoradaPool) {
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

        // calcular el ángulo entre el jugador y la mira
        this.angle = Phaser.Math.Angle.Between(this.jugador.x, this.jugador.y, this.mira.x, this.mira.y);

        // Calcula el final de la lengua
        let endX = this.jugador.x + Math.cos(this.angle) * this.length;
        let endY = this.jugador.y + Math.sin(this.angle) * this.length;

        // Actualiza la línea lógica (invisible)
        if (this.line) {
            this.line.setTo(this.jugador.x, this.jugador.y, endX, endY);
        }

        // --- Actualiza la lengua visual ---
        if (this.lengua) {
            this.lengua.x = this.jugador.x;
            this.lengua.y = this.jugador.y;
            this.lengua.rotation = this.angle;
            this.lengua.displayWidth = this.length;
            this.lengua.displayHeight = 20; // ajusta al alto real de tu sprite
            this.lengua.setVisible(this.active);
            this.lengua.setDepth(100); // asegúrate que esté al frente
        }

        // si atrapó mosca → moverla con el disparo
        if (this.targetMosca) {
            this.targetMosca.x = endX;
            this.targetMosca.y = endY;
        }

        // check colisiones solo cuando se extiende y no tiene mosca
        if (this.extending && !this.targetMosca) {
            // Moscas normales
            moscaPool.pool.forEach(m => {
                if (m.active && Phaser.Math.Distance.Between(m.x, m.y, endX, endY) < 15) {
                    this.targetMosca = m;
                    m.active = false;
                    if (this.jugador.captureMosca) {
                        this.jugador.captureMosca(m);
                    }
                }
            });
            // Moscas doradas
            if (moscaDoradaPool) {
                moscaDoradaPool.pool.forEach(m => {
                    if (m.active && Phaser.Math.Distance.Between(m.x, m.y, endX, endY) < 15) {
                        this.targetMosca = m;
                        m.active = false;
                        if (this.jugador.captureMosca) {
                            this.jugador.captureMosca(m);
                        }
                    }
                });
            }
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
        if (this.lengua) {
            this.lengua.destroy();
            this.lengua = null;
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
                this.line.setAlpha(0); // ← Haz la línea invisible
            }
            // Si la lengua fue destruida, créala de nuevo
            if (!this.lengua) {
                this.lengua = this.scene.add.sprite(this.jugador.x, this.jugador.y, 'lengua');
                this.lengua.setScale(2);
                this.lengua.setOrigin(0, 0.5);
                this.lengua.setDepth(100);
            }
            this.lengua.setVisible(true);
        }
    }
}
