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
/*!**************************!*\
  !*** ./src/inception.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_object.js */ "./src/game_object.js");
/* harmony import */ var _screen_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./screen.js */ "./src/screen.js");
/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./camera.js */ "./src/camera.js");
/* harmony import */ var _character_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./character.js */ "./src/character.js");
/* harmony import */ var _creep_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./creep.js */ "./src/creep.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");







const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
const character = new _character_js__WEBPACK_IMPORTED_MODULE_3__["default"](go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const players = []

const FPS = 16.66

const mousemove_callbacks = [go.camera.move_camera_with_mouse, track_mouse_position]
const on_mousemove = (ev) => {
  mousemove_callbacks.forEach((callback) => {
    callback(ev)
  })
}
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y
  }
}
go.canvas.addEventListener("mousemove", on_mousemove, false)
// END Mousemove callbacks

//function Server() {
//  this.conn = new WebSocket("ws://localhost:8999")
//  this.conn.onopen = () => this.login(character)
//  this.conn.onmessage = function(event) {
//    let payload = JSON.parse(event.data)
//    switch (payload.action) {
//      case "login":
//        let new_char = new Character(go)
//        new_char.name = payload.data.character.name
//        new_char.x = payload.data.character.x
//        new_char.y = payload.data.character.y
//        console.log(`Adding new char`)
//        players.push(new_char)
//        break;
//
//      case "ping":
//        go.ctx.fillRect(payload.data.character.x, payload.data.character.y, 50, 50)
//        go.ctx.stroke()
//        let player = players[0] //players.find(player => player.name === payload.data.character.name)
//        if (player) {
//          player.x = payload.data.character.x
//          player.y = payload.data.character.y
//        }
//        break;
//    }
//  } //
//  this.login = function(character) {
//    let payload = {
//      action: "login",
//      data: {
//        character: {
//          name: "Archon",
//          x: character.x,
//          y: character.y
//        }
//      }
//    }
//    this.conn.send(JSON.stringify(payload))
//  }
//
//  this.ping = function(character) {
//    let payload = {
//      action: "ping",
//      data: {
//        character: {
//          name: character.name, 
//          x: character.x,
//          y: character.y
//        }
//      }
//    }
//    this.conn.send(JSON.stringify(payload))
//  }
//}
//const server = new Server()

function spawn_creep() {
  let creep = new _creep_js__WEBPACK_IMPORTED_MODULE_4__["default"](go)
  creep.image.src = "zergling.png"
  creep.image_width = 150
  creep.image_height = 150
  creep.width = go.tile_size * 4
  creep.height = go.tile_size * 4
  creep.x = 900
  creep.y = 20
  return creep
}

const creeps = [spawn_creep()]
const projectiles = []
let game_over = false

let keys_currently_down = {
  d: false,
  w: false,
  a: false,
  s: false,
}

let keymap = {
  d: "right",
  w: "up",
  a: "left",
  s: "down",
}

let mouse_position = { x: 0, y: 0 }

const on_keydown = (ev) => {
  keys_currently_down[ev.key] = true
}

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

window.addEventListener("keydown", on_keydown, false)

const on_keyup = (ev) => {
  keys_currently_down[ev.key] = false
}
window.addEventListener("keyup", on_keyup, false)

const tower = new Tower(go)

const draw = () => {
  screen.draw()
  players.forEach(player => {
    console.log("Drawing a player")
    player.draw()
  })
  creeps.forEach((creep) => {
    if (creep.is_alive()) {
      move_creep(creep)
      creep.draw()
    }
  })
  character.draw()
  projectile.draw()
  tower.draw()
  draw_score()
}

const start = () => {
  character.x = 100
  character.y = 100

  setTimeout(game_loop, FPS)
}

let last_time = Date.now()
let tower_shot_last_time = Date.now()

function game_loop() {
  if ((Date.now() - last_time) > 3000 - (creeps_killed * 20)) {
    last_time = Date.now()
    creeps.push(spawn_creep())
  }

  //if ((Date.now() - tower_shot_last_time) > 1000) {
  //  tower_shot_last_time = Date.now()
  //  var targeted_creep = creeps.find(creep => Vector2.distance(creep, tower) < 500)
  //  if (targeted_creep) {
  //    tower.attack(targeted_creep)
  //  }
  //}

  //server.ping(character)

  check_collisions(projectiles)
  check_collisions(tower_projectiles)
  process_keys_down()
  draw()

  // This is ending the game_loop
  // On a real case, we don't want the game over to cancel the loop
  if (character.is_dead()) {
    game_over = true
    screen.draw_game_over()
  } else {
    setTimeout(game_loop, 33.33)
  }
}

function on_click(evt) {
  projectiles.push({
    current: {
      x: character.x + (character.width / 2),
      y: character.y + (character.height / 2),
      width: 10,
      height: 10
    },
    origin: {
      x: character.x + (character.width / 2),
      y: character.y + (character.height / 2)
    },
    target: {
      x: mouse_position.x,
      y: mouse_position.y
    },
    distance: 20,
  })
}
go.canvas.addEventListener('click', on_click, false)

const projectile = {
  draw() {
    for (var i = 0; i < projectiles.length; i++) {
      let current = projectiles[i]
      if (current.distance > 300) {
        projectiles.splice(i, 1)
      } else {
        current.distance += 5

        var angle = Math.atan2(current.origin.x - current.target.x,
          current.origin.y - current.target.y)

        current.current.x = (current.origin.x) + current.distance * -Math.sin(angle)
        current.current.y = (current.origin.y) + current.distance * -Math.cos(angle)

        go.ctx.beginPath()
        go.ctx.fillStyle = "red"
        go.ctx.fillRect(current.current.x - camera.x, current.current.y - camera.y, 10, 10)
        go.ctx.stroke()
      }
    }
  }
}

function move_creep(creep) {
  var angle = Math.atan2(creep.x - tower.collision_box.x,
    creep.y - tower.collision_box.y)

  let future = {
    ...creep,
    x: (creep.x) + creep.speed * -Math.sin(angle),
    y: (creep.y) + creep.speed * -Math.cos(angle)
  }

  if (!(0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.is_colliding)(tower.collision_box, future)) {
    creep.x = future.x
    creep.y = future.y
  }
}

let creeps_killed = 0;
function check_collisions(projectiles) {
  // creeps collision
  for (var i = 0; i < projectiles.length; i++) {
    let projectile = projectiles[i]
    // console.log(`Projectile: (${projectile.current.x}, ${projectile.current.y},${projectile.current.width},${projectile.current.height})`)
    // console.log(`Creep:      (${creep.x}, ${creep.y},${creep.width},${creep.height})`)
    for (var creep_index = 0; creep_index < creeps.length; creep_index++) {
      let creep = creeps[creep_index]
      if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.is_colliding)(projectile.current, creep)) {
        // remove projectiles from existence
        projectiles.splice(i, 1)
        // damage
        creep.current_hp -= 5
        if (creep.is_dead()) {
          creeps.splice(creep_index, 1)
          creeps_killed += 1
        }
      }
    }
  }

  // player collisions
  for (var creep_index = 0; creep_index < creeps.length; creep_index++) {
    let creep = creeps[creep_index]
    if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.is_colliding)(character, creep)) {
      character.current_hp -= 5
    }
  }
}

// game ---
function draw_score() {
  go.ctx.font = "48px serif"
  go.ctx.fillText(`Creeps killed: ${creeps_killed}`, 10, 50)
}

const tower_projectiles = []
function Tower(go) {
  this.image = new Image();
  this.image.src = "radiant_tower.png"
  this.image_width = 32
  this.image_height = 32
  this.projectile_image = new Image()
  this.projectile_image.src = "blue_fire.png"
  this.id = 1
  this.x = 335
  this.y = 220
  this.width = 140
  this.height = this.image.height
  this.collision_box = {
    x: this.x + 30,
    y: this.y + 180,
    width: this.width,
    height: this.height
  },
  this.draw = function() {
    go.ctx.drawImage(this.image, this.x - go.camera.x, this.y - go.camera.y)
    this.draw_projectiles()
  }
  this.draw_projectiles = function() {
    for (var i = 0; i < tower_projectiles.length; i++) {
      let current = tower_projectiles[i]
      if (current.distance > 500) {
        tower_projectiles.splice(i, 1)
      } else {
        current.distance += 5

        var angle = Math.atan2(current.origin.x - current.target.x,
          current.origin.y - current.target.y)

        current.current.x = (current.origin.x) + current.distance * -Math.sin(angle)
        current.current.y = (current.origin.y) + current.distance * -Math.cos(angle)

        go.ctx.drawImage(this.projectile_image, current.current.x - camera.x, current.current.y - camera.y, 50, 50)
      }
    }
  }
  this.attack = function(target) {
    tower_projectiles.push({
      current: {
        x: this.x + (this.image.width / 2),
        y: this.y + (this.image.height / 2),
        width: 10,
        height: 10
      },
      origin: {
        x: this.x + (this.image.width / 2),
        y: this.y + (this.image.height / 2)
      },
      target: target,
      distance: 20,
    })
  }
}

start()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2hhcmFjdGVyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Jlc291cmNlX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NjcmVlbi5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3RhcGV0ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pbmNlcHRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQ2FtZXJhKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNhbWVyYSA9IHRoaXNcbiAgdGhpcy54ID0gMFxuICB0aGlzLnkgPSAwXG4gIHRoaXMuY2FtZXJhX3NwZWVkID0gM1xuXG4gIHRoaXMubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSA9IChldikgPT4ge1xuICAgIC8vaWYgKHRoaXMuZ28uZWRpdG9yLnBhaW50X21vZGUpIHJldHVyblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA8IDEwMCkge1xuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgeSArIHRoZSBtb3ZlbWVudCB3ZSdsbCBtYWtlIGZ1cnRoZXIgdGhlcmUgaXMgZ3JlYXRlciB0aGFuXG4gICAgICAvLyB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBzY3JlZW4gbWludXMgdGhlIGhlaWdodCB0aGF0IHdpbGwgYWxyZWFkeSBiZSB2aXNpYmxlXG4gICAgICAvLyAodGhlIGNhbnZhcyBoZWlnaHQpLCBkb24ndCBnbyBmdXJ0aGVyIG93blxuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA+IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gMTAwKSB7XG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpIDwgMTAwKSB7XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA+IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSAxMDApIHtcbiAgICAgIC8vIERvbid0IGdvIGZ1cnRoZXIgbGVmdFxuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuICB9XG5cbiAgdGhpcy5mb2N1cyA9IChwb2ludCkgPT4ge1xuICAgIGxldCB4ID0gcG9pbnQueCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gICAgbGV0IHkgPSBwb2ludC55IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gICAgLy8gc3BlY2lmaWMgbWFwIGN1dHMgKGl0IGhhcyBhIG1hcCBvZmZzZXQgb2YgNjAsMTYwKVxuICAgIGlmICh4IDwgNDApIHsgeCA9IDYwIH1cbiAgICBpZiAoeSA8IDEyMCkgeyB5ID0gMTQwIH1cbiAgICAvLyBvZmZzZXQgY2hhbmdlcyBlbmRcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgdGhpcy5nbG9iYWxfY29vcmRzID0gKG9iaikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICB4OiBvYmoueCAtIHRoaXMueCxcbiAgICAgIHk6IG9iai55IC0gdGhpcy55XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbWVyYVxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcblxuZnVuY3Rpb24gQ2hhcmFjdGVyKGdvLCBpZCkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jaGFyYWN0ZXIgPSB0aGlzXG4gIHRoaXMuZWRpdG9yID0gZ28uZWRpdG9yXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcImNyaXNpc2NvcmVwZWVwcy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLmlkID0gaWRcbiAgdGhpcy54ID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgdGhpcy55ID0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IG51bGxcblxuICAvLyBDb21iYXRcbiAgdGhpcy5ocCA9IDEwMC4wXG4gIHRoaXMuY3VycmVudF9ocCA9IDEwMC4wXG5cbiAgdGhpcy5tYW5hID0gMTAuMFxuICB0aGlzLmN1cnJlbnRfbWFuYSA9IDEwLjBcbiAgLy8gRU5EIENvbWJhdFxuXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcihnbywgeyBjaGFyYWN0ZXI6IHRoaXMsIG9mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKGdvLCB7IGNoYXJhY3RlcjogdGhpcywgb2Zmc2V0OiAxMCwgY29sb3VyOiBcImJsdWVcIiB9KVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMuaXNfZGVhZCA9ICgpID0+IHRoaXMuY3VycmVudF9ocCA8PSAwXG4gIHRoaXMuaXNfYWxpdmUgPSAoKSA9PiAhaXNfZGVhZFxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLnRhcmdldF9tb3ZlbWVudCkgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCgpXG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5ocCwgdGhpcy5jdXJyZW50X2hwKVxuICAgIHRoaXMubWFuYV9iYXIuZHJhdyh0aGlzLm1hbmEsIHRoaXMuY3VycmVudF9tYW5hKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50ID0gdGhpcy50YXJnZXRfbW92ZW1lbnQpIHtcbiAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgIHRoaXMuZ28uY3R4LmFyYygodGFyZ2V0X21vdmVtZW50LnggLSB0aGlzLmdvLmNhbWVyYS54KSArIDEwLCAodGFyZ2V0X21vdmVtZW50LnkgLSB0aGlzLmdvLmNhbWVyYS55KSArIDEwLCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vIEFVVE8tTU9WRSAocGF0aGZpbmRlcikgLS0gcmVuYW1lIGl0IHRvIG1vdmUgd2hlbiB1c2luZyBwbGF5Z3JvdW5kXG4gIHRoaXMuYXV0b19tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmVtZW50X2JvYXJkLmxlbmd0aCA9PT0gMCkgeyB0aGlzLm1vdmVtZW50X2JvYXJkID0gW10uY29uY2F0KHRoaXMuZ28uYm9hcmQuZ3JpZCkgfVxuICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmdvLmJvYXJkLnRhcmdldF9ub2RlKVxuICB9XG4gIFxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHRoaXMueCArPSB0aGlzLnNwZWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHRoaXMueSAtPSB0aGlzLnNwZWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgdGhpcy54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuXG4gIEFycmF5LnByb3RvdHlwZS5sYXN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXNbMF0gfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgdGhpcy5zcGVlZCA9IDVcblxuICB0aGlzLmZpbmRfcGF0aCA9ICh0YXJnZXRfbW92ZW1lbnQpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSB0YXJnZXRfbW92ZW1lbnRcblxuICAgIGlmICh0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IHg6IHRoaXMueCArIHRoaXMuc3BlZWQsIHk6IHRoaXMueSArIHRoaXMuc3BlZWQgfSlcbiAgICB9XG5cbiAgICB2YXIgbGFzdF9zdGVwID0ge31cbiAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0ge31cblxuICAgIGRvIHtcbiAgICAgIGxhc3Rfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoW3RoaXMuY3VycmVudF9wYXRoLmxlbmd0aCAtIDFdXG4gICAgICBmdXR1cmVfbW92ZW1lbnQgPSB7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgICAgLy8gVGhpcyBjb2RlIHdpbGwga2VlcCB0cnlpbmcgdG8gZ28gYmFjayB0byB0aGUgc2FtZSBwcmV2aW91cyBmcm9tIHdoaWNoIHdlIGp1c3QgYnJhbmNoZWQgb3V0XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnggPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcblxuICAgICAgLy8gVGhpcyBpcyBwcmV0dHkgaGVhdnkuLi4gSXQncyBjYWxjdWxhdGluZyBhZ2FpbnN0IGFsbCB0aGUgYml0cyBpbiB0aGUgbWFwID1bXG4gICAgICB2YXIgZ29pbmdfdG9fY29sbGlkZSA9IHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpXG4gICAgICBpZiAoZ29pbmdfdG9fY29sbGlkZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ29sbGlzaW9uIGFoZWFkIScpXG4gICAgICAgIHZhciBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnggPSBuZXh0X21vdmVtZW50LnggLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgb24gWVwiKVxuICAgICAgICB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueSA9IG5leHRfbW92ZW1lbnQueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBYXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgLi4uZnV0dXJlX21vdmVtZW50IH0pXG4gICAgfSB3aGlsZSAoKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB8fCAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpKVxuXG4gICAgdGhpcy5tb3ZpbmcgPSB0cnVlXG4gIH1cblxuICB0aGlzLm1vdmVfb25fcGF0aCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgICAgIHZhciBuZXh0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aC5zaGlmdCgpXG4gICAgICBpZiAobmV4dF9zdGVwKSB7XG4gICAgICAgIHRoaXMueCA9IG5leHRfc3RlcC54XG4gICAgICAgIHRoaXMueSA9IG5leHRfc3RlcC55XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL3RoaXMubW92ZSA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCkge1xuICAvLyAgaWYgKHRoaXMubW92aW5nKSB7XG4gIC8vICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7IHg6IHRoaXMueCwgeTogdGhpcy55IH1cblxuICAvLyAgICBpZiAoKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA8PSAxKSkge1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gIC8vICAgICAgdGFyZ2V0X21vdmVtZW50ID0ge31cbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCh0YXJnZXRfbW92ZW1lbnQpXG5cbiAgLy8gICAgICAvLyBQYXRoaW5nXG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgIH1cblxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQud2lkdGggPSB0aGlzLndpZHRoXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gIC8vICAgIGlmICgodGhpcy5nby5lbnRpdGllcy5ldmVyeSgoZW50aXR5KSA9PiBlbnRpdHkuaWQgPT09IHRoaXMuaWQgfHwgIWlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGVudGl0eSkgKSkgJiZcbiAgLy8gICAgICAoIXRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpKSkge1xuICAvLyAgICAgIHRoaXMueCA9IGZ1dHVyZV9tb3ZlbWVudC54XG4gIC8vICAgICAgdGhpcy55ID0gZnV0dXJlX21vdmVtZW50LnlcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIkJsb2NrZWRcIik7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAvLyAgICB9XG4gIC8vICB9XG4gIC8vICAvLyBFTkQgLSBDaGFyYWN0ZXIgTW92ZW1lbnRcbiAgLy99XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcblxuZnVuY3Rpb24gQ3JlZXAoZ28pIHtcbiAgdGhpcy5pZCA9IGdvLmNyZWVwcy5sZW5ndGhcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY3JlZXBzLnB1c2godGhpcylcblxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy54ID0gNzAwXG4gIHRoaXMueSA9IDMwMFxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG4gIHRoaXMuc3BlZWQgPSAyXG4gIC8vdGhpcy5tb3ZlbWVudF9ib2FyZCA9IHRoaXMuZ28uYm9hcmQuZ3JpZFxuICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoZ28sIHsgY2hhcmFjdGVyOiB0aGlzLCBvZmZzZXQ6IDIwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5ocCA9IDIwXG4gIHRoaXMuY3VycmVudF9ocCA9IDIwXG5cbiAgdGhpcy5jb29yZHMgPSBmdW5jdGlvbihjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICB0aGlzLmlzX2RlYWQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuY3VycmVudF9ocCA8PSAwIH1cbiAgdGhpcy5pc19hbGl2ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50X2hwID4gMCB9XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSBnby5jYW1lcmEueCwgdGhpcy55IC0gZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuaHAsIHRoaXMuY3VycmVudF9ocClcbiAgfVxuXG4gIHRoaXMuc2V0X21vdmVtZW50X3RhcmdldCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBub2RlXG4gIH1cblxuICB0aGlzLm1vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpIHtcbiAgICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDcmVlcFxuIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5mdW5jdGlvbiBHYW1lT2JqZWN0KCkge1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuICB0aGlzLmNhbnZhc19yZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHRoaXMuY3R4ID0gY3R4XG4gIHRoaXMudGlsZV9zaXplID0gMjBcbiAgdGhpcy5jcmVlcHMgPSBbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0XG4iLCJmdW5jdGlvbiBSZXNvdXJjZUJhcihnbywgZGF0YSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5kYXRhID0gZGF0YVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsLCBjdXJyZW50KSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoY3VycmVudCAvIGZ1bGwpICogdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIiBcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLmRhdGEuY2hhcmFjdGVyLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmRhdGEuY2hhcmFjdGVyLnkgLSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5kYXRhLm9mZnNldCwgdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aCwgNSlcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCIgXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy5kYXRhLmNoYXJhY3Rlci54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5kYXRhLmNoYXJhY3Rlci55IC0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuZGF0YS5vZmZzZXQsIHRoaXMuZGF0YS5jaGFyYWN0ZXIud2lkdGgsIDUpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5kYXRhLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMuZGF0YS5jaGFyYWN0ZXIueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMuZGF0YS5jaGFyYWN0ZXIueSAtIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmRhdGEub2Zmc2V0LCBiYXJfd2lkdGgsIDUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VCYXJcbiIsImZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMuYmFja2dyb3VuZF9pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuYmFja2dyb3VuZF9pbWFnZS5zcmMgPSBcImJhY2tncm91bmRfY2l0eS5qcGVnXCJcbiAgdGhpcy53aWR0aCAgPSAxMDgwXG4gIHRoaXMuaGVpZ2h0ID0gMTkyMFxuXG4gIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIGlmICh0aGlzLmJhY2tncm91bmRfaW1hZ2UpIHtcbiAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRfaW1hZ2UsXG4gICAgICAgIHRoaXMuZ28uY2FtZXJhLnggKyA2MCxcbiAgICAgICAgdGhpcy5nby5jYW1lcmEueSArIDE2MCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQsXG4gICAgICAgIDAsIDAsXG4gICAgICAgIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgsIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImNvbnN0IGRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKE1hdGguZmxvb3IoYSkgLSBNYXRoLmZsb29yKGIpKTtcbn1cblxuY29uc3QgVmVjdG9yMiA9IHtcbiAgZGlzdGFuY2U6IChhLCBiKSA9PiBNYXRoLnRydW5jKE1hdGguc3FydChNYXRoLnBvdyhiLnggLSBhLngsIDIpICsgTWF0aC5wb3coYi55IC0gYS55LCAyKSkpXG59XG5cbmNvbnN0IGlzX2NvbGxpZGluZyA9IGZ1bmN0aW9uKHNlbGYsIHRhcmdldCkge1xuICBpZiAoXG4gICAgKHNlbGYueCA8IHRhcmdldC54ICsgdGFyZ2V0LndpZHRoKSAmJlxuICAgIChzZWxmLnggKyBzZWxmLndpZHRoID4gdGFyZ2V0LngpICYmXG4gICAgKHNlbGYueSA8IHRhcmdldC55ICsgdGFyZ2V0LmhlaWdodCkgJiZcbiAgICAoc2VsZi55ICsgc2VsZi5oZWlnaHQgPiB0YXJnZXQueSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBkcmF3X3NxdWFyZSA9IGZ1bmN0aW9uICh4ID0gMTAsIHkgPSAxMCwgdyA9IDIwLCBoID0gMjAsIGNvbG9yID0gXCJyZ2IoMTkwLCAyMCwgMTApXCIpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICBjdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyIH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IENyZWVwIGZyb20gXCIuL2NyZWVwLmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmNvbnN0IGdvID0gbmV3IEdhbWVPYmplY3QoKVxuY29uc3Qgc2NyZWVuID0gbmV3IFNjcmVlbihnbylcbmNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoZ28pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY2hhcmFjdGVyLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuY29uc3QgcGxheWVycyA9IFtdXG5cbmNvbnN0IEZQUyA9IDE2LjY2XG5cbmNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UsIHRyYWNrX21vdXNlX3Bvc2l0aW9uXVxuY29uc3Qgb25fbW91c2Vtb3ZlID0gKGV2KSA9PiB7XG4gIG1vdXNlbW92ZV9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICBjYWxsYmFjayhldilcbiAgfSlcbn1cbmZ1bmN0aW9uIHRyYWNrX21vdXNlX3Bvc2l0aW9uKGV2dCkge1xuICB2YXIgcmVjdCA9IGdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBtb3VzZV9wb3NpdGlvbiA9IHtcbiAgICB4OiBldnQuY2xpZW50WCAtIHJlY3QubGVmdCArIGNhbWVyYS54LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3AgKyBjYW1lcmEueVxuICB9XG59XG5nby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbl9tb3VzZW1vdmUsIGZhbHNlKVxuLy8gRU5EIE1vdXNlbW92ZSBjYWxsYmFja3NcblxuLy9mdW5jdGlvbiBTZXJ2ZXIoKSB7XG4vLyAgdGhpcy5jb25uID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0Ojg5OTlcIilcbi8vICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5sb2dpbihjaGFyYWN0ZXIpXG4vLyAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICBsZXQgcGF5bG9hZCA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSlcbi8vICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb24pIHtcbi8vICAgICAgY2FzZSBcImxvZ2luXCI6XG4vLyAgICAgICAgbGV0IG5ld19jaGFyID0gbmV3IENoYXJhY3Rlcihnbylcbi8vICAgICAgICBuZXdfY2hhci5uYW1lID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lXG4vLyAgICAgICAgbmV3X2NoYXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuLy8gICAgICAgIG5ld19jaGFyLnkgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnlcbi8vICAgICAgICBjb25zb2xlLmxvZyhgQWRkaW5nIG5ldyBjaGFyYClcbi8vICAgICAgICBwbGF5ZXJzLnB1c2gobmV3X2NoYXIpXG4vLyAgICAgICAgYnJlYWs7XG4vL1xuLy8gICAgICBjYXNlIFwicGluZ1wiOlxuLy8gICAgICAgIGdvLmN0eC5maWxsUmVjdChwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLngsIHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueSwgNTAsIDUwKVxuLy8gICAgICAgIGdvLmN0eC5zdHJva2UoKVxuLy8gICAgICAgIGxldCBwbGF5ZXIgPSBwbGF5ZXJzWzBdIC8vcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIubmFtZSA9PT0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lKVxuLy8gICAgICAgIGlmIChwbGF5ZXIpIHtcbi8vICAgICAgICAgIHBsYXllci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4vLyAgICAgICAgICBwbGF5ZXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuLy8gICAgICAgIH1cbi8vICAgICAgICBicmVhaztcbi8vICAgIH1cbi8vICB9IC8vXG4vLyAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuLy8gICAgbGV0IHBheWxvYWQgPSB7XG4vLyAgICAgIGFjdGlvbjogXCJsb2dpblwiLFxuLy8gICAgICBkYXRhOiB7XG4vLyAgICAgICAgY2hhcmFjdGVyOiB7XG4vLyAgICAgICAgICBuYW1lOiBcIkFyY2hvblwiLFxuLy8gICAgICAgICAgeDogY2hhcmFjdGVyLngsXG4vLyAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuLy8gICAgICAgIH1cbi8vICAgICAgfVxuLy8gICAgfVxuLy8gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4vLyAgfVxuLy9cbi8vICB0aGlzLnBpbmcgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbi8vICAgIGxldCBwYXlsb2FkID0ge1xuLy8gICAgICBhY3Rpb246IFwicGluZ1wiLFxuLy8gICAgICBkYXRhOiB7XG4vLyAgICAgICAgY2hhcmFjdGVyOiB7XG4vLyAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSwgXG4vLyAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbi8vICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4vLyAgICAgICAgfVxuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbi8vICB9XG4vL31cbi8vY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcigpXG5cbmZ1bmN0aW9uIHNwYXduX2NyZWVwKCkge1xuICBsZXQgY3JlZXAgPSBuZXcgQ3JlZXAoZ28pXG4gIGNyZWVwLmltYWdlLnNyYyA9IFwiemVyZ2xpbmcucG5nXCJcbiAgY3JlZXAuaW1hZ2Vfd2lkdGggPSAxNTBcbiAgY3JlZXAuaW1hZ2VfaGVpZ2h0ID0gMTUwXG4gIGNyZWVwLndpZHRoID0gZ28udGlsZV9zaXplICogNFxuICBjcmVlcC5oZWlnaHQgPSBnby50aWxlX3NpemUgKiA0XG4gIGNyZWVwLnggPSA5MDBcbiAgY3JlZXAueSA9IDIwXG4gIHJldHVybiBjcmVlcFxufVxuXG5jb25zdCBjcmVlcHMgPSBbc3Bhd25fY3JlZXAoKV1cbmNvbnN0IHByb2plY3RpbGVzID0gW11cbmxldCBnYW1lX292ZXIgPSBmYWxzZVxuXG5sZXQga2V5c19jdXJyZW50bHlfZG93biA9IHtcbiAgZDogZmFsc2UsXG4gIHc6IGZhbHNlLFxuICBhOiBmYWxzZSxcbiAgczogZmFsc2UsXG59XG5cbmxldCBrZXltYXAgPSB7XG4gIGQ6IFwicmlnaHRcIixcbiAgdzogXCJ1cFwiLFxuICBhOiBcImxlZnRcIixcbiAgczogXCJkb3duXCIsXG59XG5cbmxldCBtb3VzZV9wb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9XG5cbmNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAga2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gdHJ1ZVxufVxuXG5jb25zdCBwcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgY29uc3Qga2V5c19kb3duID0gT2JqZWN0LmtleXMoa2V5c19jdXJyZW50bHlfZG93bikuZmlsdGVyKChrZXkpID0+IGtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAga2V5c19kb3duLmZvckVhY2goKGtleSkgPT4ge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIFwiZFwiOlxuICAgICAgY2FzZSBcIndcIjpcbiAgICAgIGNhc2UgXCJhXCI6XG4gICAgICBjYXNlIFwic1wiOlxuICAgICAgICBjaGFyYWN0ZXIubW92ZShrZXltYXBba2V5XSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0pXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbl9rZXlkb3duLCBmYWxzZSlcblxuY29uc3Qgb25fa2V5dXAgPSAoZXYpID0+IHtcbiAga2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2Vcbn1cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG5jb25zdCB0b3dlciA9IG5ldyBUb3dlcihnbylcblxuY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgc2NyZWVuLmRyYXcoKVxuICBwbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkRyYXdpbmcgYSBwbGF5ZXJcIilcbiAgICBwbGF5ZXIuZHJhdygpXG4gIH0pXG4gIGNyZWVwcy5mb3JFYWNoKChjcmVlcCkgPT4ge1xuICAgIGlmIChjcmVlcC5pc19hbGl2ZSgpKSB7XG4gICAgICBtb3ZlX2NyZWVwKGNyZWVwKVxuICAgICAgY3JlZXAuZHJhdygpXG4gICAgfVxuICB9KVxuICBjaGFyYWN0ZXIuZHJhdygpXG4gIHByb2plY3RpbGUuZHJhdygpXG4gIHRvd2VyLmRyYXcoKVxuICBkcmF3X3Njb3JlKClcbn1cblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNoYXJhY3Rlci54ID0gMTAwXG4gIGNoYXJhY3Rlci55ID0gMTAwXG5cbiAgc2V0VGltZW91dChnYW1lX2xvb3AsIEZQUylcbn1cblxubGV0IGxhc3RfdGltZSA9IERhdGUubm93KClcbmxldCB0b3dlcl9zaG90X2xhc3RfdGltZSA9IERhdGUubm93KClcblxuZnVuY3Rpb24gZ2FtZV9sb29wKCkge1xuICBpZiAoKERhdGUubm93KCkgLSBsYXN0X3RpbWUpID4gMzAwMCAtIChjcmVlcHNfa2lsbGVkICogMjApKSB7XG4gICAgbGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgIGNyZWVwcy5wdXNoKHNwYXduX2NyZWVwKCkpXG4gIH1cblxuICAvL2lmICgoRGF0ZS5ub3coKSAtIHRvd2VyX3Nob3RfbGFzdF90aW1lKSA+IDEwMDApIHtcbiAgLy8gIHRvd2VyX3Nob3RfbGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAvLyAgdmFyIHRhcmdldGVkX2NyZWVwID0gY3JlZXBzLmZpbmQoY3JlZXAgPT4gVmVjdG9yMi5kaXN0YW5jZShjcmVlcCwgdG93ZXIpIDwgNTAwKVxuICAvLyAgaWYgKHRhcmdldGVkX2NyZWVwKSB7XG4gIC8vICAgIHRvd2VyLmF0dGFjayh0YXJnZXRlZF9jcmVlcClcbiAgLy8gIH1cbiAgLy99XG5cbiAgLy9zZXJ2ZXIucGluZyhjaGFyYWN0ZXIpXG5cbiAgY2hlY2tfY29sbGlzaW9ucyhwcm9qZWN0aWxlcylcbiAgY2hlY2tfY29sbGlzaW9ucyh0b3dlcl9wcm9qZWN0aWxlcylcbiAgcHJvY2Vzc19rZXlzX2Rvd24oKVxuICBkcmF3KClcblxuICAvLyBUaGlzIGlzIGVuZGluZyB0aGUgZ2FtZV9sb29wXG4gIC8vIE9uIGEgcmVhbCBjYXNlLCB3ZSBkb24ndCB3YW50IHRoZSBnYW1lIG92ZXIgdG8gY2FuY2VsIHRoZSBsb29wXG4gIGlmIChjaGFyYWN0ZXIuaXNfZGVhZCgpKSB7XG4gICAgZ2FtZV9vdmVyID0gdHJ1ZVxuICAgIHNjcmVlbi5kcmF3X2dhbWVfb3ZlcigpXG4gIH0gZWxzZSB7XG4gICAgc2V0VGltZW91dChnYW1lX2xvb3AsIDMzLjMzKVxuICB9XG59XG5cbmZ1bmN0aW9uIG9uX2NsaWNrKGV2dCkge1xuICBwcm9qZWN0aWxlcy5wdXNoKHtcbiAgICBjdXJyZW50OiB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCArIChjaGFyYWN0ZXIud2lkdGggLyAyKSxcbiAgICAgIHk6IGNoYXJhY3Rlci55ICsgKGNoYXJhY3Rlci5oZWlnaHQgLyAyKSxcbiAgICAgIHdpZHRoOiAxMCxcbiAgICAgIGhlaWdodDogMTBcbiAgICB9LFxuICAgIG9yaWdpbjoge1xuICAgICAgeDogY2hhcmFjdGVyLnggKyAoY2hhcmFjdGVyLndpZHRoIC8gMiksXG4gICAgICB5OiBjaGFyYWN0ZXIueSArIChjaGFyYWN0ZXIuaGVpZ2h0IC8gMilcbiAgICB9LFxuICAgIHRhcmdldDoge1xuICAgICAgeDogbW91c2VfcG9zaXRpb24ueCxcbiAgICAgIHk6IG1vdXNlX3Bvc2l0aW9uLnlcbiAgICB9LFxuICAgIGRpc3RhbmNlOiAyMCxcbiAgfSlcbn1cbmdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcblxuY29uc3QgcHJvamVjdGlsZSA9IHtcbiAgZHJhdygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2plY3RpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudCA9IHByb2plY3RpbGVzW2ldXG4gICAgICBpZiAoY3VycmVudC5kaXN0YW5jZSA+IDMwMCkge1xuICAgICAgICBwcm9qZWN0aWxlcy5zcGxpY2UoaSwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQuZGlzdGFuY2UgKz0gNVxuXG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoY3VycmVudC5vcmlnaW4ueCAtIGN1cnJlbnQudGFyZ2V0LngsXG4gICAgICAgICAgY3VycmVudC5vcmlnaW4ueSAtIGN1cnJlbnQudGFyZ2V0LnkpXG5cbiAgICAgICAgY3VycmVudC5jdXJyZW50LnggPSAoY3VycmVudC5vcmlnaW4ueCkgKyBjdXJyZW50LmRpc3RhbmNlICogLU1hdGguc2luKGFuZ2xlKVxuICAgICAgICBjdXJyZW50LmN1cnJlbnQueSA9IChjdXJyZW50Lm9yaWdpbi55KSArIGN1cnJlbnQuZGlzdGFuY2UgKiAtTWF0aC5jb3MoYW5nbGUpXG5cbiAgICAgICAgZ28uY3R4LmJlZ2luUGF0aCgpXG4gICAgICAgIGdvLmN0eC5maWxsU3R5bGUgPSBcInJlZFwiXG4gICAgICAgIGdvLmN0eC5maWxsUmVjdChjdXJyZW50LmN1cnJlbnQueCAtIGNhbWVyYS54LCBjdXJyZW50LmN1cnJlbnQueSAtIGNhbWVyYS55LCAxMCwgMTApXG4gICAgICAgIGdvLmN0eC5zdHJva2UoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlX2NyZWVwKGNyZWVwKSB7XG4gIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoY3JlZXAueCAtIHRvd2VyLmNvbGxpc2lvbl9ib3gueCxcbiAgICBjcmVlcC55IC0gdG93ZXIuY29sbGlzaW9uX2JveC55KVxuXG4gIGxldCBmdXR1cmUgPSB7XG4gICAgLi4uY3JlZXAsXG4gICAgeDogKGNyZWVwLngpICsgY3JlZXAuc3BlZWQgKiAtTWF0aC5zaW4oYW5nbGUpLFxuICAgIHk6IChjcmVlcC55KSArIGNyZWVwLnNwZWVkICogLU1hdGguY29zKGFuZ2xlKVxuICB9XG5cbiAgaWYgKCFpc19jb2xsaWRpbmcodG93ZXIuY29sbGlzaW9uX2JveCwgZnV0dXJlKSkge1xuICAgIGNyZWVwLnggPSBmdXR1cmUueFxuICAgIGNyZWVwLnkgPSBmdXR1cmUueVxuICB9XG59XG5cbmxldCBjcmVlcHNfa2lsbGVkID0gMDtcbmZ1bmN0aW9uIGNoZWNrX2NvbGxpc2lvbnMocHJvamVjdGlsZXMpIHtcbiAgLy8gY3JlZXBzIGNvbGxpc2lvblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2plY3RpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHByb2plY3RpbGUgPSBwcm9qZWN0aWxlc1tpXVxuICAgIC8vIGNvbnNvbGUubG9nKGBQcm9qZWN0aWxlOiAoJHtwcm9qZWN0aWxlLmN1cnJlbnQueH0sICR7cHJvamVjdGlsZS5jdXJyZW50Lnl9LCR7cHJvamVjdGlsZS5jdXJyZW50LndpZHRofSwke3Byb2plY3RpbGUuY3VycmVudC5oZWlnaHR9KWApXG4gICAgLy8gY29uc29sZS5sb2coYENyZWVwOiAgICAgICgke2NyZWVwLnh9LCAke2NyZWVwLnl9LCR7Y3JlZXAud2lkdGh9LCR7Y3JlZXAuaGVpZ2h0fSlgKVxuICAgIGZvciAodmFyIGNyZWVwX2luZGV4ID0gMDsgY3JlZXBfaW5kZXggPCBjcmVlcHMubGVuZ3RoOyBjcmVlcF9pbmRleCsrKSB7XG4gICAgICBsZXQgY3JlZXAgPSBjcmVlcHNbY3JlZXBfaW5kZXhdXG4gICAgICBpZiAoaXNfY29sbGlkaW5nKHByb2plY3RpbGUuY3VycmVudCwgY3JlZXApKSB7XG4gICAgICAgIC8vIHJlbW92ZSBwcm9qZWN0aWxlcyBmcm9tIGV4aXN0ZW5jZVxuICAgICAgICBwcm9qZWN0aWxlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgLy8gZGFtYWdlXG4gICAgICAgIGNyZWVwLmN1cnJlbnRfaHAgLT0gNVxuICAgICAgICBpZiAoY3JlZXAuaXNfZGVhZCgpKSB7XG4gICAgICAgICAgY3JlZXBzLnNwbGljZShjcmVlcF9pbmRleCwgMSlcbiAgICAgICAgICBjcmVlcHNfa2lsbGVkICs9IDFcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHBsYXllciBjb2xsaXNpb25zXG4gIGZvciAodmFyIGNyZWVwX2luZGV4ID0gMDsgY3JlZXBfaW5kZXggPCBjcmVlcHMubGVuZ3RoOyBjcmVlcF9pbmRleCsrKSB7XG4gICAgbGV0IGNyZWVwID0gY3JlZXBzW2NyZWVwX2luZGV4XVxuICAgIGlmIChpc19jb2xsaWRpbmcoY2hhcmFjdGVyLCBjcmVlcCkpIHtcbiAgICAgIGNoYXJhY3Rlci5jdXJyZW50X2hwIC09IDVcbiAgICB9XG4gIH1cbn1cblxuLy8gZ2FtZSAtLS1cbmZ1bmN0aW9uIGRyYXdfc2NvcmUoKSB7XG4gIGdvLmN0eC5mb250ID0gXCI0OHB4IHNlcmlmXCJcbiAgZ28uY3R4LmZpbGxUZXh0KGBDcmVlcHMga2lsbGVkOiAke2NyZWVwc19raWxsZWR9YCwgMTAsIDUwKVxufVxuXG5jb25zdCB0b3dlcl9wcm9qZWN0aWxlcyA9IFtdXG5mdW5jdGlvbiBUb3dlcihnbykge1xuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJyYWRpYW50X3Rvd2VyLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMucHJvamVjdGlsZV9pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMucHJvamVjdGlsZV9pbWFnZS5zcmMgPSBcImJsdWVfZmlyZS5wbmdcIlxuICB0aGlzLmlkID0gMVxuICB0aGlzLnggPSAzMzVcbiAgdGhpcy55ID0gMjIwXG4gIHRoaXMud2lkdGggPSAxNDBcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmltYWdlLmhlaWdodFxuICB0aGlzLmNvbGxpc2lvbl9ib3ggPSB7XG4gICAgeDogdGhpcy54ICsgMzAsXG4gICAgeTogdGhpcy55ICsgMTgwLFxuICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgIGhlaWdodDogdGhpcy5oZWlnaHRcbiAgfSxcbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLnggLSBnby5jYW1lcmEueCwgdGhpcy55IC0gZ28uY2FtZXJhLnkpXG4gICAgdGhpcy5kcmF3X3Byb2plY3RpbGVzKClcbiAgfVxuICB0aGlzLmRyYXdfcHJvamVjdGlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvd2VyX3Byb2plY3RpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudCA9IHRvd2VyX3Byb2plY3RpbGVzW2ldXG4gICAgICBpZiAoY3VycmVudC5kaXN0YW5jZSA+IDUwMCkge1xuICAgICAgICB0b3dlcl9wcm9qZWN0aWxlcy5zcGxpY2UoaSwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQuZGlzdGFuY2UgKz0gNVxuXG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoY3VycmVudC5vcmlnaW4ueCAtIGN1cnJlbnQudGFyZ2V0LngsXG4gICAgICAgICAgY3VycmVudC5vcmlnaW4ueSAtIGN1cnJlbnQudGFyZ2V0LnkpXG5cbiAgICAgICAgY3VycmVudC5jdXJyZW50LnggPSAoY3VycmVudC5vcmlnaW4ueCkgKyBjdXJyZW50LmRpc3RhbmNlICogLU1hdGguc2luKGFuZ2xlKVxuICAgICAgICBjdXJyZW50LmN1cnJlbnQueSA9IChjdXJyZW50Lm9yaWdpbi55KSArIGN1cnJlbnQuZGlzdGFuY2UgKiAtTWF0aC5jb3MoYW5nbGUpXG5cbiAgICAgICAgZ28uY3R4LmRyYXdJbWFnZSh0aGlzLnByb2plY3RpbGVfaW1hZ2UsIGN1cnJlbnQuY3VycmVudC54IC0gY2FtZXJhLngsIGN1cnJlbnQuY3VycmVudC55IC0gY2FtZXJhLnksIDUwLCA1MClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5hdHRhY2sgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB0b3dlcl9wcm9qZWN0aWxlcy5wdXNoKHtcbiAgICAgIGN1cnJlbnQ6IHtcbiAgICAgICAgeDogdGhpcy54ICsgKHRoaXMuaW1hZ2Uud2lkdGggLyAyKSxcbiAgICAgICAgeTogdGhpcy55ICsgKHRoaXMuaW1hZ2UuaGVpZ2h0IC8gMiksXG4gICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgaGVpZ2h0OiAxMFxuICAgICAgfSxcbiAgICAgIG9yaWdpbjoge1xuICAgICAgICB4OiB0aGlzLnggKyAodGhpcy5pbWFnZS53aWR0aCAvIDIpLFxuICAgICAgICB5OiB0aGlzLnkgKyAodGhpcy5pbWFnZS5oZWlnaHQgLyAyKVxuICAgICAgfSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgZGlzdGFuY2U6IDIwLFxuICAgIH0pXG4gIH1cbn1cblxuc3RhcnQoKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9