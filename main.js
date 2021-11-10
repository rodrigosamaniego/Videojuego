//Elementos del DOM
const $canvas = document.querySelector("canvas")
const ctx = $canvas.getContext('2d')

//Variables globales
let intervalId;
let frames = 0;
const friction = 0.8;
const gravity = 0.8;
const bullets = [];
const obstacles = [];


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

    
        
}
   
class Enemy extends GameAsset {
    constructor(x, y, width, height, img){
        super(x, y, width, height, img);
        this.vx = 0;
        this.vy = 0;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
        
}

class Obstacle extends GameAsset{
    constructor(x, y, width, height, img) {
        super($canvas.width, y, width, height, img)
    }
    draw(){
        this.x-=5;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if(this.x < 0) this.x = $canvas.width;
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

const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
const ninja = new Character(100, $canvas.height -215, 138, 150, ninjaImage);
const boss = new Enemy($canvas.width -290, 160, 290, 243, bossImage)
const bomb = new Obstacle($canvas.width -53, 348, 53, 54, obstacleImage)
//Funciones del flujo del juego
function start(){
    setInterval(() => {
        update();
    }, 1000 / 60);
}


function update(){
    frames ++
   clearCanvas();
   board.draw();
   ninja.draw();
   boss.draw();
   bomb.draw();
   
}

    



//Funciones de apoyo

function clearCanvas () {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
}

function generateObstacles(){
    // if(frames % 300 === 0) 
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

