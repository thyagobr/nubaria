import { is_colliding } from "../tapete"
function Piece(player) {
  this.player = player
  this.at_home = true
  this.current_node = null
  this.default_colour = "purple"
  this.colour = "purple"
  this.x = null
  this.y = null
  this.set_current_node = (node) => {
    this.current_node = node
    this.x = this.current_node.x + this.player.go.square_size / 2
    this.y = this.current_node.y + this.player.go.square_size / 2
    this.at_home = false
  }
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
        this.go.ctx.fillStyle = piece.colour
        this.go.ctx.lineWidth = 3
        this.go.ctx.arc(40 + (index * 30), 880, 15, 0, 2 * Math.PI)
        this.go.ctx.fill()
        this.go.ctx.stroke()
      } else if (piece.current_node !== null) {
        this.go.ctx.beginPath()
        this.go.ctx.fillStyle = piece.colour
        this.go.ctx.lineWidth = 3
        this.go.ctx.arc(piece.current_node.x + this.go.square_size / 2, piece.current_node.y + this.go.square_size / 2, 15, 0, 2 * Math.PI)
        this.go.ctx.fill()
        this.go.ctx.stroke()
      }
    })
  }

  this.spawn_piece = () => {
    let pieces_at_home = this.pieces.filter((piece) => piece.at_home)
    if (pieces_at_home.length > 0) {
      var collided_piece = this.check_piece_collision(pieces_at_home[0], this.go.squares[18])[0]
      if (collided_piece) {
        if (collided_piece.player == go.current_player) {
          console.log("STACK")
        } else {
          console.log("BACK HOME BABE")
        }
      }
      pieces_at_home[0].set_current_node(this.go.squares[18])
    }
  }

  this.check_piece_collision = (piece, square) => {
    return this.go.players.reduce((colliding_pieces, player) => {
      let tmp = player.pieces.filter((piece) => {
        let piece_rect = { ...piece, width: 1, height: 1 }
        let square_rect = { ...square, width: square.size, height: square.size }
        return is_colliding(square_rect, piece_rect)
      })

     return  colliding_pieces.concat(tmp)
    }, [])
  }
}

export default Player
