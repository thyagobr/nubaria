import { distance, is_colliding } from "./tapete.js"

function Character(game_object, editor, id) {
  this.editor = editor
  this.game_object = game_object
  this.image = new Image();
  this.image.src = "crisiscorepeeps.png"
  this.image_width = 32
  this.image_height = 32
  this.id = id
  this.x = this.game_object.canvas_rect.width / 2
  this.y = this.game_object.canvas_rect.height / 2
  this.width = this.game_object.tile_size * 2
  this.height = this.game_object.tile_size * 2
  this.moving = false
  this.direction = null

  this.coords = function(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function() {
    if (this.moving && this.target_movement) this.draw_movement_target()
    this.game_object.ctx.drawImage(this.image, 0, 0, this.image_width, this.image_height, this.x - this.game_object.camera.x, this.y - this.game_object.camera.y, this.width, this.height)
  }

  this.draw_movement_target = function(target_movement = this.target_movement) {
    this.game_object.ctx.beginPath()
    this.game_object.ctx.arc((target_movement.x - this.game_object.camera.x) + 10, (target_movement.y - this.game_object.camera.y) + 10, 20, 0, 2 * Math.PI, false)
    this.game_object.ctx.strokeStyle = "purple"
    this.game_object.ctx.lineWidth = 4;
    this.game_object.ctx.stroke()
  }

  Array.prototype.last = function() { return this[this.length - 1] }
  Array.prototype.first = function() { return this[0] }

  // Stores the temporary target of the movement being executed
  this.target_movement = null
  // Stores the path being calculated
  this.current_path = []
  this.speed = 3

  this.find_path = (target_movement) => {
    this.current_path = []
    this.moving = false

    this.target_movement = target_movement

    if (this.current_path.length == 0) {
      this.current_path.push({ x: this.x + this.speed, y: this.y + this.speed })
    }

    var last_step = {}
    var future_movement = {}

    do {
      last_step = this.current_path[this.current_path.length - 1]
      future_movement = {}

      if (distance(last_step.x, target_movement.x) > 1) {
        if (last_step.x > target_movement.x) {
          future_movement.x = last_step.x - this.speed
        } else {
          future_movement.x = last_step.x + this.speed
        }
      }
      if (distance(last_step.y, target_movement.y) > 1) {
        if (last_step.y > target_movement.y) {
          future_movement.y = last_step.y - this.speed
        } else {
          future_movement.y = last_step.y + this.speed
        }
      }

      if (future_movement.x === undefined)
        future_movement.x = last_step.x
      if (future_movement.y === undefined)
        future_movement.y = last_step.y

      this.current_path.push({ ...future_movement })
    } while ((distance(last_step.x, target_movement.x) > 1) || (distance(last_step.y, target_movement.y) > 1))

    this.moving = true
  }

  this.move_on_path = () => {
    if (this.moving) {
      var next_step = this.current_path.shift()
      if (next_step) {
        this.x = next_step.x
        this.y = next_step.y
      } else {
        this.moving = false
        this.current_path = []
      }
    }
  }

  this.move = function(target_movement) {
    if (this.moving) {
      var future_movement = { x: this.x, y: this.y }

      if ((distance(this.x, target_movement.x) <= 1) && (distance(this.y, target_movement.y) <= 1)) {
        this.moving = false;
        target_movement = {}
        console.log("Stopped");
      } else {
        this.draw_movement_target(target_movement)

        // Pathing
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
