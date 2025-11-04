import { Scene } from 'phaser';
import GamePadController from '../utils/GamepadController';

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

        this.load.image("fondo2", "fondo2.png");
        console.log("fondo2 cargado");
        
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

        this.load.image("miras_rapidas", "reticulas_rapidas.png");
        console.log("reticulas_rapidas cargado");

        this.load.image("miras_lentas", "reticulas_lentas.png");
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

        this.load.spritesheet("escenario", "escenario.png", { frameWidth: 300, frameHeight: 360 });
        console.log("escenario versus cargado");

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

        this.load.image("lengua punta", "lengua punta.png");

        this.load.image("caja", "caja.png");
        console.log("caja cargado");

        this.load.spritesheet("luz alarma", "LuzAlarma32x32.png", { frameWidth: 32, frameHeight: 32});
        console.log("luz alarma cargado");

        this.load.image("luz roja", "luz roja.png")
        console.log("luz roja cargado");

        this.load.spritesheet("tutorial coop", "Animacion_controles2.png", { frameWidth: 128, frameHeight: 128});
        
        this.load.spritesheet("tutorial restart", "animacion restart 96x48.png", { frameWidth: 96, frameHeight: 48});

        this.load.spritesheet("Game over", "GameOver96x96(6fps).png", {frameWidth: 96, frameHeight: 96});

        this.load.setPath('/tilemaps');

        this.load.tilemapTiledJSON("mapaNivel1", "nivel1.json");
        this.load.tilemapTiledJSON("mapaNivel2", "nivel2.json");
        this.load.tilemapTiledJSON("mapaNivel3", "nivel3.json");
        this.load.tilemapTiledJSON("mapaNivel4", "nivel4.json");
        this.load.tilemapTiledJSON("mapaNivel5", "nivel5.json");
        this.load.tilemapTiledJSON("mapaNivel6", "nivel6.json");

        this.load.setPath('/audio/music');

        this.load.audio("musica_coop", "ms_coop.ogg");
        this.load.audio("musica_versus", "ms_versus.ogg");
        this.load.audio("musica_pantalla_seleccion", "ms_pantalla_seleccion.ogg");

        this.load.setPath('/audio/sfx');
        this.load.audio("abrir_puerta", "sf_abrir_puerta.wav");
        this.load.audio("cambiar_opcion", "sf_cambiar_opcion.wav");
        this.load.audio("festejo", "sf_festejo.ogg");
        this.load.audio("publico_aplaudiendo", "sf_publico_aplaudiendo.ogg");
        this.load.audio("redoble_tambor", "sf_redoble_tambor.ogg");
        this.load.audio("ronda_terminada", "sf_ronda_terminada.wav");
        this.load.audio("salto", "sf_salto.wav");
        this.load.audio("seleccionar", "sf_seleccionar.ogg");
        this.load.audio("sumar_puntos", "sf_sumar_puntos.wav");

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.gamepadController = new GamePadController(this);
        this.gamepadController.getGamepads();

        this.cargaFinal = true;
    }

    update() {
        if (this.cargaFinal === true && this.cargaAnim.anims.currentFrame.index === 6) {
            if (!this.menuTexto) {
                this.menuTexto = this.add.text(480, 450, "Presiona enter para continuar", {
                    fontFamily: "vhs-gothic",
                    fontSize: '40px',
                    color: '#7deeffff',
                    stroke: "#000000",
                    strokeThickness: 6
                }).setOrigin(0.5)
            }
            this.menuTexto.setStyle({fontFamily: "vhs-gothic"});
            this.gamepadController.update();
            this.getInput = this.gamepadController.getInput();

            if (this.enterKey.isDown || this.getInput.joy1.accion || this.getInput.joy2.accion) {
                this.scene.start("MainMenu");
            }
        }
    }
}