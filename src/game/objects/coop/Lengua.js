export default class Lengua {
    constructor(scene, x, y, angulo){
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.angulo = angulo;

    //Existencia
    scene.add.existing(this);

    //Físicas
    this.setOrigin(0, 1);
    this.setCollideWorldBounds(true);
    this.velocidad = 400;
    }

    update(lengua, x, y) {
        this.lengua = lengua
        this.x = x
        this.y = y

        if(this.lengua === true) {
            //activar la lengua
        }else if (this.lengua === false) {
            //desactivar la lengua
        }
    }
}