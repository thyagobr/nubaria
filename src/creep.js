import { distance, is_colliding } from "./tapete.js"

function Creep(go) {
  this.id = go.creeps.length
  this.go = go
  this.go.creeps.push(this)

  this.image = new Image()
  this.image_width = 32
  this.image_height = 32
  this.x = this.go.canvas_rect.width / 2
  this.y = this.go.canvas_rect.height / 2
  this.width = this.go.tile_size * 2
  this.height = this.go.tile_size * 2
  this.moving = false
  this.direction = null
  this.speed = 2
  this.movement_board = this.go.board.grid

  this.coords = function(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function() {
    this.go.ctx.drawImage(this.image, 0, 0, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
  }

  this.move = () => {
    let target_node = this.go.board.get_node_for(this.go.character)
    this.go.board.move(this, target_node)
  }

}

export default Creep
