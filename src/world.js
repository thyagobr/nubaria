class Tile {
  constructor(image_src) {
    this.image = new Image()
    this.image.src = image_src
  }
}

function World(go) {
  this.go = go;
  this.go.world = this;
  this.width = 10000;
  this.height = 10000;
  this.tile_set = {
    grass: new Tile("grass.png"),
    dirt: new Tile("dirt2.png")
  }
  this.pick_random_tile = () => {
    let rng = Math.random() * 100;
    if (rng <= 3) {
      return this.tile_set.grass
      //return this.tile_set.dirt
    } else {
      return this.tile_set.grass
    }
  }
  this.tile_width = 64
  this.tile_height = 64
  this.tiles_per_row = Math.trunc(this.width / this.tile_width) + 1;
  this.tiles_per_column = Math.trunc(this.height / this.tile_height) + 1;
  this.tiles = null;
  this.generate_map = () => {
    this.tiles = new Array(this.tiles_per_row);
    for (let row = 0; row <= this.tiles_per_row; row++) {
      for (let column = 0; column <= this.tiles_per_column; column++) {
        if (this.tiles[row] === undefined) {
          this.tiles[row] = [this.pick_random_tile()]
        } else {
          this.tiles[row].push(this.pick_random_tile())
        }
      }
    }
  }
  this.draw = () => {
    for (let row = 0; row <= this.tiles_per_row; row++) {
      for (let column = 0; column <= this.tiles_per_column; column++) {
        this.go.ctx.drawImage(this.tiles[row][column].image,
          0, 0, 64, 63,
          (row * this.tile_width) - this.go.camera.x, (column * this.tile_height) - this.go.camera.y, 64, 64)
      }
    }
  }
}

export default World;
