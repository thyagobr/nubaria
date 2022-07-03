function Doodad({ go }) {
  this.go = go

  this.x = 0;
  this.y = 0;
  this.image = new Image();
  this.image.src = "plants.png"
  this.image_width = 98
  this.image_x_offset = 127
  this.image_height = 126
  this.image_y_offset = 290
  this.width = 98
  this.height = 126

  this.draw = function() {
    this.go.ctx.drawImage(this.image, this.image_x_offset, this.image_y_offset, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
  }
}

export default Doodad;
