function ResourceBar({ go, x, y, width = 100, height = 10, colour = "red" }) {
  this.go = go
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.colour = colour

  this.draw = (full, current) => {
    let bar_width = ((current / full) * this.width)
    this.go.ctx.strokeStyle = "black" 
    this.go.ctx.lineWidth = 4
    this.go.ctx.strokeRect(this.x, this.y, this.width, this.height)
    this.go.ctx.fillStyle = "black" 
    this.go.ctx.fillRect(this.x, this.x, this.width, this.height)
    this.go.ctx.fillStyle = this.colour
    this.go.ctx.fillRect(this.x, this.y, bar_width, this.height)
  }
}

export default ResourceBar
