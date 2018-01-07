import { Sprite, Group, Weapon, Pointer, Tilemap, Tileset,
     TilemapLayer, Time, Game, PluginManager, Input, Mouse, Bullet, Canvas, ScaleManager } from "phaser-ce";

var game = new Phaser.Game(
    //window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,
    800, 600,
     Phaser.AUTO, 'game', {
    preload: preload, 
    create: create, 
    update: update,
    render: render
})

function preload() {
    game.load.image('guy', '/assets/player.png')
    game.load.image('bullet', '/assets/bullet.png')
    game.load.tilemap('map', '/assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles', '/assets/tilemaps/tiles/background.png')
    game.load.image('greenWall', '/assets/tilemaps/tiles/greenWall.png')
}

var player: Sprite
var moveSpeed: number = 150
var pistol: Weapon
var shotgun: Weapon
var shotgunSpread: Array<Object>
var equippedWeapon: string
var map: Tilemap
var groundLayer: TilemapLayer
var wallLayer: TilemapLayer
var objectLayer: TilemapLayer

function create() {
    //note about game scaling. if the game starts in a browser window smaller than
    //the minimum game size minus margin adjust(20px right now) (680 x 500 total right now), the 
    //adjustScreenDimensions function wont work properly on screen resize.
    game.scale.scaleMode =  Phaser.ScaleManager.SHOW_ALL //show_all keeps aspect ratio on resize
    game.scale.setMinMax(640, 480, window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio)//set min and max dimensions for game window
    adjustScreenDimensions() //call right away so game screen fits in windows (note: could remove body margin)
    window.addEventListener('resize', function () { adjustScreenDimensions()})
    game.canvas.oncontextmenu = function (e) { e.preventDefault() } //stops right-click from showing context menu


    game.physics.startSystem(Phaser.Physics.ARCADE) //enable physics
    game.time.advancedTiming = true //so i can show fps in debug


    initTilemap()//setup tilemap and its layers
    

    initPlayer() //setup player and player attributes
    

    pistol = game.add.weapon(10, 'bullet')
    pistol.bulletKillType = Phaser.Weapon.KILL_DISTANCE
    pistol.bulletKillDistance = 720
    pistol.bulletSpeed = 500
    pistol.fireRate = 250
    pistol.trackSprite(player, .5, .5, true)

    shotgun = game.add.weapon(20, 'bullet')
    shotgun.bulletKillType = Phaser.Weapon.KILL_DISTANCE //needed for bulletkilldistance
    shotgun.bulletKillDistance = 200
    shotgun.bulletSpeed = 1000
    shotgun.bulletSpeedVariance = 100 //each bullet moves at different speed
    shotgun.bulletAngleVariance = 20 //helps create "spread"
    shotgun.fireRate = 500
    //shotgun.fireLimit = 6
    shotgun.trackSprite(player, .5, .5, true) //locks weapon to player sprite
    shotgunSpread = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }] //for firemany()

}

function update() {
    //collision between player and walls and bullets
    game.physics.arcade.collide(wallLayer, player)
    game.physics.arcade.collide(pistol.bullets, wallLayer, function(bullet, wall){bullet.kill()})
    game.physics.arcade.collide(shotgun.bullets, wallLayer, function(bullet, wall){bullet.kill()})

    handlePlayerInput() //ya know...handle it
    
}

function render() {
    //pistol.debug()
    game.debug.text('hp: ' + player.health, 10, 50)
    game.debug.text('equipped weapon: ' + equippedWeapon, 10, 300)
    game.debug.text(window.innerWidth + ', ' + window.innerHeight, 10, 100)
    game.debug.text('fps: ' + game.time.fps, game.width - 100, 20)
}

//functions down here-----------------------------------

//helps make the game fit within browser window
function adjustScreenDimensions() {
    var divGame = document.getElementById('game')
    divGame.style.width = window.innerWidth - 20 + 'px' //-20 is to add white space
    divGame.style.height = window.innerHeight - 20 + 'px' //-20 is to add white space
}

function initTilemap() {
    //tiled map stuff here...
    map = game.add.tilemap('map')
    map.addTilesetImage('background', 'tiles')
    map.addTilesetImage('greenWall', 'greenWall')
    groundLayer = map.createLayer('Ground')
    wallLayer = map.createLayer('Wall')
    //objectLayer = map.createLayer('Object')
    map.setCollisionByExclusion([], true, wallLayer)
    //map.setCollisionByExclusion([], true, objectLayer)
    //groundLayer.resizeWorld()
    wallLayer.resizeWorld()
    //objectLayer.resizeWorld()
    //tiled map stuff ends
}

function initPlayer() {
    player = game.add.sprite(50, 50, 'guy') //load player sprite in random location

    //player = game.add.sprite(game.rnd.between(50, 1200), game.rnd.between(50, 1200), 'guy') //load player sprite in random location
    game.physics.arcade.enable(player) //give physics to player (for hitting walls)
    player.body.collideWorldBounds = true //collides with edge of the world
    player.anchor.set(0.5) //mouse aim is now from center of sprite, instead of 0,0
    player.maxHealth = 100
    player.health = 100
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .1, .1) //camera follows the player
}

function handlePlayerInput() {
    //movement stuff
    player.body.velocity.x = 0
    player.body.velocity.y = 0
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.body.velocity.x = -moveSpeed// * game.time.physicsElapsedMS
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.body.velocity.x = moveSpeed// * game.time.physicsElapsedMS
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        player.body.velocity.y = moveSpeed// * game.time.physicsElapsedMS
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        player.body.velocity.y = -moveSpeed// * game.time.physicsElapsedMS
    }

    player.rotation = game.physics.arcade.angleToPointer(player) //player sprite rotates towards mouse pointer

    //fire weapon...fix holding down mouse button
    if (game.input.activePointer.leftButton.isDown) {
        if (equippedWeapon == 'pistol') {
            pistol.fire()
        }
        if (equippedWeapon == 'shotgun') {
            shotgun.fireMany(shotgunSpread)
        }
    }

    //equip weapon
    if (game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
        equippedWeapon = 'pistol'
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.TWO)) {
        equippedWeapon = 'shotgun'
    }
}