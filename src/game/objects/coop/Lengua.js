export default class Lengua extends Phaser.Physics.Arcade.Sprite {
    constructor(scene){
    super(scene,1, 1, "frognard")

    //Existencia
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.25);
    this.setOrigin(1, 0);
    this.setCollideWorldBounds(true);
    this.setDepth(1);
    this.setVisible(false);
    this.setGravity(-1000);
    this.velocidad = 400;
    this.log = false;
    }

    update(lengua, x, y) {

    }

    disparar(x, y, angulo) {
        this.x = x;
        this.y = y;
        this.angulo = angulo;
        
        this.setX(this.x);
        this.setY(this.y);

        this.setVisible(true);

        this.setVelocityX(this.velocidad * this.angulo.x);
        this.setVelocityY(this.velocidad * this.angulo.y)
    }

    volver(frogX, frogY) {
        this.frogX = frogX
        this.frogY = frogY


        this.anguloVolver = Phaser.Math.Angle.Between(this.body.x, this.body.y, this.frogX, this.frogY);
        
        

        if (this.log === false) {
            console.log ("frogX: ", this.frogX);
            console.log ("frogY: ", this.frogY);
            console.log("body.x: ", this.body.x);
            console.log("body.y: ", this.body.y);
            this.log = true;
        }
    }

    desactivar() {
        this.setVisible(false);
        this.setX(0);
        this.setY(0);
    }
}