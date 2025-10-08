import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(480, 270, 'fondo').setDepth(-1)     
        this.add.image(600/1.3 , 300/2, 'logo');

        this.cursor = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.state = "neutral";

        // Posiciones de los textos
        const coopX = 960/3;
        const vsX = (960/3)*2;
        const textY = 400;

        // Agrega los iconos arriba de los textos
        this.add.image(coopX, textY - 60, 'frognard').setOrigin(0.5, 1).setScale(1); // Cambia 'coop_icon' por el key de tu asset
        this.add.image(vsX - 30, textY - 60, 'rana').setOrigin(0.5, 1);     // Cambia 'vs_icon' por el key de tu asset
        this.add.image(vsX +20, textY - 60, 'rata').setOrigin(0.5, 1); // Añade otro icono para el modo versus

        this.coopText = this.add.text(coopX, textY, 'cooperativo', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#1fd70eff',
            stroke: '#536066ff', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.vsText = this.add.text(vsX, textY, 'versus', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#536066ff',
            stroke: '#1fd70eff', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
    }

    update () {
        if (this.cursor.right.isDown && this.state != "vs"){
            this.state = "vs";
        } else if (this.cursor.left.isDown && this.state != "coop"){
            this.state = "coop";
        }

        // Usar una variable para guardar el tamaño actual
        if (!this.vsFontSize) this.vsFontSize = 38;
        if (!this.coopFontSize) this.coopFontSize = 38;

        if (this.state === "vs" && this.vsFontSize !== 48) {
            this.vsText.setColor("#7deeffff").setStroke("#399295ff").setFontSize(44);
            this.vsFontSize = 48;
            this.coopText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38);
            this.coopFontSize = 38;
        } else if (this.state === "coop" && this.coopFontSize !== 48) {
            this.coopText.setColor("#7deeffff").setStroke("#399295ff").setFontSize(44);
            this.coopFontSize = 48;
            this.vsText.setColor("#444343ff").setStroke("#4e4e4eff").setFontSize(38);
            this.vsFontSize = 38;
        };

        if (this.enter.isDown) {
            if (this.state === "coop") {
                this.scene.start("Coop")
            } else if (this.state === "vs") {
                this.scene.start("Versus")
            };
        };
    }
}
