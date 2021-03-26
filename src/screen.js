function Screen(go) {
  this.go = go
  this.go.screen = this

  this.clear = () => {
    this.go.ctx.clearRect(0, 0, this.go.canvas.width, this.go.canvas.height);
  }
}

export default Screen
