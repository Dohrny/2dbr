import { Group, Sprite } from "phaser-ce";

namespace Weapons {
    export class Pistol {
        fireRate: number = 100
        comment() {
            console.log('from pistol class: ')
        }
        fire(game: Phaser.Game, nextFire: number, bullets: Group, player) {
            if (game.time.now > nextFire && bullets.countDead() > 0) { //if(fired a bullet) i think
                nextFire = game.time.now + this.fireRate //next time you can shoot is 100ms away
                var bullet: Sprite = bullets.getFirstDead() //idk exactly
                bullet.reset(player.x - 8, player.y - 8) //position spawning of bullet i think
                game.physics.arcade.moveToPointer(bullet, 500) //fire bullet at pointer
            }
        }
    }
}