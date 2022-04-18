function Screen(go) {
  this.go = go
  this.go.screen = this
  //this.background_image = new Image()
  //this.background_image.src = "map4096.jpeg"
  this.width  = 3740
  this.height = 3740

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
    }
  }

  this.draw_game_over = () => {
    this.go.ctx.fillStyle = "black"
    this.go.ctx.fillRect(0, 0, this.go.canvas.width, this.go.canvas.height);
  }
}

export default Screen
