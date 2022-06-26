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
    if (y < 0) { y = 0 }
    if (x < 0) { x = 0 }
    if (x + this.go.canvas_rect.width > this.go.world.width) { x = this.x }
    if (y + this.go.canvas_rect.height > this.go.world.height) { y = this.y }
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
/* harmony import */ var _inventory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inventory */ "./src/inventory.js");




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
  this.direction = "down"
  this.walk_cycle_index = 0
  this.inventory = new _inventory__WEBPACK_IMPORTED_MODULE_2__["default"]();

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
    //this.health_bar.draw(this.hp, this.current_hp)
    //this.mana_bar.draw(this.mana, this.current_mana)
    this.go.ctx.drawImage(this.image, Math.floor(this.walk_cycle_index) * this.image_width, this.get_direction_sprite() * this.image_height, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
  }

  this.get_direction_sprite = function() {
    switch(this.direction) {
      case "right":
        return 2
        break;
      case "up":
        return 3
        break;
      case "left":
        return 1
        break;
      case "down":
        return 0
        break;
    }
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
    this.direction = direction

    switch(direction) {
      case "right":
        if (this.x + this.speed < this.go.world.width) {
          this.x += this.speed
        }
        break;
      case "up":
        if (this.y - this.speed > 0) {
          this.y -= this.speed
        }
        break;
      case "left":
        if (this.x - this.speed > 0) {
          this.x -= this.speed
        }
        break;
      case "down":
        if (this.y + this.speed < this.go.world.height) {
          this.y += this.speed
        }
        break;
    }
    this.walk_cycle_index = (this.walk_cycle_index + (0.03 * this.speed)) % 3
    this.go.camera.focus(this)
  }


  Array.prototype.last = function() { return this[this.length - 1] }
  Array.prototype.first = function() { return this[0] }

  // Stores the temporary target of the movement being executed
  this.target_movement = null
  // Stores the path being calculated
  this.current_path = []
  this.speed = 3

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

/***/ "./src/clickable.js":
/*!**************************!*\
  !*** ./src/clickable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Clickable)
/* harmony export */ });
function Clickable(go, x, y, width, height, image_src) {
  this.go = go
  this.go.clickables.push(this)

  this.name = image_src
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.image = new Image()
  this.image.src = image_src
  this.activated = false
  this.padding = 5

  this.draw = () => {
    this.go.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.width, this.height)
    if (this.activated) {
      this.go.ctx.strokeStyle = "#fff"
      this.go.ctx.strokeRect(this.x - this.padding, this.y - this.padding, this.width + (2*this.padding), this.height + (2*this.padding))
    }
  }

  this.click = () => {
    console.log("Click")
  }
}


/***/ }),

/***/ "./src/controls.js":
/*!*************************!*\
  !*** ./src/controls.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Controls)
/* harmony export */ });
/* harmony import */ var _clickable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clickable.js */ "./src/clickable.js");


function Controls(go) {
  this.go = go
  this.go.controls = this
  this.width = screen.width
  this.height = screen.height * 0.4
  this.arrows = {
    up: new _clickable_js__WEBPACK_IMPORTED_MODULE_0__["default"](go, (this.width / 2) - (80 / 2), (screen.height - this.height) + 10, 80, 80, "arrow_up.png"),
    left: new _clickable_js__WEBPACK_IMPORTED_MODULE_0__["default"](go, 50, (screen.height - this.height) + 60, 80, 80, "arrow_left.png"),
    right: new _clickable_js__WEBPACK_IMPORTED_MODULE_0__["default"](go, (this.width / 2) + 70, (screen.height - this.height) + 60, 80, 80, "arrow_right.png"),
    down: new _clickable_js__WEBPACK_IMPORTED_MODULE_0__["default"](go, (this.width / 2) - (80 / 2), (screen.height - this.height) + 120, 80, 80, "arrow_down.png"),
  }
  this.arrows.up.click = () => go.character.move("up")
  this.arrows.down.click = () => go.character.move("down")
  this.arrows.left.click = () => go.character.move("left")
  this.arrows.right.click = () => go.character.move("right")

  this.draw = () => {
    this.go.ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    this.go.ctx.fillRect(0, screen.height - this.height, this.width, this.height)
    Object.values(this.arrows).forEach(arrow => arrow.draw())
  }
}


/***/ }),

/***/ "./src/doodad.js":
/*!***********************!*\
  !*** ./src/doodad.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Doodad(go) {
  this.go = go

  this.x = 0;
  this.y = 0;
  this.image = new Image();
  this.image.src = "plants.png"
  this.width = 98
  this.x_offset = 127
  this.height = 126
  this.y_offset = 290

  this.draw = function() {
    this.go.ctx.drawImage(this.image, this.x_offset, this.y_offset, this.width, this.height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Doodad);


/***/ }),

/***/ "./src/events_callbacks.js":
/*!*********************************!*\
  !*** ./src/events_callbacks.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setClickCallback": () => (/* binding */ setClickCallback),
/* harmony export */   "setMouseMoveCallback": () => (/* binding */ setMouseMoveCallback),
/* harmony export */   "setMousedownCallback": () => (/* binding */ setMousedownCallback),
/* harmony export */   "setMousemoveCallback": () => (/* binding */ setMousemoveCallback),
/* harmony export */   "setMouseupCallback": () => (/* binding */ setMouseupCallback),
/* harmony export */   "setTouchendCallback": () => (/* binding */ setTouchendCallback),
/* harmony export */   "setTouchstartCallback": () => (/* binding */ setTouchstartCallback)
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

function setCallback(go, event) {
  const callbacks = []
  const handler = (e) => {
    callbacks.forEach((callback) => {
      callback(e)
    })
  }
  go.canvas.addEventListener(event, handler, false)
  return callbacks;
}

function setMouseMoveCallback(go) {
  return setCallback(go, 'mousemove');
}

function setMousedownCallback(go) {
  return setCallback(go, 'mousedown');
}

function setMouseupCallback(go) {
  return setCallback(go, 'mouseup');
}

function setTouchstartCallback(go) {
  return setCallback(go, 'touchstart');
}

function setTouchendCallback(go) {
  return setCallback(go, 'touchend');
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
  this.update = function () {}
  this.loop = function() {
    try {
      this.process_keys_down()
      this.update()
      this.draw()
    } catch(e) {
      console.log(e)
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
  this.canvas.setAttribute('width', this.canvas_rect.width);
  this.canvas.setAttribute('height', this.canvas_rect.height);
  this.ctx = ctx
  this.tile_size = 20
  this.clickables = []
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameObject);


/***/ }),

/***/ "./src/inventory.js":
/*!**************************!*\
  !*** ./src/inventory.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Inventory)
/* harmony export */ });
function Inventory() {
  this.max_slots = 10
  this.slots = []
  this.add = (item) => {
    const existing_bundle = this.slots.find((bundle) => {
      return bundle.name == item.name
    })

    if ((this.slots.length >= this.max_slots) && (!existing_bundle)) return

    console.log(`*** Got ${item.quantity} ${item.name}`)
    if (existing_bundle) {
      existing_bundle.quantity += item.quantity
    } else {
      this.slots.push(item)
    }
  }
  this.find = (item_name) => {
    return this.slots.find((bundle) => {
      return bundle.name == item_name
    })
  }

  this.draw = () => {
    this.go.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.go.ctx.fillRect(20, 20, 200, 200);

    this.go.ctx.fillStyle = "rgb(60, 40, 0)"
    this.go.ctx.fillRect(25, 25, 50, 50)

    this.go.ctx.fillStyle = "rgb(0, 0, 0)"
    this.go.ctx.fillRect(30, 30, 40, 40)
  }
}


/***/ }),

/***/ "./src/item.js":
/*!*********************!*\
  !*** ./src/item.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Item)
/* harmony export */ });
function Item(name, image = new Image(), quantity = 1) {
  this.name = name
  this.image = image
  this.quantity = quantity
}


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
    // These are callbacks that only get checked once on the event
    if (this.on_keydown_callbacks[ev.key] === undefined) {
      this.on_keydown_callbacks[ev.key] = []
    }
    this.on_keydown_callbacks[ev.key].forEach((callback) => callback())
  }
  window.addEventListener("keydown", on_keydown, false)
  const on_keyup = (ev) => {
    this.keys_currently_down[ev.key] = false
  }
  window.addEventListener("keyup", on_keyup, false)

  this.go = go;
  this.go.keyboard_input = this
  this.key_callbacks = {
    d: [() => this.go.character.move("right")],
    w: [() => this.go.character.move("up")],
    a: [() => this.go.character.move("left")],
    s: [() => this.go.character.move("down")],
  }
  this.on_keydown_callbacks = {
    1: []
  }

  this.process_keys_down = () => {
    const keys_down = Object.keys(this.keys_currently_down).filter((key) => this.keys_currently_down[key] === true)
    keys_down.forEach((key) => {
      if (!(Object.keys(this.key_callbacks).includes(key))) return

      this.key_callbacks[key].forEach((callback) => callback())
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

/***/ "./src/loot.js":
/*!*********************!*\
  !*** ./src/loot.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Loot)
/* harmony export */ });
class Loot {
    constructor(item, quantity = 1) {
        this.item = item
        this.quantity = quantity
    }
}

/***/ }),

/***/ "./src/loot_box.js":
/*!*************************!*\
  !*** ./src/loot_box.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./item */ "./src/item.js");
/* harmony import */ var _loot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loot */ "./src/loot.js");



class LootBox {
    constructor(go) {
        this.visible = false
        this.go = go
        this.items = []
        this.x = 0
        this.y = 0
        this.width = 350
    }

    draw() {
        if (!this.visible) return;

        this.go.ctx.fillStyle = "rgba(255, 200, 255, 0.5)";
        this.go.ctx.lineJoin = 'bevel';
        this.go.ctx.fillRect(this.x + 20 - this.go.camera.x, this.y + 20 - this.go.camera.y, this.width, this.items.length * 60 + 5);

        for (let index = 0; index < this.items.length; index++) {
            let loot = this.items[index]
            this.go.ctx.fillStyle = "rgb(0, 0, 0)"
            loot.x = this.x + 25 - this.go.camera.x
            loot.y = this.y + (index * 60) + 25 - this.go.camera.y
            loot.width = 340
            loot.height = 55
            this.go.ctx.fillRect(loot.x, loot.y, loot.width, loot.height)
            this.go.ctx.drawImage(loot.item.image, loot.x + 5, loot.y + (index * 60) + 5, 45, 45)
            this.go.ctx.fillStyle = "rgb(255, 255, 255)"
            this.go.ctx.font = '22px serif'
            this.go.ctx.fillText(loot.quantity, loot.x + 65, loot.y + (index * 60) + 35)
            this.go.ctx.fillText(loot.item.name, loot.x + 100, loot.y + (index * 60) + 35)
        }
    }

    take_loot(loot_index) {
        let loot = this.items.splice(loot_index, 1)[0]
        this.go.character.inventory.add(loot.item)
        if (this.items.length <= 0) this.visible = false
    }

    check_item_clicked(ev) {
        if (!this.visible) return

        let index = this.items.findIndex((loot) => {
            return (
                (ev.clientX >= loot.x) &&
                (ev.clientX <= loot.x + loot.width) &&
                (ev.clientY >= loot.y) &&
                (ev.clientY <= loot.y + loot.height)
            )
        })

        if (index > -1) {
            this.take_loot(index)
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LootBox);

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
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");


function Screen(go) {
  this.go = go
  this.go.screen = this
  this.width  = this.go.canvas_rect.width;
  this.height = this.go.canvas_rect.height;

  this.clear = () => {
    this.go.ctx.clearRect(0, 0, this.go.canvas.width, this.go.canvas.height);
  }

  this.draw = () => {
    this.clear()
    this.go.world.draw()
  }

  this.draw_game_over = () => {
    this.go.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    this.go.ctx.fillRect(0, 0, this.go.canvas.width, this.go.canvas.height);
    this.go.ctx.fillStyle = "white"
    this.go.ctx.font = '72px serif'
    this.go.ctx.fillText("Game Over", (this.go.canvas.width / 2) - (this.go.ctx.measureText("Game Over").width / 2), this.go.canvas.height / 2);
  }

  this.draw_fog = () => {
    var x = this.go.character.x + this.go.character.width / 2 - this.go.camera.x
    var y = this.go.character.y + this.go.character.height / 2 - this.go.camera.y
    var gradient = this.go.ctx.createRadialGradient(x, y, 100, x, y, 200);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
    this.go.ctx.fillStyle = gradient
    this.go.ctx.fillRect(0, 0, screen.width, screen.height)
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Screen);


/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Server)
/* harmony export */ });
function Server(go) {
  this.go = go

  //this.conn = new WebSocket("ws://localhost:8999")
  this.conn = new WebSocket("ws://nubaria.herokuapp.com:54082")
  this.conn.onopen = () => this.login(this.go.character)
  this.conn.onmessage = function(event) {
    let payload = JSON.parse(event.data)
    switch (payload.action) {
      case "login":
        let new_char = new Character(go)
        new_char.name = payload.data.character.name
        new_char.x = payload.data.character.x
        new_char.y = payload.data.character.y
        console.log(`Adding new char`)
        players.push(new_char)
        break;

      case "ping":
        //go.ctx.fillRect(payload.data.character.x, payload.data.character.y, 50, 50)
        //go.ctx.stroke()
        //let player = players[0] //players.find(player => player.name === payload.data.character.name)
        //if (player) {
        //  player.x = payload.data.character.x
        //  player.y = payload.data.character.y
        //}
        //break;
    }
  } //
  this.login = function(character) {
    let payload = {
      action: "login",
      data: {
        character: {
          name: character.name,
          x: character.x,
          y: character.y
        }
      }
    }
    this.conn.send(JSON.stringify(payload))
  }

  this.ping = function(character) {
    let payload = {
      action: "ping",
      data: {
        character: {
          name: character.name, 
          x: character.x,
          y: character.y
        }
      }
    }
    this.conn.send(JSON.stringify(payload))
  }
}


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
/* harmony export */   "is_colliding": () => (/* binding */ is_colliding),
/* harmony export */   "random": () => (/* binding */ random)
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

const random = (start, end) => {
  if (end == undefined) {
    end = start
    start = 0
  }
  return Math.trunc(Math.random() * end) + start  
}




/***/ }),

/***/ "./src/tile.js":
/*!*********************!*\
  !*** ./src/tile.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Tile {
    constructor(image_src, x_offset = 0, y_offset = 0, width, height) {
        this.image = new Image()
        this.image.src = image_src
        this.x_offset = x_offset
        this.y_offset = y_offset
        this.width = width
        this.height = height
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tile);

/***/ }),

/***/ "./src/world.js":
/*!**********************!*\
  !*** ./src/world.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tile */ "./src/tile.js");


function World(go) {
  this.go = go;
  this.go.world = this;
  this.width = 10000;
  this.height = 10000;
  this.tile_set = {
    grass: new _tile__WEBPACK_IMPORTED_MODULE_0__["default"]("grass.png", 0, 0, 64, 63),
    dirt: new _tile__WEBPACK_IMPORTED_MODULE_0__["default"]("dirt2.png", 0, 0, 64, 63)
  }
  this.pick_random_tile = () => {
    let rng = Math.random() * 100;
    if (rng <= 3) {
      return this.tile_set.grass
      //return this.tile_set.dirt
    } else {
      return this.tile_set.grass
    }
  }
  this.tile_width = 64
  this.tile_height = 64
  this.tiles_per_row = Math.trunc(this.width / this.tile_width) + 1;
  this.tiles_per_column = Math.trunc(this.height / this.tile_height) + 1;
  this.tiles = null;
  this.generate_map = () => {
    this.tiles = new Array(this.tiles_per_row);
    for (let row = 0; row <= this.tiles_per_row; row++) {
      for (let column = 0; column <= this.tiles_per_column; column++) {
        if (this.tiles[row] === undefined) {
          this.tiles[row] = [this.pick_random_tile()]
        } else {
          this.tiles[row].push(this.pick_random_tile())
        }
      }
    }
  }
  this.draw = () => {
    for (let row = 0; row <= this.tiles_per_row; row++) {
      for (let column = 0; column <= this.tiles_per_column; column++) {
        let tile = this.tiles[row][column]
        if (tile !== this.tile_set.grass) {
          this.go.ctx.drawImage(this.tile_set.grass.image,
            this.tile_set.grass.x_offset, this.tile_set.grass.y_offset, this.tile_set.grass.width, this.tile_set.grass.height,
            (row * this.tile_width) - this.go.camera.x, (column * this.tile_height) - this.go.camera.y, 64, 64)
        }
        this.go.ctx.drawImage(tile.image,
          tile.x_offset, tile.y_offset, tile.width, tile.height,
          (row * this.tile_width) - this.go.camera.x, (column * this.tile_height) - this.go.camera.y, 64, 64)
      }
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (World);


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
/* harmony import */ var _world_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./world.js */ "./src/world.js");
/* harmony import */ var _doodad_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./doodad.js */ "./src/doodad.js");
/* harmony import */ var _controls_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./controls.js */ "./src/controls.js");
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./item */ "./src/item.js");
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./server */ "./src/server.js");
/* harmony import */ var _tile_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tile.js */ "./src/tile.js");
/* harmony import */ var _loot_box_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./loot_box.js */ "./src/loot_box.js");
/* harmony import */ var _loot_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./loot.js */ "./src/loot.js");

















const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
const character = new _character_js__WEBPACK_IMPORTED_MODULE_3__["default"](go)
const keyboard_input = new _keyboard_input_js__WEBPACK_IMPORTED_MODULE_4__["default"](go)
const world = new _world_js__WEBPACK_IMPORTED_MODULE_8__["default"](go)
const controls = new _controls_js__WEBPACK_IMPORTED_MODULE_10__["default"](go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const server = new _server__WEBPACK_IMPORTED_MODULE_12__["default"](go)
const loot_box = new _loot_box_js__WEBPACK_IMPORTED_MODULE_14__["default"](go)

const click_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setClickCallback)(go)
click_callbacks.push(clickable_clicked)
function clickable_clicked(ev) {
  go.clickables.forEach((clickable) => {
    let click = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
    if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.is_colliding)(clickable, click)) {
      clickable.activated = !clickable.activated
    }
  })
}

let mouse_is_down = false
let mouse_position = {}
const mousemove_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMouseMoveCallback)(go)
mousemove_callbacks.push(track_mouse_position)
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y
  }
}
const mousedown_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMousedownCallback)(go)
mousedown_callbacks.push((ev) => mouse_is_down = true)
const mouseup_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMouseupCallback)(go)
mouseup_callbacks.push((ev) => mouse_is_down = false)
mouseup_callbacks.push(loot_box.check_item_clicked.bind(loot_box))
const touchstart_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setTouchstartCallback)(go)
touchstart_callbacks.push((ev) => mouse_is_down = true)
const touchend_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setTouchendCallback)(go)
touchend_callbacks.push((ev) => mouse_is_down = false)
function controls_movement() {
  go.clickables.forEach((clickable) => {
    if (clickable.activated) {
      clickable.click()
    }
  })
}

const trees = []
Array.from(Array(300)).forEach((j, i) => {
  let tree = new _doodad_js__WEBPACK_IMPORTED_MODULE_9__["default"](go)
  tree.x = Math.trunc(Math.random() * go.world.width) - tree.width;
  tree.y = Math.trunc(Math.random() * go.world.height) - tree.height;
  trees.push(tree)
})

const FPS = 16.66

const update = () => {
  controls_movement()
}

const draw = () => {
  screen.draw()
  character.draw()
  trees.forEach(tree => tree.draw())
  screen.draw_fog()
  loot_box.draw()
  // controls.draw()
}

const dice = (sides, times = 1) => {
  return Array.from(Array(times)).map((i) => Math.floor(Math.random() * sides) + 1);
}


const make_fire = () => {
  let dry_leaves = character.inventory.find("dry leaves")
  let wood = character.inventory.find("wood")
  if (dry_leaves && dry_leaves.quantity > 0 && wood && wood.quantity > 0) {
    dry_leaves.quantity -= 1
    wood.quantity -= 1
    let row_index = Math.floor(character.x / 64)
    let column_index = Math.floor(character.y / 64)
    go.world.tiles[row_index][column_index] = new _tile_js__WEBPACK_IMPORTED_MODULE_13__["default"]("bonfire.png", 250, 300, 290, 250)
  } else {
    console.log("You dont have all required materials to make a fire.")
  }
}

const cut_tree = () => {
  const targeted_tree = trees.find((tree) => _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(tree, character) < 100)
  if (targeted_tree) {
    const index = trees.indexOf(targeted_tree)
    if (index > -1) {
      const wood_total = (0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.random)(1, 5)
      const item_bundle = new _item__WEBPACK_IMPORTED_MODULE_11__["default"]("wood")
      item_bundle.image.src = "branch.png"
      const wood_loot = new _loot_js__WEBPACK_IMPORTED_MODULE_15__["default"](item_bundle, wood_total)
      loot_box.items.push(wood_loot)
      loot_box.visible = true
      loot_box.x = character.x
      loot_box.y = character.y
      item_bundle.quantity = wood_total
      character.inventory.add(item_bundle)
      let dry_leaves_roll = dice(10)
      if (dry_leaves_roll > 7) {
        character.inventory.add(new _item__WEBPACK_IMPORTED_MODULE_11__["default"]("dry leaves", 1))
      }

      trees.splice(index, 1)
    }
  }
}

keyboard_input.key_callbacks["f"] = [cut_tree]

const game_loop = new _game_loop_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down
game_loop.update = update
keyboard_input.on_keydown_callbacks[1].push(() => make_fire())

const start = () => {
  character.x = 100
  character.y = 100
  go.world.generate_map()

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0FDMUJ2QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7QUNiVjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLDJCQUEyQixlQUFlLEVBQUUsVUFBVTtBQUN0RDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDakNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsYUFBYSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNuRGQ7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDTDBCO0FBQ0E7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsMkJBQTJCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQzVEZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEJXOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7QUNwQ047QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4REE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFK0Q7Ozs7Ozs7Ozs7Ozs7OztBQ2xDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWU7Ozs7Ozs7Ozs7Ozs7OztBQ1hVOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDZDQUFJO0FBQ25CLGNBQWMsNkNBQUk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDJCQUEyQjtBQUNqRCwyQkFBMkIsaUNBQWlDO0FBQzVEO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDJCQUEyQjtBQUNqRCwyQkFBMkIsaUNBQWlDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLEtBQUssRUFBQzs7Ozs7OztVQ3REckI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ055QztBQUNUO0FBQ0E7QUFDTTtBQUNTO0FBQ1k7QUFRN0I7QUFDTztBQUNQO0FBQ0U7QUFDSTtBQUNYO0FBQ0k7QUFDRDtBQUNPO0FBQ1A7O0FBRTVCLGVBQWUsdURBQVU7QUFDekIsbUJBQW1CLGtEQUFNO0FBQ3pCLG1CQUFtQixrREFBTTtBQUN6QixzQkFBc0IscURBQVM7QUFDL0IsMkJBQTJCLDBEQUFhO0FBQ3hDLGtCQUFrQixpREFBSztBQUN2QixxQkFBcUIscURBQVE7QUFDN0IsMkJBQTJCLG1EQUFtRDtBQUM5RSxtQkFBbUIsZ0RBQU07QUFDekIscUJBQXFCLHFEQUFPOztBQUU1Qix3QkFBd0Isc0VBQWdCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQixRQUFRLHdEQUFZO0FBQ3BCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QiwwRUFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwwRUFBb0I7QUFDaEQ7QUFDQSwwQkFBMEIsd0VBQWtCO0FBQzVDO0FBQ0E7QUFDQSw2QkFBNkIsMkVBQXFCO0FBQ2xEO0FBQ0EsMkJBQTJCLHlFQUFtQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixrREFBTTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxpREFBSTtBQUN0RCxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLHdEQUFnQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsa0RBQU07QUFDL0IsOEJBQThCLDhDQUFJO0FBQ2xDO0FBQ0EsNEJBQTRCLGlEQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsOENBQUk7QUFDeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0JBQXNCLHFEQUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NhbWVyYS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NsaWNrYWJsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NvbnRyb2xzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZG9vZGFkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZXZlbnRzX2NhbGxiYWNrcy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfbG9vcC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfb2JqZWN0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvaW52ZW50b3J5LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvaXRlbS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2tleWJvYXJkX2lucHV0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbG9vdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3RfYm94LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcmVzb3VyY2VfYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2NyZWVuLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2VydmVyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIENhbWVyYShnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jYW1lcmEgPSB0aGlzXG4gIHRoaXMueCA9IDBcbiAgdGhpcy55ID0gMFxuICB0aGlzLmNhbWVyYV9zcGVlZCA9IDNcblxuICB0aGlzLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UgPSAoZXYpID0+IHtcbiAgICAvL2lmICh0aGlzLmdvLmVkaXRvci5wYWludF9tb2RlKSByZXR1cm5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgYm90dG9tIG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPCAxMDApIHtcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IHkgKyB0aGUgbW92ZW1lbnQgd2UnbGwgbWFrZSBmdXJ0aGVyIHRoZXJlIGlzIGdyZWF0ZXIgdGhhblxuICAgICAgLy8gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgc2NyZWVuIG1pbnVzIHRoZSBoZWlnaHQgdGhhdCB3aWxsIGFscmVhZHkgYmUgdmlzaWJsZVxuICAgICAgLy8gKHRoZSBjYW52YXMgaGVpZ2h0KSwgZG9uJ3QgZ28gZnVydGhlciBvd25cbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLmhlaWdodCAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSB0b3Agb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIDEwMCkge1xuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA8IDEwMCkge1xuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4ud2lkdGggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gMTAwKSB7XG4gICAgICAvLyBEb24ndCBnbyBmdXJ0aGVyIGxlZnRcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZm9jdXMgPSAocG9pbnQpID0+IHtcbiAgICBsZXQgeCA9IHBvaW50LnggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICAgIGxldCB5ID0gcG9pbnQueSAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICAgIC8vIHNwZWNpZmljIG1hcCBjdXRzIChpdCBoYXMgYSBtYXAgb2Zmc2V0IG9mIDYwLDE2MClcbiAgICBpZiAoeSA8IDApIHsgeSA9IDAgfVxuICAgIGlmICh4IDwgMCkgeyB4ID0gMCB9XG4gICAgaWYgKHggKyB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoID4gdGhpcy5nby53b3JsZC53aWR0aCkgeyB4ID0gdGhpcy54IH1cbiAgICBpZiAoeSArIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0ID4gdGhpcy5nby53b3JsZC5oZWlnaHQpIHsgeSA9IHRoaXMueSB9XG4gICAgLy8gb2Zmc2V0IGNoYW5nZXMgZW5kXG4gICAgdGhpcy54ID0geFxuICAgIHRoaXMueSA9IHlcbiAgfVxuXG4gIHRoaXMuZ2xvYmFsX2Nvb3JkcyA9IChvYmopID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub2JqLFxuICAgICAgeDogb2JqLnggLSB0aGlzLngsXG4gICAgICB5OiBvYmoueSAtIHRoaXMueVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW1lcmFcbiIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5pbXBvcnQgSW52ZW50b3J5IGZyb20gXCIuL2ludmVudG9yeVwiXG5cbmZ1bmN0aW9uIENoYXJhY3RlcihnbywgaWQpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2hhcmFjdGVyID0gdGhpc1xuICB0aGlzLmVkaXRvciA9IGdvLmVkaXRvclxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJjcmlzaXNjb3JlcGVlcHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pZCA9IGlkXG4gIHRoaXMueCA9IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gIHRoaXMueSA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBcImRvd25cIlxuICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAwXG4gIHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSgpO1xuXG4gIC8vIENvbWJhdFxuICB0aGlzLmhwID0gMTAwLjBcbiAgdGhpcy5jdXJyZW50X2hwID0gMTAwLjBcblxuICB0aGlzLm1hbmEgPSAxMC4wXG4gIHRoaXMuY3VycmVudF9tYW5hID0gMTAuMFxuICAvLyBFTkQgQ29tYmF0XG5cbiAgdGhpcy5oZWFsdGhfYmFyID0gbmV3IFJlc291cmNlQmFyKGdvLCB7IGNoYXJhY3RlcjogdGhpcywgb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMubWFuYV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoZ28sIHsgY2hhcmFjdGVyOiB0aGlzLCBvZmZzZXQ6IDEwLCBjb2xvdXI6IFwiYmx1ZVwiIH0pXG5cbiAgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdXG5cbiAgdGhpcy5pc19kZWFkID0gKCkgPT4gdGhpcy5jdXJyZW50X2hwIDw9IDBcbiAgdGhpcy5pc19hbGl2ZSA9ICgpID0+ICFpc19kZWFkXG5cbiAgdGhpcy5tb3ZlX3RvX3dheXBvaW50ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jb29yZHMobm9kZSlcbiAgfVxuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24oY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMudGFyZ2V0X21vdmVtZW50KSB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KClcbiAgICAvL3RoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuaHAsIHRoaXMuY3VycmVudF9ocClcbiAgICAvL3RoaXMubWFuYV9iYXIuZHJhdyh0aGlzLm1hbmEsIHRoaXMuY3VycmVudF9tYW5hKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG5cbiAgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHJldHVybiAyXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHJldHVybiAzXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICByZXR1cm4gMFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50ID0gdGhpcy50YXJnZXRfbW92ZW1lbnQpIHtcbiAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgIHRoaXMuZ28uY3R4LmFyYygodGFyZ2V0X21vdmVtZW50LnggLSB0aGlzLmdvLmNhbWVyYS54KSArIDEwLCAodGFyZ2V0X21vdmVtZW50LnkgLSB0aGlzLmdvLmNhbWVyYS55KSArIDEwLCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vIEFVVE8tTU9WRSAocGF0aGZpbmRlcikgLS0gcmVuYW1lIGl0IHRvIG1vdmUgd2hlbiB1c2luZyBwbGF5Z3JvdW5kXG4gIHRoaXMuYXV0b19tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmVtZW50X2JvYXJkLmxlbmd0aCA9PT0gMCkgeyB0aGlzLm1vdmVtZW50X2JvYXJkID0gW10uY29uY2F0KHRoaXMuZ28uYm9hcmQuZ3JpZCkgfVxuICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmdvLmJvYXJkLnRhcmdldF9ub2RlKVxuICB9XG4gIFxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cblxuICAgIHN3aXRjaChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICBpZiAodGhpcy54ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQud2lkdGgpIHtcbiAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIGlmICh0aGlzLnkgLSB0aGlzLnNwZWVkID4gMCkge1xuICAgICAgICAgIHRoaXMueSAtPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICBpZiAodGhpcy54IC0gdGhpcy5zcGVlZCA+IDApIHtcbiAgICAgICAgICB0aGlzLnggLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgaWYgKHRoaXMueSArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLmhlaWdodCkge1xuICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9ICh0aGlzLndhbGtfY3ljbGVfaW5kZXggKyAoMC4wMyAqIHRoaXMuc3BlZWQpKSAlIDNcbiAgICB0aGlzLmdvLmNhbWVyYS5mb2N1cyh0aGlzKVxuICB9XG5cblxuICBBcnJheS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIH1cbiAgQXJyYXkucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICAvLyBTdG9yZXMgdGhlIHRlbXBvcmFyeSB0YXJnZXQgb2YgdGhlIG1vdmVtZW50IGJlaW5nIGV4ZWN1dGVkXG4gIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gbnVsbFxuICAvLyBTdG9yZXMgdGhlIHBhdGggYmVpbmcgY2FsY3VsYXRlZFxuICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gIHRoaXMuc3BlZWQgPSAzXG5cbiAgdGhpcy5maW5kX3BhdGggPSAodGFyZ2V0X21vdmVtZW50KSA9PiB7XG4gICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgIHRoaXMubW92aW5nID0gZmFsc2VcblxuICAgIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gdGFyZ2V0X21vdmVtZW50XG5cbiAgICBpZiAodGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyB4OiB0aGlzLnggKyB0aGlzLnNwZWVkLCB5OiB0aGlzLnkgKyB0aGlzLnNwZWVkIH0pXG4gICAgfVxuXG4gICAgdmFyIGxhc3Rfc3RlcCA9IHt9XG4gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHt9XG5cbiAgICBkbyB7XG4gICAgICBsYXN0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aFt0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggLSAxXVxuICAgICAgZnV0dXJlX21vdmVtZW50ID0geyB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9XG5cbiAgICAgIC8vIFRoaXMgY29kZSB3aWxsIGtlZXAgdHJ5aW5nIHRvIGdvIGJhY2sgdG8gdGhlIHNhbWUgcHJldmlvdXMgZnJvbSB3aGljaCB3ZSBqdXN0IGJyYW5jaGVkIG91dFxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC54ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG5cbiAgICAgIC8vIFRoaXMgaXMgcHJldHR5IGhlYXZ5Li4uIEl0J3MgY2FsY3VsYXRpbmcgYWdhaW5zdCBhbGwgdGhlIGJpdHMgaW4gdGhlIG1hcCA9W1xuICAgICAgdmFyIGdvaW5nX3RvX2NvbGxpZGUgPSB0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKVxuICAgICAgaWYgKGdvaW5nX3RvX2NvbGxpZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbGxpc2lvbiBhaGVhZCEnKVxuICAgICAgICB2YXIgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC54ID0gbmV4dF9tb3ZlbWVudC54IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIG9uIFlcIilcbiAgICAgICAgfVxuICAgICAgICBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnkgPSBuZXh0X21vdmVtZW50LnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgWFwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9KVxuICAgIH0gd2hpbGUgKChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkgfHwgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSlcblxuICAgIHRoaXMubW92aW5nID0gdHJ1ZVxuICB9XG5cbiAgdGhpcy5tb3ZlX29uX3BhdGggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB2YXIgbmV4dF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGguc2hpZnQoKVxuICAgICAgaWYgKG5leHRfc3RlcCkge1xuICAgICAgICB0aGlzLnggPSBuZXh0X3N0ZXAueFxuICAgICAgICB0aGlzLnkgPSBuZXh0X3N0ZXAueVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy90aGlzLm1vdmUgPSBmdW5jdGlvbih0YXJnZXRfbW92ZW1lbnQpIHtcbiAgLy8gIGlmICh0aGlzLm1vdmluZykge1xuICAvLyAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9XG5cbiAgLy8gICAgaWYgKChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA8PSAxKSAmJiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPD0gMSkpIHtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAvLyAgICAgIHRhcmdldF9tb3ZlbWVudCA9IHt9XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJTdG9wcGVkXCIpO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQodGFyZ2V0X21vdmVtZW50KVxuXG4gIC8vICAgICAgLy8gUGF0aGluZ1xuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICB9XG5cbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LndpZHRoID0gdGhpcy53aWR0aFxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcblxuICAvLyAgICBpZiAoKHRoaXMuZ28uZW50aXRpZXMuZXZlcnkoKGVudGl0eSkgPT4gZW50aXR5LmlkID09PSB0aGlzLmlkIHx8ICFpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBlbnRpdHkpICkpICYmXG4gIC8vICAgICAgKCF0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKSkpIHtcbiAgLy8gICAgICB0aGlzLnggPSBmdXR1cmVfbW92ZW1lbnQueFxuICAvLyAgICAgIHRoaXMueSA9IGZ1dHVyZV9tb3ZlbWVudC55XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJCbG9ja2VkXCIpO1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgLy8gICAgfVxuICAvLyAgfVxuICAvLyAgLy8gRU5EIC0gQ2hhcmFjdGVyIE1vdmVtZW50XG4gIC8vfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENsaWNrYWJsZShnbywgeCwgeSwgd2lkdGgsIGhlaWdodCwgaW1hZ2Vfc3JjKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaCh0aGlzKVxuXG4gIHRoaXMubmFtZSA9IGltYWdlX3NyY1xuICB0aGlzLnggPSB4XG4gIHRoaXMueSA9IHlcbiAgdGhpcy53aWR0aCA9IHdpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICB0aGlzLmFjdGl2YXRlZCA9IGZhbHNlXG4gIHRoaXMucGFkZGluZyA9IDVcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0LCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgaWYgKHRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiI2ZmZlwiXG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCAtIHRoaXMucGFkZGluZywgdGhpcy55IC0gdGhpcy5wYWRkaW5nLCB0aGlzLndpZHRoICsgKDIqdGhpcy5wYWRkaW5nKSwgdGhpcy5oZWlnaHQgKyAoMip0aGlzLnBhZGRpbmcpKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbGlja1wiKVxuICB9XG59XG4iLCJpbXBvcnQgQ2xpY2thYmxlIGZyb20gXCIuL2NsaWNrYWJsZS5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnRyb2xzKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNvbnRyb2xzID0gdGhpc1xuICB0aGlzLndpZHRoID0gc2NyZWVuLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gc2NyZWVuLmhlaWdodCAqIDAuNFxuICB0aGlzLmFycm93cyA9IHtcbiAgICB1cDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEwLCA4MCwgODAsIFwiYXJyb3dfdXAucG5nXCIpLFxuICAgIGxlZnQ6IG5ldyBDbGlja2FibGUoZ28sIDUwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfbGVmdC5wbmdcIiksXG4gICAgcmlnaHQ6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgKyA3MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X3JpZ2h0LnBuZ1wiKSxcbiAgICBkb3duOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTIwLCA4MCwgODAsIFwiYXJyb3dfZG93bi5wbmdcIiksXG4gIH1cbiAgdGhpcy5hcnJvd3MudXAuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXG4gIHRoaXMuYXJyb3dzLmRvd24uY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImRvd25cIilcbiAgdGhpcy5hcnJvd3MubGVmdC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKVxuICB0aGlzLmFycm93cy5yaWdodC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIilcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMilcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFycm93cykuZm9yRWFjaChhcnJvdyA9PiBhcnJvdy5kcmF3KCkpXG4gIH1cbn1cbiIsImZ1bmN0aW9uIERvb2RhZChnbykge1xuICB0aGlzLmdvID0gZ29cblxuICB0aGlzLnggPSAwO1xuICB0aGlzLnkgPSAwO1xuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJwbGFudHMucG5nXCJcbiAgdGhpcy53aWR0aCA9IDk4XG4gIHRoaXMueF9vZmZzZXQgPSAxMjdcbiAgdGhpcy5oZWlnaHQgPSAxMjZcbiAgdGhpcy55X29mZnNldCA9IDI5MFxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLnhfb2Zmc2V0LCB0aGlzLnlfb2Zmc2V0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9vZGFkO1xuIiwiLy8gVGhlIGNhbGxiYWNrcyBzeXN0ZW1cbi8vIFxuLy8gVG8gdXNlIGl0OlxuLy9cbi8vICogaW1wb3J0IHRoZSBjYWxsYmFja3MgeW91IHdhbnRcbi8vXG4vLyAgICBpbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuLy9cbi8vICogY2FsbCB0aGVtIGFuZCBzdG9yZSB0aGUgYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zXG4vL1xuLy8gICAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKTtcbi8vXG4vLyAqIGFkZCBvciByZW1vdmUgY2FsbGJhY2tzIGZyb20gYXJyYXlcbi8vXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmZ1bmN0aW9uIHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4gIHJldHVybiBtb3VzZW1vdmVfY2FsbGJhY2tzO1xufVxuXG5cbmZ1bmN0aW9uIHNldENsaWNrQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fY2xpY2sgID0gKGV2KSA9PiB7XG4gICAgY2xpY2tfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcbiAgcmV0dXJuIGNsaWNrX2NhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0Q2FsbGJhY2soZ28sIGV2ZW50KSB7XG4gIGNvbnN0IGNhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4ge1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZSlcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSlcbiAgcmV0dXJuIGNhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vtb3ZlJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ21vdXNlZG93bicpO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2V1cCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hzdGFydCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoZW5kJyk7XG59XG5cbmV4cG9ydCB7XG4gIHNldE1vdXNlbW92ZUNhbGxiYWNrLFxuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufTtcbiIsIi8vIFRoZSBHYW1lIExvb3Bcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBjb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuLy8gZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG4vLyBnYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBwcm9jZXNzX2tleXNfZG93blxuLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xuXG5mdW5jdGlvbiBHYW1lTG9vcCgpIHtcbiAgdGhpcy5kcmF3ID0gbnVsbFxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gbnVsbFxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHt9XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duKClcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIHRoaXMuZHJhdygpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVMb29wXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuY2FudmFzX3JlY3Qud2lkdGgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FudmFzX3JlY3QuaGVpZ2h0KTtcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNsaWNrYWJsZXMgPSBbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZlbnRvcnkoKSB7XG4gIHRoaXMubWF4X3Nsb3RzID0gMTBcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuYWRkID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZ19idW5kbGUgPSB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lID09IGl0ZW0ubmFtZVxuICAgIH0pXG5cbiAgICBpZiAoKHRoaXMuc2xvdHMubGVuZ3RoID49IHRoaXMubWF4X3Nsb3RzKSAmJiAoIWV4aXN0aW5nX2J1bmRsZSkpIHJldHVyblxuXG4gICAgY29uc29sZS5sb2coYCoqKiBHb3QgJHtpdGVtLnF1YW50aXR5fSAke2l0ZW0ubmFtZX1gKVxuICAgIGlmIChleGlzdGluZ19idW5kbGUpIHtcbiAgICAgIGV4aXN0aW5nX2J1bmRsZS5xdWFudGl0eSArPSBpdGVtLnF1YW50aXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2xvdHMucHVzaChpdGVtKVxuICAgIH1cbiAgfVxuICB0aGlzLmZpbmQgPSAoaXRlbV9uYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUgPT0gaXRlbV9uYW1lXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC44KVwiO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDIwLCAyMCwgMjAwLCAyMDApO1xuXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoNjAsIDQwLCAwKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMjUsIDI1LCA1MCwgNTApXG5cbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMzAsIDMwLCA0MCwgNDApXG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEl0ZW0obmFtZSwgaW1hZ2UgPSBuZXcgSW1hZ2UoKSwgcXVhbnRpdHkgPSAxKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5pbWFnZSA9IGltYWdlXG4gIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxufVxuIiwiZnVuY3Rpb24gS2V5Ym9hcmRJbnB1dChnbykge1xuICBjb25zdCBvbl9rZXlkb3duID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSB0cnVlXG4gICAgLy8gVGhlc2UgYXJlIGNhbGxiYWNrcyB0aGF0IG9ubHkgZ2V0IGNoZWNrZWQgb25jZSBvbiB0aGUgZXZlbnRcbiAgICBpZiAodGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XSA9IFtdXG4gICAgfVxuICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soKSlcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25fa2V5ZG93biwgZmFsc2UpXG4gIGNvbnN0IG9uX2tleXVwID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSBmYWxzZVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby5rZXlib2FyZF9pbnB1dCA9IHRoaXNcbiAgdGhpcy5rZXlfY2FsbGJhY2tzID0ge1xuICAgIGQ6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIildLFxuICAgIHc6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIildLFxuICAgIGE6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKV0sXG4gICAgczogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXSxcbiAgfVxuICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzID0ge1xuICAgIDE6IFtdXG4gIH1cblxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gKCkgPT4ge1xuICAgIGNvbnN0IGtleXNfZG93biA9IE9iamVjdC5rZXlzKHRoaXMua2V5c19jdXJyZW50bHlfZG93bikuZmlsdGVyKChrZXkpID0+IHRoaXMua2V5c19jdXJyZW50bHlfZG93bltrZXldID09PSB0cnVlKVxuICAgIGtleXNfZG93bi5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICghKE9iamVjdC5rZXlzKHRoaXMua2V5X2NhbGxiYWNrcykuaW5jbHVkZXMoa2V5KSkpIHJldHVyblxuXG4gICAgICB0aGlzLmtleV9jYWxsYmFja3Nba2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soKSlcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5rZXltYXAgPSB7XG4gICAgZDogXCJyaWdodFwiLFxuICAgIHc6IFwidXBcIixcbiAgICBhOiBcImxlZnRcIixcbiAgICBzOiBcImRvd25cIixcbiAgfVxuXG4gIHRoaXMua2V5c19jdXJyZW50bHlfZG93biA9IHtcbiAgICBkOiBmYWxzZSxcbiAgICB3OiBmYWxzZSxcbiAgICBhOiBmYWxzZSxcbiAgICBzOiBmYWxzZSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBLZXlib2FyZElucHV0O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vdCB7XG4gICAgY29uc3RydWN0b3IoaXRlbSwgcXVhbnRpdHkgPSAxKSB7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG4gICAgfVxufSIsImltcG9ydCBJdGVtIGZyb20gXCIuL2l0ZW1cIjtcbmltcG9ydCBMb290IGZyb20gXCIuL2xvb3RcIjtcblxuY2xhc3MgTG9vdEJveCB7XG4gICAgY29uc3RydWN0b3IoZ28pIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICB0aGlzLnggPSAwXG4gICAgICAgIHRoaXMueSA9IDBcbiAgICAgICAgdGhpcy53aWR0aCA9IDM1MFxuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjAwLCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZUpvaW4gPSAnYmV2ZWwnO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zW2luZGV4XVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICAgICAgbG9vdC54ID0gdGhpcy54ICsgMjUgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICBsb290LnkgPSB0aGlzLnkgKyAoaW5kZXggKiA2MCkgKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICAgICAgICAgIGxvb3Qud2lkdGggPSAzNDBcbiAgICAgICAgICAgIGxvb3QuaGVpZ2h0ID0gNTVcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KGxvb3QueCwgbG9vdC55LCBsb290LndpZHRoLCBsb290LmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShsb290Lml0ZW0uaW1hZ2UsIGxvb3QueCArIDUsIGxvb3QueSArIChpbmRleCAqIDYwKSArIDUsIDQ1LCA0NSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnMjJweCBzZXJpZidcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QucXVhbnRpdHksIGxvb3QueCArIDY1LCBsb290LnkgKyAoaW5kZXggKiA2MCkgKyAzNSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QuaXRlbS5uYW1lLCBsb290LnggKyAxMDAsIGxvb3QueSArIChpbmRleCAqIDYwKSArIDM1KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGFrZV9sb290KGxvb3RfaW5kZXgpIHtcbiAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zLnNwbGljZShsb290X2luZGV4LCAxKVswXVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5pbnZlbnRvcnkuYWRkKGxvb3QuaXRlbSlcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoIDw9IDApIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgY2hlY2tfaXRlbV9jbGlja2VkKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm5cblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgobG9vdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA+PSBsb290LngpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPD0gbG9vdC54ICsgbG9vdC53aWR0aCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA+PSBsb290LnkpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPD0gbG9vdC55ICsgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICApXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudGFrZV9sb290KGluZGV4KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb290Qm94IiwiZnVuY3Rpb24gUmVzb3VyY2VCYXIoZ28sIGRhdGEpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZGF0YSA9IGRhdGFcblxuICB0aGlzLmRyYXcgPSAoZnVsbCwgY3VycmVudCkgPT4ge1xuICAgIGxldCBiYXJfd2lkdGggPSAoKGN1cnJlbnQgLyBmdWxsKSAqIHRoaXMuZGF0YS5jaGFyYWN0ZXIud2lkdGgpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCIgXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy5kYXRhLmNoYXJhY3Rlci54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5kYXRhLmNoYXJhY3Rlci55IC0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuZGF0YS5vZmZzZXQsIHRoaXMuZGF0YS5jaGFyYWN0ZXIud2lkdGgsIDUpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiIFxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMuZGF0YS5jaGFyYWN0ZXIueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMuZGF0YS5jaGFyYWN0ZXIueSAtIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmRhdGEub2Zmc2V0LCB0aGlzLmRhdGEuY2hhcmFjdGVyLndpZHRoLCA1KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuZGF0YS5jb2xvdXJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLmRhdGEuY2hhcmFjdGVyLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmRhdGEuY2hhcmFjdGVyLnkgLSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5kYXRhLm9mZnNldCwgYmFyX3dpZHRoLCA1KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlQmFyXG4iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuZnVuY3Rpb24gU2NyZWVuKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLnNjcmVlbiA9IHRoaXNcbiAgdGhpcy53aWR0aCAgPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoO1xuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0O1xuXG4gIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIHRoaXMuZ28ud29ybGQuZHJhdygpXG4gIH1cblxuICB0aGlzLmRyYXdfZ2FtZV9vdmVyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjcpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICB0aGlzLmdvLmN0eC5mb250ID0gJzcycHggc2VyaWYnXG4gICAgdGhpcy5nby5jdHguZmlsbFRleHQoXCJHYW1lIE92ZXJcIiwgKHRoaXMuZ28uY2FudmFzLndpZHRoIC8gMikgLSAodGhpcy5nby5jdHgubWVhc3VyZVRleHQoXCJHYW1lIE92ZXJcIikud2lkdGggLyAyKSwgdGhpcy5nby5jYW52YXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICB0aGlzLmRyYXdfZm9nID0gKCkgPT4ge1xuICAgIHZhciB4ID0gdGhpcy5nby5jaGFyYWN0ZXIueCArIHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMiAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICB2YXIgeSA9IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyB0aGlzLmdvLmNoYXJhY3Rlci5oZWlnaHQgLyAyIC0gdGhpcy5nby5jYW1lcmEueVxuICAgIHZhciBncmFkaWVudCA9IHRoaXMuZ28uY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDEwMCwgeCwgeSwgMjAwKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMCwgMCwgMCwgMCknKVxuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLCAwLCAwLCAxKScpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnRcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NyZWVuXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZXJ2ZXIoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgLy90aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6ODk5OVwiKVxuICB0aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9udWJhcmlhLmhlcm9rdWFwcC5jb206NTQwODJcIilcbiAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMubG9naW4odGhpcy5nby5jaGFyYWN0ZXIpXG4gIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBwYXlsb2FkID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJsb2dpblwiOlxuICAgICAgICBsZXQgbmV3X2NoYXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuICAgICAgICBuZXdfY2hhci5uYW1lID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lXG4gICAgICAgIG5ld19jaGFyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbiAgICAgICAgbmV3X2NoYXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICBjb25zb2xlLmxvZyhgQWRkaW5nIG5ldyBjaGFyYClcbiAgICAgICAgcGxheWVycy5wdXNoKG5ld19jaGFyKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcInBpbmdcIjpcbiAgICAgICAgLy9nby5jdHguZmlsbFJlY3QocGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54LCBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnksIDUwLCA1MClcbiAgICAgICAgLy9nby5jdHguc3Ryb2tlKClcbiAgICAgICAgLy9sZXQgcGxheWVyID0gcGxheWVyc1swXSAvL3BsYXllcnMuZmluZChwbGF5ZXIgPT4gcGxheWVyLm5hbWUgPT09IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIubmFtZSlcbiAgICAgICAgLy9pZiAocGxheWVyKSB7XG4gICAgICAgIC8vICBwbGF5ZXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICAvLyAgcGxheWVyLnkgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnlcbiAgICAgICAgLy99XG4gICAgICAgIC8vYnJlYWs7XG4gICAgfVxuICB9IC8vXG4gIHRoaXMubG9naW4gPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJsb2dpblwiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSxcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG5cbiAgdGhpcy5waW5nID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICBhY3Rpb246IFwicGluZ1wiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSwgXG4gICAgICAgICAgeDogY2hhcmFjdGVyLngsXG4gICAgICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgfVxufVxuIiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSlcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGlmIChcbiAgICAoc2VsZi54IDwgdGFyZ2V0LnggKyB0YXJnZXQud2lkdGgpICYmXG4gICAgKHNlbGYueCArIHNlbGYud2lkdGggPiB0YXJnZXQueCkgJiZcbiAgICAoc2VsZi55IDwgdGFyZ2V0LnkgKyB0YXJnZXQuaGVpZ2h0KSAmJlxuICAgIChzZWxmLnkgKyBzZWxmLmhlaWdodCA+IHRhcmdldC55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuY29uc3QgcmFuZG9tID0gKHN0YXJ0LCBlbmQpID0+IHtcbiAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydFxuICAgIHN0YXJ0ID0gMFxuICB9XG4gIHJldHVybiBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBlbmQpICsgc3RhcnQgIFxufVxuXG5leHBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCBkcmF3X3NxdWFyZSwgVmVjdG9yMiwgcmFuZG9tIH1cbiIsImNsYXNzIFRpbGUge1xuICAgIGNvbnN0cnVjdG9yKGltYWdlX3NyYywgeF9vZmZzZXQgPSAwLCB5X29mZnNldCA9IDAsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gICAgICAgIHRoaXMueF9vZmZzZXQgPSB4X29mZnNldFxuICAgICAgICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaWxlIiwiaW1wb3J0IFRpbGUgZnJvbSBcIi4vdGlsZVwiXG5cbmZ1bmN0aW9uIFdvcmxkKGdvKSB7XG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby53b3JsZCA9IHRoaXM7XG4gIHRoaXMud2lkdGggPSAxMDAwMDtcbiAgdGhpcy5oZWlnaHQgPSAxMDAwMDtcbiAgdGhpcy50aWxlX3NldCA9IHtcbiAgICBncmFzczogbmV3IFRpbGUoXCJncmFzcy5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBkaXJ0OiBuZXcgVGlsZShcImRpcnQyLnBuZ1wiLCAwLCAwLCA2NCwgNjMpXG4gIH1cbiAgdGhpcy5waWNrX3JhbmRvbV90aWxlID0gKCkgPT4ge1xuICAgIGxldCBybmcgPSBNYXRoLnJhbmRvbSgpICogMTAwO1xuICAgIGlmIChybmcgPD0gMykge1xuICAgICAgcmV0dXJuIHRoaXMudGlsZV9zZXQuZ3Jhc3NcbiAgICAgIC8vcmV0dXJuIHRoaXMudGlsZV9zZXQuZGlydFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50aWxlX3NldC5ncmFzc1xuICAgIH1cbiAgfVxuICB0aGlzLnRpbGVfd2lkdGggPSA2NFxuICB0aGlzLnRpbGVfaGVpZ2h0ID0gNjRcbiAgdGhpcy50aWxlc19wZXJfcm93ID0gTWF0aC50cnVuYyh0aGlzLndpZHRoIC8gdGhpcy50aWxlX3dpZHRoKSArIDE7XG4gIHRoaXMudGlsZXNfcGVyX2NvbHVtbiA9IE1hdGgudHJ1bmModGhpcy5oZWlnaHQgLyB0aGlzLnRpbGVfaGVpZ2h0KSArIDE7XG4gIHRoaXMudGlsZXMgPSBudWxsO1xuICB0aGlzLmdlbmVyYXRlX21hcCA9ICgpID0+IHtcbiAgICB0aGlzLnRpbGVzID0gbmV3IEFycmF5KHRoaXMudGlsZXNfcGVyX3Jvdyk7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW3Jvd10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMudGlsZXNbcm93XSA9IFt0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10ucHVzaCh0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGxldCB0aWxlID0gdGhpcy50aWxlc1tyb3ddW2NvbHVtbl1cbiAgICAgICAgaWYgKHRpbGUgIT09IHRoaXMudGlsZV9zZXQuZ3Jhc3MpIHtcbiAgICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy50aWxlX3NldC5ncmFzcy5pbWFnZSxcbiAgICAgICAgICAgIHRoaXMudGlsZV9zZXQuZ3Jhc3MueF9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3MueV9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3Mud2lkdGgsIHRoaXMudGlsZV9zZXQuZ3Jhc3MuaGVpZ2h0LFxuICAgICAgICAgICAgKHJvdyAqIHRoaXMudGlsZV93aWR0aCkgLSB0aGlzLmdvLmNhbWVyYS54LCAoY29sdW1uICogdGhpcy50aWxlX2hlaWdodCkgLSB0aGlzLmdvLmNhbWVyYS55LCA2NCwgNjQpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRpbGUuaW1hZ2UsXG4gICAgICAgICAgdGlsZS54X29mZnNldCwgdGlsZS55X29mZnNldCwgdGlsZS53aWR0aCwgdGlsZS5oZWlnaHQsXG4gICAgICAgICAgKHJvdyAqIHRoaXMudGlsZV93aWR0aCkgLSB0aGlzLmdvLmNhbWVyYS54LCAoY29sdW1uICogdGhpcy50aWxlX2hlaWdodCkgLSB0aGlzLmdvLmNhbWVyYS55LCA2NCwgNjQpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdvcmxkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tIFwiLi9nYW1lX29iamVjdC5qc1wiXG5pbXBvcnQgU2NyZWVuIGZyb20gXCIuL3NjcmVlbi5qc1wiXG5pbXBvcnQgQ2FtZXJhIGZyb20gXCIuL2NhbWVyYS5qc1wiXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci5qc1wiXG5pbXBvcnQgS2V5Ym9hcmRJbnB1dCBmcm9tIFwiLi9rZXlib2FyZF9pbnB1dC5qc1wiXG5pbXBvcnQgeyBpc19jb2xsaWRpbmcsIFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQge1xuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbmltcG9ydCBHYW1lTG9vcCBmcm9tIFwiLi9nYW1lX2xvb3AuanNcIlxuaW1wb3J0IFdvcmxkIGZyb20gXCIuL3dvcmxkLmpzXCJcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4vZG9vZGFkLmpzXCJcbmltcG9ydCBDb250cm9scyBmcm9tIFwiLi9jb250cm9scy5qc1wiXG5pbXBvcnQgSXRlbSBmcm9tIFwiLi9pdGVtXCJcbmltcG9ydCBTZXJ2ZXIgZnJvbSBcIi4vc2VydmVyXCJcbmltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGUuanNcIlxuaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4vbG9vdF9ib3guanNcIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vbG9vdC5qc1wiXG5cbmNvbnN0IGdvID0gbmV3IEdhbWVPYmplY3QoKVxuY29uc3Qgc2NyZWVuID0gbmV3IFNjcmVlbihnbylcbmNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoZ28pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY29uc3Qga2V5Ym9hcmRfaW5wdXQgPSBuZXcgS2V5Ym9hcmRJbnB1dChnbylcbmNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKGdvKVxuY29uc3QgY29udHJvbHMgPSBuZXcgQ29udHJvbHMoZ28pXG5jaGFyYWN0ZXIubmFtZSA9IGBQbGF5ZXIgJHtTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApKS5zbGljZSgwLCAyKX1gXG5jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKGdvKVxuY29uc3QgbG9vdF9ib3ggPSBuZXcgTG9vdEJveChnbylcblxuY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gc2V0Q2xpY2tDYWxsYmFjayhnbylcbmNsaWNrX2NhbGxiYWNrcy5wdXNoKGNsaWNrYWJsZV9jbGlja2VkKVxuZnVuY3Rpb24gY2xpY2thYmxlX2NsaWNrZWQoZXYpIHtcbiAgZ28uY2xpY2thYmxlcy5mb3JFYWNoKChjbGlja2FibGUpID0+IHtcbiAgICBsZXQgY2xpY2sgPSB7IHg6IGV2LmNsaWVudFgsIHk6IGV2LmNsaWVudFksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICAgIGlmIChpc19jb2xsaWRpbmcoY2xpY2thYmxlLCBjbGljaykpIHtcbiAgICAgIGNsaWNrYWJsZS5hY3RpdmF0ZWQgPSAhY2xpY2thYmxlLmFjdGl2YXRlZFxuICAgIH1cbiAgfSlcbn1cblxubGV0IG1vdXNlX2lzX2Rvd24gPSBmYWxzZVxubGV0IG1vdXNlX3Bvc2l0aW9uID0ge31cbmNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbylcbm1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcbmZ1bmN0aW9uIHRyYWNrX21vdXNlX3Bvc2l0aW9uKGV2dCkge1xuICB2YXIgcmVjdCA9IGdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBtb3VzZV9wb3NpdGlvbiA9IHtcbiAgICB4OiBldnQuY2xpZW50WCAtIHJlY3QubGVmdCArIGNhbWVyYS54LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3AgKyBjYW1lcmEueVxuICB9XG59XG5jb25zdCBtb3VzZWRvd25fY2FsbGJhY2tzID0gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pXG5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbmNvbnN0IG1vdXNldXBfY2FsbGJhY2tzID0gc2V0TW91c2V1cENhbGxiYWNrKGdvKVxubW91c2V1cF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSBmYWxzZSlcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2gobG9vdF9ib3guY2hlY2tfaXRlbV9jbGlja2VkLmJpbmQobG9vdF9ib3gpKVxuY29uc3QgdG91Y2hzdGFydF9jYWxsYmFja3MgPSBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pXG50b3VjaHN0YXJ0X2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5jb25zdCB0b3VjaGVuZF9jYWxsYmFja3MgPSBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKVxudG91Y2hlbmRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5mdW5jdGlvbiBjb250cm9sc19tb3ZlbWVudCgpIHtcbiAgZ28uY2xpY2thYmxlcy5mb3JFYWNoKChjbGlja2FibGUpID0+IHtcbiAgICBpZiAoY2xpY2thYmxlLmFjdGl2YXRlZCkge1xuICAgICAgY2xpY2thYmxlLmNsaWNrKClcbiAgICB9XG4gIH0pXG59XG5cbmNvbnN0IHRyZWVzID0gW11cbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBsZXQgdHJlZSA9IG5ldyBEb29kYWQoZ28pXG4gIHRyZWUueCA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLndpZHRoKSAtIHRyZWUud2lkdGg7XG4gIHRyZWUueSA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLmhlaWdodCkgLSB0cmVlLmhlaWdodDtcbiAgdHJlZXMucHVzaCh0cmVlKVxufSlcblxuY29uc3QgRlBTID0gMTYuNjZcblxuY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICBjb250cm9sc19tb3ZlbWVudCgpXG59XG5cbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIHNjcmVlbi5kcmF3KClcbiAgY2hhcmFjdGVyLmRyYXcoKVxuICB0cmVlcy5mb3JFYWNoKHRyZWUgPT4gdHJlZS5kcmF3KCkpXG4gIHNjcmVlbi5kcmF3X2ZvZygpXG4gIGxvb3RfYm94LmRyYXcoKVxuICAvLyBjb250cm9scy5kcmF3KClcbn1cblxuY29uc3QgZGljZSA9IChzaWRlcywgdGltZXMgPSAxKSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKEFycmF5KHRpbWVzKSkubWFwKChpKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcykgKyAxKTtcbn1cblxuXG5jb25zdCBtYWtlX2ZpcmUgPSAoKSA9PiB7XG4gIGxldCBkcnlfbGVhdmVzID0gY2hhcmFjdGVyLmludmVudG9yeS5maW5kKFwiZHJ5IGxlYXZlc1wiKVxuICBsZXQgd29vZCA9IGNoYXJhY3Rlci5pbnZlbnRvcnkuZmluZChcIndvb2RcIilcbiAgaWYgKGRyeV9sZWF2ZXMgJiYgZHJ5X2xlYXZlcy5xdWFudGl0eSA+IDAgJiYgd29vZCAmJiB3b29kLnF1YW50aXR5ID4gMCkge1xuICAgIGRyeV9sZWF2ZXMucXVhbnRpdHkgLT0gMVxuICAgIHdvb2QucXVhbnRpdHkgLT0gMVxuICAgIGxldCByb3dfaW5kZXggPSBNYXRoLmZsb29yKGNoYXJhY3Rlci54IC8gNjQpXG4gICAgbGV0IGNvbHVtbl9pbmRleCA9IE1hdGguZmxvb3IoY2hhcmFjdGVyLnkgLyA2NClcbiAgICBnby53b3JsZC50aWxlc1tyb3dfaW5kZXhdW2NvbHVtbl9pbmRleF0gPSBuZXcgVGlsZShcImJvbmZpcmUucG5nXCIsIDI1MCwgMzAwLCAyOTAsIDI1MClcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIllvdSBkb250IGhhdmUgYWxsIHJlcXVpcmVkIG1hdGVyaWFscyB0byBtYWtlIGEgZmlyZS5cIilcbiAgfVxufVxuXG5jb25zdCBjdXRfdHJlZSA9ICgpID0+IHtcbiAgY29uc3QgdGFyZ2V0ZWRfdHJlZSA9IHRyZWVzLmZpbmQoKHRyZWUpID0+IFZlY3RvcjIuZGlzdGFuY2UodHJlZSwgY2hhcmFjdGVyKSA8IDEwMClcbiAgaWYgKHRhcmdldGVkX3RyZWUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRyZWVzLmluZGV4T2YodGFyZ2V0ZWRfdHJlZSlcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgY29uc3Qgd29vZF90b3RhbCA9IHJhbmRvbSgxLCA1KVxuICAgICAgY29uc3QgaXRlbV9idW5kbGUgPSBuZXcgSXRlbShcIndvb2RcIilcbiAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IFwiYnJhbmNoLnBuZ1wiXG4gICAgICBjb25zdCB3b29kX2xvb3QgPSBuZXcgTG9vdChpdGVtX2J1bmRsZSwgd29vZF90b3RhbClcbiAgICAgIGxvb3RfYm94Lml0ZW1zLnB1c2god29vZF9sb290KVxuICAgICAgbG9vdF9ib3gudmlzaWJsZSA9IHRydWVcbiAgICAgIGxvb3RfYm94LnggPSBjaGFyYWN0ZXIueFxuICAgICAgbG9vdF9ib3gueSA9IGNoYXJhY3Rlci55XG4gICAgICBpdGVtX2J1bmRsZS5xdWFudGl0eSA9IHdvb2RfdG90YWxcbiAgICAgIGNoYXJhY3Rlci5pbnZlbnRvcnkuYWRkKGl0ZW1fYnVuZGxlKVxuICAgICAgbGV0IGRyeV9sZWF2ZXNfcm9sbCA9IGRpY2UoMTApXG4gICAgICBpZiAoZHJ5X2xlYXZlc19yb2xsID4gNykge1xuICAgICAgICBjaGFyYWN0ZXIuaW52ZW50b3J5LmFkZChuZXcgSXRlbShcImRyeSBsZWF2ZXNcIiwgMSkpXG4gICAgICB9XG5cbiAgICAgIHRyZWVzLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH1cbn1cblxua2V5Ym9hcmRfaW5wdXQua2V5X2NhbGxiYWNrc1tcImZcIl0gPSBbY3V0X3RyZWVdXG5cbmNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG5nYW1lX2xvb3AuZHJhdyA9IGRyYXdcbmdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IGdvLmtleWJvYXJkX2lucHV0LnByb2Nlc3Nfa2V5c19kb3duXG5nYW1lX2xvb3AudXBkYXRlID0gdXBkYXRlXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1sxXS5wdXNoKCgpID0+IG1ha2VfZmlyZSgpKVxuXG5jb25zdCBzdGFydCA9ICgpID0+IHtcbiAgY2hhcmFjdGVyLnggPSAxMDBcbiAgY2hhcmFjdGVyLnkgPSAxMDBcbiAgZ28ud29ybGQuZ2VuZXJhdGVfbWFwKClcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG59XG5cbnN0YXJ0KClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==