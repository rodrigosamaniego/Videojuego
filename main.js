//Elementos del DOM
const $canvas = document.querySelector("canvas")
const ctx = $canvas.getContext('2d')

//Variables globales
let intervalId;
let frames = 0;
const gravity = 0.8;
const projectiles = [];
const obstacles = [];
let isGameOver = false;
let isGameWon = false;


//Clases, propiedades y métodos

class GameAsset{
    constructor(x, y, width, height, img){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = img;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    
}

class Board extends GameAsset{
    constructor(x, y, width, height, img){
        super(x, y, width, height, img)
    }
    draw(){
        this.x--;
        if(this.x < -this.width) this.x=0;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

    }
}


class Character extends GameAsset{
    constructor(x, y, width, height, img){
        super(x, y, width, height, img);
        this.vy = 0;
        this.vx = 0;
        this.jumpStrength = 14;
        // this.jumps = 0;
		// this.jumping = false;
}
    draw() {
        this.vy += gravity;
        this.y += this.vy;
        this.x += this.vx;
        if (this.y > $canvas.height - this.height) this.y = $canvas.height  -this.height;
        if (this.x + this.vx > $canvas.width || this.x + this.vx < 0) this.x = 0;
        if(this.y < this.height) this.y = this.height;
        
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
    }

    crash() {
        return this.x 
    }
    
    jump() {
		
        this.vy = -this.jumpStrength;
    }
    
    moveLeft(){
        this.vx-= 3;
        if(this.vx < -4) this.vx = -3;
    }
        
    moveRight(){
        this.vx+= 3;
        if(this.vx > 4) this.vx = 3;
    }
    
    
    stop(){
        this.vx = 0;
    }

    isTouching(obstacle) {
		return (
			this.x < obstacle.x + obstacle.width &&
			this.x + this.width > obstacle.x &&
			this.y < obstacle.y + obstacle.height &&
			this.y + this.height > obstacle.y
		);
	}
    
    

    
        
}
   
class Enemy extends GameAsset {
    constructor(x, y, width, height, img){
        super(x, y, width, height, img);
        this.health = 130;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    getsHit (projectile){
        return (
            this.x < projectile.x + projectile.width &&
			this.x + this.width > projectile.x &&
			this.y < projectile.y + projectile.height &&
			this.y + this.height > projectile.y

        );
    }

    liveLoss(){
        this.health--
    }
        
}

class Projectile extends GameAsset {
    constructor(x, y, width, height, img){
        super(x, y, width, height, img);
        this.vx = 0;
        this.vy = 0;
    }
    draw(){
        this.x+=7;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } 

}

class Obstacle extends GameAsset{
    constructor(x, y, width, height, img) {
        super($canvas.width, y, width, height, img)
    }
    draw(){
        this.x-=6;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        // if(this.x < 0) this.x = $canvas.width;
    }
}

//Instancias de las clases
const boardImage = 
"/images/background.recortado.enserio.jpg";

const ninjaImage =
"/images/Genji-OWart.png";

const bossImage =
"/images/MSOGT_Bowser.png";

const obstacleImage =
"/images/bomb.png";

const projectileImage =
"/images/kisspng-shuriken-computer-icons-ninja-weapon-5af5f3f5319961.6333373815260682132032.png"

const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
const ninja = new Character(100, $canvas.height -215, 138, 150, ninjaImage);
const boss = new Enemy($canvas.width -290, 160, 290, 243, bossImage)



//Funciones del flujo del juego
function start(){
    if (intervalId) return;
    intervalId = setInterval(() => {
        update();
    }, 1000 / 60);
}


function update(){
    frames ++
    generateObstacles();
    checkCollitions();
    checkHits();
    bossKilled();
   clearCanvas();
   board.draw();
   ninja.draw();
   boss.draw();
   gameOver();
   gameWon();
   printProjectiles();

   printObstacles();
  
   
   
}

function gameOver() {
	if (isGameOver) {
		ctx.font = "40px sans-serif";
		ctx.fillText("Game Over", $canvas.width / 3, $canvas.height / 2);
	}
}

function gameWon() {
	if (isGameWon) {
		ctx.font = "40px sans-serif";
		ctx.fillText("Congratulations", $canvas.width / 3, $canvas.height / 2);
	}
}


    



//Funciones de apoyo

function clearCanvas () {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
}

function printProjectiles(){
    projectiles.forEach((projectile) => projectile.draw());
}

function generateObstacles(){
    if (frames % 100 === 0){
    const bomb = new Obstacle($canvas.width, 367, 33, 34, obstacleImage);
    obstacles.push(bomb)}
}

function printObstacles(){
    
    obstacles.forEach((bomb)=> 
        bomb.draw());
    }

function checkCollitions(){
    obstacles.forEach((obstacle) => {
        if(ninja.isTouching(obstacle)){
            clearInterval(intervalId);
            isGameOver = true;
        }
    });
}

function checkHits(){
    projectiles.forEach((projectile) => {
        if(boss.getsHit(projectile)){
            boss.health--;
            

        }
    })
}

function bossKilled(){
    if(boss.health < 1) 
    {clearInterval(intervalId); isGameWon = true;}
}






//Funciones de interacción con el usuario

document.onkeydown = (event) => {
    switch (event.key) {
        case "ArrowLeft":
            ninja.moveLeft();
            break;
        case "ArrowRight":
            ninja.moveRight();
            break;
        case "ArrowUp":
            ninja.jump();
            break;
        case "e":
            const projectile = new Projectile(ninja.x, ninja.y +70, 10, 10, projectileImage)
            projectiles.push(projectile)
            break;
        case "Enter":
            start();
            break;
        default:
            break;
    }
    
        
    
}

document.onkeyup = (event) => {
    switch (event.key) {
        case "ArrowLeft":
            ninja.stop();
            break;
        case "ArrowRight":
            ninja.stop();
            break;
        
    
        default:
            break;
    }
}
//Iniciar el juego

