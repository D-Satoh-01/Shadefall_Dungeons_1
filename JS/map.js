// map.js -------------------------------------------------------------
let tiles = [];

function inBounds(x, y){
  return x > 0 && y > 0 && x < numTiles -1 && y < numTiles -1;
}

function getTile(x, y){
  if (tiles[x] && tiles[x][y]){
    return tiles[x][y];
  } else {
    return new DirtFloor(x, y);
  }
}

function getTileInBounds(x, y){
  if (inBounds(x, y) && tiles[x] && tiles[x][y]){
    return tiles[x][y];
  } else {
    return new DirtFloor(x, y);
  }
}

function randomPassableTile(){
  let tile;
  tryTo('get random passable tile', function(){
    let x = randomRange(0, numTiles-1);
    let y = randomRange(0, numTiles-1);
    tile = getTile(x, y);
    return tile.passable && !tile.monster;
  });
  return tile;
}

function generateDirtArea_1_1(){
  let passableTiles = 0;
  tiles = [];
  for (let i=0; i<numTiles; i++){
    tiles[i] = [];
    for (let j=0; j<numTiles; j++){
      tiles[i][j] = new DirtFloor(i, j);
      passableTiles ++;
    }
  }
  return tiles;
}

function generatePlain_1_1(){
  let passableTiles = 0;
  tiles = [];
  for (let i=0; i<numTiles; i++){
    tiles[i] = [];
    for (let j=0; j<numTiles; j++){
      if (Math.random() < 0.002){
        tiles[i][j] = new StairsDown(i, j);
      }else if (Math.random() < 0.9){
        tiles[i][j] = new DirtGrassFloor(i, j);
      } else {
        tiles[i][j] = new DirtFloor(i, j);
      passableTiles ++;
      }
    }
  }
  return tiles;
}

function generateCave_1_1(){
  let passableTiles = 0;
  tiles = [];
  for (let i=0; i<numTiles; i++){
    tiles[i] = [];
    for (let j=0; j<numTiles; j++){
      if (Math.random() < 0.002){
        tiles[i][j] = new StairsDown(i, j);
      } else if (Math.random() < 0.002){
        tiles[i][j] = new StairsUp(i, j);
      } else if (Math.random() < 0.2){
        tiles[i][j] = new Wall(i, j);
      } else {
        tiles[i][j] = new RockFloor(i, j);
      passableTiles ++;
      }
    }
  }
  return tiles;
}

function generateNearbyAreas(){
  areaTopLeft = `area_${player.currentAreaX-1}_${player.currentAreaY-1}_${player.currentAreaZ}`;
  areaTopCenter = `area_${player.currentAreaX}_${player.currentAreaY-1}_${player.currentAreaZ}`;
  areaTopRight = `area_${player.currentAreaX+1}_${player.currentAreaY-1}_${player.currentAreaZ}`;
  areaLeftCenter = `area_${player.currentAreaX-1}_${player.currentAreaY}_${player.currentAreaZ}`;
  areaRightCenter = `area_${player.currentAreaX+1}_${player.currentAreaY}_${player.currentAreaZ}`;
  areaBottomLeft = `area_${player.currentAreaX-1}_${player.currentAreaY+1}_${player.currentAreaZ}`;
  areaBottomCenter = `area_${player.currentAreaX}_${player.currentAreaY+1}_${player.currentAreaZ}`;
  areaBottomRight = `area_${player.currentAreaX+1}_${player.currentAreaY+1}_${player.currentAreaZ}`;

  areaTopLeftDown = `area_${player.currentAreaX-1}_${player.currentAreaY-1}_${player.currentAreaZ-1}`;
  areaTopCenterDown = `area_${player.currentAreaX}_${player.currentAreaY-1}_${player.currentAreaZ-1}`;
  areaTopRightDown = `area_${player.currentAreaX+1}_${player.currentAreaY-1}_${player.currentAreaZ-1}`;
  areaLeftCenterDown = `area_${player.currentAreaX-1}_${player.currentAreaY}_${player.currentAreaZ-1}`;
  areaRightCenterDown = `area_${player.currentAreaX+1}_${player.currentAreaY}_${player.currentAreaZ-1}`;
  areaBottomLeftDown = `area_${player.currentAreaX-1}_${player.currentAreaY+1}_${player.currentAreaZ-1}`;
  areaBottomCenterDown = `area_${player.currentAreaX}_${player.currentAreaY+1}_${player.currentAreaZ-1}`;
  areaBottomRightDown = `area_${player.currentAreaX+1}_${player.currentAreaY+1}_${player.currentAreaZ-1}`;

  if (!(areaXYZ in areas)){
    // 地上
    if (!(areaTopLeft in areas)){
      areas[areaTopLeft] = generatePlain_1_1();
    }
    if (!(areaTopCenter in areas)){
      areas[areaTopCenter] = generatePlain_1_1();
    }
    if (!(areaTopRight in areas)){
      areas[areaTopRight] = generatePlain_1_1();
    }
    if (!(areaLeftCenter in areas)){
      areas[areaLeftCenter] = generatePlain_1_1();
    }
    if (!(areaRightCenter in areas)){
      areas[areaRightCenter] = generatePlain_1_1();
    }
    if (!(areaBottomLeft in areas)){
      areas[areaBottomLeft] = generatePlain_1_1();
    }
    if (!(areaBottomCenter in areas)){
      areas[areaBottomCenter] = generatePlain_1_1();
    }
    if (!(areaBottomRight in areas)){
      areas[areaBottomRight] = generatePlain_1_1();
    }

    // 地下
    if (!(areaTopLeftDown in areas)){
      areas[areaTopLeftDown] = generateCave_1_1();
    }
    if (!(areaTopCenterDown in areas)){
      areas[areaTopCenterDown] = generateCave_1_1();
    }
    if (!(areaTopRightDown in areas)){
      areas[areaTopRightDown] = generateCave_1_1();
    }
    if (!(areaLeftCenterDown in areas)){
      areas[areaLeftCenterDown] = generateCave_1_1();
    }
    if (!(areaRightCenterDown in areas)){
      areas[areaRightCenterDown] = generateCave_1_1();
    }
    if (!(areaBottomLeftDown in areas)){
      areas[areaBottomLeftDown] = generateCave_1_1();
    }
    if (!(areaBottomCenterDown in areas)){
      areas[areaBottomCenterDown] = generateCave_1_1();
    }
    if (!(areaBottomRightDown in areas)){
      areas[areaBottomRightDown] = generateCave_1_1();
    }

  } else {
    tiles = areas[`area_${player.currentAreaX}_${player.currentAreaY}_${player.currentAreaZ}`];
  }
}