spells = {
  WARP: function(){
    player.move(randomPassableTile());
  },
  QUAKE: function(){
    for (let i=0; i<numTiles; i++){
      for (let j=0; j<numTiles; j++){
        let tile = getTile(i, j);
        if (tile.monster){
          let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
          tile.monster.hit(numWalls * 2);
        }
      }
    }
    shakeAmount = 20;
  },
  HEAL: function(){
    player.tile.getAdjacentNeighbors().forEach(function(t){
      t.setEffect(14);
    });
    player.tile.setEffect(14);
    player.heal(1);
  },
  DIG: function(){
    for (let i=1; i<numTiles; i++){
      for (let j=1; j<numTiles; j++){
        let tile = getTile(i, j);
        if (!tile.passable){
          tile.replace(Floor);
        }
      }
    }
  },
  POWER: function(){
    player.bonusAttack = 5;
  }
};