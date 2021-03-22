import draw_grid from "./grid.js"
import { is_colliding } from "./tapete.js"

function Editor(game_object) {
  this.game_object = game_object

  // Bitmap stores pixels sellected for invisible collision
  this.bitmap = []

  this.paint_mode_brush = null
  this.paint_mode = false
  this.paint_on_click_callback = (ev) => {
    if (!this.paint_mode) return
    console.log(ev.clientX)
    console.log(ev.clientY)
    if (ev.clientX > this.game_object.canvas_rect.width) {
      var base_width = this.game_object.canvas_rect.width
      var base_height = this.game_object.canvas_rect.height
      this.buttons.find((button) => {
        var local_button = { ...button }
        local_button.x = local_button.x + base_width;
        if (is_colliding(local_button, { x: ev.clientX, y: ev.clientY, width: 1, height: 1})) {
          button.perform()
        }
      })
    } else {
      if (this.paint_mode_brush == "colliders") {
        this.bitmap.push({x: this.game_object.camera.x + ev.clientX, y: this.game_object.camera.y + ev.clientY, width: this.game_object.tile_size, height: this.game_object.tile_size})
      }
    }
  }

  this.draw = function() {
    draw_grid(this.game_object.ctx, this.game_object.canvas_rect, this.game_object.tile_size);
    this.bitmap.forEach((bit) => {
      this.game_object.ctx.fillStyle = "purple";
      // I'm not very sure why this camera has to be added on the painting and removed here
      // The idea seems to be that I added on the brush so that we can remember the exactl pixel where it is in the screen
      // But, obviously, if I right after painting move the camera a bit to the right, increasing X, it will already offset the
      // drawing to the right. So Im removing the camera here
      this.game_object.ctx.fillRect(bit.x - this.game_object.camera.x, bit.y - this.game_object.camera.y, this.game_object.tile_size, this.game_object.tile_size)
    })
    // draw UI buttons
    this.buttons.forEach((button) => {
      this.game_object.ctx.fillStyle = "purple";
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
      text: "Colliders",
      x: 10,
      y: 10,
      width: 150,
      height: 50,
      perform: function() {
        console.log("Colliders button clicked")
        this.that.paint_mode_brush = "colliders"
      }
    },
    {
      that: this,
      text: "WayPoint",
      x: 10,
      y: 70,
      width: 150,
      height: 50,
      perform: function() {
        console.log("WayPoint button clicked")
        this.that.paint_mode_brush = "waypoint"
      }
    }
  ]
}

export default Editor;
