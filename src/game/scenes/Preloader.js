import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('public');

        this.load.image('logo', 'assets/logo.png');
        console.log("logo cargado");

        this.load.image("fondo", "assets/fondo 1.png");
        console.log("fondo cargado");

        this.load.image('MiraRana', 'assets/MiraRana.png');
        console.log("mira rana cargado");

        this.load.image('MiraRata', 'assets/MiraRata.png');
        console.log("mira rata cargado");

        this.load.spritesheet("rana", "assets/rana.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rana cargado");

        this.load.spritesheet("rata", "assets/rata.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rata cargado");
        

        this.load.spritesheet("mosca spritesheet", "assets/mosca spritesheet.png", { frameWidth: 52, frameHeight: 52 });
        console.log("mosca cargado");

        this.load.spritesheet("lengua", "assets/lengua.png", { frameWidth: 540, frameHeight: 20 });
        console.log("lengua cargado");

        console.log("--VERSUS CARGADO--");

        this.load.image("frognard", "assets/frognard.png");
        console.log("frognard cargado");

        this.load.image("patrones", "assets/tileset.png");
        console.log("tileset cargado");

        this.load.image("boton horizontal", "assets/boton.png");
        console.log("boton horizontal cargado");

        this.load.image("boton vertical", "assets/botonVert.png");
        console.log("boton vertical cargado");

        this.load.image("puerta", "assets/puerta.png");
        console.log("puerta cargado");

        this.load.tilemapTiledJSON("mapaNivel1", "tilemaps/nivel1.json");
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
