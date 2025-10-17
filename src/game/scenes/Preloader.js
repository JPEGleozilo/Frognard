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

        this.load.setPath('/assets/fonts');

         this.load.addFile(new Phaser.Loader.FileTypes.CSSFile(this.load, 'font', 'PIXELYA Trial.ttf'));
        console.log("fuente cargada");

        this.cargaAnim.play('carga_anim');
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('/assets');

        this.load.image('logo', 'frognardtitulo.png');
        console.log("logo cargado");

        this.load.image("fondo", "fondo 1.png");
        console.log("fondo cargado");

        //this.load.spritesheet("carga", "cargaanim.png", { frameWidth: 960, frameHeight: 540 });
        //console.log("carga cargado");

        
        this.load.image('MiraRana', 'MiraRana.png');
        console.log("mira rana cargado");

        this.load.image('MiraRata', 'MiraRata.png');
        console.log("mira rata cargado");

        this.load.spritesheet("rana", "rana.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rana cargado");

        this.load.spritesheet("rana disparo", "ranadisparo2.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rana disparo cargado");

        this.load.spritesheet("rata", "rata.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rata cargado");

        this.load.spritesheet("rata disparo", "ratadisparo.png", { frameWidth: 52, frameHeight: 52 });
        console.log("rata cargado");
        

        this.load.spritesheet("mosca spritesheet", "mosca spritesheet.png", { frameWidth: 52, frameHeight: 52 });
        console.log("mosca cargado");

        this.load.spritesheet("mosca dorada spritesheet", "mosca dorada spritesheet.png", { frameWidth: 52, frameHeight: 52 });
        console.log("mosca dorada cargado");

        this.load.spritesheet("lengua", "lengua.png", { frameWidth: 540, frameHeight: 20 });
        console.log("lengua cargado");

        this.load.image("controles_invertidos", "controles_invertidos.png");
        console.log("controles_invertidos cargado");

        this.load.image("pantalla_invertida", "pantalla_invertida.png");
        console.log("pantalla_invertida cargado");

        this.load.image("moscas_pequeñas", "moscas_pequeñas.png");
        console.log("moscas_pequenas cargado");

        this.load.image("moscas_rapidas", "moscas_rapidas.png");
        console.log("moscas_rapidas cargado");

        this.load.image("moscas_fantasmas", "moscas_fantasmas.png");
        console.log("moscas_fantasmas cargado");

        this.load.image("reticulas_rapidas", "reticulas_rapidas.png");
        console.log("reticulas_rapidas cargado");

        this.load.image("reticulas_lentas", "reticulas_lentas.png");
        console.log("reticulas_lentas cargado");

        console.log("--VERSUS CARGADO--");

        this.load.image("frognard", "frognard.png");
        console.log("frognard cargado");

        this.load.image("patrones", "tileset.png");
        console.log("tileset cargado");

        this.load.spritesheet("boton horizontal", "boton.png", { frameWidth: 62, frameHeight: 32 });
        console.log("boton horizontal cargado");

        this.load.spritesheet("boton vertical", "boton (1).png", { frameWidth: 32, frameHeight: 62 });
        console.log("boton vertical cargado");

        this.load.image("puerta", "puerta.png");
        console.log("puerta cargado");

        this.load.image("caja", "caja.png");
        console.log("caja cargado");

        this.load.setPath('/tilemaps');

        this.load.tilemapTiledJSON("mapaNivel1", "nivel1.json");
        this.load.tilemapTiledJSON("mapaNivel2", "nivel2.json");

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