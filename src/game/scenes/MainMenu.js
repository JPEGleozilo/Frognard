import { Scene } from 'phaser';
import GamePadController from '../utils/GamepadController';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    { 
       this.add.sprite(480, 270, 'fondo2').setScale(0.5).setDepth(-2); 
       this.instructionText = this.add.text(1, 1 + 300, '', { fontFamily: "vhs-gothic", fontSize: '18px', color: '#fff' }).setOrigin(0.5).setDepth(-100000000000);

      // reproducir música de fondo del menú (evitar duplicados si ya existe)
      this.menuMusicKey = 'musica_pantalla_seleccion';
      try {
        let menuMusic = this.sound.get(this.menuMusicKey);
        if (!menuMusic) {
          // crear instancia si no existe en el SoundManager
          menuMusic = this.sound.add(this.menuMusicKey, { loop: true, volume: 0.9 });
        }
        // iniciar si no está sonando
        if (!menuMusic.isPlaying) menuMusic.play();
        // guardar referencia local por si se necesita
        this.menuMusic = menuMusic;
      } catch (e) {
        console.warn(`Audio '${this.menuMusicKey}' no cargado o no disponible.`, e);
      }
      // bloqueo para evitar multi-activación al confirmar
      this.selectionLocked = false;
      // sonido de confirmar (asegúrate de precargar 'seleccionar' en Preloader)
      this.confirmSoundKey = 'seleccionar';
        this.add.image(600/1.3 , 300/2, 'logo').setScale(0.56).setDepth(1);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.state = "neutral";

        this.anims.create({
          key: 'logo_animacion',
          frames: this.anims.generateFrameNumbers('logoanimacion', { start: 0, end:1 }),
          frameRate: 10,
          repeat: 0
          });

        // Posiciones de los textos
        const vsX = 960/3;
        const coopX = (960/3)*2;
        const textY = 400;

        // Agrega los iconos arriba de los textos y guarda las referencias
        this.frognardIcon = this.add.image(coopX, textY - 60, 'frognard').setOrigin(0.5, 0.7).setScale(2).setDepth(1);
        this.ranaIcon = this.add.image(vsX - 55, textY - 60, 'rana').setOrigin(0.5, 0.75).setScale(2).setDepth(2);
        this.rataIcon = this.add.image(vsX + 45, textY - 60, 'rata').setOrigin(0.5, 0.75).setScale(2).setDepth(1);

        this.coopText = this.add.text(coopX, textY, 'COOPERATIVO', {
            fontFamily: '"VT323", monospace',
            fontSize: 38,
            color: '#1fd70eff',
            stroke: '#536066ff',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.vsText = this.add.text(vsX, textY, 'VERSUS', {
            fontFamily: '"VT323", monospace',
            fontSize: 38,
            color: '#536066ff',
            stroke: '#1fd70eff',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.inputRecieve = false
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.inputRecieve = true
            },
            loop: false
        });

        this.gamepadController = new GamePadController(this);
        this.gamepads = this.gamepadController.getGamepads();
        this.getInput = this.gamepadController.getInput()
    }

    // helper para detener y destruir la musica del menu de forma segura
    stopMenuMusic() {
        try {
            if (this.menuMusic) {
                if (this.menuMusic.isPlaying) this.menuMusic.stop();
                this.menuMusic.destroy();
                this.menuMusic = null;
            } else if (this.menuMusicKey) {
                const m = this.sound.get(this.menuMusicKey);
                if (m) { if (m.isPlaying) m.stop(); m.destroy(); }
            }
        } catch (e) {
            // silencioso
        }
    }

    update () {
        //estado para los assets de la rata y la rana cuando no estan seleccionados 
        if (this.state === "neutral") {
            this.vsText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.coopText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.frognardIcon.setAlpha(0.5);
            this.ranaIcon.setAlpha(0.5);
            this.rataIcon.setAlpha(0.5);
        }
        this.gamepadController.update();
        this.getInput = this.gamepadController.getInput();

        if(this.inputRecieve === true) {
            // Cambia el estado basado en la entrada del cursor
            if ((this.cursor.left.isDown || (this.getInput.joy1.x  < -0.2 || this.getInput.joy2.x < -0.2)) && this.state != "vs"){
                this.state = "vs";
            } else if ((this.cursor.right.isDown || (this.getInput.joy1.x  > 0.2 || this.getInput.joy2.x > 0.2)) && this.state != "coop"){
                this.state = "coop";
            }
            //estado para los assets de la rata y la rana cuando no estan seleccionados 
            if (this.cursor.left.isUp && this.cursor.right.isUp && this.state === "neutral") {
                this.state = ""; // Por defecto, selecciona "coop"
            }
            if (this.enter.isDown || (this.getInput.joy1.accion === true || this.getInput.joy2.accion === true)) {
                try { if (this.confirmSoundKey) this.sound.play(this.confirmSoundKey); } catch(e) {}
                this.stopMenuMusic();
                if (this.state === "coop") {
                    this.scene.start("Coop");
                } else if (this.state === "vs") {
                    this.scene.start("Versus");
                }
            }
        }

        // Cambia el estado basado en la entrada del cursor
        if (this.cursor.right.isDown && this.state != "coop"){
            this.state = "coop";
            
        } else if (this.cursor.left.isDown && this.state != "vs"){
            this.state = "vs";

        }
        // Usar una variable para guardar el tamaño actual
        if (!this.vsFontSize) this.vsFontSize = 38;
        if (!this.coopFontSize) this.coopFontSize = 38;

        if (this.state === "vs" && this.vsFontSize !== 48) {
            this.vsText.setColor("#7deeffff").setStroke("#399295ff").setFontSize(44).setAlpha(1);
            this.vsFontSize = 48;
            this.coopText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.coopFontSize = 38;
        } else if (this.state === "coop" && this.coopFontSize !== 48) {
            this.coopText.setColor("#7deeffff").setStroke("#399295ff").setFontSize(44).setAlpha(1);
            this.coopFontSize = 48;
            this.vsText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38).setAlpha(0.5);
            this.vsFontSize = 38;
        };

        // Cambia la transparencia según el estado seleccionado
        if (this.state === "coop") {
            this.frognardIcon.setAlpha(1);
            this.ranaIcon.setAlpha(0.5);
            this.rataIcon.setAlpha(0.5);
            this.coopText.setAlpha(1);
            this.vsText.setAlpha(0.5);
        } else if (this.state === "vs") {
            this.frognardIcon.setAlpha(0.5);
            this.ranaIcon.setAlpha(1);
            this.rataIcon.setAlpha(1);
            this.coopText.setAlpha(0.5);
            this.vsText.setAlpha(1);
        }

        // reproducir efecto al cambiar la selección entre modos
        if (this.prevMenuState !== this.state) {
            const soundKey = 'cambiar_opcion';
            if (this.cache && this.cache.audio && this.cache.audio.exists && this.cache.audio.exists(soundKey)) {
                this.sound.play(soundKey, { volume: 0.4 });
            } else {
                // intento seguro si ya fue creado en el sound manager
                try { this.sound.play(soundKey); } catch (e) { /* silencioso */ }
            }
            this.prevMenuState = this.state;
        }

        //cambiar tamaño de assets al seleccionar una opcion
        if (this.state === "coop") {
            this.frognardIcon.setScale(3);
        } else {
            this.frognardIcon.setScale(2);
        }
        if (this.state === "vs") {
            this.ranaIcon.setScale(3);
            this.rataIcon.setScale(3);
        } else {
            this.ranaIcon.setScale(2);
            this.rataIcon.setScale(2);
        }

       
        // Iniciar la escena seleccionada al presionar Enter
        if (this.enter.isDown) {
            try { if (this.confirmSoundKey) this.sound.play(this.confirmSoundKey); } catch(e) {}
            this.stopMenuMusic();
            if (this.state === "coop") {
                this.scene.start("Coop");
            } else if (this.state === "vs") {
                this.scene.start("Versus");
            }
        }
    }


shutdown() {
        if (this.gamepads && this.gamepads.joystick1) {
            this.gamepads.joystick1.removeAllListeners();
        }
        if (this.gamepads && this.gamepads.joystick2) {
            this.gamepads.joystick2.removeAllListeners();
        }
     }
      
 }
