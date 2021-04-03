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
}

export default Piece
