import Node from "./node.js"
import { is_colliding, Vector2 } from "./tapete.js"

// A grid of tiles for the manipulation
function Board(game_object) {
  this.game_object = game_object
  this.game_object.board = this

  this.height = this.game_object.canvas_rect.height
  this.width = this.game_object.canvas_rect.width
  this.tile_size = this.game_object.tile_size

  this.grid = []

  for (var j = 0; j <= (4096 / this.tile_size); j++) {
    for (var i = 0; i <= (4096/ this.tile_size); i++) {
      this.grid.push(new Node({ id: this.grid.length, x: i * this.tile_size, y: j * this.tile_size, width: this.tile_size, height: this.tile_size }))
    }
  }

  this.draw = () => {
    this.grid.forEach((node) => {
      this.game_object.ctx.lineWidth = "1"
      this.game_object.ctx.strokeStyle = node.border_colour
      this.game_object.ctx.fillStyle = node.colour
      this.game_object.ctx.fillRect(node.x - this.game_object.camera.x, node.y - this.game_object.camera.y, node.width, node.height)
      this.game_object.ctx.strokeRect(node.x - this.game_object.camera.x, node.y - this.game_object.camera.y, node.width, node.height)
    })
  }

  this.get_node_for = (rect) => {
    if (rect.width == undefined) rect.width = 1
    if (rect.height == undefined) rect.height = 1
    return this.grid.find((node) => is_colliding(node, rect))
  }

  this.already_visited = []
  this.target_node = null
  this.set_target = (node) => {
    if (this.target_node)
      this.target_node.colour = "transparent"
    this.target_node = node
    this.target_node.colour = "red"
  }

  this.next_step = (closest_node) => {
    // Step: Select all neighbours
    let visited = []
    let nodes_per_row = Math.trunc(4096 / game_object.tile_size)
    let origin_index = closest_node.id

    // This neighbours-fetching method uses the Node's index in the array to calculate
    // the indices for all its neighbours.
    // This method doesn't check if we're out of bounds
    // Positions  
    let neighbours = [
      closest_node,
      this.grid[origin_index - (nodes_per_row + 1)], // North
      this.grid[origin_index - nodes_per_row - 2], // Northwest
      this.grid[origin_index - 1], // West
      this.grid[origin_index + nodes_per_row], // Southwest
      this.grid[origin_index + (nodes_per_row + 1)], // South
      this.grid[origin_index + (nodes_per_row + 2)], // Southeast
      this.grid[origin_index + 1], // East
      this.grid[origin_index - nodes_per_row] // Northeast
    ].filter((neighbour) => neighbour != null && neighbour != undefined)

    // Step: Sort neighbours by distance (smaller distance first)
    let neighbours_sorted_by_distance_asc = neighbours.sort((a, b) => {
      a.distance = Vector2.distance(a, this.target_node)
      b.distance = Vector2.distance(b, this.target_node)
      return a.distance - b.distance
    })

    // Step: Select only neighbour nodes that are not blocked && haven't already been visited
    neighbours_sorted_by_distance_asc = neighbours_sorted_by_distance_asc.filter((node) => {
      return node.blocked !== true
    })

    // Step: Return the closest valid node to the target
    // returns true if the closest point is the target itself
    // returns false if there is nowhere to go
    if (neighbours_sorted_by_distance_asc.length == 0) {
      return false
    } else {
      return (neighbours_sorted_by_distance_asc[0].id == this.target_node.id ? true : neighbours_sorted_by_distance_asc[0])
    }
  }

  this.move = function() {
    this.game_object.character.draw_movement_target(this.target_node)

    let char_pos = {
      x: this.game_object.character.x,
      y: this.game_object.character.y
    }
    let current_node = this.get_node_for(char_pos)
    let closest_node = this.next_step(current_node, this.target_node);

    // We have a next step
    if (typeof(closest_node) === "object") {
      let future_movement = { ...char_pos }
      let x_speed = 0
      let y_speed = 0
      if (closest_node.x != this.game_object.character.x) {
        let distance_x = future_movement.x - closest_node.x
        if (Math.abs(distance_x) >= this.game_object.character.speed) {
          x_speed = (distance_x > 0 ? -this.game_object.character.speed : this.game_object.character.speed)
        } else {
          x_speed = (distance_x > 0 ? distance_x : distance_x * -1)
        }
      }

      if (closest_node.y != this.game_object.character.y) {
        let distance_y = future_movement.y - closest_node.y
        if (Math.abs(distance_y) >= this.game_object.character.speed) {
          y_speed = (distance_y > 0 ? -this.game_object.character.speed : this.game_object.character.speed)
        } else {
          if (future_movement.y < closest_node.y) {
            y_speed = Math.abs(distance_y)
          } else {
            y_speed = distance_y * -1
          }
        }
      }

      future_movement.x = future_movement.x + x_speed
      future_movement.y = future_movement.y + y_speed

      this.game_object.character.coords(future_movement)
      // We're already at the best spot
    } else if (closest_node === true) {
      console.log("reached")
      this.game_object.character.moving = false
      // We're stuck
    } else {
      // TODO: got this once after had already reached. 
      console.log("no path")
    }
  }
}

export default Board
