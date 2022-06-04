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

/***/ "./src/creep.js":
/*!**********************!*\
  !*** ./src/creep.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");
/* harmony import */ var _resource_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resource_bar */ "./src/resource_bar.js");



function Creep(go) {
  this.id = go.creeps.length
  this.go = go
  this.go.creeps.push(this)

  this.image = new Image()
  this.image_width = 32
  this.image_height = 32
  this.x = 700
  this.y = 300
  this.width = this.go.tile_size * 2
  this.height = this.go.tile_size * 2
  this.moving = false
  this.direction = null
  this.speed = 2
  //this.movement_board = this.go.board.grid
  this.current_movement_target = null
  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"](go, { character: this, offset: 20, colour: "red" })
  this.hp = 20
  this.current_hp = 20

  this.coords = function(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.is_dead = function() { return this.current_hp <= 0 }
  this.is_alive = function() { return this.current_hp > 0 }

  this.draw = function() {
    this.go.ctx.drawImage(this.image, 0, 0, this.image_width, this.image_height, this.x - go.camera.x, this.y - go.camera.y, this.width, this.height)
    this.health_bar.draw(this.hp, this.current_hp)
  }

  this.set_movement_target = (wp_name) => {
    let wp = this.go.editor.waypoints.find((wp) => wp.name === wp_name)
    let node = this.go.board.grid[wp.id]
    this.current_movement_target = node
  }

  this.move = () => {
    if (this.current_movement_target) {
      this.go.board.move(this, this.current_movement_target)
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Creep);


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
    }

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
/* harmony import */ var _creep_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./creep.js */ "./src/creep.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");
/* harmony import */ var _events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events_callbacks.js */ "./src/events_callbacks.js");
/* harmony import */ var _game_loop_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./game_loop.js */ "./src/game_loop.js");









const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
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

// BEGIN: Key handling
let keymap = {
  d: "right",
  w: "up",
  a: "left",
  s: "down",
}

let keys_currently_down = {
  d: false,
  w: false,
  a: false,
  s: false,
}

const on_keydown = (ev) => {
  keys_currently_down[ev.key] = true
}
window.addEventListener("keydown", on_keydown, false)
const on_keyup = (ev) => {
  keys_currently_down[ev.key] = false
}
window.addEventListener("keyup", on_keyup, false)

const process_keys_down = () => {
  const keys_down = Object.keys(keys_currently_down).filter((key) => keys_currently_down[key] === true)
  keys_down.forEach((key) => {
    switch (key) {
      case "d":
      case "w":
      case "a":
      case "s":
        character.move(keymap[key])
        break
    }
  })
}
// END: Key handling

const draw = () => {
  screen.draw()
  character.draw()
}

const game_loop = new _game_loop_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
game_loop.draw = draw
game_loop.process_keys_down = process_keys_down

const start = () => {
  character.x = 100
  character.y = 100

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cmlhLy4vc3JjL2NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NyZWVwLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZXZlbnRzX2NhbGxiYWNrcy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfbG9vcC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfb2JqZWN0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcmVzb3VyY2VfYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2NyZWVuLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIENhbWVyYShnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jYW1lcmEgPSB0aGlzXG4gIHRoaXMueCA9IDBcbiAgdGhpcy55ID0gMFxuICB0aGlzLmNhbWVyYV9zcGVlZCA9IDNcblxuICB0aGlzLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UgPSAoZXYpID0+IHtcbiAgICAvL2lmICh0aGlzLmdvLmVkaXRvci5wYWludF9tb2RlKSByZXR1cm5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgYm90dG9tIG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPCAxMDApIHtcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IHkgKyB0aGUgbW92ZW1lbnQgd2UnbGwgbWFrZSBmdXJ0aGVyIHRoZXJlIGlzIGdyZWF0ZXIgdGhhblxuICAgICAgLy8gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgc2NyZWVuIG1pbnVzIHRoZSBoZWlnaHQgdGhhdCB3aWxsIGFscmVhZHkgYmUgdmlzaWJsZVxuICAgICAgLy8gKHRoZSBjYW52YXMgaGVpZ2h0KSwgZG9uJ3QgZ28gZnVydGhlciBvd25cbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLmhlaWdodCAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSB0b3Agb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIDEwMCkge1xuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA8IDEwMCkge1xuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4ud2lkdGggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gMTAwKSB7XG4gICAgICAvLyBEb24ndCBnbyBmdXJ0aGVyIGxlZnRcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZm9jdXMgPSAocG9pbnQpID0+IHtcbiAgICBsZXQgeCA9IHBvaW50LnggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICAgIGxldCB5ID0gcG9pbnQueSAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICAgIC8vIHNwZWNpZmljIG1hcCBjdXRzIChpdCBoYXMgYSBtYXAgb2Zmc2V0IG9mIDYwLDE2MClcbiAgICBpZiAoeCA8IDQwKSB7IHggPSA2MCB9XG4gICAgaWYgKHkgPCAxMjApIHsgeSA9IDE0MCB9XG4gICAgLy8gb2Zmc2V0IGNoYW5nZXMgZW5kXG4gICAgdGhpcy54ID0geFxuICAgIHRoaXMueSA9IHlcbiAgfVxuXG4gIHRoaXMuZ2xvYmFsX2Nvb3JkcyA9IChvYmopID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub2JqLFxuICAgICAgeDogb2JqLnggLSB0aGlzLngsXG4gICAgICB5OiBvYmoueSAtIHRoaXMueVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW1lcmFcbiIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5cbmZ1bmN0aW9uIENoYXJhY3RlcihnbywgaWQpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2hhcmFjdGVyID0gdGhpc1xuICB0aGlzLmVkaXRvciA9IGdvLmVkaXRvclxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJjcmlzaXNjb3JlcGVlcHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pZCA9IGlkXG4gIHRoaXMueCA9IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gIHRoaXMueSA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG5cbiAgLy8gQ29tYmF0XG4gIHRoaXMuaHAgPSAxMDAuMFxuICB0aGlzLmN1cnJlbnRfaHAgPSAxMDAuMFxuXG4gIHRoaXMubWFuYSA9IDEwLjBcbiAgdGhpcy5jdXJyZW50X21hbmEgPSAxMC4wXG4gIC8vIEVORCBDb21iYXRcblxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoZ28sIHsgY2hhcmFjdGVyOiB0aGlzLCBvZmZzZXQ6IDIwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5tYW5hX2JhciA9IG5ldyBSZXNvdXJjZUJhcihnbywgeyBjaGFyYWN0ZXI6IHRoaXMsIG9mZnNldDogMTAsIGNvbG91cjogXCJibHVlXCIgfSlcblxuICB0aGlzLm1vdmVtZW50X2JvYXJkID0gW11cblxuICB0aGlzLmlzX2RlYWQgPSAoKSA9PiB0aGlzLmN1cnJlbnRfaHAgPD0gMFxuICB0aGlzLmlzX2FsaXZlID0gKCkgPT4gIWlzX2RlYWRcblxuICB0aGlzLm1vdmVfdG9fd2F5cG9pbnQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmNvb3Jkcyhub2RlKVxuICB9XG5cbiAgdGhpcy5jb29yZHMgPSBmdW5jdGlvbihjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy50YXJnZXRfbW92ZW1lbnQpIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQoKVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuaHAsIHRoaXMuY3VycmVudF9ocClcbiAgICB0aGlzLm1hbmFfYmFyLmRyYXcodGhpcy5tYW5hLCB0aGlzLmN1cnJlbnRfbWFuYSlcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG5cbiAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuICBcbiAgdGhpcy5tb3ZlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICB0aGlzLnkgLT0gdGhpcy5zcGVlZFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHRoaXMueCAtPSB0aGlzLnNwZWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cblxuICBBcnJheS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIH1cbiAgQXJyYXkucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICAvLyBTdG9yZXMgdGhlIHRlbXBvcmFyeSB0YXJnZXQgb2YgdGhlIG1vdmVtZW50IGJlaW5nIGV4ZWN1dGVkXG4gIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gbnVsbFxuICAvLyBTdG9yZXMgdGhlIHBhdGggYmVpbmcgY2FsY3VsYXRlZFxuICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gIHRoaXMuc3BlZWQgPSA1XG5cbiAgdGhpcy5maW5kX3BhdGggPSAodGFyZ2V0X21vdmVtZW50KSA9PiB7XG4gICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgIHRoaXMubW92aW5nID0gZmFsc2VcblxuICAgIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gdGFyZ2V0X21vdmVtZW50XG5cbiAgICBpZiAodGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyB4OiB0aGlzLnggKyB0aGlzLnNwZWVkLCB5OiB0aGlzLnkgKyB0aGlzLnNwZWVkIH0pXG4gICAgfVxuXG4gICAgdmFyIGxhc3Rfc3RlcCA9IHt9XG4gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHt9XG5cbiAgICBkbyB7XG4gICAgICBsYXN0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aFt0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggLSAxXVxuICAgICAgZnV0dXJlX21vdmVtZW50ID0geyB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9XG5cbiAgICAgIC8vIFRoaXMgY29kZSB3aWxsIGtlZXAgdHJ5aW5nIHRvIGdvIGJhY2sgdG8gdGhlIHNhbWUgcHJldmlvdXMgZnJvbSB3aGljaCB3ZSBqdXN0IGJyYW5jaGVkIG91dFxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC54ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG5cbiAgICAgIC8vIFRoaXMgaXMgcHJldHR5IGhlYXZ5Li4uIEl0J3MgY2FsY3VsYXRpbmcgYWdhaW5zdCBhbGwgdGhlIGJpdHMgaW4gdGhlIG1hcCA9W1xuICAgICAgdmFyIGdvaW5nX3RvX2NvbGxpZGUgPSB0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKVxuICAgICAgaWYgKGdvaW5nX3RvX2NvbGxpZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbGxpc2lvbiBhaGVhZCEnKVxuICAgICAgICB2YXIgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC54ID0gbmV4dF9tb3ZlbWVudC54IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIG9uIFlcIilcbiAgICAgICAgfVxuICAgICAgICBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnkgPSBuZXh0X21vdmVtZW50LnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgWFwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9KVxuICAgIH0gd2hpbGUgKChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkgfHwgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSlcblxuICAgIHRoaXMubW92aW5nID0gdHJ1ZVxuICB9XG5cbiAgdGhpcy5tb3ZlX29uX3BhdGggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB2YXIgbmV4dF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGguc2hpZnQoKVxuICAgICAgaWYgKG5leHRfc3RlcCkge1xuICAgICAgICB0aGlzLnggPSBuZXh0X3N0ZXAueFxuICAgICAgICB0aGlzLnkgPSBuZXh0X3N0ZXAueVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy90aGlzLm1vdmUgPSBmdW5jdGlvbih0YXJnZXRfbW92ZW1lbnQpIHtcbiAgLy8gIGlmICh0aGlzLm1vdmluZykge1xuICAvLyAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9XG5cbiAgLy8gICAgaWYgKChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA8PSAxKSAmJiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPD0gMSkpIHtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAvLyAgICAgIHRhcmdldF9tb3ZlbWVudCA9IHt9XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJTdG9wcGVkXCIpO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQodGFyZ2V0X21vdmVtZW50KVxuXG4gIC8vICAgICAgLy8gUGF0aGluZ1xuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICB9XG5cbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LndpZHRoID0gdGhpcy53aWR0aFxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcblxuICAvLyAgICBpZiAoKHRoaXMuZ28uZW50aXRpZXMuZXZlcnkoKGVudGl0eSkgPT4gZW50aXR5LmlkID09PSB0aGlzLmlkIHx8ICFpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBlbnRpdHkpICkpICYmXG4gIC8vICAgICAgKCF0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKSkpIHtcbiAgLy8gICAgICB0aGlzLnggPSBmdXR1cmVfbW92ZW1lbnQueFxuICAvLyAgICAgIHRoaXMueSA9IGZ1dHVyZV9tb3ZlbWVudC55XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJCbG9ja2VkXCIpO1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgLy8gICAgfVxuICAvLyAgfVxuICAvLyAgLy8gRU5EIC0gQ2hhcmFjdGVyIE1vdmVtZW50XG4gIC8vfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5cbmZ1bmN0aW9uIENyZWVwKGdvKSB7XG4gIHRoaXMuaWQgPSBnby5jcmVlcHMubGVuZ3RoXG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNyZWVwcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMueCA9IDcwMFxuICB0aGlzLnkgPSAzMDBcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gbnVsbFxuICB0aGlzLnNwZWVkID0gMlxuICAvL3RoaXMubW92ZW1lbnRfYm9hcmQgPSB0aGlzLmdvLmJvYXJkLmdyaWRcbiAgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCA9IG51bGxcbiAgdGhpcy5oZWFsdGhfYmFyID0gbmV3IFJlc291cmNlQmFyKGdvLCB7IGNoYXJhY3RlcjogdGhpcywgb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMuaHAgPSAyMFxuICB0aGlzLmN1cnJlbnRfaHAgPSAyMFxuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24oY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgdGhpcy5pc19kZWFkID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmN1cnJlbnRfaHAgPD0gMCB9XG4gIHRoaXMuaXNfYWxpdmUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuY3VycmVudF9ocCA+IDAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gZ28uY2FtZXJhLngsIHRoaXMueSAtIGdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLmhwLCB0aGlzLmN1cnJlbnRfaHApXG4gIH1cblxuICB0aGlzLnNldF9tb3ZlbWVudF90YXJnZXQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbm9kZVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KSB7XG4gICAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JlZXBcbiIsIi8vIFRoZSBjYWxsYmFja3Mgc3lzdGVtXG4vLyBcbi8vIFRvIHVzZSBpdDpcbi8vXG4vLyAqIGltcG9ydCB0aGUgY2FsbGJhY2tzIHlvdSB3YW50XG4vL1xuLy8gICAgaW1wb3J0IHsgc2V0TW91c2Vtb3ZlQ2FsbGJhY2sgfSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbi8vXG4vLyAqIGNhbGwgdGhlbSBhbmQgc3RvcmUgdGhlIGFycmF5IG9mIGNhbGxiYWNrIGZ1bmN0aW9uc1xuLy9cbi8vICAgIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbyk7XG4vL1xuLy8gKiBhZGQgb3IgcmVtb3ZlIGNhbGxiYWNrcyBmcm9tIGFycmF5XG4vL1xuLy8gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKGdvLmNhbWVyYS5tb3ZlX2NhbWVyYV93aXRoX21vdXNlKVxuLy8gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKHRyYWNrX21vdXNlX3Bvc2l0aW9uKVxuXG5mdW5jdGlvbiBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbykge1xuICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fbW91c2Vtb3ZlID0gKGV2KSA9PiB7XG4gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXYpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbl9tb3VzZW1vdmUsIGZhbHNlKVxuICByZXR1cm4gbW91c2Vtb3ZlX2NhbGxiYWNrcztcbn1cblxuXG5mdW5jdGlvbiBzZXRDbGlja0NhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IG9uX2NsaWNrICA9IChldikgPT4ge1xuICAgIGNsaWNrX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXYpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbl9jbGljaywgZmFsc2UpXG4gIHJldHVybiBjbGlja19jYWxsYmFja3M7XG59XG5cbmV4cG9ydCB7IHNldE1vdXNlbW92ZUNhbGxiYWNrIH07XG4iLCIvLyBUaGUgR2FtZSBMb29wXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbi8vIGdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuLy8gZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gcHJvY2Vzc19rZXlzX2Rvd25cbi8vIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZV9sb29wLmxvb3AuYmluZChnYW1lX2xvb3ApKTtcblxuZnVuY3Rpb24gR2FtZUxvb3AoKSB7XG4gIHRoaXMuZHJhdyA9IG51bGxcbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9IG51bGxcbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24oKVxuICAgICAgdGhpcy5kcmF3KClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICB9XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lTG9vcFxuIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5mdW5jdGlvbiBHYW1lT2JqZWN0KCkge1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuICB0aGlzLmNhbnZhc19yZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHRoaXMuY3R4ID0gY3R4XG4gIHRoaXMudGlsZV9zaXplID0gMjBcbiAgdGhpcy5jcmVlcHMgPSBbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0XG4iLCJmdW5jdGlvbiBSZXNvdXJjZUJhcihnbywgZGF0YSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5kYXRhID0gZGF0YVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsLCBjdXJyZW50KSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoY3VycmVudCAvIGZ1bGwpICogdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIiBcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLmRhdGEuY2hhcmFjdGVyLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmRhdGEuY2hhcmFjdGVyLnkgLSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5kYXRhLm9mZnNldCwgdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aCwgNSlcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCIgXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy5kYXRhLmNoYXJhY3Rlci54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5kYXRhLmNoYXJhY3Rlci55IC0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuZGF0YS5vZmZzZXQsIHRoaXMuZGF0YS5jaGFyYWN0ZXIud2lkdGgsIDUpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5kYXRhLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMuZGF0YS5jaGFyYWN0ZXIueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMuZGF0YS5jaGFyYWN0ZXIueSAtIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmRhdGEub2Zmc2V0LCBiYXJfd2lkdGgsIDUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VCYXJcbiIsImZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMuYmFja2dyb3VuZF9pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuYmFja2dyb3VuZF9pbWFnZS5zcmMgPSBcImJhY2tncm91bmRfY2l0eS5qcGVnXCJcbiAgdGhpcy53aWR0aCAgPSAxMDgwXG4gIHRoaXMuaGVpZ2h0ID0gMTkyMFxuXG4gIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIGlmICh0aGlzLmJhY2tncm91bmRfaW1hZ2UpIHtcbiAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRfaW1hZ2UsXG4gICAgICAgIHRoaXMuZ28uY2FtZXJhLnggKyA2MCxcbiAgICAgICAgdGhpcy5nby5jYW1lcmEueSArIDE2MCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQsXG4gICAgICAgIDAsIDAsXG4gICAgICAgIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgsIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImNvbnN0IGRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKE1hdGguZmxvb3IoYSkgLSBNYXRoLmZsb29yKGIpKTtcbn1cblxuY29uc3QgVmVjdG9yMiA9IHtcbiAgZGlzdGFuY2U6IChhLCBiKSA9PiBNYXRoLnRydW5jKE1hdGguc3FydChNYXRoLnBvdyhiLnggLSBhLngsIDIpICsgTWF0aC5wb3coYi55IC0gYS55LCAyKSkpXG59XG5cbmNvbnN0IGlzX2NvbGxpZGluZyA9IGZ1bmN0aW9uKHNlbGYsIHRhcmdldCkge1xuICBpZiAoXG4gICAgKHNlbGYueCA8IHRhcmdldC54ICsgdGFyZ2V0LndpZHRoKSAmJlxuICAgIChzZWxmLnggKyBzZWxmLndpZHRoID4gdGFyZ2V0LngpICYmXG4gICAgKHNlbGYueSA8IHRhcmdldC55ICsgdGFyZ2V0LmhlaWdodCkgJiZcbiAgICAoc2VsZi55ICsgc2VsZi5oZWlnaHQgPiB0YXJnZXQueSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBkcmF3X3NxdWFyZSA9IGZ1bmN0aW9uICh4ID0gMTAsIHkgPSAxMCwgdyA9IDIwLCBoID0gMjAsIGNvbG9yID0gXCJyZ2IoMTkwLCAyMCwgMTApXCIpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICBjdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyIH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IENyZWVwIGZyb20gXCIuL2NyZWVwLmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuaW1wb3J0IEdhbWVMb29wIGZyb20gXCIuL2dhbWVfbG9vcC5qc1wiXG5cbmNvbnN0IGdvID0gbmV3IEdhbWVPYmplY3QoKVxuY29uc3Qgc2NyZWVuID0gbmV3IFNjcmVlbihnbylcbmNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoZ28pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY2hhcmFjdGVyLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuY29uc3QgcGxheWVycyA9IFtdXG5cbmNvbnN0IEZQUyA9IDE2LjY2XG5cbmNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbyk7XG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmxldCBtb3VzZV9wb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9XG5mdW5jdGlvbiB0cmFja19tb3VzZV9wb3NpdGlvbihldnQpIHtcbiAgdmFyIHJlY3QgPSBnby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgbW91c2VfcG9zaXRpb24gPSB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQgKyBjYW1lcmEueCxcbiAgICB5OiBldnQuY2xpZW50WSAtIHJlY3QudG9wICsgY2FtZXJhLnlcbiAgfVxufVxuXG4vLyBCRUdJTjogS2V5IGhhbmRsaW5nXG5sZXQga2V5bWFwID0ge1xuICBkOiBcInJpZ2h0XCIsXG4gIHc6IFwidXBcIixcbiAgYTogXCJsZWZ0XCIsXG4gIHM6IFwiZG93blwiLFxufVxuXG5sZXQga2V5c19jdXJyZW50bHlfZG93biA9IHtcbiAgZDogZmFsc2UsXG4gIHc6IGZhbHNlLFxuICBhOiBmYWxzZSxcbiAgczogZmFsc2UsXG59XG5cbmNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAga2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gdHJ1ZVxufVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uX2tleWRvd24sIGZhbHNlKVxuY29uc3Qgb25fa2V5dXAgPSAoZXYpID0+IHtcbiAga2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2Vcbn1cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG5jb25zdCBwcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgY29uc3Qga2V5c19kb3duID0gT2JqZWN0LmtleXMoa2V5c19jdXJyZW50bHlfZG93bikuZmlsdGVyKChrZXkpID0+IGtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAga2V5c19kb3duLmZvckVhY2goKGtleSkgPT4ge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIFwiZFwiOlxuICAgICAgY2FzZSBcIndcIjpcbiAgICAgIGNhc2UgXCJhXCI6XG4gICAgICBjYXNlIFwic1wiOlxuICAgICAgICBjaGFyYWN0ZXIubW92ZShrZXltYXBba2V5XSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0pXG59XG4vLyBFTkQ6IEtleSBoYW5kbGluZ1xuXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBzY3JlZW4uZHJhdygpXG4gIGNoYXJhY3Rlci5kcmF3KClcbn1cblxuY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbmdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gcHJvY2Vzc19rZXlzX2Rvd25cblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNoYXJhY3Rlci54ID0gMTAwXG4gIGNoYXJhY3Rlci55ID0gMTAwXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xufVxuXG5zdGFydCgpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=