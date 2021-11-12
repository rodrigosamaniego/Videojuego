//Elementos del DOM
const startScreen = document.querySelector("#gameStart");
const gameScreen = document.querySelector("#gamePlaying");

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
        this.img0 = new Image();
        this.img1 = new Image();
        this.img2 = new Image();
        this.img3 = new Image();
        this.img4 = new Image();
        this.img5 = new Image();
        this.img6 = new Image();
        this.img7 = new Image();
        this.img8 = new Image();
        this.img9 = new Image();

        this.img0.src ="/images/Run__000.png";
        this.img1.src ="/images/Run__001.png";
        this.img2.src ="/images/Run__002.png";
        this.img3.src ="/images/Run__003.png";
        this.img4.src ="/images/Run__004.png";
        this.img5.src ="/images/Run__005.png";
        this.img6.src ="/images/Run__006.png";
        this.img7.src ="/images/Run__007.png";
        this.img8.src ="/images/Run__007.png";
        this.img9.src ="/images/Run__009.png";
        this.animation = 0;
        
        this.vy = 0;
        this.vx = 0;
        this.jumpStrength = 14;
        
}
    draw() {
        this.vy += gravity;
        this.y += this.vy;
        this.x += this.vx;
        if (this.y > $canvas.height - this.height) this.y = $canvas.height  -this.height;
        if (this.x + this.vx > $canvas.width || this.x + this.vx < 0) this.x = 0;
        if(this.y < this.height) this.y = this.height;
        if(frames % 3 === 0){
            this.animation++
            if(this.animation === 9) this.animation = 0;
        }
        
        if(this.animation === 0){
            ctx.drawImage(this.img0, this.x, this.y, this.width, this.height);
        }else if (this.animation === 1) {
            ctx.drawImage(this.img1, this.x, this.y, this.width, this.height);    
        }else if (this.animation === 2) {
            ctx.drawImage(this.img2, this.x, this.y, this.width, this.height); 
        } else if (this.animation === 3) {
            ctx.drawImage(this.img3, this.x, this.y, this.width, this.height); 
        } else if (this.animation === 4) {
            ctx.drawImage(this.img4, this.x, this.y, this.width, this.height); 
        } else if (this.animation === 5) {
            ctx.drawImage(this.img5, this.x, this.y, this.width, this.height); 
        } else if (this.animation === 6) {
            ctx.drawImage(this.img6, this.x, this.y, this.width, this.height); 
        } else if (this.animation === 7) {
            ctx.drawImage(this.img7, this.x, this.y, this.width, this.height); 
        } else if (this.animation === 8) {
            ctx.drawImage(this.img8, this.x, this.y, this.width, this.height); 
        } else {
            ctx.drawImage(this.img9, this.x, this.y, this.width, this.height); 
        } 
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
        this.animation = 0;
        this.img0 = new Image();
        this.img2 = new Image();

        this.img0.src ="/images/Tanque.png";
        this.img2.src = "/images/tanque rojo.png";


    }
    draw(){
        if(this.health > 60){
            ctx.drawImage(this.img0, this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img2, this.x, this.y, this.width, this.height);
        }
        
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
"/images/sakura6.jpg";

const ninjaImage =
"/images/Run__001.png";

const bossImage =
"/images/Tanque.png";

const obstacleImage =
"/images/bomb.recortada.png";

const projectileImage =
"/images/kisspng-shuriken-computer-icons-ninja-weapon-5af5f3f5319961.6333373815260682132032.png"

const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
const ninja = new Character(100, $canvas.height -215, 138, 150, ninjaImage);
const boss = new Enemy($canvas.width -360, 260, 360, 137, bossImage)



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
   gameStarts();
   printProjectiles();

   printObstacles();
  
   
   
}

function gameOver() {
	if (isGameOver) {
		ctx.font = "40px sans-serif";
		ctx.fillText("Game Over Refresh To Play Again", $canvas.width / 6, $canvas.height / 2);
	}
}

function gameWon() {
	if (isGameWon) {
		ctx.font = "40px sans-serif";
		ctx.fillText("You Have Saved Your Country!", $canvas.width / 6, $canvas.height / 2);
	}
}

function gameStarts (){
    if(start)startScreen.style.display = "none"
}

function gamePlaying (){
    if(startScreen.style.display)gameScreen.style.display = "none"
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
    obstacles.push(bomb)
}
    obstacles.forEach((obs, index) => {
    if (obs.x + obs.width < 0) obstacles.splice(1, index);
});

}




function checkCollitions(){
    obstacles.forEach((obs) => {
        if(ninja.isTouching(obs)){
            clearInterval(intervalId);
            isGameOver = true;
        }
    });
}
function printObstacles(){
    
    obstacles.forEach((bomb)=> 
        bomb.draw());
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

