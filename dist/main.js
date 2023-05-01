/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/behaviors/aggro.js":
/*!********************************!*\
  !*** ./src/behaviors/aggro.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Aggro)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");
/* harmony import */ var _move__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./move */ "./src/behaviors/move.js");



function Aggro({ go, entity, radius = 20 }) {
    this.go = go
    this.entity = entity
    this.radius = radius
    this.move = new _move__WEBPACK_IMPORTED_MODULE_1__.Move({ go, entity, target_position: this.go.character })

    this.act = () => {
        if (_tapete__WEBPACK_IMPORTED_MODULE_0__.Vector2.distance(this.go.character, entity) < this.radius) {
            this.move.act();
        }
    }
} 

/***/ }),

/***/ "./src/behaviors/move.js":
/*!*******************************!*\
  !*** ./src/behaviors/move.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Move": () => (/* binding */ Move)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");


class Move {
    constructor({ go, entity, speed = 1, target_position }) {
        this.go = go
        this.entity = entity
        this.speed = speed
        this.target_position = target_position

        this.act = () => {
            const next_step = {
                x: this.entity.x + this.speed * Math.cos(_tapete__WEBPACK_IMPORTED_MODULE_0__.Vector2.angle(this.entity, this.target_position)),
                y: this.entity.y + this.speed * Math.sin(_tapete__WEBPACK_IMPORTED_MODULE_0__.Vector2.angle(this.entity, this.target_position)),
            }
            this.entity.x = next_step.x
            this.entity.y = next_step.y
        }
    }
}

/***/ }),

/***/ "./src/behaviors/stats.js":
/*!********************************!*\
  !*** ./src/behaviors/stats.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Stats)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");


function Stats({ go, entity, hp = 100, current_hp, mana, current_mana }) {
    this.go = go
    this.entity = entity
    this.hp = hp || 100
    this.current_hp = current_hp || hp
    this.mana = mana
    this.current_mana = current_mana || mana

    this.has_mana = () => this.mana === undefined;
    this.is_dead = () => this.current_hp <= 0;
    this.is_alive = () => !this.is_dead();
    this.take_damage = ({ damage }) => {
        this.current_hp -= damage;
        if (this.is_dead()) this.die()
    }
    this.die = () => {
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this.entity, this.go.creeps) || console.log("Not on list of creeps")
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this.entity, this.go.clickables) || console.log("Not on list of clickables")
        if (this.go.selected_clickable === this.entity) this.go.selected_clickable = null;
    }
}

/***/ }),

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
function CastingBar({ go, entity }) {
    this.go = go
    this.entity = entity
    this.duration = null
    this.width = go.character.width
    this.height = 5
    this.colour = "purple"
    this.full = null
    this.current = 0
    this.starting_time = null
    this.last_time = null
    this.callback = null
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

    this.start = (duration, callback) => {
        this.starting_time = Date.now()
        this.last_time = Date.now()
        this.current = 0
        this.duration = duration
        this.callback = callback
    }

    this.draw = (full = this.full, current = this.current) => {
        console.log("drawing casting bar")
        
        if (this.duration === null) return;

        let elapsed_time = Date.now() - this.last_time;
        this.last_time = Date.now()
        this.current += elapsed_time;
        if (this.current <= this.duration) {
            this.x = this.entity.x - this.go.camera.x
            this.y = this.entity.y + this.entity.height + 10 - this.go.camera.y
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
            if (this.callback !== null) this.callback();
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
/* harmony import */ var _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./spells/frostbolt.js */ "./src/spells/frostbolt.js");
/* harmony import */ var _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./behaviors/stats.js */ "./src/behaviors/stats.js");
/* harmony import */ var _casting_bar_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./casting_bar.js */ "./src/casting_bar.js");








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
  this.spells = {
    frostbolt: new Spellcasting({ go, entity: this, spell: new _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this }) }).cast
  }
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this });

  function Spellcasting({ go, entity, spell }) {
    this.go = go
    this.entity = entity
    this.spell = spell
    this.casting_bar = new _casting_bar_js__WEBPACK_IMPORTED_MODULE_5__["default"]({ go, entity: entity })

    this.draw = () => {
      this.casting_bar.draw()
    }

    this.update = () => { }
    this.end = () => {
      ;(0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this, this.go.managed_objects)
      console.log("Sellcasting#end")
      this.spell.act()
    }

    this.cast = () => {
      console.log("Spellcasting#cast")
      this.go.managed_objects.push(this)
      this.casting_bar.start(1500, this.end)
    }
  }

  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 20, colour: "red" })
  this.mana_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 10, colour: "blue" })

  this.movement_board = []

  this.move_to_waypoint = (wp_name) => {
    let wp = this.go.editor.waypoints.find((wp) => wp.name === wp_name)
    let node = this.go.board.grid[wp.id]
    this.coords(node)
  }

  this.coords = function (coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function () {
    if (this.moving && this.target_movement) this.draw_movement_target()
    this.go.ctx.drawImage(this.image, Math.floor(this.walk_cycle_index) * this.image_width, this.get_direction_sprite() * this.image_height, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
    this.health_bar.draw(this.stats.hp, this.stats.current_hp)
    this.mana_bar.draw(this.stats.mana, this.stats.current_mana)
  }

  this.get_direction_sprite = function () {
    switch (this.direction) {
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

  this.draw_movement_target = function (target_movement = this.target_movement) {
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

    switch (direction) {
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


  Array.prototype.last = function () { return this[this.length - 1] }
  Array.prototype.first = function () { return this[0] }

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
/* harmony import */ var _behaviors_aggro_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./behaviors/aggro.js */ "./src/behaviors/aggro.js");
/* harmony import */ var _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./behaviors/stats.js */ "./src/behaviors/stats.js");





function Creep(go) {
  if (go.creeps === undefined) go.creeps = []
  this.id = go.creeps.length
  this.go = go
  this.go.creeps.push(this)

  this.image = new Image()
  this.image.src = "zergling.png" // placeholder image
  this.image_width = 150
  this.image_height = 150
  this.x = 700
  this.y = 300
  this.width = this.go.tile_size * 4
  this.height = this.go.tile_size * 4
  this.moving = false
  this.direction = null
  this.speed = 2
  //this.movement_board = this.go.board.grid
  this.current_movement_target = null
  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, width: 100, height: 10, colour: "red" })
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this, hp: 20 });
  // Behaviours
  this.aggro = new _behaviors_aggro_js__WEBPACK_IMPORTED_MODULE_2__["default"]({ go, entity: this, radius: 500 });
  // END - Behaviours

  this.coords = function(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function() {
    this.aggro.act();
    this.go.ctx.drawImage(this.image, 0, 0, this.image_width, this.image_height, this.x - go.camera.x, this.y - go.camera.y, this.width, this.height)
    this.health_bar.draw(this.stats.hp, this.stats.current_hp)
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
  this.spells = [] // Spell system, could be injected by it as well
  this.managed_objects = [] // Random objects to draw/update
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
        this.selected_clickable.height + (this.selected_clickable.resource_bar ? 20 : 10));
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
    this.on_keydown_callbacks[ev.key].forEach((callback) => callback(ev))
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

/***/ "./src/particle.js":
/*!*************************!*\
  !*** ./src/particle.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Particle)
/* harmony export */ });
function Particle(go) {
    this.go = go;
    this.active = true;

    this.draw = function ({ x, y }) {
        if (!this.active) return;

        this.go.ctx.beginPath();
        this.go.ctx.arc(x - this.go.camera.x, y - this.go.camera.y, 15, 0, 2 * Math.PI, false);
        this.go.ctx.fillStyle = 'blue';
        this.go.ctx.fill();
        this.go.ctx.lineWidth = 5;
        this.go.ctx.strokeStyle = 'lightblue';
        this.go.ctx.stroke();
    }
}

/***/ }),

/***/ "./src/projectile.js":
/*!***************************!*\
  !*** ./src/projectile.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Projectile)
/* harmony export */ });
/* harmony import */ var _particle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./particle.js */ "./src/particle.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");



function Projectile({ go, subject }) {
    this.go = go;
    this.particle = new _particle_js__WEBPACK_IMPORTED_MODULE_0__["default"](go);
    this.start_position = { x: null, y: null };
    this.current_position = { x: null, y: null };
    this.end_position = { x: null, y: null };
    this.subject = subject
    this.bounds = () => {
        return { ...this.current_position, width: 5, height: 5 }
    }
    this.active = false;

    this.draw = () => {
        if (!this.active) return;
        if (_tapete_js__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(this.end_position, this.current_position) < 5) {
            this.active = false;
            console.log("huh")
            this.subject.end();
            return;
        }

        this.calculate_position();
        this.particle.draw(this.current_position);
    }

    this.calculate_position = () => {
        const angle = _tapete_js__WEBPACK_IMPORTED_MODULE_1__.Vector2.angle(this.current_position, this.end_position);
        this.current_position = {
            x: this.current_position.x + 5 * Math.cos(angle),
            y: this.current_position.y + 5 * Math.sin(angle)
        }
    }
}

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
function ResourceBar({ go, target, y_offset = 10, colour = "red" }) {
  this.go = go
  this.target = target
  this.height = this.target.width / 10;
  this.colour = colour
  this.full = 100
  this.current = 100
  this.y_offset = y_offset
  this.x = () => {
    return this.target.x;
  }

  this.draw = (full = this.full, current = this.current) => {
    let bar_width = (((Math.min(current, full)) / full) * this.target.width)
    this.go.ctx.strokeStyle = "black"
    this.go.ctx.lineWidth = 4
    this.go.ctx.strokeRect(this.x() - this.go.camera.x, this.target.y- this.go.camera.y - this.y_offset, this.target.width, this.height)
    this.go.ctx.fillStyle = "black"
    this.go.ctx.fillRect(this.x() - this.go.camera.x, this.target.y- this.go.camera.y - this.y_offset, this.target.width, this.height)
    this.go.ctx.fillStyle = this.colour
    this.go.ctx.fillRect(this.x() - this.go.camera.x, this.target.y- this.go.camera.y - this.y_offset, bar_width, this.height)
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
    this.go.canvas.width = this.go.canvas.clientWidth
    this.go.canvas.height = this.go.canvas.clientHeight
    this.go.canvas_rect = this.go.canvas.getBoundingClientRect()
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

/***/ "./src/spells/frostbolt.js":
/*!*********************************!*\
  !*** ./src/spells/frostbolt.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Frostbolt)
/* harmony export */ });
/* harmony import */ var _projectile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projectile */ "./src/projectile.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function Frostbolt({ go }) {
    this.go = go
    this.projectile = new _projectile__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, subject: this })
    this.active = false

    this.draw = () => {
        if (!this.active) return;
        console.log("drawing Frostbolt")
        this.projectile.draw();
    }

    this.update = () => {
        if (this.active && ((0,_tapete__WEBPACK_IMPORTED_MODULE_1__.is_colliding)(this.projectile.bounds(), this.go.selected_clickable))) {
            if (damageable(this.go.selected_clickable)) {
                const damage = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(5, 10);
                this.go.selected_clickable.stats.take_damage({ damage });
            }
            this.end();
        }
    }

    this.act = () => {
        console.log("casting Frostbolt")
        if (this.active) return;
        if ((this.go.selected_clickable === null) || (this.go.selected_clickable === undefined)) return;

        this.projectile.start_position = { x: this.go.character.x + 50, y: this.go.character.y + 50 }
        this.projectile.current_position = { x: this.go.character.x + 50, y: this.go.character.y + 50 }
        this.projectile.end_position = {
            x: this.go.selected_clickable.x + this.go.selected_clickable.width / 2,
            y: this.go.selected_clickable.y + this.go.selected_clickable.height / 2
        }
        this.projectile.active = true
        this.active = true
        this.go.spells.push(this)
    }

    this.end = () => {
        console.log("ending frostbolt")
        this.active = false;
        (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.spells);
    }

    function damageable(object) {
        return object.stats !== undefined && object.stats.take_damage !== undefined
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
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "remove_object_if_present": () => (/* binding */ remove_object_if_present)
/* harmony export */ });
const distance = function (a, b) {
  return Math.abs(Math.floor(a) - Math.floor(b));
}

const Vector2 = {
  distance: (a, b) => Math.trunc(Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))),
  angle: (current_position, end_position) => Math.atan2(end_position.y - current_position.y, end_position.x - current_position.x)
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

function remove_object_if_present(object, list) {
  const index = list.indexOf(object);
  if (index > -1) {
    return list.splice(index, 1)[0]
  } else {
    return false
  }
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
/* harmony import */ var _creep_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./creep.js */ "./src/creep.js");
/* harmony import */ var _projectile_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./projectile.js */ "./src/projectile.js");





















const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
go.spells = [];
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
const character = new _character_js__WEBPACK_IMPORTED_MODULE_3__["default"](go)
const keyboard_input = new _keyboard_input_js__WEBPACK_IMPORTED_MODULE_4__["default"](go)
const world = new _world_js__WEBPACK_IMPORTED_MODULE_8__["default"](go)
const controls = new _controls_js__WEBPACK_IMPORTED_MODULE_10__["default"](go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const server = new _server__WEBPACK_IMPORTED_MODULE_12__["default"](go)
const loot_box = new _loot_box_js__WEBPACK_IMPORTED_MODULE_14__["default"](go)
// const cold = new ResourceBar({ go, x: 5, y: 5, width: 200, height: 20 })
const casting_bar = new _casting_bar_js__WEBPACK_IMPORTED_MODULE_17__["default"]({ go })

// Creep
for (let i = 0; i < 50; i++) {
  let creep = new _creep_js__WEBPACK_IMPORTED_MODULE_18__["default"](go);
  creep.x = Math.random() * go.world.width
  creep.y = Math.random() * go.world.height
  go.clickables.push(creep);
}
// END - Creep

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

keyboard_input.on_keydown_callbacks["q"] = [character.spells["frostbolt"]]

const update = () => {
  if ((Date.now() - last_tick) > 1000) {
    update_fps()
    last_tick = Date.now()
  }
  controls_movement()
  go.spells.forEach(spell => spell.update())
  go.managed_objects.forEach(mob => mob.update())
}

function update_fps() {
  update_cold_level()
  update_boonfires_fuel()
}
// Comment
const draw = () => {
  screen.draw()
  stones.forEach(stone => stone.draw())
  trees.forEach(tree => tree.draw())
  fires.forEach(fire => fire.draw())
  go.draw_selected_clickable()
  go.spells.forEach(spell => spell.draw())
  character.draw()
  go.managed_objects.forEach(mob => mob.draw())
  go.creeps.forEach(creep => creep.draw())
  screen.draw_fog()
  loot_box.draw()
  // cold.draw(100, current_cold_level)
  // casting_bar.draw()
  if (show_control_wheel) draw_control_wheel()
  // controls.draw()a
}

const dice = (sides, times = 1) => {
  return Array.from(Array(times)).map((i) => Math.floor(Math.random() * sides) + 1);
}

const fires = []
const make_fire = () => {
  let dry_leaves = character.inventory.find("dry leaves")
  let wood = character.inventory.find("wood")
  let flintstone = character.inventory.find("flintstone")
  if (dry_leaves && dry_leaves.quantity > 0 &&
    wood && wood.quantity > 0 &&
    flintstone && flintstone.quantity > 0) {
    casting_bar.start(1500)

    setTimeout(() => {
      dry_leaves.quantity -= 1
      wood.quantity -= 1
      if (go.selected_clickable &&
        go.selected_clickable.type === "BONFIRE") {
        let fire = fires.find((fire) => go.selected_clickable === fire);
        fire.fuel += 20;
        fire.resource_bar.current += 20;
      } else {
        let fire = new _doodad_js__WEBPACK_IMPORTED_MODULE_9__["default"]({ go })
        fire.type = "BONFIRE"
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
      }
    }, 1500)
  } else {
    console.log("You dont have all required materials to make a fire.")
  }
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
  const targeted_tree = trees.find((tree) => tree === go.selected_clickable)
  if ((!targeted_tree) || (_tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(targeted_tree, character) > 100)) {
    return;
  }

  casting_bar.start(3000, () => {
    const index = trees.indexOf(targeted_tree)
    if (index > -1) {
      loot_box.items = roll_loot(loot_table_tree)
      loot_box.show()
      trees.splice(index, 1)
    }
    remove_clickable(targeted_tree)
  });
}
keyboard_input.key_callbacks["f"] = [cut_tree]

let ordered_clickables = [];
const tab_cycling = (ev) => {
  ev.preventDefault()
  ordered_clickables = go.creeps.sort((a, b) => {
    return _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(a, character) - _tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(b, character);
  })
  if (_tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(ordered_clickables[0], character) > 500) return;

  if (ordered_clickables[0] === go.selected_clickable) {
    go.selected_clickable = ordered_clickables[1];
  } else {
    go.selected_clickable = ordered_clickables[0]
  }
}
keyboard_input.on_keydown_callbacks["Tab"] = [tab_cycling]

let show_control_wheel = false
const draw_control_wheel = () => {
  go.ctx.beginPath()
  go.ctx.arc(
    character.x + (character.width / 2) - go.camera.x,
    character.y + (character.height / 2) - go.camera.y,
    200, 2 * Math.PI, false);
  go.ctx.lineWidth = 5
  go.ctx.strokeStyle = "white"
  go.ctx.stroke();
}
const toggle_control_wheel = () => { show_control_wheel = !show_control_wheel }
keyboard_input.on_keydown_callbacks["c"] = [toggle_control_wheel]

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
  go.clickables.push(stone)
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
  const targeted_stone = stones.find((stone) => stone === go.selected_clickable)
  if ((!targeted_stone) || (_tapete_js__WEBPACK_IMPORTED_MODULE_5__.Vector2.distance(targeted_stone, character) > 100)) {
    return;
  }

  casting_bar.start(3000, () => {
    const index = stones.indexOf(targeted_stone)
    if (index > -1) {
      loot_box.items = roll_loot(loot_table_stone)
      loot_box.show()
      stones.splice(index, 1)
      remove_clickable(targeted_stone)
    }
  })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBOztBQUVBLGlFQUFlLE1BQU0sRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJ0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHVCQUF1QjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBVUU7Ozs7Ozs7Ozs7Ozs7OztBQy9FRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7QUMxQnZCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQy9CQTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLDJCQUEyQixlQUFlLEVBQUUsVUFBVTtBQUN0RDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7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QUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsTyIsInNvdXJjZXMiOlsid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL2FnZ3JvLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL21vdmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYXN0aW5nX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NsaWNrYWJsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NvbnRyb2xzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9kb29kYWQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9ldmVudHNfY2FsbGJhY2tzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9sb29wLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pbnZlbnRvcnkuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pdGVtLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMva2V5Ym9hcmRfaW5wdXQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbG9vdF9ib3guanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Byb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvZnJvc3Rib2x0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vdGFwZXRlXCJcbmltcG9ydCB7IE1vdmUgfSBmcm9tIFwiLi9tb3ZlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWdncm8oeyBnbywgZW50aXR5LCByYWRpdXMgPSAyMCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICAgIHRoaXMubW92ZSA9IG5ldyBNb3ZlKHsgZ28sIGVudGl0eSwgdGFyZ2V0X3Bvc2l0aW9uOiB0aGlzLmdvLmNoYXJhY3RlciB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmIChWZWN0b3IyLmRpc3RhbmNlKHRoaXMuZ28uY2hhcmFjdGVyLCBlbnRpdHkpIDwgdGhpcy5yYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZS5hY3QoKTtcbiAgICAgICAgfVxuICAgIH1cbn0gIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gICAgY29uc3RydWN0b3IoeyBnbywgZW50aXR5LCBzcGVlZCA9IDEsIHRhcmdldF9wb3NpdGlvbiB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgdGhpcy50YXJnZXRfcG9zaXRpb24gPSB0YXJnZXRfcG9zaXRpb25cblxuICAgICAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRfc3RlcCA9IHtcbiAgICAgICAgICAgICAgICB4OiB0aGlzLmVudGl0eS54ICsgdGhpcy5zcGVlZCAqIE1hdGguY29zKFZlY3RvcjIuYW5nbGUodGhpcy5lbnRpdHksIHRoaXMudGFyZ2V0X3Bvc2l0aW9uKSksXG4gICAgICAgICAgICAgICAgeTogdGhpcy5lbnRpdHkueSArIHRoaXMuc3BlZWQgKiBNYXRoLnNpbihWZWN0b3IyLmFuZ2xlKHRoaXMuZW50aXR5LCB0aGlzLnRhcmdldF9wb3NpdGlvbikpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbnRpdHkueCA9IG5leHRfc3RlcC54XG4gICAgICAgICAgICB0aGlzLmVudGl0eS55ID0gbmV4dF9zdGVwLnlcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhdHMoeyBnbywgZW50aXR5LCBocCA9IDEwMCwgY3VycmVudF9ocCwgbWFuYSwgY3VycmVudF9tYW5hIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuaHAgPSBocCB8fCAxMDBcbiAgICB0aGlzLmN1cnJlbnRfaHAgPSBjdXJyZW50X2hwIHx8IGhwXG4gICAgdGhpcy5tYW5hID0gbWFuYVxuICAgIHRoaXMuY3VycmVudF9tYW5hID0gY3VycmVudF9tYW5hIHx8IG1hbmFcblxuICAgIHRoaXMuaGFzX21hbmEgPSAoKSA9PiB0aGlzLm1hbmEgPT09IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzX2RlYWQgPSAoKSA9PiB0aGlzLmN1cnJlbnRfaHAgPD0gMDtcbiAgICB0aGlzLmlzX2FsaXZlID0gKCkgPT4gIXRoaXMuaXNfZGVhZCgpO1xuICAgIHRoaXMudGFrZV9kYW1hZ2UgPSAoeyBkYW1hZ2UgfSkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRfaHAgLT0gZGFtYWdlO1xuICAgICAgICBpZiAodGhpcy5pc19kZWFkKCkpIHRoaXMuZGllKClcbiAgICB9XG4gICAgdGhpcy5kaWUgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jcmVlcHMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY3JlZXBzXCIpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jbGlja2FibGVzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNsaWNrYWJsZXNcIilcbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB0aGlzLmVudGl0eSkgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsO1xuICAgIH1cbn0iLCJmdW5jdGlvbiBDYW1lcmEoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2FtZXJhID0gdGhpc1xuICB0aGlzLnggPSAwXG4gIHRoaXMueSA9IDBcbiAgdGhpcy5jYW1lcmFfc3BlZWQgPSAzXG5cbiAgdGhpcy5tb3ZlX2NhbWVyYV93aXRoX21vdXNlID0gKGV2KSA9PiB7XG4gICAgLy9pZiAodGhpcy5nby5lZGl0b3IucGFpbnRfbW9kZSkgcmV0dXJuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpIDwgMTAwKSB7XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCB5ICsgdGhlIG1vdmVtZW50IHdlJ2xsIG1ha2UgZnVydGhlciB0aGVyZSBpcyBncmVhdGVyIHRoYW5cbiAgICAgIC8vIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIHNjcmVlbiBtaW51cyB0aGUgaGVpZ2h0IHRoYXQgd2lsbCBhbHJlYWR5IGJlIHZpc2libGVcbiAgICAgIC8vICh0aGUgY2FudmFzIGhlaWdodCksIGRvbid0IGdvIGZ1cnRoZXIgb3duXG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgdG9wIG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpID4gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSAxMDApIHtcbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPCAxMDApIHtcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpID4gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIDEwMCkge1xuICAgICAgLy8gRG9uJ3QgZ28gZnVydGhlciBsZWZ0XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG4gIH1cblxuICB0aGlzLmZvY3VzID0gKHBvaW50KSA9PiB7XG4gICAgbGV0IHggPSBwb2ludC54IC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgICBsZXQgeSA9IHBvaW50LnkgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgICAvLyBzcGVjaWZpYyBtYXAgY3V0cyAoaXQgaGFzIGEgbWFwIG9mZnNldCBvZiA2MCwxNjApXG4gICAgaWYgKHkgPCAwKSB7IHkgPSAwIH1cbiAgICBpZiAoeCA8IDApIHsgeCA9IDAgfVxuICAgIGlmICh4ICsgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCA+IHRoaXMuZ28ud29ybGQud2lkdGgpIHsgeCA9IHRoaXMueCB9XG4gICAgaWYgKHkgKyB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCA+IHRoaXMuZ28ud29ybGQuaGVpZ2h0KSB7IHkgPSB0aGlzLnkgfVxuICAgIC8vIG9mZnNldCBjaGFuZ2VzIGVuZFxuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gIH1cblxuICB0aGlzLmdsb2JhbF9jb29yZHMgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9iaixcbiAgICAgIHg6IG9iai54IC0gdGhpcy54LFxuICAgICAgeTogb2JqLnkgLSB0aGlzLnlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FtZXJhXG4iLCJmdW5jdGlvbiBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmR1cmF0aW9uID0gbnVsbFxuICAgIHRoaXMud2lkdGggPSBnby5jaGFyYWN0ZXIud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IDVcbiAgICB0aGlzLmNvbG91ciA9IFwicHVycGxlXCJcbiAgICB0aGlzLmZ1bGwgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50ID0gMFxuICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IG51bGxcbiAgICB0aGlzLmxhc3RfdGltZSA9IG51bGxcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbFxuICAgIC8vIFN0YXlzIHN0YXRpYyBpbiBhIHBvc2l0aW9uIGluIHRoZSBtYXBcbiAgICAvLyBNZWFuaW5nOiBkb2Vzbid0IG1vdmUgd2l0aCB0aGUgY2FtZXJhXG4gICAgdGhpcy5zdGF0aWMgPSBmYWxzZVxuICAgIHRoaXMueF9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS54IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuICAgIHRoaXMueV9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS55IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydCA9IChkdXJhdGlvbiwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgdGhpcy5zdGFydGluZ190aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMFxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb25cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKGZ1bGwgPSB0aGlzLmZ1bGwsIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJkcmF3aW5nIGNhc3RpbmcgYmFyXCIpXG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5kdXJhdGlvbiA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBlbGFwc2VkX3RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpbWU7XG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gZWxhcHNlZF90aW1lO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50IDw9IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMuZW50aXR5LnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICB0aGlzLnkgPSB0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0ICsgMTAgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsZXQgYmFyX3dpZHRoID0gKCh0aGlzLmN1cnJlbnQgLyB0aGlzLmR1cmF0aW9uKSAqIHRoaXMud2lkdGgpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2sgIT09IG51bGwpIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FzdGluZ0JhclxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcbmltcG9ydCBJbnZlbnRvcnkgZnJvbSBcIi4vaW52ZW50b3J5XCJcbmltcG9ydCBGcm9zdGJvbHQgZnJvbSBcIi4vc3BlbGxzL2Zyb3N0Ym9sdC5qc1wiXG5pbXBvcnQgU3RhdHMgZnJvbSBcIi4vYmVoYXZpb3JzL3N0YXRzLmpzXCJcbmltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuL2Nhc3RpbmdfYmFyLmpzXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmZ1bmN0aW9uIENoYXJhY3RlcihnbywgaWQpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2hhcmFjdGVyID0gdGhpc1xuICB0aGlzLmVkaXRvciA9IGdvLmVkaXRvclxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJjcmlzaXNjb3JlcGVlcHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pZCA9IGlkXG4gIHRoaXMueCA9IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gIHRoaXMueSA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBcImRvd25cIlxuICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAwXG4gIHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSgpO1xuICB0aGlzLnNwZWxscyA9IHtcbiAgICBmcm9zdGJvbHQ6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogbmV3IEZyb3N0Ym9sdCh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuY2FzdFxuICB9XG4gIHRoaXMuc3RhdHMgPSBuZXcgU3RhdHMoeyBnbywgZW50aXR5OiB0aGlzIH0pO1xuXG4gIGZ1bmN0aW9uIFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHksIHNwZWxsIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuc3BlbGwgPSBzcGVsbFxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IGVudGl0eSB9KVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzKVxuICAgICAgY29uc29sZS5sb2coXCJTZWxsY2FzdGluZyNlbmRcIilcbiAgICAgIHRoaXMuc3BlbGwuYWN0KClcbiAgICB9XG5cbiAgICB0aGlzLmNhc3QgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIlNwZWxsY2FzdGluZyNjYXN0XCIpXG4gICAgICB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cy5wdXNoKHRoaXMpXG4gICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDE1MDAsIHRoaXMuZW5kKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHlfb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMubWFuYV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMTAsIGNvbG91cjogXCJibHVlXCIgfSlcblxuICB0aGlzLm1vdmVtZW50X2JvYXJkID0gW11cblxuICB0aGlzLm1vdmVfdG9fd2F5cG9pbnQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmNvb3Jkcyhub2RlKVxuICB9XG5cbiAgdGhpcy5jb29yZHMgPSBmdW5jdGlvbiAoY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLnRhcmdldF9tb3ZlbWVudCkgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCgpXG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIE1hdGguZmxvb3IodGhpcy53YWxrX2N5Y2xlX2luZGV4KSAqIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUoKSAqIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5zdGF0cy5ocCwgdGhpcy5zdGF0cy5jdXJyZW50X2hwKVxuICAgIHRoaXMubWFuYV9iYXIuZHJhdyh0aGlzLnN0YXRzLm1hbmEsIHRoaXMuc3RhdHMuY3VycmVudF9tYW5hKVxuICB9XG5cbiAgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgcmV0dXJuIDJcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgcmV0dXJuIDNcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICByZXR1cm4gMVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHJldHVybiAwXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0X21vdmVtZW50ID0gdGhpcy50YXJnZXRfbW92ZW1lbnQpIHtcbiAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgIHRoaXMuZ28uY3R4LmFyYygodGFyZ2V0X21vdmVtZW50LnggLSB0aGlzLmdvLmNhbWVyYS54KSArIDEwLCAodGFyZ2V0X21vdmVtZW50LnkgLSB0aGlzLmdvLmNhbWVyYS55KSArIDEwLCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vIEFVVE8tTU9WRSAocGF0aGZpbmRlcikgLS0gcmVuYW1lIGl0IHRvIG1vdmUgd2hlbiB1c2luZyBwbGF5Z3JvdW5kXG4gIHRoaXMuYXV0b19tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmVtZW50X2JvYXJkLmxlbmd0aCA9PT0gMCkgeyB0aGlzLm1vdmVtZW50X2JvYXJkID0gW10uY29uY2F0KHRoaXMuZ28uYm9hcmQuZ3JpZCkgfVxuICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmdvLmJvYXJkLnRhcmdldF9ub2RlKVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG5cbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIGlmICh0aGlzLnggKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC53aWR0aCkge1xuICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgaWYgKHRoaXMueSAtIHRoaXMuc3BlZWQgPiAwKSB7XG4gICAgICAgICAgdGhpcy55IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIGlmICh0aGlzLnggLSB0aGlzLnNwZWVkID4gMCkge1xuICAgICAgICAgIHRoaXMueCAtPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQuaGVpZ2h0KSB7XG4gICAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gKHRoaXMud2Fsa19jeWNsZV9pbmRleCArICgwLjAzICogdGhpcy5zcGVlZCkpICUgM1xuICAgIHRoaXMuZ28uY2FtZXJhLmZvY3VzKHRoaXMpXG4gIH1cblxuXG4gIEFycmF5LnByb3RvdHlwZS5sYXN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIH1cbiAgQXJyYXkucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1swXSB9XG5cbiAgLy8gU3RvcmVzIHRoZSB0ZW1wb3JhcnkgdGFyZ2V0IG9mIHRoZSBtb3ZlbWVudCBiZWluZyBleGVjdXRlZFxuICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IG51bGxcbiAgLy8gU3RvcmVzIHRoZSBwYXRoIGJlaW5nIGNhbGN1bGF0ZWRcbiAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICB0aGlzLnNwZWVkID0gM1xuXG4gIHRoaXMuZmluZF9wYXRoID0gKHRhcmdldF9tb3ZlbWVudCkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG5cbiAgICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IHRhcmdldF9tb3ZlbWVudFxuXG4gICAgaWYgKHRoaXMuY3VycmVudF9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgeDogdGhpcy54ICsgdGhpcy5zcGVlZCwgeTogdGhpcy55ICsgdGhpcy5zcGVlZCB9KVxuICAgIH1cblxuICAgIHZhciBsYXN0X3N0ZXAgPSB7fVxuICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7fVxuXG4gICAgZG8ge1xuICAgICAgbGFzdF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGhbdGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoIC0gMV1cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudCA9IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgICAvLyBUaGlzIGNvZGUgd2lsbCBrZWVwIHRyeWluZyB0byBnbyBiYWNrIHRvIHRoZSBzYW1lIHByZXZpb3VzIGZyb20gd2hpY2ggd2UganVzdCBicmFuY2hlZCBvdXRcbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuXG4gICAgICAvLyBUaGlzIGlzIHByZXR0eSBoZWF2eS4uLiBJdCdzIGNhbGN1bGF0aW5nIGFnYWluc3QgYWxsIHRoZSBiaXRzIGluIHRoZSBtYXAgPVtcbiAgICAgIHZhciBnb2luZ190b19jb2xsaWRlID0gdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSlcbiAgICAgIGlmIChnb2luZ190b19jb2xsaWRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb2xsaXNpb24gYWhlYWQhJylcbiAgICAgICAgdmFyIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueCA9IG5leHRfbW92ZW1lbnQueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBvbiBZXCIpXG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC55ID0gbmV4dF9tb3ZlbWVudC55IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIFhcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9KVxuICAgIH0gd2hpbGUgKChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkgfHwgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSlcblxuICAgIHRoaXMubW92aW5nID0gdHJ1ZVxuICB9XG5cbiAgdGhpcy5tb3ZlX29uX3BhdGggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB2YXIgbmV4dF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGguc2hpZnQoKVxuICAgICAgaWYgKG5leHRfc3RlcCkge1xuICAgICAgICB0aGlzLnggPSBuZXh0X3N0ZXAueFxuICAgICAgICB0aGlzLnkgPSBuZXh0X3N0ZXAueVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy90aGlzLm1vdmUgPSBmdW5jdGlvbih0YXJnZXRfbW92ZW1lbnQpIHtcbiAgLy8gIGlmICh0aGlzLm1vdmluZykge1xuICAvLyAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9XG5cbiAgLy8gICAgaWYgKChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA8PSAxKSAmJiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPD0gMSkpIHtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAvLyAgICAgIHRhcmdldF9tb3ZlbWVudCA9IHt9XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJTdG9wcGVkXCIpO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQodGFyZ2V0X21vdmVtZW50KVxuXG4gIC8vICAgICAgLy8gUGF0aGluZ1xuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICB9XG5cbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LndpZHRoID0gdGhpcy53aWR0aFxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcblxuICAvLyAgICBpZiAoKHRoaXMuZ28uZW50aXRpZXMuZXZlcnkoKGVudGl0eSkgPT4gZW50aXR5LmlkID09PSB0aGlzLmlkIHx8ICFpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBlbnRpdHkpICkpICYmXG4gIC8vICAgICAgKCF0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKSkpIHtcbiAgLy8gICAgICB0aGlzLnggPSBmdXR1cmVfbW92ZW1lbnQueFxuICAvLyAgICAgIHRoaXMueSA9IGZ1dHVyZV9tb3ZlbWVudC55XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJCbG9ja2VkXCIpO1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgLy8gICAgfVxuICAvLyAgfVxuICAvLyAgLy8gRU5EIC0gQ2hhcmFjdGVyIE1vdmVtZW50XG4gIC8vfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENsaWNrYWJsZShnbywgeCwgeSwgd2lkdGgsIGhlaWdodCwgaW1hZ2Vfc3JjKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaCh0aGlzKVxuXG4gIHRoaXMubmFtZSA9IGltYWdlX3NyY1xuICB0aGlzLnggPSB4XG4gIHRoaXMueSA9IHlcbiAgdGhpcy53aWR0aCA9IHdpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICB0aGlzLmFjdGl2YXRlZCA9IGZhbHNlXG4gIHRoaXMucGFkZGluZyA9IDVcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0LCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgaWYgKHRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiI2ZmZlwiXG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCAtIHRoaXMucGFkZGluZywgdGhpcy55IC0gdGhpcy5wYWRkaW5nLCB0aGlzLndpZHRoICsgKDIqdGhpcy5wYWRkaW5nKSwgdGhpcy5oZWlnaHQgKyAoMip0aGlzLnBhZGRpbmcpKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbGlja1wiKVxuICB9XG59XG4iLCJpbXBvcnQgQ2xpY2thYmxlIGZyb20gXCIuL2NsaWNrYWJsZS5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnRyb2xzKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNvbnRyb2xzID0gdGhpc1xuICB0aGlzLndpZHRoID0gc2NyZWVuLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gc2NyZWVuLmhlaWdodCAqIDAuNFxuICB0aGlzLmFycm93cyA9IHtcbiAgICB1cDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEwLCA4MCwgODAsIFwiYXJyb3dfdXAucG5nXCIpLFxuICAgIGxlZnQ6IG5ldyBDbGlja2FibGUoZ28sIDUwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfbGVmdC5wbmdcIiksXG4gICAgcmlnaHQ6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgKyA3MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X3JpZ2h0LnBuZ1wiKSxcbiAgICBkb3duOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTIwLCA4MCwgODAsIFwiYXJyb3dfZG93bi5wbmdcIiksXG4gIH1cbiAgdGhpcy5hcnJvd3MudXAuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXG4gIHRoaXMuYXJyb3dzLmRvd24uY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImRvd25cIilcbiAgdGhpcy5hcnJvd3MubGVmdC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKVxuICB0aGlzLmFycm93cy5yaWdodC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIilcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMilcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFycm93cykuZm9yRWFjaChhcnJvdyA9PiBhcnJvdy5kcmF3KCkpXG4gIH1cbn1cbiIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5pbXBvcnQgQWdncm8gZnJvbSBcIi4vYmVoYXZpb3JzL2FnZ3JvLmpzXCJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuXG5mdW5jdGlvbiBDcmVlcChnbykge1xuICBpZiAoZ28uY3JlZXBzID09PSB1bmRlZmluZWQpIGdvLmNyZWVwcyA9IFtdXG4gIHRoaXMuaWQgPSBnby5jcmVlcHMubGVuZ3RoXG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNyZWVwcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJ6ZXJnbGluZy5wbmdcIiAvLyBwbGFjZWhvbGRlciBpbWFnZVxuICB0aGlzLmltYWdlX3dpZHRoID0gMTUwXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTUwXG4gIHRoaXMueCA9IDcwMFxuICB0aGlzLnkgPSAzMDBcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogNFxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogNFxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gbnVsbFxuICB0aGlzLnNwZWVkID0gMlxuICAvL3RoaXMubW92ZW1lbnRfYm9hcmQgPSB0aGlzLmdvLmJvYXJkLmdyaWRcbiAgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCA9IG51bGxcbiAgdGhpcy5oZWFsdGhfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgd2lkdGg6IDEwMCwgaGVpZ2h0OiAxMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMuc3RhdHMgPSBuZXcgU3RhdHMoeyBnbywgZW50aXR5OiB0aGlzLCBocDogMjAgfSk7XG4gIC8vIEJlaGF2aW91cnNcbiAgdGhpcy5hZ2dybyA9IG5ldyBBZ2dybyh7IGdvLCBlbnRpdHk6IHRoaXMsIHJhZGl1czogNTAwIH0pO1xuICAvLyBFTkQgLSBCZWhhdmlvdXJzXG5cbiAgdGhpcy5jb29yZHMgPSBmdW5jdGlvbihjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFnZ3JvLmFjdCgpO1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gZ28uY2FtZXJhLngsIHRoaXMueSAtIGdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gIH1cblxuICB0aGlzLnNldF9tb3ZlbWVudF90YXJnZXQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbm9kZVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KSB7XG4gICAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JlZXBcbiIsImZ1bmN0aW9uIERvb2RhZCh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgdGhpcy54ID0gMDtcbiAgdGhpcy55ID0gMDtcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSA5OFxuICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMTI3XG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTI2XG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAyOTBcbiAgdGhpcy53aWR0aCA9IDk4XG4gIHRoaXMuaGVpZ2h0ID0gMTI2XG4gIHRoaXMucmVzb3VyY2VfYmFyID0gbnVsbFxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLmltYWdlX3hfb2Zmc2V0LCB0aGlzLmltYWdlX3lfb2Zmc2V0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgaWYgKHRoaXMucmVzb3VyY2VfYmFyKSB7XG4gICAgICB0aGlzLnJlc291cmNlX2Jhci5kcmF3KClcbiAgICB9XG4gIH1cblxuICB0aGlzLmNsaWNrID0gZnVuY3Rpb24oKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEb29kYWQ7XG4iLCIvLyBUaGUgY2FsbGJhY2tzIHN5c3RlbVxuLy8gXG4vLyBUbyB1c2UgaXQ6XG4vL1xuLy8gKiBpbXBvcnQgdGhlIGNhbGxiYWNrcyB5b3Ugd2FudFxuLy9cbi8vICAgIGltcG9ydCB7IHNldE1vdXNlbW92ZUNhbGxiYWNrIH0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG4vL1xuLy8gKiBjYWxsIHRoZW0gYW5kIHN0b3JlIHRoZSBhcnJheSBvZiBjYWxsYmFjayBmdW5jdGlvbnNcbi8vXG4vLyAgICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pO1xuLy9cbi8vICogYWRkIG9yIHJlbW92ZSBjYWxsYmFja3MgZnJvbSBhcnJheVxuLy9cbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaChnby5jYW1lcmEubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSlcbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcblxuZnVuY3Rpb24gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IG9uX21vdXNlbW92ZSA9IChldikgPT4ge1xuICAgIG1vdXNlbW92ZV9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25fbW91c2Vtb3ZlLCBmYWxzZSlcbiAgcmV0dXJuIG1vdXNlbW92ZV9jYWxsYmFja3M7XG59XG5cblxuZnVuY3Rpb24gc2V0Q2xpY2tDYWxsYmFjayhnbykge1xuICBjb25zdCBjbGlja19jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9jbGljayAgPSAoZXYpID0+IHtcbiAgICBjbGlja19jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fY2xpY2ssIGZhbHNlKVxuICByZXR1cm4gY2xpY2tfY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRDYWxsYmFjayhnbywgZXZlbnQpIHtcbiAgY29uc3QgY2FsbGJhY2tzID0gW11cbiAgY29uc3QgaGFuZGxlciA9IChlKSA9PiB7XG4gICAgY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhlKVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKVxuICByZXR1cm4gY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZW1vdmUnKTtcbn1cblxuZnVuY3Rpb24gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vkb3duJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNldXBDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZXVwJyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICd0b3VjaHN0YXJ0Jyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hlbmQnKTtcbn1cblxuZXhwb3J0IHtcbiAgc2V0TW91c2Vtb3ZlQ2FsbGJhY2ssXG4gIHNldENsaWNrQ2FsbGJhY2ssXG4gIHNldE1vdXNlTW92ZUNhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2ssXG4gIHNldFRvdWNoZW5kQ2FsbGJhY2ssXG59O1xuIiwiLy8gVGhlIEdhbWUgTG9vcFxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG4vLyBnYW1lX2xvb3AuZHJhdyA9IGRyYXdcbi8vIGdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IHByb2Nlc3Nfa2V5c19kb3duXG4vLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG5cbmZ1bmN0aW9uIEdhbWVMb29wKCkge1xuICB0aGlzLmRyYXcgPSBudWxsXG4gIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24gPSBudWxsXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge31cbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24oKVxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgdGhpcy5kcmF3KClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUxvb3BcbiIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4nKVxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcblxuZnVuY3Rpb24gR2FtZU9iamVjdCgpIHtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXNcbiAgdGhpcy5jYW52YXNfcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5jYW52YXNfcmVjdC53aWR0aCk7XG4gIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5jYW52YXNfcmVjdC5oZWlnaHQpO1xuICB0aGlzLmN0eCA9IGN0eFxuICB0aGlzLnRpbGVfc2l6ZSA9IDIwXG4gIHRoaXMuY2xpY2thYmxlcyA9IFtdXG4gIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB0aGlzLnNwZWxscyA9IFtdIC8vIFNwZWxsIHN5c3RlbSwgY291bGQgYmUgaW5qZWN0ZWQgYnkgaXQgYXMgd2VsbFxuICB0aGlzLm1hbmFnZWRfb2JqZWN0cyA9IFtdIC8vIFJhbmRvbSBvYmplY3RzIHRvIGRyYXcvdXBkYXRlXG4gIHRoaXMuZHJhd19zZWxlY3RlZF9jbGlja2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgICB0aGlzLmN0eC5zYXZlKClcbiAgICAgIHRoaXMuY3R4LnNoYWRvd0JsdXIgPSAxMDtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICB0aGlzLmN0eC5zaGFkb3dDb2xvciA9IFwieWVsbG93XCJcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAwLCAwLjcpXCJcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnggLSB0aGlzLmNhbWVyYS54IC0gNSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueSAtIHRoaXMuY2FtZXJhLnkgLSA1LFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS53aWR0aCArIDEwLFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS5oZWlnaHQgKyAodGhpcy5zZWxlY3RlZF9jbGlja2FibGUucmVzb3VyY2VfYmFyID8gMjAgOiAxMCkpO1xuICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52ZW50b3J5KCkge1xuICB0aGlzLm1heF9zbG90cyA9IDEwXG4gIHRoaXMuc2xvdHMgPSBbXVxuICB0aGlzLmFkZCA9IChpdGVtKSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmdfYnVuZGxlID0gdGhpcy5zbG90cy5maW5kKChidW5kbGUpID0+IHtcbiAgICAgIHJldHVybiBidW5kbGUubmFtZSA9PSBpdGVtLm5hbWVcbiAgICB9KVxuXG4gICAgaWYgKCh0aGlzLnNsb3RzLmxlbmd0aCA+PSB0aGlzLm1heF9zbG90cykgJiYgKCFleGlzdGluZ19idW5kbGUpKSByZXR1cm5cblxuICAgIGNvbnNvbGUubG9nKGAqKiogR290ICR7aXRlbS5xdWFudGl0eX0gJHtpdGVtLm5hbWV9YClcbiAgICBpZiAoZXhpc3RpbmdfYnVuZGxlKSB7XG4gICAgICBleGlzdGluZ19idW5kbGUucXVhbnRpdHkgKz0gaXRlbS5xdWFudGl0eVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNsb3RzLnB1c2goaXRlbSlcbiAgICB9XG4gIH1cbiAgdGhpcy5maW5kID0gKGl0ZW1fbmFtZSkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gaXRlbV9uYW1lLnRvTG93ZXJDYXNlKClcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjgpXCI7XG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMjAsIDIwLCAyMDAsIDIwMCk7XG5cbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYig2MCwgNDAsIDApXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgyNSwgMjUsIDUwLCA1MClcblxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsIDAsIDApXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgzMCwgMzAsIDQwLCA0MClcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXRlbShuYW1lLCBpbWFnZSwgcXVhbnRpdHkgPSAxLCBzcmNfaW1hZ2UpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICBpZiAoaW1hZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gc3JjX2ltYWdlXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlXG4gIH1cbiAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG59XG4iLCJmdW5jdGlvbiBLZXlib2FyZElucHV0KGdvKSB7XG4gIGNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbiAgICAvLyBUaGVzZSBhcmUgY2FsbGJhY2tzIHRoYXQgb25seSBnZXQgY2hlY2tlZCBvbmNlIG9uIHRoZSBldmVudFxuICAgIGlmICh0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID0gW11cbiAgICB9XG4gICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhldikpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uX2tleWRvd24sIGZhbHNlKVxuICBjb25zdCBvbl9rZXl1cCA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2VcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uX2tleXVwLCBmYWxzZSlcblxuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ua2V5Ym9hcmRfaW5wdXQgPSB0aGlzXG4gIHRoaXMua2V5X2NhbGxiYWNrcyA9IHtcbiAgICBkOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXSxcbiAgICB3OiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXSxcbiAgICBhOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIildLFxuICAgIHM6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKV0sXG4gIH1cbiAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrcyA9IHtcbiAgICAxOiBbXVxuICB9XG5cbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgICBjb25zdCBrZXlzX2Rvd24gPSBPYmplY3Qua2V5cyh0aGlzLmtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAgICBrZXlzX2Rvd24uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoIShPYmplY3Qua2V5cyh0aGlzLmtleV9jYWxsYmFja3MpLmluY2x1ZGVzKGtleSkpKSByZXR1cm5cblxuICAgICAgdGhpcy5rZXlfY2FsbGJhY2tzW2tleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMua2V5bWFwID0ge1xuICAgIGQ6IFwicmlnaHRcIixcbiAgICB3OiBcInVwXCIsXG4gICAgYTogXCJsZWZ0XCIsXG4gICAgczogXCJkb3duXCIsXG4gIH1cblxuICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd24gPSB7XG4gICAgZDogZmFsc2UsXG4gICAgdzogZmFsc2UsXG4gICAgYTogZmFsc2UsXG4gICAgczogZmFsc2UsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2V5Ym9hcmRJbnB1dDtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3Qge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW0sIHF1YW50aXR5ID0gMSkge1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlXCJcblxuY2xhc3MgTG9vdEJveCB7XG4gICAgY29uc3RydWN0b3IoZ28pIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICB0aGlzLnggPSAwXG4gICAgICAgIHRoaXMueSA9IDBcbiAgICAgICAgdGhpcy53aWR0aCA9IDM1MFxuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBtb3ZlcyBhd2F5LCBkZWxldGUgaXRlbXMgYW5kIGhpZGUgbG9vdCBib3ggc2NyZWVuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIChWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIHRoaXMuZ28uY2hhcmFjdGVyKSA+IDUwMCkgfHxcbiAgICAgICAgICAgICh0aGlzLml0ZW1zLmxlbmd0aCA8PSAwKVxuICAgICAgICApIHtcblxuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KVwiO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lSm9pbiA9ICdiZXZlbCc7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgKyAyMCAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaXRlbXMubGVuZ3RoICogNjAgKyA1KTtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjAwLCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgKyAyMCAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaXRlbXMubGVuZ3RoICogNjAgKyA1KTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBsb290ID0gdGhpcy5pdGVtc1tpbmRleF1cbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsIDAsIDApXCJcbiAgICAgICAgICAgIGxvb3QueCA9IHRoaXMueCArIDI1IC0gdGhpcy5nby5jYW1lcmEueFxuICAgICAgICAgICAgbG9vdC55ID0gdGhpcy55ICsgKGluZGV4ICogNjApICsgMjUgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsb290LndpZHRoID0gMzQwXG4gICAgICAgICAgICBsb290LmhlaWdodCA9IDU1XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdChsb290LngsIGxvb3QueSwgbG9vdC53aWR0aCwgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UobG9vdC5pdGVtLmltYWdlLCBsb290LnggKyA1LCBsb290LnkgKyA1LCA0NSwgNDUpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gJzIycHggc2VyaWYnXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChsb290LnF1YW50aXR5LCBsb290LnggKyA2NSwgbG9vdC55ICsgMzUpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChsb290Lml0ZW0ubmFtZSwgbG9vdC54ICsgMTAwLCBsb290LnkgKyAzNSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSB0cnVlXG4gICAgICB0aGlzLnggPSB0aGlzLmdvLmNoYXJhY3Rlci54XG4gICAgICB0aGlzLnkgPSB0aGlzLmdvLmNoYXJhY3Rlci55XG4gICAgfVxuXG4gICAgdGFrZV9sb290KGxvb3RfaW5kZXgpIHtcbiAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zLnNwbGljZShsb290X2luZGV4LCAxKVswXVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5pbnZlbnRvcnkuYWRkKGxvb3QuaXRlbSlcbiAgICB9XG5cbiAgICBjaGVja19pdGVtX2NsaWNrZWQoZXYpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVyblxuXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChsb290KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChldi5jbGllbnRYID49IGxvb3QueCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA8PSBsb290LnggKyBsb290LndpZHRoKSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRZID49IGxvb3QueSkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA8PSBsb290LnkgKyBsb290LmhlaWdodClcbiAgICAgICAgICAgIClcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy50YWtlX2xvb3QoaW5kZXgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvb3RCb3giLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJ0aWNsZShnbykge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoeyB4LCB5IH0pIHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5hcmMoeCAtIHRoaXMuZ28uY2FtZXJhLngsIHkgLSB0aGlzLmdvLmNhbWVyYS55LCAxNSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsKCk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gJ2xpZ2h0Ymx1ZSc7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpO1xuICAgIH1cbn0iLCJpbXBvcnQgUGFydGljbGUgZnJvbSBcIi4vcGFydGljbGUuanNcIlxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3QgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLnBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKGdvKTtcbiAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gICAgdGhpcy5lbmRfcG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcbiAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0XG4gICAgdGhpcy5ib3VuZHMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuY3VycmVudF9wb3NpdGlvbiwgd2lkdGg6IDUsIGhlaWdodDogNSB9XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKFZlY3RvcjIuZGlzdGFuY2UodGhpcy5lbmRfcG9zaXRpb24sIHRoaXMuY3VycmVudF9wb3NpdGlvbikgPCA1KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJodWhcIilcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdC5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlX3Bvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMucGFydGljbGUuZHJhdyh0aGlzLmN1cnJlbnRfcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuY2FsY3VsYXRlX3Bvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBhbmdsZSA9IFZlY3RvcjIuYW5nbGUodGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB0aGlzLmVuZF9wb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuY3VycmVudF9wb3NpdGlvbi54ICsgNSAqIE1hdGguY29zKGFuZ2xlKSxcbiAgICAgICAgICAgIHk6IHRoaXMuY3VycmVudF9wb3NpdGlvbi55ICsgNSAqIE1hdGguc2luKGFuZ2xlKVxuICAgICAgICB9XG4gICAgfVxufSIsImZ1bmN0aW9uIFJlc291cmNlQmFyKHsgZ28sIHRhcmdldCwgeV9vZmZzZXQgPSAxMCwgY29sb3VyID0gXCJyZWRcIiB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLnRhcmdldCA9IHRhcmdldFxuICB0aGlzLmhlaWdodCA9IHRoaXMudGFyZ2V0LndpZHRoIC8gMTA7XG4gIHRoaXMuY29sb3VyID0gY29sb3VyXG4gIHRoaXMuZnVsbCA9IDEwMFxuICB0aGlzLmN1cnJlbnQgPSAxMDBcbiAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gIHRoaXMueCA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQueDtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoKE1hdGgubWluKGN1cnJlbnQsIGZ1bGwpKSAvIGZ1bGwpICogdGhpcy50YXJnZXQud2lkdGgpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngoKSAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMudGFyZ2V0LnktIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCkgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnRhcmdldC55LSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCkgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnRhcmdldC55LSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy55X29mZnNldCwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUJhclxuIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMud2lkdGggID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodDtcblxuICB0aGlzLmNsZWFyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmNhbnZhcy53aWR0aCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5nby5jYW52YXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nby5jYW52YXNfcmVjdCA9IHRoaXMuZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5jbGVhcigpXG4gICAgdGhpcy5nby53b3JsZC5kcmF3KClcbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIHRoaXMuZHJhd19mb2cgPSAoKSA9PiB7XG4gICAgdmFyIHggPSB0aGlzLmdvLmNoYXJhY3Rlci54ICsgdGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyIC0gdGhpcy5nby5jYW1lcmEueFxuICAgIHZhciB5ID0gdGhpcy5nby5jaGFyYWN0ZXIueSArIHRoaXMuZ28uY2hhcmFjdGVyLmhlaWdodCAvIDIgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgdmFyIGdyYWRpZW50ID0gdGhpcy5nby5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgNzAwKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMCwgMCwgMCwgMCknKVxuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLCAwLCAwLCAxKScpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnRcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NyZWVuXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZXJ2ZXIoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgLy90aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6ODk5OVwiKVxuICB0aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9udWJhcmlhLmhlcm9rdWFwcC5jb206NTQwODJcIilcbiAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMubG9naW4odGhpcy5nby5jaGFyYWN0ZXIpXG4gIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBwYXlsb2FkID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJsb2dpblwiOlxuICAgICAgICBsZXQgbmV3X2NoYXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuICAgICAgICBuZXdfY2hhci5uYW1lID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lXG4gICAgICAgIG5ld19jaGFyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbiAgICAgICAgbmV3X2NoYXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICBjb25zb2xlLmxvZyhgQWRkaW5nIG5ldyBjaGFyYClcbiAgICAgICAgcGxheWVycy5wdXNoKG5ld19jaGFyKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcInBpbmdcIjpcbiAgICAgICAgLy9nby5jdHguZmlsbFJlY3QocGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54LCBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnksIDUwLCA1MClcbiAgICAgICAgLy9nby5jdHguc3Ryb2tlKClcbiAgICAgICAgLy9sZXQgcGxheWVyID0gcGxheWVyc1swXSAvL3BsYXllcnMuZmluZChwbGF5ZXIgPT4gcGxheWVyLm5hbWUgPT09IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIubmFtZSlcbiAgICAgICAgLy9pZiAocGxheWVyKSB7XG4gICAgICAgIC8vICBwbGF5ZXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICAvLyAgcGxheWVyLnkgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnlcbiAgICAgICAgLy99XG4gICAgICAgIC8vYnJlYWs7XG4gICAgfVxuICB9IC8vXG4gIHRoaXMubG9naW4gPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJsb2dpblwiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSxcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG5cbiAgdGhpcy5waW5nID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICBhY3Rpb246IFwicGluZ1wiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSwgXG4gICAgICAgICAgeDogY2hhcmFjdGVyLngsXG4gICAgICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgfVxufVxuIiwiaW1wb3J0IFByb2plY3RpbGUgZnJvbSBcIi4uL3Byb2plY3RpbGVcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGcm9zdGJvbHQoeyBnbyB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5wcm9qZWN0aWxlID0gbmV3IFByb2plY3RpbGUoeyBnbywgc3ViamVjdDogdGhpcyB9KVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmxvZyhcImRyYXdpbmcgRnJvc3Rib2x0XCIpXG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5kcmF3KCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiAoaXNfY29sbGlkaW5nKHRoaXMucHJvamVjdGlsZS5ib3VuZHMoKSwgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSkge1xuICAgICAgICAgICAgaWYgKGRhbWFnZWFibGUodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gcmFuZG9tKDUsIDEwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cy50YWtlX2RhbWFnZSh7IGRhbWFnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYXN0aW5nIEZyb3N0Ym9sdFwiKVxuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gbnVsbCkgfHwgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB1bmRlZmluZWQpKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLnN0YXJ0X3Bvc2l0aW9uID0geyB4OiB0aGlzLmdvLmNoYXJhY3Rlci54ICsgNTAsIHk6IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyA1MCB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5jdXJyZW50X3Bvc2l0aW9uID0geyB4OiB0aGlzLmdvLmNoYXJhY3Rlci54ICsgNTAsIHk6IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyA1MCB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5lbmRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueSArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2plY3RpbGUuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy5nby5zcGVsbHMucHVzaCh0aGlzKVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImVuZGluZyBmcm9zdGJvbHRcIilcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc3BlbGxzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYW1hZ2VhYmxlKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0LnN0YXRzICE9PSB1bmRlZmluZWQgJiYgb2JqZWN0LnN0YXRzLnRha2VfZGFtYWdlICE9PSB1bmRlZmluZWRcbiAgICB9XG59IiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSksXG4gIGFuZ2xlOiAoY3VycmVudF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiBNYXRoLmF0YW4yKGVuZF9wb3NpdGlvbi55IC0gY3VycmVudF9wb3NpdGlvbi55LCBlbmRfcG9zaXRpb24ueCAtIGN1cnJlbnRfcG9zaXRpb24ueClcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGlmIChcbiAgICAoc2VsZi54IDwgdGFyZ2V0LnggKyB0YXJnZXQud2lkdGgpICYmXG4gICAgKHNlbGYueCArIHNlbGYud2lkdGggPiB0YXJnZXQueCkgJiZcbiAgICAoc2VsZi55IDwgdGFyZ2V0LnkgKyB0YXJnZXQuaGVpZ2h0KSAmJlxuICAgIChzZWxmLnkgKyBzZWxmLmhlaWdodCA+IHRhcmdldC55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuY29uc3QgcmFuZG9tID0gKHN0YXJ0LCBlbmQpID0+IHtcbiAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydFxuICAgIHN0YXJ0ID0gMFxuICB9XG4gIHJldHVybiBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBlbmQpICsgc3RhcnQgIFxufVxuXG5mdW5jdGlvbiByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQob2JqZWN0LCBsaXN0KSB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKG9iamVjdCk7XG4gIGlmIChpbmRleCA+IC0xKSB7XG4gICAgcmV0dXJuIGxpc3Quc3BsaWNlKGluZGV4LCAxKVswXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9XG4iLCJjbGFzcyBUaWxlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZV9zcmMsIHhfb2Zmc2V0ID0gMCwgeV9vZmZzZXQgPSAwLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICAgICAgICB0aGlzLnhfb2Zmc2V0ID0geF9vZmZzZXRcbiAgICAgICAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGlsZSIsImltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGVcIlxuXG5mdW5jdGlvbiBXb3JsZChnbykge1xuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ud29ybGQgPSB0aGlzO1xuICB0aGlzLndpZHRoID0gMTAwMDA7XG4gIHRoaXMuaGVpZ2h0ID0gMTAwMDA7XG4gIHRoaXMudGlsZV9zZXQgPSB7XG4gICAgZ3Jhc3M6IG5ldyBUaWxlKFwiZ3Jhc3MucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgZGlydDogbmV3IFRpbGUoXCJkaXJ0Mi5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBzdG9uZTogbmV3IFRpbGUoXCJmbGludHN0b25lLnBuZ1wiLCAwLCAwLCA4NDAsIDg1OSksXG4gIH1cbiAgdGhpcy5waWNrX3JhbmRvbV90aWxlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRpbGVfc2V0LmdyYXNzXG4gIH1cbiAgdGhpcy50aWxlX3dpZHRoID0gNjRcbiAgdGhpcy50aWxlX2hlaWdodCA9IDY0XG4gIHRoaXMudGlsZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmModGhpcy53aWR0aCAvIHRoaXMudGlsZV93aWR0aCkgKyAxO1xuICB0aGlzLnRpbGVzX3Blcl9jb2x1bW4gPSBNYXRoLnRydW5jKHRoaXMuaGVpZ2h0IC8gdGhpcy50aWxlX2hlaWdodCkgKyAxO1xuICB0aGlzLnRpbGVzID0gbnVsbDtcbiAgdGhpcy5nZW5lcmF0ZV9tYXAgPSAoKSA9PiB7XG4gICAgdGhpcy50aWxlcyA9IG5ldyBBcnJheSh0aGlzLnRpbGVzX3Blcl9yb3cpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBpZiAodGhpcy50aWxlc1tyb3ddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10gPSBbdGhpcy5waWNrX3JhbmRvbV90aWxlKCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddLnB1c2godGhpcy5waWNrX3JhbmRvbV90aWxlKCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMudGlsZXNbcm93XVtjb2x1bW5dXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGVfc2V0LmdyYXNzKSB7XG4gICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMudGlsZV9zZXQuZ3Jhc3MuaW1hZ2UsXG4gICAgICAgICAgICB0aGlzLnRpbGVfc2V0LmdyYXNzLnhfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLnlfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLndpZHRoLCB0aGlzLnRpbGVfc2V0LmdyYXNzLmhlaWdodCxcbiAgICAgICAgICAgIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCwgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDY0KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aWxlLmltYWdlLFxuICAgICAgICAgIHRpbGUueF9vZmZzZXQsIHRpbGUueV9vZmZzZXQsIHRpbGUud2lkdGgsIHRpbGUuaGVpZ2h0LFxuICAgICAgICAgIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCwgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDY0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXb3JsZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEtleWJvYXJkSW5wdXQgZnJvbSBcIi4va2V5Ym9hcmRfaW5wdXQuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQge1xuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbmltcG9ydCBHYW1lTG9vcCBmcm9tIFwiLi9nYW1lX2xvb3AuanNcIlxuaW1wb3J0IFdvcmxkIGZyb20gXCIuL3dvcmxkLmpzXCJcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4vZG9vZGFkLmpzXCJcbmltcG9ydCBDb250cm9scyBmcm9tIFwiLi9jb250cm9scy5qc1wiXG5pbXBvcnQgSXRlbSBmcm9tIFwiLi9pdGVtXCJcbmltcG9ydCBTZXJ2ZXIgZnJvbSBcIi4vc2VydmVyXCJcbmltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGUuanNcIlxuaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4vbG9vdF9ib3guanNcIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vbG9vdC5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyLmpzXCJcbmltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuL2Nhc3RpbmdfYmFyLmpzXCJcbmltcG9ydCBDcmVlcCBmcm9tIFwiLi9jcmVlcC5qc1wiXG5pbXBvcnQgUHJvamVjdGlsZSBmcm9tIFwiLi9wcm9qZWN0aWxlLmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG5nby5zcGVsbHMgPSBbXTtcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGdvKVxuY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCB3b3JsZCA9IG5ldyBXb3JsZChnbylcbmNvbnN0IGNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGdvKVxuY2hhcmFjdGVyLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbylcbmNvbnN0IGxvb3RfYm94ID0gbmV3IExvb3RCb3goZ28pXG4vLyBjb25zdCBjb2xkID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHg6IDUsIHk6IDUsIHdpZHRoOiAyMDAsIGhlaWdodDogMjAgfSlcbmNvbnN0IGNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbyB9KVxuXG4vLyBDcmVlcFxuZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gIGxldCBjcmVlcCA9IG5ldyBDcmVlcChnbyk7XG4gIGNyZWVwLnggPSBNYXRoLnJhbmRvbSgpICogZ28ud29ybGQud2lkdGhcbiAgY3JlZXAueSA9IE1hdGgucmFuZG9tKCkgKiBnby53b3JsZC5oZWlnaHRcbiAgZ28uY2xpY2thYmxlcy5wdXNoKGNyZWVwKTtcbn1cbi8vIEVORCAtIENyZWVwXG5cbmNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IHNldENsaWNrQ2FsbGJhY2soZ28pXG5jbGlja19jYWxsYmFja3MucHVzaChjbGlja2FibGVfY2xpY2tlZClcbmZ1bmN0aW9uIGNsaWNrYWJsZV9jbGlja2VkKGV2KSB7XG4gIGxldCBjbGljayA9IHsgeDogZXYuY2xpZW50WCArIGdvLmNhbWVyYS54LCB5OiBldi5jbGllbnRZICsgZ28uY2FtZXJhLnksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICBjb25zdCBjbGlja2FibGUgPSBnby5jbGlja2FibGVzLmZpbmQoKGNsaWNrYWJsZSkgPT4gaXNfY29sbGlkaW5nKGNsaWNrYWJsZSwgY2xpY2spKVxuICBpZiAoY2xpY2thYmxlKSB7XG4gICAgY2xpY2thYmxlLmFjdGl2YXRlZCA9ICFjbGlja2FibGUuYWN0aXZhdGVkXG4gIH1cbiAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gY2xpY2thYmxlXG59XG5cbmxldCBtb3VzZV9pc19kb3duID0gZmFsc2VcbmxldCBtb3VzZV9wb3NpdGlvbiA9IHt9XG5jb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pXG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5mdW5jdGlvbiB0cmFja19tb3VzZV9wb3NpdGlvbihldnQpIHtcbiAgdmFyIHJlY3QgPSBnby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgbW91c2VfcG9zaXRpb24gPSB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQgKyBjYW1lcmEueCxcbiAgICB5OiBldnQuY2xpZW50WSAtIHJlY3QudG9wICsgY2FtZXJhLnlcbiAgfVxufVxuY29uc3QgbW91c2Vkb3duX2NhbGxiYWNrcyA9IHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKVxubW91c2Vkb3duX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5jb25zdCBtb3VzZXVwX2NhbGxiYWNrcyA9IHNldE1vdXNldXBDYWxsYmFjayhnbylcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKGxvb3RfYm94LmNoZWNrX2l0ZW1fY2xpY2tlZC5iaW5kKGxvb3RfYm94KSlcbmNvbnN0IHRvdWNoc3RhcnRfY2FsbGJhY2tzID0gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKVxudG91Y2hzdGFydF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSB0cnVlKVxuY29uc3QgdG91Y2hlbmRfY2FsbGJhY2tzID0gc2V0VG91Y2hlbmRDYWxsYmFjayhnbylcbnRvdWNoZW5kX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxuZnVuY3Rpb24gY29udHJvbHNfbW92ZW1lbnQoKSB7XG4gIC8vIGdvLmNsaWNrYWJsZXMuZm9yRWFjaCgoY2xpY2thYmxlKSA9PiB7XG4gIC8vICAgaWYgKGNsaWNrYWJsZS5hY3RpdmF0ZWQpIHtcbiAgLy8gICAgIGNsaWNrYWJsZS5jbGljaygpXG4gIC8vICAgfVxuICAvLyB9KVxufVxuXG5sZXQgY3VycmVudF9jb2xkX2xldmVsID0gMTAwXG5mdW5jdGlvbiB1cGRhdGVfY29sZF9sZXZlbCgpIHtcbiAgaWYgKGZpcmVzLmZpbmQoKGZpcmUpID0+IFZlY3RvcjIuZGlzdGFuY2UoZmlyZSwgY2hhcmFjdGVyKSA8PSAxNTApKSB7XG4gICAgaWYgKGN1cnJlbnRfY29sZF9sZXZlbCA8IDEwMCkge1xuICAgICAgaWYgKGN1cnJlbnRfY29sZF9sZXZlbCArIDUgPiAxMDApIHtcbiAgICAgICAgY3VycmVudF9jb2xkX2xldmVsID0gMTAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50X2NvbGRfbGV2ZWwgKz0gNTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudF9jb2xkX2xldmVsIC09IDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlX2Jvb25maXJlc19mdWVsKCkge1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZmlyZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgbGV0IGZpcmUgPSBmaXJlc1tpbmRleF1cbiAgICBpZiAoZmlyZS5mdWVsIDw9IDApIHtcbiAgICAgIGZpcmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcmUuZnVlbCAtPSAxO1xuICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCAtPSAxO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgRlBTID0gMzBcbmxldCBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG5cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wicVwiXSA9IFtjaGFyYWN0ZXIuc3BlbGxzW1wiZnJvc3Rib2x0XCJdXVxuXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGlmICgoRGF0ZS5ub3coKSAtIGxhc3RfdGljaykgPiAxMDAwKSB7XG4gICAgdXBkYXRlX2ZwcygpXG4gICAgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICB9XG4gIGNvbnRyb2xzX21vdmVtZW50KClcbiAgZ28uc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwudXBkYXRlKCkpXG4gIGdvLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IudXBkYXRlKCkpXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZV9mcHMoKSB7XG4gIHVwZGF0ZV9jb2xkX2xldmVsKClcbiAgdXBkYXRlX2Jvb25maXJlc19mdWVsKClcbn1cbi8vIENvbW1lbnRcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIHNjcmVlbi5kcmF3KClcbiAgc3RvbmVzLmZvckVhY2goc3RvbmUgPT4gc3RvbmUuZHJhdygpKVxuICB0cmVlcy5mb3JFYWNoKHRyZWUgPT4gdHJlZS5kcmF3KCkpXG4gIGZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLmRyYXcoKSlcbiAgZ28uZHJhd19zZWxlY3RlZF9jbGlja2FibGUoKVxuICBnby5zcGVsbHMuZm9yRWFjaChzcGVsbCA9PiBzcGVsbC5kcmF3KCkpXG4gIGNoYXJhY3Rlci5kcmF3KClcbiAgZ28ubWFuYWdlZF9vYmplY3RzLmZvckVhY2gobW9iID0+IG1vYi5kcmF3KCkpXG4gIGdvLmNyZWVwcy5mb3JFYWNoKGNyZWVwID0+IGNyZWVwLmRyYXcoKSlcbiAgc2NyZWVuLmRyYXdfZm9nKClcbiAgbG9vdF9ib3guZHJhdygpXG4gIC8vIGNvbGQuZHJhdygxMDAsIGN1cnJlbnRfY29sZF9sZXZlbClcbiAgLy8gY2FzdGluZ19iYXIuZHJhdygpXG4gIGlmIChzaG93X2NvbnRyb2xfd2hlZWwpIGRyYXdfY29udHJvbF93aGVlbCgpXG4gIC8vIGNvbnRyb2xzLmRyYXcoKWFcbn1cblxuY29uc3QgZGljZSA9IChzaWRlcywgdGltZXMgPSAxKSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKEFycmF5KHRpbWVzKSkubWFwKChpKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcykgKyAxKTtcbn1cblxuY29uc3QgZmlyZXMgPSBbXVxuY29uc3QgbWFrZV9maXJlID0gKCkgPT4ge1xuICBsZXQgZHJ5X2xlYXZlcyA9IGNoYXJhY3Rlci5pbnZlbnRvcnkuZmluZChcImRyeSBsZWF2ZXNcIilcbiAgbGV0IHdvb2QgPSBjaGFyYWN0ZXIuaW52ZW50b3J5LmZpbmQoXCJ3b29kXCIpXG4gIGxldCBmbGludHN0b25lID0gY2hhcmFjdGVyLmludmVudG9yeS5maW5kKFwiZmxpbnRzdG9uZVwiKVxuICBpZiAoZHJ5X2xlYXZlcyAmJiBkcnlfbGVhdmVzLnF1YW50aXR5ID4gMCAmJlxuICAgIHdvb2QgJiYgd29vZC5xdWFudGl0eSA+IDAgJiZcbiAgICBmbGludHN0b25lICYmIGZsaW50c3RvbmUucXVhbnRpdHkgPiAwKSB7XG4gICAgY2FzdGluZ19iYXIuc3RhcnQoMTUwMClcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZHJ5X2xlYXZlcy5xdWFudGl0eSAtPSAxXG4gICAgICB3b29kLnF1YW50aXR5IC09IDFcbiAgICAgIGlmIChnby5zZWxlY3RlZF9jbGlja2FibGUgJiZcbiAgICAgICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnR5cGUgPT09IFwiQk9ORklSRVwiKSB7XG4gICAgICAgIGxldCBmaXJlID0gZmlyZXMuZmluZCgoZmlyZSkgPT4gZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBmaXJlKTtcbiAgICAgICAgZmlyZS5mdWVsICs9IDIwO1xuICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ICs9IDIwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGZpcmUgPSBuZXcgRG9vZGFkKHsgZ28gfSlcbiAgICAgICAgZmlyZS50eXBlID0gXCJCT05GSVJFXCJcbiAgICAgICAgZmlyZS5pbWFnZS5zcmMgPSBcImJvbmZpcmUucG5nXCJcbiAgICAgICAgZmlyZS5pbWFnZV94X29mZnNldCA9IDI1MFxuICAgICAgICBmaXJlLmltYWdlX3lfb2Zmc2V0ID0gMjUwXG4gICAgICAgIGZpcmUuaW1hZ2VfaGVpZ2h0ID0gMzUwXG4gICAgICAgIGZpcmUuaW1hZ2Vfd2lkdGggPSAzMDBcbiAgICAgICAgZmlyZS53aWR0aCA9IDY0XG4gICAgICAgIGZpcmUuaGVpZ2h0ID0gNjRcbiAgICAgICAgZmlyZS54ID0gY2hhcmFjdGVyLng7XG4gICAgICAgIGZpcmUueSA9IGNoYXJhY3Rlci55O1xuICAgICAgICBmaXJlLmZ1ZWwgPSAyMDtcbiAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgeDogZmlyZS54LCB5OiBmaXJlLnkgKyBmaXJlLmhlaWdodCwgd2lkdGg6IGZpcmUud2lkdGgsIGhlaWdodDogNSB9KVxuICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5zdGF0aWMgPSB0cnVlXG4gICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmZ1bGwgPSAyMDtcbiAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCA9IDIwO1xuICAgICAgICBmaXJlcy5wdXNoKGZpcmUpXG4gICAgICAgIGdvLmNsaWNrYWJsZXMucHVzaChmaXJlKVxuICAgICAgfVxuICAgIH0sIDE1MDApXG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJZb3UgZG9udCBoYXZlIGFsbCByZXF1aXJlZCBtYXRlcmlhbHMgdG8gbWFrZSBhIGZpcmUuXCIpXG4gIH1cbn1cbi8vPSBEb29kYWRzXG5cbmNvbnN0IHRyZWVzID0gW11cbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBsZXQgdHJlZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICB0cmVlLnggPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBnby53b3JsZC53aWR0aCkgLSB0cmVlLndpZHRoO1xuICB0cmVlLnkgPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBnby53b3JsZC5oZWlnaHQpIC0gdHJlZS5oZWlnaHQ7XG4gIHRyZWVzLnB1c2godHJlZSlcbiAgZ28uY2xpY2thYmxlcy5wdXNoKHRyZWUpXG59KVxuXG5sZXQgbG9vdF90YWJsZV90cmVlID0gW3tcbiAgaXRlbTogeyBuYW1lOiBcIldvb2RcIiwgaW1hZ2Vfc3JjOiBcImJyYW5jaC5wbmdcIiB9LFxuICBtaW46IDEsXG4gIG1heDogMyxcbiAgY2hhbmNlOiA5NVxufSxcbntcbiAgaXRlbTogeyBuYW1lOiBcIkRyeSBMZWF2ZXNcIiwgaW1hZ2Vfc3JjOiBcImxlYXZlcy5qcGVnXCIgfSxcbiAgbWluOiAxLFxuICBtYXg6IDMsXG4gIGNoYW5jZTogMTAwXG59XVxuXG5mdW5jdGlvbiByZW1vdmVfY2xpY2thYmxlKGRvb2RhZCkge1xuICBjb25zdCBjbGlja2FibGVfaW5kZXggPSBnby5jbGlja2FibGVzLmluZGV4T2YoZG9vZGFkKVxuICBpZiAoY2xpY2thYmxlX2luZGV4ID4gLTEpIHtcbiAgICBnby5jbGlja2FibGVzLnNwbGljZShjbGlja2FibGVfaW5kZXgsIDEpXG4gIH1cbiAgaWYgKGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZG9vZGFkKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB9XG59XG5cbmNvbnN0IGN1dF90cmVlID0gKCkgPT4ge1xuICBjb25zdCB0YXJnZXRlZF90cmVlID0gdHJlZXMuZmluZCgodHJlZSkgPT4gdHJlZSA9PT0gZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICBpZiAoKCF0YXJnZXRlZF90cmVlKSB8fCAoVmVjdG9yMi5kaXN0YW5jZSh0YXJnZXRlZF90cmVlLCBjaGFyYWN0ZXIpID4gMTAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IHRyZWVzLmluZGV4T2YodGFyZ2V0ZWRfdHJlZSlcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgbG9vdF9ib3guaXRlbXMgPSByb2xsX2xvb3QobG9vdF90YWJsZV90cmVlKVxuICAgICAgbG9vdF9ib3guc2hvdygpXG4gICAgICB0cmVlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICAgIHJlbW92ZV9jbGlja2FibGUodGFyZ2V0ZWRfdHJlZSlcbiAgfSk7XG59XG5rZXlib2FyZF9pbnB1dC5rZXlfY2FsbGJhY2tzW1wiZlwiXSA9IFtjdXRfdHJlZV1cblxubGV0IG9yZGVyZWRfY2xpY2thYmxlcyA9IFtdO1xuY29uc3QgdGFiX2N5Y2xpbmcgPSAoZXYpID0+IHtcbiAgZXYucHJldmVudERlZmF1bHQoKVxuICBvcmRlcmVkX2NsaWNrYWJsZXMgPSBnby5jcmVlcHMuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBWZWN0b3IyLmRpc3RhbmNlKGEsIGNoYXJhY3RlcikgLSBWZWN0b3IyLmRpc3RhbmNlKGIsIGNoYXJhY3Rlcik7XG4gIH0pXG4gIGlmIChWZWN0b3IyLmRpc3RhbmNlKG9yZGVyZWRfY2xpY2thYmxlc1swXSwgY2hhcmFjdGVyKSA+IDUwMCkgcmV0dXJuO1xuXG4gIGlmIChvcmRlcmVkX2NsaWNrYWJsZXNbMF0gPT09IGdvLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG9yZGVyZWRfY2xpY2thYmxlc1sxXTtcbiAgfSBlbHNlIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBvcmRlcmVkX2NsaWNrYWJsZXNbMF1cbiAgfVxufVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbXCJUYWJcIl0gPSBbdGFiX2N5Y2xpbmddXG5cbmxldCBzaG93X2NvbnRyb2xfd2hlZWwgPSBmYWxzZVxuY29uc3QgZHJhd19jb250cm9sX3doZWVsID0gKCkgPT4ge1xuICBnby5jdHguYmVnaW5QYXRoKClcbiAgZ28uY3R4LmFyYyhcbiAgICBjaGFyYWN0ZXIueCArIChjaGFyYWN0ZXIud2lkdGggLyAyKSAtIGdvLmNhbWVyYS54LFxuICAgIGNoYXJhY3Rlci55ICsgKGNoYXJhY3Rlci5oZWlnaHQgLyAyKSAtIGdvLmNhbWVyYS55LFxuICAgIDIwMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgZ28uY3R4LmxpbmVXaWR0aCA9IDVcbiAgZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJ3aGl0ZVwiXG4gIGdvLmN0eC5zdHJva2UoKTtcbn1cbmNvbnN0IHRvZ2dsZV9jb250cm9sX3doZWVsID0gKCkgPT4geyBzaG93X2NvbnRyb2xfd2hlZWwgPSAhc2hvd19jb250cm9sX3doZWVsIH1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wiY1wiXSA9IFt0b2dnbGVfY29udHJvbF93aGVlbF1cblxuY29uc3Qgc3RvbmVzID0gW11cbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBsZXQgc3RvbmUgPSBuZXcgRG9vZGFkKHsgZ28gfSlcbiAgc3RvbmUuaW1hZ2Uuc3JjID0gXCJmbGludHN0b25lLnBuZ1wiXG4gIHN0b25lLnggPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBnby53b3JsZC53aWR0aCk7XG4gIHN0b25lLnkgPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBnby53b3JsZC5oZWlnaHQpO1xuICBzdG9uZS5pbWFnZV93aWR0aCA9IDg0MFxuICBzdG9uZS5pbWFnZV9oZWlnaHQgPSA4NTlcbiAgc3RvbmUuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHN0b25lLmltYWdlX3lfb2Zmc2V0ID0gMFxuICBzdG9uZS53aWR0aCA9IDMyXG4gIHN0b25lLmhlaWdodCA9IDMyXG4gIHN0b25lcy5wdXNoKHN0b25lKVxuICBnby5jbGlja2FibGVzLnB1c2goc3RvbmUpXG59KVxuXG5sZXQgbG9vdF90YWJsZV9zdG9uZSA9IFt7XG4gIGl0ZW06IHsgbmFtZTogXCJGbGludHN0b25lXCIsIGltYWdlX3NyYzogXCJmbGludHN0b25lLnBuZ1wiIH0sXG4gIG1pbjogMSxcbiAgbWF4OiAxLFxuICBjaGFuY2U6IDEwMFxufV1cblxuY29uc3Qgcm9sbF9sb290ID0gKGxvb3RfdGFibGUpID0+IHtcbiAgbGV0IHJlc3VsdCA9IGxvb3RfdGFibGUubWFwKChsb290X2VudHJ5KSA9PiB7XG4gICAgbGV0IHJvbGwgPSBkaWNlKDEwMClcbiAgICBpZiAocm9sbCA8PSBsb290X2VudHJ5LmNoYW5jZSkge1xuICAgICAgY29uc3QgaXRlbV9idW5kbGUgPSBuZXcgSXRlbShsb290X2VudHJ5Lml0ZW0ubmFtZSlcbiAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IGxvb3RfZW50cnkuaXRlbS5pbWFnZV9zcmNcbiAgICAgIGl0ZW1fYnVuZGxlLnF1YW50aXR5ID0gcmFuZG9tKGxvb3RfZW50cnkubWluLCBsb290X2VudHJ5Lm1heClcbiAgICAgIHJldHVybiBuZXcgTG9vdChpdGVtX2J1bmRsZSwgaXRlbV9idW5kbGUucXVhbnRpdHkpXG4gICAgfVxuICB9KS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeSAhPT0gdW5kZWZpbmVkKVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmNvbnN0IGJyZWFrX3N0b25lID0gKCkgPT4ge1xuICBjb25zdCB0YXJnZXRlZF9zdG9uZSA9IHN0b25lcy5maW5kKChzdG9uZSkgPT4gc3RvbmUgPT09IGdvLnNlbGVjdGVkX2NsaWNrYWJsZSlcbiAgaWYgKCghdGFyZ2V0ZWRfc3RvbmUpIHx8IChWZWN0b3IyLmRpc3RhbmNlKHRhcmdldGVkX3N0b25lLCBjaGFyYWN0ZXIpID4gMTAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IHN0b25lcy5pbmRleE9mKHRhcmdldGVkX3N0b25lKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBsb290X2JveC5pdGVtcyA9IHJvbGxfbG9vdChsb290X3RhYmxlX3N0b25lKVxuICAgICAgbG9vdF9ib3guc2hvdygpXG4gICAgICBzdG9uZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF9zdG9uZSlcbiAgICB9XG4gIH0pXG59XG5rZXlib2FyZF9pbnB1dC5rZXlfY2FsbGJhY2tzW1wiZlwiXS5wdXNoKGJyZWFrX3N0b25lKVxuXG5jb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG5nYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBnby5rZXlib2FyZF9pbnB1dC5wcm9jZXNzX2tleXNfZG93blxuZ2FtZV9sb29wLnVwZGF0ZSA9IHVwZGF0ZVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMV0ucHVzaCgoKSA9PiBtYWtlX2ZpcmUoKSlcblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNoYXJhY3Rlci54ID0gMTAwXG4gIGNoYXJhY3Rlci55ID0gMTAwXG4gIGdvLndvcmxkLmdlbmVyYXRlX21hcCgpXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xufVxuXG5zdGFydCgpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9