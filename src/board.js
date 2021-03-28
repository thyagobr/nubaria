import Node from "./node.js"
import { is_colliding, Vector2 } from "./tapete.js"

// A grid of tiles for the manipulation
function Board(game_object) {
  this.game_object = game_object
  this.game_object.board = this

  this.height = this.game_object.canvas_rect.height
  this.width = this.game_object.canvas_rect.width
  this.tile_size = this.game_object.tile_size
  this.should_draw = false
  this.toggle_grid = () => this.should_draw = !this.should_draw

  this.grid = []

  // Build the grid
  for (var j = 0; j <= (this.game_object.screen.height / this.tile_size); j++) {
    for (var i = 0; i <= (this.game_object.screen.width / this.tile_size); i++) {
      this.grid.push(new Node({ id: this.grid.length, x: i * this.tile_size, y: j * this.tile_size, width: this.tile_size, height: this.tile_size }))
    }
  }

  this.draw = () => {
    if (!this.should_draw) return
    this.grid.forEach((node) => {
      // Don't try to render if out of camera focus
      if (
        (node.x < this.game_object.camera.x) ||
        (node.x >= this.game_object.camera.x + this.game_object.canvas_rect.width) ||
        (node.y < this.game_object.camera.y) ||
        (node.y >= this.game_object.camera.y + this.game_object.canvas_rect.height)
      ) return
      this.game_object.ctx.lineWidth = "1"
      this.game_object.ctx.strokeStyle = node.border_colour
      this.game_object.ctx.fillStyle = node.colour
      this.game_object.ctx.fillRect(node.x - this.game_object.camera.x, node.y - this.game_object.camera.y, node.width, node.height)
      this.game_object.ctx.strokeRect(node.x - this.game_object.camera.x, node.y - this.game_object.camera.y, node.width, node.height)
    })
  }

  // Receives a rect and returns it's first colliding Node
  this.get_node_for = (rect) => {
    if (rect.width == undefined) rect.width = 1
    if (rect.height == undefined) rect.height = 1
    return this.grid.find((node) => is_colliding(node, rect))
  }

  // Sets a global target node
  // It was used before the movement got detached from the player character
  this.target_node = null
  this.set_target = (node) => {
    this.grid.forEach((node) => node.distance = 0)
    this.target_node = node
  }

  // Calculates possible possitions for the next movement
  this.calculate_neighbours = (character) => {
    let character_rect = {
      x: character.x - character.speed,
      y: character.y - character.speed,
      width: character.width + character.speed,
      height: character.height + character.speed
    }

    let future_movement_collisions = character.movement_board.filter((node) => {
      return is_colliding(character_rect, node)
    })

    // I'm gonna copy them here otherwise different entities calculating distance
    // will affect each other's numbers. This can be solved with a different
    // calculation algorithm as well.
    return future_movement_collisions
  }


  this.next_step = (character, closest_node, target_node) => {
    // Step: Select all neighbours
    let visited = []
    let nodes_per_row = Math.trunc(4096 / game_object.tile_size)
    let origin_index = closest_node.id

    let neighbours = this.calculate_neighbours(character)

    // Step: Sort neighbours by distance (smaller distance first)
    // We add the walk movement to re-visited nodes to signify this cost
    let neighbours_sorted_by_distance_asc = neighbours.sort((a, b) => {
      if (a.distance) {
        //a.distance += 2 * character.speed
      } else {
        a.distance = Vector2.distance(a, target_node)
      }

      if (b.distance) {
        //b.distance += character.speed
      } else {
        b.distance = Vector2.distance(b, target_node)
      }

      return a.distance - b.distance
    })

    // Step: Select only neighbour nodes that are not blocked
    neighbours_sorted_by_distance_asc = neighbours_sorted_by_distance_asc.filter((node) => {
      return node.blocked !== true
    })

    // Step: Return the closest valid node to the target
    // returns true if the closest point is the target itself
    // returns false if there is nowhere to go
    if (neighbours_sorted_by_distance_asc.length == 0) {
      return false
    } else {
      let future_node = neighbours_sorted_by_distance_asc[0]
      return (future_node.id == target_node.id ? true : future_node)
    }
  }

  this.move = function(character, target_node) {
    let char_pos = {
      x: character.x,
      y: character.y
    }

    let current_node = this.get_node_for(char_pos)
    let closest_node = this.next_step(character, current_node, target_node)

    // We have a next step
    if (typeof(closest_node) === "object") {
      let future_movement = { ...char_pos }
      let x_speed = 0
      let y_speed = 0
      if (closest_node.x != character.x) {
        let distance_x = char_pos.x - closest_node.x
        if (Math.abs(distance_x) >= character.speed) {
          x_speed = (distance_x > 0 ? -character.speed : character.speed)
        } else {
          if (char_pos.x < closest_node.x) {
            x_speed = Math.abs(distance_x) * -1
          } else {
            x_speed = Math.abs(distance_x)
          }
        }
      }

      if (closest_node.y != character.y) {
        let distance_y = future_movement.y - closest_node.y
        if (Math.abs(distance_y) >= character.speed) {
          y_speed = (distance_y > 0 ? -character.speed : character.speed)
        } else {
          if (future_movement.y < closest_node.y) {
            y_speed = Math.abs(distance_y)
          } else {
            y_speed = Math.abs(distance_y) * -1
          }
        }
      }

      future_movement.x = future_movement.x + x_speed
      future_movement.y = future_movement.y + y_speed

      character.coords(future_movement)
      // We're already at the best spot
    } else if (closest_node === true) {
      console.log("reached")
      character.movement_board = []
      character.moving = false
      // We're stuck
    } else {
      // TODO: got this once after had already reached. 
      console.log("no path")
    }
  }
}

export default Board
