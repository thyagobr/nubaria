/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/camera.js":
/*!***********************!*\
  !*** ./src/camera.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Camera(go) {
  this.go = go
  this.go.camera = this
  this.x = 0
  this.y = 0
  this.camera_speed = 3

  this.move_camera_with_mouse = (ev) => {
    //if (this.go.editor.paint_mode) return
    // If the mouse is 100 pixels close to the bottom of the canvas
    if ((this.go.canvas_rect.height - ev.clientY) < 100) {
      // If our current y + the movement we'll make further there is greater than
      // the total height of the screen minus the height that will already be visible
      // (the canvas height), don't go further own
      if (this.y + this.camera_speed > this.go.screen.height - this.go.canvas_rect.height) return
      this.go.camera.y = this.go.camera.y + this.camera_speed
      // If the mouse is 100 pixels close to the top of the canvas
    } else if ((this.go.canvas_rect.height - ev.clientY) > this.go.canvas_rect.height - 100) {
      if (this.y + this.camera_speed < 0) return
      this.go.camera.y = this.go.camera.y - this.camera_speed
    }

    // If the mouse is 100 pixels close to the right of the canvas
    if ((this.go.canvas_rect.width - ev.clientX) < 100) {
      if (this.x + this.camera_speed > this.go.screen.width - this.go.canvas_rect.width) return
      this.go.camera.x = this.go.camera.x + this.camera_speed
      // If the mouse is 100 pixels close to the left of the canvas
    } else if ((this.go.canvas_rect.width - ev.clientX) > this.go.canvas_rect.width - 100) {
      // Don't go further left
      if (this.x + this.camera_speed < 0) return
      this.go.camera.x = this.go.camera.x - this.camera_speed
    }
  }

  this.focus = (point) => {
    let x = point.x - this.go.canvas_rect.width / 2
    let y = point.y - this.go.canvas_rect.height / 2
    // specific map cuts (it has a map offset of 60,160)
    if (x < 40) { x = 60 }
    if (y < 120) { y = 140 }
    // offset changes end
    this.x = x
    this.y = y
  }

  this.global_coords = (obj) => {
    return {
      ...obj,
      x: obj.x - this.x,
      y: obj.y - this.y
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Camera);


/***/ }),

/***/ "./src/character.js":
/*!**************************!*\
  !*** ./src/character.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");
/* harmony import */ var _resource_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resource_bar */ "./src/resource_bar.js");



function Character(go, id) {
  this.go = go
  this.go.character = this
  this.editor = go.editor
  this.image = new Image();
  this.image.src = "crisiscorepeeps.png"
  this.image_width = 32
  this.image_height = 32
  this.id = id
  this.x = this.go.canvas_rect.width / 2
  this.y = this.go.canvas_rect.height / 2
  this.width = this.go.tile_size * 2
  this.height = this.go.tile_size * 2
  this.moving = false
  this.direction = null

  // Combat
  this.hp = 100.0
  this.current_hp = 100.0

  this.mana = 10.0
  this.current_mana = 10.0
  // END Combat

  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"](go, { character: this, offset: 20, colour: "red" })
  this.mana_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"](go, { character: this, offset: 10, colour: "blue" })

  this.movement_board = []

  this.is_dead = () => this.current_hp <= 0
  this.is_alive = () => !is_dead

  this.move_to_waypoint = (wp_name) => {
    let wp = this.go.editor.waypoints.find((wp) => wp.name === wp_name)
    let node = this.go.board.grid[wp.id]
    this.coords(node)
  }

  this.coords = function(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function() {
    if (this.moving && this.target_movement) this.draw_movement_target()
    this.health_bar.draw(this.hp, this.current_hp)
    this.mana_bar.draw(this.mana, this.current_mana)
    this.go.ctx.drawImage(this.image, 0, 0, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
  }

  this.draw_movement_target = function(target_movement = this.target_movement) {
    this.go.ctx.beginPath()
    this.go.ctx.arc((target_movement.x - this.go.camera.x) + 10, (target_movement.y - this.go.camera.y) + 10, 20, 0, 2 * Math.PI, false)
    this.go.ctx.strokeStyle = "purple"
    this.go.ctx.lineWidth = 4;
    this.go.ctx.stroke()
  }

  // AUTO-MOVE (pathfinder) -- rename it to move when using playground
  this.auto_move = () => {
    if (this.movement_board.length === 0) { this.movement_board = [].concat(this.go.board.grid) }
    this.go.board.move(this, this.go.board.target_node)
  }
  
  this.move = (direction) => {
    switch(direction) {
      case "right":
        this.x += this.speed
        break;
      case "up":
        this.y -= this.speed
        break;
      case "left":
        this.x -= this.speed
        break;
      case "down":
        this.y += this.speed
        break;
    }
  }


  Array.prototype.last = function() { return this[this.length - 1] }
  Array.prototype.first = function() { return this[0] }

  // Stores the temporary target of the movement being executed
  this.target_movement = null
  // Stores the path being calculated
  this.current_path = []
  this.speed = 5

  this.find_path = (target_movement) => {
    this.current_path = []
    this.moving = false

    this.target_movement = target_movement

    if (this.current_path.length == 0) {
      this.current_path.push({ x: this.x + this.speed, y: this.y + this.speed })
    }

    var last_step = {}
    var future_movement = {}

    do {
      last_step = this.current_path[this.current_path.length - 1]
      future_movement = { width: this.width, height: this.height }

      // This code will keep trying to go back to the same previous from which we just branched out
      if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.distance)(last_step.x, target_movement.x) > 1) {
        if (last_step.x > target_movement.x) {
          future_movement.x = last_step.x - this.speed
        } else {
          future_movement.x = last_step.x + this.speed
        }
      }
      if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.distance)(last_step.y, target_movement.y) > 1) {
        if (last_step.y > target_movement.y) {
          future_movement.y = last_step.y - this.speed
        } else {
          future_movement.y = last_step.y + this.speed
        }
      }

      if (future_movement.x === undefined)
        future_movement.x = last_step.x
      if (future_movement.y === undefined)
        future_movement.y = last_step.y

      // This is pretty heavy... It's calculating against all the bits in the map =[
      var going_to_collide = this.editor.bitmap.some((bit) => (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(future_movement, bit))
      if (going_to_collide) {
        console.log('Collision ahead!')
        var next_movement = { ...future_movement }
        next_movement.x = next_movement.x - this.speed
        if (this.editor.bitmap.some((bit) => (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(next_movement, bit))) {
          future_movement.y = last_step.y
          console.log("Cant move on Y")
        }
        next_movement = { ...future_movement }
        next_movement.y = next_movement.y - this.speed
        if (this.editor.bitmap.some((bit) => (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(next_movement, bit))) {
          future_movement.x = last_step.x
          console.log("Cant move X")
        }
        return 
      }

      this.current_path.push({ ...future_movement })
    } while (((0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.distance)(last_step.x, target_movement.x) > 1) || ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.distance)(last_step.y, target_movement.y) > 1))

    this.moving = true
  }

  this.move_on_path = () => {
    if (this.moving) {
      var next_step = this.current_path.shift()
      if (next_step) {
        this.x = next_step.x
        this.y = next_step.y
      } else {
        this.moving = false
        this.current_path = []
      }
    }
  }

  //this.move = function(target_movement) {
  //  if (this.moving) {
  //    var future_movement = { x: this.x, y: this.y }

  //    if ((distance(this.x, target_movement.x) <= 1) && (distance(this.y, target_movement.y) <= 1)) {
  //      this.moving = false;
  //      target_movement = {}
  //      console.log("Stopped");
  //    } else {
  //      this.draw_movement_target(target_movement)

  //      // Pathing
  //      if (distance(this.x, target_movement.x) > 1) {
  //        if (this.x > target_movement.x) {
  //          future_movement.x = this.x - 2;
  //        } else {
  //          future_movement.x = this.x + 2;
  //        }
  //      }
  //      if (distance(this.y, target_movement.y) > 1) {
  //        if (this.y > target_movement.y) {
  //          future_movement.y = this.y - 2;
  //        } else {
  //          future_movement.y = this.y + 2;
  //        }
  //      }
  //    }

  //    future_movement.width = this.width
  //    future_movement.height = this.height

  //    if ((this.go.entities.every((entity) => entity.id === this.id || !is_colliding(future_movement, entity) )) &&
  //      (!this.editor.bitmap.some((bit) => is_colliding(future_movement, bit)))) {
  //      this.x = future_movement.x
  //      this.y = future_movement.y
  //    } else {
  //      console.log("Blocked");
  //      this.moving = false
  //    }
  //  }
  //  // END - Character Movement
  //}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Character);


/***/ }),

/***/ "./src/events_callbacks.js":
/*!*********************************!*\
  !*** ./src/events_callbacks.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setMousemoveCallback": () => (/* binding */ setMousemoveCallback)
/* harmony export */ });
// The callbacks system
// 
// To use it:
//
// * import the callbacks you want
//
//    import { setMousemoveCallback } from "./events_callbacks.js"
//
// * call them and store the array of callback functions
//
//    const mousemove_callbacks = setMousemoveCallback(go);
//
// * add or remove callbacks from array
//
//    mousemove_callbacks.push(go.camera.move_camera_with_mouse)
//    mousemove_callbacks.push(track_mouse_position)

function setMousemoveCallback(go) {
  const mousemove_callbacks = []
  const on_mousemove = (ev) => {
    mousemove_callbacks.forEach((callback) => {
      callback(ev)
    })
  }
  go.canvas.addEventListener("mousemove", on_mousemove, false)
  return mousemove_callbacks;
}


function setClickCallback(go) {
  const click_callbacks = []
  const on_click  = (ev) => {
    click_callbacks.forEach((callback) => {
      callback(ev)
    })
  }
  go.canvas.addEventListener('click', on_click, false)
  return click_callbacks;
}




/***/ }),

/***/ "./src/game_loop.js":
/*!**************************!*\
  !*** ./src/game_loop.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// The Game Loop
//
// Usage:
//
// const game_loop = new GameLoop()
// game_loop.draw = draw
// game_loop.process_keys_down = process_keys_down
// window.requestAnimationFrame(game_loop.loop.bind(game_loop));

function GameLoop() {
  this.draw = null
  this.process_keys_down = null
  this.loop = function() {
    try {
      this.process_keys_down()
      this.draw()
    } catch(e) {
      console.log(e)
    }
    console.log("loop")

    window.requestAnimationFrame(this.loop.bind(this));
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameLoop);


/***/ }),

/***/ "./src/game_object.js":
/*!****************************!*\
  !*** ./src/game_object.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d')

function GameObject() {
  this.canvas = canvas
  this.canvas_rect = canvas.getBoundingClientRect()
  this.ctx = ctx
  this.tile_size = 20
  this.creeps = []
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameObject);


/***/ }),

/***/ "./src/keyboard_input.js":
/*!*******************************!*\
  !*** ./src/keyboard_input.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function KeyboardInput(go) {
  const on_keydown = (ev) => {
    this.keys_currently_down[ev.key] = true
  }
  window.addEventListener("keydown", on_keydown, false)
  const on_keyup = (ev) => {
    this.keys_currently_down[ev.key] = false
  }
  window.addEventListener("keyup", on_keyup, false)

  this.go = go;
  this.go.keyboard_input = this
  this.process_keys_down = () => {
    const keys_down = Object.keys(this.keys_currently_down).filter((key) => this.keys_currently_down[key] === true)
    keys_down.forEach((key) => {
      switch (key) {
        case "d":
        case "w":
        case "a":
        case "s":
          this.go.character.move(this.keymap[key])
          break
      }
    })
  }

  this.keymap = {
    d: "right",
    w: "up",
    a: "left",
    s: "down",
  }

  this.keys_currently_down = {
    d: false,
    w: false,
    a: false,
    s: false,
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KeyboardInput);


/***/ }),

/***/ "./src/resource_bar.js":
/*!*****************************!*\
  !*** ./src/resource_bar.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ResourceBar(go, data) {
  this.go = go
  this.data = data

  this.draw = (full, current) => {
    let bar_width = ((current / full) * this.data.character.width)
    this.go.ctx.strokeStyle = "black" 
    this.go.ctx.lineWidth = 4
    this.go.ctx.strokeRect(this.data.character.x - this.go.camera.x, this.data.character.y - this.go.camera.y - this.data.offset, this.data.character.width, 5)
    this.go.ctx.fillStyle = "black" 
    this.go.ctx.fillRect(this.data.character.x - this.go.camera.x, this.data.character.y - this.go.camera.y - this.data.offset, this.data.character.width, 5)
    this.go.ctx.fillStyle = this.data.colour
    this.go.ctx.fillRect(this.data.character.x - this.go.camera.x, this.data.character.y - this.go.camera.y - this.data.offset, bar_width, 5)
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResourceBar);


/***/ }),

/***/ "./src/screen.js":
/*!***********************!*\
  !*** ./src/screen.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Screen(go) {
  this.go = go
  this.go.screen = this
  this.background_image = new Image()
  this.background_image.src = "background_city.jpeg"
  this.width  = 1080
  this.height = 1920

  this.clear = () => {
    this.go.ctx.clearRect(0, 0, this.go.canvas.width, this.go.canvas.height);
  }

  this.draw = () => {
    this.clear()
    if (this.background_image) {
      this.go.ctx.drawImage(this.background_image,
        this.go.camera.x + 60,
        this.go.camera.y + 160,
        this.go.canvas_rect.width,
        this.go.canvas_rect.height,
        0, 0,
        this.go.canvas_rect.width, this.go.canvas_rect.height)
    }
  }

  this.draw_game_over = () => {
    this.go.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    this.go.ctx.fillRect(0, 0, this.go.canvas.width, this.go.canvas.height);
    this.go.ctx.fillStyle = "white"
    this.go.ctx.font = '72px serif'
    this.go.ctx.fillText("Game Over", (this.go.canvas.width / 2) - (this.go.ctx.measureText("Game Over").width / 2), this.go.canvas.height / 2);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Screen);


/***/ }),

/***/ "./src/tapete.js":
/*!***********************!*\
  !*** ./src/tapete.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector2": () => (/* binding */ Vector2),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "draw_square": () => (/* binding */ draw_square),
/* harmony export */   "is_colliding": () => (/* binding */ is_colliding)
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
/*!**********************!*\
  !*** ./src/weird.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_object.js */ "./src/game_object.js");
/* harmony import */ var _screen_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./screen.js */ "./src/screen.js");
/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./camera.js */ "./src/camera.js");
/* harmony import */ var _character_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./character.js */ "./src/character.js");
/* harmony import */ var _keyboard_input_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./keyboard_input.js */ "./src/keyboard_input.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");
/* harmony import */ var _events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events_callbacks.js */ "./src/events_callbacks.js");
/* harmony import */ var _game_loop_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./game_loop.js */ "./src/game_loop.js");









const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
const keyboard_input = new _keyboard_input_js__WEBPACK_IMPORTED_MODULE_4__["default"](go)
const character = new _character_js__WEBPACK_IMPORTED_MODULE_3__["default"](go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const players = []

const FPS = 16.66

const mousemove_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMousemoveCallback)(go);
mousemove_callbacks.push(go.camera.move_camera_with_mouse)
mousemove_callbacks.push(track_mouse_position)

let mouse_position = { x: 0, y: 0 }
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y
  }
}

const draw = () => {
  screen.draw()
  character.draw()
}

const game_loop = new _game_loop_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down

const start = () => {
  character.x = 100
  character.y = 100

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBOztBQUV1RDs7Ozs7OztVQzFCdkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOeUM7QUFDVDtBQUNBO0FBQ007QUFDUztBQUNJO0FBQ1M7QUFDdkI7O0FBRXJDLGVBQWUsdURBQVU7QUFDekIsbUJBQW1CLGtEQUFNO0FBQ3pCLG1CQUFtQixrREFBTTtBQUN6QiwyQkFBMkIsMERBQWE7QUFDeEMsc0JBQXNCLHFEQUFTO0FBQy9CLDJCQUEyQixtREFBbUQ7QUFDOUU7O0FBRUE7O0FBRUEsNEJBQTRCLDBFQUFvQjtBQUNoRDtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IscURBQVE7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2hhcmFjdGVyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZXZlbnRzX2NhbGxiYWNrcy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfbG9vcC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfb2JqZWN0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMva2V5Ym9hcmRfaW5wdXQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90YXBldGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd2VpcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQ2FtZXJhKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNhbWVyYSA9IHRoaXNcbiAgdGhpcy54ID0gMFxuICB0aGlzLnkgPSAwXG4gIHRoaXMuY2FtZXJhX3NwZWVkID0gM1xuXG4gIHRoaXMubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSA9IChldikgPT4ge1xuICAgIC8vaWYgKHRoaXMuZ28uZWRpdG9yLnBhaW50X21vZGUpIHJldHVyblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA8IDEwMCkge1xuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgeSArIHRoZSBtb3ZlbWVudCB3ZSdsbCBtYWtlIGZ1cnRoZXIgdGhlcmUgaXMgZ3JlYXRlciB0aGFuXG4gICAgICAvLyB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBzY3JlZW4gbWludXMgdGhlIGhlaWdodCB0aGF0IHdpbGwgYWxyZWFkeSBiZSB2aXNpYmxlXG4gICAgICAvLyAodGhlIGNhbnZhcyBoZWlnaHQpLCBkb24ndCBnbyBmdXJ0aGVyIG93blxuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA+IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gMTAwKSB7XG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpIDwgMTAwKSB7XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA+IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSAxMDApIHtcbiAgICAgIC8vIERvbid0IGdvIGZ1cnRoZXIgbGVmdFxuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuICB9XG5cbiAgdGhpcy5mb2N1cyA9IChwb2ludCkgPT4ge1xuICAgIGxldCB4ID0gcG9pbnQueCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gICAgbGV0IHkgPSBwb2ludC55IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gICAgLy8gc3BlY2lmaWMgbWFwIGN1dHMgKGl0IGhhcyBhIG1hcCBvZmZzZXQgb2YgNjAsMTYwKVxuICAgIGlmICh4IDwgNDApIHsgeCA9IDYwIH1cbiAgICBpZiAoeSA8IDEyMCkgeyB5ID0gMTQwIH1cbiAgICAvLyBvZmZzZXQgY2hhbmdlcyBlbmRcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgdGhpcy5nbG9iYWxfY29vcmRzID0gKG9iaikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICB4OiBvYmoueCAtIHRoaXMueCxcbiAgICAgIHk6IG9iai55IC0gdGhpcy55XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbWVyYVxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcblxuZnVuY3Rpb24gQ2hhcmFjdGVyKGdvLCBpZCkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jaGFyYWN0ZXIgPSB0aGlzXG4gIHRoaXMuZWRpdG9yID0gZ28uZWRpdG9yXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcImNyaXNpc2NvcmVwZWVwcy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLmlkID0gaWRcbiAgdGhpcy54ID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgdGhpcy55ID0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IG51bGxcblxuICAvLyBDb21iYXRcbiAgdGhpcy5ocCA9IDEwMC4wXG4gIHRoaXMuY3VycmVudF9ocCA9IDEwMC4wXG5cbiAgdGhpcy5tYW5hID0gMTAuMFxuICB0aGlzLmN1cnJlbnRfbWFuYSA9IDEwLjBcbiAgLy8gRU5EIENvbWJhdFxuXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcihnbywgeyBjaGFyYWN0ZXI6IHRoaXMsIG9mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKGdvLCB7IGNoYXJhY3RlcjogdGhpcywgb2Zmc2V0OiAxMCwgY29sb3VyOiBcImJsdWVcIiB9KVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMuaXNfZGVhZCA9ICgpID0+IHRoaXMuY3VycmVudF9ocCA8PSAwXG4gIHRoaXMuaXNfYWxpdmUgPSAoKSA9PiAhaXNfZGVhZFxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLnRhcmdldF9tb3ZlbWVudCkgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCgpXG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5ocCwgdGhpcy5jdXJyZW50X2hwKVxuICAgIHRoaXMubWFuYV9iYXIuZHJhdyh0aGlzLm1hbmEsIHRoaXMuY3VycmVudF9tYW5hKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50ID0gdGhpcy50YXJnZXRfbW92ZW1lbnQpIHtcbiAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgIHRoaXMuZ28uY3R4LmFyYygodGFyZ2V0X21vdmVtZW50LnggLSB0aGlzLmdvLmNhbWVyYS54KSArIDEwLCAodGFyZ2V0X21vdmVtZW50LnkgLSB0aGlzLmdvLmNhbWVyYS55KSArIDEwLCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vIEFVVE8tTU9WRSAocGF0aGZpbmRlcikgLS0gcmVuYW1lIGl0IHRvIG1vdmUgd2hlbiB1c2luZyBwbGF5Z3JvdW5kXG4gIHRoaXMuYXV0b19tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmVtZW50X2JvYXJkLmxlbmd0aCA9PT0gMCkgeyB0aGlzLm1vdmVtZW50X2JvYXJkID0gW10uY29uY2F0KHRoaXMuZ28uYm9hcmQuZ3JpZCkgfVxuICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmdvLmJvYXJkLnRhcmdldF9ub2RlKVxuICB9XG4gIFxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMueCArPSB0aGlzLnNwZWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMueSAtPSB0aGlzLnNwZWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuXG4gIEFycmF5LnByb3RvdHlwZS5sYXN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXNbMF0gfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgdGhpcy5zcGVlZCA9IDVcblxuICB0aGlzLmZpbmRfcGF0aCA9ICh0YXJnZXRfbW92ZW1lbnQpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSB0YXJnZXRfbW92ZW1lbnRcblxuICAgIGlmICh0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IHg6IHRoaXMueCArIHRoaXMuc3BlZWQsIHk6IHRoaXMueSArIHRoaXMuc3BlZWQgfSlcbiAgICB9XG5cbiAgICB2YXIgbGFzdF9zdGVwID0ge31cbiAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0ge31cblxuICAgIGRvIHtcbiAgICAgIGxhc3Rfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoW3RoaXMuY3VycmVudF9wYXRoLmxlbmd0aCAtIDFdXG4gICAgICBmdXR1cmVfbW92ZW1lbnQgPSB7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgICAgLy8gVGhpcyBjb2RlIHdpbGwga2VlcCB0cnlpbmcgdG8gZ28gYmFjayB0byB0aGUgc2FtZSBwcmV2aW91cyBmcm9tIHdoaWNoIHdlIGp1c3QgYnJhbmNoZWQgb3V0XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnggPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcblxuICAgICAgLy8gVGhpcyBpcyBwcmV0dHkgaGVhdnkuLi4gSXQncyBjYWxjdWxhdGluZyBhZ2FpbnN0IGFsbCB0aGUgYml0cyBpbiB0aGUgbWFwID1bXG4gICAgICB2YXIgZ29pbmdfdG9fY29sbGlkZSA9IHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpXG4gICAgICBpZiAoZ29pbmdfdG9fY29sbGlkZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ29sbGlzaW9uIGFoZWFkIScpXG4gICAgICAgIHZhciBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnggPSBuZXh0X21vdmVtZW50LnggLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgb24gWVwiKVxuICAgICAgICB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueSA9IG5leHRfbW92ZW1lbnQueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBYXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgLi4uZnV0dXJlX21vdmVtZW50IH0pXG4gICAgfSB3aGlsZSAoKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB8fCAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpKVxuXG4gICAgdGhpcy5tb3ZpbmcgPSB0cnVlXG4gIH1cblxuICB0aGlzLm1vdmVfb25fcGF0aCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgICAgIHZhciBuZXh0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aC5zaGlmdCgpXG4gICAgICBpZiAobmV4dF9zdGVwKSB7XG4gICAgICAgIHRoaXMueCA9IG5leHRfc3RlcC54XG4gICAgICAgIHRoaXMueSA9IG5leHRfc3RlcC55XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL3RoaXMubW92ZSA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCkge1xuICAvLyAgaWYgKHRoaXMubW92aW5nKSB7XG4gIC8vICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7IHg6IHRoaXMueCwgeTogdGhpcy55IH1cblxuICAvLyAgICBpZiAoKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA8PSAxKSkge1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gIC8vICAgICAgdGFyZ2V0X21vdmVtZW50ID0ge31cbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCh0YXJnZXRfbW92ZW1lbnQpXG5cbiAgLy8gICAgICAvLyBQYXRoaW5nXG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgIH1cblxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQud2lkdGggPSB0aGlzLndpZHRoXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gIC8vICAgIGlmICgodGhpcy5nby5lbnRpdGllcy5ldmVyeSgoZW50aXR5KSA9PiBlbnRpdHkuaWQgPT09IHRoaXMuaWQgfHwgIWlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGVudGl0eSkgKSkgJiZcbiAgLy8gICAgICAoIXRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpKSkge1xuICAvLyAgICAgIHRoaXMueCA9IGZ1dHVyZV9tb3ZlbWVudC54XG4gIC8vICAgICAgdGhpcy55ID0gZnV0dXJlX21vdmVtZW50LnlcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIkJsb2NrZWRcIik7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAvLyAgICB9XG4gIC8vICB9XG4gIC8vICAvLyBFTkQgLSBDaGFyYWN0ZXIgTW92ZW1lbnRcbiAgLy99XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiLy8gVGhlIGNhbGxiYWNrcyBzeXN0ZW1cbi8vIFxuLy8gVG8gdXNlIGl0OlxuLy9cbi8vICogaW1wb3J0IHRoZSBjYWxsYmFja3MgeW91IHdhbnRcbi8vXG4vLyAgICBpbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuLy9cbi8vICogY2FsbCB0aGVtIGFuZCBzdG9yZSB0aGUgYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zXG4vL1xuLy8gICAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKTtcbi8vXG4vLyAqIGFkZCBvciByZW1vdmUgY2FsbGJhY2tzIGZyb20gYXJyYXlcbi8vXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmZ1bmN0aW9uIHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4gIHJldHVybiBtb3VzZW1vdmVfY2FsbGJhY2tzO1xufVxuXG5cbmZ1bmN0aW9uIHNldENsaWNrQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fY2xpY2sgID0gKGV2KSA9PiB7XG4gICAgY2xpY2tfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcbiAgcmV0dXJuIGNsaWNrX2NhbGxiYWNrcztcbn1cblxuZXhwb3J0IHsgc2V0TW91c2Vtb3ZlQ2FsbGJhY2sgfTtcbiIsIi8vIFRoZSBHYW1lIExvb3Bcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBjb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuLy8gZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG4vLyBnYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBwcm9jZXNzX2tleXNfZG93blxuLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xuXG5mdW5jdGlvbiBHYW1lTG9vcCgpIHtcbiAgdGhpcy5kcmF3ID0gbnVsbFxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gbnVsbFxuICB0aGlzLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5wcm9jZXNzX2tleXNfZG93bigpXG4gICAgICB0aGlzLmRyYXcoKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJsb29wXCIpXG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lTG9vcFxuIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5mdW5jdGlvbiBHYW1lT2JqZWN0KCkge1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuICB0aGlzLmNhbnZhc19yZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHRoaXMuY3R4ID0gY3R4XG4gIHRoaXMudGlsZV9zaXplID0gMjBcbiAgdGhpcy5jcmVlcHMgPSBbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0XG4iLCJmdW5jdGlvbiBLZXlib2FyZElucHV0KGdvKSB7XG4gIGNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25fa2V5ZG93biwgZmFsc2UpXG4gIGNvbnN0IG9uX2tleXVwID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSBmYWxzZVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby5rZXlib2FyZF9pbnB1dCA9IHRoaXNcbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgICBjb25zdCBrZXlzX2Rvd24gPSBPYmplY3Qua2V5cyh0aGlzLmtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAgICBrZXlzX2Rvd24uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlIFwiZFwiOlxuICAgICAgICBjYXNlIFwid1wiOlxuICAgICAgICBjYXNlIFwiYVwiOlxuICAgICAgICBjYXNlIFwic1wiOlxuICAgICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUodGhpcy5rZXltYXBba2V5XSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0aGlzLmtleW1hcCA9IHtcbiAgICBkOiBcInJpZ2h0XCIsXG4gICAgdzogXCJ1cFwiLFxuICAgIGE6IFwibGVmdFwiLFxuICAgIHM6IFwiZG93blwiLFxuICB9XG5cbiAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duID0ge1xuICAgIGQ6IGZhbHNlLFxuICAgIHc6IGZhbHNlLFxuICAgIGE6IGZhbHNlLFxuICAgIHM6IGZhbHNlLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtleWJvYXJkSW5wdXQ7XG4iLCJmdW5jdGlvbiBSZXNvdXJjZUJhcihnbywgZGF0YSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5kYXRhID0gZGF0YVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsLCBjdXJyZW50KSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoY3VycmVudCAvIGZ1bGwpICogdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIiBcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLmRhdGEuY2hhcmFjdGVyLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmRhdGEuY2hhcmFjdGVyLnkgLSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5kYXRhLm9mZnNldCwgdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aCwgNSlcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCIgXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy5kYXRhLmNoYXJhY3Rlci54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5kYXRhLmNoYXJhY3Rlci55IC0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuZGF0YS5vZmZzZXQsIHRoaXMuZGF0YS5jaGFyYWN0ZXIud2lkdGgsIDUpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5kYXRhLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMuZGF0YS5jaGFyYWN0ZXIueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMuZGF0YS5jaGFyYWN0ZXIueSAtIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmRhdGEub2Zmc2V0LCBiYXJfd2lkdGgsIDUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VCYXJcbiIsImZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMuYmFja2dyb3VuZF9pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuYmFja2dyb3VuZF9pbWFnZS5zcmMgPSBcImJhY2tncm91bmRfY2l0eS5qcGVnXCJcbiAgdGhpcy53aWR0aCAgPSAxMDgwXG4gIHRoaXMuaGVpZ2h0ID0gMTkyMFxuXG4gIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIGlmICh0aGlzLmJhY2tncm91bmRfaW1hZ2UpIHtcbiAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRfaW1hZ2UsXG4gICAgICAgIHRoaXMuZ28uY2FtZXJhLnggKyA2MCxcbiAgICAgICAgdGhpcy5nby5jYW1lcmEueSArIDE2MCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQsXG4gICAgICAgIDAsIDAsXG4gICAgICAgIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgsIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImNvbnN0IGRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKE1hdGguZmxvb3IoYSkgLSBNYXRoLmZsb29yKGIpKTtcbn1cblxuY29uc3QgVmVjdG9yMiA9IHtcbiAgZGlzdGFuY2U6IChhLCBiKSA9PiBNYXRoLnRydW5jKE1hdGguc3FydChNYXRoLnBvdyhiLnggLSBhLngsIDIpICsgTWF0aC5wb3coYi55IC0gYS55LCAyKSkpXG59XG5cbmNvbnN0IGlzX2NvbGxpZGluZyA9IGZ1bmN0aW9uKHNlbGYsIHRhcmdldCkge1xuICBpZiAoXG4gICAgKHNlbGYueCA8IHRhcmdldC54ICsgdGFyZ2V0LndpZHRoKSAmJlxuICAgIChzZWxmLnggKyBzZWxmLndpZHRoID4gdGFyZ2V0LngpICYmXG4gICAgKHNlbGYueSA8IHRhcmdldC55ICsgdGFyZ2V0LmhlaWdodCkgJiZcbiAgICAoc2VsZi55ICsgc2VsZi5oZWlnaHQgPiB0YXJnZXQueSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBkcmF3X3NxdWFyZSA9IGZ1bmN0aW9uICh4ID0gMTAsIHkgPSAxMCwgdyA9IDIwLCBoID0gMjAsIGNvbG9yID0gXCJyZ2IoMTkwLCAyMCwgMTApXCIpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICBjdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyIH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEtleWJvYXJkSW5wdXQgZnJvbSBcIi4va2V5Ym9hcmRfaW5wdXQuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCB7IHNldE1vdXNlbW92ZUNhbGxiYWNrIH0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG5pbXBvcnQgR2FtZUxvb3AgZnJvbSBcIi4vZ2FtZV9sb29wLmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG5jb25zdCBzY3JlZW4gPSBuZXcgU2NyZWVuKGdvKVxuY29uc3QgY2FtZXJhID0gbmV3IENhbWVyYShnbylcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY2hhcmFjdGVyLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuY29uc3QgcGxheWVycyA9IFtdXG5cbmNvbnN0IEZQUyA9IDE2LjY2XG5cbmNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbyk7XG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmxldCBtb3VzZV9wb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9XG5mdW5jdGlvbiB0cmFja19tb3VzZV9wb3NpdGlvbihldnQpIHtcbiAgdmFyIHJlY3QgPSBnby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgbW91c2VfcG9zaXRpb24gPSB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQgKyBjYW1lcmEueCxcbiAgICB5OiBldnQuY2xpZW50WSAtIHJlY3QudG9wICsgY2FtZXJhLnlcbiAgfVxufVxuXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBzY3JlZW4uZHJhdygpXG4gIGNoYXJhY3Rlci5kcmF3KClcbn1cblxuY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbmdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gZ28ua2V5Ym9hcmRfaW5wdXQucHJvY2Vzc19rZXlzX2Rvd25cblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNoYXJhY3Rlci54ID0gMTAwXG4gIGNoYXJhY3Rlci55ID0gMTAwXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xufVxuXG5zdGFydCgpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=