/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/aliado/button.js":
/*!******************************!*\
  !*** ./src/aliado/button.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Button(go, data) {
  this.id =  data.id
  this.text = data.text
  this.x = data.x
  this.y = data.y
  this.width = data.width
  this.height = data.height
  this.perform = data.perform
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Button);


/***/ }),

/***/ "./src/aliado/game.js":
/*!****************************!*\
  !*** ./src/aliado/game.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "start_game": () => (/* binding */ start_game)
/* harmony export */ });
/* harmony import */ var _game_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_object */ "./src/aliado/game_object.js");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu */ "./src/aliado/menu.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player */ "./src/aliado/player.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");





const house_size = 150
const square_size = 50
const starting_point = { x: 10, y: house_size + 10 }
const colours = ["blue", "purple", "white", "yellow", "red", "green"]
const squares = []

let go = null
let menu = null
let player1 = null

const FPS = 33.33

const start_game = () => {
  go = new _game_object__WEBPACK_IMPORTED_MODULE_0__.default()
  menu = new _menu__WEBPACK_IMPORTED_MODULE_1__.default(go)
  player1 = new _player__WEBPACK_IMPORTED_MODULE_2__.default(go)

  go.house_size = house_size
  go.square_size = square_size
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
  go.squares = squares
  go.current_player = player1

  game_mode_callbacks.push(menu.on_click_menu_button)
  go.canvas.addEventListener("click", on_click, false);

  create_board()
  temp_link_squares() // We're brute-force linking the squares while we don't store it

  setTimeout(game_loop, FPS)
}

const next_turn = () => {
  let current_player_id = go.current_player.id
  go.current_player = go.players[(current_player_id + 1) % go.players.length]
}

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
        let distance = _tapete__WEBPACK_IMPORTED_MODULE_3__.Vector2.distance(piece, mouse_click_rect)
        return distance <= 15
      })

    if (clicked_piece) {
      go.current_piece_selected = clicked_piece
      clicked_piece.colour = "cyan"
      return
    }

    let clicked_square = go.squares.find((square) => {
      let square_rect = { ...square, width: square_size, height: square_size }
      return (0,_tapete__WEBPACK_IMPORTED_MODULE_3__.is_colliding)(square_rect, mouse_click_rect)
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

const game_mode_callbacks = [mouse_click]
const on_click = function (ev) {
  game_mode_callbacks.forEach((callback) => {
    callback(ev)
  })
}

function game_loop() {
  draw()

  if (((go.game_state == "next_turn") || ((go.dice_1_used) && (go.dice_2_used))) && (go.game_state != "awaiting_player_die_roll")) {
    console.log("awaiting player die roll")
    go.game_state = "awaiting_player_die_roll"
    next_turn()
  }

  setTimeout(game_loop, FPS)
}


window.Aliado.start_game = start_game()


/***/ }),

/***/ "./src/aliado/game_object.js":
/*!***********************************!*\
  !*** ./src/aliado/game_object.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function GameObject() {
  this.canvas = document.getElementById('screen')
  this.canvas_rect = this.canvas.getBoundingClientRect()
  this.ctx = this.canvas.getContext('2d')
  this.tile_size = 20
  this.creeps = []
  this.players = []
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameObject);


/***/ }),

/***/ "./src/aliado/house.js":
/*!*****************************!*\
  !*** ./src/aliado/house.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HOUSE_POSITIONS = [
  // x, y, colour, index_of_spawn
  [10, 10, "red", 0],
  [10, 810, "purple", 18],
  [810, 810, "green", 36],
  [810, 10, "white", 54],
]

function House(player) {
  this.go = player.go
  this.player = player

  this.x = HOUSE_POSITIONS[player.id][0]
  this.y = HOUSE_POSITIONS[player.id][1]
  this.colour = HOUSE_POSITIONS[player.id][2]
  this.spawn_index = HOUSE_POSITIONS[player.id][3]

  this.draw = () => {
    this.go.ctx.strokeStyle = "black"
    this.go.ctx.lineWidth = 5
    this.go.ctx.fillStyle = this.colour
    this.go.ctx.strokeRect(this.x, this.y, this.go.house_size, this.go.house_size)
    this.go.ctx.fillRect(this.x, this.y, this.go.house_size, this.go.house_size)
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (House);


/***/ }),

/***/ "./src/aliado/menu.js":
/*!****************************!*\
  !*** ./src/aliado/menu.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./src/aliado/button.js");



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
        if ((0,_tapete__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(button, { x: ev.clientX, y: ev.clientY, width: 1, height: 1})) {
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
  this.buttons.push(new _button__WEBPACK_IMPORTED_MODULE_1__.default(
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
  this.buttons.push(new _button__WEBPACK_IMPORTED_MODULE_1__.default(
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Menu);


/***/ }),

/***/ "./src/aliado/piece.js":
/*!*****************************!*\
  !*** ./src/aliado/piece.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
      if (this.go.dice_1_used && this.go.dice_2_used) {
        this.go.game_state = "next_turn"
        this.go.total_movement_left = null
      }
    } else {
      console.log("Can't this.go.there")
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Piece);


/***/ }),

/***/ "./src/aliado/player.js":
/*!******************************!*\
  !*** ./src/aliado/player.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");
/* harmony import */ var _house__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./house */ "./src/aliado/house.js");
/* harmony import */ var _piece__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./piece */ "./src/aliado/piece.js");




function Player(go) {
  this.go = go
  this.id = this.go.players.length
  this.go.players.push(this)
  this.house = new _house__WEBPACK_IMPORTED_MODULE_1__.default(this)
  this.current_square = null
  this.pieces = []
  for (var i = 0; i < 4; i++) {
    this.pieces.push(new _piece__WEBPACK_IMPORTED_MODULE_2__.default(this))
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
        return (0,_tapete__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(square_rect, piece_rect)
      })

     return  colliding_pieces.concat(tmp)
    }, [])
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ }),

/***/ "./src/tapete.js":
/*!***********************!*\
  !*** ./src/tapete.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "is_colliding": () => (/* binding */ is_colliding),
/* harmony export */   "draw_square": () => (/* binding */ draw_square),
/* harmony export */   "Vector2": () => (/* binding */ Vector2)
/* harmony export */ });
const distance = function (a, b) {
  return Math.abs(Math.floor(a) - Math.floor(b));
}

const Vector2 = {
  distance: (a, b) => Math.trunc(Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)))
}

const is_colliding = function(self, target) {
  if (
    (self.x < target.x + target.width) &&
    (self.x + self.width > target.x) &&
    (self.y < target.y + target.height) &&
    (self.y + self.height > target.y)
  ) {
    return true
  } else {
    return false
  }
}

const draw_square = function (x = 10, y = 10, w = 20, h = 20, color = "rgb(190, 20, 10)") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/aliado/index.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/aliado/game.js");


const start = () => {
  const msq = document.querySelector("#app")
  if (window.location.hash == "#/login") {
    fetch('login.html').then((response) => {
      response.text().then((html) => {
        msq.innerHTML = html
      })
    })
  } else {
    fetch('canvas.html').then((response) => {
      response.text().then((html) => {
        msq.innerHTML = html
        ;(0,_game__WEBPACK_IMPORTED_MODULE_0__.start_game)()
      })
    })
  }
  console.log(window.location.hash)
}

document.addEventListener('DOMContentLoaded', start)

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9idXR0b24uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hbGlhZG8vZ2FtZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9ob3VzZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9tZW51LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYWxpYWRvL3BpZWNlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYWxpYWRvL3BsYXllci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3RhcGV0ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hbGlhZG8vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZpQjtBQUNiO0FBQ0k7QUFDb0I7O0FBRWpEO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxXQUFXLGlEQUFVO0FBQ3JCLGFBQWEsMENBQUk7QUFDakIsZ0JBQWdCLDRDQUFNOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QixrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsa0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0Esa0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLE9BQU87QUFDeEI7QUFDQSxrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QixrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMkJBQTJCO0FBQzNCLGVBQWUscURBQVk7QUFDM0IsT0FBTzs7QUFFUDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLGlFQUFlLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFdUQ7Ozs7Ozs7VUMxQnZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTm1DOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGtEQUFVO0FBQ2xCLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBCdXR0b24oZ28sIGRhdGEpIHtcbiAgdGhpcy5pZCA9ICBkYXRhLmlkXG4gIHRoaXMudGV4dCA9IGRhdGEudGV4dFxuICB0aGlzLnggPSBkYXRhLnhcbiAgdGhpcy55ID0gZGF0YS55XG4gIHRoaXMud2lkdGggPSBkYXRhLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHRcbiAgdGhpcy5wZXJmb3JtID0gZGF0YS5wZXJmb3JtXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvblxuIiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3RcIlxuaW1wb3J0IE1lbnUgZnJvbSBcIi4vbWVudVwiXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiXG5pbXBvcnQgeyBWZWN0b3IyLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuY29uc3QgaG91c2Vfc2l6ZSA9IDE1MFxuY29uc3Qgc3F1YXJlX3NpemUgPSA1MFxuY29uc3Qgc3RhcnRpbmdfcG9pbnQgPSB7IHg6IDEwLCB5OiBob3VzZV9zaXplICsgMTAgfVxuY29uc3QgY29sb3VycyA9IFtcImJsdWVcIiwgXCJwdXJwbGVcIiwgXCJ3aGl0ZVwiLCBcInllbGxvd1wiLCBcInJlZFwiLCBcImdyZWVuXCJdXG5jb25zdCBzcXVhcmVzID0gW11cblxubGV0IGdvID0gbnVsbFxubGV0IG1lbnUgPSBudWxsXG5sZXQgcGxheWVyMSA9IG51bGxcblxuY29uc3QgRlBTID0gMzMuMzNcblxuY29uc3Qgc3RhcnRfZ2FtZSA9ICgpID0+IHtcbiAgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG4gIG1lbnUgPSBuZXcgTWVudShnbylcbiAgcGxheWVyMSA9IG5ldyBQbGF5ZXIoZ28pXG5cbiAgZ28uaG91c2Vfc2l6ZSA9IGhvdXNlX3NpemVcbiAgZ28uc3F1YXJlX3NpemUgPSBzcXVhcmVfc2l6ZVxuICBnby5jYW52YXMuaGVpZ2h0ID0gMTIwMFxuICBnby5jYW52YXMud2lkdGggPSAxMjAwXG4gIGdvLmJvYXJkX2hlaWdodCA9IDEwMDBcbiAgZ28uYm9hcmRfd2lkdGggPSAxMjAwXG4gIGdvLnBsYXllcnMgPSBbXVxuICAvLyBUaGVzZSBlbmFibGUgcGxheWVyIG1vdmVtZW50XG4gIGdvLmdhbWVfc3RhdGUgPSBcInVuaW5pdGlhbGl6ZWRcIlxuICBnby5jdXJyZW50X21vdmVtZW50X3RhcmdldCA9IG51bGxcbiAgZ28uY3VycmVudF9waWVjZV9zZWxlY3RlZCA9IG51bGxcbiAgLy8gRU5EXG4gIGdvLnNxdWFyZXMgPSBzcXVhcmVzXG4gIGdvLmN1cnJlbnRfcGxheWVyID0gcGxheWVyMVxuXG4gIGdhbWVfbW9kZV9jYWxsYmFja3MucHVzaChtZW51Lm9uX2NsaWNrX21lbnVfYnV0dG9uKVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uX2NsaWNrLCBmYWxzZSk7XG5cbiAgY3JlYXRlX2JvYXJkKClcbiAgdGVtcF9saW5rX3NxdWFyZXMoKSAvLyBXZSdyZSBicnV0ZS1mb3JjZSBsaW5raW5nIHRoZSBzcXVhcmVzIHdoaWxlIHdlIGRvbid0IHN0b3JlIGl0XG5cbiAgc2V0VGltZW91dChnYW1lX2xvb3AsIEZQUylcbn1cblxuY29uc3QgbmV4dF90dXJuID0gKCkgPT4ge1xuICBsZXQgY3VycmVudF9wbGF5ZXJfaWQgPSBnby5jdXJyZW50X3BsYXllci5pZFxuICBnby5jdXJyZW50X3BsYXllciA9IGdvLnBsYXllcnNbKGN1cnJlbnRfcGxheWVyX2lkICsgMSkgJSBnby5wbGF5ZXJzLmxlbmd0aF1cbn1cblxuY29uc3QgZHJhd19ob3VzZSA9ICh4LCB5LCBjb2xvdXIpID0+IHtcbiAgZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gIGdvLmN0eC5saW5lV2lkdGggPSA1XG4gIGdvLmN0eC5maWxsU3R5bGUgPSBjb2xvdXJcbiAgZ28uY3R4LnN0cm9rZVJlY3QoeCwgeSwgaG91c2Vfc2l6ZSwgaG91c2Vfc2l6ZSlcbiAgZ28uY3R4LmZpbGxSZWN0KHgsIHksIGhvdXNlX3NpemUsIGhvdXNlX3NpemUpXG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gKHgsIHksIHcsIGgsIGNvbG91cikgPT4ge1xuICBnby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgZ28uY3R4LmxpbmVXaWR0aCA9IDVcbiAgZ28uY3R4LmZpbGxTdHlsZSA9IGNvbG91clxuICBnby5jdHguZmlsbFJlY3QoeCwgeSwgdywgaClcbiAgZ28uY3R4LnN0cm9rZVJlY3QoeCwgeSwgdywgaClcbn1cblxuY29uc3QgY3JlYXRlX2JvYXJkID0gKCkgPT4ge1xuICAvLyBsZWZ0IG91dHRlciBsYW5lXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTM7IGkrKykge1xuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogMTAsXG4gICAgICB5OiBzdGFydGluZ19wb2ludC55ICsgKGkgKiBzcXVhcmVfc2l6ZSksXG4gICAgICBzaXplOiBzcXVhcmVfc2l6ZSxcbiAgICAgIGNvbG91cjogY29sb3Vyc1tpICUgY29sb3Vycy5sZW5ndGhdLFxuICAgICAgZGVmYXVsdF9jb2xvdXI6IGNvbG91cnNbaSAlIGNvbG91cnMubGVuZ3RoXVxuICAgIH1cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG4gIC8vIGxlZnQtYm90dG9tIG91dHRlciBpbnRlcm1pc3Npb25cbiAgdmFyIGxlZnRfYm90dG9tX2luaXRfcG9zdCA9IHtcbiAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCArIHNxdWFyZV9zaXplLFxuICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBsZXQgc3F1YXJlID0geyBcbiAgICAgIHg6IGxlZnRfYm90dG9tX2luaXRfcG9zdC54ICsgKGkgKiBzcXVhcmVfc2l6ZSksXG4gICAgICB5OiBsZWZ0X2JvdHRvbV9pbml0X3Bvc3QueSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDEpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIHZhciB5X29mZnNldCA9IDBcbiAgICBsZXQgc3F1YXJlID0geyBcbiAgICAgIHg6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS54LFxuICAgICAgeTogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnkgKyAoaSArIDEgKiBzcXVhcmVfc2l6ZSksXG4gICAgICBzaXplOiBzcXVhcmVfc2l6ZSxcbiAgICAgIGNvbG91cjogY29sb3Vyc1soaSArIDQpICUgY29sb3Vycy5sZW5ndGhdLFxuICAgICAgZGVmYXVsdF9jb2xvdXI6IGNvbG91cnNbKGkgKyA0KSAlIGNvbG91cnMubGVuZ3RoXVxuICAgIH1cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG4gIC8vIGJvdHRvbSBvdXR0ZXIgbGFuZVxuICB2YXIgYm90dG9tX291dHRlcl9pbml0X3BvcyA9IHtcbiAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCxcbiAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSArIHNxdWFyZV9zaXplXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiBib3R0b21fb3V0dGVyX2luaXRfcG9zLnggKyAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHk6IGJvdHRvbV9vdXR0ZXJfaW5pdF9wb3MueSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzW2kgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1tpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cbiAgLy8gYm90dG9tLXJpZ2h0IG91dHRlciBpbnRlcm1pc3Npb25cbiAgdmFyIGJvdHRvbV9yaWdodF9vdXR0ZXJfaW5pdF9wb3MgPSB7XG4gICAgeDogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLngsXG4gICAgeTogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnkgLSBzcXVhcmVfc2l6ZVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiBib3R0b21fcmlnaHRfb3V0dGVyX2luaXRfcG9zLngsXG4gICAgICB5OiBib3R0b21fcmlnaHRfb3V0dGVyX2luaXRfcG9zLnkgLSAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDEpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIHZhciB4X29mZnNldCA9IHNxdWFyZV9zaXplICsgNVxuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnggKyAoaSArIDEgKiBzcXVhcmVfc2l6ZSksXG4gICAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgNCkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDQpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuXG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIC8vIHJpZ2h0IG91dHRlciBsYW5lXG4gIHZhciByaWdodF9vdXR0ZXJfaW5pdF9wb3MgPSB7XG4gICAgeDogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnggKyBzcXVhcmVfc2l6ZSxcbiAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTM7IGkrKykge1xuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogcmlnaHRfb3V0dGVyX2luaXRfcG9zLngsXG4gICAgICB5OiByaWdodF9vdXR0ZXJfaW5pdF9wb3MueSAtIChpICogc3F1YXJlX3NpemUpLFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbaSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzW2kgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIC8vIHJpZ2h0LXRvcCBvdXR0ZXIgaW50ZXJtaXNzaW9uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgdmFyIHlfb2Zmc2V0ID0gMFxuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnggLSAoaSArIDEgKiBzcXVhcmVfc2l6ZSksXG4gICAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDEpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cblxuICB2YXIgeF9vZmZzZXQgPSBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueFxuICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogeF9vZmZzZXQsXG4gICAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSAtIChpICsgMSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgNCkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDQpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cblxuICAvLyB0b3Agb3V0dGVyIGxhbmVcbiAgdmFyIHRvcF9vdXR0ZXJfaW5pdF9wb3N0ID0ge1xuICAgIHg6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS54LFxuICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55IC0gc3F1YXJlX3NpemUsXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiB0b3Bfb3V0dGVyX2luaXRfcG9zdC54IC0gKGkgKiBzcXVhcmVfc2l6ZSksXG4gICAgICB5OiB0b3Bfb3V0dGVyX2luaXRfcG9zdC55LFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbaSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzW2kgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIC8vIHRvcC1sZWZ0IG91dHRlciBpbnRlcm1pc3Npb25cbiAgdmFyIHRvcF9sZWZ0X291dHRlcl9pbml0X3BvcyA9IHtcbiAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCxcbiAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSArIHNxdWFyZV9zaXplLFxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiB0b3BfbGVmdF9vdXR0ZXJfaW5pdF9wb3MueCxcbiAgICAgIHk6IHRvcF9sZWZ0X291dHRlcl9pbml0X3Bvcy55ICsgKGkgKiBzcXVhcmVfc2l6ZSksXG4gICAgICBzaXplOiBzcXVhcmVfc2l6ZSxcbiAgICAgIGNvbG91cjogY29sb3Vyc1soaSArIDEpICUgY29sb3Vycy5sZW5ndGhdLFxuICAgICAgZGVmYXVsdF9jb2xvdXI6IGNvbG91cnNbKGkgKyAxKSAlIGNvbG91cnMubGVuZ3RoXVxuICAgIH1cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG5cbiAgdmFyIHhfb2Zmc2V0ID0gc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnggLSBzcXVhcmVfc2l6ZVxuICB2YXIgeV9vZmZzZXQgPSBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueVxuICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogeF9vZmZzZXQgLSAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHk6IHlfb2Zmc2V0LFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbKGkgKyAxKSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxufVxuXG5jb25zdCB0ZW1wX2xpbmtfc3F1YXJlcyA9ICgpID0+IHtcbiAgZ28uc3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgc3F1YXJlLmNvbm5lY3RlZCA9IFtnby5zcXVhcmVzWyhpbmRleCArIDEpICUgZ28uc3F1YXJlcy5sZW5ndGhdXVxuICB9KVxufVxuXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBnby5zcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgIGRyYXdfc3F1YXJlKFxuICAgICAgc3F1YXJlLngsXG4gICAgICBzcXVhcmUueSxcbiAgICAgIHNxdWFyZS5zaXplLFxuICAgICAgc3F1YXJlLnNpemUsXG4gICAgICBzcXVhcmUuY29sb3VyXG4gICAgKVxuICB9KVxuXG4gIC8vIEJ1dHRvbnNcbiAgbWVudS5kcmF3KClcbiAgZ28ucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuZHJhdygpXG4gIH0pXG59XG5cbmNvbnN0IG1vdXNlX2NsaWNrID0gKGV2KSA9PiB7XG4gIGNvbnNvbGUubG9nKGBDbGljazogJHtldi5jbGllbnRYfSwke2V2LmNsaWVudFl9YClcbiAgaWYgKGdvLmdhbWVfc3RhdGUgPT0gXCJhd2FpdGluZ19wbGF5ZXJfbW92ZW1lbnRcIikge1xuICAgIGxldCBtb3VzZV9jbGlja19yZWN0ID0geyB4OiBldi5jbGllbnRYLCB5OiBldi5jbGllbnRZLCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgICAvLyBMZXQncyBzZWUgaWYgdGhleSBjbGlja2VkIGEgcGllY2Ugb2YgaGlzXG4gICAgbGV0IGNsaWNrZWRfcGllY2UgPSBnby5jdXJyZW50X3BsYXllci5waWVjZXMuXG4gICAgICBmaWx0ZXIoKHBpZWNlKSA9PiAhcGllY2UuYXRfaG9tZSkuXG4gICAgICBmaW5kKChwaWVjZSkgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKGBDaGVja2luZyBwaWVjZSBhdDogJHtwaWVjZS54fSwke3BpZWNlLnl9YClcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShwaWVjZSwgbW91c2VfY2xpY2tfcmVjdClcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlIDw9IDE1XG4gICAgICB9KVxuXG4gICAgaWYgKGNsaWNrZWRfcGllY2UpIHtcbiAgICAgIGdvLmN1cnJlbnRfcGllY2Vfc2VsZWN0ZWQgPSBjbGlja2VkX3BpZWNlXG4gICAgICBjbGlja2VkX3BpZWNlLmNvbG91ciA9IFwiY3lhblwiXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgY2xpY2tlZF9zcXVhcmUgPSBnby5zcXVhcmVzLmZpbmQoKHNxdWFyZSkgPT4ge1xuICAgICAgbGV0IHNxdWFyZV9yZWN0ID0geyAuLi5zcXVhcmUsIHdpZHRoOiBzcXVhcmVfc2l6ZSwgaGVpZ2h0OiBzcXVhcmVfc2l6ZSB9XG4gICAgICByZXR1cm4gaXNfY29sbGlkaW5nKHNxdWFyZV9yZWN0LCBtb3VzZV9jbGlja19yZWN0KVxuICAgIH0pXG4gICAgaWYgKGNsaWNrZWRfc3F1YXJlKSB7XG4gICAgICBpZiAoZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQpIHtcbiAgICAgICAgZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQuY29sb3VyID0gZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQuZGVmYXVsdF9jb2xvdXJcbiAgICAgIH1cbiAgICAgIGdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gY2xpY2tlZF9zcXVhcmVcbiAgICAgIGNsaWNrZWRfc3F1YXJlLmNvbG91ciA9IFwiY3lhblwiXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGdhbWVfbW9kZV9jYWxsYmFja3MgPSBbbW91c2VfY2xpY2tdXG5jb25zdCBvbl9jbGljayA9IGZ1bmN0aW9uIChldikge1xuICBnYW1lX21vZGVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgY2FsbGJhY2soZXYpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdhbWVfbG9vcCgpIHtcbiAgZHJhdygpXG5cbiAgaWYgKCgoZ28uZ2FtZV9zdGF0ZSA9PSBcIm5leHRfdHVyblwiKSB8fCAoKGdvLmRpY2VfMV91c2VkKSAmJiAoZ28uZGljZV8yX3VzZWQpKSkgJiYgKGdvLmdhbWVfc3RhdGUgIT0gXCJhd2FpdGluZ19wbGF5ZXJfZGllX3JvbGxcIikpIHtcbiAgICBjb25zb2xlLmxvZyhcImF3YWl0aW5nIHBsYXllciBkaWUgcm9sbFwiKVxuICAgIGdvLmdhbWVfc3RhdGUgPSBcImF3YWl0aW5nX3BsYXllcl9kaWVfcm9sbFwiXG4gICAgbmV4dF90dXJuKClcbiAgfVxuXG4gIHNldFRpbWVvdXQoZ2FtZV9sb29wLCBGUFMpXG59XG5cbmV4cG9ydCB7IHN0YXJ0X2dhbWUgfVxud2luZG93LkFsaWFkby5zdGFydF9nYW1lID0gc3RhcnRfZ2FtZSgpXG4iLCJmdW5jdGlvbiBHYW1lT2JqZWN0KCkge1xuICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4nKVxuICB0aGlzLmNhbnZhc19yZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gIHRoaXMudGlsZV9zaXplID0gMjBcbiAgdGhpcy5jcmVlcHMgPSBbXVxuICB0aGlzLnBsYXllcnMgPSBbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0XG4iLCJjb25zdCBIT1VTRV9QT1NJVElPTlMgPSBbXG4gIC8vIHgsIHksIGNvbG91ciwgaW5kZXhfb2Zfc3Bhd25cbiAgWzEwLCAxMCwgXCJyZWRcIiwgMF0sXG4gIFsxMCwgODEwLCBcInB1cnBsZVwiLCAxOF0sXG4gIFs4MTAsIDgxMCwgXCJncmVlblwiLCAzNl0sXG4gIFs4MTAsIDEwLCBcIndoaXRlXCIsIDU0XSxcbl1cblxuZnVuY3Rpb24gSG91c2UocGxheWVyKSB7XG4gIHRoaXMuZ28gPSBwbGF5ZXIuZ29cbiAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXJcblxuICB0aGlzLnggPSBIT1VTRV9QT1NJVElPTlNbcGxheWVyLmlkXVswXVxuICB0aGlzLnkgPSBIT1VTRV9QT1NJVElPTlNbcGxheWVyLmlkXVsxXVxuICB0aGlzLmNvbG91ciA9IEhPVVNFX1BPU0lUSU9OU1twbGF5ZXIuaWRdWzJdXG4gIHRoaXMuc3Bhd25faW5kZXggPSBIT1VTRV9QT1NJVElPTlNbcGxheWVyLmlkXVszXVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDVcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMuZ28uaG91c2Vfc2l6ZSwgdGhpcy5nby5ob3VzZV9zaXplKVxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLmdvLmhvdXNlX3NpemUsIHRoaXMuZ28uaG91c2Vfc2l6ZSlcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEhvdXNlXG4iLCJpbXBvcnQgeyBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi4vdGFwZXRlXCJcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vYnV0dG9uXCJcblxuZnVuY3Rpb24gTWVudShnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5tZW51ID0gdGhpc1xuICB0aGlzLmRpY2VfMSA9IG51bGxcbiAgdGhpcy5kaWNlXzIgPSBudWxsXG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KGJ1dHRvbi54LCBidXR0b24ueSArIDUsIDE0NSwgNDUpXG4gICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInB1cnBsZVwiXG4gICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdChidXR0b24ueCwgYnV0dG9uLnksIDE1MCwgNTApXG4gICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCJzYW5zLXNlcmlmXCJcbiAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQoYnV0dG9uLnRleHQpXG4gICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCBidXR0b24ueSArIDEwICsgKGJ1dHRvbi5oZWlnaHQgLyAyKSAtIDUpXG4gICAgfSlcblxuICAgIHRoaXMuZHJhd19kaWNlKClcbiAgICB0aGlzLmRyYXdfY3VycmVudF9wbGF5ZXIoKVxuICB9XG5cbiAgdGhpcy5kcmF3X2N1cnJlbnRfcGxheWVyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDEwLCA5NzUsIDI1MCwgMzApXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHguZmlsbFRleHQoYEN1cnJlbnQgcGxheWVyOiAke3RoaXMuZ28uY3VycmVudF9wbGF5ZXIuaG91c2UuY29sb3VyfWAsIDEwLCA5OTUpXG4gIH1cblxuICB0aGlzLmRyYXdfZGljZSA9ICgpID0+IHtcbiAgICAvLyBkMVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCgxNzAsIHRoaXMuZ28uYm9hcmRfaGVpZ2h0ICsgMTUsIDQwLCA0NSlcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgxNzAsIHRoaXMuZ28uYm9hcmRfaGVpZ2h0ICsgMTUsIDQwLCA0NSlcbiAgICBpZiAoZ28uZGljZV8xX3VzZWQpIHtcbiAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjYpXCJcbiAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDE3MCwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSwgNDAsIDQ1KVxuICAgIH1cbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XG4gICAgdGhpcy5nby5jdHguZm9udCA9IFwiMjFweCBzYW5zLXNlcmlmXCJcbiAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KGdvLmRpY2VfMSB8fCBcIi1cIilcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChnby5kaWNlXzEgfHwgXCItXCIsIDE3MCArIDIwIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSArIDMwKVxuICAgIC8vIGQyXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KDIzMCwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSwgNDAsIDQ1KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDIzMCwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSwgNDAsIDQ1KVxuICAgIGlmIChnby5kaWNlXzJfdXNlZCkge1xuICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNilcIlxuICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMjMwLCB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDE1LCA0MCwgNDUpXG4gICAgfVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyMXB4IHNhbnMtc2VyaWZcIlxuICAgIHZhciB0ZXh0X2RpY2VfMiA9IGdvLmRpY2VfMiB8fCBcIi1cIlxuICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dF9kaWNlXzIpXG4gICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dF9kaWNlXzIsIDIzMCArIDIwIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSArIDMwKVxuICB9XG5cbiAgLy8gVE9ETzogaW52ZXN0aWdhdGUgd2h5IGNhbnZhc19yZWN0IHdpZHRoIHdvcmtzIGhlcmUuLi5cbiAgdGhpcy5vbl9jbGlja19tZW51X2J1dHRvbiA9IChldikgPT4ge1xuICAgIGxldCBjb2xsaXNpb25fY2xpY2sgPSB7IHg6IGV2LmNsaWVudFgsIHk6IGV2LmNsaWVudFksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICAgIGlmIChldi5jbGllbnRZID4gdGhpcy5nby5ib2FyZF9oZWlnaHQpIHtcbiAgICAgIHRoaXMuYnV0dG9ucy5maW5kKChidXR0b24pID0+IHtcbiAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhidXR0b24sIHsgeDogZXYuY2xpZW50WCwgeTogZXYuY2xpZW50WSwgd2lkdGg6IDEsIGhlaWdodDogMX0pKSB7XG4gICAgICAgICAgYnV0dG9uLnBlcmZvcm0oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuaG91c2VfbGVhdmluZ19jb21ib3MgPSBbXG4gICAgWzYsIDZdXG4gIF1cblxuICB0aGlzLmRpY2VfY29tYm9fbGVhdmVzX3RoZV9ob3VzZSA9ICgpID0+IHtcbiAgICBsZXQgZGljZV9jb21ib19sZWF2ZXNfdGhlX2hvdXNlID0gdGhpcy5ob3VzZV9sZWF2aW5nX2NvbWJvcy5zb21lKChjb21ibykgPT4ge1xuICAgICAgcmV0dXJuICgoZ28uZGljZV8xID09IGNvbWJvWzBdKSAmJiAoZ28uZGljZV8yID09IGNvbWJvWzFdKSlcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5yb2xsX2RpY2UgPSAoKSA9PiB7XG4gICAgZ28uZGljZV8xID0gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogNikgKyAxXG4gICAgZ28uZGljZV8yID0gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogNikgKyAxXG4gICAgZ28uZGljZV8xX3VzZWQgPSBmYWxzZVxuICAgIGdvLmRpY2VfMl91c2VkID0gZmFsc2VcbiAgICBnby50b3RhbF9tb3ZlbWVudF9sZWZ0ID0gZ28uZGljZV8xICsgZ28uZGljZV8yXG5cbiAgICBjb25zb2xlLmxvZyhgJHtnby5kaWNlXzF9LCAke2dvLmRpY2VfMn1gKVxuXG4gICAgLy8gT25seSBzcGVuZCB0aGUgNiBpZiB0aGVyZSBhcmUgcGllY2VzIGF0IGhvbWVcbiAgICBsZXQgYWxsX3BpZWNlc19hdF9ob21lID0gZ28uY3VycmVudF9wbGF5ZXIucGllY2VzLmV2ZXJ5KChwaWVjZSkgPT4gcGllY2UuYXRfaG9tZSlcbiAgICBpZiAoYWxsX3BpZWNlc19hdF9ob21lICYmICF0aGlzLmRpY2VfY29tYm9fbGVhdmVzX3RoZV9ob3VzZSgpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5leHRfdHVyblwiKVxuICAgICAgZ28uZ2FtZV9zdGF0ZSA9IFwibmV4dF90dXJuXCJcbiAgICB9XG4gICAgaWYgKChnby5kaWNlXzEgPT0gNikgJiYgKGdvLmN1cnJlbnRfcGxheWVyLnBpZWNlcy5zb21lKChwaWVjZSkgPT4gcGllY2UuYXRfaG9tZSkpKSB7XG4gICAgICBnby5kaWNlXzFfdXNlZCA9IHRydWVcbiAgICAgIGdvLnRvdGFsX21vdmVtZW50X2xlZnQgLT0gZ28uZGljZV8xXG4gICAgICBnby5jdXJyZW50X3BsYXllci5zcGF3bl9waWVjZSgpXG4gICAgICBjb25zb2xlLmxvZyhgJHtnby5kaWNlXzF9IHVzZWRgKVxuICAgIH1cblxuICAgIC8vIE9ubHkgc3BlbmQgdGhlIDYgaWYgdGhlcmUgYXJlIHBpZWNlcyBhdCBob21lXG4gICAgaWYgKChnby5kaWNlXzIgPT0gNikgJiYgKGdvLmN1cnJlbnRfcGxheWVyLnBpZWNlcy5zb21lKChwaWVjZSkgPT4gcGllY2UuYXRfaG9tZSkpKSB7XG4gICAgICBnby5kaWNlXzJfdXNlZCA9IHRydWVcbiAgICAgIGdvLnRvdGFsX21vdmVtZW50X2xlZnQgLT0gZ28uZGljZV8yXG4gICAgICBnby5jdXJyZW50X3BsYXllci5zcGF3bl9waWVjZSgpXG4gICAgICBjb25zb2xlLmxvZyhgJHtnby5kaWNlXzJ9IHVzZWRgKVxuICAgIH1cblxuICAgIC8vIENhbiB0aGUgcGxhZXllciBkbyBhbnl0aGluZz9cbiAgICBsZXQgbW92YWJsZV9waWVjZXMgPSB0aGlzLmdvLmN1cnJlbnRfcGxheWVyLnBpZWNlcy5maWx0ZXIoKHBpZWNlKSA9PiBwaWVjZS5jdXJyZW50X25vZGUgIT0gbnVsbClcbiAgICBpZiAobW92YWJsZV9waWVjZXMubGVuZ3RoID4gMCkge1xuICAgICAgZ28uZ2FtZV9zdGF0ZSA9IFwiYXdhaXRpbmdfcGxheWVyX21vdmVtZW50XCJcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOyBXZSBuZWVkIHRvIGFkZCBoZXJlIHRoZSBpZGVhIG9mIG1hcmtpbmcgd2hpY2ggZGljZSBoYXMgYmVlbiB1c2VkXG4gIC8vIEN1cnJlbnRseSwgaXQncyBhbGwgbWl4ZWQgdW5kZXIgdG90YWxfbW92ZW1lbnRcbiAgdGhpcy5tb3ZlID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3VycmVudF9waWVjZV9zZWxlY3RlZC5tb3ZlKClcbiAgfVxuXG4gIHRoaXMuYnV0dG9ucyA9IFtdXG4gIHRoaXMuYnV0dG9ucy5wdXNoKG5ldyBCdXR0b24oXG4gICAgZ28sXG4gICAge1xuICAgICAgaWQ6IFwicm9sbF9kaWNlXCIsXG4gICAgICB0ZXh0OiBcIlJvbGwgdGhlIGRpZVwiLFxuICAgICAgeDogMTAsXG4gICAgICB5OiB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDEwLFxuICAgICAgd2lkdGg6IDE1MCxcbiAgICAgIGhlaWdodDogNTAsXG4gICAgICBwZXJmb3JtOiB0aGlzLnJvbGxfZGljZVxuICAgIH0pKVxuICB0aGlzLmJ1dHRvbnMucHVzaChuZXcgQnV0dG9uKFxuICAgIGdvLFxuICAgIHtcbiAgICAgIGlkOiBcIm1vdmVcIixcbiAgICAgIHRleHQ6IFwiTW92ZVwiLFxuICAgICAgeDogMTAsXG4gICAgICB5OiB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDcwLFxuICAgICAgd2lkdGg6IDE1MCxcbiAgICAgIGhlaWdodDogNTAsXG4gICAgICBwZXJmb3JtOiB0aGlzLm1vdmVcbiAgICB9KSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVudVxuIiwiLy8gQWJzdHJhY3RzIGVhY2ggaW5kaXZpZHVhbCBwaWVjZSBpbiB0aGUgYm9hcmRcbi8vXG4vLyBTdGFja2luZ1xuLy9cbi8vIEEgUGllY2UgY2FuIGJlIHN0YWNrZWQgb24gYW5vdGhlci4gVGhpcyBtZWFucyB0aGF0IHRoZXkgYXJlIG9uXG4vLyB0b3Agb2YgZWFjaCBvdGhlciwgYW5kIG1vdmUgdG9nZXRoZXIuIFRoZXkgY2FuIG9ubHkgYmUgc2VwYXJhdGVkXG4vLyB0aHJvdWdoIGRlYXRoIC0gZ29pbmcgYmFjayBob21lLlxuLy9cbi8vIFRvIHN0YWNrIFBpZWNlcywgc2ltcGx5IG1vdmUgb25lIG9uIHRvcCBvZiB0aGUgb3RoZXIgYmVsb25naW5nIHRvIHRoZVxuLy8gc2FtZSBQbGF5ZXIuIFRoZSBtb3ZpbmcgcGllY2UgaXMgdGhlbiBzdGFja2VkIHdpdGggdGhlIG9uZSBpdCBtb3ZlZCBpbnRvLlxuLy8gXG4vLyBJbiB0aGUgbW9kZWwsIHRoaXMgbWVhbnMgdGhhdCBvbmx5IG9mIHRoZSBQaWVjZXMgaXMgZHJhd24gb24gdGhlIEJvYXJkOlxuLy8gdGhlIFBpZWNlIHRoYXQgd2FzIGFscmVhZHkgdGhlcmUuIEFsbCB0aGUgb25lcyB3aG8gbW92ZSBpbnRvIGl0LCBhcmVcbi8vIGxpc3RlZCBvbiB0aGUgY29sbGlkZWQgb25lJ3MgYHN0YWNrZWRfd2l0aGAgZmllbGQ7IGFuZCBmbGFnIHRoZW1zZWx2ZXNcbi8vIGFzIGBzdGFja2VkID0gdHJ1ZWAgKHdoaWNoIHNpZ25hbHMgdGhlIGRyYXdpbmcgdGhhdCBpdCBzaG91bGRuJ3QgYmUgZHJhd24pXG5mdW5jdGlvbiBQaWVjZShwbGF5ZXIpIHtcbiAgdGhpcy5nbyA9IHBsYXllci5nb1xuICB0aGlzLnBsYXllciA9IHBsYXllclxuICB0aGlzLmF0X2hvbWUgPSB0cnVlXG4gIHRoaXMuY3VycmVudF9ub2RlID0gbnVsbFxuICB0aGlzLmRlZmF1bHRfY29sb3VyID0gcGxheWVyLmhvdXNlLmNvbG91clxuICB0aGlzLmNvbG91ciA9IHBsYXllci5ob3VzZS5jb2xvdXJcbiAgdGhpcy54ID0gbnVsbFxuICB0aGlzLnkgPSBudWxsXG4gIC8vIFRoZSBwaWVjZXMgdGhhdCBhcmUgc3RhY2tlZCBhbG9uZyB3aXRoIHRoaXMgb25lXG4gIHRoaXMuc3RhY2tlZF93aXRoID0gW11cbiAgdGhpcy5zdGFja2VkID0gZmFsc2VcbiAgdGhpcy5zZXRfY3VycmVudF9ub2RlID0gKG5vZGUpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfbm9kZSA9IG5vZGVcbiAgICB0aGlzLnggPSB0aGlzLmN1cnJlbnRfbm9kZS54ICsgdGhpcy5wbGF5ZXIuZ28uc3F1YXJlX3NpemUgLyAyXG4gICAgdGhpcy55ID0gdGhpcy5jdXJyZW50X25vZGUueSArIHRoaXMucGxheWVyLmdvLnNxdWFyZV9zaXplIC8gMlxuICAgIHRoaXMuYXRfaG9tZSA9IGZhbHNlXG4gIH1cblxuICB0aGlzLm1vdmUgPSAoKSA9PiB7XG4gICAgLy8gSXMgdGhlIG1vdmVtZW50IGxlZnQgZW5vdWdoIHRvIGV4YWN0bHkgcmVhY2ggdGhpcyBzcXVhcmU/XG4gICAgbGV0IG5leHQgPSB0aGlzLmN1cnJlbnRfbm9kZVxuICAgIGxldCBkb2VzX2l0X3JlYWNoX3dpdGhfZDEgPSBmYWxzZVxuICAgIGxldCBkb2VzX2l0X3JlYWNoX3dpdGhfZDIgPSBmYWxzZVxuXG4gICAgaWYgKCh0aGlzLmdvLmRpY2VfMSA9PSA2KSB8fCAodGhpcy5nby5kaWNlXzIgPT0gNikpIHtcbiAgICAgIGlmICghdGhpcy5nby5kaWNlXzFfdXNlZCkge1xuICAgICAgICBBcnJheS5mcm9tKEFycmF5KHRoaXMuZ28uZGljZV8xKSkuZm9yRWFjaCgoaSkgPT4ge1xuICAgICAgICAgIG5leHQgPSBuZXh0LmNvbm5lY3RlZFswXVxuICAgICAgICB9KVxuICAgICAgICBkb2VzX2l0X3JlYWNoX3dpdGhfZDEgPSAobmV4dCA9PSB0aGlzLmdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZ28uZGljZV8yX3VzZWQgJiYgIWRvZXNfaXRfcmVhY2hfd2l0aF9kMSkge1xuICAgICAgICBuZXh0ID0gdGhpcy5jdXJyZW50X25vZGVcbiAgICAgICAgQXJyYXkuZnJvbShBcnJheSh0aGlzLmdvLmRpY2VfMikpLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgICBuZXh0ID0gbmV4dC5jb25uZWN0ZWRbMF1cbiAgICAgICAgfSlcbiAgICAgICAgZG9lc19pdF9yZWFjaF93aXRoX2QyID0gKG5leHQgPT0gdGhpcy5nby5jdXJyZW50X21vdmVtZW50X3RhcmdldClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFkb2VzX2l0X3JlYWNoX3dpdGhfZDEgJiYgIWRvZXNfaXRfcmVhY2hfd2l0aF9kMikge1xuICAgICAgbmV4dCA9IHRoaXMuY3VycmVudF9ub2RlXG4gICAgICBBcnJheS5mcm9tKEFycmF5KHRoaXMuZ28udG90YWxfbW92ZW1lbnRfbGVmdCkpLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgbmV4dCA9IG5leHQuY29ubmVjdGVkWzBdXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIElmIHRoZSBlbmQgcmVzdWx0IG1hdGNoZXMgd2l0aCB0aGUgY2xpY2tlZCB0YXJnZXQsIGxldCdzIGdvXG4gICAgaWYgKG5leHQgPT0gdGhpcy5nby5jdXJyZW50X21vdmVtZW50X3RhcmdldCkge1xuICAgICAgaWYgKGRvZXNfaXRfcmVhY2hfd2l0aF9kMSkge1xuICAgICAgICB0aGlzLmdvLmRpY2VfMV91c2VkID0gdHJ1ZVxuICAgICAgICB0aGlzLmdvLnRvdGFsX21vdmVtZW50X2xlZnQgLT0gdGhpcy5nby5kaWNlXzFfdXNlZFxuICAgICAgfVxuICAgICAgaWYgKGRvZXNfaXRfcmVhY2hfd2l0aF9kMikge1xuICAgICAgICB0aGlzLmdvLmRpY2VfMl91c2VkID0gdHJ1ZVxuICAgICAgICB0aGlzLmdvLnRvdGFsX21vdmVtZW50X2xlZnQgLT0gdGhpcy5nby5kaWNlXzJfdXNlZFxuICAgICAgfVxuICAgICAgLy8gQ2hlY2tpbmcgaWYgdGhlcmUgaXMgYWxyZWFkeSBvbmUgb2Ygb3VyXG4gICAgICBsZXQgY29sbGlkZWRfcGllY2UgPSBudWxsXG4gICAgICB0aGlzLmdvLnBsYXllcnMuZmluZCgocGxheWVyKSA9PiB7XG4gICAgICAgIHJldHVybiBwbGF5ZXIucGllY2VzLmZpbmQoKHBpZWNlKSA9PiB7XG4gICAgICAgICAgaWYgKCFwaWVjZS5hdF9ob21lICYmICFwaWVjZS5zdGFja2VkICYmIHBpZWNlLmN1cnJlbnRfbm9kZSA9PSBuZXh0KSB7XG4gICAgICAgICAgICBjb2xsaWRlZF9waWVjZSA9IHBpZWNlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICApXG5cbiAgICAgIGlmIChjb2xsaWRlZF9waWVjZSkge1xuICAgICAgICBjb2xsaWRlZF9waWVjZS5zdGFja2VkX3dpdGgucHVzaCh0aGlzKVxuICAgICAgICBsZXQgc3RhY2tlZF9waWVjZSA9IG51bGxcbiAgICAgICAgd2hpbGUoc3RhY2tlZF9waWVjZSA9IHRoaXMuc3RhY2tlZF93aXRoLnBvcCgpKSB7XG4gICAgICAgICAgY29sbGlkZWRfcGllY2Uuc3RhY2tlZF93aXRoLnB1c2goc3RhY2tlZF9waWVjZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YWNrZWQgPSB0cnVlXG4gICAgICAgIHRoaXMuYXRfaG9tZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuY3VycmVudF9ub2RlID0gbnVsbCAvLyBXb3Jrcz9cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENoYW5naW5nIHBsYWNlIGFuZCByZXNldGluZyBmb3JtZXIgcGxhY2UncyBkZWZhdWx0IHVuc2VsZWN0ZWQgY29sb3VyXG4gICAgICAgIHRoaXMuc2V0X2N1cnJlbnRfbm9kZShuZXh0KVxuICAgICAgfVxuICAgICAgLy8gVW5zZWxlY3QgcGllY2VcbiAgICAgIHRoaXMuY29sb3VyID0gdGhpcy5kZWZhdWx0X2NvbG91clxuICAgICAgdGhpcy5nby5jdXJyZW50X3BpZWNlX3NlbGVjdGVkID0gbnVsbFxuICAgICAgdGhpcy5nby5jdXJyZW50X21vdmVtZW50X3RhcmdldC5jb2xvdXIgPSB0aGlzLmdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0LmRlZmF1bHRfY29sb3VyXG4gICAgICB0aGlzLmdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuXG4gICAgICAvLyBSZW1vdmUgbW92ZW1lbnQgZnJvbSBtb3ZlbWVudCBwb29sXG4gICAgICBpZiAodGhpcy5nby5kaWNlXzFfdXNlZCAmJiB0aGlzLmdvLmRpY2VfMl91c2VkKSB7XG4gICAgICAgIHRoaXMuZ28uZ2FtZV9zdGF0ZSA9IFwibmV4dF90dXJuXCJcbiAgICAgICAgdGhpcy5nby50b3RhbF9tb3ZlbWVudF9sZWZ0ID0gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNhbid0IHRoaXMuZ28udGhlcmVcIilcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGllY2VcbiIsImltcG9ydCB7IGlzX2NvbGxpZGluZyB9IGZyb20gXCIuLi90YXBldGVcIlxuaW1wb3J0IEhvdXNlIGZyb20gXCIuL2hvdXNlXCJcbmltcG9ydCBQaWVjZSBmcm9tIFwiLi9waWVjZVwiXG5cbmZ1bmN0aW9uIFBsYXllcihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5pZCA9IHRoaXMuZ28ucGxheWVycy5sZW5ndGhcbiAgdGhpcy5nby5wbGF5ZXJzLnB1c2godGhpcylcbiAgdGhpcy5ob3VzZSA9IG5ldyBIb3VzZSh0aGlzKVxuICB0aGlzLmN1cnJlbnRfc3F1YXJlID0gbnVsbFxuICB0aGlzLnBpZWNlcyA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgdGhpcy5waWVjZXMucHVzaChuZXcgUGllY2UodGhpcykpXG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5ob3VzZS5kcmF3KClcbiAgICB0aGlzLnBpZWNlcy5cbiAgICAgIGZpbHRlcigocGllY2UpID0+ICFwaWVjZS5zdGFja2VkKS5cbiAgICAgIGZvckVhY2goKHBpZWNlLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHBpZWNlLmF0X2hvbWUpIHtcbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gcGllY2UuY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDNcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKFxuICAgICAgICAgIHRoaXMuaG91c2UueCArICh0aGlzLmdvLmhvdXNlX3NpemUgLyA1KSArIChpbmRleCAqIDMwKSwgLy8geFxuICAgICAgICAgIHRoaXMuaG91c2UueSArICh0aGlzLmdvLmhvdXNlX3NpemUgLyAyKSwgLy8geVxuICAgICAgICAgIDE1LCAvLyByXG4gICAgICAgICAgMCwgLy8gc3RhcnRpbmcgYW5nbGVcbiAgICAgICAgICAyICogTWF0aC5QSSAvLyBlbmQgYW5nbGVcbiAgICAgICAgKVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsKClcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgICAgIH0gZWxzZSBpZiAocGllY2UuY3VycmVudF9ub2RlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHBpZWNlLmNvbG91clxuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSAzXG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyhwaWVjZS5jdXJyZW50X25vZGUueCArIHRoaXMuZ28uc3F1YXJlX3NpemUgLyAyLCBwaWVjZS5jdXJyZW50X25vZGUueSArIHRoaXMuZ28uc3F1YXJlX3NpemUgLyAyLCAxNSwgMCwgMiAqIE1hdGguUEkpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGwoKVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICAgICAgICBpZiAocGllY2Uuc3RhY2tlZF93aXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9IFwiMTJweCBzYW5zLXNlcmlmXCJcbiAgICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHBpZWNlLnN0YWNrZWRfd2l0aC5sZW5ndGggKyAxKVxuICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHBpZWNlLnN0YWNrZWRfd2l0aC5sZW5ndGggKyAxLCBwaWVjZS5jdXJyZW50X25vZGUueCArIHRoaXMuZ28uc3F1YXJlX3NpemUgLyAyIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgcGllY2UuY3VycmVudF9ub2RlLnkgKyAodGhpcy5nby5zcXVhcmVfc2l6ZSAvIDIpICsgKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnNwYXduX3BpZWNlID0gKCkgPT4ge1xuICAgIGxldCBwaWVjZXNfYXRfaG9tZSA9IHRoaXMucGllY2VzLmZpbHRlcigocGllY2UpID0+IHBpZWNlLmF0X2hvbWUpXG4gICAgaWYgKHBpZWNlc19hdF9ob21lLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBjb2xsaWRlZF9waWVjZSA9IHRoaXMuY2hlY2tfcGllY2VfY29sbGlzaW9uKHBpZWNlc19hdF9ob21lWzBdLCB0aGlzLmdvLnNxdWFyZXNbdGhpcy5ob3VzZS5zcGF3bl9pbmRleF0pWzBdXG4gICAgICBpZiAoY29sbGlkZWRfcGllY2UpIHtcbiAgICAgICAgaWYgKGNvbGxpZGVkX3BpZWNlLnBsYXllciA9PSBnby5jdXJyZW50X3BsYXllcikge1xuICAgICAgICAgIGNvbGxpZGVkX3BpZWNlLnN0YWNrZWRfd2l0aC5wdXNoKHBpZWNlc19hdF9ob21lWzBdKVxuICAgICAgICAgIHBpZWNlc19hdF9ob21lWzBdLnN0YWNrZWQgPSB0cnVlXG4gICAgICAgICAgcGllY2VzX2F0X2hvbWVbMF0uYXRfaG9tZSA9IGZhbHNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRnV0dXJlIEtpbGwgcGllY2UgYWxnb3JpdGhtXG4gICAgICAgICAgY29uc29sZS5sb2coXCJCQUNLIEhPTUUgQkFCRVwiKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaWVjZXNfYXRfaG9tZVswXS5zZXRfY3VycmVudF9ub2RlKHRoaXMuZ28uc3F1YXJlc1t0aGlzLmhvdXNlLnNwYXduX2luZGV4XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLmNoZWNrX3BpZWNlX2NvbGxpc2lvbiA9IChwaWVjZSwgc3F1YXJlKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuZ28ucGxheWVycy5yZWR1Y2UoKGNvbGxpZGluZ19waWVjZXMsIHBsYXllcikgPT4ge1xuICAgICAgbGV0IHRtcCA9IHBsYXllci5waWVjZXMuZmlsdGVyKChwaWVjZSkgPT4ge1xuICAgICAgICBsZXQgcGllY2VfcmVjdCA9IHsgLi4ucGllY2UsIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICAgICAgICBsZXQgc3F1YXJlX3JlY3QgPSB7IC4uLnNxdWFyZSwgd2lkdGg6IHNxdWFyZS5zaXplLCBoZWlnaHQ6IHNxdWFyZS5zaXplIH1cbiAgICAgICAgcmV0dXJuIGlzX2NvbGxpZGluZyhzcXVhcmVfcmVjdCwgcGllY2VfcmVjdClcbiAgICAgIH0pXG5cbiAgICAgcmV0dXJuICBjb2xsaWRpbmdfcGllY2VzLmNvbmNhdCh0bXApXG4gICAgfSwgW10pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyXG4iLCJjb25zdCBkaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBNYXRoLmFicyhNYXRoLmZsb29yKGEpIC0gTWF0aC5mbG9vcihiKSk7XG59XG5cbmNvbnN0IFZlY3RvcjIgPSB7XG4gIGRpc3RhbmNlOiAoYSwgYikgPT4gTWF0aC50cnVuYyhNYXRoLnNxcnQoTWF0aC5wb3coYi54IC0gYS54LCAyKSArIE1hdGgucG93KGIueSAtIGEueSwgMikpKVxufVxuXG5jb25zdCBpc19jb2xsaWRpbmcgPSBmdW5jdGlvbihzZWxmLCB0YXJnZXQpIHtcbiAgaWYgKFxuICAgIChzZWxmLnggPCB0YXJnZXQueCArIHRhcmdldC53aWR0aCkgJiZcbiAgICAoc2VsZi54ICsgc2VsZi53aWR0aCA+IHRhcmdldC54KSAmJlxuICAgIChzZWxmLnkgPCB0YXJnZXQueSArIHRhcmdldC5oZWlnaHQpICYmXG4gICAgKHNlbGYueSArIHNlbGYuaGVpZ2h0ID4gdGFyZ2V0LnkpXG4gICkge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSBmdW5jdGlvbiAoeCA9IDEwLCB5ID0gMTAsIHcgPSAyMCwgaCA9IDIwLCBjb2xvciA9IFwicmdiKDE5MCwgMjAsIDEwKVwiKSB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xufVxuXG5leHBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCBkcmF3X3NxdWFyZSwgVmVjdG9yMiB9XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHN0YXJ0X2dhbWUgfSBmcm9tIFwiLi9nYW1lXCJcblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNvbnN0IG1zcSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXBwXCIpXG4gIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PSBcIiMvbG9naW5cIikge1xuICAgIGZldGNoKCdsb2dpbi5odG1sJykudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJlc3BvbnNlLnRleHQoKS50aGVuKChodG1sKSA9PiB7XG4gICAgICAgIG1zcS5pbm5lckhUTUwgPSBodG1sXG4gICAgICB9KVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgZmV0Y2goJ2NhbnZhcy5odG1sJykudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJlc3BvbnNlLnRleHQoKS50aGVuKChodG1sKSA9PiB7XG4gICAgICAgIG1zcS5pbm5lckhUTUwgPSBodG1sXG4gICAgICAgIHN0YXJ0X2dhbWUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNvbnNvbGUubG9nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgc3RhcnQpXG4iXSwic291cmNlUm9vdCI6IiJ9