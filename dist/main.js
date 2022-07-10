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

/***/ "./src/casting_bar.js":
/*!****************************!*\
  !*** ./src/casting_bar.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function CastingBar({ go }) {
    this.go = go
    this.x = null
    this.y = null
    this.duration = null
    this.width = go.character.width
    this.height = 5
    this.colour = "purple"
    this.full = null
    this.current = 0
    this.starting_time = null
    this.last_time = null
    // Stays static in a position in the map
    // Meaning: doesn't move with the camera
    this.static = false
    this.x_offset = function () {
        return this.static ?
            this.go.camera.x :
            0;
    }
    this.y_offset = function () {
        return this.static ?
            this.go.camera.y :
            0;
    }

    this.start = (duration) => {
        this.starting_time = Date.now()
        this.last_time = Date.now()
        this.current = 0
        this.duration = duration
    }

    this.draw = (full = this.full, current = this.current) => {
        if (this.duration === null) return;

        let elapsed_time = Date.now() - this.last_time;
        this.last_time = Date.now()
        this.current += elapsed_time;
        if (this.current <= this.duration) {
            this.x = this.go.character.x - this.go.camera.x
            this.y = this.go.character.y - this.go.camera.y
            let bar_width = ((this.current / this.duration) * this.width)
            this.go.ctx.strokeStyle = "black"
            this.go.ctx.lineWidth = 4
            this.go.ctx.strokeRect(this.x - this.x_offset(), this.y - this.y_offset(), this.width, this.height)
            this.go.ctx.fillStyle = "black"
            this.go.ctx.fillRect(this.x - this.x_offset(), this.y - this.y_offset(), this.width, this.height)
            this.go.ctx.fillStyle = this.colour
            this.go.ctx.fillRect(this.x - this.x_offset(), this.y - this.y_offset(), bar_width, this.height)
        } else {
            this.duration = null;
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CastingBar);


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
function Doodad({ go }) {
  this.go = go

  this.x = 0;
  this.y = 0;
  this.image = new Image();
  this.image.src = "plants.png"
  this.image_width = 98
  this.image_x_offset = 127
  this.image_height = 126
  this.image_y_offset = 290
  this.width = 98
  this.height = 126
  this.resource_bar = null

  this.draw = function() {
    this.go.ctx.drawImage(this.image, this.image_x_offset, this.image_y_offset, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
    if (this.resource_bar) {
      this.resource_bar.draw()
    }
  }

  this.click = function() {}
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
  this.selected_clickable = null
  this.draw_selected_clickable = function () {
    if (this.selected_clickable) {
      this.ctx.save()
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = "yellow"
      this.ctx.strokeStyle = "rgba(255, 255, 0, 0.7)"
      this.ctx.strokeRect(
        this.selected_clickable.x - this.camera.x - 5,
        this.selected_clickable.y - this.camera.y - 5,
        this.selected_clickable.width + 10,
        this.selected_clickable.height + 10);
      this.ctx.restore();
    }
  }
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
      return bundle.name.toLowerCase() == item_name.toLowerCase()
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
function Item(name, image, quantity = 1, src_image) {
  this.name = name
  if (image === undefined) {
    this.image = new Image()
    this.image.src = src_image
  } else {
    this.image = image
  }
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
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete */ "./src/tapete.js");


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

        // If the player moves away, delete items and hide loot box screen
        if (
            (_tapete__WEBPACK_IMPORTED_MODULE_0__.Vector2.distance(this, this.go.character) > 500) ||
            (this.items.length <= 0)
        ) {

            this.items = []
            this.visible = false
        }

        this.go.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        this.go.ctx.lineJoin = 'bevel';
        this.go.ctx.lineWidth = 5;
        this.go.ctx.strokeRect(this.x + 20 - this.go.camera.x, this.y + 20 - this.go.camera.y, this.width, this.items.length * 60 + 5);
        this.go.ctx.fillStyle = "rgba(255, 200, 255, 0.5)";
        this.go.ctx.fillRect(this.x + 20 - this.go.camera.x, this.y + 20 - this.go.camera.y, this.width, this.items.length * 60 + 5);

        for (let index = 0; index < this.items.length; index++) {
            let loot = this.items[index]
            this.go.ctx.fillStyle = "rgb(0, 0, 0)"
            loot.x = this.x + 25 - this.go.camera.x
            loot.y = this.y + (index * 60) + 25 - this.go.camera.y
            loot.width = 340
            loot.height = 55
            this.go.ctx.fillRect(loot.x, loot.y, loot.width, loot.height)
            this.go.ctx.drawImage(loot.item.image, loot.x + 5, loot.y + 5, 45, 45)
            this.go.ctx.fillStyle = "rgb(255, 255, 255)"
            this.go.ctx.font = '22px serif'
            this.go.ctx.fillText(loot.quantity, loot.x + 65, loot.y + 35)
            this.go.ctx.fillText(loot.item.name, loot.x + 100, loot.y + 35)
        }
    }

    show() {
      this.visible = true
      this.x = this.go.character.x
      this.y = this.go.character.y
    }

    take_loot(loot_index) {
        let loot = this.items.splice(loot_index, 1)[0]
        this.go.character.inventory.add(loot.item)
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
function ResourceBar({ go, x, y, width = 100, height = 10, colour = "red" }) {
  this.go = go
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.colour = colour
  this.full = 100
  this.current = 100
  // Stays static in a position in the map
  // Meaning: doesn't move with the camera
  this.static = false
  this.x_offset = function () {
    return this.static ?
      this.go.camera.x :
      0;
  }
  this.y_offset = function () {
    return this.static ?
      this.go.camera.y :
      0;
  }

  this.draw = (full = this.full, current = this.current) => {
    let bar_width = ((current / full) * this.width)
    this.go.ctx.strokeStyle = "black"
    this.go.ctx.lineWidth = 4
    this.go.ctx.strokeRect(this.x - this.x_offset(), this.y - this.y_offset(), this.width, this.height)
    this.go.ctx.fillStyle = "black"
    this.go.ctx.fillRect(this.x - this.x_offset(), this.y - this.y_offset(), this.width, this.height)
    this.go.ctx.fillStyle = this.colour
    this.go.ctx.fillRect(this.x - this.x_offset(), this.y - this.y_offset(), bar_width, this.height)
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
    var gradient = this.go.ctx.createRadialGradient(x, y, 0, x, y, 700);
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
    dirt: new _tile__WEBPACK_IMPORTED_MODULE_0__["default"]("dirt2.png", 0, 0, 64, 63),
    stone: new _tile__WEBPACK_IMPORTED_MODULE_0__["default"]("flintstone.png", 0, 0, 840, 859),
  }
  this.pick_random_tile = () => {
    return this.tile_set.grass
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
/* harmony import */ var _resource_bar_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./resource_bar.js */ "./src/resource_bar.js");
/* harmony import */ var _casting_bar_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./casting_bar.js */ "./src/casting_bar.js");



















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
const cold = new _resource_bar_js__WEBPACK_IMPORTED_MODULE_16__["default"]({ go, x: 5, y: 5, width: 200, height: 20 })
const casting_bar = new _casting_bar_js__WEBPACK_IMPORTED_MODULE_17__["default"]({ go })

const click_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setClickCallback)(go)
click_callbacks.push(clickable_clicked)
function clickable_clicked(ev) {
  let click = { x: ev.clientX + go.camera.x, y: ev.clientY + go.camera.y, width: 1, height: 1 }
  const clickable = go.clickables.find((clickable) => (0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.is_colliding)(clickable, click))
  if (clickable) {
    clickable.activated = !clickable.activated
  }
  go.selected_clickable = clickable
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
  // go.clickables.forEach((clickable) => {
  //   if (clickable.activated) {
  //     clickable.click()
  //   }
  // })
}

let current_cold_level = 100
function update_cold_level() {
  if (fires.find((fire) => _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(fire, character) <= 150)) {
    if (current_cold_level < 100) {
      if (current_cold_level + 5 > 100) {
        current_cold_level = 100
      } else {
        current_cold_level += 5;
      }
    }
  } else {
    current_cold_level -= 1;
  }
}

function update_boonfires_fuel() {
  for (let index = 0; index < fires.length; index++) {
    let fire = fires[index]
    if (fire.fuel <= 0) {
      fires.splice(index, 1);
    } else {
      fire.fuel -= 1;
      fire.resource_bar.current -= 1;
    }
  }
}

let FPS = 30
let last_tick = Date.now()

const update = () => {
  if ((Date.now() - last_tick) > 1000) {
    update_fps()
    last_tick = Date.now()
  }
  controls_movement()
}

function update_fps() {
  update_cold_level()
  update_boonfires_fuel()
}

const draw = () => {
  screen.draw()
  stones.forEach(stone => stone.draw())
  trees.forEach(tree => tree.draw())
  fires.forEach(fire => fire.draw())
  character.draw()
  screen.draw_fog()
  loot_box.draw()
  cold.draw(100, current_cold_level)
  casting_bar.draw()
  go.draw_selected_clickable()
  // controls.draw()a
}

const dice = (sides, times = 1) => {
  return Array.from(Array(times)).map((i) => Math.floor(Math.random() * sides) + 1);
}

const fires = []
const make_fire = () => {
  casting_bar.start(1500)

  setTimeout(() => {
    let dry_leaves = character.inventory.find("dry leaves")
    let wood = character.inventory.find("wood")
    let flintstone = character.inventory.find("flintstone")
    if (dry_leaves && dry_leaves.quantity > 0 &&
      wood && wood.quantity > 0 &&
      flintstone && flintstone.quantity > 0) {
      dry_leaves.quantity -= 1
      wood.quantity -= 1
      let fire = new _doodad_js__WEBPACK_IMPORTED_MODULE_9__["default"]({ go })
      fire.image.src = "bonfire.png"
      fire.image_x_offset = 250
      fire.image_y_offset = 250
      fire.image_height = 350
      fire.image_width = 300
      fire.width = 64
      fire.height = 64
      fire.x = character.x;
      fire.y = character.y;
      fire.fuel = 20;
      fire.resource_bar = new _resource_bar_js__WEBPACK_IMPORTED_MODULE_16__["default"]({ go, x: fire.x, y: fire.y + fire.height, width: fire.width, height: 5 })
      fire.resource_bar.static = true
      fire.resource_bar.full = 20;
      fire.resource_bar.current = 20;
      fires.push(fire)
      go.clickables.push(fire)
    } else {
      console.log("You dont have all required materials to make a fire.")
    }
  }, 1500)
}
//= Doodads

const trees = []
Array.from(Array(300)).forEach((j, i) => {
  let tree = new _doodad_js__WEBPACK_IMPORTED_MODULE_9__["default"]({ go })
  tree.x = Math.trunc(Math.random() * go.world.width) - tree.width;
  tree.y = Math.trunc(Math.random() * go.world.height) - tree.height;
  trees.push(tree)
  go.clickables.push(tree)
})

let loot_table_tree = [{
  item: { name: "Wood", image_src: "branch.png" },
  min: 1,
  max: 3,
  chance: 95
},
{
  item: { name: "Dry Leaves", image_src: "leaves.jpeg" },
  min: 1,
  max: 3,
  chance: 100
}]

function remove_clickable(doodad) {
  const clickable_index = go.clickables.indexOf(doodad)
  if (clickable_index > -1) {
    go.clickables.splice(clickable_index, 1)
  }
  if (go.selected_clickable === doodad) {
    go.selected_clickable = null
  }
}

const cut_tree = () => {
  // Could give it the function to be ran at the end as a callback
  const targeted_tree = trees.find((tree) => _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(tree, character) < 100)
  if (targeted_tree === go.selected_clickable) {
    casting_bar.start(3000)

    setTimeout(() => {
      const index = trees.indexOf(targeted_tree)
      if (index > -1) {
        loot_box.items = roll_loot(loot_table_tree)
        loot_box.show()
        trees.splice(index, 1)
      }
      remove_clickable(targeted_tree)
    }, 3000);
  }
}
keyboard_input.key_callbacks["f"] = [cut_tree]

const stones = []
Array.from(Array(300)).forEach((j, i) => {
  let stone = new _doodad_js__WEBPACK_IMPORTED_MODULE_9__["default"]({ go })
  stone.image.src = "flintstone.png"
  stone.x = Math.trunc(Math.random() * go.world.width);
  stone.y = Math.trunc(Math.random() * go.world.height);
  stone.image_width = 840
  stone.image_height = 859
  stone.image_x_offset = 0
  stone.image_y_offset = 0
  stone.width = 32
  stone.height = 32
  stones.push(stone)
})

let loot_table_stone = [{
  item: { name: "Flintstone", image_src: "flintstone.png" },
  min: 1,
  max: 1,
  chance: 100
}]

const roll_loot = (loot_table) => {
  let result = loot_table.map((loot_entry) => {
    let roll = dice(100)
    if (roll <= loot_entry.chance) {
      const item_bundle = new _item__WEBPACK_IMPORTED_MODULE_11__["default"](loot_entry.item.name)
      item_bundle.image.src = loot_entry.item.image_src
      item_bundle.quantity = (0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.random)(loot_entry.min, loot_entry.max)
      return new _loot_js__WEBPACK_IMPORTED_MODULE_15__["default"](item_bundle, item_bundle.quantity)
    }
  }).filter((entry) => entry !== undefined)
  return result
}

const break_stone = () => {
  const targeted_stone = stones.find((stone) => _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(stone, character) < 100)
  if (targeted_stone) {
    casting_bar.start(3000)

    setTimeout(() => {
      const index = stones.indexOf(targeted_stone)
      if (index > -1) {
        loot_box.items = roll_loot(loot_table_stone)
        loot_box.show()
        stones.splice(index, 1)
      }
    }, 3000)
  }
}
keyboard_input.key_callbacks["f"].push(break_stone)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQVVFOzs7Ozs7Ozs7Ozs7Ozs7QUMvRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0FDMUJ2QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQzdCQTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLDJCQUEyQixlQUFlLEVBQUUsVUFBVTtBQUN0RDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDakNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkMsd0RBQWdCO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrREFBTSxHQUFHLElBQUk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0EsVUFBVSxpREFBaUQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qiw4Q0FBSTtBQUNsQztBQUNBLDZCQUE2QixrREFBTTtBQUNuQyxpQkFBaUIsaURBQUk7QUFDckI7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLGdEQUFnRCx3REFBZ0I7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLHFEQUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NhbWVyYS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Nhc3RpbmdfYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2hhcmFjdGVyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2xpY2thYmxlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9kb29kYWQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9ldmVudHNfY2FsbGJhY2tzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9sb29wLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pbnZlbnRvcnkuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pdGVtLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMva2V5Ym9hcmRfaW5wdXQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbG9vdF9ib3guanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90YXBldGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90aWxlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd29ybGQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd2VpcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQ2FtZXJhKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNhbWVyYSA9IHRoaXNcbiAgdGhpcy54ID0gMFxuICB0aGlzLnkgPSAwXG4gIHRoaXMuY2FtZXJhX3NwZWVkID0gM1xuXG4gIHRoaXMubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSA9IChldikgPT4ge1xuICAgIC8vaWYgKHRoaXMuZ28uZWRpdG9yLnBhaW50X21vZGUpIHJldHVyblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA8IDEwMCkge1xuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgeSArIHRoZSBtb3ZlbWVudCB3ZSdsbCBtYWtlIGZ1cnRoZXIgdGhlcmUgaXMgZ3JlYXRlciB0aGFuXG4gICAgICAvLyB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBzY3JlZW4gbWludXMgdGhlIGhlaWdodCB0aGF0IHdpbGwgYWxyZWFkeSBiZSB2aXNpYmxlXG4gICAgICAvLyAodGhlIGNhbnZhcyBoZWlnaHQpLCBkb24ndCBnbyBmdXJ0aGVyIG93blxuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA+IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gMTAwKSB7XG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpIDwgMTAwKSB7XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA+IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSAxMDApIHtcbiAgICAgIC8vIERvbid0IGdvIGZ1cnRoZXIgbGVmdFxuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuICB9XG5cbiAgdGhpcy5mb2N1cyA9IChwb2ludCkgPT4ge1xuICAgIGxldCB4ID0gcG9pbnQueCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gICAgbGV0IHkgPSBwb2ludC55IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gICAgLy8gc3BlY2lmaWMgbWFwIGN1dHMgKGl0IGhhcyBhIG1hcCBvZmZzZXQgb2YgNjAsMTYwKVxuICAgIGlmICh5IDwgMCkgeyB5ID0gMCB9XG4gICAgaWYgKHggPCAwKSB7IHggPSAwIH1cbiAgICBpZiAoeCArIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggPiB0aGlzLmdvLndvcmxkLndpZHRoKSB7IHggPSB0aGlzLnggfVxuICAgIGlmICh5ICsgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgPiB0aGlzLmdvLndvcmxkLmhlaWdodCkgeyB5ID0gdGhpcy55IH1cbiAgICAvLyBvZmZzZXQgY2hhbmdlcyBlbmRcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgdGhpcy5nbG9iYWxfY29vcmRzID0gKG9iaikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICB4OiBvYmoueCAtIHRoaXMueCxcbiAgICAgIHk6IG9iai55IC0gdGhpcy55XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbWVyYVxuIiwiZnVuY3Rpb24gQ2FzdGluZ0Jhcih7IGdvIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLnggPSBudWxsXG4gICAgdGhpcy55ID0gbnVsbFxuICAgIHRoaXMuZHVyYXRpb24gPSBudWxsXG4gICAgdGhpcy53aWR0aCA9IGdvLmNoYXJhY3Rlci53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gNVxuICAgIHRoaXMuY29sb3VyID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZnVsbCA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgdGhpcy5zdGFydGluZ190aW1lID0gbnVsbFxuICAgIHRoaXMubGFzdF90aW1lID0gbnVsbFxuICAgIC8vIFN0YXlzIHN0YXRpYyBpbiBhIHBvc2l0aW9uIGluIHRoZSBtYXBcbiAgICAvLyBNZWFuaW5nOiBkb2Vzbid0IG1vdmUgd2l0aCB0aGUgY2FtZXJhXG4gICAgdGhpcy5zdGF0aWMgPSBmYWxzZVxuICAgIHRoaXMueF9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS54IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuICAgIHRoaXMueV9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS55IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydCA9IChkdXJhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmR1cmF0aW9uID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGVsYXBzZWRfdGltZSA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGltZTtcbiAgICAgICAgdGhpcy5sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMuY3VycmVudCArPSBlbGFwc2VkX3RpbWU7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQgPD0gdGhpcy5kdXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy5nby5jaGFyYWN0ZXIueCAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgICAgIHRoaXMueSA9IHRoaXMuZ28uY2hhcmFjdGVyLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsZXQgYmFyX3dpZHRoID0gKCh0aGlzLmN1cnJlbnQgLyB0aGlzLmR1cmF0aW9uKSAqIHRoaXMud2lkdGgpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXN0aW5nQmFyXG4iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuaW1wb3J0IEludmVudG9yeSBmcm9tIFwiLi9pbnZlbnRvcnlcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNoYXJhY3RlciA9IHRoaXNcbiAgdGhpcy5lZGl0b3IgPSBnby5lZGl0b3JcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwiY3Jpc2lzY29yZXBlZXBzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaWQgPSBpZFxuICB0aGlzLnggPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICB0aGlzLnkgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gXCJkb3duXCJcbiAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gMFxuICB0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoKTtcblxuICAvLyBDb21iYXRcbiAgdGhpcy5ocCA9IDEwMC4wXG4gIHRoaXMuY3VycmVudF9ocCA9IDEwMC4wXG5cbiAgdGhpcy5tYW5hID0gMTAuMFxuICB0aGlzLmN1cnJlbnRfbWFuYSA9IDEwLjBcbiAgLy8gRU5EIENvbWJhdFxuXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcihnbywgeyBjaGFyYWN0ZXI6IHRoaXMsIG9mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKGdvLCB7IGNoYXJhY3RlcjogdGhpcywgb2Zmc2V0OiAxMCwgY29sb3VyOiBcImJsdWVcIiB9KVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMuaXNfZGVhZCA9ICgpID0+IHRoaXMuY3VycmVudF9ocCA8PSAwXG4gIHRoaXMuaXNfYWxpdmUgPSAoKSA9PiAhaXNfZGVhZFxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLnRhcmdldF9tb3ZlbWVudCkgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCgpXG4gICAgLy90aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLmhwLCB0aGlzLmN1cnJlbnRfaHApXG4gICAgLy90aGlzLm1hbmFfYmFyLmRyYXcodGhpcy5tYW5hLCB0aGlzLmN1cnJlbnRfbWFuYSlcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgTWF0aC5mbG9vcih0aGlzLndhbGtfY3ljbGVfaW5kZXgpICogdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSgpICogdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxuXG4gIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2godGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICByZXR1cm4gMlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICByZXR1cm4gM1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHJldHVybiAxXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuICBcbiAgdGhpcy5tb3ZlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG5cbiAgICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgaWYgKHRoaXMueCArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLndpZHRoKSB7XG4gICAgICAgICAgdGhpcy54ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICBpZiAodGhpcy55IC0gdGhpcy5zcGVlZCA+IDApIHtcbiAgICAgICAgICB0aGlzLnkgLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgaWYgKHRoaXMueCAtIHRoaXMuc3BlZWQgPiAwKSB7XG4gICAgICAgICAgdGhpcy54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC5oZWlnaHQpIHtcbiAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAodGhpcy53YWxrX2N5Y2xlX2luZGV4ICsgKDAuMDMgKiB0aGlzLnNwZWVkKSkgJSAzXG4gICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcylcbiAgfVxuXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXSB9XG4gIEFycmF5LnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpc1swXSB9XG5cbiAgLy8gU3RvcmVzIHRoZSB0ZW1wb3JhcnkgdGFyZ2V0IG9mIHRoZSBtb3ZlbWVudCBiZWluZyBleGVjdXRlZFxuICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IG51bGxcbiAgLy8gU3RvcmVzIHRoZSBwYXRoIGJlaW5nIGNhbGN1bGF0ZWRcbiAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICB0aGlzLnNwZWVkID0gM1xuXG4gIHRoaXMuZmluZF9wYXRoID0gKHRhcmdldF9tb3ZlbWVudCkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG5cbiAgICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IHRhcmdldF9tb3ZlbWVudFxuXG4gICAgaWYgKHRoaXMuY3VycmVudF9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgeDogdGhpcy54ICsgdGhpcy5zcGVlZCwgeTogdGhpcy55ICsgdGhpcy5zcGVlZCB9KVxuICAgIH1cblxuICAgIHZhciBsYXN0X3N0ZXAgPSB7fVxuICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7fVxuXG4gICAgZG8ge1xuICAgICAgbGFzdF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGhbdGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoIC0gMV1cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudCA9IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgICAvLyBUaGlzIGNvZGUgd2lsbCBrZWVwIHRyeWluZyB0byBnbyBiYWNrIHRvIHRoZSBzYW1lIHByZXZpb3VzIGZyb20gd2hpY2ggd2UganVzdCBicmFuY2hlZCBvdXRcbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuXG4gICAgICAvLyBUaGlzIGlzIHByZXR0eSBoZWF2eS4uLiBJdCdzIGNhbGN1bGF0aW5nIGFnYWluc3QgYWxsIHRoZSBiaXRzIGluIHRoZSBtYXAgPVtcbiAgICAgIHZhciBnb2luZ190b19jb2xsaWRlID0gdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSlcbiAgICAgIGlmIChnb2luZ190b19jb2xsaWRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb2xsaXNpb24gYWhlYWQhJylcbiAgICAgICAgdmFyIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueCA9IG5leHRfbW92ZW1lbnQueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBvbiBZXCIpXG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC55ID0gbmV4dF9tb3ZlbWVudC55IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIFhcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyAuLi5mdXR1cmVfbW92ZW1lbnQgfSlcbiAgICB9IHdoaWxlICgoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHx8IChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkpXG5cbiAgICB0aGlzLm1vdmluZyA9IHRydWVcbiAgfVxuXG4gIHRoaXMubW92ZV9vbl9wYXRoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdmFyIG5leHRfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoLnNoaWZ0KClcbiAgICAgIGlmIChuZXh0X3N0ZXApIHtcbiAgICAgICAgdGhpcy54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgdGhpcy55ID0gbmV4dF9zdGVwLnlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vdGhpcy5tb3ZlID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50KSB7XG4gIC8vICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgLy8gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxuXG4gIC8vICAgIGlmICgoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPD0gMSkgJiYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpIDw9IDEpKSB7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgLy8gICAgICB0YXJnZXRfbW92ZW1lbnQgPSB7fVxuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiU3RvcHBlZFwiKTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KHRhcmdldF9tb3ZlbWVudClcblxuICAvLyAgICAgIC8vIFBhdGhpbmdcbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgfVxuXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC53aWR0aCA9IHRoaXMud2lkdGhcbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gICAgaWYgKCh0aGlzLmdvLmVudGl0aWVzLmV2ZXJ5KChlbnRpdHkpID0+IGVudGl0eS5pZCA9PT0gdGhpcy5pZCB8fCAhaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgZW50aXR5KSApKSAmJlxuICAvLyAgICAgICghdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSkpKSB7XG4gIC8vICAgICAgdGhpcy54ID0gZnV0dXJlX21vdmVtZW50LnhcbiAgLy8gICAgICB0aGlzLnkgPSBmdXR1cmVfbW92ZW1lbnQueVxuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiQmxvY2tlZFwiKTtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIC8vICAgIH1cbiAgLy8gIH1cbiAgLy8gIC8vIEVORCAtIENoYXJhY3RlciBNb3ZlbWVudFxuICAvL31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDbGlja2FibGUoZ28sIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlX3NyYykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jbGlja2FibGVzLnB1c2godGhpcylcblxuICB0aGlzLm5hbWUgPSBpbWFnZV9zcmNcbiAgdGhpcy54ID0geFxuICB0aGlzLnkgPSB5XG4gIHRoaXMud2lkdGggPSB3aWR0aFxuICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5pbWFnZS5zcmMgPSBpbWFnZV9zcmNcbiAgdGhpcy5hY3RpdmF0ZWQgPSBmYWxzZVxuICB0aGlzLnBhZGRpbmcgPSA1XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCwgdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIGlmICh0aGlzLmFjdGl2YXRlZCkge1xuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcIiNmZmZcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnBhZGRpbmcsIHRoaXMueSAtIHRoaXMucGFkZGluZywgdGhpcy53aWR0aCArICgyKnRoaXMucGFkZGluZyksIHRoaXMuaGVpZ2h0ICsgKDIqdGhpcy5wYWRkaW5nKSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xpY2tcIilcbiAgfVxufVxuIiwiaW1wb3J0IENsaWNrYWJsZSBmcm9tIFwiLi9jbGlja2FibGUuanNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb250cm9scyhnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jb250cm9scyA9IHRoaXNcbiAgdGhpcy53aWR0aCA9IHNjcmVlbi53aWR0aFxuICB0aGlzLmhlaWdodCA9IHNjcmVlbi5oZWlnaHQgKiAwLjRcbiAgdGhpcy5hcnJvd3MgPSB7XG4gICAgdXA6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMCwgODAsIDgwLCBcImFycm93X3VwLnBuZ1wiKSxcbiAgICBsZWZ0OiBuZXcgQ2xpY2thYmxlKGdvLCA1MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X2xlZnQucG5nXCIpLFxuICAgIHJpZ2h0OiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpICsgNzAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19yaWdodC5wbmdcIiksXG4gICAgZG93bjogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEyMCwgODAsIDgwLCBcImFycm93X2Rvd24ucG5nXCIpLFxuICB9XG4gIHRoaXMuYXJyb3dzLnVwLmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJ1cFwiKVxuICB0aGlzLmFycm93cy5kb3duLmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXG4gIHRoaXMuYXJyb3dzLmxlZnQuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIilcbiAgdGhpcy5hcnJvd3MucmlnaHQuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCBzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIE9iamVjdC52YWx1ZXModGhpcy5hcnJvd3MpLmZvckVhY2goYXJyb3cgPT4gYXJyb3cuZHJhdygpKVxuICB9XG59XG4iLCJmdW5jdGlvbiBEb29kYWQoeyBnbyB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuXG4gIHRoaXMueCA9IDA7XG4gIHRoaXMueSA9IDA7XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcInBsYW50cy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gOThcbiAgdGhpcy5pbWFnZV94X29mZnNldCA9IDEyN1xuICB0aGlzLmltYWdlX2hlaWdodCA9IDEyNlxuICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMjkwXG4gIHRoaXMud2lkdGggPSA5OFxuICB0aGlzLmhlaWdodCA9IDEyNlxuICB0aGlzLnJlc291cmNlX2JhciA9IG51bGxcblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIGlmICh0aGlzLnJlc291cmNlX2Jhcikge1xuICAgICAgdGhpcy5yZXNvdXJjZV9iYXIuZHJhdygpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9IGZ1bmN0aW9uKCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9vZGFkO1xuIiwiLy8gVGhlIGNhbGxiYWNrcyBzeXN0ZW1cbi8vIFxuLy8gVG8gdXNlIGl0OlxuLy9cbi8vICogaW1wb3J0IHRoZSBjYWxsYmFja3MgeW91IHdhbnRcbi8vXG4vLyAgICBpbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuLy9cbi8vICogY2FsbCB0aGVtIGFuZCBzdG9yZSB0aGUgYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zXG4vL1xuLy8gICAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKTtcbi8vXG4vLyAqIGFkZCBvciByZW1vdmUgY2FsbGJhY2tzIGZyb20gYXJyYXlcbi8vXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmZ1bmN0aW9uIHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4gIHJldHVybiBtb3VzZW1vdmVfY2FsbGJhY2tzO1xufVxuXG5cbmZ1bmN0aW9uIHNldENsaWNrQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fY2xpY2sgID0gKGV2KSA9PiB7XG4gICAgY2xpY2tfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcbiAgcmV0dXJuIGNsaWNrX2NhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0Q2FsbGJhY2soZ28sIGV2ZW50KSB7XG4gIGNvbnN0IGNhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4ge1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZSlcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSlcbiAgcmV0dXJuIGNhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vtb3ZlJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ21vdXNlZG93bicpO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2V1cCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hzdGFydCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoZW5kJyk7XG59XG5cbmV4cG9ydCB7XG4gIHNldE1vdXNlbW92ZUNhbGxiYWNrLFxuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufTtcbiIsIi8vIFRoZSBHYW1lIExvb3Bcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBjb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuLy8gZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG4vLyBnYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBwcm9jZXNzX2tleXNfZG93blxuLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xuXG5mdW5jdGlvbiBHYW1lTG9vcCgpIHtcbiAgdGhpcy5kcmF3ID0gbnVsbFxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gbnVsbFxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHt9XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duKClcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIHRoaXMuZHJhdygpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVMb29wXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuY2FudmFzX3JlY3Qud2lkdGgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FudmFzX3JlY3QuaGVpZ2h0KTtcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNsaWNrYWJsZXMgPSBbXVxuICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgdGhpcy5kcmF3X3NlbGVjdGVkX2NsaWNrYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICAgIHRoaXMuY3R4LnNhdmUoKVxuICAgICAgdGhpcy5jdHguc2hhZG93Qmx1ciA9IDEwO1xuICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gXCJ5ZWxsb3dcIlxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDAsIDAuNylcIlxuICAgICAgdGhpcy5jdHguc3Ryb2tlUmVjdChcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueCAtIHRoaXMuY2FtZXJhLnggLSA1LFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS55IC0gdGhpcy5jYW1lcmEueSAtIDUsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoICsgMTAsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCArIDEwKTtcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZU9iamVjdCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludmVudG9yeSgpIHtcbiAgdGhpcy5tYXhfc2xvdHMgPSAxMFxuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5hZGQgPSAoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nX2J1bmRsZSA9IHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUgPT0gaXRlbS5uYW1lXG4gICAgfSlcblxuICAgIGlmICgodGhpcy5zbG90cy5sZW5ndGggPj0gdGhpcy5tYXhfc2xvdHMpICYmICghZXhpc3RpbmdfYnVuZGxlKSkgcmV0dXJuXG5cbiAgICBjb25zb2xlLmxvZyhgKioqIEdvdCAke2l0ZW0ucXVhbnRpdHl9ICR7aXRlbS5uYW1lfWApXG4gICAgaWYgKGV4aXN0aW5nX2J1bmRsZSkge1xuICAgICAgZXhpc3RpbmdfYnVuZGxlLnF1YW50aXR5ICs9IGl0ZW0ucXVhbnRpdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zbG90cy5wdXNoKGl0ZW0pXG4gICAgfVxuICB9XG4gIHRoaXMuZmluZCA9IChpdGVtX25hbWUpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zbG90cy5maW5kKChidW5kbGUpID0+IHtcbiAgICAgIHJldHVybiBidW5kbGUubmFtZS50b0xvd2VyQ2FzZSgpID09IGl0ZW1fbmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC44KVwiO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDIwLCAyMCwgMjAwLCAyMDApO1xuXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoNjAsIDQwLCAwKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMjUsIDI1LCA1MCwgNTApXG5cbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMzAsIDMwLCA0MCwgNDApXG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEl0ZW0obmFtZSwgaW1hZ2UsIHF1YW50aXR5ID0gMSwgc3JjX2ltYWdlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgaWYgKGltYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltYWdlLnNyYyA9IHNyY19pbWFnZVxuICB9IGVsc2Uge1xuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZVxuICB9XG4gIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxufVxuIiwiZnVuY3Rpb24gS2V5Ym9hcmRJbnB1dChnbykge1xuICBjb25zdCBvbl9rZXlkb3duID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSB0cnVlXG4gICAgLy8gVGhlc2UgYXJlIGNhbGxiYWNrcyB0aGF0IG9ubHkgZ2V0IGNoZWNrZWQgb25jZSBvbiB0aGUgZXZlbnRcbiAgICBpZiAodGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XSA9IFtdXG4gICAgfVxuICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soKSlcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25fa2V5ZG93biwgZmFsc2UpXG4gIGNvbnN0IG9uX2tleXVwID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSBmYWxzZVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby5rZXlib2FyZF9pbnB1dCA9IHRoaXNcbiAgdGhpcy5rZXlfY2FsbGJhY2tzID0ge1xuICAgIGQ6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIildLFxuICAgIHc6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIildLFxuICAgIGE6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKV0sXG4gICAgczogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXSxcbiAgfVxuICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzID0ge1xuICAgIDE6IFtdXG4gIH1cblxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gKCkgPT4ge1xuICAgIGNvbnN0IGtleXNfZG93biA9IE9iamVjdC5rZXlzKHRoaXMua2V5c19jdXJyZW50bHlfZG93bikuZmlsdGVyKChrZXkpID0+IHRoaXMua2V5c19jdXJyZW50bHlfZG93bltrZXldID09PSB0cnVlKVxuICAgIGtleXNfZG93bi5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICghKE9iamVjdC5rZXlzKHRoaXMua2V5X2NhbGxiYWNrcykuaW5jbHVkZXMoa2V5KSkpIHJldHVyblxuXG4gICAgICB0aGlzLmtleV9jYWxsYmFja3Nba2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soKSlcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5rZXltYXAgPSB7XG4gICAgZDogXCJyaWdodFwiLFxuICAgIHc6IFwidXBcIixcbiAgICBhOiBcImxlZnRcIixcbiAgICBzOiBcImRvd25cIixcbiAgfVxuXG4gIHRoaXMua2V5c19jdXJyZW50bHlfZG93biA9IHtcbiAgICBkOiBmYWxzZSxcbiAgICB3OiBmYWxzZSxcbiAgICBhOiBmYWxzZSxcbiAgICBzOiBmYWxzZSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBLZXlib2FyZElucHV0O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vdCB7XG4gICAgY29uc3RydWN0b3IoaXRlbSwgcXVhbnRpdHkgPSAxKSB7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGVcIlxuXG5jbGFzcyBMb290Qm94IHtcbiAgICBjb25zdHJ1Y3Rvcihnbykge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZVxuICAgICAgICB0aGlzLmdvID0gZ29cbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgICAgIHRoaXMueCA9IDBcbiAgICAgICAgdGhpcy55ID0gMFxuICAgICAgICB0aGlzLndpZHRoID0gMzUwXG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybjtcblxuICAgICAgICAvLyBJZiB0aGUgcGxheWVyIG1vdmVzIGF3YXksIGRlbGV0ZSBpdGVtcyBhbmQgaGlkZSBsb290IGJveCBzY3JlZW5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKFZlY3RvcjIuZGlzdGFuY2UodGhpcywgdGhpcy5nby5jaGFyYWN0ZXIpID4gNTAwKSB8fFxuICAgICAgICAgICAgKHRoaXMuaXRlbXMubGVuZ3RoIDw9IDApXG4gICAgICAgICkge1xuXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVKb2luID0gJ2JldmVsJztcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyMDAsIDI1NSwgMC41KVwiO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zW2luZGV4XVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICAgICAgbG9vdC54ID0gdGhpcy54ICsgMjUgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICBsb290LnkgPSB0aGlzLnkgKyAoaW5kZXggKiA2MCkgKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICAgICAgICAgIGxvb3Qud2lkdGggPSAzNDBcbiAgICAgICAgICAgIGxvb3QuaGVpZ2h0ID0gNTVcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KGxvb3QueCwgbG9vdC55LCBsb290LndpZHRoLCBsb290LmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShsb290Lml0ZW0uaW1hZ2UsIGxvb3QueCArIDUsIGxvb3QueSArIDUsIDQ1LCA0NSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnMjJweCBzZXJpZidcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QucXVhbnRpdHksIGxvb3QueCArIDY1LCBsb290LnkgKyAzNSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QuaXRlbS5uYW1lLCBsb290LnggKyAxMDAsIGxvb3QueSArIDM1KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIHRoaXMudmlzaWJsZSA9IHRydWVcbiAgICAgIHRoaXMueCA9IHRoaXMuZ28uY2hhcmFjdGVyLnhcbiAgICAgIHRoaXMueSA9IHRoaXMuZ28uY2hhcmFjdGVyLnlcbiAgICB9XG5cbiAgICB0YWtlX2xvb3QobG9vdF9pbmRleCkge1xuICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXMuc3BsaWNlKGxvb3RfaW5kZXgsIDEpWzBdXG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLmludmVudG9yeS5hZGQobG9vdC5pdGVtKVxuICAgIH1cblxuICAgIGNoZWNrX2l0ZW1fY2xpY2tlZChldikge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuXG5cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGxvb3QpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPj0gbG9vdC54KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRYIDw9IGxvb3QueCArIGxvb3Qud2lkdGgpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPj0gbG9vdC55KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRZIDw9IGxvb3QueSArIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgKVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnRha2VfbG9vdChpbmRleClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vdEJveCIsImZ1bmN0aW9uIFJlc291cmNlQmFyKHsgZ28sIHgsIHksIHdpZHRoID0gMTAwLCBoZWlnaHQgPSAxMCwgY29sb3VyID0gXCJyZWRcIiB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLnggPSB4XG4gIHRoaXMueSA9IHlcbiAgdGhpcy53aWR0aCA9IHdpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuY29sb3VyID0gY29sb3VyXG4gIHRoaXMuZnVsbCA9IDEwMFxuICB0aGlzLmN1cnJlbnQgPSAxMDBcbiAgLy8gU3RheXMgc3RhdGljIGluIGEgcG9zaXRpb24gaW4gdGhlIG1hcFxuICAvLyBNZWFuaW5nOiBkb2Vzbid0IG1vdmUgd2l0aCB0aGUgY2FtZXJhXG4gIHRoaXMuc3RhdGljID0gZmFsc2VcbiAgdGhpcy54X29mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgdGhpcy5nby5jYW1lcmEueCA6XG4gICAgICAwO1xuICB9XG4gIHRoaXMueV9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGljID9cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgOlxuICAgICAgMDtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoY3VycmVudCAvIGZ1bGwpICogdGhpcy53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvdXJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUJhclxuIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMud2lkdGggID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodDtcblxuICB0aGlzLmNsZWFyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmNsZWFyKClcbiAgICB0aGlzLmdvLndvcmxkLmRyYXcoKVxuICB9XG5cbiAgdGhpcy5kcmF3X2dhbWVfb3ZlciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC43KVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5nby5jdHguZm9udCA9ICc3MnB4IHNlcmlmJ1xuICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsICh0aGlzLmdvLmNhbnZhcy53aWR0aCAvIDIpIC0gKHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KFwiR2FtZSBPdmVyXCIpLndpZHRoIC8gMiksIHRoaXMuZ28uY2FudmFzLmhlaWdodCAvIDIpO1xuICB9XG5cbiAgdGhpcy5kcmF3X2ZvZyA9ICgpID0+IHtcbiAgICB2YXIgeCA9IHRoaXMuZ28uY2hhcmFjdGVyLnggKyB0aGlzLmdvLmNoYXJhY3Rlci53aWR0aCAvIDIgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgdmFyIHkgPSB0aGlzLmdvLmNoYXJhY3Rlci55ICsgdGhpcy5nby5jaGFyYWN0ZXIuaGVpZ2h0IC8gMiAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICB2YXIgZ3JhZGllbnQgPSB0aGlzLmdvLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCA3MDApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLCAwLCAwLCAwKScpXG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsIDAsIDAsIDEpJylcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudFxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHNjcmVlbi53aWR0aCwgc2NyZWVuLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlcnZlcihnbykge1xuICB0aGlzLmdvID0gZ29cblxuICAvL3RoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4OTk5XCIpXG4gIHRoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL251YmFyaWEuaGVyb2t1YXBwLmNvbTo1NDA4MlwiKVxuICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5sb2dpbih0aGlzLmdvLmNoYXJhY3RlcilcbiAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGV0IHBheWxvYWQgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpXG4gICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvbikge1xuICAgICAgY2FzZSBcImxvZ2luXCI6XG4gICAgICAgIGxldCBuZXdfY2hhciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICAgIG5ld19jaGFyLm5hbWUgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWVcbiAgICAgICAgbmV3X2NoYXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICBuZXdfY2hhci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4gICAgICAgIGNvbnNvbGUubG9nKGBBZGRpbmcgbmV3IGNoYXJgKVxuICAgICAgICBwbGF5ZXJzLnB1c2gobmV3X2NoYXIpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwicGluZ1wiOlxuICAgICAgICAvL2dvLmN0eC5maWxsUmVjdChwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLngsIHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueSwgNTAsIDUwKVxuICAgICAgICAvL2dvLmN0eC5zdHJva2UoKVxuICAgICAgICAvL2xldCBwbGF5ZXIgPSBwbGF5ZXJzWzBdIC8vcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIubmFtZSA9PT0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lKVxuICAgICAgICAvL2lmIChwbGF5ZXIpIHtcbiAgICAgICAgLy8gIHBsYXllci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4gICAgICAgIC8vICBwbGF5ZXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICAvL31cbiAgICAgICAgLy9icmVhaztcbiAgICB9XG4gIH0gLy9cbiAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cblxuICB0aGlzLnBpbmcgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLCBcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG59XG4iLCJjb25zdCBkaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBNYXRoLmFicyhNYXRoLmZsb29yKGEpIC0gTWF0aC5mbG9vcihiKSk7XG59XG5cbmNvbnN0IFZlY3RvcjIgPSB7XG4gIGRpc3RhbmNlOiAoYSwgYikgPT4gTWF0aC50cnVuYyhNYXRoLnNxcnQoTWF0aC5wb3coYi54IC0gYS54LCAyKSArIE1hdGgucG93KGIueSAtIGEueSwgMikpKVxufVxuXG5jb25zdCBpc19jb2xsaWRpbmcgPSBmdW5jdGlvbihzZWxmLCB0YXJnZXQpIHtcbiAgaWYgKFxuICAgIChzZWxmLnggPCB0YXJnZXQueCArIHRhcmdldC53aWR0aCkgJiZcbiAgICAoc2VsZi54ICsgc2VsZi53aWR0aCA+IHRhcmdldC54KSAmJlxuICAgIChzZWxmLnkgPCB0YXJnZXQueSArIHRhcmdldC5oZWlnaHQpICYmXG4gICAgKHNlbGYueSArIHNlbGYuaGVpZ2h0ID4gdGFyZ2V0LnkpXG4gICkge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSBmdW5jdGlvbiAoeCA9IDEwLCB5ID0gMTAsIHcgPSAyMCwgaCA9IDIwLCBjb2xvciA9IFwicmdiKDE5MCwgMjAsIDEwKVwiKSB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xufVxuXG5jb25zdCByYW5kb20gPSAoc3RhcnQsIGVuZCkgPT4ge1xuICBpZiAoZW5kID09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHN0YXJ0XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgcmV0dXJuIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGVuZCkgKyBzdGFydCAgXG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyLCByYW5kb20gfVxuIiwiY2xhc3MgVGlsZSB7XG4gICAgY29uc3RydWN0b3IoaW1hZ2Vfc3JjLCB4X29mZnNldCA9IDAsIHlfb2Zmc2V0ID0gMCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICAgICAgdGhpcy5pbWFnZS5zcmMgPSBpbWFnZV9zcmNcbiAgICAgICAgdGhpcy54X29mZnNldCA9IHhfb2Zmc2V0XG4gICAgICAgIHRoaXMueV9vZmZzZXQgPSB5X29mZnNldFxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbGUiLCJpbXBvcnQgVGlsZSBmcm9tIFwiLi90aWxlXCJcblxuZnVuY3Rpb24gV29ybGQoZ28pIHtcbiAgdGhpcy5nbyA9IGdvO1xuICB0aGlzLmdvLndvcmxkID0gdGhpcztcbiAgdGhpcy53aWR0aCA9IDEwMDAwO1xuICB0aGlzLmhlaWdodCA9IDEwMDAwO1xuICB0aGlzLnRpbGVfc2V0ID0ge1xuICAgIGdyYXNzOiBuZXcgVGlsZShcImdyYXNzLnBuZ1wiLCAwLCAwLCA2NCwgNjMpLFxuICAgIGRpcnQ6IG5ldyBUaWxlKFwiZGlydDIucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgc3RvbmU6IG5ldyBUaWxlKFwiZmxpbnRzdG9uZS5wbmdcIiwgMCwgMCwgODQwLCA4NTkpLFxuICB9XG4gIHRoaXMucGlja19yYW5kb21fdGlsZSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy50aWxlX3NldC5ncmFzc1xuICB9XG4gIHRoaXMudGlsZV93aWR0aCA9IDY0XG4gIHRoaXMudGlsZV9oZWlnaHQgPSA2NFxuICB0aGlzLnRpbGVzX3Blcl9yb3cgPSBNYXRoLnRydW5jKHRoaXMud2lkdGggLyB0aGlzLnRpbGVfd2lkdGgpICsgMTtcbiAgdGhpcy50aWxlc19wZXJfY29sdW1uID0gTWF0aC50cnVuYyh0aGlzLmhlaWdodCAvIHRoaXMudGlsZV9oZWlnaHQpICsgMTtcbiAgdGhpcy50aWxlcyA9IG51bGw7XG4gIHRoaXMuZ2VuZXJhdGVfbWFwID0gKCkgPT4ge1xuICAgIHRoaXMudGlsZXMgPSBuZXcgQXJyYXkodGhpcy50aWxlc19wZXJfcm93KTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPD0gdGhpcy50aWxlc19wZXJfcm93OyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDw9IHRoaXMudGlsZXNfcGVyX2NvbHVtbjsgY29sdW1uKyspIHtcbiAgICAgICAgaWYgKHRoaXMudGlsZXNbcm93XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddID0gW3RoaXMucGlja19yYW5kb21fdGlsZSgpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGlsZXNbcm93XS5wdXNoKHRoaXMucGlja19yYW5kb21fdGlsZSgpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPD0gdGhpcy50aWxlc19wZXJfcm93OyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDw9IHRoaXMudGlsZXNfcGVyX2NvbHVtbjsgY29sdW1uKyspIHtcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLnRpbGVzW3Jvd11bY29sdW1uXVxuICAgICAgICBpZiAodGlsZSAhPT0gdGhpcy50aWxlX3NldC5ncmFzcykge1xuICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLnRpbGVfc2V0LmdyYXNzLmltYWdlLFxuICAgICAgICAgICAgdGhpcy50aWxlX3NldC5ncmFzcy54X29mZnNldCwgdGhpcy50aWxlX3NldC5ncmFzcy55X29mZnNldCwgdGhpcy50aWxlX3NldC5ncmFzcy53aWR0aCwgdGhpcy50aWxlX3NldC5ncmFzcy5oZWlnaHQsXG4gICAgICAgICAgICAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsIChjb2x1bW4gKiB0aGlzLnRpbGVfaGVpZ2h0KSAtIHRoaXMuZ28uY2FtZXJhLnksIDY0LCA2NClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGlsZS5pbWFnZSxcbiAgICAgICAgICB0aWxlLnhfb2Zmc2V0LCB0aWxlLnlfb2Zmc2V0LCB0aWxlLndpZHRoLCB0aWxlLmhlaWdodCxcbiAgICAgICAgICAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsIChjb2x1bW4gKiB0aGlzLnRpbGVfaGVpZ2h0KSAtIHRoaXMuZ28uY2FtZXJhLnksIDY0LCA2NClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV29ybGQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gXCIuL2dhbWVfb2JqZWN0LmpzXCJcbmltcG9ydCBTY3JlZW4gZnJvbSBcIi4vc2NyZWVuLmpzXCJcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vY2FtZXJhLmpzXCJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyLmpzXCJcbmltcG9ydCBLZXlib2FyZElucHV0IGZyb20gXCIuL2tleWJvYXJkX2lucHV0LmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiwgcmFuZG9tIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCB7XG4gIHNldENsaWNrQ2FsbGJhY2ssXG4gIHNldE1vdXNlTW92ZUNhbGxiYWNrLFxuICBzZXRNb3VzZXVwQ2FsbGJhY2ssXG4gIHNldE1vdXNlZG93bkNhbGxiYWNrLFxuICBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2ssXG4gIHNldFRvdWNoZW5kQ2FsbGJhY2ssXG59IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuaW1wb3J0IEdhbWVMb29wIGZyb20gXCIuL2dhbWVfbG9vcC5qc1wiXG5pbXBvcnQgV29ybGQgZnJvbSBcIi4vd29ybGQuanNcIlxuaW1wb3J0IERvb2RhZCBmcm9tIFwiLi9kb29kYWQuanNcIlxuaW1wb3J0IENvbnRyb2xzIGZyb20gXCIuL2NvbnRyb2xzLmpzXCJcbmltcG9ydCBJdGVtIGZyb20gXCIuL2l0ZW1cIlxuaW1wb3J0IFNlcnZlciBmcm9tIFwiLi9zZXJ2ZXJcIlxuaW1wb3J0IFRpbGUgZnJvbSBcIi4vdGlsZS5qc1wiXG5pbXBvcnQgTG9vdEJveCBmcm9tIFwiLi9sb290X2JveC5qc1wiXG5pbXBvcnQgTG9vdCBmcm9tIFwiLi9sb290LmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4vY2FzdGluZ19iYXIuanNcIlxuXG5jb25zdCBnbyA9IG5ldyBHYW1lT2JqZWN0KClcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGdvKVxuY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCB3b3JsZCA9IG5ldyBXb3JsZChnbylcbmNvbnN0IGNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGdvKVxuY2hhcmFjdGVyLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbylcbmNvbnN0IGxvb3RfYm94ID0gbmV3IExvb3RCb3goZ28pXG5jb25zdCBjb2xkID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHg6IDUsIHk6IDUsIHdpZHRoOiAyMDAsIGhlaWdodDogMjAgfSlcbmNvbnN0IGNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbyB9KVxuXG5jb25zdCBjbGlja19jYWxsYmFja3MgPSBzZXRDbGlja0NhbGxiYWNrKGdvKVxuY2xpY2tfY2FsbGJhY2tzLnB1c2goY2xpY2thYmxlX2NsaWNrZWQpXG5mdW5jdGlvbiBjbGlja2FibGVfY2xpY2tlZChldikge1xuICBsZXQgY2xpY2sgPSB7IHg6IGV2LmNsaWVudFggKyBnby5jYW1lcmEueCwgeTogZXYuY2xpZW50WSArIGdvLmNhbWVyYS55LCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgY29uc3QgY2xpY2thYmxlID0gZ28uY2xpY2thYmxlcy5maW5kKChjbGlja2FibGUpID0+IGlzX2NvbGxpZGluZyhjbGlja2FibGUsIGNsaWNrKSlcbiAgaWYgKGNsaWNrYWJsZSkge1xuICAgIGNsaWNrYWJsZS5hY3RpdmF0ZWQgPSAhY2xpY2thYmxlLmFjdGl2YXRlZFxuICB9XG4gIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IGNsaWNrYWJsZVxufVxuXG5sZXQgbW91c2VfaXNfZG93biA9IGZhbHNlXG5sZXQgbW91c2VfcG9zaXRpb24gPSB7fVxuY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlTW92ZUNhbGxiYWNrKGdvKVxubW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKHRyYWNrX21vdXNlX3Bvc2l0aW9uKVxuZnVuY3Rpb24gdHJhY2tfbW91c2VfcG9zaXRpb24oZXZ0KSB7XG4gIHZhciByZWN0ID0gZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIG1vdXNlX3Bvc2l0aW9uID0ge1xuICAgIHg6IGV2dC5jbGllbnRYIC0gcmVjdC5sZWZ0ICsgY2FtZXJhLngsXG4gICAgeTogZXZ0LmNsaWVudFkgLSByZWN0LnRvcCArIGNhbWVyYS55XG4gIH1cbn1cbmNvbnN0IG1vdXNlZG93bl9jYWxsYmFja3MgPSBzZXRNb3VzZWRvd25DYWxsYmFjayhnbylcbm1vdXNlZG93bl9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSB0cnVlKVxuY29uc3QgbW91c2V1cF9jYWxsYmFja3MgPSBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxubW91c2V1cF9jYWxsYmFja3MucHVzaChsb290X2JveC5jaGVja19pdGVtX2NsaWNrZWQuYmluZChsb290X2JveCkpXG5jb25zdCB0b3VjaHN0YXJ0X2NhbGxiYWNrcyA9IHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbylcbnRvdWNoc3RhcnRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbmNvbnN0IHRvdWNoZW5kX2NhbGxiYWNrcyA9IHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pXG50b3VjaGVuZF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSBmYWxzZSlcbmZ1bmN0aW9uIGNvbnRyb2xzX21vdmVtZW50KCkge1xuICAvLyBnby5jbGlja2FibGVzLmZvckVhY2goKGNsaWNrYWJsZSkgPT4ge1xuICAvLyAgIGlmIChjbGlja2FibGUuYWN0aXZhdGVkKSB7XG4gIC8vICAgICBjbGlja2FibGUuY2xpY2soKVxuICAvLyAgIH1cbiAgLy8gfSlcbn1cblxubGV0IGN1cnJlbnRfY29sZF9sZXZlbCA9IDEwMFxuZnVuY3Rpb24gdXBkYXRlX2NvbGRfbGV2ZWwoKSB7XG4gIGlmIChmaXJlcy5maW5kKChmaXJlKSA9PiBWZWN0b3IyLmRpc3RhbmNlKGZpcmUsIGNoYXJhY3RlcikgPD0gMTUwKSkge1xuICAgIGlmIChjdXJyZW50X2NvbGRfbGV2ZWwgPCAxMDApIHtcbiAgICAgIGlmIChjdXJyZW50X2NvbGRfbGV2ZWwgKyA1ID4gMTAwKSB7XG4gICAgICAgIGN1cnJlbnRfY29sZF9sZXZlbCA9IDEwMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudF9jb2xkX2xldmVsICs9IDU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGN1cnJlbnRfY29sZF9sZXZlbCAtPSAxO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZV9ib29uZmlyZXNfZnVlbCgpIHtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGZpcmVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGxldCBmaXJlID0gZmlyZXNbaW5kZXhdXG4gICAgaWYgKGZpcmUuZnVlbCA8PSAwKSB7XG4gICAgICBmaXJlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaXJlLmZ1ZWwgLT0gMTtcbiAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgLT0gMTtcbiAgICB9XG4gIH1cbn1cblxubGV0IEZQUyA9IDMwXG5sZXQgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGlmICgoRGF0ZS5ub3coKSAtIGxhc3RfdGljaykgPiAxMDAwKSB7XG4gICAgdXBkYXRlX2ZwcygpXG4gICAgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICB9XG4gIGNvbnRyb2xzX21vdmVtZW50KClcbn1cblxuZnVuY3Rpb24gdXBkYXRlX2ZwcygpIHtcbiAgdXBkYXRlX2NvbGRfbGV2ZWwoKVxuICB1cGRhdGVfYm9vbmZpcmVzX2Z1ZWwoKVxufVxuXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBzY3JlZW4uZHJhdygpXG4gIHN0b25lcy5mb3JFYWNoKHN0b25lID0+IHN0b25lLmRyYXcoKSlcbiAgdHJlZXMuZm9yRWFjaCh0cmVlID0+IHRyZWUuZHJhdygpKVxuICBmaXJlcy5mb3JFYWNoKGZpcmUgPT4gZmlyZS5kcmF3KCkpXG4gIGNoYXJhY3Rlci5kcmF3KClcbiAgc2NyZWVuLmRyYXdfZm9nKClcbiAgbG9vdF9ib3guZHJhdygpXG4gIGNvbGQuZHJhdygxMDAsIGN1cnJlbnRfY29sZF9sZXZlbClcbiAgY2FzdGluZ19iYXIuZHJhdygpXG4gIGdvLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlKClcbiAgLy8gY29udHJvbHMuZHJhdygpYVxufVxuXG5jb25zdCBkaWNlID0gKHNpZGVzLCB0aW1lcyA9IDEpID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oQXJyYXkodGltZXMpKS5tYXAoKGkpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpZGVzKSArIDEpO1xufVxuXG5jb25zdCBmaXJlcyA9IFtdXG5jb25zdCBtYWtlX2ZpcmUgPSAoKSA9PiB7XG4gIGNhc3RpbmdfYmFyLnN0YXJ0KDE1MDApXG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbGV0IGRyeV9sZWF2ZXMgPSBjaGFyYWN0ZXIuaW52ZW50b3J5LmZpbmQoXCJkcnkgbGVhdmVzXCIpXG4gICAgbGV0IHdvb2QgPSBjaGFyYWN0ZXIuaW52ZW50b3J5LmZpbmQoXCJ3b29kXCIpXG4gICAgbGV0IGZsaW50c3RvbmUgPSBjaGFyYWN0ZXIuaW52ZW50b3J5LmZpbmQoXCJmbGludHN0b25lXCIpXG4gICAgaWYgKGRyeV9sZWF2ZXMgJiYgZHJ5X2xlYXZlcy5xdWFudGl0eSA+IDAgJiZcbiAgICAgIHdvb2QgJiYgd29vZC5xdWFudGl0eSA+IDAgJiZcbiAgICAgIGZsaW50c3RvbmUgJiYgZmxpbnRzdG9uZS5xdWFudGl0eSA+IDApIHtcbiAgICAgIGRyeV9sZWF2ZXMucXVhbnRpdHkgLT0gMVxuICAgICAgd29vZC5xdWFudGl0eSAtPSAxXG4gICAgICBsZXQgZmlyZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICAgICAgZmlyZS5pbWFnZS5zcmMgPSBcImJvbmZpcmUucG5nXCJcbiAgICAgIGZpcmUuaW1hZ2VfeF9vZmZzZXQgPSAyNTBcbiAgICAgIGZpcmUuaW1hZ2VfeV9vZmZzZXQgPSAyNTBcbiAgICAgIGZpcmUuaW1hZ2VfaGVpZ2h0ID0gMzUwXG4gICAgICBmaXJlLmltYWdlX3dpZHRoID0gMzAwXG4gICAgICBmaXJlLndpZHRoID0gNjRcbiAgICAgIGZpcmUuaGVpZ2h0ID0gNjRcbiAgICAgIGZpcmUueCA9IGNoYXJhY3Rlci54O1xuICAgICAgZmlyZS55ID0gY2hhcmFjdGVyLnk7XG4gICAgICBmaXJlLmZ1ZWwgPSAyMDtcbiAgICAgIGZpcmUucmVzb3VyY2VfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHg6IGZpcmUueCwgeTogZmlyZS55ICsgZmlyZS5oZWlnaHQsIHdpZHRoOiBmaXJlLndpZHRoLCBoZWlnaHQ6IDUgfSlcbiAgICAgIGZpcmUucmVzb3VyY2VfYmFyLnN0YXRpYyA9IHRydWVcbiAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmZ1bGwgPSAyMDtcbiAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgPSAyMDtcbiAgICAgIGZpcmVzLnB1c2goZmlyZSlcbiAgICAgIGdvLmNsaWNrYWJsZXMucHVzaChmaXJlKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIllvdSBkb250IGhhdmUgYWxsIHJlcXVpcmVkIG1hdGVyaWFscyB0byBtYWtlIGEgZmlyZS5cIilcbiAgICB9XG4gIH0sIDE1MDApXG59XG4vLz0gRG9vZGFkc1xuXG5jb25zdCB0cmVlcyA9IFtdXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgbGV0IHRyZWUgPSBuZXcgRG9vZGFkKHsgZ28gfSlcbiAgdHJlZS54ID0gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogZ28ud29ybGQud2lkdGgpIC0gdHJlZS53aWR0aDtcbiAgdHJlZS55ID0gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogZ28ud29ybGQuaGVpZ2h0KSAtIHRyZWUuaGVpZ2h0O1xuICB0cmVlcy5wdXNoKHRyZWUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaCh0cmVlKVxufSlcblxubGV0IGxvb3RfdGFibGVfdHJlZSA9IFt7XG4gIGl0ZW06IHsgbmFtZTogXCJXb29kXCIsIGltYWdlX3NyYzogXCJicmFuY2gucG5nXCIgfSxcbiAgbWluOiAxLFxuICBtYXg6IDMsXG4gIGNoYW5jZTogOTVcbn0sXG57XG4gIGl0ZW06IHsgbmFtZTogXCJEcnkgTGVhdmVzXCIsIGltYWdlX3NyYzogXCJsZWF2ZXMuanBlZ1wiIH0sXG4gIG1pbjogMSxcbiAgbWF4OiAzLFxuICBjaGFuY2U6IDEwMFxufV1cblxuZnVuY3Rpb24gcmVtb3ZlX2NsaWNrYWJsZShkb29kYWQpIHtcbiAgY29uc3QgY2xpY2thYmxlX2luZGV4ID0gZ28uY2xpY2thYmxlcy5pbmRleE9mKGRvb2RhZClcbiAgaWYgKGNsaWNrYWJsZV9pbmRleCA+IC0xKSB7XG4gICAgZ28uY2xpY2thYmxlcy5zcGxpY2UoY2xpY2thYmxlX2luZGV4LCAxKVxuICB9XG4gIGlmIChnby5zZWxlY3RlZF9jbGlja2FibGUgPT09IGRvb2RhZCkge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgfVxufVxuXG5jb25zdCBjdXRfdHJlZSA9ICgpID0+IHtcbiAgLy8gQ291bGQgZ2l2ZSBpdCB0aGUgZnVuY3Rpb24gdG8gYmUgcmFuIGF0IHRoZSBlbmQgYXMgYSBjYWxsYmFja1xuICBjb25zdCB0YXJnZXRlZF90cmVlID0gdHJlZXMuZmluZCgodHJlZSkgPT4gVmVjdG9yMi5kaXN0YW5jZSh0cmVlLCBjaGFyYWN0ZXIpIDwgMTAwKVxuICBpZiAodGFyZ2V0ZWRfdHJlZSA9PT0gZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgY2FzdGluZ19iYXIuc3RhcnQoMzAwMClcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmVlcy5pbmRleE9mKHRhcmdldGVkX3RyZWUpXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICBsb290X2JveC5pdGVtcyA9IHJvbGxfbG9vdChsb290X3RhYmxlX3RyZWUpXG4gICAgICAgIGxvb3RfYm94LnNob3coKVxuICAgICAgICB0cmVlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICB9XG4gICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3RyZWUpXG4gICAgfSwgMzAwMCk7XG4gIH1cbn1cbmtleWJvYXJkX2lucHV0LmtleV9jYWxsYmFja3NbXCJmXCJdID0gW2N1dF90cmVlXVxuXG5jb25zdCBzdG9uZXMgPSBbXVxuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGxldCBzdG9uZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICBzdG9uZS5pbWFnZS5zcmMgPSBcImZsaW50c3RvbmUucG5nXCJcbiAgc3RvbmUueCA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLndpZHRoKTtcbiAgc3RvbmUueSA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLmhlaWdodCk7XG4gIHN0b25lLmltYWdlX3dpZHRoID0gODQwXG4gIHN0b25lLmltYWdlX2hlaWdodCA9IDg1OVxuICBzdG9uZS5pbWFnZV94X29mZnNldCA9IDBcbiAgc3RvbmUuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHN0b25lLndpZHRoID0gMzJcbiAgc3RvbmUuaGVpZ2h0ID0gMzJcbiAgc3RvbmVzLnB1c2goc3RvbmUpXG59KVxuXG5sZXQgbG9vdF90YWJsZV9zdG9uZSA9IFt7XG4gIGl0ZW06IHsgbmFtZTogXCJGbGludHN0b25lXCIsIGltYWdlX3NyYzogXCJmbGludHN0b25lLnBuZ1wiIH0sXG4gIG1pbjogMSxcbiAgbWF4OiAxLFxuICBjaGFuY2U6IDEwMFxufV1cblxuY29uc3Qgcm9sbF9sb290ID0gKGxvb3RfdGFibGUpID0+IHtcbiAgbGV0IHJlc3VsdCA9IGxvb3RfdGFibGUubWFwKChsb290X2VudHJ5KSA9PiB7XG4gICAgbGV0IHJvbGwgPSBkaWNlKDEwMClcbiAgICBpZiAocm9sbCA8PSBsb290X2VudHJ5LmNoYW5jZSkge1xuICAgICAgY29uc3QgaXRlbV9idW5kbGUgPSBuZXcgSXRlbShsb290X2VudHJ5Lml0ZW0ubmFtZSlcbiAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IGxvb3RfZW50cnkuaXRlbS5pbWFnZV9zcmNcbiAgICAgIGl0ZW1fYnVuZGxlLnF1YW50aXR5ID0gcmFuZG9tKGxvb3RfZW50cnkubWluLCBsb290X2VudHJ5Lm1heClcbiAgICAgIHJldHVybiBuZXcgTG9vdChpdGVtX2J1bmRsZSwgaXRlbV9idW5kbGUucXVhbnRpdHkpXG4gICAgfVxuICB9KS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeSAhPT0gdW5kZWZpbmVkKVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmNvbnN0IGJyZWFrX3N0b25lID0gKCkgPT4ge1xuICBjb25zdCB0YXJnZXRlZF9zdG9uZSA9IHN0b25lcy5maW5kKChzdG9uZSkgPT4gVmVjdG9yMi5kaXN0YW5jZShzdG9uZSwgY2hhcmFjdGVyKSA8IDEwMClcbiAgaWYgKHRhcmdldGVkX3N0b25lKSB7XG4gICAgY2FzdGluZ19iYXIuc3RhcnQoMzAwMClcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBzdG9uZXMuaW5kZXhPZih0YXJnZXRlZF9zdG9uZSlcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGxvb3RfYm94Lml0ZW1zID0gcm9sbF9sb290KGxvb3RfdGFibGVfc3RvbmUpXG4gICAgICAgIGxvb3RfYm94LnNob3coKVxuICAgICAgICBzdG9uZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgfVxuICAgIH0sIDMwMDApXG4gIH1cbn1cbmtleWJvYXJkX2lucHV0LmtleV9jYWxsYmFja3NbXCJmXCJdLnB1c2goYnJlYWtfc3RvbmUpXG5cbmNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG5nYW1lX2xvb3AuZHJhdyA9IGRyYXdcbmdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IGdvLmtleWJvYXJkX2lucHV0LnByb2Nlc3Nfa2V5c19kb3duXG5nYW1lX2xvb3AudXBkYXRlID0gdXBkYXRlXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1sxXS5wdXNoKCgpID0+IG1ha2VfZmlyZSgpKVxuXG5jb25zdCBzdGFydCA9ICgpID0+IHtcbiAgY2hhcmFjdGVyLnggPSAxMDBcbiAgY2hhcmFjdGVyLnkgPSAxMDBcbiAgZ28ud29ybGQuZ2VuZXJhdGVfbWFwKClcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG59XG5cbnN0YXJ0KClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==