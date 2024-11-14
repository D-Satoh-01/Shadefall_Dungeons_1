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

let flagMenu_1 = false;
let flagMenu_2 = false;


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
    x * tileSize + shakeX,
    y * tileSize + shakeY,
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
    textX = canvas.width - UIWidth * tileSize + 25;
  }
  ctx.fillText(text, textX, textY);
}

function draw(){
  if (gameState == "running" || gameState == "dead"){
    screen.clearRect(0, 0, canvas.width, canvas.height);

    screenshake();

    for (let i=0; i<numTiles; i++){
      for (let j=0; j<numTiles; j++){
        getTile(i, j).draw();
      }
    }
    for (let i=0; i<monsters.length; i++){
      monsters[i].draw();
    }

    player.draw();

    drawText ("Level: " + level, 30, false, 40, "white");
    drawText ("Score: " + score, 30, false, 70, "white");

    screen.fillStyle = "#222222";
    screen.fillRect (canvas.width - 240, canvas.height - 85, canvas.width - 610, canvas.height - 510);
    screen.fillStyle = "#ffffff";
    screen.fillRect (600, 500, 200, 50);
    screen.fillStyle = "#222222";
    screen.fillText ("クリック", canvas.width - 190, canvas.height - 40);

    if (flagMenu_1 == true){
      screen.fillStyle = "#222222";
      screen.fillRect (10, 10, 540, 440);
      screen.fillStyle = "#eeeeee";
      screen.fillRect (20, 20, 520, 420);
      screen.fillStyle = "#222222";
      screen.fillText ("メニュー１", 40, 60);
      screen.fillText ("☒", 505, 55);
      screen.fillStyle = "#222222";
      screen.fillRect (250, 300, 215, 65);
      screen.fillStyle = "#eeeeee";
      screen.fillRect (255, 305, 205, 55);
      screen.fillStyle = "#222222";
      screen.fillText ("クリック", 295, 345);

      if (flagMenu_2 == true){
        screen.fillStyle = "#222222";
      screen.fillRect (30, 30, 560, 460);
      screen.fillStyle = "#eeeeee";
      screen.fillRect (40, 40, 540, 440);
      screen.fillStyle = "#222222";
      screen.fillText ("メニュー２", 60, 80);
      screen.fillText ("☒", 545, 75);
      }

    }

    for (let i=0; i<player.spells.length; i++){
      let spellText = (i+1) + ")" + (player.spells[i] || "");
      drawText(spellText, 20, false, 100 + i * 40, "aqua");
    }
  }
}

function screenshake(){
  if (shakeAmount){
    shakeAmount --;
  }
  let shakeAngle = Math.random() * Math.PI * 2;
  shakeX = Math.round(Math.cos(shakeAngle) * shakeAmount);
  shakeY = Math.round(Math.sin(shakeAngle) * shakeAmount);
}

// ワールドとモンスターを更新
function tick(){
  for (let k = monsters.length - 1; k >= 0; k--){
    if (!monsters[k].dead){
      monsters[k].update();
    } else {
      monsters.splice(k, 1);
    }
  }
  if (player.dead){
    addScore(score, false);
    gameState = "dead";
  }

  spawnCounter --;
  if (spawnCounter <= 0){
    spawnMonster();
    spawnCounter = spawnRate;
    spawnRate --;
  }
}

function showTitle(){
  ctx.fillStyle = 'rgba(20,20,20,.75)';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  gameState = "title";

  drawText("Shadefall Dungeons", 70, true, canvas.height/2 -70, "white");
  drawText("[ Press any key ]", 30, true, canvas.height/2 + 0, "white");

  drawScores();
}

function startGame(){                                           
  level = 1;
  score = 0;
  numSpells = 1;
  startLevel(startingHp);

  gameState = "running";
  update();
}

function startLevel(playerHp){    
  spawnRate = 15;
  spawnCounter = spawnRate;
  
  generateLevel();

  player = new Player(randomPassableTile());
  player.hp = playerHp;

  randomPassableTile().replace(Exit);
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
    if (event.code == 'Digit2'){
      player.castSpell(1);
    }
    if (event.code == 'Digit3'){
      player.castSpell(2);
    }
    if (event.code == 'Digit4'){
      player.castSpell(3);
    }
    if (event.code == 'Digit5'){
      player.castSpell(4);
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

function getScores(){
  if (localStorage["scores"]){
    return JSON.parse(localStorage["scores"]);
  } else {
    return [];
  }
}

function addScore(score, won){
  let scores = getScores();
  let scoreObject = {score: score, run: 1, totalScore: score, active: won};
  let lastScore = scores.pop();

  if (lastScore){
    if (lastScore.active){
      scoreObject.run = lastScore.run + 1;
      scoreObject.totalScore += lastScore.totalScore;
    } else {
      scores.push(lastScore);
    }
  }
  scores.push(scoreObject);

  localStorage["scores"] = JSON.stringify(scores);
}

function drawScores(){
  let scores = getScores();
  if (scores.length){
    drawText(
      rightPad(["RUN", "SCORE", "TOTAL"]),
      18,
      true,
      canvas.height/10 * 6,
      "white"
    );

    let newestScore = scores.pop();
    scores.sort(function(a, b){
      return b.totalScore - a.totalScore;
    });
    scores.unshift(newestScore);

    for (let i=0; i<Math.min(10, scores.length); i++){
      let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
      drawText(
        scoreText,
        18,
        true,
        canvas.height/10 * 6 + 24+i*24,
        i == 0 ? "yellow" : "white"
      );
    }
  }
}

function initSounds(){
  sounds = {
    hit1: new Audio('Sounds/hit_1.wav'),
    hit2: new Audio('Sounds/hit_2.wav'),
    newLevel: new Audio('Sounds/stairs_1.wav')
  };
}

function playSound(soundName){
  sounds[soundName].currentTime = 0;
  sounds[soundName].play();
}


function update(){
  draw();
  movePlayer();

  requestAnimationFrame(update);
}



var mouseX;
var mouseY;

window.onload = function(){
  canvas.onclick = function(e){

    rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - Math.floor(rect.left);
    mouseY = e.clientY - Math.floor(rect.top);

    if (mouseX > 587 && mouseY > 485 && mouseX < 817 && mouseY < 558){
      flagMenu_1 = !flagMenu_1;
    }
    if (flagMenu_1 && mouseX > 510 && mouseY > 35 && mouseX < 526 && mouseY < 52){
      flagMenu_1 = !flagMenu_1;
    }
    if (flagMenu_1 && mouseX > 255 && mouseY > 300 && mouseX < 463 && mouseY < 356){
      flagMenu_2 = !flagMenu_2;
    }
    if (flagMenu_2 && mouseX > 548 && mouseY > 53 && mouseX < 567 && mouseY < 72){
      flagMenu_2 = !flagMenu_2;
    }
    

    console.log(mouseX + ", " + mouseY);
  }
}