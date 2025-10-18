export default class ModificadorManager {
    constructor(scene) {
        this.scene = scene;
        this.modificadoresActivos = [];
        this.todosLosModificadores = [
            "pantallaInvertida",
            "moscasPequeñas",
            "moscasGrandes",
            "moscasRapidas",
            "moscasFantasmas",
            "reticulasLentas",
            "reticulasRapidas",
            "disparosLentos",
            "disparosRapidos",
            "fiebreDeMoscasDoradas",
            "fiebreDeMoscasImpostoras"
        ];

        // timers / estado interno
        this._erraticEvent = null;
        this.efectosMosca = {
            escalar: 1,
            velMultiplicador: 1,
            fantasmas: false,
            // nuevos multiplicadores de spawn (1 = normal, <1 = más frecuente)
            spawnMultDorada: 1,
            spawnMultImpostora: 1
        };
    }

    // (Si aún mantienes seleccionarSegunRonda, está bien; la ruleta la puede llamar y setear modificadoresActivos)
    seleccionarSegunRonda(rondaActual) {
        console.log("Seleccionando modificador para ronda:", rondaActual);

        if (rondaActual === 2) {
            const nuevo = Phaser.Utils.Array.GetRandom(this.todosLosModificadores);
            this.addModificador(nuevo);
        } else if (rondaActual === 3) {
            const disponibles = this.todosLosModificadores.filter(
                mod => !this.modificadoresActivos.includes(mod)
            );
            const nuevo = Phaser.Utils.Array.GetRandom(disponibles);
            if (nuevo) this.addModificador(nuevo);
        }
    }

    // Añadir de forma segura un modificador a la lista (normaliza y valida)
    addModificador(mod) {
        if (mod == null) {
            console.warn('Intentando añadir modificador nulo/undefined:', mod);
            return false;
        }

        // extrae key si viene de la ruleta como objeto
        let name = mod;
        if (typeof mod === 'object') {
            name = mod.key ?? mod.nombre ?? mod;
        }

        if (typeof name === 'string') {
            name = this._toCamelCase(name.trim());
        }

        if (!name) {
            console.warn('Modificador inválido al añadir:', mod);
            return false;
        }

        // valida que existe en todosLosModificadores (usar camelCase)
        if (!this.todosLosModificadores.includes(name)) {
            console.warn('Intentando añadir modificador desconocido:', name);
            return false;
        }

        if (!this.modificadoresActivos.includes(name)) {
            this.modificadoresActivos.push(name);
            // aplicar inmediatamente al añadirse (o comentar si no quieres aplicar ahora)
            this.aplicarModificador(name);
        }
        return true;
    }

    // --- NUEVO: aplica todos los activos (usado cuando reanudas la ronda) ---
    aplicarModificadoresActivos() {
        // limpiar antes de reaplicar para evitar stacking
        this.resetVisualsForReapply();

        this.modificadoresActivos.forEach((m, idx) => {
            if (!m) {
                console.warn('modificadoresActivos contiene entrada inválida en índice', idx);
                return;
            }
            try {
                this.aplicarModificador(m);
            } catch (e) {
                console.error('Error aplicando modificador', m, e);
            }
        });
    }

    // limpiar efectos visuales y de movimiento antes de reaplicar
    resetVisualsForReapply() {
        this.scene.cameras.main.setRotation(0);
        this.scene.velocidadReticula = 1;
        this.scene.disparoSpeed = this.scene.disparoSpeedBase ?? 12;

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
        if (this.scene.moscaImpostorPool?.pool) {
            this.scene.moscaImpostorPool.pool.forEach(resetOne);
        }
        // cancelar event erratic si existiera
        if (this._erraticEvent) {
            this._erraticEvent.remove(false);
            this._erraticEvent = null;
        }

        // reset efecto
        this.efectosMosca = {
            escalar: 1,
            velMultiplicador: 1,
            fantasmas: false,
            spawnMultDorada: 1,
            spawnMultImpostora: 1
        };
    }

    aplicarModificador(nombre) {
        if (!nombre) {
            console.warn('aplicarModificador llamado con valor vacío:', nombre);
            return;
        }
        // Aceptar objetos con key/nombre o strings en cualquier formato
        if (typeof nombre === 'object' && nombre != null) {
            if (nombre.key) nombre = nombre.key;
            else if (nombre.nombre) nombre = nombre.nombre;
        }

        if (typeof nombre === 'string') {
            nombre = this._toCamelCase(nombre.trim());
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
                this.scene.cameras.main.setRotation(Phaser.Math.DegToRad(180));
                break;
            case "disparosLentos":
                // guardamos velocidad base si no existe
                if (!this.scene.disparoSpeedBase) this.scene.disparoSpeedBase = 12;
                this.scene.disparoSpeed = this.scene.disparoSpeedBase * 0.8;
                break;
            case "disparosRapidos":
                // guardamos velocidad base si no existe
                if (!this.scene.disparoSpeedBase) this.scene.disparoSpeedBase = 12;
                this.scene.disparoSpeed = this.scene.disparoSpeedBase * 1.3;
                break;
            case "moscasPequeñas":
                this.efectosMosca.escalar = 0.7;
                applyToAllActive(m => {
                    // guarda base si hace falta
                    if (m.baseScaleOriginal == null) m.baseScaleOriginal = m.scaleX ?? 1;
                    m.setScale(this.efectosMosca.escalar);
                });
                break;
            case "moscasGrandes":
                this.efectosMosca.escalar = 1.5;
                applyToAllActive(m => {
                    // guarda base si hace falta
                    if (m.baseScaleOriginal == null) m.baseScaleOriginal = m.scaleX ?? 1;
                    m.setScale(this.efectosMosca.escalar);
                });
                break;
            // mantiene los demás cases en camelCase
            case "moscasRapidas":
                this.efectosMosca.velMultiplicador = 1.5;
                applyToAllActive(m => {
                    if (m.baseVelXOriginal == null) m.baseVelXOriginal = m.velX;
                    m.velX = m.baseVelXOriginal * this.efectosMosca.velMultiplicador;
                });
                break;

            case "moscasFantasmas":
                this.efectosMosca.fantasmas = true;
                applyToAllActive(m => {
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

            case "fiebreDeMoscasDoradas":
                // Reduce el intervalo: 0.35 = ~3x más frecuente (ajusta a tu gusto)
                this.efectosMosca.spawnMultDorada = 0.35;
                break;

            case "fiebreDeMoscasImpostoras":
                this.efectosMosca.spawnMultImpostora = 0.35;
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

    _toCamelCase(name) {
        if (!name || typeof name !== 'string') return name;
        return name.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
    }
}