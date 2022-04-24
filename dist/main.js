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
  creep.x = Math.floor(Math.random() * go.canvas_rect.width)
  creep.y = Math.floor(Math.random() * go.canvas_rect.height)
  return creep
}

const creeps = [spawn_creep(), spawn_creep()]
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
  if ((Date.now() - last_time) > 3000 - (creeps_killed * 10)) {
    last_time = Date.now()
    creeps.push(spawn_creep())
  }

  if ((Date.now() - tower_shot_last_time) > 1000) {
    tower_shot_last_time = Date.now()
    var targeted_creep = creeps.find(creep => _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(creep, tower) < 500)
    if (targeted_creep) {
      tower.attack(targeted_creep)
    }
  }

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
  var angle = Math.atan2(creep.x - character.x,
    creep.y - character.y)

  creep.x = (creep.x) + creep.speed * -Math.sin(angle)
  creep.y = (creep.y) + creep.speed * -Math.cos(angle)
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
      console.log("HIT")
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
  this.x = 100
  this.y = 100
  this.width = 50
  this.height = 100
  this.draw = function() {
    go.ctx.drawImage(this.image, 100 - go.camera.x, (go.canvas_rect.height / 4) - go.camera.y)
    this.draw_projectiles()
  }
  this.draw_projectiles = function() {
    for (var i = 0; i < tower_projectiles.length; i++) {
      let current = tower_projectiles[i]
      if (current.distance > 300) {
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
      target: {
        x: target.x,
        y: target.y
      },
      distance: 20,
    })
  }
}

start()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jcmVlcC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfb2JqZWN0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcmVzb3VyY2VfYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2NyZWVuLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2luY2VwdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBDYW1lcmEoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2FtZXJhID0gdGhpc1xuICB0aGlzLnggPSAwXG4gIHRoaXMueSA9IDBcbiAgdGhpcy5jYW1lcmFfc3BlZWQgPSAzXG5cbiAgdGhpcy5tb3ZlX2NhbWVyYV93aXRoX21vdXNlID0gKGV2KSA9PiB7XG4gICAgLy9pZiAodGhpcy5nby5lZGl0b3IucGFpbnRfbW9kZSkgcmV0dXJuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpIDwgMTAwKSB7XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCB5ICsgdGhlIG1vdmVtZW50IHdlJ2xsIG1ha2UgZnVydGhlciB0aGVyZSBpcyBncmVhdGVyIHRoYW5cbiAgICAgIC8vIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIHNjcmVlbiBtaW51cyB0aGUgaGVpZ2h0IHRoYXQgd2lsbCBhbHJlYWR5IGJlIHZpc2libGVcbiAgICAgIC8vICh0aGUgY2FudmFzIGhlaWdodCksIGRvbid0IGdvIGZ1cnRoZXIgb3duXG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgdG9wIG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpID4gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSAxMDApIHtcbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPCAxMDApIHtcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpID4gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIDEwMCkge1xuICAgICAgLy8gRG9uJ3QgZ28gZnVydGhlciBsZWZ0XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG4gIH1cblxuICB0aGlzLmZvY3VzID0gKHBvaW50KSA9PiB7XG4gICAgbGV0IHggPSBwb2ludC54IC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgICBsZXQgeSA9IHBvaW50LnkgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgICAvLyBzcGVjaWZpYyBtYXAgY3V0cyAoaXQgaGFzIGEgbWFwIG9mZnNldCBvZiA2MCwxNjApXG4gICAgaWYgKHggPCA0MCkgeyB4ID0gNjAgfVxuICAgIGlmICh5IDwgMTIwKSB7IHkgPSAxNDAgfVxuICAgIC8vIG9mZnNldCBjaGFuZ2VzIGVuZFxuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gIH1cblxuICB0aGlzLmdsb2JhbF9jb29yZHMgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9iaixcbiAgICAgIHg6IG9iai54IC0gdGhpcy54LFxuICAgICAgeTogb2JqLnkgLSB0aGlzLnlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FtZXJhXG4iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNoYXJhY3RlciA9IHRoaXNcbiAgdGhpcy5lZGl0b3IgPSBnby5lZGl0b3JcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwiY3Jpc2lzY29yZXBlZXBzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaWQgPSBpZFxuICB0aGlzLnggPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICB0aGlzLnkgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gbnVsbFxuXG4gIC8vIENvbWJhdFxuICB0aGlzLmhwID0gMTAwLjBcbiAgdGhpcy5jdXJyZW50X2hwID0gMTAwLjBcblxuICB0aGlzLm1hbmEgPSAxMC4wXG4gIHRoaXMuY3VycmVudF9tYW5hID0gMTAuMFxuICAvLyBFTkQgQ29tYmF0XG5cbiAgdGhpcy5oZWFsdGhfYmFyID0gbmV3IFJlc291cmNlQmFyKGdvLCB7IGNoYXJhY3RlcjogdGhpcywgb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMubWFuYV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoZ28sIHsgY2hhcmFjdGVyOiB0aGlzLCBvZmZzZXQ6IDEwLCBjb2xvdXI6IFwiYmx1ZVwiIH0pXG5cbiAgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdXG5cbiAgdGhpcy5pc19kZWFkID0gKCkgPT4gdGhpcy5jdXJyZW50X2hwIDw9IDBcbiAgdGhpcy5pc19hbGl2ZSA9ICgpID0+ICFpc19kZWFkXG5cbiAgdGhpcy5tb3ZlX3RvX3dheXBvaW50ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jb29yZHMobm9kZSlcbiAgfVxuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24oY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMudGFyZ2V0X21vdmVtZW50KSB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KClcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLmhwLCB0aGlzLmN1cnJlbnRfaHApXG4gICAgdGhpcy5tYW5hX2Jhci5kcmF3KHRoaXMubWFuYSwgdGhpcy5jdXJyZW50X21hbmEpXG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxuXG4gIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQgPSBmdW5jdGlvbih0YXJnZXRfbW92ZW1lbnQgPSB0aGlzLnRhcmdldF9tb3ZlbWVudCkge1xuICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpXG4gICAgdGhpcy5nby5jdHguYXJjKCh0YXJnZXRfbW92ZW1lbnQueCAtIHRoaXMuZ28uY2FtZXJhLngpICsgMTAsICh0YXJnZXRfbW92ZW1lbnQueSAtIHRoaXMuZ28uY2FtZXJhLnkpICsgMTAsIDIwLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNDtcbiAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICB9XG5cbiAgLy8gQVVUTy1NT1ZFIChwYXRoZmluZGVyKSAtLSByZW5hbWUgaXQgdG8gbW92ZSB3aGVuIHVzaW5nIHBsYXlncm91bmRcbiAgdGhpcy5hdXRvX21vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92ZW1lbnRfYm9hcmQubGVuZ3RoID09PSAwKSB7IHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXS5jb25jYXQodGhpcy5nby5ib2FyZC5ncmlkKSB9XG4gICAgdGhpcy5nby5ib2FyZC5tb3ZlKHRoaXMsIHRoaXMuZ28uYm9hcmQudGFyZ2V0X25vZGUpXG4gIH1cbiAgXG4gIHRoaXMubW92ZSA9IChkaXJlY3Rpb24pID0+IHtcbiAgICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgdGhpcy54ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgdGhpcy55IC09IHRoaXMuc3BlZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICB0aGlzLnggLT0gdGhpcy5zcGVlZFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHRoaXMueSArPSB0aGlzLnNwZWVkXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXSB9XG4gIEFycmF5LnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpc1swXSB9XG5cbiAgLy8gU3RvcmVzIHRoZSB0ZW1wb3JhcnkgdGFyZ2V0IG9mIHRoZSBtb3ZlbWVudCBiZWluZyBleGVjdXRlZFxuICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IG51bGxcbiAgLy8gU3RvcmVzIHRoZSBwYXRoIGJlaW5nIGNhbGN1bGF0ZWRcbiAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICB0aGlzLnNwZWVkID0gNVxuXG4gIHRoaXMuZmluZF9wYXRoID0gKHRhcmdldF9tb3ZlbWVudCkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG5cbiAgICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IHRhcmdldF9tb3ZlbWVudFxuXG4gICAgaWYgKHRoaXMuY3VycmVudF9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgeDogdGhpcy54ICsgdGhpcy5zcGVlZCwgeTogdGhpcy55ICsgdGhpcy5zcGVlZCB9KVxuICAgIH1cblxuICAgIHZhciBsYXN0X3N0ZXAgPSB7fVxuICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7fVxuXG4gICAgZG8ge1xuICAgICAgbGFzdF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGhbdGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoIC0gMV1cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudCA9IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgICAvLyBUaGlzIGNvZGUgd2lsbCBrZWVwIHRyeWluZyB0byBnbyBiYWNrIHRvIHRoZSBzYW1lIHByZXZpb3VzIGZyb20gd2hpY2ggd2UganVzdCBicmFuY2hlZCBvdXRcbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuXG4gICAgICAvLyBUaGlzIGlzIHByZXR0eSBoZWF2eS4uLiBJdCdzIGNhbGN1bGF0aW5nIGFnYWluc3QgYWxsIHRoZSBiaXRzIGluIHRoZSBtYXAgPVtcbiAgICAgIHZhciBnb2luZ190b19jb2xsaWRlID0gdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSlcbiAgICAgIGlmIChnb2luZ190b19jb2xsaWRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb2xsaXNpb24gYWhlYWQhJylcbiAgICAgICAgdmFyIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueCA9IG5leHRfbW92ZW1lbnQueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBvbiBZXCIpXG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC55ID0gbmV4dF9tb3ZlbWVudC55IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIFhcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyAuLi5mdXR1cmVfbW92ZW1lbnQgfSlcbiAgICB9IHdoaWxlICgoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHx8IChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkpXG5cbiAgICB0aGlzLm1vdmluZyA9IHRydWVcbiAgfVxuXG4gIHRoaXMubW92ZV9vbl9wYXRoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdmFyIG5leHRfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoLnNoaWZ0KClcbiAgICAgIGlmIChuZXh0X3N0ZXApIHtcbiAgICAgICAgdGhpcy54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgdGhpcy55ID0gbmV4dF9zdGVwLnlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vdGhpcy5tb3ZlID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50KSB7XG4gIC8vICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgLy8gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxuXG4gIC8vICAgIGlmICgoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPD0gMSkgJiYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpIDw9IDEpKSB7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgLy8gICAgICB0YXJnZXRfbW92ZW1lbnQgPSB7fVxuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiU3RvcHBlZFwiKTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KHRhcmdldF9tb3ZlbWVudClcblxuICAvLyAgICAgIC8vIFBhdGhpbmdcbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgfVxuXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC53aWR0aCA9IHRoaXMud2lkdGhcbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gICAgaWYgKCh0aGlzLmdvLmVudGl0aWVzLmV2ZXJ5KChlbnRpdHkpID0+IGVudGl0eS5pZCA9PT0gdGhpcy5pZCB8fCAhaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgZW50aXR5KSApKSAmJlxuICAvLyAgICAgICghdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSkpKSB7XG4gIC8vICAgICAgdGhpcy54ID0gZnV0dXJlX21vdmVtZW50LnhcbiAgLy8gICAgICB0aGlzLnkgPSBmdXR1cmVfbW92ZW1lbnQueVxuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiQmxvY2tlZFwiKTtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIC8vICAgIH1cbiAgLy8gIH1cbiAgLy8gIC8vIEVORCAtIENoYXJhY3RlciBNb3ZlbWVudFxuICAvL31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuXG5mdW5jdGlvbiBDcmVlcChnbykge1xuICB0aGlzLmlkID0gZ28uY3JlZXBzLmxlbmd0aFxuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jcmVlcHMucHVzaCh0aGlzKVxuXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLnggPSA3MDBcbiAgdGhpcy55ID0gMzAwXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IG51bGxcbiAgdGhpcy5zcGVlZCA9IDJcbiAgLy90aGlzLm1vdmVtZW50X2JvYXJkID0gdGhpcy5nby5ib2FyZC5ncmlkXG4gIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBudWxsXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcihnbywgeyBjaGFyYWN0ZXI6IHRoaXMsIG9mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLmhwID0gMjBcbiAgdGhpcy5jdXJyZW50X2hwID0gMjBcblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuaXNfZGVhZCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50X2hwIDw9IDAgfVxuICB0aGlzLmlzX2FsaXZlID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmN1cnJlbnRfaHAgPiAwIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIGdvLmNhbWVyYS54LCB0aGlzLnkgLSBnby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5ocCwgdGhpcy5jdXJyZW50X2hwKVxuICB9XG5cbiAgdGhpcy5zZXRfbW92ZW1lbnRfdGFyZ2V0ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCA9IG5vZGVcbiAgfVxuXG4gIHRoaXMubW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCkge1xuICAgICAgdGhpcy5nby5ib2FyZC5tb3ZlKHRoaXMsIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENyZWVwXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNyZWVwcyA9IFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVPYmplY3RcbiIsImZ1bmN0aW9uIFJlc291cmNlQmFyKGdvLCBkYXRhKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmRhdGEgPSBkYXRhXG5cbiAgdGhpcy5kcmF3ID0gKGZ1bGwsIGN1cnJlbnQpID0+IHtcbiAgICBsZXQgYmFyX3dpZHRoID0gKChjdXJyZW50IC8gZnVsbCkgKiB0aGlzLmRhdGEuY2hhcmFjdGVyLndpZHRoKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiIFxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMuZGF0YS5jaGFyYWN0ZXIueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMuZGF0YS5jaGFyYWN0ZXIueSAtIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmRhdGEub2Zmc2V0LCB0aGlzLmRhdGEuY2hhcmFjdGVyLndpZHRoLCA1KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIiBcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLmRhdGEuY2hhcmFjdGVyLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmRhdGEuY2hhcmFjdGVyLnkgLSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5kYXRhLm9mZnNldCwgdGhpcy5kYXRhLmNoYXJhY3Rlci53aWR0aCwgNSlcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmRhdGEuY29sb3VyXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy5kYXRhLmNoYXJhY3Rlci54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5kYXRhLmNoYXJhY3Rlci55IC0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuZGF0YS5vZmZzZXQsIGJhcl93aWR0aCwgNSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUJhclxuIiwiZnVuY3Rpb24gU2NyZWVuKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLnNjcmVlbiA9IHRoaXNcbiAgdGhpcy5iYWNrZ3JvdW5kX2ltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5iYWNrZ3JvdW5kX2ltYWdlLnNyYyA9IFwiYmFja2dyb3VuZF9jaXR5LmpwZWdcIlxuICB0aGlzLndpZHRoICA9IDEwODBcbiAgdGhpcy5oZWlnaHQgPSAxOTIwXG5cbiAgdGhpcy5jbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5jbGVhcigpXG4gICAgaWYgKHRoaXMuYmFja2dyb3VuZF9pbWFnZSkge1xuICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZF9pbWFnZSxcbiAgICAgICAgdGhpcy5nby5jYW1lcmEueCArIDYwLFxuICAgICAgICB0aGlzLmdvLmNhbWVyYS55ICsgMTYwLFxuICAgICAgICB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoLFxuICAgICAgICB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCxcbiAgICAgICAgMCwgMCxcbiAgICAgICAgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCwgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5kcmF3X2dhbWVfb3ZlciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC43KVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5nby5jdHguZm9udCA9ICc3MnB4IHNlcmlmJ1xuICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsICh0aGlzLmdvLmNhbnZhcy53aWR0aCAvIDIpIC0gKHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KFwiR2FtZSBPdmVyXCIpLndpZHRoIC8gMiksIHRoaXMuZ28uY2FudmFzLmhlaWdodCAvIDIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjcmVlblxuIiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSlcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGlmIChcbiAgICAoc2VsZi54IDwgdGFyZ2V0LnggKyB0YXJnZXQud2lkdGgpICYmXG4gICAgKHNlbGYueCArIHNlbGYud2lkdGggPiB0YXJnZXQueCkgJiZcbiAgICAoc2VsZi55IDwgdGFyZ2V0LnkgKyB0YXJnZXQuaGVpZ2h0KSAmJlxuICAgIChzZWxmLnkgKyBzZWxmLmhlaWdodCA+IHRhcmdldC55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuZXhwb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgZHJhd19zcXVhcmUsIFZlY3RvcjIgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tIFwiLi9nYW1lX29iamVjdC5qc1wiXG5pbXBvcnQgU2NyZWVuIGZyb20gXCIuL3NjcmVlbi5qc1wiXG5pbXBvcnQgQ2FtZXJhIGZyb20gXCIuL2NhbWVyYS5qc1wiXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci5qc1wiXG5pbXBvcnQgQ3JlZXAgZnJvbSBcIi4vY3JlZXAuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG5jb25zdCBzY3JlZW4gPSBuZXcgU2NyZWVuKGdvKVxuY29uc3QgY2FtZXJhID0gbmV3IENhbWVyYShnbylcbmNvbnN0IGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG5jaGFyYWN0ZXIubmFtZSA9IGBQbGF5ZXIgJHtTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApKS5zbGljZSgwLCAyKX1gXG5jb25zdCBwbGF5ZXJzID0gW11cblxuY29uc3QgRlBTID0gMTYuNjZcblxuY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IFtnby5jYW1lcmEubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSwgdHJhY2tfbW91c2VfcG9zaXRpb25dXG5jb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgIGNhbGxiYWNrKGV2KVxuICB9KVxufVxuZnVuY3Rpb24gdHJhY2tfbW91c2VfcG9zaXRpb24oZXZ0KSB7XG4gIHZhciByZWN0ID0gZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIG1vdXNlX3Bvc2l0aW9uID0ge1xuICAgIHg6IGV2dC5jbGllbnRYIC0gcmVjdC5sZWZ0ICsgY2FtZXJhLngsXG4gICAgeTogZXZ0LmNsaWVudFkgLSByZWN0LnRvcCArIGNhbWVyYS55XG4gIH1cbn1cbmdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4vLyBFTkQgTW91c2Vtb3ZlIGNhbGxiYWNrc1xuXG4vL2Z1bmN0aW9uIFNlcnZlcigpIHtcbi8vICB0aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6ODk5OVwiKVxuLy8gIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLmxvZ2luKGNoYXJhY3Rlcilcbi8vICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgIGxldCBwYXlsb2FkID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuLy8gICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvbikge1xuLy8gICAgICBjYXNlIFwibG9naW5cIjpcbi8vICAgICAgICBsZXQgbmV3X2NoYXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuLy8gICAgICAgIG5ld19jaGFyLm5hbWUgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWVcbi8vICAgICAgICBuZXdfY2hhci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4vLyAgICAgICAgbmV3X2NoYXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuLy8gICAgICAgIGNvbnNvbGUubG9nKGBBZGRpbmcgbmV3IGNoYXJgKVxuLy8gICAgICAgIHBsYXllcnMucHVzaChuZXdfY2hhcilcbi8vICAgICAgICBicmVhaztcbi8vXG4vLyAgICAgIGNhc2UgXCJwaW5nXCI6XG4vLyAgICAgICAgZ28uY3R4LmZpbGxSZWN0KHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueCwgcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55LCA1MCwgNTApXG4vLyAgICAgICAgZ28uY3R4LnN0cm9rZSgpXG4vLyAgICAgICAgbGV0IHBsYXllciA9IHBsYXllcnNbMF0gLy9wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBsYXllci5uYW1lID09PSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWUpXG4vLyAgICAgICAgaWYgKHBsYXllcikge1xuLy8gICAgICAgICAgcGxheWVyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbi8vICAgICAgICAgIHBsYXllci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGJyZWFrO1xuLy8gICAgfVxuLy8gIH0gLy9cbi8vICB0aGlzLmxvZ2luID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4vLyAgICBsZXQgcGF5bG9hZCA9IHtcbi8vICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4vLyAgICAgIGRhdGE6IHtcbi8vICAgICAgICBjaGFyYWN0ZXI6IHtcbi8vICAgICAgICAgIG5hbWU6IFwiQXJjaG9uXCIsXG4vLyAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbi8vICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4vLyAgICAgICAgfVxuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbi8vICB9XG4vL1xuLy8gIHRoaXMucGluZyA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuLy8gICAgbGV0IHBheWxvYWQgPSB7XG4vLyAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4vLyAgICAgIGRhdGE6IHtcbi8vICAgICAgICBjaGFyYWN0ZXI6IHtcbi8vICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLCBcbi8vICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuLy8gICAgICAgICAgeTogY2hhcmFjdGVyLnlcbi8vICAgICAgICB9XG4vLyAgICAgIH1cbi8vICAgIH1cbi8vICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuLy8gIH1cbi8vfVxuLy9jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKClcblxuZnVuY3Rpb24gc3Bhd25fY3JlZXAoKSB7XG4gIGxldCBjcmVlcCA9IG5ldyBDcmVlcChnbylcbiAgY3JlZXAuaW1hZ2Uuc3JjID0gXCJ6ZXJnbGluZy5wbmdcIlxuICBjcmVlcC5pbWFnZV93aWR0aCA9IDE1MFxuICBjcmVlcC5pbWFnZV9oZWlnaHQgPSAxNTBcbiAgY3JlZXAud2lkdGggPSBnby50aWxlX3NpemUgKiA0XG4gIGNyZWVwLmhlaWdodCA9IGdvLnRpbGVfc2l6ZSAqIDRcbiAgY3JlZXAueCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdvLmNhbnZhc19yZWN0LndpZHRoKVxuICBjcmVlcC55ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ28uY2FudmFzX3JlY3QuaGVpZ2h0KVxuICByZXR1cm4gY3JlZXBcbn1cblxuY29uc3QgY3JlZXBzID0gW3NwYXduX2NyZWVwKCksIHNwYXduX2NyZWVwKCldXG5jb25zdCBwcm9qZWN0aWxlcyA9IFtdXG5sZXQgZ2FtZV9vdmVyID0gZmFsc2VcblxubGV0IGtleXNfY3VycmVudGx5X2Rvd24gPSB7XG4gIGQ6IGZhbHNlLFxuICB3OiBmYWxzZSxcbiAgYTogZmFsc2UsXG4gIHM6IGZhbHNlLFxufVxuXG5sZXQga2V5bWFwID0ge1xuICBkOiBcInJpZ2h0XCIsXG4gIHc6IFwidXBcIixcbiAgYTogXCJsZWZ0XCIsXG4gIHM6IFwiZG93blwiLFxufVxuXG5sZXQgbW91c2VfcG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfVxuXG5jb25zdCBvbl9rZXlkb3duID0gKGV2KSA9PiB7XG4gIGtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbn1cblxuY29uc3QgcHJvY2Vzc19rZXlzX2Rvd24gPSAoKSA9PiB7XG4gIGNvbnN0IGtleXNfZG93biA9IE9iamVjdC5rZXlzKGtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiBrZXlzX2N1cnJlbnRseV9kb3duW2tleV0gPT09IHRydWUpXG4gIGtleXNfZG93bi5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSBcImRcIjpcbiAgICAgIGNhc2UgXCJ3XCI6XG4gICAgICBjYXNlIFwiYVwiOlxuICAgICAgY2FzZSBcInNcIjpcbiAgICAgICAgY2hhcmFjdGVyLm1vdmUoa2V5bWFwW2tleV0pXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9KVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25fa2V5ZG93biwgZmFsc2UpXG5cbmNvbnN0IG9uX2tleXVwID0gKGV2KSA9PiB7XG4gIGtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IGZhbHNlXG59XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uX2tleXVwLCBmYWxzZSlcblxuY29uc3QgdG93ZXIgPSBuZXcgVG93ZXIoZ28pXG5cbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIHNjcmVlbi5kcmF3KClcbiAgcGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc29sZS5sb2coXCJEcmF3aW5nIGEgcGxheWVyXCIpXG4gICAgcGxheWVyLmRyYXcoKVxuICB9KVxuICBjcmVlcHMuZm9yRWFjaCgoY3JlZXApID0+IHtcbiAgICBpZiAoY3JlZXAuaXNfYWxpdmUoKSkge1xuICAgICAgbW92ZV9jcmVlcChjcmVlcClcbiAgICAgIGNyZWVwLmRyYXcoKVxuICAgIH1cbiAgfSlcbiAgY2hhcmFjdGVyLmRyYXcoKVxuICBwcm9qZWN0aWxlLmRyYXcoKVxuICB0b3dlci5kcmF3KClcbiAgZHJhd19zY29yZSgpXG59XG5cbmNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICBjaGFyYWN0ZXIueCA9IDEwMFxuICBjaGFyYWN0ZXIueSA9IDEwMFxuXG4gIHNldFRpbWVvdXQoZ2FtZV9sb29wLCBGUFMpXG59XG5cbmxldCBsYXN0X3RpbWUgPSBEYXRlLm5vdygpXG5sZXQgdG93ZXJfc2hvdF9sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG5cbmZ1bmN0aW9uIGdhbWVfbG9vcCgpIHtcbiAgaWYgKChEYXRlLm5vdygpIC0gbGFzdF90aW1lKSA+IDMwMDAgLSAoY3JlZXBzX2tpbGxlZCAqIDEwKSkge1xuICAgIGxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICBjcmVlcHMucHVzaChzcGF3bl9jcmVlcCgpKVxuICB9XG5cbiAgaWYgKChEYXRlLm5vdygpIC0gdG93ZXJfc2hvdF9sYXN0X3RpbWUpID4gMTAwMCkge1xuICAgIHRvd2VyX3Nob3RfbGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgIHZhciB0YXJnZXRlZF9jcmVlcCA9IGNyZWVwcy5maW5kKGNyZWVwID0+IFZlY3RvcjIuZGlzdGFuY2UoY3JlZXAsIHRvd2VyKSA8IDUwMClcbiAgICBpZiAodGFyZ2V0ZWRfY3JlZXApIHtcbiAgICAgIHRvd2VyLmF0dGFjayh0YXJnZXRlZF9jcmVlcClcbiAgICB9XG4gIH1cblxuICAvL3NlcnZlci5waW5nKGNoYXJhY3RlcilcblxuICBjaGVja19jb2xsaXNpb25zKHByb2plY3RpbGVzKVxuICBjaGVja19jb2xsaXNpb25zKHRvd2VyX3Byb2plY3RpbGVzKVxuICBwcm9jZXNzX2tleXNfZG93bigpXG4gIGRyYXcoKVxuXG4gIC8vIFRoaXMgaXMgZW5kaW5nIHRoZSBnYW1lX2xvb3BcbiAgLy8gT24gYSByZWFsIGNhc2UsIHdlIGRvbid0IHdhbnQgdGhlIGdhbWUgb3ZlciB0byBjYW5jZWwgdGhlIGxvb3BcbiAgaWYgKGNoYXJhY3Rlci5pc19kZWFkKCkpIHtcbiAgICBnYW1lX292ZXIgPSB0cnVlXG4gICAgc2NyZWVuLmRyYXdfZ2FtZV9vdmVyKClcbiAgfSBlbHNlIHtcbiAgICBzZXRUaW1lb3V0KGdhbWVfbG9vcCwgMzMuMzMpXG4gIH1cbn1cblxuZnVuY3Rpb24gb25fY2xpY2soZXZ0KSB7XG4gIHByb2plY3RpbGVzLnB1c2goe1xuICAgIGN1cnJlbnQ6IHtcbiAgICAgIHg6IGNoYXJhY3Rlci54ICsgKGNoYXJhY3Rlci53aWR0aCAvIDIpLFxuICAgICAgeTogY2hhcmFjdGVyLnkgKyAoY2hhcmFjdGVyLmhlaWdodCAvIDIpLFxuICAgICAgd2lkdGg6IDEwLFxuICAgICAgaGVpZ2h0OiAxMFxuICAgIH0sXG4gICAgb3JpZ2luOiB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCArIChjaGFyYWN0ZXIud2lkdGggLyAyKSxcbiAgICAgIHk6IGNoYXJhY3Rlci55ICsgKGNoYXJhY3Rlci5oZWlnaHQgLyAyKVxuICAgIH0sXG4gICAgdGFyZ2V0OiB7XG4gICAgICB4OiBtb3VzZV9wb3NpdGlvbi54LFxuICAgICAgeTogbW91c2VfcG9zaXRpb24ueVxuICAgIH0sXG4gICAgZGlzdGFuY2U6IDIwLFxuICB9KVxufVxuZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fY2xpY2ssIGZhbHNlKVxuXG5jb25zdCBwcm9qZWN0aWxlID0ge1xuICBkcmF3KCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvamVjdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjdXJyZW50ID0gcHJvamVjdGlsZXNbaV1cbiAgICAgIGlmIChjdXJyZW50LmRpc3RhbmNlID4gMzAwKSB7XG4gICAgICAgIHByb2plY3RpbGVzLnNwbGljZShpLCAxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudC5kaXN0YW5jZSArPSA1XG5cbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihjdXJyZW50Lm9yaWdpbi54IC0gY3VycmVudC50YXJnZXQueCxcbiAgICAgICAgICBjdXJyZW50Lm9yaWdpbi55IC0gY3VycmVudC50YXJnZXQueSlcblxuICAgICAgICBjdXJyZW50LmN1cnJlbnQueCA9IChjdXJyZW50Lm9yaWdpbi54KSArIGN1cnJlbnQuZGlzdGFuY2UgKiAtTWF0aC5zaW4oYW5nbGUpXG4gICAgICAgIGN1cnJlbnQuY3VycmVudC55ID0gKGN1cnJlbnQub3JpZ2luLnkpICsgY3VycmVudC5kaXN0YW5jZSAqIC1NYXRoLmNvcyhhbmdsZSlcblxuICAgICAgICBnby5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgZ28uY3R4LmZpbGxTdHlsZSA9IFwicmVkXCJcbiAgICAgICAgZ28uY3R4LmZpbGxSZWN0KGN1cnJlbnQuY3VycmVudC54IC0gY2FtZXJhLngsIGN1cnJlbnQuY3VycmVudC55IC0gY2FtZXJhLnksIDEwLCAxMClcbiAgICAgICAgZ28uY3R4LnN0cm9rZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVfY3JlZXAoY3JlZXApIHtcbiAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihjcmVlcC54IC0gY2hhcmFjdGVyLngsXG4gICAgY3JlZXAueSAtIGNoYXJhY3Rlci55KVxuXG4gIGNyZWVwLnggPSAoY3JlZXAueCkgKyBjcmVlcC5zcGVlZCAqIC1NYXRoLnNpbihhbmdsZSlcbiAgY3JlZXAueSA9IChjcmVlcC55KSArIGNyZWVwLnNwZWVkICogLU1hdGguY29zKGFuZ2xlKVxufVxuXG5sZXQgY3JlZXBzX2tpbGxlZCA9IDA7XG5mdW5jdGlvbiBjaGVja19jb2xsaXNpb25zKHByb2plY3RpbGVzKSB7XG4gIC8vIGNyZWVwcyBjb2xsaXNpb25cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9qZWN0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBwcm9qZWN0aWxlID0gcHJvamVjdGlsZXNbaV1cbiAgICAvLyBjb25zb2xlLmxvZyhgUHJvamVjdGlsZTogKCR7cHJvamVjdGlsZS5jdXJyZW50Lnh9LCAke3Byb2plY3RpbGUuY3VycmVudC55fSwke3Byb2plY3RpbGUuY3VycmVudC53aWR0aH0sJHtwcm9qZWN0aWxlLmN1cnJlbnQuaGVpZ2h0fSlgKVxuICAgIC8vIGNvbnNvbGUubG9nKGBDcmVlcDogICAgICAoJHtjcmVlcC54fSwgJHtjcmVlcC55fSwke2NyZWVwLndpZHRofSwke2NyZWVwLmhlaWdodH0pYClcbiAgICBmb3IgKHZhciBjcmVlcF9pbmRleCA9IDA7IGNyZWVwX2luZGV4IDwgY3JlZXBzLmxlbmd0aDsgY3JlZXBfaW5kZXgrKykge1xuICAgICAgbGV0IGNyZWVwID0gY3JlZXBzW2NyZWVwX2luZGV4XVxuICAgICAgaWYgKGlzX2NvbGxpZGluZyhwcm9qZWN0aWxlLmN1cnJlbnQsIGNyZWVwKSkge1xuICAgICAgICAvLyByZW1vdmUgcHJvamVjdGlsZXMgZnJvbSBleGlzdGVuY2VcbiAgICAgICAgcHJvamVjdGlsZXMuc3BsaWNlKGksIDEpXG4gICAgICAgIC8vIGRhbWFnZVxuICAgICAgICBjcmVlcC5jdXJyZW50X2hwIC09IDVcbiAgICAgICAgaWYgKGNyZWVwLmlzX2RlYWQoKSkge1xuICAgICAgICAgIGNyZWVwcy5zcGxpY2UoY3JlZXBfaW5kZXgsIDEpXG4gICAgICAgICAgY3JlZXBzX2tpbGxlZCArPSAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBwbGF5ZXIgY29sbGlzaW9uc1xuICBmb3IgKHZhciBjcmVlcF9pbmRleCA9IDA7IGNyZWVwX2luZGV4IDwgY3JlZXBzLmxlbmd0aDsgY3JlZXBfaW5kZXgrKykge1xuICAgIGxldCBjcmVlcCA9IGNyZWVwc1tjcmVlcF9pbmRleF1cbiAgICBpZiAoaXNfY29sbGlkaW5nKGNoYXJhY3RlciwgY3JlZXApKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkhJVFwiKVxuICAgICAgY2hhcmFjdGVyLmN1cnJlbnRfaHAgLT0gNVxuICAgIH1cbiAgfVxufVxuXG4vLyBnYW1lIC0tLVxuZnVuY3Rpb24gZHJhd19zY29yZSgpIHtcbiAgZ28uY3R4LmZvbnQgPSBcIjQ4cHggc2VyaWZcIlxuICBnby5jdHguZmlsbFRleHQoYENyZWVwcyBraWxsZWQ6ICR7Y3JlZXBzX2tpbGxlZH1gLCAxMCwgNTApXG59XG5cbmNvbnN0IHRvd2VyX3Byb2plY3RpbGVzID0gW11cbmZ1bmN0aW9uIFRvd2VyKGdvKSB7XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcInJhZGlhbnRfdG93ZXIucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5wcm9qZWN0aWxlX2ltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5wcm9qZWN0aWxlX2ltYWdlLnNyYyA9IFwiYmx1ZV9maXJlLnBuZ1wiXG4gIHRoaXMuaWQgPSAxXG4gIHRoaXMueCA9IDEwMFxuICB0aGlzLnkgPSAxMDBcbiAgdGhpcy53aWR0aCA9IDUwXG4gIHRoaXMuaGVpZ2h0ID0gMTAwXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMTAwIC0gZ28uY2FtZXJhLngsIChnby5jYW52YXNfcmVjdC5oZWlnaHQgLyA0KSAtIGdvLmNhbWVyYS55KVxuICAgIHRoaXMuZHJhd19wcm9qZWN0aWxlcygpXG4gIH1cbiAgdGhpcy5kcmF3X3Byb2plY3RpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3dlcl9wcm9qZWN0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGN1cnJlbnQgPSB0b3dlcl9wcm9qZWN0aWxlc1tpXVxuICAgICAgaWYgKGN1cnJlbnQuZGlzdGFuY2UgPiAzMDApIHtcbiAgICAgICAgdG93ZXJfcHJvamVjdGlsZXMuc3BsaWNlKGksIDEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50LmRpc3RhbmNlICs9IDVcblxuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKGN1cnJlbnQub3JpZ2luLnggLSBjdXJyZW50LnRhcmdldC54LFxuICAgICAgICAgIGN1cnJlbnQub3JpZ2luLnkgLSBjdXJyZW50LnRhcmdldC55KVxuXG4gICAgICAgIGN1cnJlbnQuY3VycmVudC54ID0gKGN1cnJlbnQub3JpZ2luLngpICsgY3VycmVudC5kaXN0YW5jZSAqIC1NYXRoLnNpbihhbmdsZSlcbiAgICAgICAgY3VycmVudC5jdXJyZW50LnkgPSAoY3VycmVudC5vcmlnaW4ueSkgKyBjdXJyZW50LmRpc3RhbmNlICogLU1hdGguY29zKGFuZ2xlKVxuXG4gICAgICAgIGdvLmN0eC5kcmF3SW1hZ2UodGhpcy5wcm9qZWN0aWxlX2ltYWdlLCBjdXJyZW50LmN1cnJlbnQueCAtIGNhbWVyYS54LCBjdXJyZW50LmN1cnJlbnQueSAtIGNhbWVyYS55LCA1MCwgNTApXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRoaXMuYXR0YWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdG93ZXJfcHJvamVjdGlsZXMucHVzaCh7XG4gICAgICBjdXJyZW50OiB7XG4gICAgICAgIHg6IHRoaXMueCArICh0aGlzLmltYWdlLndpZHRoIC8gMiksXG4gICAgICAgIHk6IHRoaXMueSArICh0aGlzLmltYWdlLmhlaWdodCAvIDIpLFxuICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgIGhlaWdodDogMTBcbiAgICAgIH0sXG4gICAgICBvcmlnaW46IHtcbiAgICAgICAgeDogdGhpcy54ICsgKHRoaXMuaW1hZ2Uud2lkdGggLyAyKSxcbiAgICAgICAgeTogdGhpcy55ICsgKHRoaXMuaW1hZ2UuaGVpZ2h0IC8gMilcbiAgICAgIH0sXG4gICAgICB0YXJnZXQ6IHtcbiAgICAgICAgeDogdGFyZ2V0LngsXG4gICAgICAgIHk6IHRhcmdldC55XG4gICAgICB9LFxuICAgICAgZGlzdGFuY2U6IDIwLFxuICAgIH0pXG4gIH1cbn1cblxuc3RhcnQoKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9