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

          this.cargaAnim = this.add.sprite(centerX, centerY, 'carga', 0).setScale(0.5);
    
        this.cargaFinal = false;
    }


    preload ()
    {
        this.anims.create({
        key: 'carga_anim',
        frames: this.anims.generateFrameNumbers('carga', { start: 0, end: 5 }),
        frameRate: 2
        });

        this.load.setPath('/assets/fonts');

         this.load.addFile(new Phaser.Loader.FileTypes.CSSFile(this.load, 'PIXELYA', 'PIXELYA Trial.ttf'));
        console.log("fuente cargada");

        this.cargaAnim.play('carga_anim');
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('/assets');

        this.load.image('logo', 'frognardtitulo.png');
        console.log("logo cargado");

        this.load.spritesheet('logoanimacion', 'logoanim.png', { frameWidth: 960, frameHeight: 540 });
        console.log("logo animacion cargado");

        this.load.image("fondo", "fondo 1.png");
        console.log("fondo cargado");
        
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

        this.load.spritesheet("animacion_controles_vs", "animacion_controles_vs.png", { frameWidth: 96, frameHeight: 64 });
        console.log("animacion controles versus cargado");

        this.load.spritesheet('animacion_presionar_a', 'animacion_presionar_a.png', { frameWidth: 32, frameHeight: 48 });


        this.load.image("pantalla_invertida", "pantalla_invertida.png");
        console.log("pantalla_invertida cargado");

        this.load.image("moscas_pequeñas", "moscas_pequeñas.png");
        console.log("moscas_pequenas cargado");

        this.load.image("moscas_grandes", "moscas_grandes.png");
        console.log("moscas_grandes cargado");

        this.load.image("moscas_rapidas", "moscas_rapidas.png");
        console.log("moscas_rapidas cargado");

        this.load.image("moscas_fantasmas", "moscas_fantasmas.png");
        console.log("moscas_fantasmas cargado");

        this.load.image("mosca_impostor", "mosca_impostor.png");

        this.load.image("reticulas_rapidas", "reticulas_rapidas.png");
        console.log("reticulas_rapidas cargado");

        this.load.image("reticulas_lentas", "reticulas_lentas.png");
        console.log("reticulas_lentas cargado");

        this.load.image("disparos_rapidos", "disparos_rapidos.png");
        console.log("disparos_rapidos cargado");

        this.load.image("disparos_lentos", "disparos_lentos.png");
        console.log("disparos_lentos cargado");

        this.load.image("fiebre_moscasdoradas", "fiebre_moscasdoradas.png");
        console.log("fiebre de moscas doradas cargado");

        this.load.image("fiebre_moscasimpostoras", "fiebre_moscasimpostoras.png");
        console.log("fiebre de moscas impostoras cargado");

        this.load.image("fondo_versus", "fondo3.png");
        console.log("fondo versus cargado");

        console.log("--VERSUS CARGADO--");

        this.load.image("frognard", "frog64x64.png");
        console.log("frognard cargado");

        this.load.spritesheet("frognard caminar", "caminar y apuntar 128x64.png",
        { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet("frognard salto", "frognardsalto.png",
        { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet("frognard idle", "idle 128x64.png", 
        { frameWidth: 128, frameHeight: 64 });

        this.load.spritesheet("palanca", "Animacion palanca.png", 
        { frameWidth: 54, frameHeight: 32 });

        this.load.image("patrones", "tileset.png");
        console.log("tileset cargado");

        this.load.spritesheet("boton horizontal", "boton Horizontal.png", 
        { frameWidth: 64, frameHeight: 22 });
        console.log("boton horizontal cargado");

        this.load.spritesheet("boton vertical", "boton Vertical.png", 
        { frameWidth: 32, frameHeight: 64 });
        console.log("boton vertical cargado");

        this.load.spritesheet("puerta", "puerta.png", 
        { frameWidth: 28, frameHeight: 64});
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