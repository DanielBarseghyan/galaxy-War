import { Enemy } from "./enemy.js";
import { movingDirection } from "./movingDirection.js";

export class EnemyContriller {
    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];
    enemyRows = [];
    curentDiection = movingDirection.right;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;
    fireBulletTimerDefault = 100;
    fireBulletTimer = this.fireBulletTimerDefault;

    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController
        this.createEnemies();
    }




    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();
        this.drawEnemyes(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();

    }

    collisionDetection() {
        this.enemyRows.forEach(enemyRow => {
            enemyRow.forEach((enemy, enemyIndex) => {
                if (this.playerBulletController.collideWith(enemy)) {
                    enemyRow.splice(enemyIndex, 1)
                }
            })
        })
        this.enemyRow = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
    }

    fireBullet() {
        this.fireBulletTimer--;
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);

        }
    }
    resetMoveDownTimer() {
        if (this.moveDownTimer <= 0) {
            this.moveDownTimer = this.moveDownTimerDefault
        }
    }


    decrementMoveDownTimer() {
        if (this.curentDiection === movingDirection.downLeft ||
            this.curentDiection === movingDirection.downRight) {
            this.moveDownTimer--
        }
    }

    updateVelocityAndDirection() {
        for (const enemyRow of this.enemyRows) {
            if (this.curentDiection == movingDirection.right) {
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                const rightMostEnemy = enemyRow[enemyRow.length - 1];
                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
                    this.curentDiection = movingDirection.downLeft;
                    break;
                }
            }
            else if (this.curentDiection === movingDirection.downLeft) {
                if (this.moveDown(movingDirection.left)) {
                    break;
                }
            }
            else if (this.curentDiection === movingDirection.left) {
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const leftMostEnemy = enemyRow[0];

                if (leftMostEnemy.x <= 0) {
                    this.curentDiection = movingDirection.downRight;
                    break;
                }
            }
            else if (this.curentDiection === movingDirection.downRight) {
                if (this.moveDown(movingDirection.right)) {
                    break;
                }
            }
        }
    }

    moveDown(newDirection) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if (this.moveDownTimer <= 0) {
            this.curentDiection = newDirection;
            return true;
        }
        return false
    }

    drawEnemyes(ctx) {
        this.enemyRows.flat().forEach((enemy) => {
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        })
    }
    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNum, enemyIndex) => {
                if (enemyNum > 0) {
                    this.enemyRows[rowIndex].push(new Enemy(enemyIndex * 40, rowIndex * 25, enemyNum))
                }
            });
        });
    }
    collideWith(sprite) {
        return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
    }
}