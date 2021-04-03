const HOUSE_POSITIONS = [
  // x, y, colour, index_of_spawn
  [10, 10, "red", 0],
  [10, 810, "purple", 18],
  [810, 810, "green", 36],
  [810, 10, "white", 54],
]

function House(player) {
  this.go = player.go
  this.player = player

  this.x = HOUSE_POSITIONS[player.id][0]
  this.y = HOUSE_POSITIONS[player.id][1]
  this.colour = HOUSE_POSITIONS[player.id][2]
  this.spawn_index = HOUSE_POSITIONS[player.id][3]

  this.draw = () => {
    this.go.ctx.strokeStyle = "black"
    this.go.ctx.lineWidth = 5
    this.go.ctx.fillStyle = this.colour
    this.go.ctx.strokeRect(this.x, this.y, this.go.house_size, this.go.house_size)
    this.go.ctx.fillRect(this.x, this.y, this.go.house_size, this.go.house_size)
  }

}

export default House
