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
/*!****************************!*\
  !*** ./src/aliado/game.js ***!
  \****************************/
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
  go.house_size = house_size
  go.square_size = square_size
  go.canvas.height = 1200
  go.canvas.width = 1200
  go.board_height = 1000
  go.board_width = 1200
  go.players = []
  go.game_state = "uninitialized"
  go.current_movement_target = null
  go.current_piece_selected = null
  go.squares = squares

  menu = new _menu__WEBPACK_IMPORTED_MODULE_1__.default(go)

  player1 = new _player__WEBPACK_IMPORTED_MODULE_2__.default(go)
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


window.Aliado = {
  start_game: start_game
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9idXR0b24uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hbGlhZG8vZ2FtZV9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hbGlhZG8vaG91c2UuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hbGlhZG8vbWVudS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9waWVjZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FsaWFkby9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90YXBldGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYWxpYWRvL2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7O0FDVnJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7O0FDVHpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpRUFBZSxLQUFLOzs7Ozs7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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLE9BQU87QUFDeEI7QUFDQSxrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekIsa0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0Esa0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsa0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QixrQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCLGtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsa0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSx3QkFBd0IsV0FBVyxHQUFHLFdBQVc7QUFDakQ7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsUUFBUSxHQUFHLFFBQVE7QUFDL0QsdUJBQXVCLHFEQUFnQjtBQUN2QztBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6QixhQUFhLHFEQUFZO0FBQ3pCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRXFCO0FBQ3JCO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQnV0dG9uKGdvLCBkYXRhKSB7XG4gIHRoaXMuaWQgPSAgZGF0YS5pZFxuICB0aGlzLnRleHQgPSBkYXRhLnRleHRcbiAgdGhpcy54ID0gZGF0YS54XG4gIHRoaXMueSA9IGRhdGEueVxuICB0aGlzLndpZHRoID0gZGF0YS53aWR0aFxuICB0aGlzLmhlaWdodCA9IGRhdGEuaGVpZ2h0XG4gIHRoaXMucGVyZm9ybSA9IGRhdGEucGVyZm9ybVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b25cbiIsImZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpXG4gIHRoaXMuY2FudmFzX3JlY3QgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNyZWVwcyA9IFtdXG4gIHRoaXMucGxheWVycyA9IFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVPYmplY3RcbiIsImNvbnN0IEhPVVNFX1BPU0lUSU9OUyA9IFtcbiAgLy8geCwgeSwgY29sb3VyLCBpbmRleF9vZl9zcGF3blxuICBbMTAsIDEwLCBcInJlZFwiLCAwXSxcbiAgWzEwLCA4MTAsIFwicHVycGxlXCIsIDE4XSxcbiAgWzgxMCwgODEwLCBcImdyZWVuXCIsIDM2XSxcbiAgWzgxMCwgMTAsIFwid2hpdGVcIiwgNTRdLFxuXVxuXG5mdW5jdGlvbiBIb3VzZShwbGF5ZXIpIHtcbiAgdGhpcy5nbyA9IHBsYXllci5nb1xuICB0aGlzLnBsYXllciA9IHBsYXllclxuXG4gIHRoaXMueCA9IEhPVVNFX1BPU0lUSU9OU1twbGF5ZXIuaWRdWzBdXG4gIHRoaXMueSA9IEhPVVNFX1BPU0lUSU9OU1twbGF5ZXIuaWRdWzFdXG4gIHRoaXMuY29sb3VyID0gSE9VU0VfUE9TSVRJT05TW3BsYXllci5pZF1bMl1cbiAgdGhpcy5zcGF3bl9pbmRleCA9IEhPVVNFX1BPU0lUSU9OU1twbGF5ZXIuaWRdWzNdXG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy5nby5ob3VzZV9zaXplLCB0aGlzLmdvLmhvdXNlX3NpemUpXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMuZ28uaG91c2Vfc2l6ZSwgdGhpcy5nby5ob3VzZV9zaXplKVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSG91c2VcbiIsImltcG9ydCB7IGlzX2NvbGxpZGluZyB9IGZyb20gXCIuLi90YXBldGVcIlxuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9idXR0b25cIlxuXG5mdW5jdGlvbiBNZW51KGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLm1lbnUgPSB0aGlzXG4gIHRoaXMuZGljZV8xID0gbnVsbFxuICB0aGlzLmRpY2VfMiA9IG51bGxcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5idXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QoYnV0dG9uLngsIGJ1dHRvbi55ICsgNSwgMTQ1LCA0NSlcbiAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicHVycGxlXCJcbiAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgMTUwLCA1MClcbiAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcInNhbnMtc2VyaWZcIlxuICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChidXR0b24udGV4dClcbiAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24ud2lkdGggLyAyKSAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIGJ1dHRvbi55ICsgMTAgKyAoYnV0dG9uLmhlaWdodCAvIDIpIC0gNSlcbiAgICB9KVxuXG4gICAgdGhpcy5kcmF3X2RpY2UoKVxuICAgIHRoaXMuZHJhd19jdXJyZW50X3BsYXllcigpXG4gIH1cblxuICB0aGlzLmRyYXdfY3VycmVudF9wbGF5ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMTAsIDk3NSwgMjUwLCAzMClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChgQ3VycmVudCBwbGF5ZXI6ICR7dGhpcy5nby5jdXJyZW50X3BsYXllci5ob3VzZS5jb2xvdXJ9YCwgMTAsIDk5NSlcbiAgfVxuXG4gIHRoaXMuZHJhd19kaWNlID0gKCkgPT4ge1xuICAgIC8vIGQxXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KDE3MCwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSwgNDAsIDQ1KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDE3MCwgdGhpcy5nby5ib2FyZF9oZWlnaHQgKyAxNSwgNDAsIDQ1KVxuICAgIGlmIChnby5kaWNlXzFfdXNlZCkge1xuICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNilcIlxuICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMTcwLCB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDE1LCA0MCwgNDUpXG4gICAgfVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyMXB4IHNhbnMtc2VyaWZcIlxuICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQoZ28uZGljZV8xIHx8IFwiLVwiKVxuICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGdvLmRpY2VfMSB8fCBcIi1cIiwgMTcwICsgMjAgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDE1ICsgMzApXG4gICAgLy8gZDJcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QoMjMwLCB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDE1LCA0MCwgNDUpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMjMwLCB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDE1LCA0MCwgNDUpXG4gICAgaWYgKGdvLmRpY2VfMl91c2VkKSB7XG4gICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC42KVwiXG4gICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgyMzAsIHRoaXMuZ28uYm9hcmRfaGVpZ2h0ICsgMTUsIDQwLCA0NSlcbiAgICB9XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgdmFyIHRleHRfZGljZV8yID0gZ28uZGljZV8yIHx8IFwiLVwiXG4gICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0X2RpY2VfMilcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0X2RpY2VfMiwgMjMwICsgMjAgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLmdvLmJvYXJkX2hlaWdodCArIDE1ICsgMzApXG4gIH1cblxuICAvLyBUT0RPOiBpbnZlc3RpZ2F0ZSB3aHkgY2FudmFzX3JlY3Qgd2lkdGggd29ya3MgaGVyZS4uLlxuICB0aGlzLm9uX2NsaWNrX21lbnVfYnV0dG9uID0gKGV2KSA9PiB7XG4gICAgbGV0IGNvbGxpc2lvbl9jbGljayA9IHsgeDogZXYuY2xpZW50WCwgeTogZXYuY2xpZW50WSwgd2lkdGg6IDEsIGhlaWdodDogMSB9XG4gICAgaWYgKGV2LmNsaWVudFkgPiB0aGlzLmdvLmJvYXJkX2hlaWdodCkge1xuICAgICAgdGhpcy5idXR0b25zLmZpbmQoKGJ1dHRvbikgPT4ge1xuICAgICAgICBpZiAoaXNfY29sbGlkaW5nKGJ1dHRvbiwgeyB4OiBldi5jbGllbnRYLCB5OiBldi5jbGllbnRZLCB3aWR0aDogMSwgaGVpZ2h0OiAxfSkpIHtcbiAgICAgICAgICBidXR0b24ucGVyZm9ybSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdGhpcy5ob3VzZV9sZWF2aW5nX2NvbWJvcyA9IFtcbiAgICBbNiwgNl1cbiAgXVxuXG4gIHRoaXMuZGljZV9jb21ib19sZWF2ZXNfdGhlX2hvdXNlID0gKCkgPT4ge1xuICAgIGxldCBkaWNlX2NvbWJvX2xlYXZlc190aGVfaG91c2UgPSB0aGlzLmhvdXNlX2xlYXZpbmdfY29tYm9zLnNvbWUoKGNvbWJvKSA9PiB7XG4gICAgICByZXR1cm4gKChnby5kaWNlXzEgPT0gY29tYm9bMF0pICYmIChnby5kaWNlXzIgPT0gY29tYm9bMV0pKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnJvbGxfZGljZSA9ICgpID0+IHtcbiAgICBnby5kaWNlXzEgPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiA2KSArIDFcbiAgICBnby5kaWNlXzIgPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiA2KSArIDFcbiAgICBnby5kaWNlXzFfdXNlZCA9IGZhbHNlXG4gICAgZ28uZGljZV8yX3VzZWQgPSBmYWxzZVxuICAgIGdvLnRvdGFsX21vdmVtZW50X2xlZnQgPSBnby5kaWNlXzEgKyBnby5kaWNlXzJcblxuICAgIGNvbnNvbGUubG9nKGAke2dvLmRpY2VfMX0sICR7Z28uZGljZV8yfWApXG5cbiAgICAvLyBPbmx5IHNwZW5kIHRoZSA2IGlmIHRoZXJlIGFyZSBwaWVjZXMgYXQgaG9tZVxuICAgIGxldCBhbGxfcGllY2VzX2F0X2hvbWUgPSBnby5jdXJyZW50X3BsYXllci5waWVjZXMuZXZlcnkoKHBpZWNlKSA9PiBwaWVjZS5hdF9ob21lKVxuICAgIGlmIChhbGxfcGllY2VzX2F0X2hvbWUgJiYgIXRoaXMuZGljZV9jb21ib19sZWF2ZXNfdGhlX2hvdXNlKCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibmV4dF90dXJuXCIpXG4gICAgICBnby5nYW1lX3N0YXRlID0gXCJuZXh0X3R1cm5cIlxuICAgIH1cbiAgICBpZiAoKGdvLmRpY2VfMSA9PSA2KSAmJiAoZ28uY3VycmVudF9wbGF5ZXIucGllY2VzLnNvbWUoKHBpZWNlKSA9PiBwaWVjZS5hdF9ob21lKSkpIHtcbiAgICAgIGdvLmRpY2VfMV91c2VkID0gdHJ1ZVxuICAgICAgZ28udG90YWxfbW92ZW1lbnRfbGVmdCAtPSBnby5kaWNlXzFcbiAgICAgIGdvLmN1cnJlbnRfcGxheWVyLnNwYXduX3BpZWNlKClcbiAgICAgIGNvbnNvbGUubG9nKGAke2dvLmRpY2VfMX0gdXNlZGApXG4gICAgfVxuXG4gICAgLy8gT25seSBzcGVuZCB0aGUgNiBpZiB0aGVyZSBhcmUgcGllY2VzIGF0IGhvbWVcbiAgICBpZiAoKGdvLmRpY2VfMiA9PSA2KSAmJiAoZ28uY3VycmVudF9wbGF5ZXIucGllY2VzLnNvbWUoKHBpZWNlKSA9PiBwaWVjZS5hdF9ob21lKSkpIHtcbiAgICAgIGdvLmRpY2VfMl91c2VkID0gdHJ1ZVxuICAgICAgZ28udG90YWxfbW92ZW1lbnRfbGVmdCAtPSBnby5kaWNlXzJcbiAgICAgIGdvLmN1cnJlbnRfcGxheWVyLnNwYXduX3BpZWNlKClcbiAgICAgIGNvbnNvbGUubG9nKGAke2dvLmRpY2VfMn0gdXNlZGApXG4gICAgfVxuXG4gICAgLy8gQ2FuIHRoZSBwbGFleWVyIGRvIGFueXRoaW5nP1xuICAgIGxldCBtb3ZhYmxlX3BpZWNlcyA9IHRoaXMuZ28uY3VycmVudF9wbGF5ZXIucGllY2VzLmZpbHRlcigocGllY2UpID0+IHBpZWNlLmN1cnJlbnRfbm9kZSAhPSBudWxsKVxuICAgIGlmIChtb3ZhYmxlX3BpZWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICBnby5nYW1lX3N0YXRlID0gXCJhd2FpdGluZ19wbGF5ZXJfbW92ZW1lbnRcIlxuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE87IFdlIG5lZWQgdG8gYWRkIGhlcmUgdGhlIGlkZWEgb2YgbWFya2luZyB3aGljaCBkaWNlIGhhcyBiZWVuIHVzZWRcbiAgLy8gQ3VycmVudGx5LCBpdCdzIGFsbCBtaXhlZCB1bmRlciB0b3RhbF9tb3ZlbWVudFxuICB0aGlzLm1vdmUgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdXJyZW50X3BpZWNlX3NlbGVjdGVkLm1vdmUoKVxuICB9XG5cbiAgdGhpcy5idXR0b25zID0gW11cbiAgdGhpcy5idXR0b25zLnB1c2gobmV3IEJ1dHRvbihcbiAgICBnbyxcbiAgICB7XG4gICAgICBpZDogXCJyb2xsX2RpY2VcIixcbiAgICAgIHRleHQ6IFwiUm9sbCB0aGUgZGllXCIsXG4gICAgICB4OiAxMCxcbiAgICAgIHk6IHRoaXMuZ28uYm9hcmRfaGVpZ2h0ICsgMTAsXG4gICAgICB3aWR0aDogMTUwLFxuICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgIHBlcmZvcm06IHRoaXMucm9sbF9kaWNlXG4gICAgfSkpXG4gIHRoaXMuYnV0dG9ucy5wdXNoKG5ldyBCdXR0b24oXG4gICAgZ28sXG4gICAge1xuICAgICAgaWQ6IFwibW92ZVwiLFxuICAgICAgdGV4dDogXCJNb3ZlXCIsXG4gICAgICB4OiAxMCxcbiAgICAgIHk6IHRoaXMuZ28uYm9hcmRfaGVpZ2h0ICsgNzAsXG4gICAgICB3aWR0aDogMTUwLFxuICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgIHBlcmZvcm06IHRoaXMubW92ZVxuICAgIH0pKVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51XG4iLCIvLyBBYnN0cmFjdHMgZWFjaCBpbmRpdmlkdWFsIHBpZWNlIGluIHRoZSBib2FyZFxuLy9cbi8vIFN0YWNraW5nXG4vL1xuLy8gQSBQaWVjZSBjYW4gYmUgc3RhY2tlZCBvbiBhbm90aGVyLiBUaGlzIG1lYW5zIHRoYXQgdGhleSBhcmUgb25cbi8vIHRvcCBvZiBlYWNoIG90aGVyLCBhbmQgbW92ZSB0b2dldGhlci4gVGhleSBjYW4gb25seSBiZSBzZXBhcmF0ZWRcbi8vIHRocm91Z2ggZGVhdGggLSBnb2luZyBiYWNrIGhvbWUuXG4vL1xuLy8gVG8gc3RhY2sgUGllY2VzLCBzaW1wbHkgbW92ZSBvbmUgb24gdG9wIG9mIHRoZSBvdGhlciBiZWxvbmdpbmcgdG8gdGhlXG4vLyBzYW1lIFBsYXllci4gVGhlIG1vdmluZyBwaWVjZSBpcyB0aGVuIHN0YWNrZWQgd2l0aCB0aGUgb25lIGl0IG1vdmVkIGludG8uXG4vLyBcbi8vIEluIHRoZSBtb2RlbCwgdGhpcyBtZWFucyB0aGF0IG9ubHkgb2YgdGhlIFBpZWNlcyBpcyBkcmF3biBvbiB0aGUgQm9hcmQ6XG4vLyB0aGUgUGllY2UgdGhhdCB3YXMgYWxyZWFkeSB0aGVyZS4gQWxsIHRoZSBvbmVzIHdobyBtb3ZlIGludG8gaXQsIGFyZVxuLy8gbGlzdGVkIG9uIHRoZSBjb2xsaWRlZCBvbmUncyBgc3RhY2tlZF93aXRoYCBmaWVsZDsgYW5kIGZsYWcgdGhlbXNlbHZlc1xuLy8gYXMgYHN0YWNrZWQgPSB0cnVlYCAod2hpY2ggc2lnbmFscyB0aGUgZHJhd2luZyB0aGF0IGl0IHNob3VsZG4ndCBiZSBkcmF3bilcbmZ1bmN0aW9uIFBpZWNlKHBsYXllcikge1xuICB0aGlzLmdvID0gcGxheWVyLmdvXG4gIHRoaXMucGxheWVyID0gcGxheWVyXG4gIHRoaXMuYXRfaG9tZSA9IHRydWVcbiAgdGhpcy5jdXJyZW50X25vZGUgPSBudWxsXG4gIHRoaXMuZGVmYXVsdF9jb2xvdXIgPSBwbGF5ZXIuaG91c2UuY29sb3VyXG4gIHRoaXMuY29sb3VyID0gcGxheWVyLmhvdXNlLmNvbG91clxuICB0aGlzLnggPSBudWxsXG4gIHRoaXMueSA9IG51bGxcbiAgLy8gVGhlIHBpZWNlcyB0aGF0IGFyZSBzdGFja2VkIGFsb25nIHdpdGggdGhpcyBvbmVcbiAgdGhpcy5zdGFja2VkX3dpdGggPSBbXVxuICB0aGlzLnN0YWNrZWQgPSBmYWxzZVxuICB0aGlzLnNldF9jdXJyZW50X25vZGUgPSAobm9kZSkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9ub2RlID0gbm9kZVxuICAgIHRoaXMueCA9IHRoaXMuY3VycmVudF9ub2RlLnggKyB0aGlzLnBsYXllci5nby5zcXVhcmVfc2l6ZSAvIDJcbiAgICB0aGlzLnkgPSB0aGlzLmN1cnJlbnRfbm9kZS55ICsgdGhpcy5wbGF5ZXIuZ28uc3F1YXJlX3NpemUgLyAyXG4gICAgdGhpcy5hdF9ob21lID0gZmFsc2VcbiAgfVxuXG4gIHRoaXMubW92ZSA9ICgpID0+IHtcbiAgICAvLyBJcyB0aGUgbW92ZW1lbnQgbGVmdCBlbm91Z2ggdG8gZXhhY3RseSByZWFjaCB0aGlzIHNxdWFyZT9cbiAgICBsZXQgbmV4dCA9IHRoaXMuY3VycmVudF9ub2RlXG4gICAgbGV0IGRvZXNfaXRfcmVhY2hfd2l0aF9kMSA9IGZhbHNlXG4gICAgbGV0IGRvZXNfaXRfcmVhY2hfd2l0aF9kMiA9IGZhbHNlXG5cbiAgICBpZiAoKHRoaXMuZ28uZGljZV8xID09IDYpIHx8ICh0aGlzLmdvLmRpY2VfMiA9PSA2KSkge1xuICAgICAgaWYgKCF0aGlzLmdvLmRpY2VfMV91c2VkKSB7XG4gICAgICAgIEFycmF5LmZyb20oQXJyYXkodGhpcy5nby5kaWNlXzEpKS5mb3JFYWNoKChpKSA9PiB7XG4gICAgICAgICAgbmV4dCA9IG5leHQuY29ubmVjdGVkWzBdXG4gICAgICAgIH0pXG4gICAgICAgIGRvZXNfaXRfcmVhY2hfd2l0aF9kMSA9IChuZXh0ID09IHRoaXMuZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5nby5kaWNlXzJfdXNlZCAmJiAhZG9lc19pdF9yZWFjaF93aXRoX2QxKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmN1cnJlbnRfbm9kZVxuICAgICAgICBBcnJheS5mcm9tKEFycmF5KHRoaXMuZ28uZGljZV8yKSkuZm9yRWFjaCgoaSkgPT4ge1xuICAgICAgICAgIG5leHQgPSBuZXh0LmNvbm5lY3RlZFswXVxuICAgICAgICB9KVxuICAgICAgICBkb2VzX2l0X3JlYWNoX3dpdGhfZDIgPSAobmV4dCA9PSB0aGlzLmdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWRvZXNfaXRfcmVhY2hfd2l0aF9kMSAmJiAhZG9lc19pdF9yZWFjaF93aXRoX2QyKSB7XG4gICAgICBuZXh0ID0gdGhpcy5jdXJyZW50X25vZGVcbiAgICAgIEFycmF5LmZyb20oQXJyYXkodGhpcy5nby50b3RhbF9tb3ZlbWVudF9sZWZ0KSkuZm9yRWFjaCgoaSkgPT4ge1xuICAgICAgICBuZXh0ID0gbmV4dC5jb25uZWN0ZWRbMF1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGVuZCByZXN1bHQgbWF0Y2hlcyB3aXRoIHRoZSBjbGlja2VkIHRhcmdldCwgbGV0J3MgZ29cbiAgICBpZiAobmV4dCA9PSB0aGlzLmdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KSB7XG4gICAgICBpZiAoZG9lc19pdF9yZWFjaF93aXRoX2QxKSB7XG4gICAgICAgIHRoaXMuZ28uZGljZV8xX3VzZWQgPSB0cnVlXG4gICAgICAgIHRoaXMuZ28udG90YWxfbW92ZW1lbnRfbGVmdCAtPSB0aGlzLmdvLmRpY2VfMV91c2VkXG4gICAgICB9XG4gICAgICBpZiAoZG9lc19pdF9yZWFjaF93aXRoX2QyKSB7XG4gICAgICAgIHRoaXMuZ28uZGljZV8yX3VzZWQgPSB0cnVlXG4gICAgICAgIHRoaXMuZ28udG90YWxfbW92ZW1lbnRfbGVmdCAtPSB0aGlzLmdvLmRpY2VfMl91c2VkXG4gICAgICB9XG4gICAgICAvLyBDaGVja2luZyBpZiB0aGVyZSBpcyBhbHJlYWR5IG9uZSBvZiBvdXJcbiAgICAgIGxldCBjb2xsaWRlZF9waWVjZSA9IG51bGxcbiAgICAgIHRoaXMuZ28ucGxheWVycy5maW5kKChwbGF5ZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHBsYXllci5waWVjZXMuZmluZCgocGllY2UpID0+IHtcbiAgICAgICAgICBpZiAoIXBpZWNlLmF0X2hvbWUgJiYgIXBpZWNlLnN0YWNrZWQgJiYgcGllY2UuY3VycmVudF9ub2RlID09IG5leHQpIHtcbiAgICAgICAgICAgIGNvbGxpZGVkX3BpZWNlID0gcGllY2VcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIClcblxuICAgICAgaWYgKGNvbGxpZGVkX3BpZWNlKSB7XG4gICAgICAgIGNvbGxpZGVkX3BpZWNlLnN0YWNrZWRfd2l0aC5wdXNoKHRoaXMpXG4gICAgICAgIGxldCBzdGFja2VkX3BpZWNlID0gbnVsbFxuICAgICAgICB3aGlsZShzdGFja2VkX3BpZWNlID0gdGhpcy5zdGFja2VkX3dpdGgucG9wKCkpIHtcbiAgICAgICAgICBjb2xsaWRlZF9waWVjZS5zdGFja2VkX3dpdGgucHVzaChzdGFja2VkX3BpZWNlKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhY2tlZCA9IHRydWVcbiAgICAgICAgdGhpcy5hdF9ob21lID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X25vZGUgPSBudWxsIC8vIFdvcmtzP1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2hhbmdpbmcgcGxhY2UgYW5kIHJlc2V0aW5nIGZvcm1lciBwbGFjZSdzIGRlZmF1bHQgdW5zZWxlY3RlZCBjb2xvdXJcbiAgICAgICAgdGhpcy5zZXRfY3VycmVudF9ub2RlKG5leHQpXG4gICAgICB9XG4gICAgICAvLyBVbnNlbGVjdCBwaWVjZVxuICAgICAgdGhpcy5jb2xvdXIgPSB0aGlzLmRlZmF1bHRfY29sb3VyXG4gICAgICB0aGlzLmdvLmN1cnJlbnRfcGllY2Vfc2VsZWN0ZWQgPSBudWxsXG4gICAgICB0aGlzLmdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0LmNvbG91ciA9IHRoaXMuZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQuZGVmYXVsdF9jb2xvdXJcbiAgICAgIHRoaXMuZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBudWxsXG5cbiAgICAgIC8vIFJlbW92ZSBtb3ZlbWVudCBmcm9tIG1vdmVtZW50IHBvb2xcbiAgICAgIGlmICh0aGlzLmdvLmRpY2VfMV91c2VkICYmIHRoaXMuZ28uZGljZV8yX3VzZWQpIHtcbiAgICAgICAgdGhpcy5nby5nYW1lX3N0YXRlID0gXCJuZXh0X3R1cm5cIlxuICAgICAgICB0aGlzLmdvLnRvdGFsX21vdmVtZW50X2xlZnQgPSBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2FuJ3QgdGhpcy5nby50aGVyZVwiKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaWVjZVxuIiwiaW1wb3J0IHsgaXNfY29sbGlkaW5nIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5pbXBvcnQgSG91c2UgZnJvbSBcIi4vaG91c2VcIlxuaW1wb3J0IFBpZWNlIGZyb20gXCIuL3BpZWNlXCJcblxuZnVuY3Rpb24gUGxheWVyKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmlkID0gdGhpcy5nby5wbGF5ZXJzLmxlbmd0aFxuICB0aGlzLmdvLnBsYXllcnMucHVzaCh0aGlzKVxuICB0aGlzLmhvdXNlID0gbmV3IEhvdXNlKHRoaXMpXG4gIHRoaXMuY3VycmVudF9zcXVhcmUgPSBudWxsXG4gIHRoaXMucGllY2VzID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICB0aGlzLnBpZWNlcy5wdXNoKG5ldyBQaWVjZSh0aGlzKSlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmhvdXNlLmRyYXcoKVxuICAgIHRoaXMucGllY2VzLlxuICAgICAgZmlsdGVyKChwaWVjZSkgPT4gIXBpZWNlLnN0YWNrZWQpLlxuICAgICAgZm9yRWFjaCgocGllY2UsIGluZGV4KSA9PiB7XG4gICAgICBpZiAocGllY2UuYXRfaG9tZSkge1xuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBwaWVjZS5jb2xvdXJcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gM1xuICAgICAgICB0aGlzLmdvLmN0eC5hcmMoXG4gICAgICAgICAgdGhpcy5ob3VzZS54ICsgKHRoaXMuZ28uaG91c2Vfc2l6ZSAvIDUpICsgKGluZGV4ICogMzApLCAvLyB4XG4gICAgICAgICAgdGhpcy5ob3VzZS55ICsgKHRoaXMuZ28uaG91c2Vfc2l6ZSAvIDIpLCAvLyB5XG4gICAgICAgICAgMTUsIC8vIHJcbiAgICAgICAgICAwLCAvLyBzdGFydGluZyBhbmdsZVxuICAgICAgICAgIDIgKiBNYXRoLlBJIC8vIGVuZCBhbmdsZVxuICAgICAgICApXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGwoKVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICAgICAgfSBlbHNlIGlmIChwaWVjZS5jdXJyZW50X25vZGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gcGllY2UuY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDNcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKHBpZWNlLmN1cnJlbnRfbm9kZS54ICsgdGhpcy5nby5zcXVhcmVfc2l6ZSAvIDIsIHBpZWNlLmN1cnJlbnRfbm9kZS55ICsgdGhpcy5nby5zcXVhcmVfc2l6ZSAvIDIsIDE1LCAwLCAyICogTWF0aC5QSSlcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbCgpXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gICAgICAgIGlmIChwaWVjZS5zdGFja2VkX3dpdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIxMnB4IHNhbnMtc2VyaWZcIlxuICAgICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQocGllY2Uuc3RhY2tlZF93aXRoLmxlbmd0aCArIDEpXG4gICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQocGllY2Uuc3RhY2tlZF93aXRoLmxlbmd0aCArIDEsIHBpZWNlLmN1cnJlbnRfbm9kZS54ICsgdGhpcy5nby5zcXVhcmVfc2l6ZSAvIDIgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCBwaWVjZS5jdXJyZW50X25vZGUueSArICh0aGlzLmdvLnNxdWFyZV9zaXplIC8gMikgKyAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHRoaXMuc3Bhd25fcGllY2UgPSAoKSA9PiB7XG4gICAgbGV0IHBpZWNlc19hdF9ob21lID0gdGhpcy5waWVjZXMuZmlsdGVyKChwaWVjZSkgPT4gcGllY2UuYXRfaG9tZSlcbiAgICBpZiAocGllY2VzX2F0X2hvbWUubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGNvbGxpZGVkX3BpZWNlID0gdGhpcy5jaGVja19waWVjZV9jb2xsaXNpb24ocGllY2VzX2F0X2hvbWVbMF0sIHRoaXMuZ28uc3F1YXJlc1t0aGlzLmhvdXNlLnNwYXduX2luZGV4XSlbMF1cbiAgICAgIGlmIChjb2xsaWRlZF9waWVjZSkge1xuICAgICAgICBpZiAoY29sbGlkZWRfcGllY2UucGxheWVyID09IGdvLmN1cnJlbnRfcGxheWVyKSB7XG4gICAgICAgICAgY29sbGlkZWRfcGllY2Uuc3RhY2tlZF93aXRoLnB1c2gocGllY2VzX2F0X2hvbWVbMF0pXG4gICAgICAgICAgcGllY2VzX2F0X2hvbWVbMF0uc3RhY2tlZCA9IHRydWVcbiAgICAgICAgICBwaWVjZXNfYXRfaG9tZVswXS5hdF9ob21lID0gZmFsc2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBGdXR1cmUgS2lsbCBwaWVjZSBhbGdvcml0aG1cbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkJBQ0sgSE9NRSBCQUJFXCIpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpZWNlc19hdF9ob21lWzBdLnNldF9jdXJyZW50X25vZGUodGhpcy5nby5zcXVhcmVzW3RoaXMuaG91c2Uuc3Bhd25faW5kZXhdKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2hlY2tfcGllY2VfY29sbGlzaW9uID0gKHBpZWNlLCBzcXVhcmUpID0+IHtcbiAgICByZXR1cm4gdGhpcy5nby5wbGF5ZXJzLnJlZHVjZSgoY29sbGlkaW5nX3BpZWNlcywgcGxheWVyKSA9PiB7XG4gICAgICBsZXQgdG1wID0gcGxheWVyLnBpZWNlcy5maWx0ZXIoKHBpZWNlKSA9PiB7XG4gICAgICAgIGxldCBwaWVjZV9yZWN0ID0geyAuLi5waWVjZSwgd2lkdGg6IDEsIGhlaWdodDogMSB9XG4gICAgICAgIGxldCBzcXVhcmVfcmVjdCA9IHsgLi4uc3F1YXJlLCB3aWR0aDogc3F1YXJlLnNpemUsIGhlaWdodDogc3F1YXJlLnNpemUgfVxuICAgICAgICByZXR1cm4gaXNfY29sbGlkaW5nKHNxdWFyZV9yZWN0LCBwaWVjZV9yZWN0KVxuICAgICAgfSlcblxuICAgICByZXR1cm4gIGNvbGxpZGluZ19waWVjZXMuY29uY2F0KHRtcClcbiAgICB9LCBbXSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJcbiIsImNvbnN0IGRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKE1hdGguZmxvb3IoYSkgLSBNYXRoLmZsb29yKGIpKTtcbn1cblxuY29uc3QgVmVjdG9yMiA9IHtcbiAgZGlzdGFuY2U6IChhLCBiKSA9PiBNYXRoLnRydW5jKE1hdGguc3FydChNYXRoLnBvdyhiLnggLSBhLngsIDIpICsgTWF0aC5wb3coYi55IC0gYS55LCAyKSkpXG59XG5cbmNvbnN0IGlzX2NvbGxpZGluZyA9IGZ1bmN0aW9uKHNlbGYsIHRhcmdldCkge1xuICBpZiAoXG4gICAgKHNlbGYueCA8IHRhcmdldC54ICsgdGFyZ2V0LndpZHRoKSAmJlxuICAgIChzZWxmLnggKyBzZWxmLndpZHRoID4gdGFyZ2V0LngpICYmXG4gICAgKHNlbGYueSA8IHRhcmdldC55ICsgdGFyZ2V0LmhlaWdodCkgJiZcbiAgICAoc2VsZi55ICsgc2VsZi5oZWlnaHQgPiB0YXJnZXQueSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBkcmF3X3NxdWFyZSA9IGZ1bmN0aW9uICh4ID0gMTAsIHkgPSAxMCwgdyA9IDIwLCBoID0gMjAsIGNvbG9yID0gXCJyZ2IoMTkwLCAyMCwgMTApXCIpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICBjdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyIH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3RcIlxuaW1wb3J0IE1lbnUgZnJvbSBcIi4vbWVudVwiXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiXG5pbXBvcnQgeyBWZWN0b3IyLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuY29uc3QgaG91c2Vfc2l6ZSA9IDE1MFxuY29uc3Qgc3F1YXJlX3NpemUgPSA1MFxuY29uc3Qgc3RhcnRpbmdfcG9pbnQgPSB7IHg6IDEwLCB5OiBob3VzZV9zaXplICsgMTAgfVxuY29uc3QgY29sb3VycyA9IFtcImJsdWVcIiwgXCJwdXJwbGVcIiwgXCJ3aGl0ZVwiLCBcInllbGxvd1wiLCBcInJlZFwiLCBcImdyZWVuXCJdXG5jb25zdCBzcXVhcmVzID0gW11cblxubGV0IGdvID0gbnVsbFxubGV0IG1lbnUgPSBudWxsXG5sZXQgcGxheWVyMSA9IG51bGxcblxuY29uc3QgRlBTID0gMzMuMzNcblxuY29uc3Qgc3RhcnRfZ2FtZSA9ICgpID0+IHtcbiAgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG4gIGdvLmhvdXNlX3NpemUgPSBob3VzZV9zaXplXG4gIGdvLnNxdWFyZV9zaXplID0gc3F1YXJlX3NpemVcbiAgZ28uY2FudmFzLmhlaWdodCA9IDEyMDBcbiAgZ28uY2FudmFzLndpZHRoID0gMTIwMFxuICBnby5ib2FyZF9oZWlnaHQgPSAxMDAwXG4gIGdvLmJvYXJkX3dpZHRoID0gMTIwMFxuICBnby5wbGF5ZXJzID0gW11cbiAgZ28uZ2FtZV9zdGF0ZSA9IFwidW5pbml0aWFsaXplZFwiXG4gIGdvLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICBnby5jdXJyZW50X3BpZWNlX3NlbGVjdGVkID0gbnVsbFxuICBnby5zcXVhcmVzID0gc3F1YXJlc1xuXG4gIG1lbnUgPSBuZXcgTWVudShnbylcblxuICBwbGF5ZXIxID0gbmV3IFBsYXllcihnbylcbiAgZ28uY3VycmVudF9wbGF5ZXIgPSBwbGF5ZXIxXG5cbiAgZ2FtZV9tb2RlX2NhbGxiYWNrcy5wdXNoKG1lbnUub25fY2xpY2tfbWVudV9idXR0b24pXG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25fY2xpY2ssIGZhbHNlKTtcblxuICBjcmVhdGVfYm9hcmQoKVxuICB0ZW1wX2xpbmtfc3F1YXJlcygpIC8vIFdlJ3JlIGJydXRlLWZvcmNlIGxpbmtpbmcgdGhlIHNxdWFyZXMgd2hpbGUgd2UgZG9uJ3Qgc3RvcmUgaXRcblxuICBzZXRUaW1lb3V0KGdhbWVfbG9vcCwgRlBTKVxufVxuXG5jb25zdCBuZXh0X3R1cm4gPSAoKSA9PiB7XG4gIGxldCBjdXJyZW50X3BsYXllcl9pZCA9IGdvLmN1cnJlbnRfcGxheWVyLmlkXG4gIGdvLmN1cnJlbnRfcGxheWVyID0gZ28ucGxheWVyc1soY3VycmVudF9wbGF5ZXJfaWQgKyAxKSAlIGdvLnBsYXllcnMubGVuZ3RoXVxufVxuXG5jb25zdCBkcmF3X2hvdXNlID0gKHgsIHksIGNvbG91cikgPT4ge1xuICBnby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgZ28uY3R4LmxpbmVXaWR0aCA9IDVcbiAgZ28uY3R4LmZpbGxTdHlsZSA9IGNvbG91clxuICBnby5jdHguc3Ryb2tlUmVjdCh4LCB5LCBob3VzZV9zaXplLCBob3VzZV9zaXplKVxuICBnby5jdHguZmlsbFJlY3QoeCwgeSwgaG91c2Vfc2l6ZSwgaG91c2Vfc2l6ZSlcbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSAoeCwgeSwgdywgaCwgY29sb3VyKSA9PiB7XG4gIGdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICBnby5jdHgubGluZVdpZHRoID0gNVxuICBnby5jdHguZmlsbFN0eWxlID0gY29sb3VyXG4gIGdvLmN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKVxuICBnby5jdHguc3Ryb2tlUmVjdCh4LCB5LCB3LCBoKVxufVxuXG5jb25zdCBjcmVhdGVfYm9hcmQgPSAoKSA9PiB7XG4gIC8vIGxlZnQgb3V0dGVyIGxhbmVcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiAxMCxcbiAgICAgIHk6IHN0YXJ0aW5nX3BvaW50LnkgKyAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzW2kgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1tpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cbiAgLy8gbGVmdC1ib3R0b20gb3V0dGVyIGludGVybWlzc2lvblxuICB2YXIgbGVmdF9ib3R0b21faW5pdF9wb3N0ID0ge1xuICAgIHg6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS54ICsgc3F1YXJlX3NpemUsXG4gICAgeTogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnlcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogbGVmdF9ib3R0b21faW5pdF9wb3N0LnggKyAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHk6IGxlZnRfYm90dG9tX2luaXRfcG9zdC55LFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbKGkgKyAxKSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgdmFyIHlfb2Zmc2V0ID0gMFxuICAgIGxldCBzcXVhcmUgPSB7IFxuICAgICAgeDogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLngsXG4gICAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSArIChpICsgMSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgNCkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDQpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cbiAgLy8gYm90dG9tIG91dHRlciBsYW5lXG4gIHZhciBib3R0b21fb3V0dGVyX2luaXRfcG9zID0ge1xuICAgIHg6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS54LFxuICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55ICsgc3F1YXJlX3NpemVcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IDEzOyBpKyspIHtcbiAgICBsZXQgc3F1YXJlID0geyBcbiAgICAgIHg6IGJvdHRvbV9vdXR0ZXJfaW5pdF9wb3MueCArIChpICogc3F1YXJlX3NpemUpLFxuICAgICAgeTogYm90dG9tX291dHRlcl9pbml0X3Bvcy55LFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbaSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzW2kgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuICAvLyBib3R0b20tcmlnaHQgb3V0dGVyIGludGVybWlzc2lvblxuICB2YXIgYm90dG9tX3JpZ2h0X291dHRlcl9pbml0X3BvcyA9IHtcbiAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCxcbiAgICB5OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueSAtIHNxdWFyZV9zaXplXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBsZXQgc3F1YXJlID0geyBcbiAgICAgIHg6IGJvdHRvbV9yaWdodF9vdXR0ZXJfaW5pdF9wb3MueCxcbiAgICAgIHk6IGJvdHRvbV9yaWdodF9vdXR0ZXJfaW5pdF9wb3MueSAtIChpICogc3F1YXJlX3NpemUpLFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbKGkgKyAxKSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgdmFyIHhfb2Zmc2V0ID0gc3F1YXJlX3NpemUgKyA1XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCArIChpICsgMSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55LFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbKGkgKyA0KSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzWyhpICsgNCkgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG5cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG5cbiAgLy8gcmlnaHQgb3V0dGVyIGxhbmVcbiAgdmFyIHJpZ2h0X291dHRlcl9pbml0X3BvcyA9IHtcbiAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCArIHNxdWFyZV9zaXplLFxuICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMzsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiByaWdodF9vdXR0ZXJfaW5pdF9wb3MueCxcbiAgICAgIHk6IHJpZ2h0X291dHRlcl9pbml0X3Bvcy55IC0gKGkgKiBzcXVhcmVfc2l6ZSksXG4gICAgICBzaXplOiBzcXVhcmVfc2l6ZSxcbiAgICAgIGNvbG91cjogY29sb3Vyc1tpICUgY29sb3Vycy5sZW5ndGhdLFxuICAgICAgZGVmYXVsdF9jb2xvdXI6IGNvbG91cnNbaSAlIGNvbG91cnMubGVuZ3RoXVxuICAgIH1cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG5cbiAgLy8gcmlnaHQtdG9wIG91dHRlciBpbnRlcm1pc3Npb25cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICB2YXIgeV9vZmZzZXQgPSAwXG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCAtIChpICsgMSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55LFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbKGkgKyAxKSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIHZhciB4X29mZnNldCA9IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS54XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiB4X29mZnNldCxcbiAgICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55IC0gKGkgKyAxICogc3F1YXJlX3NpemUpLFxuICAgICAgc2l6ZTogc3F1YXJlX3NpemUsXG4gICAgICBjb2xvdXI6IGNvbG91cnNbKGkgKyA0KSAlIGNvbG91cnMubGVuZ3RoXSxcbiAgICAgIGRlZmF1bHRfY29sb3VyOiBjb2xvdXJzWyhpICsgNCkgJSBjb2xvdXJzLmxlbmd0aF1cbiAgICB9XG4gICAgZ28uc3F1YXJlcy5wdXNoKHNxdWFyZSlcbiAgfVxuXG4gIC8vIHRvcCBvdXR0ZXIgbGFuZVxuICB2YXIgdG9wX291dHRlcl9pbml0X3Bvc3QgPSB7XG4gICAgeDogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLngsXG4gICAgeTogc3F1YXJlc1tzcXVhcmVzLmxlbmd0aCAtIDFdLnkgLSBzcXVhcmVfc2l6ZSxcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IDEzOyBpKyspIHtcbiAgICBsZXQgc3F1YXJlID0geyBcbiAgICAgIHg6IHRvcF9vdXR0ZXJfaW5pdF9wb3N0LnggLSAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHk6IHRvcF9vdXR0ZXJfaW5pdF9wb3N0LnksXG4gICAgICBzaXplOiBzcXVhcmVfc2l6ZSxcbiAgICAgIGNvbG91cjogY29sb3Vyc1tpICUgY29sb3Vycy5sZW5ndGhdLFxuICAgICAgZGVmYXVsdF9jb2xvdXI6IGNvbG91cnNbaSAlIGNvbG91cnMubGVuZ3RoXVxuICAgIH1cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG5cbiAgLy8gdG9wLWxlZnQgb3V0dGVyIGludGVybWlzc2lvblxuICB2YXIgdG9wX2xlZnRfb3V0dGVyX2luaXRfcG9zID0ge1xuICAgIHg6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS54LFxuICAgIHk6IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55ICsgc3F1YXJlX3NpemUsXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBsZXQgc3F1YXJlID0geyBcbiAgICAgIHg6IHRvcF9sZWZ0X291dHRlcl9pbml0X3Bvcy54LFxuICAgICAgeTogdG9wX2xlZnRfb3V0dGVyX2luaXRfcG9zLnkgKyAoaSAqIHNxdWFyZV9zaXplKSxcbiAgICAgIHNpemU6IHNxdWFyZV9zaXplLFxuICAgICAgY29sb3VyOiBjb2xvdXJzWyhpICsgMSkgJSBjb2xvdXJzLmxlbmd0aF0sXG4gICAgICBkZWZhdWx0X2NvbG91cjogY29sb3Vyc1soaSArIDEpICUgY29sb3Vycy5sZW5ndGhdXG4gICAgfVxuICAgIGdvLnNxdWFyZXMucHVzaChzcXVhcmUpXG4gIH1cblxuICB2YXIgeF9vZmZzZXQgPSBzcXVhcmVzW3NxdWFyZXMubGVuZ3RoIC0gMV0ueCAtIHNxdWFyZV9zaXplXG4gIHZhciB5X29mZnNldCA9IHNxdWFyZXNbc3F1YXJlcy5sZW5ndGggLSAxXS55XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgbGV0IHNxdWFyZSA9IHsgXG4gICAgICB4OiB4X29mZnNldCAtIChpICogc3F1YXJlX3NpemUpLFxuICAgICAgeTogeV9vZmZzZXQsXG4gICAgICBzaXplOiBzcXVhcmVfc2l6ZSxcbiAgICAgIGNvbG91cjogY29sb3Vyc1soaSArIDEpICUgY29sb3Vycy5sZW5ndGhdLFxuICAgICAgZGVmYXVsdF9jb2xvdXI6IGNvbG91cnNbKGkgKyAxKSAlIGNvbG91cnMubGVuZ3RoXVxuICAgIH1cbiAgICBnby5zcXVhcmVzLnB1c2goc3F1YXJlKVxuICB9XG59XG5cbmNvbnN0IHRlbXBfbGlua19zcXVhcmVzID0gKCkgPT4ge1xuICBnby5zcXVhcmVzLmZvckVhY2goKHNxdWFyZSwgaW5kZXgpID0+IHtcbiAgICBzcXVhcmUuY29ubmVjdGVkID0gW2dvLnNxdWFyZXNbKGluZGV4ICsgMSkgJSBnby5zcXVhcmVzLmxlbmd0aF1dXG4gIH0pXG59XG5cbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIGdvLnNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgZHJhd19zcXVhcmUoXG4gICAgICBzcXVhcmUueCxcbiAgICAgIHNxdWFyZS55LFxuICAgICAgc3F1YXJlLnNpemUsXG4gICAgICBzcXVhcmUuc2l6ZSxcbiAgICAgIHNxdWFyZS5jb2xvdXJcbiAgICApXG4gIH0pXG5cbiAgLy8gQnV0dG9uc1xuICBtZW51LmRyYXcoKVxuICBnby5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5kcmF3KClcbiAgfSlcbn1cblxuY29uc3QgbW91c2VfY2xpY2sgPSAoZXYpID0+IHtcbiAgY29uc29sZS5sb2coYENsaWNrOiAke2V2LmNsaWVudFh9LCR7ZXYuY2xpZW50WX1gKVxuICBpZiAoZ28uZ2FtZV9zdGF0ZSA9PSBcImF3YWl0aW5nX3BsYXllcl9tb3ZlbWVudFwiKSB7XG4gICAgbGV0IG1vdXNlX2NsaWNrX3JlY3QgPSB7IHg6IGV2LmNsaWVudFgsIHk6IGV2LmNsaWVudFksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICAgIC8vIExldCdzIHNlZSBpZiB0aGV5IGNsaWNrZWQgYSBwaWVjZSBvZiBoaXNcbiAgICBsZXQgY2xpY2tlZF9waWVjZSA9IGdvLmN1cnJlbnRfcGxheWVyLnBpZWNlcy5cbiAgICAgIGZpbHRlcigocGllY2UpID0+ICFwaWVjZS5hdF9ob21lKS5cbiAgICAgIGZpbmQoKHBpZWNlKSA9PiB7XG4gICAgICAgIC8vY29uc29sZS5sb2coYENoZWNraW5nIHBpZWNlIGF0OiAke3BpZWNlLnh9LCR7cGllY2UueX1gKVxuICAgICAgICBsZXQgZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKHBpZWNlLCBtb3VzZV9jbGlja19yZWN0KVxuICAgICAgICByZXR1cm4gZGlzdGFuY2UgPD0gMTVcbiAgICAgIH0pXG5cbiAgICBpZiAoY2xpY2tlZF9waWVjZSkge1xuICAgICAgZ28uY3VycmVudF9waWVjZV9zZWxlY3RlZCA9IGNsaWNrZWRfcGllY2VcbiAgICAgIGNsaWNrZWRfcGllY2UuY29sb3VyID0gXCJjeWFuXCJcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBjbGlja2VkX3NxdWFyZSA9IGdvLnNxdWFyZXMuZmluZCgoc3F1YXJlKSA9PiB7XG4gICAgICBsZXQgc3F1YXJlX3JlY3QgPSB7IC4uLnNxdWFyZSwgd2lkdGg6IHNxdWFyZV9zaXplLCBoZWlnaHQ6IHNxdWFyZV9zaXplIH1cbiAgICAgIHJldHVybiBpc19jb2xsaWRpbmcoc3F1YXJlX3JlY3QsIG1vdXNlX2NsaWNrX3JlY3QpXG4gICAgfSlcbiAgICBpZiAoY2xpY2tlZF9zcXVhcmUpIHtcbiAgICAgIGlmIChnby5jdXJyZW50X21vdmVtZW50X3RhcmdldCkge1xuICAgICAgICBnby5jdXJyZW50X21vdmVtZW50X3RhcmdldC5jb2xvdXIgPSBnby5jdXJyZW50X21vdmVtZW50X3RhcmdldC5kZWZhdWx0X2NvbG91clxuICAgICAgfVxuICAgICAgZ28uY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBjbGlja2VkX3NxdWFyZVxuICAgICAgY2xpY2tlZF9zcXVhcmUuY29sb3VyID0gXCJjeWFuXCJcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZ2FtZV9tb2RlX2NhbGxiYWNrcyA9IFttb3VzZV9jbGlja11cbmNvbnN0IG9uX2NsaWNrID0gZnVuY3Rpb24gKGV2KSB7XG4gIGdhbWVfbW9kZV9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICBjYWxsYmFjayhldilcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2FtZV9sb29wKCkge1xuICBkcmF3KClcblxuICBpZiAoKChnby5nYW1lX3N0YXRlID09IFwibmV4dF90dXJuXCIpIHx8ICgoZ28uZGljZV8xX3VzZWQpICYmIChnby5kaWNlXzJfdXNlZCkpKSAmJiAoZ28uZ2FtZV9zdGF0ZSAhPSBcImF3YWl0aW5nX3BsYXllcl9kaWVfcm9sbFwiKSkge1xuICAgIGNvbnNvbGUubG9nKFwiYXdhaXRpbmcgcGxheWVyIGRpZSByb2xsXCIpXG4gICAgZ28uZ2FtZV9zdGF0ZSA9IFwiYXdhaXRpbmdfcGxheWVyX2RpZV9yb2xsXCJcbiAgICBuZXh0X3R1cm4oKVxuICB9XG5cbiAgc2V0VGltZW91dChnYW1lX2xvb3AsIEZQUylcbn1cblxuZXhwb3J0IHsgc3RhcnRfZ2FtZSB9XG53aW5kb3cuQWxpYWRvID0ge1xuICBzdGFydF9nYW1lOiBzdGFydF9nYW1lXG59XG4iXSwic291cmNlUm9vdCI6IiJ9