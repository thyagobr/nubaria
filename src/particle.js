function Particle(go, data) {
  this.go = go
  this.pos = data.pos
  this.x = data.pos.x
  this.y = data.pos.y
  this.speed = 10
  this.movement_board = []

  this.move = () => {
  }

  this.draw = () => {
    this.move()

    this.go.ctx.fillStyle = "cyan"
    this.go.ctx.beginPath()
    this.go.ctx.arc((this.pos.x - this.go.camera.x) + 10, (this.pos.y - this.go.camera.y) + 10, 20, 0, 2 * Math.PI, false)
    this.go.ctx.strokeStyle = "purple"
    this.go.ctx.lineWidth = 4;
    this.go.ctx.stroke()
  }
}

export default Particle
