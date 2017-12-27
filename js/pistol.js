var Weapons;
(function (Weapons) {
    class Pistol {
        constructor() {
            this.fireRate = 100;
        }
        comment() {
            console.log('from pistol class: ');
        }
        fire(game, nextFire, bullets, player) {
            if (game.time.now > nextFire && bullets.countDead() > 0) {
                nextFire = game.time.now + this.fireRate; //next time you can shoot is 100ms away
                var bullet = bullets.getFirstDead(); //idk exactly
                bullet.reset(player.x - 8, player.y - 8); //position spawning of bullet i think
                game.physics.arcade.moveToPointer(bullet, 500); //fire bullet at pointer
            }
        }
    }
    Weapons.Pistol = Pistol;
})(Weapons || (Weapons = {}));
//# sourceMappingURL=pistol.js.map