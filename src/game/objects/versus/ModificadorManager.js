export default class ModificadorManager {
    constructor(scene) {
        this.scene = scene;
        this.modificadoresActivos = [];
        this.todosLosModificadores = [
            "controlesInvertidos",
            "pantallaInvertida",
            "moscasPequeñas",
            "moscasRapidas",
            "moscasFantasmas",
            "moscasLocas",
            "reticulasLentas",
            "reticulasRapidas",
        ];

        // Si necesitás timers internos para ciertos modificadores, guardalos aquí
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

    resetVisualsForReapply() {
        // ejemplo: restaurar cámara, retículas, moscas para reaplicar (no tocar pool)
        this.scene.cameras.main.setRotation(0);
        this.scene.controlesInvertidos = false;
        this.scene.velocidadReticula = this.scene.velocidadReticula ?? 1;

        // Restablecer moscas activas a parámetros base si hace falta
        if (this.scene.moscaPool && this.scene.moscaPool.pool) {
            this.scene.moscaPool.pool.forEach(m => {
                if (m && m.active) {
                    m.setScale(1);
                    m.alpha = 1;
                    // si Mosca tiene propiedades base, podrías restaurarlas aquí
                }
            });
        }

        // cancelar event erratic si existiera (por reaplicar)
        if (this._erraticEvent) {
            this._erraticEvent.remove(false);
            this._erraticEvent = null;
        }
    }

    aplicarModificador(nombre) {
        // Si recibe un objeto, usa el campo nombre
        if (typeof nombre === 'object' && nombre.nombre) {
            nombre = nombre.nombre;
        }
        console.log("Aplicando modificador:", nombre);

        switch (nombre) {
            case "pantallaInvertida":
                this.scene.cameras.main.setRotation(Math.PI);
                break;
            case "controlesInvertidos":
                this.scene.controlesInvertidos = true;
                break;
            case "moscasPequeñas":
  this.efectosMosca.escalar = 0.6;
  this.scene.moscaPool?.pool.forEach(m => { if (m.active) m.setScale(0.6); });
  break;

case "moscasRapidas":
  this.efectosMosca.velMultiplicador = 2;
  this.scene.moscaPool?.pool.forEach(m => { if (m.active) m.velX *= 1.5; });
  break;

case "moscasFantasmas":
  this.efectosMosca.fantasmas = true;
  this.scene.moscaPool?.pool.forEach(m => {
    if (m.active) this.scene.tweens.add({
      targets: m,
      alpha: { from: 0.1, to: 1 },
      duration: 3500,
      yoyo: true,
      repeat: -1,
    });
  });
  break;
            case "moscasLocas":
                if (this.scene.moscaPool?.pool) {
                    // evento que periódicamente cambia direcciones
                    this._erraticEvent = this.scene.time.addEvent({
                        delay: 800,
                        loop: true,
                        callback: () => {
                            this.scene.moscaPool.pool.forEach(m => {
                                if (m && m.active) {
                                    m.velX = -m.velX * Phaser.Math.FloatBetween(0.9, 1.3);
                                    m.amplitud = Phaser.Math.Between(120, 470);
                                }
                            });
                        }
                    });
                }
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
  this.efectosMosca = { escalar: 1, velMultiplicador: 1, fantasmas: false, locas: false };
  this.resetVisualsForReapply();
}
}