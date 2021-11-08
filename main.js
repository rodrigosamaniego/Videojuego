//Elementos del DOM
const $canvas = document.querySelector("canvas")
const ctx = $canvas.getContext('2d')

//Variables globales
let frames = 0;

//Clases, propiedades y métodos
class GameAsset{
    constructor(x, y, width, height, img){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image()
        this.image.src = img;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    
}

class Character{
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 40
        this.height = 40
        this.vx = 0
        this.vy = 0
    }
    draw(){
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "black"
    }
}
class Boss {}


//Instancias de las clases
//Funciones del flujo del juego
//Funciones de interacción con el usuario
//Iniciar el juego
