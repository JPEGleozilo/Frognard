import { Scene } from 'phaser';

export class Coop extends Scene
{
    constructor ()
    {
        super('Coop');
    }

    create ()
    {
        // Create the tilemap loaded in Preloader
        const map = this.make.tilemap({ key: 'nivel1' });
        // 'tiles' is the key we used when loading the tileset image in Preloader
        if (!map) {
            console.error('Tilemap "nivel1" not found. Check Preloader paths and server static files.');
        }

        let tileset = null;
        try {
            tileset = map ? map.addTilesetImage('tiless', 'tiles') : null;
        } catch (e) {
            console.error('Failed to add tileset image:', e);
        }

        // Create layers (assumes first two layers are tile layers)
        const layer2 = (map && tileset) ? map.createLayer(0, tileset, 0, 0) : null;

        // Enable collisions for tiles where the layer property 'colisionable' is true
        // We check each layer's properties (Tiled sets a custom property on the layer)
        if (!this.physics) {
            console.error('Physics plugin no habilitado. Añade physics:{ default: "arcade", ... } al config de Phaser.');
        return;
        }

        let spawn = null;
        if (map && map.objects) {
            for (const objLayer of map.objects) {
                spawn = objLayer.objects.find(o => o.name === 'frognard' || o.type === 'frognard');
                if (spawn) break;
            }
        }

        const spawnX = spawn ? spawn.x : 128;
        const spawnY = spawn ? spawn.y : 503;

        // Create player as a physics-enabled sprite so it collides with the map
        this.player = this.physics.add.sprite(spawnX, spawnY, 'frognard').setOrigin(0, 1);
        this.player.setCollideWorldBounds(true);

        // Input
        this.p1 = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        })

        this.p2 = this.input.keyboard.createCursorKeys() && this.input.keyboard.addKeys({
            L: Phaser.Input.Keyboard.KeyCodes.L,
        });

        this.velocidad = 210;
        this.salto = -500;
        this.lowgrav = -400;
        this.gravedad = 0;

         const setupLayerCollision = (layer) => {
            if (!layer) return;
            // Detect layer-level property (Tiled can store properties as array or object)
            let layerCollidable = false;
            const props = layer.layer && layer.layer.properties;
            if (props) {
                if (Array.isArray(props)) {
                    layerCollidable = props.some(p => p.name === 'colisionable' && (p.value === true || p.value === 'true'));
                } else if (typeof props === 'object') {
                    layerCollidable = props.colisionable === true || props.colisionable === 'true';
                }
            }

            if (layerCollidable) {
                // Make all non-empty tiles in the layer collide
                layer.setCollisionByExclusion([-1], true);
            } else {
                // Make collide the tiles that have the tile property 'colisionable': true
                layer.setCollisionByProperty({ colisionable: true });
            }

            // Add collider between player and this layer
            this.physics.add.collider(this.player, layer);

            if (this.player.y > 503)
                this.player.setY(503)
        };

        setupLayerCollision(layer2);
        this.tiemposAlto = this.time.addEvent({  
            delay: 250,
            callback: () => {
            if (this.saltoTimer = true){
                
            }},
            loop: false
        });
    }

    update ()
    {
        // Guard if player or keys not ready
        if (!this.player || !this.p1 || !this.p2) return;
        
        // Reset velocity
        this.player.setVelocityX(0);

        if (this.p1.A.isDown){
            this.player.setVelocityX(-this.velocidad);
        } else if (this.p1.D.isDown){
            this.player.setVelocityX(this.velocidad);
        }

        const jumpKey = this.p2.L;
        if (Phaser.Input.Keyboard.JustDown(jumpKey) && this.player.body.onFloor()){
            this.player.setVelocityY(this.salto);
            console.log(this.player.body.gravity.y);
        }

        if (jumpKey.isDown && !this.player.body.onFloor()){
            this.player.body.setGravityY(this.lowgrav);
            console.log(this.player.body.gravity.y);
        } else {
            this.player.body.setGravityY(this.gravedad);
        }
    }
}
