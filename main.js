//Elementos del DOM
const $canvas = document.querySelector("canvas")
const ctx = $canvas.getContext('2d')

//Variables globales
let frames = 0;
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
}
    draw() {
        this.y += this.vy;
        this.x += this.vx;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    moveLeft(){
        this.vx-= 2;
    }
    moveRight(){
        this.vx+= 2;
    }
    stop(){
        this.vx = 0;
    }
        
}
   

class Obstacle extends GameAsset{
    constructor(x, y, width, height, img) {
        super($canvas.width, y, width, height, img)
    }
    draw(){
        this.x--
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


//class Boss {}


//Instancias de las clases
const boardImage = 
"/images/background.jpg";

const ninjaImage =
"/images/Genji-OWart.png";

const board = new Board(0, 0, $canvas.width, $canvas.height, boardImage);
const ninja = new Character(100, 185, 138, 150, ninjaImage);

//Funciones del flujo del juego
function start(){
    setInterval(() => {
        update();
    }, 1000 / 60);
}


function update(){
   clearCanvas();
   board.draw();
   ninja.draw();

    
}



//Funciones de apoyo

function clearCanvas () {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
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

