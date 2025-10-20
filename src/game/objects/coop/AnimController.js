export default class AnimController {
    constructor(scene, player) {
        this.scene = scene
        this.frognard = player
    }

    createAnims() {
        this.frognard.anims.create({
            key: "Idle",
            frames: this.frognard.anims.generateFrameNumbers('frognard idle', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.frognard.anims.create({
            key: "IdleN",
            frames: this.frognard.anims.generateFrameNumbers('frognard idle', { start: 3, end: 5 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.frognard.anims.create({
            key: "IdleS",
            frames: this.frognard.anims.generateFrameNumbers('frognard idle', { start: 6, end: 8 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.frognard.anims.create({
            key: "IdleSO",
            frames: this.frognard.anims.generateFrameNumbers('frognard idle', { start: 9, end: 11 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.frognard.anims.create({
            key: "IdleO",
            frames: this.frognard.anims.generateFrameNumbers('frognard idle', { start: 12, end: 14 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.frognard.anims.create({
            key: "IdleNO",
            frames: this.frognard.anims.generateFrameNumbers('frognard idle', { start: 15, end: 17 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        this.frognard.anims.create({
            key: "CaminarN",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.frognard.anims.create({
            key: "CaminarNE",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 7, end: 13 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "CaminarE",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 14, end: 20 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "CaminarSE",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 21, end: 27 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.frognard.anims.create({
            key: "CaminarGirar",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 28, end: 34 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "CaminarS",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 35, end: 41 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "CaminarSO",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 42, end: 48 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "CaminarO",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 49, end: 55 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "CaminarNO",
            frames: this.frognard.anims.generateFrameNumbers('frognard caminar', { start: 56, end: 62 }),
            frameRate: 12,
            repeat: -1
        });

        this.frognard.anims.create({
            key: "Salto",
            frames: this.frognard.anims.generateFrameNumbers('frognard salto', { start: 0, end: 3 }),
            frameRate: 0,
            repeat: 0
        });

    }
    
    playAnim (key, flip, anguloEscena, force = false) {
        if (!key) return;
        if (this.scene.lengua.getLenguaOut() === true) return;
        const CUR = this.frognard.anims.currentAnim && this.frognard.anims.currentAnim.key;
        const CURFLIP = this.frognard.flipX
        if (!force && CUR === key && CURFLIP === flip) return; // ya se está reproduciendo -> no reiniciar
        this.frognard.anims.play(key, true);
        this.frognard.setFlipX(flip);
        this.angulo = anguloEscena
    }
}