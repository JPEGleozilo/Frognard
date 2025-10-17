export default class ModificadorManager {
    constructor(scene) {
        this.scene = scene;
        this.modificadoresActivos = [];
        this.todosLosModificadores = [
            "pantallaInvertida",
            "moscasPequeñas",
            "moscasRapidas",
            "moscasFantasmas",
            "reticulasLentas",
            "reticulasRapidas",
        ];

        // timers / estado interno
        this._erraticEvent = null;
        this.efectosMosca = {
            escalar: 1,
            velMultiplicador: 1,
            fantasmas: false,
            locas: false
        };
    }

    // (Si aún mantienes seleccionarSegunRonda, está bien; la ruleta la puede llamar y setear modificadoresActivos)
    seleccionarSegunRonda(rondaActual) {
        console.log("Seleccionando modificador para ronda:", rondaActual);

        if (rondaActual === 2) {
            const nuevo = Phaser.Utils.Array.GetRandom(this.todosLosModificadores);
            if (!this.modificadoresActivos.includes(nuevo)) this.modificadoresActivos.push(nuevo);
            this.aplicarModificador(nuevo);
        } else if (rondaActual === 3) {
            const disponibles = this.todosLosModificadores.filter(
                mod => !this.modificadoresActivos.includes(mod)
            );
            const nuevo = Phaser.Utils.Array.GetRandom(disponibles);
            if (nuevo) {
              this.modificadoresActivos.push(nuevo);
              this.aplicarModificador(nuevo);
            }
        }
    }

    // --- NUEVO: aplica todos los activos (usado cuando reanudas la ronda) ---
    aplicarModificadoresActivos() {
        // limpia efectos repetidos problemáticos (evita stacking indeseado) si corresponde
        // Ej: reseteamos primero estado visual que puede reaplicarse
        this.resetVisualsForReapply();

        this.modificadoresActivos.forEach(m => {
            this.aplicarModificador(m);
        });
    }

    // limpiar efectos visuales y de movimiento antes de reaplicar
    resetVisualsForReapply() {
        this.scene.cameras.main.setRotation(0);
        this.scene.velocidadReticula = 1;

        // restaura moscas normales y doradas
        const resetOne = (m) => {
            if (!m || !m.active) return;
            m.setScale(1);
            m.alpha = 1;
            if (m.baseVelXOriginal != null) {
                m.velX = m.baseVelXOriginal;
            }
            if (m.baseAmplitudOriginal != null) {
                m.amplitud = m.baseAmplitudOriginal;
            }
        };

        if (this.scene.moscaPool?.pool) {
            this.scene.moscaPool.pool.forEach(resetOne);
        }
        if (this.scene.moscaDoradaPool?.pool) {
            this.scene.moscaDoradaPool.pool.forEach(resetOne);
        }

        // cancelar event erratic si existiera
        if (this._erraticEvent) {
            this._erraticEvent.remove(false);
            this._erraticEvent = null;
        }

        // reset efecto
        this.efectosMosca = { escalar: 1, velMultiplicador: 1, fantasmas: false, locas: false };
    }

    aplicarModificador(nombre) {
        if (typeof nombre === 'object' && nombre.nombre) {
            nombre = nombre.nombre;
        }
        console.log("Aplicando modificador:", nombre);

        // helper para aplicar a todas las moscas activas
        const applyToAllActive = (fn) => {
            if (this.scene.moscaPool?.pool) this.scene.moscaPool.pool.forEach(m => m && m.active && fn(m));
            if (this.scene.moscaDoradaPool?.pool) this.scene.moscaDoradaPool.pool.forEach(m => m && m.active && fn(m));
            if (this.scene.moscaImpostorPool?.pool) this.scene.moscaImpostorPool.pool.forEach(m => m && m.active && fn(m));
        };

        switch (nombre) {
            case "pantallaInvertida":
                this.scene.cameras.main.setRotation(Math.PI);
                break;

            case "moscasPequeñas":
                this.efectosMosca.escalar = 0.7;
                applyToAllActive(m => m.setScale(0.7));
                break;

            case "moscasRapidas":
                this.efectosMosca.velMultiplicador = 1.5;
                applyToAllActive(m => {
                    // asegúrate de tener base original
                    if (m.baseVelXOriginal == null) m.baseVelXOriginal = m.velX;
                    m.velX = m.baseVelXOriginal * this.efectosMosca.velMultiplicador;
                });
                break;

            case "moscasFantasmas":
                this.efectosMosca.fantasmas = true;
                applyToAllActive(m => {
                    // crea tween de alpha si no existe
                    if (!m._fantasmaTween) {
                        m._fantasmaTween = this.scene.tweens.add({
                            targets: m,
                            alpha: { from: 0.1, to: 1 },
                            duration: 3500,
                            yoyo: true,
                            repeat: -1,
                        });
                    }
                });
                break;

            case "reticulasLentas":
                this.scene.velocidadReticula = (this.scene.velocidadReticula ?? 1) * 0.6;
                break;

            case "reticulasRapidas":
                this.scene.velocidadReticula = (this.scene.velocidadReticula ?? 1) * 1.4;
                break;

            default:
                console.warn("Modificador desconocido:", nombre);
        }
    }

    // limpiar todo (cuando reinicias el juego por ejemplo)
    reset() {
        this.modificadoresActivos = [];
        this.resetVisualsForReapply();
    }
}