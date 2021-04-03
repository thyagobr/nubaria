import { is_colliding } from "../tapete"
import House from "./house"
import Piece from "./piece"

function Player(go) {
  this.go = go
  this.id = this.go.players.length
  this.go.players.push(this)
  this.house = new House(this)
  this.current_square = null
  this.pieces = []
  for (var i = 0; i < 4; i++) {
    this.pieces.push(new Piece(this))
  }

  this.draw = () => {
    this.house.draw()
    this.pieces.
      filter((piece) => !piece.stacked).
      forEach((piece, index) => {
      if (piece.at_home) {
        this.go.ctx.beginPath()
        this.go.ctx.fillStyle = piece.colour
        this.go.ctx.lineWidth = 3
        this.go.ctx.arc(
          this.house.x + (this.go.house_size / 5) + (index * 30), // x
          this.house.y + (this.go.house_size / 2), // y
          15, // r
          0, // starting angle
          2 * Math.PI // end angle
        )
        this.go.ctx.fill()
        this.go.ctx.stroke()
      } else if (piece.current_node !== null) {
        this.go.ctx.beginPath()
        this.go.ctx.fillStyle = piece.colour
        this.go.ctx.lineWidth = 3
        this.go.ctx.arc(piece.current_node.x + this.go.square_size / 2, piece.current_node.y + this.go.square_size / 2, 15, 0, 2 * Math.PI)
        this.go.ctx.fill()
        this.go.ctx.stroke()
        if (piece.stacked_with.length > 0) {
          this.go.ctx.fillStyle = "white";
          this.go.ctx.font = "12px sans-serif"
          var text_measurement = this.go.ctx.measureText(piece.stacked_with.length + 1)
          this.go.ctx.fillText(piece.stacked_with.length + 1, piece.current_node.x + this.go.square_size / 2 - (text_measurement.width / 2), piece.current_node.y + (this.go.square_size / 2) + (text_measurement.width / 2))
        }
      }
    })
  }

  this.spawn_piece = () => {
    let pieces_at_home = this.pieces.filter((piece) => piece.at_home)
    if (pieces_at_home.length > 0) {
      var collided_piece = this.check_piece_collision(pieces_at_home[0], this.go.squares[this.house.spawn_index])[0]
      if (collided_piece) {
        if (collided_piece.player == go.current_player) {
          collided_piece.stacked_with.push(pieces_at_home[0])
          pieces_at_home[0].stacked = true
          pieces_at_home[0].at_home = false
        } else {
          // Future Kill piece algorithm
          console.log("BACK HOME BABE")
        }
      } else {
        pieces_at_home[0].set_current_node(this.go.squares[this.house.spawn_index])
      }
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
