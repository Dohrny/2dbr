var game = new Phaser.Game(720, 720, Phaser.AUTO, 'game', {
    preload: preload, create: create, update: update,
    render: render
});
function preload() {
    game.load.image('guy', '/assets/player.png');
    game.load.image('bullet', '/assets/bullet.png');
    game.load.image('tiles', 'assets/tilesets/background.png');
}
var player;
var moveSpeed = 180;
var pistol;
var shotgun;
var shotgunSpread;
var equippedWeapon;
var map;
var ground;
var layer;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); //enable physics
    game.time.advancedTiming = true; //so i can show fps in debug
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }; //stops right-click from showing context menu
    //map stuff starts here
    var data = '';
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            data += '0';
            if (x < 4) {
                data += ',';
            }
        }
        if (y < 4) {
            data += '\n';
        }
    }
    game.cache.addTilemap('map', null, data, Phaser.Tilemap.CSV); //creates tilemap i think
    var map = game.add.tilemap('map', 256, 256); //loads the created tilemap i think
    map.addTilesetImage('tiles', 'tiles', 256, 256);
    var layer = map.createLayer(0);
    layer.resizeWorld();
    //ok map stuff ends
    player = game.add.sprite(game.rnd.between(50, 1200), game.rnd.between(50, 1200), 'guy'); //load player sprite in random location
    game.physics.arcade.enable(player); //give physics to player (for hitting walls)
    player.body.collideWorldBounds = true; //collides with edge of the world
    player.anchor.set(0.5); //mouse aim is now from center of sprite, instead of 0,0
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .1, .1); //camera follows the player
    pistol = game.add.weapon(10, 'bullet');
    pistol.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    pistol.bulletKillDistance = 720;
    pistol.bulletSpeed = 500;
    pistol.fireRate = 250;
    pistol.trackSprite(player, .5, .5, true);
    shotgun = game.add.weapon(20, 'bullet');
    shotgun.bulletKillType = Phaser.Weapon.KILL_DISTANCE; //needed for bulletkilldistance
    shotgun.bulletKillDistance = 200;
    shotgun.bulletSpeed = 1000;
    shotgun.bulletSpeedVariance = 100; //each bullet moves at different speed
    shotgun.bulletAngleVariance = 20; //helps create "spread"
    shotgun.fireRate = 500;
    //shotgun.fireLimit = 6s
    shotgun.trackSprite(player, .5, .5, true); //locks weapon to player sprite
    shotgunSpread = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]; //for firemany()
}
function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.x -= moveSpeed * game.time.physicsElapsed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.x += moveSpeed * game.time.physicsElapsed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        player.y += moveSpeed * game.time.physicsElapsed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        player.y -= moveSpeed * game.time.physicsElapsed;
    }
    player.rotation = game.physics.arcade.angleToPointer(player); //player sprite rotates towards mouse pointer
    if (game.input.activePointer.leftButton.isDown) {
        if (equippedWeapon == 'pistol') {
            pistol.fire();
        }
        if (equippedWeapon == 'shotgun') {
            shotgun.fireMany(shotgunSpread);
        }
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
        equippedWeapon = 'pistol';
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.X)) {
        equippedWeapon = 'shotgun';
    }
}
function render() {
    //pistol.debug()
    game.debug.text('shots: ' + shotgun.shots.toString(), 10, 50);
    game.debug.text('equipped weapon: ' + equippedWeapon, 10, 300);
    game.debug.spriteInfo(player, 32, 600);
    game.debug.text('fps: ' + game.time.fps, game.width - 100, 20);
}
//# sourceMappingURL=game.js.map