import { Boot } from './scenes/Boot';
import { Coop } from './scenes/Coop';
import { Versus } from './scenes/Versus';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { ModificadorRuleta } from './scenes/ModificadorRuleta';
import {VersusFinal } from './scenes/VersusFInal';
import { AUTO, Game, Physics } from 'phaser';
import FirebasePlugin from '../plugins/FirebasePlugin.js';
import { LanguageSelect } from './scenes/LanguageSelect';

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
            debug: false
        }
    },
    input: {
        gamepad: true, // Esto habilita el soporte de gamepad
        keyboard: true,
        mouse: true,
        touch: true
    },
    plugins: {
        global: [{
        key: "FirebasePlugin",
        plugin: FirebasePlugin,
        start: true,
        mapping: "firebase",
        }]
    },
    scene: [
        Boot,
        Preloader,
        LanguageSelect,
        Coop,
        MainMenu,
        Versus,
        ModificadorRuleta,
        VersusFinal
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
