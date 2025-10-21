export default class Lengua extends Phaser.Physics.Arcade.Sprite {
    constructor(scene){
    super(scene,500, 45, "lengua punta")

    //Existencia
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5);
    this.setCollideWorldBounds(false);
    this.setCollidesWith([1, 2, 3]);
    this.body.onWorldBounds = true;
    this.setDepth(1);
    this.setVisible(false);
    this.setGravityY(-1000);
    this.velocidad = 950;
    this.log = false;
    this.vuelta = false;
    this.lenguaOut = false;
    }

    disparar(x, y, angulo) {
        if (this.lenguaOut === false){
            this.x = x;
            this.y = y;
            this.angulo = angulo;
            this.lenguaOut = true;
            this.setCollideWorldBounds(true);
            this.setCollidesWith([1, 2, 3]);
            this.log = false;
        
            this.setX(this.x + this.width/2);
            this.setY(this.y + 20);

            this.setVisible(true);

            this.setVelocityX(this.velocidad * this.angulo.x);
            this.setVelocityY(this.velocidad * this.angulo.y);
        } else {
            console.log("no papi");
        };


    }

    volviendo(frogX, frogY) {
        if(this.vuelta === true){
        this.frogX = frogX
        this.frogY = frogY
        this.anguloVuelta = Phaser.Math.Angle.Between(this.body.x, this.body.y, this.frogX, this.frogY + 20);
        this.setVelocityX(this.velocidad * Math.cos(this.anguloVuelta));
        this.setVelocityY(this.velocidad * Math.sin(this.anguloVuelta));
        };

        if (this.log === false) {
            console.log ("frogX: ", this.frogX);
            console.log ("frogY: ", this.frogY);
            console.log("body.x: ", this.body.x);
            console.log("body.y: ", this.body.y);
            this.log = true;
        }
    }

    triggerVuelta() {
        this.vuelta = true;
        this.body.setCollidesWith([1]);
    }


    desactivar() {
        if (this.vuelta === true) {
            console.log("desactivado");
            this.vuelta = false;
            this.setCollideWorldBounds(false);
            this.setVisible(false);
            this.setX(0);
            this.setY(0);
            this.setVelocity(0);
            this.lenguaOut = false;
            this.body.setCollidesWith([0]);
            if (this._gfx) {
                this._gfx.clear();
            }
        }
    }

    lenguaLargo(frogX, frogY) {
        if(this.lenguaOut) {
               // crear graphics la primera vez y reutilizarlo
        if (!this._gfx) {
            this._gfx = this.scene.add.graphics();
            this._gfx.setDepth(this.depth - 1);
        }
        this._gfx.clear();
    // coordenadas: punto de la lengua (usar body center) y target frog
        const x1 = this.body.x + (this.body.width ? this.body.width / 2 : 0);
        const y1 = this.body.y + (this.body.height ? this.body.height / 2 : 0);
        const x2 = frogX + 16;
        const y2 = frogY + 20;
        this._gfx.lineStyle(4, 0x733f7e, 1);
        const line = new Phaser.Geom.Line(x1, y1, x2, y2);
        this._gfx.strokeLineShape(line);
    } else {
        if (this._gfx) this._gfx.clear();
    }
    };

    getLenguaOut() {
        return this.lenguaOut
    }
}