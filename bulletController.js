import { Bullet } from "./bullet.js";

export class BulletController {
    bullets = [];
    timeTillNextBulletAllowed = 0;
    constructor(canvas, maxBulletsAtTime, bulletColor, soundEnbled) {
        this.canvas = canvas;
        this.maxBulletsAtTime = maxBulletsAtTime;
        this.bulletColor = bulletColor;
        this.soundEnbled = soundEnbled;

        this.shootSound = new Audio('./stok/audios/sounds_shoot.wav');
        this.shootSound.volume = 0.1;
    }
 
    draw(ctx) {
        this.bullets = this.bullets.filter((bullet) => bullet.y + bullet.width > 0 &&
            bullet.y <= this.canvas.height)
        this.bullets.forEach(bullet => bullet.draw(ctx));
        if (this.timeTillNextBulletAllowed > 0) {
            this.timeTillNextBulletAllowed--;
        }
    }

       
    shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
        if (this.timeTillNextBulletAllowed <= 0 &&
            this.bullets.length < this.maxBulletsAtTime) {
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
            this.bullets.push(bullet);
            if (this.soundEnbled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }
            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
        }
    }
    collideWith(sprite) {
        const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) => bullet.collideWith(sprite));
        if (bulletThatHitSpriteIndex >= 0) {
            this.bullets.splice(bulletThatHitSpriteIndex, 1);
            return true;
        }
        return false;
    }
}