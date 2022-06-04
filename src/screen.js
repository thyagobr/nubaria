function Screen(go) {
  this.go = go
  this.go.screen = this
  //this.background_image = new Image()
  //this.background_image.src = "grass.png"
  this.tile_image = new Image()
  this.tile_image.src = "grass.png"
  this.tile_width = 64
  this.tile_height = 64
  this.width  = this.go.canvas_rect.width;
  this.height = this.go.canvas_rect.height;

  this.clear = () => {
    this.go.ctx.clearRect(0, 0, this.go.canvas.width, this.go.canvas.height);
  }

  this.draw = () => {
    this.clear()
    if (this.background_image) {
      this.go.ctx.drawImage(this.background_image,
        this.go.camera.x + 60,
        this.go.camera.y + 160,
        this.go.canvas_rect.width,
        this.go.canvas_rect.height,
        0, 0,
        this.go.canvas_rect.width, this.go.canvas_rect.height)
    } else if (this.tile_image) {
      let tiles_per_row = Math.trunc(screen.width / this.tile_width) + 1
      let tiles_per_column = Math.trunc(screen.height / this.tile_height) + 1
      Array.from(Array(tiles_per_column)).forEach((_, j) => {
        Array.from(Array(tiles_per_row)).forEach((_, i) => {
          this.go.ctx.drawImage(this.tile_image,
            0, 0, 64, 64,
            i * this.tile_width, j * this.tile_height, 64, 64)
        })
      })
    } else {
      this.go.ctx.fillStyle = "purple"
      this.go.ctx.fillRect(0, 0, this.go.canvas.width, this.go.canvas.height)
    }
  }

  this.draw_game_over = () => {
    this.go.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    this.go.ctx.fillRect(0, 0, this.go.canvas.width, this.go.canvas.height);
    this.go.ctx.fillStyle = "white"
    this.go.ctx.font = '72px serif'
    this.go.ctx.fillText("Game Over", (this.go.canvas.width / 2) - (this.go.ctx.measureText("Game Over").width / 2), this.go.canvas.height / 2);
  }
}

export default Screen
