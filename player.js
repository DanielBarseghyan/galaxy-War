export class Player {
    rightPressed = false;
    leftPressed = false;
    shootPressed = false;

    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletController = bulletController;

        this.width = 50;
        this.height = 48;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 70;
        this.image = new Image();
        this.image.src = './stok/images/player.png';

        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }

        draw(ctx) {
            if (this.shootPressed) {
                this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10)
            }
            this.move();
            this.colideWithWalls();
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        colideWithWalls() {
            if (this.x < 0) {
                this.x = 0;
            }

            if (this.x > this.canvas.width - this.width) {
                this.x = this.canvas.width - this.width;
            }
        }

        move() {
            if (this.rightPressed) {
                this.x += this.velocity;
            }
            else if (this.leftPressed) {
                this.x += -this.velocity;
            }
        }

        keydown = ({ key }) => {
            if (key == 'ArrowRight') {
                this.rightPressed = true;
            }
            if (key == 'ArrowLeft') {
                this.leftPressed = true;
            }
            if (key == 'ArrowUp') {
                this.shootPressed = true;
            }
        }
        keyup = ({ key }) => {

            if (key == 'ArrowRight') {
                this.rightPressed = false;
            }
            if (key == 'ArrowLeft') {
                this.leftPressed = false;
            }
            if (key == 'ArrowUp') {
                this.shootPressed = false;
            }
        }

    }

