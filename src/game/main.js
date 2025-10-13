import { Boot } from './scenes/Boot';
import { Coop } from './scenes/Coop';
import { Versus } from './scenes/Versus';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { ModificadorRuleta } from './scenes/ModificadorRuleta';
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
        MainMenu,
        Versus,
        GameOver,
        ModificadorRuleta,
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
