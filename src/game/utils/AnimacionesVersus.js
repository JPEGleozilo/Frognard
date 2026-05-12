export function crearAnimacionesVersus(scene) {
    scene.anims.create({
        key: 'mosca_fly',
        frames: scene.anims.generateFrameNumbers('mosca spritesheet', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'mosca_fly_golden',
        frames: scene.anims.generateFrameNumbers('mosca dorada spritesheet', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });
    scene.anims.create({
        key: 'rana_disparo_anim',
        frames: scene.anims.generateFrameNumbers('rana disparo', { start: 0, end: 8 }),
        frameRate: 7,
        repeat: 0
    });
    scene.anims.create({
        key: 'rata_disparo_anim',
        frames: scene.anims.generateFrameNumbers('rata disparo', { start: 0, end: 8 }),
        frameRate: 7,
        repeat: 0
    });
    scene.anims.create({
        key: 'animacion_controles_vs',
        frames: scene.anims.generateFrameNumbers('animacion_controles_vs', { start: 0, end: 5 }),
        frameRate: 4,
        repeat: -1
    });
}