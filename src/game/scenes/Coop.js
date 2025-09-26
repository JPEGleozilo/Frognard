import { Scene } from 'phaser';

const ESTADOS = {
    NORMAL: "normal",
    SIRENA: "sirena",
    GAMEOVER: "gameover"
};

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
            tileset = map ? map.addTilesetImage("tiles", 'tiles') : null;
        } catch (e) {
            console.error('Failed to add tileset image:', e);
        }

        // Create layers (assumes first two layers are tile layers)
        // obtener y crear la capa tile por nombre
        const layerName = 'colisiones';
        const colisiones = map.createLayer(layerName, tileset, 0, 0);

        // Si la capa se llama "colisiones", hacer que todos los tiles no vacíos colisionen
        if (layerName === 'colisiones' && colisiones) {
            colisiones.setCollisionByExclusion([-1], true);
        }
                // obtener la capa de objetos y su objeto 'frognard'
        const objLayer = map.getObjectLayer('Frognard');
        const spawn = objLayer && objLayer.objects && objLayer.objects.find(o => o.name === 'frognard');

        const spawnX = spawn ? spawn.x : 128;
        const spawnY = spawn ? spawn.y : 503;

        // Create player as a physics-enabled sprite so it collides with the map
        this.player = this.physics.add.sprite(spawnX, spawnY, 'frognard').setOrigin(0, 1);
        this.player.setCollideWorldBounds(true);
        
        const layer2Name = "piso";
        const piso = map.createLayer(layer2Name, tileset, 0, 0);

        // recolectar índices de tiles que tengan la "class" == "colisionable"
        const collisionIndices = new Set();

        // recorrer tiles y crear entidades si la tile tiene 'class' (o propiedad equivalente)
        colisiones.forEachTile((tile) => {
            if (!tile || tile.index <= 0) return;

            // debug: ver qué tiles estamos iterando
            console.log('tile at', tile.x, tile.y, 'index', tile.index, 'props', tile.properties);

            // 1) Primer intento: Phaser copia propiedades custom a tile.properties
            let cls = tile.properties && (tile.properties.class || tile.properties.clase || tile.properties.colisionable);

            // 2) Fallback: buscar en la definición del tileset exportada (si existe)
            if (!cls && map.tilesets && map.tilesets.length) {
                for (const ts of map.tilesets) {
                    if (typeof ts.firstgid === 'number' && tile.index >= ts.firstgid) {
                        const localId = tile.index - (ts.firstgid || 0);
                        const tileDef = (ts.tiles && ts.tiles.find(t => t.id === localId)) || (ts.tileData && ts.tileData[localId]);
                        if (tileDef) {
                            cls = tileDef.class || (tileDef.properties && (tileDef.properties.class || tileDef.properties.colisionable));
                        }
                        break;
                    }
                }
            }

            const objLayer = map.getObjectLayer('accionables');
            const spawnboton = objLayer && objLayer.objects && objLayer.objects.find(o => o.name === 'boton');
            
            this.boton = this.physics.add.image(spawnboton.x, spawnboton.y, 'boton').setOrigin(0, 1).setScale(32).setImmovable(true).setGravityY(0);

            if (this.boton) {
                this.physics.add.collider(this.boton, colisiones);
            }

            // marcar como collidable si la "clase" indica colisión o si la tile tiene propiedad explicitamente
            if (cls === 'colisionable' || cls === true || cls === 'true' || (tile.properties && tile.properties.colisionable === true)) {
                collisionIndices.add(tile.index);
                return;
            }

            // si tiene otra clase, crear entidad (opcional)
            if (cls) {
                this.createFromTileClass(cls, tile.pixelX, tile.pixelY);
                colisiones.removeTileAt(tile.x, tile.y);
            }
        });

        console.log('collisionIndices detected:', Array.from(collisionIndices));

        // Si encontramos índices marcados como "colisionable", hacerlos collidable en la capa
        if (collisionIndices.size > 0) {
            colisiones.setCollision(Array.from(collisionIndices), true);
        }

        // Ensure the physics collider exists (player must be created before esto)
        // if player not yet created, add collider después de crear player
        if (this.player) {
            this.physics.add.collider(this.player, colisiones);
        }

        // Enable collisions for tiles where the layer property 'colisionable' is true
        // We check each layer's properties (Tiled sets a custom property on the layer)
        if (!this.physics) {
            console.error('Physics plugin no habilitado. Añade physics:{ default: "arcade", ... } al config de Phaser.');
        return;
        }

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

        this.estado = ESTADOS.NORMAL;

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

        setupLayerCollision(colisiones);

        this.sirenaTimer = this.time.addEvent({
            delay:1000 * 300, //5 minutos
            callback: () => {
                this.setState(ESTADOS.SIRENA);
                this.time.addEvent({
                    delay:1000 * 15, //15 segundos
                    callback: () => {
                        this.setState(ESTADOS.GAMEOVER);
                    },
                    loop: false
                })
            },
            loop: false
        })

        console.log('map.layers:', map.layers);   // array con name, id, type...
        console.log('map.tilesets:', map.tilesets);
    }

    update ()
    {
        // Guard if player or keys not ready
        if (!this.player || !this.p1 || !this.p2) return;

        this.observer();

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
    observer () {
       }
       
    setState (nuevoEstado) {
        if (this.estado === nuevoEstado) return;
        if (this.estado === ESTADOS.SIRENA && nuevoEstado !== ESTADOS.SIRENA && this.player) {
            this.player.clearTint();
        }
        this.estado = nuevoEstado;

        switch (nuevoEstado) {
            case ESTADOS.SIRENA:
                if (this.player) this.player.setTint(0xff0000);
                break;
            case ESTADOS.GAMEOVER:
                this.scene.start("GameOver");
                break;
            case ESTADOS.NORMAL:
                default:
                    break;
        }
    }

    createFromTileClass (cls, x, y) {
        switch (cls) {
            case 'enemy_spawner':
                // ejemplo: crear un sprite con física
                const s = this.physics.add.sprite(x + 16, y + 16, 'spawnerSprite');
                s.setData('type', 'spawner');
                break;
            case 'pickup_coin':
                this.physics.add.sprite(x + 16, y + 16, 'coin');
                break;
            // añadir más casos según tus clases de Tiled
            default:
                console.warn('Clase de tile no manejada:', cls);
        }
    }
}
