// game.js ------------------------------------------------------------
spritesheet = new Image();
spritesheet.src = 'spritesheet.png';

let pressKeyFlagLeft = false;
let pressKeyFlagRight = false;
let pressKeyFlagUp = false;
let pressKeyFlagDown = false;
let releaseKeyFlagLeft = false;
let releaseKeyFlagRight = false;
let releaseKeyFlagUp = false;
let releaseKeyFlagDown = false;


function setupCanvas(){
  screen = document.querySelector("canvas").getContext("2d");
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tileSize * (numTiles + UIWidth);
  canvas.height = tileSize * numTiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y){
  screen.drawImage(
    spritesheet,
    sprite*32,
    0,
    32,
    32,
    x * tileSize,
    y * tileSize,
    tileSize,
    tileSize
  );
}

function drawText(text, size, centered, textY, color){
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  let textX;
  if (centered){
    textX = (canvas.width - ctx.measureText(text).width) / 2;
  } else {
    textX = canvas.width - UIWidth * tileSize + 15;
  }
  ctx.fillText(text, textX, textY);
}

function draw(){
  if (gameState == "running" || gameState == "dead"){
    screen.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i<numTiles; i++){
      for (let j=0; j<numTiles; j++){
        getTile(i, j).draw();
      }
    }
    player.draw();

    drawText ("Area:", 30, false, 40, "white");
    drawText ("X:" + player.currentAreaX +", Y:"+ player.currentAreaY +", Z:"+ player.currentAreaZ, 30, false, 80, "white");
    drawText ("Money: " + money, 30, false, 140, "white");
  }
}

function tick(){
  player.update();
}

document.addEventListener('keydown', function(event){
  if (gameState == "running"){
    if (event.code == 'KeyW' || event.code == 'ArrowUp'){
      pressKeyFlagUp = true;
    }
    if (event.code == 'KeyS' || event.code == 'ArrowDown'){
      pressKeyFlagDown = true;
    }
    if (event.code == 'KeyA' || event.code == 'ArrowLeft'){
      pressKeyFlagLeft = true;
    }
    if (event.code == 'KeyD' || event.code == 'ArrowRight'){
      pressKeyFlagRight = true;
    }
  }
});

document.addEventListener('keyup', function(event){
  if(gameState == "title"){                              
    startGame();                
  }else if(gameState == "dead"){                             
    showTitle();                                        
  }else if(gameState == "running"){
    if (event.code == 'KeyW' || event.code == 'ArrowUp'){
      releaseKeyFlagUp = true;
        }
    if (event.code == 'KeyS' || event.code == 'ArrowDown'){
      releaseKeyFlagDown = true;
    }
    if (event.code == 'KeyA' || event.code == 'ArrowLeft'){
      releaseKeyFlagLeft = true;
    }
    if (event.code == 'KeyD' || event.code == 'ArrowRight'){
      releaseKeyFlagRight = true;
    }

    if (event.code == 'Digit1'){
      player.castSpell(0);
    }
  };
});

function movePlayer(){
  if (gameState == "running"){
    if (releaseKeyFlagLeft == true && pressKeyFlagDown == false && pressKeyFlagUp == false){
      player.tryMove(-1, 0);  // 移動：左
      resetMoveFlags();
    }
    if (releaseKeyFlagRight == true && pressKeyFlagDown == false && pressKeyFlagUp == false){
      player.tryMove(1, 0);  // 移動：右
      resetMoveFlags();
    }
    if (releaseKeyFlagUp == true && pressKeyFlagLeft == false && pressKeyFlagRight == false){
      player.tryMove(0, -1);  // 移動：上
      resetMoveFlags();
    }
    if (releaseKeyFlagDown == true && pressKeyFlagLeft == false && pressKeyFlagRight == false){
      player.tryMove(0, 1);  // 移動：下
      resetMoveFlags();
    }
    if (releaseKeyFlagLeft == true && releaseKeyFlagUp == true){
      player.tryMove(-1, -1);  // 移動：左上
      resetMoveFlags();
    }
    if (releaseKeyFlagRight == true && releaseKeyFlagUp == true){
      player.tryMove(1, -1);  // 移動：右上
      resetMoveFlags();
    }
    if (releaseKeyFlagLeft == true && releaseKeyFlagDown == true){
      player.tryMove(-1, 1);  // 移動：左下
      resetMoveFlags();
    }
    if (releaseKeyFlagRight == true && releaseKeyFlagDown == true){
      player.tryMove(1, 1);  // 移動：右下
      resetMoveFlags();
    }
  }
}

function resetMoveFlags(){
  pressKeyFlagUp = false;
  pressKeyFlagDown = false;
  pressKeyFlagLeft = false;
  pressKeyFlagRight = false;
  releaseKeyFlagUp = false;
  releaseKeyFlagDown = false;
  releaseKeyFlagLeft = false;
  releaseKeyFlagRight = false;
}

// 画面端を超えたときにエリア移動（エリア座標の変動）
function moveArea(){
  if (player.tile.x < 0){
    player.currentAreaX -= 1;
    player.tile.x = 20;
    setTimeout(function() {
      generateNearbyAreas();
    }, 80);
  }
  if (player.tile.x > 20){
    player.currentAreaX += 1;
    player.tile.x = 0;
    setTimeout(function() {
      generateNearbyAreas();
    }, 80);
  }
  if (player.tile.y < 0){
    player.currentAreaY -= 1;
    player.tile.y = 20;
    setTimeout(function() {
      generateNearbyAreas();
    }, 80);
  }
  if (player.tile.y > 20){
    player.currentAreaY += 1;
    player.tile.y = 0;
    setTimeout(function() {
      generateNearbyAreas();
    }, 80);
  }

  // 下り階段
  if (player.tile.sprite == 16){
    setTimeout(function() {
      generateNearbyAreas();
    }, 80);
  }
  // 上り階段
  if (player.tile.sprite == 13){
    setTimeout(function() {
      generateNearbyAreas();
    }, 80);
  }
}

function update(){
  draw();
  movePlayer();

  areaXYZ = "area_" + player.currentAreaX +"_"+ player.currentAreaY +"_"+ player.currentAreaZ;

  moveArea();

  requestAnimationFrame(update);
}