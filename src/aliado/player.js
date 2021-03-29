function Piece(player) {
  this.player = player
  this.at_home = true
  this.current_node = null
}

function Player(go) {
  this.go = go
  this.id = this.go.players.length
  this.go.players.push(this)
  this.at_home = true
  this.current_square = null
  this.pieces = []
  for (var i = 0; i < 4; i++) {
    this.pieces.push(new Piece(this))
  }

  this.draw = () => {
    this.pieces.forEach((piece, index) => {
      if (piece.at_home) {
        this.go.ctx.beginPath()
        this.go.ctx.fillStyle = "purple"
        this.go.ctx.lineWidth = 3
        this.go.ctx.arc(40 + (index * 30), 880, 15, 0, 2 * Math.PI)
        this.go.ctx.fill()
        this.go.ctx.stroke()
      } else if (piece.current_node !== null) {
        this.go.ctx.beginPath()
        this.go.ctx.fillStyle = "purple"
        this.go.ctx.lineWidth = 3
        this.go.ctx.arc(piece.current_node.x + this.go.square_size / 2, piece.current_node.y + this.go.square_size / 2, 15, 0, 2 * Math.PI)
        this.go.ctx.fill()
        this.go.ctx.stroke()
      }
    })
  }

  this.spawn_piece = () => {
    this.pieces[0].current_node = this.go.squares[18]
    this.pieces[0].at_home = false
  }
}

export default Player
