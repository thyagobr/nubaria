// Abstracts each individual piece in the board
//
// Stacking
//
// A Piece can be stacked on another. This means that they are on
// top of each other, and move together. They can only be separated
// through death - going back home.
//
// To stack Pieces, simply move one on top of the other belonging to the
// same Player. The moving piece is then stacked with the one it moved into.
// 
// In the model, this means that only of the Pieces is drawn on the Board:
// the Piece that was already there. All the ones who move into it, are
// listed on the collided one's `stacked_with` field; and flag themselves
// as `stacked = true` (which signals the drawing that it shouldn't be drawn)
function Piece(player) {
  this.go = player.go
  this.player = player
  this.at_home = true
  this.current_node = null
  this.default_colour = player.house.colour
  this.colour = player.house.colour
  this.x = null
  this.y = null
  // The pieces that are stacked along with this one
  this.stacked_with = []
  this.stacked = false
  this.set_current_node = (node) => {
    this.current_node = node
    this.x = this.current_node.x + this.player.go.square_size / 2
    this.y = this.current_node.y + this.player.go.square_size / 2
    this.at_home = false
  }

  this.move = () => {
    // Is the movement left enough to exactly reach this square?
    let next = this.current_node
    let does_it_reach_with_d1 = false
    let does_it_reach_with_d2 = false

    if ((this.go.dice_1 == 6) || (this.go.dice_2 == 6)) {
      if (!this.go.dice_1_used) {
        Array.from(Array(this.go.dice_1)).forEach((i) => {
          next = next.connected[0]
        })
        does_it_reach_with_d1 = (next == this.go.current_movement_target)
      }

      if (!this.go.dice_2_used && !does_it_reach_with_d1) {
        next = this.current_node
        Array.from(Array(this.go.dice_2)).forEach((i) => {
          next = next.connected[0]
        })
        does_it_reach_with_d2 = (next == this.go.current_movement_target)
      }
    }
    if (!does_it_reach_with_d1 && !does_it_reach_with_d2) {
      next = this.current_node
      Array.from(Array(this.go.total_movement_left)).forEach((i) => {
        next = next.connected[0]
      })
    }

    // If the end result matches with the clicked target, let's go
    if (next == this.go.current_movement_target) {
      if (does_it_reach_with_d1) {
        this.go.dice_1_used = true
        this.go.total_movement_left -= this.go.dice_1_used
      }
      if (does_it_reach_with_d2) {
        this.go.dice_2_used = true
        this.go.total_movement_left -= this.go.dice_2_used
      }
      // Checking if there is already one of our
      let collided_piece = null
      this.go.players.find((player) => {
        return player.pieces.find((piece) => {
          if (!piece.at_home && !piece.stacked && piece.current_node == next) {
            collided_piece = piece
            return true
          }
        })}
      )

      if (collided_piece) {
        collided_piece.stacked_with.push(this)
        let stacked_piece = null
        while(stacked_piece = this.stacked_with.pop()) {
          collided_piece.stacked_with.push(stacked_piece)
        }
        this.stacked = true
        this.at_home = false
        this.current_node = null // Works?
      } else {
        // Changing place and reseting former place's default unselected colour
        this.set_current_node(next)
      }
      // Unselect piece
      this.colour = this.default_colour
      this.go.current_piece_selected = null
      this.go.current_movement_target.colour = this.go.current_movement_target.default_colour
      this.go.current_movement_target = null

      // Remove movement from movement pool
      if (this.go.total_movement_left = 0) { this.go.total_movement_left = null }
    } else {
      console.log("Can't this.go.there")
    }
  }
}

export default Piece
