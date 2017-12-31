class Pistol extends Phaser.Weapon {
    constructor(game, parent) {
        super(game, game.plugins);
        this.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.bulletKillDistance = 720;
        this.bulletSpeed = 500;
        this.fireRate = 250;
    }
    init(someVar) {
        this.someVar = someVar;
    }
}
export { Pistol };
//# sourceMappingURL=pistol.js.map