// monster.js ---------------------------------------------------------
class Monster {
  constructor(tile, sprite, fullHp, hp){
    this.move(tile);
    this.sprite = sprite;
    this.fullHp = fullHp;
    this.hp = hp;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastMove = [-1, 0];
    this.currentAreaX = 0;
    this.currentAreaY = 0;
    this.currentAreaZ = 0;
  }

  update(){
    this.teleportCounter --;
    if (this.stunned || this.teleportCounter > 0){
      this.stunned = false;
      return;
    }
    this.doStuff();
  }

  doStuff(){
    let neighbors = this.tile.getAdjacentPassableNeighbors();

    neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

    if (neighbors.length){
      neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
      let newTile = neighbors[0];
      this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
    }
  }

  getDisplayX(){
    return this.tile.x + this.offsetX;
  }
  getDisplayY(){
    return this.tile.y + this.offsetY;
  }

  draw(){
    if (this.teleportCounter > 0){
      drawSprite(17, this.getDisplayX(), this.getDisplayY());
    } else {
      drawSprite(this.sprite, this.getDisplayX(), this.getDisplayY());
    }
    // 移動にアニメーションをつける
    this.offsetX -= Math.sign(this.offsetX) * (1/16);
    this.offsetY -= Math.sign(this.offsetY) * (1/16);

  }

  // アクション(移動・攻撃)可能かどうか判定する
  tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx, dy);
    if (newTile.passable){
      if (!newTile.monster){
        this.move(newTile);
      } else {
        if (this.isPlayer != newTile.monster.isPlayer){
          this.attackedThisTurn = true;

          this.offsetX = (newTile.x - this.tile.x) / 2;
          this.offsetY = (newTile.y - this.tile.y) / 2;
        }
      }
      return true;
    }
  }

  move(tile){
    if (this.tile){
      this.tile.monster = null;
      this.offsetX = this.tile.x - tile.x;
      this.offsetY = this.tile.y - tile.y;
    }
    this.tile = tile;
    tile.monster = this;
    tile.stepOn(this);
  }
}


class Player extends Monster {
  constructor(tile){
    super(tile, 0, 5, 5);
    this.isPlayer = true;
  }
  // プレイヤーのアクション後にtickを更新させる
  tryMove(dx, dy){
    if (super.tryMove(dx, dy)){
      gameState = "running";
    }
  }
}