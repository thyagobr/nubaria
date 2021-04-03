import { is_colliding } from "../tapete"
import Button from "./button"

function Menu(go) {
  this.go = go
  this.go.menu = this
  this.dice_1 = null
  this.dice_2 = null

  this.draw = () => {
    this.buttons.forEach((button) => {
      this.go.ctx.strokeStyle = "black"
      this.go.ctx.strokeRect(button.x, button.y + 5, 145, 45)
      this.go.ctx.fillStyle = "purple"
      this.go.ctx.fillRect(button.x, button.y, 150, 50)
      this.go.ctx.fillStyle = "white";
      this.go.ctx.font = "sans-serif"
      var text_measurement = this.go.ctx.measureText(button.text)
      this.go.ctx.fillText(button.text, button.x + (button.width / 2) - (text_measurement.width / 2), button.y + 10 + (button.height / 2) - 5)
    })

    this.draw_dice()
    this.draw_current_player()
  }

  this.draw_current_player = () => {
    this.go.ctx.fillStyle = "white"
    this.go.ctx.fillRect(10, 975, 250, 30)
    this.go.ctx.fillStyle = "black"
    this.go.ctx.fillText(`Current player: ${this.go.current_player.house.colour}`, 10, 995)
  }

  this.draw_dice = () => {
    // d1
    this.go.ctx.strokeStyle = "black"
    this.go.ctx.strokeRect(170, this.go.board_height + 15, 40, 45)
    this.go.ctx.fillStyle = "white"
    this.go.ctx.fillRect(170, this.go.board_height + 15, 40, 45)
    if (go.dice_1_used) {
      this.go.ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      this.go.ctx.fillRect(170, this.go.board_height + 15, 40, 45)
    }
    this.go.ctx.fillStyle = "black";
    this.go.ctx.font = "21px sans-serif"
    var text_measurement = this.go.ctx.measureText(go.dice_1 || "-")
    this.go.ctx.fillText(go.dice_1 || "-", 170 + 20 - (text_measurement.width / 2), this.go.board_height + 15 + 30)
    // d2
    this.go.ctx.strokeStyle = "black"
    this.go.ctx.strokeRect(230, this.go.board_height + 15, 40, 45)
    this.go.ctx.fillStyle = "white"
    this.go.ctx.fillRect(230, this.go.board_height + 15, 40, 45)
    if (go.dice_2_used) {
      this.go.ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      this.go.ctx.fillRect(230, this.go.board_height + 15, 40, 45)
    }
    this.go.ctx.fillStyle = "black";
    this.go.ctx.font = "21px sans-serif"
    var text_dice_2 = go.dice_2 || "-"
    var text_measurement = this.go.ctx.measureText(text_dice_2)
    this.go.ctx.fillText(text_dice_2, 230 + 20 - (text_measurement.width / 2), this.go.board_height + 15 + 30)
  }

  // TODO: investigate why canvas_rect width works here...
  this.on_click_menu_button = (ev) => {
    let collision_click = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
    if (ev.clientY > this.go.board_height) {
      this.buttons.find((button) => {
        if (is_colliding(button, { x: ev.clientX, y: ev.clientY, width: 1, height: 1})) {
          button.perform()
        }
      })
    }
  }

  this.house_leaving_combos = [
    [6, 6]
  ]

  this.dice_combo_leaves_the_house = () => {
    let dice_combo_leaves_the_house = this.house_leaving_combos.some((combo) => {
      return ((go.dice_1 == combo[0]) && (go.dice_2 == combo[1]))
    })
  }

  this.roll_dice = () => {
    go.dice_1 = Math.trunc(Math.random() * 6) + 1
    go.dice_2 = Math.trunc(Math.random() * 6) + 1
    go.dice_1_used = false
    go.dice_2_used = false
    go.total_movement_left = go.dice_1 + go.dice_2

    console.log(`${go.dice_1}, ${go.dice_2}`)

    // Only spend the 6 if there are pieces at home
    let all_pieces_at_home = go.current_player.pieces.every((piece) => piece.at_home)
    if (all_pieces_at_home && !this.dice_combo_leaves_the_house()) {
      console.log("next_turn")
      go.game_state = "next_turn"
    }
    if ((go.dice_1 == 6) && (go.current_player.pieces.some((piece) => piece.at_home))) {
      go.dice_1_used = true
      go.total_movement_left -= go.dice_1
      go.current_player.spawn_piece()
      console.log(`${go.dice_1} used`)
    }

    // Only spend the 6 if there are pieces at home
    if ((go.dice_2 == 6) && (go.current_player.pieces.some((piece) => piece.at_home))) {
      go.dice_2_used = true
      go.total_movement_left -= go.dice_2
      go.current_player.spawn_piece()
      console.log(`${go.dice_2} used`)
    }

    // Can the plaeyer do anything?
    let movable_pieces = this.go.current_player.pieces.filter((piece) => piece.current_node != null)
    if (movable_pieces.length > 0) {
      go.game_state = "awaiting_player_movement"
    }
  }

  // TODO; We need to add here the idea of marking which dice has been used
  // Currently, it's all mixed under total_movement
  this.move = () => {
    this.go.current_piece_selected.move()
  }

  this.buttons = []
  this.buttons.push(new Button(
    go,
    {
      id: "roll_dice",
      text: "Roll the die",
      x: 10,
      y: this.go.board_height + 10,
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
      y: this.go.board_height + 70,
      width: 150,
      height: 50,
      perform: this.move
    }))
}

export default Menu
