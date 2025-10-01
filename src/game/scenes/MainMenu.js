import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'logo');

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        console.log("create finalizado");
    }

    update () {
        if (this.cursor.right.isDown && this.state != "vs"){
            this.state = "vs";
            console.log("vs");
        } else if (this.cursor.left.isDown && this.state != "coop"){
            this.state = "coop";
            console.log("coop");
        }

        // Usar una variable para guardar el tamaño actual
        if (!this.vsFontSize) this.vsFontSize = 38;
        if (!this.coopFontSize) this.coopFontSize = 38;

        if (this.state === "vs" && this.vsFontSize !== 48) {
            this.vsText.setColor("#000000").setStroke("#FFFFFF").setFontSize(44);
            this.vsFontSize = 48;
            this.coopText.setColor("#FFFFFF").setStroke("#000000").setFontSize(38);
            this.coopFontSize = 38;
            console.log("cambio");
        } else if (this.state === "coop" && this.coopFontSize !== 48) {
            this.coopText.setColor("#000000").setStroke("#FFFFFF").setFontSize(44);
            this.coopFontSize = 48;
            this.vsText.setColor("#FFFFFF").setStroke("#000000").setFontSize(38);
            this.vsFontSize = 38;
            console.log("cambio");
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
