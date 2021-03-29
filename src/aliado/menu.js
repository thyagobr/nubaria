function Menu(go) {
  this.go = go
  this.go.menu = this

  this.draw = () => {
    this.buttons.forEach((button) => {
      this.go.ctx.strokeStyle = "black"
      this.go.ctx.strokeRect(this.go.canvas_rect.width + button.x + 5, button.y + 5, 145, 45)
      this.go.ctx.fillStyle = "purple"
      this.go.ctx.fillRect(this.go.canvas_rect.width + button.x, button.y, 150, 50)
      this.go.ctx.fillStyle = "white";
      this.go.ctx.font = "21px sans-serif"
      var text_measurement = this.go.ctx.measureText(button.text)
      this.go.ctx.fillText(button.text, this.go.canvas_rect.width + button.x + (button.width / 2) - (text_measurement.width / 2), button.y + 10 + (button.height / 2) - 5)
    })
  }

  this.buttons = [
    {
      that: this,
      id: "roll_dice",
      text: "Roll the die",
      x: 10,
      y: 10,
      width: 150,
      height: 50,
      perform: function() {
        console.log("Rolling the dice")
      }
    }]
}

export default Menu
