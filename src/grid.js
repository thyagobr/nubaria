// Grid
function Grid(go) {
  this.go = go
  this.go.grid = this

  this.draw = () => {
    for (var i = 1; i < (this.go.canvas_rect.height / this.go.tile_size); i++) {
      this.go.ctx.beginPath()
      this.go.ctx.moveTo(0, i * this.go.tile_size)
      this.go.ctx.lineTo(this.go.canvas_rect.right, i * this.go.tile_size)
      this.go.ctx.stroke();
    }

    for (var i = 1; i < (this.go.canvas_rect.width / this.go.tile_size); i++) {
      this.go.ctx.beginPath()
      this.go.ctx.moveTo(i * this.go.tile_size, 0)
      this.go.ctx.lineTo(i * this.go.tile_size, this.go.canvas_rect.bottom)
      this.go.ctx.stroke();
    }
  }
}

export default Grid;
