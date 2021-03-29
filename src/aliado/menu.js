import { is_colliding } from "../tapete"
import Button from "./button"

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

  // TODO: investigate why canvas_rect width works here...
  this.on_click_menu_button = (ev) => {
    let collision_click = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
    if (ev.clientX > this.go.canvas_rect.width) {
      this.buttons.find((button) => {
        var local_button = { ...button }
        local_button.x = local_button.x + this.go.canvas_rect.width;
        if (is_colliding(local_button, { x: ev.clientX, y: ev.clientY, width: 1, height: 1})) {
          button.perform()
        }
      })
    }
  }

  this.roll_dice = () => {
    let dice_1 = Math.trunc(Math.random() * 6) + 1
    let dice_2 = Math.trunc(Math.random() * 6) + 1
    let dice_1_used = false
    let dice_2_used = false
    let total_movement = dice_1 + dice_2

    console.log(`${dice_1}, ${dice_2}`)

    if (dice_1 == 6) {
      dice_1_used = true
      total_movement -= dice_1
      this.go.current_player.spawn_piece()
      console.log(`${dice_1} used`)
    }

    if (dice_2 == 6) {
      dice_2_used = true
      total_movement -= dice_2
      this.go.current_player.spawn_piece()
      console.log(`${dice_2} used`)
    }

    // Can the plaeyer do anything?
    let movable_pieces = this.go.current_player.pieces.filter((piece) => piece.current_node != null)
    if (movable_pieces.length > 0) {
      go.game_state = "awaiting_player_movement"
      go.total_movement_left = total_movement
      //Array.from(Array(total_movement)).forEach((i) => {
      //  movable_pieces[0].current_node = movable_pieces[0].current_node.connected[0]
      //})
    }
  }

  this.move = () => {
    if (go.current_piece_selected) {
      // Is the movement left enough to exactly reach this square?
      let next = go.current_piece_selected.current_node
      Array.from(Array(go.total_movement_left)).forEach((i) => {
        next = next.connected[0]
      })
      // If the end result matches with the clicked target, let's go
      if (next == go.current_movement_target) {
        go.current_piece_selected.set_current_node(next)
        go.current_piece_selected.colour = go.current_piece_selected.default_colour
        go.current_piece_selected = null
        go.current_movement_target.colour = go.current_movement_target.default_colour
        go.current_movement_target = null
        go.total_movement_left = null
      } else {
        console.log("Can't go there")
      }
    }
  }

  this.buttons = []
  this.buttons.push(new Button(
    go,
    {
      id: "roll_dice",
      text: "Roll the die",
      x: 10,
      y: 10,
      width: 150,
      height: 50,
      perform: this.roll_dice
    }))
  this.buttons.push(new Button(
    go,
    {
      id: "move",
      text: "Move",
      x: 10,
      y: 70,
      width: 150,
      height: 50,
      perform: this.move
    }))
}

export default Menu
