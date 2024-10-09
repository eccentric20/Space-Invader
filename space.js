// board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight,
    alive : true
}

let shipImg;
let shipVelocityX = tileSize;

// aliens
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;


let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocity = 1;

// bullets
let bulletArray = [];
let bulletVelocity = -10;
let bulletImg;

let alienBulletArray = [];
let alienBulletVelocity = 5;

let score = 0;







window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // draw the ship
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function(){
        
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    
    
      
                         
    
    createAlien();
    requestAnimationFrame(update);

    // draw bulltes
    bulletImg = new Image();
    bulletImg.src = "./bullet.png";
    bulletImg.onload = function(){
        bulletWidth = bulletImg.width;
        bulletHeight = bulletImg.height;
        requestAnimationFrame(update);
    }


    
    
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shootBullet);

    setInterval(alienShootBullet, 2000);
        
    
}

function update(){
    
    

    context.clearRect(0,0,board.width,board.height);
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    
    for(let i=0;i<alienArray.length;i++){
        let alien = alienArray[i];
        if(alien.alive){
            if(!isGameOver){
                alien.x += alienVelocity;
            

            // if alien touches border
                if(alien.x + alien.width >= board.width || alien.x<=0){
                    
                    alienVelocity *= -1;
                    alien.x += alienVelocity * 2;
                    alienArray.forEach(element => {
                        element.y += alienHeight;
                    })
                    
                    
                }

                if(alien.y + alien.height >= ship.y){
                    gameOver();
                    
                    

                }
            }

            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            
            
           
        }
        

        
    }

    if(!isGameOver){
        for(let i=0;i<bulletArray.length;i++){
            let bullet = bulletArray[i];
            bullet.y += bulletVelocity;
            context.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    
            for(let i=0;i<alienArray.length;i++){
                let alien = alienArray[i];
                if(alien.alive && !bullet.used &&  isColliding(alien, bullet)){
                    alien.alive = false;
                    alienCount--;
                    score += 100;
                    bullet.used = true;
                    
                }
                
            }
    
            
        }

        for(let i=0; i<alienBulletArray.length;i++){
            let alienBullet = alienBulletArray[i];
            alienBullet.y += alienBulletVelocity;
            context.fillStyle = "red";
            context.fillRect(alienBullet.x, alienBullet.y, alienBullet.width, alienBullet.height);

            if(ship.alive && isColliding(alienBullet, ship)){
                ship.alive = false;
                gameOver();
            }
        }

        alienBulletArray = alienBulletArray.filter(bullet => bullet.y<boardHeight);


    
        
    
        
    
        while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
            bulletArray.shift();

        }

        
    }

    


    
              

    if(isGameOver){
        context.fillStyle = "red";
        context.font = "60px Courier New";
        context.textAlign = "center";
        context.fillText("Game Over!", boardWidth/2, boardHeight/2);
    }
    else{
        requestAnimationFrame(update);
    }

    if(alienCount == 0){
        alienColumns = Math.min(alienColumns+1, columns/2-2);
        alienRows = Math.min(alienRows+1, rows-4);
        alienVelocity = alienVelocity > 0 ? alienVelocity + 0.2 : alienVelocity;
        alienArray = [];
        bulletArray = [];
        alienBulletArray = [];
        createAlien();
    }

    // score
    context.fillStyle = "white";
    context.font = "10px courier";
    context.fillText(score, 20, 20);

    



}

function moveShip(e){
    if(e.code == "ArrowLeft"){
        
        if(ship.x>0){
            ship.x -= shipVelocityX;
        }
        
    }
    else if(e.code == "ArrowRight"){
        
        if(ship.x<448){
            ship.x += shipVelocityX;
        }
    }
}

function createAlien(){
    let alienColorArray = ['red', 'green', 'purple', 'algae'];
    let ranIndex = Math.floor(Math.random() * alienColorArray.length); // Get random index
    let alienColor = alienColorArray[ranIndex]; // Select random color
    alienImg = new Image();
    alienImg.src = './' + alienColor + '_alien.png';
    alienCount = alienRows * alienColumns;
    for(let c=0;c<alienColumns;c++){
        for(let r=0;r<alienRows;r++){
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            
            alienArray.push(alien);
                
            
        }
    }
}

function shootBullet(e){
    if(e.code == "Space"){
        let bulletWidth = ship.width;
        let bulletHeight = ship.height * 2;
        let bullet = {
            x : ship.x + (ship.width/2) - (bulletWidth/2),
            y : ship.y,
            width : bulletWidth,
            height : bulletHeight,
            used : false
        }
        bulletArray.push(bullet);
    }
}

function alienShootBullet(){
    let shootingAliens = alienArray.filter(alien => alien.alive);
    if(shootingAliens.length > 0){
        let randomAlien = shootingAliens[Math.floor(Math.random()*shootingAliens.length)];
        let alienBulletWidth = randomAlien.width/8;
        let alienBulletHeight = randomAlien.height/4;                                    ;
        let alienBullet = {
            x : randomAlien.x + randomAlien.width/2 - alienBulletWidth/2,
            y : randomAlien.y + randomAlien.height,
            width : alienBulletWidth,
            height : alienBulletHeight,
            used : false
        };

        alienBulletArray.push(alienBullet);
    }
}



function isColliding(bullet, alien){
    let horizontalCollision = bullet.x < alien.x + alien.width && bullet.x + bullet.width > alien.x;
    let verticalCollision = bullet.y < alien.y + alien.height && bullet.y + bullet.height > alien.y;

    return horizontalCollision && verticalCollision;
}



let isGameOver = false;

function gameOver(){
    isGameOver = true;

    
}



