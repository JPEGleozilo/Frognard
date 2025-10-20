import Phaser from 'phaser';

export default class StateMachine {
    constructor(estadoInicial, estadosPosibles, stateArgs=[]) {
        this.estadoInicial = estadoInicial;
        this.estadosPosibles = estadosPosibles;
        this.stateArgs = stateArgs;
        this.estado = null;
            
        for (const state of Object.values(this.estadosPosibles)) {
            state.stateMachine = this;
        };
    }

    step() {
        if (this.estado === null) {
            this.estado = this.estadoInicial;
            this.estadosPosibles[this.estado].enter(...this.stateArgs);
        }

        this.estadosPosibles[this.estado].execute(...this.stateArgs);
    }

    transicion(nuevoEstado, ...enterArgs) {
        this.estado = nuevoEstado;
        this.estadosPosibles[this.estado].enter(...this.stateArgs, ...enterArgs);
    }

}

export class State {
    
    enter () {
    }

    execute () {
    }

    exit() {
    }
    }