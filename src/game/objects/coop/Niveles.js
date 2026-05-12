import Phaser from 'phaser';
import Frognard from '../coop/Frognard.js';
import Lengua from "../coop/Lengua.js";
import BotonH from '../coop/BotonH.js';
import BotonV from '../coop/BotonV.js';
import Palanca from '../coop/Palanca.js';
import Caja from '../coop/Caja.js';
import { Accionable } from "../coop/Accionable.js";

export class NivelTemplate {
    constructor (scene, mapaKey = 'template'){
        this.scene = scene;
        this.mapaKey = mapaKey;

            if(this.mapaKey != 'template') {
                this.scene.mapa = this.scene.make.tilemap({key: this.mapaKey});
                this.scene.patrones = this.scene.mapa.addTilesetImage("tileset", "patrones");
                this.scene.piso = this.scene.mapa.createLayer("bloques", this.scene.patrones, 0, 0).setDepth(2);
                this.scene.paredes = this.scene.mapa.createLayer("paredes", this.scene.patrones,0 ,0).setDepth(2);
                this.scene.mapa.createLayer("superficie", this.scene.patrones, 0 , 0).setDepth(1);
                this.scene.final = this.scene.mapa.createLayer("final", this.scene.patrones, 0, 0).setDepth(3);
                this.scene.rejillas = this.scene.mapa.createLayer("rejillas", this.scene.patrones,0 ,0).setDepth(2);

                this.scene.cajas = this.scene.physics.add.group();
            
                this.scene.botonesH = this.scene.physics.add.group();
                this.scene.botonesV = this.scene.physics.add.group();
                this.scene.palancas = this.scene.physics.add.group();
            
                this.scene.accionable = this.scene.physics.add.group();
                
                this.scene.capaSpawns = this.scene.mapa.getObjectLayer("spawn");
                this.scene.capaSpawns.objects.forEach(objeto => {
                    if (objeto.name === "Frognard") {
                        this.scene.spawnX = objeto.x;
                        this.scene.spawnY = objeto.y;
                        this.scene.frognard.setPosition(this.scene.spawnX, this.scene.spawnY - 2);
                    } else if (objeto.name === "Caja") {
                        this.scene.spawnCaja = {
                            x: objeto.x,
                            y: objeto.y
                        }
                        new Caja (this.scene, this.scene.spawnCaja.x, this.scene.spawnCaja.y)
                    }
                });
            
                this.scene.capaInterruptores = this.scene.mapa.getObjectLayer("interruptores");
                this.scene.capaInterruptores.objects.forEach(objeto => {
                    if (objeto.type === "Horizontal") {
                        new BotonH (this.scene, objeto.x, objeto.y, objeto.name);
                        console.log(objeto.name, " horizontal");
                    } else if (objeto.type === "Vertical") {
                        new BotonV (this.scene, objeto.x, objeto.y, objeto.name, objeto.properties[0].value, objeto.properties[1].value, objeto.properties[2].value);
                        console.log(objeto.name, " vertical");
                    } else if (objeto.type === "Palanca") {
                        new Palanca (this.scene, objeto.x, objeto.y, objeto.name);
                        console.log(objeto.name, " palanca");
                    }
                });

                this.scene.capaAccionables = this.scene.mapa.getObjectLayer("accionables");
                this.scene.capaAccionables.objects.forEach(objeto => {
                    new Accionable (this.scene, objeto.x, objeto.y, objeto.name, objeto.type);
                    console.log(objeto.name, " puerta");
                });

                ///--- colliders ---///
                this.scene.piso.setCollisionByProperty({collider: true});
                this.scene.piso.setCollisionCategory([2]);
    
                this.scene.rejillas.setCollisionByProperty({rejilla: true});
                this.scene.rejillas.setCollisionCategory([5]);
    
                this.scene.final.setCollisionByProperty({final: true});
    
                this.scene.paredes.setCollisionByProperty({immovable: true});
                this.scene.paredes.setCollisionCategory([2]);

                this.scene.colliders = [
                this.scene.physics.add.collider(this.scene.frognard, this.scene.piso),
                this.scene.physics.add.collider(this.scene.lengua, this.scene.accionable, () => {
                    this.scene.lengua.triggerVuelta();
                }),
                this.scene.physics.add.collider(this.scene.frognard, this.scene.paredes),
                this.scene.physics.add.collider(this.scene.lengua, this.scene.paredes, () => {
                    this.scene.lengua.triggerVuelta();
                }, null, this.scene.lengua),
                this.scene.physics.add.collider(this.scene.lengua, this.scene.piso, () => {
                    this.scene.lengua.triggerVuelta();
                }, null, this.scene.lengua),
                this.scene.physics.add.collider(this.scene.frognard, this.scene.accionable),
                this.scene.physics.add.overlap(this.scene.frognard, this.scene.lengua, () => {
                    this.scene.lengua.desactivar();
                }),
                this.scene.physics.add.collider(this.scene.frognard, this.scene.rejillas),
                this.scene.physics.add.collider(this.scene.frognard, this.scene.botonesH),

                this.scene.physics.add.collider(this.scene.cajas, this.scene.rejillas),
                this.scene.physics.add.collider(this.scene.cajas, this.scene.piso),
                this.scene.physics.add.collider(this.scene.cajas, this.scene.paredes, (caja, tile) => {
                    caja.body.setDragX(0)
                }),
                this.scene.physics.add.collider(this.scene.cajas, this.scene.accionable),
                this.scene.physics.add.collider(this.scene.cajas, this.scene.botonesH),
                this.scene.physics.add.collider(this.scene.cajas, this.scene.frognard),
                this.scene.physics.add.collider(this.scene.cajas, this.scene.lengua, () => {
                    this.scene.lengua.triggerVuelta();
                }, null, this.scene.lengua),

                this.scene.physics.add.collider(this.scene.frognard, this.scene.final, () => {
                    this.scene.cambioNivelOn = true;
                })
                ];

                this.scene.worldboundsListener = (body) => {
                if (body.gameObject === this.scene.lengua) {
                    this.scene.lengua.triggerVuelta();
                }};
                this.scene.physics.world.on("worldbounds", this.scene.worldboundsListener);
                }
        }

        failSecuence () {
            console.error('mapa: ', this.mapa, 'patrones: ', this.patrones, 'piso: ', this.piso, 'paredes: ', this.paredes, 'final: ', this.final, 'rejillas: ', this.rejillas, 'capaSpawns: ', this.capaSpawns, 'capaInterruptores: ', this.capaInterruptores, 'capaAccionables: ', this.capaAccionables);
        }
}

export class Nivel1 extends NivelTemplate {
    constructor (scene){
        super(scene, 'mapa1');

        this.scene.tutorial = this.scene.add.sprite(768, 448, "tutorial coop").setDepth(10).setScale(2);

        this.scene.anims.create({
            key: "tutorialCoop",
            frames: this.scene.frognard.anims.generateFrameNumbers('tutorial coop', { start: 0, end: 20 }),
            frameRate: 8,
            repeat: -1
        })

        this.scene.tutorial.anims.play ("tutorialCoop", true);

    }
}

export class Nivel2 extends NivelTemplate {
    constructor (scene){
        super(scene, 'mapa2');

        this.scene.restartTuto = this.scene.add.sprite(832, 300, "tutorial restart").setDepth(10).setScale(2);

        this.scene.anims.create({
            key: "tutorialRestart",
            frames: this.scene.frognard.anims.generateFrameNumbers('tutorial restart', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        })

        this.scene.restartTuto.anims.play ("tutorialRestart", true);
    }
}

export class Nivel3 extends NivelTemplate {
    constructor (scene){
        super(scene, 'mapa3');
    }
}

export class Nivel4 extends NivelTemplate {
    constructor (scene){
        super(scene, 'mapa4');
    }
}

export class Nivel5 extends NivelTemplate {
    constructor (scene){
        super(scene, 'mapa5');
    }
}

export class Nivel6 extends NivelTemplate {
    constructor (scene){
        super(scene, 'mapa6');
    }
}

export class NivelController {
    constructor (scene){
        this.scene = scene;
        this.scene.nivel = new Nivel1(this.scene);
        this.nivelActual = 1;
    }

    cambioNivel (nivelCambio = 1, nivelActual = this.nivelActual) {
        this.nivelCambio = nivelCambio;
        this.nivelActual = nivelActual;

        if (!this.scene.negro)this.scene.negro = this.scene.add.image(0, 0, 'negro').setOrigin(0).setDepth(50);
        if (this.scene.negro)this.scene.negro.setVisible(true);
        
        this.scene.physics.pause();

        ///--- Eliminar nivel anterior ---///

        if (this.scene.worldboundsListener) {
            this.scene.physics.world.off("worldbounds", this.scene.worldboundsListener);
            this.scene.worldboundsListener = null;
        }
        if (this.scene.colliders && Array.isArray(this.scene.colliders)) {
            this.scene.colliders.forEach(collider => {
                if (collider) {
                    collider.active = false;
                    this.scene.physics.world.removeCollider(collider);
                }
            });
            this.scene.colliders = [];
        }

        if (this.scene.botonesV) this.scene.botonesV.children.entries.forEach(botonV => {botonV.eliminarDelays()})

        if (this.scene.cajas) this.scene.cajas.children.entries.forEach(caja => {caja.destroy()})
        if (this.scene.botonesH) this.scene.botonesH.children.entries.forEach(botonH => {botonH.destroy()})
        if (this.scene.botonesV) this.scene.botonesV.children.entries.forEach(botonV => {botonV.destroy()})
        if (this.scene.palancas) this.scene.palancas.children.entries.forEach(palanca => {palanca.destroy()})
        if (this.scene.accionable) this.scene.accionable.children.entries.forEach(accionable => {accionable.destroy()} )
        
        if (this.scene.cajas) this.scene.cajas.clear(true)
        if (this.scene.botonesH) this.scene.botonesH.clear(true);
        if (this.scene.botonesV) this.scene.botonesV.clear(true);
        if (this.scene.palancas) this.scene.palancas.clear(true);
        if (this.scene.accionable) this.scene.accionable.clear(true);

        if (this.scene.piso) this.scene.piso.destroy();
        if (this.scene.paredes) this.scene.paredes.destroy();
        if (this.scene.final) this.scene.final.destroy();
        if (this.scene.rejillas) this.scene.rejillas.destroy();

        if (this.scene.mapa) this.scene.mapa.destroy();

        this.scene.mapa = null;
        this.scene.patrones = null;
        this.scene.piso = null;
        this.scene.paredes = null;
        this.scene.final = null;
        this.scene.rejillas = null;
        this.scene.capaSpawns = null;
        this.scene.capaInterruptores = null;
        this.scene.capaAccionables = null;

        if(this.scene.tutorial) {
            this.scene.tutorial.destroy();
        }
        if(this.scene.restartTuto) {
            this.scene.restartTuto.destroy();
        }

        this.nivelCambiando = this.nivelActual + this.nivelCambio
        ///--- Cargar nuevo nivel ---///
        if (this.nivelCambiando === 1) {
            this.scene.nivel = new Nivel1(this.scene);
        } else if (this.nivelCambiando === 2) {
            this.scene.nivel = new Nivel2(this.scene);
        } else if (this.nivelCambiando === 3) {
            this.scene.nivel = new Nivel3(this.scene);
        } else if (this.nivelCambiando === 4) {
            this.scene.nivel = new Nivel4(this.scene);
        } else if (this.nivelCambiando === 5) {
            this.scene.nivel = new Nivel5(this.scene);
        } else if (this.nivelCambiando === 6) {
            this.scene.nivel = new Nivel6(this.scene);
        } else if (this.nivelCambiando === 7) {
            this.scene.scene.start ("MainMenu");
        } else if (this.nivelCambiando === 0) {
            this.scene.nivel = new Nivel1 (this.scene);
        }

        this.scene.negro.setVisible(false);
        this.scene.physics.resume();
        this.nivelActual = this.nivelCambiando;
    }
}