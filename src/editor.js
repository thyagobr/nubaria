import draw_grid from "./grid.js";

function Editor() {
  this.game_object = null

  // Bitmap stores pixels sellected for invisible collision
  this.bitmap = []

  this.paint_mode = false

  this.draw = function() {
    draw_grid(this.game_object.ctx, this.game_object.canvas_rect, this.game_object.tile_size);
    this.bitmap.forEach((bit) => {
      this.game_object.ctx.fillStyle = "purple";
      this.game_object.ctx.fillRect(bit.x, bit.y, this.game_object.tile_size, this.game_object.tile_size)
    })
    // draw UI buttons
    this.game_object.ctx.fillStyle = "purple";
    this.buttons.forEach((button) => {
      this.game_object.ctx.fillRect(this.game_object.canvas_rect.width + button.x, button.y, 150, 50)
      this.game_object.ctx.fillStyle = "white";
      this.game_object.ctx.font = "21px sans-serif"
      var text_measurement = this.game_object.ctx.measureText(button.text)
      //text_measurement.height = text_measurement.fontBoundingBoxAscent + text_measurement.fontBoundingBoxDescent
      this.game_object.ctx.fillText(button.text, this.game_object.canvas_rect.width + button.x + (button.width / 2) - (text_measurement.width / 2), button.y + 10 + (button.height / 2) - 5)
    })
  }

  this.buttons = [
    {
      that: this,
      text: "WayPoint",
      x: 10,
      y: 10,
      width: 150,
      height: 50,
      perform: function() {
        console.log("WayPoint button clicked")
        this.that.paint_mode = !this.that.paint_mode;
      }
    }
  ]
}

export default Editor;
