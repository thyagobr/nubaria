import { distance, is_colliding } from "./tapete.js"

function Character(game_object, editor, id) {
  this.editor = editor
  this.game_object = game_object
  this.image = new Image();
  this.image.src = "crisiscorepeeps.png"
  this.id = id
  this.x = this.game_object.canvas_rect.width / 2
  this.y = this.game_object.canvas_rect.height / 2
  this.width = this.game_object.tile_size * 2
  this.height = this.game_object.tile_size * 2
  this.moving = false
  this.direction = null

  this.draw = function() {
    this.game_object.ctx.drawImage(this.image, 0, 0, 32, 32, this.x - this.game_object.camera.x, this.y - this.game_object.camera.y, this.width, this.height)
  }

  this.move = function(target_movement) {
    if (this.moving) {
      var future_movement = { x: this.x, y: this.y }

      if ((distance(this.x, target_movement.x) <= 1) && (distance(this.y, target_movement.y) <= 1)) {
        this.moving = false;
        target_movement = {}
        console.log("Stopped");
      } else {
        // Draw movement target
        this.game_object.ctx.beginPath()
        this.game_object.ctx.arc((target_movement.x - this.game_object.camera.x), (target_movement.y - this.game_object.camera.y), 20, 0, 2 * Math.PI, false)
        this.game_object.ctx.strokeStyle = "purple"
        this.game_object.ctx.lineWidth = 4;
        this.game_object.ctx.stroke()
        // If the distance from the character position to the target is 1 or less
        if (distance(this.x, target_movement.x) > 1) {
          if (this.x > target_movement.x) {
            future_movement.x = this.x - 2;
          } else {
            future_movement.x = this.x + 2;
          }
        }
        if (distance(this.y, target_movement.y) > 1) {
          if (this.y > target_movement.y) {
            future_movement.y = this.y - 2;
          } else {
            future_movement.y = this.y + 2;
          }
        }
      }

      future_movement.width = this.width
      future_movement.height = this.height

      if ((this.game_object.entities.every((entity) => entity.id === this.id || !is_colliding(future_movement, entity) )) &&
        (!this.editor.bitmap.some((bit) => is_colliding(future_movement, bit)))) {
        this.x = future_movement.x
        this.y = future_movement.y
      } else {
        console.log("Blocked");
        this.moving = false
      }
    }
    // END - Character Movement
  }
}

export default Character
