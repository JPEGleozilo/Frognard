export default class Disparo {
    constructor(scene, jugador, mira, color, speed = 12) {
        this.scene = scene;
        this.jugador = jugador;
        this.mira = mira;
        this.color = color;
        this.speed = speed; // px por segundo (usar en update)
        this.active = false;
        this.length = 0;
        this.maxLength = 0;
        this.extending = false;

        this.line = this.scene.add.line(0, 0, 0, 0, 0, 0, color).setOrigin(0, 0);
        this.line.setAlpha(0);
        this.line.setLineWidth(6);

        this.lengua = this.scene.add.sprite(jugador.x, jugador.y, 'lengua');
        this.lengua.setVisible(false);
        this.lengua.setScale(2);
        this.lengua.setOrigin(0, 0.5);
        this.lengua.setDepth(100);

        this.angle = 0;
        this.targetMosca = null;
    }

    disparar() {
        if (!this.active) {
            this.angle = Phaser.Math.Angle.Between(this.jugador.x, this.jugador.y, this.mira.x, this.mira.y);
            this.maxLength = Phaser.Math.Distance.Between(this.jugador.x, this.jugador.y, this.mira.x, this.mira.y);

            this.length = 0;
            this.extending = true;
            this.active = true;

            this.lengua.x = this.jugador.x;
            this.lengua.y = this.jugador.y;
            this.lengua.rotation = this.angle;
            this.lengua.displayWidth = 0;
            this.lengua.setVisible(true);
            if (this.line) this.line.setAlpha(0);
        }
    }

    update(moscaPool, moscaDoradaPool, moscaImpostorPool, time, delta) {
        if (!this.active || !this.line) return;
        const dt = (delta !== undefined) ? delta / 5000 : (this.scene.game.loop.delta / 15);

        if (this.extending) {
            this.length += this.speed * dt;
            if (this.length >= this.maxLength) {
                this.length = this.maxLength;
                this.extending = false;
            }
        } else {
            this.length -= this.speed * dt;
            if (this.length <= 0) {
                this.destroy();
                return;
            }
        }

        this.angle = Phaser.Math.Angle.Between(this.jugador.x, this.jugador.y, this.mira.x, this.mira.y);

        let endX = this.jugador.x + Math.cos(this.angle) * this.length;
        let endY = this.jugador.y + Math.sin(this.angle) * this.length;

        if (this.line) {
            this.line.setTo(this.jugador.x, this.jugador.y, endX, endY);
        }

        if (this.lengua) {
            this.lengua.setVisible(this.active);
            this.lengua.x = this.jugador.x;
            this.lengua.y = this.jugador.y;
            this.lengua.rotation = this.angle;
            this.lengua.displayWidth = this.length;
            this.lengua.displayHeight = 30;
            this.lengua.setDepth(100);
        }

        if (this.targetMosca) {
            this.targetMosca.x = endX;
            this.targetMosca.y = endY;
        }

        // --- DETECCIÓN DE COLISIONES ---
        if (this.extending && !this.targetMosca) {

            // Moscas normales
            moscaPool.pool.forEach(m => {
                if (m.active && Phaser.Math.Distance.Between(m.x, m.y, endX, endY) < 15) {
                    this.capturarMosca(m);
                }
            });

            // Moscas doradas
            if (moscaDoradaPool) {
                moscaDoradaPool.pool.forEach(m => {
                    if (m.active && Phaser.Math.Distance.Between(m.x, m.y, endX, endY) < 15) {
                        this.capturarMosca(m);
                    }
                });
            }

            // 🪰 Moscas impostoras (nuevo)
            if (moscaImpostorPool && moscaImpostorPool.pool) {
                moscaImpostorPool.pool.forEach(m => {
                    if (m.active && Phaser.Math.Distance.Between(m.x, m.y, endX, endY) < 15) {
                        this.capturarMosca(m);
        }
    });
}

        }
    }

    //  centralizamos la lógica de captura en un solo método
    capturarMosca(mosca) {
        this.targetMosca = mosca;
        mosca.active = false;

        if (this.jugador.captureMosca) {
            this.jugador.captureMosca(mosca);
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
            this.targetMosca.despawn();
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
}
