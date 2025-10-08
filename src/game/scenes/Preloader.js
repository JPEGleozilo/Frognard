import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

     init() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Marco del progreso
        this.add.rectangle(centerX, centerY + 200, 468, 32).setStrokeStyle(2, 0xffffff);

        // Barra de progreso (inicialmente vacía)
        this.bar = this.add.rectangle(centerX - 230, centerY + 200, 4, 28, 0xffffff).setOrigin(0, 0.5);

        // Sprite de animación de carga (primero frame)
        this.cargaAnim = this.add.sprite(centerX, centerY, 'carga', 0).setScale(1);
    }


    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('public');

        this.load.image('logo', 'assets/frognardtitulo.png');
        console.log("logo cargado");

        this.load.image("fondo", "assets/fondo 1.png");
        console.log("fondo cargado");

        this.load.spritesheet("carga", "assets/cargaanim.png", { frameWidth: 960, frameHeight: 540 });
        console.log("carga cargado");
        

        this.load.image('MiraRana', 'assets/MiraRana.png');
        console.log("mira rana cargado");

        this.load.image('MiraRata', 'assets/MiraRata.png');
        console.log("mira rata cargado");

        this.load.spritesheet("rana", "assets/rana.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rana cargado");

        this.load.spritesheet("rana disparo", "assets/ranadisparo.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rata disparo cargado");

        this.load.spritesheet("rata", "assets/rata.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rata cargado");
        

        this.load.spritesheet("mosca spritesheet", "assets/mosca spritesheet.png", { frameWidth: 52, frameHeight: 52 });
        console.log("mosca cargado");

        this.load.spritesheet("mosca dorada spritesheet", "assets/mosca dorada spritesheet.png", { frameWidth: 52, frameHeight: 52 });
        console.log("mosca dorada cargado");

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

           // --- Actualización visual durante la carga ---
        this.load.on('progress', (progress) => {
            // Actualiza barra
            this.bar.width = 4 + (460 * progress);

            // Actualiza frame de sprite según progreso
            if (this.cargaAnim) {
                const totalFrames = 6; // Ajusta según tu spritesheet
                const frame = Math.floor(progress * (totalFrames - 1));
                this.cargaAnim.setFrame(frame);
            }
        });
       // Cuando la carga termina
        this.load.on('complete', () => {
            // Asegura que el sprite muestre el último frame
            if (this.cargaAnim) this.cargaAnim.setFrame(5);

            // Pequeña pausa antes de cambiar de escena (opcional)
            this.time.delayedCall(1000, () => {
                this.scene.start('MainMenu');
            });
        });
    }


    create ()
    {
        
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
