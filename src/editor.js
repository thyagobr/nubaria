import draw_grid from "./grid.js"
import { is_colliding } from "./tapete.js"

function Editor(game_object) {
  this.game_object = game_object

  // Bitmap stores pixels sellected for invisible collision
  this.bitmap = JSON.parse(window.localStorage.getItem("map")) || []
  this.waypoints = JSON.parse(window.localStorage.getItem("wps")) || []

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
      switch (this.paint_mode_brush) {
      case "collider":
        let collision_click = { x: this.game_object.camera.x + ev.clientX, y: this.game_object.camera.y + ev.clientY, width: 1, height: 1 }
        let node = this.game_object.board.get_node_for(collision_click)
        node.blocked = true
        node.colour = "yellow"
        break

      case "waypoint":
        var wp = {x: this.game_object.camera.x + ev.clientX, y: this.game_object.camera.y + ev.clientY, width: this.game_object.tile_size, height: this.game_object.tile_size, colour: "cyan"}
        wp.name = window.prompt("Waypoint name")
        this.waypoints.push(wp)
        window.localStorage.setItem("wps", JSON.stringify(this.waypoints))
        break
      }
    }
  }

  this.draw = function() {
    //draw_grid(this.game_object.ctx, this.game_object.canvas_rect, this.game_object.tile_size);
    this.waypoints.forEach((wp) => {
      this.game_object.ctx.fillStyle = wp.colour
      this.game_object.ctx.fillRect(wp.x - this.game_object.camera.x, wp.y - this.game_object.camera.y, this.game_object.tile_size, this.game_object.tile_size)
    })
    this.bitmap.forEach((bit) => {
      this.game_object.ctx.fillStyle = "purple"
      // I'm not very sure why this camera has to be added on the painting and removed here
      // The idea seems to be that I added on the brush so that we can remember the exactl pixel where it is in the screen
      // But, obviously, if I right after painting move the camera a bit to the right, increasing X, it will already offset the
      // drawing to the right. So Im removing the camera here
      if (bit.x - this.game_object.camera.x <= this.game_object.canvas_rect.width) { // Don't draw off-screen when canvas is expanded to show editor 
        this.game_object.ctx.fillRect(bit.x - this.game_object.camera.x, bit.y - this.game_object.camera.y, this.game_object.tile_size, this.game_object.tile_size)
      }
    })
    // draw UI buttons
    this.buttons.forEach((button) => {
      this.game_object.ctx.fillStyle = this.paint_mode_brush === button.brush ? "cyan" : "purple"
      this.game_object.ctx.fillRect(this.game_object.canvas_rect.width + button.x, button.y, 150, 50)
      this.game_object.ctx.fillStyle = "white";
      this.game_object.ctx.font = "21px sans-serif"
      var text_measurement = this.game_object.ctx.measureText(button.text)
      this.game_object.ctx.fillText(button.text, this.game_object.canvas_rect.width + button.x + (button.width / 2) - (text_measurement.width / 2), button.y + 10 + (button.height / 2) - 5)
    })
  }

  this.buttons = [
    {
      that: this,
      id: "collider_button",
      brush: "collider",
      text: "Colliders",
      x: 10,
      y: 10,
      width: 150,
      height: 50,
      perform: function() {
        console.log("Colliders button clicked")
        if (this.that.paint_mode_brush === this.brush) {
          this.that.paint_mode_brush = null
        } else {
          this.that.paint_mode_brush = this.brush
        }
      }
    },
    {
      that: this,
      id: "waypoint_button",
      brush: "waypoint",
      text: "WayPoint",
      x: 10,
      y: 70,
      width: 150,
      height: 50,
      perform: function() {
        console.log("WayPoint button clicked")
        if (this.that.paint_mode_brush === this.brush) {
          this.that.paint_mode_brush = null
        } else {
          this.that.paint_mode_brush = this.brush
        }
      }
    }
  ]
}

export default Editor;
