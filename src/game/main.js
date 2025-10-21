import { Boot } from './scenes/Boot';
import { Coop } from './scenes/Coop';
import { CoopNivel2 } from './scenes/Coop nivel2';
import { CoopNivel3 } from './scenes/Coop nivel3';
import { CoopNivel4 } from './scenes/Coop nivel4';
import { Versus } from './scenes/Versus';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { ModificadorRuleta } from './scenes/ModificadorRuleta';
import {VersusFinal } from './scenes/VersusFInal';
import { AUTO, Game, Physics } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'game-container',
    render: {
    pixelArt: true,
    antialias: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }, physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    },
    input: {
        gamepad: true, // Esto habilita el soporte de gamepad
        keyboard: true,
        mouse: true,
        touch: true
    },
    scene: [
        Boot,
        Preloader,
        Coop,
        CoopNivel2,
        CoopNivel3,
        CoopNivel4,
        MainMenu,
        Versus,
        GameOver,
        ModificadorRuleta,
        VersusFinal
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
