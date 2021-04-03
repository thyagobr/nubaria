import GameObject from "../game_object.js"
import Menu from "./menu"
import Player from "./player"
import { Vector2, is_colliding } from "../tapete"

const go = new GameObject()
go.canvas.height = 1200
go.canvas.width = 1200
go.board_height = 1000
go.board_width = 1200
go.players = []
// These enable player movement
go.game_state = "uninitialized"
go.current_movement_target = null
go.current_piece_selected = null
// END
const menu = new Menu(go)
const player1 = new Player(go)
const player2 = new Player(go)
const player3 = new Player(go)
const player4 = new Player(go)

const FPS = 33.33

const start = () => {
  setTimeout(game_loop, FPS)
}

const house_size = 150
const square_size = 50
go.house_size = house_size
go.square_size = square_size
const starting_point = { x: 10, y: house_size + 10 }
const colours = ["blue", "purple", "white", "yellow", "red", "green"]
const squares = []
go.squares = squares
go.current_player = player1

const draw_house = (x, y, colour) => {
  go.ctx.strokeStyle = "black"
  go.ctx.lineWidth = 5
  go.ctx.fillStyle = colour
  go.ctx.strokeRect(x, y, house_size, house_size)
  go.ctx.fillRect(x, y, house_size, house_size)
}

const draw_square = (x, y, w, h, colour) => {
  go.ctx.strokeStyle = "black"
  go.ctx.lineWidth = 5
  go.ctx.fillStyle = colour
  go.ctx.fillRect(x, y, w, h)
  go.ctx.strokeRect(x, y, w, h)
}

const create_board = () => {
  // left outter lane
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: 10,
      y: starting_point.y + (i * square_size),
      size: square_size,
      colour: colours[i % colours.length],
      default_colour: colours[i % colours.length]
    }
    go.squares.push(square)
  }
  // left-bottom outter intermission
  var left_bottom_init_post = {
    x: squares[squares.length - 1].x + square_size,
    y: squares[squares.length - 1].y
  }
  for (var i = 0; i < 3; i++) {
    let square = { 
      x: left_bottom_init_post.x + (i * square_size),
      y: left_bottom_init_post.y,
      size: square_size,
      colour: colours[(i + 1) % colours.length],
      default_colour: colours[(i + 1) % colours.length]
    }
    go.squares.push(square)
  }

  for (var i = 0; i < 2; i++) {
    var y_offset = 0
    let square = { 
      x: squares[squares.length - 1].x,
      y: squares[squares.length - 1].y + (i + 1 * square_size),
      size: square_size,
      colour: colours[(i + 4) % colours.length],
      default_colour: colours[(i + 4) % colours.length]
    }
    go.squares.push(square)
  }
  // bottom outter lane
  var bottom_outter_init_pos = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y + square_size
  }
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: bottom_outter_init_pos.x + (i * square_size),
      y: bottom_outter_init_pos.y,
      size: square_size,
      colour: colours[i % colours.length],
      default_colour: colours[i % colours.length]
    }
    go.squares.push(square)
  }
  // bottom-right outter intermission
  var bottom_right_outter_init_pos = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y - square_size
  }
  for (var i = 0; i < 3; i++) {
    let square = { 
      x: bottom_right_outter_init_pos.x,
      y: bottom_right_outter_init_pos.y - (i * square_size),
      size: square_size,
      colour: colours[(i + 1) % colours.length],
      default_colour: colours[(i + 1) % colours.length]
    }
    go.squares.push(square)
  }

  for (var i = 0; i < 2; i++) {
    var x_offset = square_size + 5
    let square = { 
      x: squares[squares.length - 1].x + (i + 1 * square_size),
      y: squares[squares.length - 1].y,
      size: square_size,
      colour: colours[(i + 4) % colours.length],
      default_colour: colours[(i + 4) % colours.length]
    }

    go.squares.push(square)
  }

  // right outter lane
  var right_outter_init_pos = {
    x: squares[squares.length - 1].x + square_size,
    y: squares[squares.length - 1].y
  }
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: right_outter_init_pos.x,
      y: right_outter_init_pos.y - (i * square_size),
      size: square_size,
      colour: colours[i % colours.length],
      default_colour: colours[i % colours.length]
    }
    go.squares.push(square)
  }

  // right-top outter intermission
  for (var i = 0; i < 3; i++) {
    var y_offset = 0
    let square = { 
      x: squares[squares.length - 1].x - (i + 1 * square_size),
      y: squares[squares.length - 1].y,
      size: square_size,
      colour: colours[(i + 1) % colours.length],
      default_colour: colours[(i + 1) % colours.length]
    }
    go.squares.push(square)
  }

  var x_offset = squares[squares.length - 1].x
  for (var i = 0; i < 2; i++) {
    let square = { 
      x: x_offset,
      y: squares[squares.length - 1].y - (i + 1 * square_size),
      size: square_size,
      colour: colours[(i + 4) % colours.length],
      default_colour: colours[(i + 4) % colours.length]
    }
    go.squares.push(square)
  }

  // top outter lane
  var top_outter_init_post = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y - square_size,
  }
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: top_outter_init_post.x - (i * square_size),
      y: top_outter_init_post.y,
      size: square_size,
      colour: colours[i % colours.length],
      default_colour: colours[i % colours.length]
    }
    go.squares.push(square)
  }

  // top-left outter intermission
  var top_left_outter_init_pos = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y + square_size,
  }
  for (var i = 0; i < 3; i++) {
    let square = { 
      x: top_left_outter_init_pos.x,
      y: top_left_outter_init_pos.y + (i * square_size),
      size: square_size,
      colour: colours[(i + 1) % colours.length],
      default_colour: colours[(i + 1) % colours.length]
    }
    go.squares.push(square)
  }

  var x_offset = squares[squares.length - 1].x - square_size
  var y_offset = squares[squares.length - 1].y
  for (var i = 0; i < 2; i++) {
    let square = { 
      x: x_offset - (i * square_size),
      y: y_offset,
      size: square_size,
      colour: colours[(i + 1) % colours.length],
      default_colour: colours[(i + 1) % colours.length]
    }
    go.squares.push(square)
  }
}

const temp_link_squares = () => {
  go.squares.forEach((square, index) => {
    square.connected = [go.squares[(index + 1) % go.squares.length]]
  })
}

create_board()
temp_link_squares()

const draw = () => {
  go.squares.forEach((square) => {
    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  })

  // Buttons
  menu.draw()
  go.players.forEach((player) => {
    player.draw()
  })
}

const mouse_click = (ev) => {
  console.log(`Click: ${ev.clientX},${ev.clientY}`)
  if (go.game_state == "awaiting_player_movement") {
    let mouse_click_rect = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
    // Let's see if they clicked a piece of his
    let clicked_piece = go.current_player.pieces.
      filter((piece) => !piece.at_home).
      find((piece) => {
        //console.log(`Checking piece at: ${piece.x},${piece.y}`)
        let distance = Vector2.distance(piece, mouse_click_rect)
        return distance <= 15
      })

    if (clicked_piece) {
      go.current_piece_selected = clicked_piece
      clicked_piece.colour = "cyan"
      return
    }

    let clicked_square = go.squares.find((square) => {
      let square_rect = { ...square, width: square_size, height: square_size }
      return is_colliding(square_rect, mouse_click_rect)
    })
    if (clicked_square) {
      if (go.current_movement_target) {
        go.current_movement_target.colour = go.current_movement_target.default_colour
      }
      go.current_movement_target = clicked_square
      clicked_square.colour = "cyan"
    }
  }
}

const game_mode_callbacks = [mouse_click, menu.on_click_menu_button]
const on_click = function (ev) {
  game_mode_callbacks.forEach((callback) => {
    callback(ev)
  })
}
go.canvas.addEventListener("click", on_click, false);

function game_loop() {
  draw()

  setTimeout(game_loop, FPS)
}

start()

