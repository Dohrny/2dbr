
class Pistol extends Phaser.Weapon {
    someVar: string

    constructor(game: Phaser.Game, parent: Phaser.PluginManager) {
        super(game, game.plugins)
        this.bulletKillType = Phaser.Weapon.KILL_DISTANCE
        this.bulletKillDistance = 720
        this.bulletSpeed = 500
        this.fireRate = 250
    }

    init(someVar: string) {
        this.someVar = someVar
    }
}

export { Pistol }

