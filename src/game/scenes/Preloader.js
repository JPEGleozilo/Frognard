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

          this.cargaAnim = this.add.sprite(centerX, centerY, 'carga', 0).setScale(1);
    
        this.cargaFinal = false;
    }


    preload ()
    {
        this.anims.create({
        key: 'carga_anim',
        frames: this.anims.generateFrameNumbers('carga', { start: 0, end: 5 }),
        frameRate: 1.5
        });

        this.cargaAnim.play('carga_anim');
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('public');

        this.load.image('logo', 'assets/frognardtitulo.png');
        console.log("logo cargado");

        this.load.image("fondo", "assets/fondo 1.png");
        console.log("fondo cargado");

        //this.load.spritesheet("carga", "assets/cargaanim.png", { frameWidth: 960, frameHeight: 540 });
        //console.log("carga cargado");
        

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

        this.load.spritesheet("boton horizontal", "assets/boton.png", { frameWidth: 62, frameHeight: 32 });
        console.log("boton horizontal cargado");

        this.load.spritesheet("boton vertical", "assets/boton (1).png", { frameWidth: 32, frameHeight: 62 });
        console.log("boton vertical cargado");

        this.load.image("puerta", "assets/puerta.png");
        console.log("puerta cargado");

        this.load.image("caja", "assets/caja.png");
        console.log("caja cargado");

        this.load.tilemapTiledJSON("mapaNivel1", "tilemaps/nivel1.json");
        this.load.tilemapTiledJSON("mapaNivel2", "tilemaps/nivel2.json");

        this.cargaFinal = true;
    }

    update() {
        if (this.cargaFinal === true && this.cargaAnim.anims.currentFrame.index === 5){
            this.time.delayedCall(2000, () => {
                this.scene.start("MainMenu");
            });
        }
    }
}