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

/***/ "./src/behaviors/spellcasting.js":
/*!***************************************!*\
  !*** ./src/behaviors/spellcasting.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Spellcasting)
/* harmony export */ });
/* harmony import */ var _casting_bar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../casting_bar.js */ "./src/casting_bar.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete.js */ "./src/tapete.js");



function Spellcasting({ go, entity, spell }) {
    this.go = go
    this.entity = entity
    this.spell = spell
    this.casting_bar = new _casting_bar_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, entity: entity })

    this.draw = () => {
        this.casting_bar.draw()
    }

    this.update = () => { }

    this.end = () => {
        ;(0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.managed_objects)
        console.log("Sellcasting#end")
        if (this.entity.stats.current_mana > this.spell.mana_cost) {
            this.entity.stats.current_mana -= this.spell.mana_cost
            this.spell.act()
        }
    }

    this.cast = () => {
        if (!this.go.selected_clickable || !this.go.selected_clickable.stats) return;
        if (this.casting_bar.duration !== null) {
            console.log("Spellcasting#stop")
            this.casting_bar.start(1500, this.end)
        } else if (this.entity.stats.current_mana > this.spell.mana_cost) {
            console.log("Spellcasting#cast")
            this.go.managed_objects.push(this)
            this.casting_bar.start(1500, this.end)
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
/* harmony import */ var _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./behaviors/spellcasting.js */ "./src/behaviors/spellcasting.js");







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
    frostbolt: new _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_5__["default"]({ go, entity: this, spell: new _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this }) }).cast
  }
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this, mana: 50 });
  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 20, colour: "red" })
  this.mana_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 10, colour: "blue" })

  this.update_fps = () => {
    if (this.stats.current_mana < this.stats.mana) this.stats.current_mana += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    if (this.stats.current_hp < this.stats.hp) this.stats.current_hp += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
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

  // Experiments

  Array.prototype.last = function () { return this[this.length - 1] }
  Array.prototype.first = function () { return this[0] }

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
    this.mana_cost = 15

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
  character.update_fps()
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQSwyQkFBMkIsZUFBZSxFQUFFLFVBQVU7QUFDdEQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2pDZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDbkRkO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDTGtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxxREFBZ0I7QUFDN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QiwyQkFBMkI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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aURBQUk7QUFDckI7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCLHdEQUFnQjtBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSxzQkFBc0IscURBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvYWdncm8uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbW92ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYXN0aW5nX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NsaWNrYWJsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NvbnRyb2xzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9kb29kYWQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9ldmVudHNfY2FsbGJhY2tzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9sb29wLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pbnZlbnRvcnkuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pdGVtLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMva2V5Ym9hcmRfaW5wdXQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbG9vdF9ib3guanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Byb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvZnJvc3Rib2x0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vdGFwZXRlXCJcbmltcG9ydCB7IE1vdmUgfSBmcm9tIFwiLi9tb3ZlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWdncm8oeyBnbywgZW50aXR5LCByYWRpdXMgPSAyMCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICAgIHRoaXMubW92ZSA9IG5ldyBNb3ZlKHsgZ28sIGVudGl0eSwgdGFyZ2V0X3Bvc2l0aW9uOiB0aGlzLmdvLmNoYXJhY3RlciB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmIChWZWN0b3IyLmRpc3RhbmNlKHRoaXMuZ28uY2hhcmFjdGVyLCBlbnRpdHkpIDwgdGhpcy5yYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZS5hY3QoKTtcbiAgICAgICAgfVxuICAgIH1cbn0gIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gICAgY29uc3RydWN0b3IoeyBnbywgZW50aXR5LCBzcGVlZCA9IDEsIHRhcmdldF9wb3NpdGlvbiB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgdGhpcy50YXJnZXRfcG9zaXRpb24gPSB0YXJnZXRfcG9zaXRpb25cblxuICAgICAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRfc3RlcCA9IHtcbiAgICAgICAgICAgICAgICB4OiB0aGlzLmVudGl0eS54ICsgdGhpcy5zcGVlZCAqIE1hdGguY29zKFZlY3RvcjIuYW5nbGUodGhpcy5lbnRpdHksIHRoaXMudGFyZ2V0X3Bvc2l0aW9uKSksXG4gICAgICAgICAgICAgICAgeTogdGhpcy5lbnRpdHkueSArIHRoaXMuc3BlZWQgKiBNYXRoLnNpbihWZWN0b3IyLmFuZ2xlKHRoaXMuZW50aXR5LCB0aGlzLnRhcmdldF9wb3NpdGlvbikpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbnRpdHkueCA9IG5leHRfc3RlcC54XG4gICAgICAgICAgICB0aGlzLmVudGl0eS55ID0gbmV4dF9zdGVwLnlcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXIuanNcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZS5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHksIHNwZWxsIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuc3BlbGwgPSBzcGVsbFxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IGVudGl0eSB9KVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4geyB9XG5cbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzKVxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlbGxjYXN0aW5nI2VuZFwiKVxuICAgICAgICBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSAtPSB0aGlzLnNwZWxsLm1hbmFfY29zdFxuICAgICAgICAgICAgdGhpcy5zcGVsbC5hY3QoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jYXN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlIHx8ICF0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cykgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5jYXN0aW5nX2Jhci5kdXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTcGVsbGNhc3Rpbmcjc3RvcFwiKVxuICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgxNTAwLCB0aGlzLmVuZClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgPiB0aGlzLnNwZWxsLm1hbmFfY29zdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTcGVsbGNhc3RpbmcjY2FzdFwiKVxuICAgICAgICAgICAgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgxNTAwLCB0aGlzLmVuZClcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhdHMoeyBnbywgZW50aXR5LCBocCA9IDEwMCwgY3VycmVudF9ocCwgbWFuYSwgY3VycmVudF9tYW5hIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuaHAgPSBocCB8fCAxMDBcbiAgICB0aGlzLmN1cnJlbnRfaHAgPSBjdXJyZW50X2hwIHx8IGhwXG4gICAgdGhpcy5tYW5hID0gbWFuYVxuICAgIHRoaXMuY3VycmVudF9tYW5hID0gY3VycmVudF9tYW5hIHx8IG1hbmFcblxuICAgIHRoaXMuaGFzX21hbmEgPSAoKSA9PiB0aGlzLm1hbmEgPT09IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzX2RlYWQgPSAoKSA9PiB0aGlzLmN1cnJlbnRfaHAgPD0gMDtcbiAgICB0aGlzLmlzX2FsaXZlID0gKCkgPT4gIXRoaXMuaXNfZGVhZCgpO1xuICAgIHRoaXMudGFrZV9kYW1hZ2UgPSAoeyBkYW1hZ2UgfSkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRfaHAgLT0gZGFtYWdlO1xuICAgICAgICBpZiAodGhpcy5pc19kZWFkKCkpIHRoaXMuZGllKClcbiAgICB9XG4gICAgdGhpcy5kaWUgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jcmVlcHMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY3JlZXBzXCIpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jbGlja2FibGVzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNsaWNrYWJsZXNcIilcbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB0aGlzLmVudGl0eSkgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsO1xuICAgIH1cbn0iLCJmdW5jdGlvbiBDYW1lcmEoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2FtZXJhID0gdGhpc1xuICB0aGlzLnggPSAwXG4gIHRoaXMueSA9IDBcbiAgdGhpcy5jYW1lcmFfc3BlZWQgPSAzXG5cbiAgdGhpcy5tb3ZlX2NhbWVyYV93aXRoX21vdXNlID0gKGV2KSA9PiB7XG4gICAgLy9pZiAodGhpcy5nby5lZGl0b3IucGFpbnRfbW9kZSkgcmV0dXJuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpIDwgMTAwKSB7XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCB5ICsgdGhlIG1vdmVtZW50IHdlJ2xsIG1ha2UgZnVydGhlciB0aGVyZSBpcyBncmVhdGVyIHRoYW5cbiAgICAgIC8vIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIHNjcmVlbiBtaW51cyB0aGUgaGVpZ2h0IHRoYXQgd2lsbCBhbHJlYWR5IGJlIHZpc2libGVcbiAgICAgIC8vICh0aGUgY2FudmFzIGhlaWdodCksIGRvbid0IGdvIGZ1cnRoZXIgb3duXG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgdG9wIG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpID4gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSAxMDApIHtcbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPCAxMDApIHtcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpID4gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIDEwMCkge1xuICAgICAgLy8gRG9uJ3QgZ28gZnVydGhlciBsZWZ0XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG4gIH1cblxuICB0aGlzLmZvY3VzID0gKHBvaW50KSA9PiB7XG4gICAgbGV0IHggPSBwb2ludC54IC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgICBsZXQgeSA9IHBvaW50LnkgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgICAvLyBzcGVjaWZpYyBtYXAgY3V0cyAoaXQgaGFzIGEgbWFwIG9mZnNldCBvZiA2MCwxNjApXG4gICAgaWYgKHkgPCAwKSB7IHkgPSAwIH1cbiAgICBpZiAoeCA8IDApIHsgeCA9IDAgfVxuICAgIGlmICh4ICsgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCA+IHRoaXMuZ28ud29ybGQud2lkdGgpIHsgeCA9IHRoaXMueCB9XG4gICAgaWYgKHkgKyB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCA+IHRoaXMuZ28ud29ybGQuaGVpZ2h0KSB7IHkgPSB0aGlzLnkgfVxuICAgIC8vIG9mZnNldCBjaGFuZ2VzIGVuZFxuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gIH1cblxuICB0aGlzLmdsb2JhbF9jb29yZHMgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9iaixcbiAgICAgIHg6IG9iai54IC0gdGhpcy54LFxuICAgICAgeTogb2JqLnkgLSB0aGlzLnlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FtZXJhXG4iLCJmdW5jdGlvbiBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmR1cmF0aW9uID0gbnVsbFxuICAgIHRoaXMud2lkdGggPSBnby5jaGFyYWN0ZXIud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IDVcbiAgICB0aGlzLmNvbG91ciA9IFwicHVycGxlXCJcbiAgICB0aGlzLmZ1bGwgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50ID0gMFxuICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IG51bGxcbiAgICB0aGlzLmxhc3RfdGltZSA9IG51bGxcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbFxuICAgIC8vIFN0YXlzIHN0YXRpYyBpbiBhIHBvc2l0aW9uIGluIHRoZSBtYXBcbiAgICAvLyBNZWFuaW5nOiBkb2Vzbid0IG1vdmUgd2l0aCB0aGUgY2FtZXJhXG4gICAgdGhpcy5zdGF0aWMgPSBmYWxzZVxuICAgIHRoaXMueF9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS54IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuICAgIHRoaXMueV9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS55IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydCA9IChkdXJhdGlvbiwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgdGhpcy5zdGFydGluZ190aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMFxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb25cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKGZ1bGwgPSB0aGlzLmZ1bGwsIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJkcmF3aW5nIGNhc3RpbmcgYmFyXCIpXG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5kdXJhdGlvbiA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBlbGFwc2VkX3RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpbWU7XG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gZWxhcHNlZF90aW1lO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50IDw9IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMuZW50aXR5LnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICB0aGlzLnkgPSB0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0ICsgMTAgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsZXQgYmFyX3dpZHRoID0gKCh0aGlzLmN1cnJlbnQgLyB0aGlzLmR1cmF0aW9uKSAqIHRoaXMud2lkdGgpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2sgIT09IG51bGwpIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FzdGluZ0JhclxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgcmFuZG9tIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuaW1wb3J0IEludmVudG9yeSBmcm9tIFwiLi9pbnZlbnRvcnlcIlxuaW1wb3J0IEZyb3N0Ym9sdCBmcm9tIFwiLi9zcGVsbHMvZnJvc3Rib2x0LmpzXCJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuaW1wb3J0IFNwZWxsY2FzdGluZyBmcm9tIFwiLi9iZWhhdmlvcnMvc3BlbGxjYXN0aW5nLmpzXCJcblxuZnVuY3Rpb24gQ2hhcmFjdGVyKGdvLCBpZCkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jaGFyYWN0ZXIgPSB0aGlzXG4gIHRoaXMuZWRpdG9yID0gZ28uZWRpdG9yXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcImNyaXNpc2NvcmVwZWVwcy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLmlkID0gaWRcbiAgdGhpcy54ID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgdGhpcy55ID0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IFwiZG93blwiXG4gIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9IDBcbiAgdGhpcy5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KCk7XG4gIHRoaXMuc3BlbGxzID0ge1xuICAgIGZyb3N0Ym9sdDogbmV3IFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHk6IHRoaXMsIHNwZWxsOiBuZXcgRnJvc3Rib2x0KHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5jYXN0XG4gIH1cbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIG1hbmE6IDUwIH0pO1xuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgeV9vZmZzZXQ6IDEwLCBjb2xvdXI6IFwiYmx1ZVwiIH0pXG5cbiAgdGhpcy51cGRhdGVfZnBzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9ocCA8IHRoaXMuc3RhdHMuaHApIHRoaXMuc3RhdHMuY3VycmVudF9ocCArPSByYW5kb20oMSwgMylcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy50YXJnZXRfbW92ZW1lbnQpIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQoKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgICB0aGlzLm1hbmFfYmFyLmRyYXcodGhpcy5zdGF0cy5tYW5hLCB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSlcbiAgfVxuXG4gIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHJldHVybiAyXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHJldHVybiAzXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICByZXR1cm4gMFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cblxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgaWYgKHRoaXMueCArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLndpZHRoKSB7XG4gICAgICAgICAgdGhpcy54ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICBpZiAodGhpcy55IC0gdGhpcy5zcGVlZCA+IDApIHtcbiAgICAgICAgICB0aGlzLnkgLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgaWYgKHRoaXMueCAtIHRoaXMuc3BlZWQgPiAwKSB7XG4gICAgICAgICAgdGhpcy54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC5oZWlnaHQpIHtcbiAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAodGhpcy53YWxrX2N5Y2xlX2luZGV4ICsgKDAuMDMgKiB0aGlzLnNwZWVkKSkgJSAzXG4gICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcylcbiAgfVxuXG4gIC8vIEV4cGVyaW1lbnRzXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgdGhpcy5zcGVlZCA9IDNcblxuICB0aGlzLmZpbmRfcGF0aCA9ICh0YXJnZXRfbW92ZW1lbnQpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSB0YXJnZXRfbW92ZW1lbnRcblxuICAgIGlmICh0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IHg6IHRoaXMueCArIHRoaXMuc3BlZWQsIHk6IHRoaXMueSArIHRoaXMuc3BlZWQgfSlcbiAgICB9XG5cbiAgICB2YXIgbGFzdF9zdGVwID0ge31cbiAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0ge31cblxuICAgIGRvIHtcbiAgICAgIGxhc3Rfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoW3RoaXMuY3VycmVudF9wYXRoLmxlbmd0aCAtIDFdXG4gICAgICBmdXR1cmVfbW92ZW1lbnQgPSB7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgICAgLy8gVGhpcyBjb2RlIHdpbGwga2VlcCB0cnlpbmcgdG8gZ28gYmFjayB0byB0aGUgc2FtZSBwcmV2aW91cyBmcm9tIHdoaWNoIHdlIGp1c3QgYnJhbmNoZWQgb3V0XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnggPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcblxuICAgICAgLy8gVGhpcyBpcyBwcmV0dHkgaGVhdnkuLi4gSXQncyBjYWxjdWxhdGluZyBhZ2FpbnN0IGFsbCB0aGUgYml0cyBpbiB0aGUgbWFwID1bXG4gICAgICB2YXIgZ29pbmdfdG9fY29sbGlkZSA9IHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpXG4gICAgICBpZiAoZ29pbmdfdG9fY29sbGlkZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ29sbGlzaW9uIGFoZWFkIScpXG4gICAgICAgIHZhciBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnggPSBuZXh0X21vdmVtZW50LnggLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgb24gWVwiKVxuICAgICAgICB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueSA9IG5leHRfbW92ZW1lbnQueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBYXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyAuLi5mdXR1cmVfbW92ZW1lbnQgfSlcbiAgICB9IHdoaWxlICgoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHx8IChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkpXG5cbiAgICB0aGlzLm1vdmluZyA9IHRydWVcbiAgfVxuXG4gIHRoaXMubW92ZV9vbl9wYXRoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdmFyIG5leHRfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoLnNoaWZ0KClcbiAgICAgIGlmIChuZXh0X3N0ZXApIHtcbiAgICAgICAgdGhpcy54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgdGhpcy55ID0gbmV4dF9zdGVwLnlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICAvL3RoaXMubW92ZSA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCkge1xuICAvLyAgaWYgKHRoaXMubW92aW5nKSB7XG4gIC8vICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7IHg6IHRoaXMueCwgeTogdGhpcy55IH1cblxuICAvLyAgICBpZiAoKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA8PSAxKSkge1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gIC8vICAgICAgdGFyZ2V0X21vdmVtZW50ID0ge31cbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCh0YXJnZXRfbW92ZW1lbnQpXG5cbiAgLy8gICAgICAvLyBQYXRoaW5nXG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgIH1cblxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQud2lkdGggPSB0aGlzLndpZHRoXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gIC8vICAgIGlmICgodGhpcy5nby5lbnRpdGllcy5ldmVyeSgoZW50aXR5KSA9PiBlbnRpdHkuaWQgPT09IHRoaXMuaWQgfHwgIWlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGVudGl0eSkgKSkgJiZcbiAgLy8gICAgICAoIXRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpKSkge1xuICAvLyAgICAgIHRoaXMueCA9IGZ1dHVyZV9tb3ZlbWVudC54XG4gIC8vICAgICAgdGhpcy55ID0gZnV0dXJlX21vdmVtZW50LnlcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIkJsb2NrZWRcIik7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAvLyAgICB9XG4gIC8vICB9XG4gIC8vICAvLyBFTkQgLSBDaGFyYWN0ZXIgTW92ZW1lbnRcbiAgLy99XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2xpY2thYmxlKGdvLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZV9zcmMpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2xpY2thYmxlcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5uYW1lID0gaW1hZ2Vfc3JjXG4gIHRoaXMueCA9IHhcbiAgdGhpcy55ID0geVxuICB0aGlzLndpZHRoID0gd2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gIHRoaXMuYWN0aXZhdGVkID0gZmFsc2VcbiAgdGhpcy5wYWRkaW5nID0gNVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQsIHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy5wYWRkaW5nLCB0aGlzLnkgLSB0aGlzLnBhZGRpbmcsIHRoaXMud2lkdGggKyAoMip0aGlzLnBhZGRpbmcpLCB0aGlzLmhlaWdodCArICgyKnRoaXMucGFkZGluZykpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsaWNrXCIpXG4gIH1cbn1cbiIsImltcG9ydCBDbGlja2FibGUgZnJvbSBcIi4vY2xpY2thYmxlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udHJvbHMoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY29udHJvbHMgPSB0aGlzXG4gIHRoaXMud2lkdGggPSBzY3JlZW4ud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBzY3JlZW4uaGVpZ2h0ICogMC40XG4gIHRoaXMuYXJyb3dzID0ge1xuICAgIHVwOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTAsIDgwLCA4MCwgXCJhcnJvd191cC5wbmdcIiksXG4gICAgbGVmdDogbmV3IENsaWNrYWJsZShnbywgNTAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19sZWZ0LnBuZ1wiKSxcbiAgICByaWdodDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSArIDcwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfcmlnaHQucG5nXCIpLFxuICAgIGRvd246IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMjAsIDgwLCA4MCwgXCJhcnJvd19kb3duLnBuZ1wiKSxcbiAgfVxuICB0aGlzLmFycm93cy51cC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIilcbiAgdGhpcy5hcnJvd3MuZG93bi5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKVxuICB0aGlzLmFycm93cy5sZWZ0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJsZWZ0XCIpXG4gIHRoaXMuYXJyb3dzLnJpZ2h0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJyaWdodFwiKVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuYXJyb3dzKS5mb3JFYWNoKGFycm93ID0+IGFycm93LmRyYXcoKSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcbmltcG9ydCBBZ2dybyBmcm9tIFwiLi9iZWhhdmlvcnMvYWdncm8uanNcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuL2JlaGF2aW9ycy9zdGF0cy5qc1wiXG5cbmZ1bmN0aW9uIENyZWVwKGdvKSB7XG4gIGlmIChnby5jcmVlcHMgPT09IHVuZGVmaW5lZCkgZ28uY3JlZXBzID0gW11cbiAgdGhpcy5pZCA9IGdvLmNyZWVwcy5sZW5ndGhcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY3JlZXBzLnB1c2godGhpcylcblxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5pbWFnZS5zcmMgPSBcInplcmdsaW5nLnBuZ1wiIC8vIHBsYWNlaG9sZGVyIGltYWdlXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAxNTBcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAxNTBcbiAgdGhpcy54ID0gNzAwXG4gIHRoaXMueSA9IDMwMFxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG4gIHRoaXMuc3BlZWQgPSAyXG4gIC8vdGhpcy5tb3ZlbWVudF9ib2FyZCA9IHRoaXMuZ28uYm9hcmQuZ3JpZFxuICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIGhwOiAyMCB9KTtcbiAgLy8gQmVoYXZpb3Vyc1xuICB0aGlzLmFnZ3JvID0gbmV3IEFnZ3JvKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiA1MDAgfSk7XG4gIC8vIEVORCAtIEJlaGF2aW91cnNcblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYWdncm8uYWN0KCk7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSBnby5jYW1lcmEueCwgdGhpcy55IC0gZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgfVxuXG4gIHRoaXMuc2V0X21vdmVtZW50X3RhcmdldCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBub2RlXG4gIH1cblxuICB0aGlzLm1vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpIHtcbiAgICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDcmVlcFxuIiwiZnVuY3Rpb24gRG9vZGFkKHsgZ28gfSkge1xuICB0aGlzLmdvID0gZ29cblxuICB0aGlzLnggPSAwO1xuICB0aGlzLnkgPSAwO1xuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJwbGFudHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDk4XG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAxMjdcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAxMjZcbiAgdGhpcy5pbWFnZV95X29mZnNldCA9IDI5MFxuICB0aGlzLndpZHRoID0gOThcbiAgdGhpcy5oZWlnaHQgPSAxMjZcbiAgdGhpcy5yZXNvdXJjZV9iYXIgPSBudWxsXG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHRoaXMuaW1hZ2VfeF9vZmZzZXQsIHRoaXMuaW1hZ2VfeV9vZmZzZXQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBpZiAodGhpcy5yZXNvdXJjZV9iYXIpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmRyYXcoKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSBmdW5jdGlvbigpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERvb2RhZDtcbiIsIi8vIFRoZSBjYWxsYmFja3Mgc3lzdGVtXG4vLyBcbi8vIFRvIHVzZSBpdDpcbi8vXG4vLyAqIGltcG9ydCB0aGUgY2FsbGJhY2tzIHlvdSB3YW50XG4vL1xuLy8gICAgaW1wb3J0IHsgc2V0TW91c2Vtb3ZlQ2FsbGJhY2sgfSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbi8vXG4vLyAqIGNhbGwgdGhlbSBhbmQgc3RvcmUgdGhlIGFycmF5IG9mIGNhbGxiYWNrIGZ1bmN0aW9uc1xuLy9cbi8vICAgIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbyk7XG4vL1xuLy8gKiBhZGQgb3IgcmVtb3ZlIGNhbGxiYWNrcyBmcm9tIGFycmF5XG4vL1xuLy8gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKGdvLmNhbWVyYS5tb3ZlX2NhbWVyYV93aXRoX21vdXNlKVxuLy8gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKHRyYWNrX21vdXNlX3Bvc2l0aW9uKVxuXG5mdW5jdGlvbiBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbykge1xuICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fbW91c2Vtb3ZlID0gKGV2KSA9PiB7XG4gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXYpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbl9tb3VzZW1vdmUsIGZhbHNlKVxuICByZXR1cm4gbW91c2Vtb3ZlX2NhbGxiYWNrcztcbn1cblxuXG5mdW5jdGlvbiBzZXRDbGlja0NhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IG9uX2NsaWNrICA9IChldikgPT4ge1xuICAgIGNsaWNrX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXYpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbl9jbGljaywgZmFsc2UpXG4gIHJldHVybiBjbGlja19jYWxsYmFja3M7XG59XG5cbmZ1bmN0aW9uIHNldENhbGxiYWNrKGdvLCBldmVudCkge1xuICBjb25zdCBjYWxsYmFja3MgPSBbXVxuICBjb25zdCBoYW5kbGVyID0gKGUpID0+IHtcbiAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGUpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpXG4gIHJldHVybiBjYWxsYmFja3M7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlTW92ZUNhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ21vdXNlbW92ZScpO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZWRvd25DYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZWRvd24nKTtcbn1cblxuZnVuY3Rpb24gc2V0TW91c2V1cENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ21vdXNldXAnKTtcbn1cblxuZnVuY3Rpb24gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoc3RhcnQnKTtcbn1cblxuZnVuY3Rpb24gc2V0VG91Y2hlbmRDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICd0b3VjaGVuZCcpO1xufVxuXG5leHBvcnQge1xuICBzZXRNb3VzZW1vdmVDYWxsYmFjayxcbiAgc2V0Q2xpY2tDYWxsYmFjayxcbiAgc2V0TW91c2VNb3ZlQ2FsbGJhY2ssXG4gIHNldE1vdXNlZG93bkNhbGxiYWNrLFxuICBzZXRNb3VzZXVwQ2FsbGJhY2ssXG4gIHNldFRvdWNoc3RhcnRDYWxsYmFjayxcbiAgc2V0VG91Y2hlbmRDYWxsYmFjayxcbn07XG4iLCIvLyBUaGUgR2FtZSBMb29wXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbi8vIGdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuLy8gZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gcHJvY2Vzc19rZXlzX2Rvd25cbi8vIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZV9sb29wLmxvb3AuYmluZChnYW1lX2xvb3ApKTtcblxuZnVuY3Rpb24gR2FtZUxvb3AoKSB7XG4gIHRoaXMuZHJhdyA9IG51bGxcbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9IG51bGxcbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7fVxuICB0aGlzLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5wcm9jZXNzX2tleXNfZG93bigpXG4gICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB0aGlzLmRyYXcoKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lTG9vcFxuIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5mdW5jdGlvbiBHYW1lT2JqZWN0KCkge1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuICB0aGlzLmNhbnZhc19yZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLmNhbnZhc19yZWN0LndpZHRoKTtcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmNhbnZhc19yZWN0LmhlaWdodCk7XG4gIHRoaXMuY3R4ID0gY3R4XG4gIHRoaXMudGlsZV9zaXplID0gMjBcbiAgdGhpcy5jbGlja2FibGVzID0gW11cbiAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIHRoaXMuc3BlbGxzID0gW10gLy8gU3BlbGwgc3lzdGVtLCBjb3VsZCBiZSBpbmplY3RlZCBieSBpdCBhcyB3ZWxsXG4gIHRoaXMubWFuYWdlZF9vYmplY3RzID0gW10gLy8gUmFuZG9tIG9iamVjdHMgdG8gZHJhdy91cGRhdGVcbiAgdGhpcy5kcmF3X3NlbGVjdGVkX2NsaWNrYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICAgIHRoaXMuY3R4LnNhdmUoKVxuICAgICAgdGhpcy5jdHguc2hhZG93Qmx1ciA9IDEwO1xuICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gXCJ5ZWxsb3dcIlxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDAsIDAuNylcIlxuICAgICAgdGhpcy5jdHguc3Ryb2tlUmVjdChcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueCAtIHRoaXMuY2FtZXJhLnggLSA1LFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS55IC0gdGhpcy5jYW1lcmEueSAtIDUsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoICsgMTAsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS5yZXNvdXJjZV9iYXIgPyAyMCA6IDEwKSk7XG4gICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVPYmplY3QiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZlbnRvcnkoKSB7XG4gIHRoaXMubWF4X3Nsb3RzID0gMTBcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuYWRkID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZ19idW5kbGUgPSB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lID09IGl0ZW0ubmFtZVxuICAgIH0pXG5cbiAgICBpZiAoKHRoaXMuc2xvdHMubGVuZ3RoID49IHRoaXMubWF4X3Nsb3RzKSAmJiAoIWV4aXN0aW5nX2J1bmRsZSkpIHJldHVyblxuXG4gICAgY29uc29sZS5sb2coYCoqKiBHb3QgJHtpdGVtLnF1YW50aXR5fSAke2l0ZW0ubmFtZX1gKVxuICAgIGlmIChleGlzdGluZ19idW5kbGUpIHtcbiAgICAgIGV4aXN0aW5nX2J1bmRsZS5xdWFudGl0eSArPSBpdGVtLnF1YW50aXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2xvdHMucHVzaChpdGVtKVxuICAgIH1cbiAgfVxuICB0aGlzLmZpbmQgPSAoaXRlbV9uYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBpdGVtX25hbWUudG9Mb3dlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuOClcIjtcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgyMCwgMjAsIDIwMCwgMjAwKTtcblxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDYwLCA0MCwgMClcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDI1LCAyNSwgNTAsIDUwKVxuXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDMwLCAzMCwgNDAsIDQwKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJdGVtKG5hbWUsIGltYWdlLCBxdWFudGl0eSA9IDEsIHNyY19pbWFnZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIGlmIChpbWFnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBzcmNfaW1hZ2VcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmltYWdlID0gaW1hZ2VcbiAgfVxuICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcbn1cbiIsImZ1bmN0aW9uIEtleWJvYXJkSW5wdXQoZ28pIHtcbiAgY29uc3Qgb25fa2V5ZG93biA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gdHJ1ZVxuICAgIC8vIFRoZXNlIGFyZSBjYWxsYmFja3MgdGhhdCBvbmx5IGdldCBjaGVja2VkIG9uY2Ugb24gdGhlIGV2ZW50XG4gICAgaWYgKHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPSBbXVxuICAgIH1cbiAgICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKGV2KSlcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25fa2V5ZG93biwgZmFsc2UpXG4gIGNvbnN0IG9uX2tleXVwID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSBmYWxzZVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby5rZXlib2FyZF9pbnB1dCA9IHRoaXNcbiAgdGhpcy5rZXlfY2FsbGJhY2tzID0ge1xuICAgIGQ6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIildLFxuICAgIHc6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIildLFxuICAgIGE6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKV0sXG4gICAgczogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXSxcbiAgfVxuICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzID0ge1xuICAgIDE6IFtdXG4gIH1cblxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gKCkgPT4ge1xuICAgIGNvbnN0IGtleXNfZG93biA9IE9iamVjdC5rZXlzKHRoaXMua2V5c19jdXJyZW50bHlfZG93bikuZmlsdGVyKChrZXkpID0+IHRoaXMua2V5c19jdXJyZW50bHlfZG93bltrZXldID09PSB0cnVlKVxuICAgIGtleXNfZG93bi5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICghKE9iamVjdC5rZXlzKHRoaXMua2V5X2NhbGxiYWNrcykuaW5jbHVkZXMoa2V5KSkpIHJldHVyblxuXG4gICAgICB0aGlzLmtleV9jYWxsYmFja3Nba2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soKSlcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5rZXltYXAgPSB7XG4gICAgZDogXCJyaWdodFwiLFxuICAgIHc6IFwidXBcIixcbiAgICBhOiBcImxlZnRcIixcbiAgICBzOiBcImRvd25cIixcbiAgfVxuXG4gIHRoaXMua2V5c19jdXJyZW50bHlfZG93biA9IHtcbiAgICBkOiBmYWxzZSxcbiAgICB3OiBmYWxzZSxcbiAgICBhOiBmYWxzZSxcbiAgICBzOiBmYWxzZSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBLZXlib2FyZElucHV0O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vdCB7XG4gICAgY29uc3RydWN0b3IoaXRlbSwgcXVhbnRpdHkgPSAxKSB7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGVcIlxuXG5jbGFzcyBMb290Qm94IHtcbiAgICBjb25zdHJ1Y3Rvcihnbykge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZVxuICAgICAgICB0aGlzLmdvID0gZ29cbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgICAgIHRoaXMueCA9IDBcbiAgICAgICAgdGhpcy55ID0gMFxuICAgICAgICB0aGlzLndpZHRoID0gMzUwXG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybjtcblxuICAgICAgICAvLyBJZiB0aGUgcGxheWVyIG1vdmVzIGF3YXksIGRlbGV0ZSBpdGVtcyBhbmQgaGlkZSBsb290IGJveCBzY3JlZW5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKFZlY3RvcjIuZGlzdGFuY2UodGhpcywgdGhpcy5nby5jaGFyYWN0ZXIpID4gNTAwKSB8fFxuICAgICAgICAgICAgKHRoaXMuaXRlbXMubGVuZ3RoIDw9IDApXG4gICAgICAgICkge1xuXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVKb2luID0gJ2JldmVsJztcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyMDAsIDI1NSwgMC41KVwiO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zW2luZGV4XVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICAgICAgbG9vdC54ID0gdGhpcy54ICsgMjUgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICBsb290LnkgPSB0aGlzLnkgKyAoaW5kZXggKiA2MCkgKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICAgICAgICAgIGxvb3Qud2lkdGggPSAzNDBcbiAgICAgICAgICAgIGxvb3QuaGVpZ2h0ID0gNTVcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KGxvb3QueCwgbG9vdC55LCBsb290LndpZHRoLCBsb290LmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShsb290Lml0ZW0uaW1hZ2UsIGxvb3QueCArIDUsIGxvb3QueSArIDUsIDQ1LCA0NSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnMjJweCBzZXJpZidcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QucXVhbnRpdHksIGxvb3QueCArIDY1LCBsb290LnkgKyAzNSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QuaXRlbS5uYW1lLCBsb290LnggKyAxMDAsIGxvb3QueSArIDM1KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIHRoaXMudmlzaWJsZSA9IHRydWVcbiAgICAgIHRoaXMueCA9IHRoaXMuZ28uY2hhcmFjdGVyLnhcbiAgICAgIHRoaXMueSA9IHRoaXMuZ28uY2hhcmFjdGVyLnlcbiAgICB9XG5cbiAgICB0YWtlX2xvb3QobG9vdF9pbmRleCkge1xuICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXMuc3BsaWNlKGxvb3RfaW5kZXgsIDEpWzBdXG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLmludmVudG9yeS5hZGQobG9vdC5pdGVtKVxuICAgIH1cblxuICAgIGNoZWNrX2l0ZW1fY2xpY2tlZChldikge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuXG5cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGxvb3QpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPj0gbG9vdC54KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRYIDw9IGxvb3QueCArIGxvb3Qud2lkdGgpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPj0gbG9vdC55KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRZIDw9IGxvb3QueSArIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgKVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnRha2VfbG9vdChpbmRleClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vdEJveCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhcnRpY2xlKGdvKSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh7IHgsIHkgfSkge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyh4IC0gdGhpcy5nby5jYW1lcmEueCwgeSAtIHRoaXMuZ28uY2FtZXJhLnksIDE1LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmx1ZSc7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSAnbGlnaHRibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlKCk7XG4gICAgfVxufSIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9wYXJ0aWNsZS5qc1wiXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2plY3RpbGUoeyBnbywgc3ViamVjdCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMucGFydGljbGUgPSBuZXcgUGFydGljbGUoZ28pO1xuICAgIHRoaXMuc3RhcnRfcG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcbiAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcbiAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IHsgeDogbnVsbCwgeTogbnVsbCB9O1xuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3RcbiAgICB0aGlzLmJvdW5kcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB3aWR0aDogNSwgaGVpZ2h0OiA1IH1cbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBpZiAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmVuZF9wb3NpdGlvbiwgdGhpcy5jdXJyZW50X3Bvc2l0aW9uKSA8IDUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImh1aFwiKVxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0LmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5kcmF3KHRoaXMuY3VycmVudF9wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMi5hbmdsZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24sIHRoaXMuZW5kX3Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnggKyA1ICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICAgICAgeTogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnkgKyA1ICogTWF0aC5zaW4oYW5nbGUpXG4gICAgICAgIH1cbiAgICB9XG59IiwiZnVuY3Rpb24gUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0LCB5X29mZnNldCA9IDEwLCBjb2xvdXIgPSBcInJlZFwiIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy50YXJnZXQud2lkdGggLyAxMDtcbiAgdGhpcy5jb2xvdXIgPSBjb2xvdXJcbiAgdGhpcy5mdWxsID0gMTAwXG4gIHRoaXMuY3VycmVudCA9IDEwMFxuICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgdGhpcy54ID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRhcmdldC54O1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKGZ1bGwgPSB0aGlzLmZ1bGwsIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQpID0+IHtcbiAgICBsZXQgYmFyX3dpZHRoID0gKCgoTWF0aC5taW4oY3VycmVudCwgZnVsbCkpIC8gZnVsbCkgKiB0aGlzLnRhcmdldC53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCgpIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy50YXJnZXQueS0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMueV9vZmZzZXQsIHRoaXMudGFyZ2V0LndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMudGFyZ2V0LnktIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvdXJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMudGFyZ2V0LnktIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLnlfb2Zmc2V0LCBiYXJfd2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlQmFyXG4iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuZnVuY3Rpb24gU2NyZWVuKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLnNjcmVlbiA9IHRoaXNcbiAgdGhpcy53aWR0aCAgPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoO1xuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0O1xuXG4gIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY2FudmFzLndpZHRoID0gdGhpcy5nby5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdvLmNhbnZhc19yZWN0ID0gdGhpcy5nby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLmNsZWFyKClcbiAgICB0aGlzLmdvLndvcmxkLmRyYXcoKVxuICB9XG5cbiAgdGhpcy5kcmF3X2dhbWVfb3ZlciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC43KVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5nby5jdHguZm9udCA9ICc3MnB4IHNlcmlmJ1xuICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsICh0aGlzLmdvLmNhbnZhcy53aWR0aCAvIDIpIC0gKHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KFwiR2FtZSBPdmVyXCIpLndpZHRoIC8gMiksIHRoaXMuZ28uY2FudmFzLmhlaWdodCAvIDIpO1xuICB9XG5cbiAgdGhpcy5kcmF3X2ZvZyA9ICgpID0+IHtcbiAgICB2YXIgeCA9IHRoaXMuZ28uY2hhcmFjdGVyLnggKyB0aGlzLmdvLmNoYXJhY3Rlci53aWR0aCAvIDIgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgdmFyIHkgPSB0aGlzLmdvLmNoYXJhY3Rlci55ICsgdGhpcy5nby5jaGFyYWN0ZXIuaGVpZ2h0IC8gMiAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICB2YXIgZ3JhZGllbnQgPSB0aGlzLmdvLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCA3MDApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLCAwLCAwLCAwKScpXG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsIDAsIDAsIDEpJylcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudFxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHNjcmVlbi53aWR0aCwgc2NyZWVuLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlcnZlcihnbykge1xuICB0aGlzLmdvID0gZ29cblxuICAvL3RoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4OTk5XCIpXG4gIHRoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL251YmFyaWEuaGVyb2t1YXBwLmNvbTo1NDA4MlwiKVxuICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5sb2dpbih0aGlzLmdvLmNoYXJhY3RlcilcbiAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGV0IHBheWxvYWQgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpXG4gICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvbikge1xuICAgICAgY2FzZSBcImxvZ2luXCI6XG4gICAgICAgIGxldCBuZXdfY2hhciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICAgIG5ld19jaGFyLm5hbWUgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWVcbiAgICAgICAgbmV3X2NoYXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICBuZXdfY2hhci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4gICAgICAgIGNvbnNvbGUubG9nKGBBZGRpbmcgbmV3IGNoYXJgKVxuICAgICAgICBwbGF5ZXJzLnB1c2gobmV3X2NoYXIpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwicGluZ1wiOlxuICAgICAgICAvL2dvLmN0eC5maWxsUmVjdChwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLngsIHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueSwgNTAsIDUwKVxuICAgICAgICAvL2dvLmN0eC5zdHJva2UoKVxuICAgICAgICAvL2xldCBwbGF5ZXIgPSBwbGF5ZXJzWzBdIC8vcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIubmFtZSA9PT0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lKVxuICAgICAgICAvL2lmIChwbGF5ZXIpIHtcbiAgICAgICAgLy8gIHBsYXllci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4gICAgICAgIC8vICBwbGF5ZXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICAvL31cbiAgICAgICAgLy9icmVhaztcbiAgICB9XG4gIH0gLy9cbiAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cblxuICB0aGlzLnBpbmcgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLCBcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG59XG4iLCJpbXBvcnQgUHJvamVjdGlsZSBmcm9tIFwiLi4vcHJvamVjdGlsZVwiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIGlzX2NvbGxpZGluZywgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZyb3N0Ym9sdCh7IGdvIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLnByb2plY3RpbGUgPSBuZXcgUHJvamVjdGlsZSh7IGdvLCBzdWJqZWN0OiB0aGlzIH0pXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubWFuYV9jb3N0ID0gMTVcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmxvZyhcImRyYXdpbmcgRnJvc3Rib2x0XCIpXG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5kcmF3KCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiAoaXNfY29sbGlkaW5nKHRoaXMucHJvamVjdGlsZS5ib3VuZHMoKSwgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSkge1xuICAgICAgICAgICAgaWYgKGRhbWFnZWFibGUodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gcmFuZG9tKDUsIDEwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cy50YWtlX2RhbWFnZSh7IGRhbWFnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYXN0aW5nIEZyb3N0Ym9sdFwiKVxuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gbnVsbCkgfHwgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB1bmRlZmluZWQpKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLnN0YXJ0X3Bvc2l0aW9uID0geyB4OiB0aGlzLmdvLmNoYXJhY3Rlci54ICsgNTAsIHk6IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyA1MCB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5jdXJyZW50X3Bvc2l0aW9uID0geyB4OiB0aGlzLmdvLmNoYXJhY3Rlci54ICsgNTAsIHk6IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyA1MCB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5lbmRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueSArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2plY3RpbGUuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy5nby5zcGVsbHMucHVzaCh0aGlzKVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImVuZGluZyBmcm9zdGJvbHRcIilcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc3BlbGxzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYW1hZ2VhYmxlKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0LnN0YXRzICE9PSB1bmRlZmluZWQgJiYgb2JqZWN0LnN0YXRzLnRha2VfZGFtYWdlICE9PSB1bmRlZmluZWRcbiAgICB9XG59IiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSksXG4gIGFuZ2xlOiAoY3VycmVudF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiBNYXRoLmF0YW4yKGVuZF9wb3NpdGlvbi55IC0gY3VycmVudF9wb3NpdGlvbi55LCBlbmRfcG9zaXRpb24ueCAtIGN1cnJlbnRfcG9zaXRpb24ueClcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGlmIChcbiAgICAoc2VsZi54IDwgdGFyZ2V0LnggKyB0YXJnZXQud2lkdGgpICYmXG4gICAgKHNlbGYueCArIHNlbGYud2lkdGggPiB0YXJnZXQueCkgJiZcbiAgICAoc2VsZi55IDwgdGFyZ2V0LnkgKyB0YXJnZXQuaGVpZ2h0KSAmJlxuICAgIChzZWxmLnkgKyBzZWxmLmhlaWdodCA+IHRhcmdldC55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuY29uc3QgcmFuZG9tID0gKHN0YXJ0LCBlbmQpID0+IHtcbiAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydFxuICAgIHN0YXJ0ID0gMFxuICB9XG4gIHJldHVybiBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBlbmQpICsgc3RhcnQgIFxufVxuXG5mdW5jdGlvbiByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQob2JqZWN0LCBsaXN0KSB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKG9iamVjdCk7XG4gIGlmIChpbmRleCA+IC0xKSB7XG4gICAgcmV0dXJuIGxpc3Quc3BsaWNlKGluZGV4LCAxKVswXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9XG4iLCJjbGFzcyBUaWxlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZV9zcmMsIHhfb2Zmc2V0ID0gMCwgeV9vZmZzZXQgPSAwLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICAgICAgICB0aGlzLnhfb2Zmc2V0ID0geF9vZmZzZXRcbiAgICAgICAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGlsZSIsImltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGVcIlxuXG5mdW5jdGlvbiBXb3JsZChnbykge1xuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ud29ybGQgPSB0aGlzO1xuICB0aGlzLndpZHRoID0gMTAwMDA7XG4gIHRoaXMuaGVpZ2h0ID0gMTAwMDA7XG4gIHRoaXMudGlsZV9zZXQgPSB7XG4gICAgZ3Jhc3M6IG5ldyBUaWxlKFwiZ3Jhc3MucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgZGlydDogbmV3IFRpbGUoXCJkaXJ0Mi5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBzdG9uZTogbmV3IFRpbGUoXCJmbGludHN0b25lLnBuZ1wiLCAwLCAwLCA4NDAsIDg1OSksXG4gIH1cbiAgdGhpcy5waWNrX3JhbmRvbV90aWxlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRpbGVfc2V0LmdyYXNzXG4gIH1cbiAgdGhpcy50aWxlX3dpZHRoID0gNjRcbiAgdGhpcy50aWxlX2hlaWdodCA9IDY0XG4gIHRoaXMudGlsZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmModGhpcy53aWR0aCAvIHRoaXMudGlsZV93aWR0aCkgKyAxO1xuICB0aGlzLnRpbGVzX3Blcl9jb2x1bW4gPSBNYXRoLnRydW5jKHRoaXMuaGVpZ2h0IC8gdGhpcy50aWxlX2hlaWdodCkgKyAxO1xuICB0aGlzLnRpbGVzID0gbnVsbDtcbiAgdGhpcy5nZW5lcmF0ZV9tYXAgPSAoKSA9PiB7XG4gICAgdGhpcy50aWxlcyA9IG5ldyBBcnJheSh0aGlzLnRpbGVzX3Blcl9yb3cpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBpZiAodGhpcy50aWxlc1tyb3ddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10gPSBbdGhpcy5waWNrX3JhbmRvbV90aWxlKCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddLnB1c2godGhpcy5waWNrX3JhbmRvbV90aWxlKCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMudGlsZXNbcm93XVtjb2x1bW5dXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGVfc2V0LmdyYXNzKSB7XG4gICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMudGlsZV9zZXQuZ3Jhc3MuaW1hZ2UsXG4gICAgICAgICAgICB0aGlzLnRpbGVfc2V0LmdyYXNzLnhfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLnlfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLndpZHRoLCB0aGlzLnRpbGVfc2V0LmdyYXNzLmhlaWdodCxcbiAgICAgICAgICAgIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCwgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDY0KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aWxlLmltYWdlLFxuICAgICAgICAgIHRpbGUueF9vZmZzZXQsIHRpbGUueV9vZmZzZXQsIHRpbGUud2lkdGgsIHRpbGUuaGVpZ2h0LFxuICAgICAgICAgIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCwgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDY0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXb3JsZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEtleWJvYXJkSW5wdXQgZnJvbSBcIi4va2V5Ym9hcmRfaW5wdXQuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQge1xuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbmltcG9ydCBHYW1lTG9vcCBmcm9tIFwiLi9nYW1lX2xvb3AuanNcIlxuaW1wb3J0IFdvcmxkIGZyb20gXCIuL3dvcmxkLmpzXCJcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4vZG9vZGFkLmpzXCJcbmltcG9ydCBDb250cm9scyBmcm9tIFwiLi9jb250cm9scy5qc1wiXG5pbXBvcnQgSXRlbSBmcm9tIFwiLi9pdGVtXCJcbmltcG9ydCBTZXJ2ZXIgZnJvbSBcIi4vc2VydmVyXCJcbmltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGUuanNcIlxuaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4vbG9vdF9ib3guanNcIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vbG9vdC5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyLmpzXCJcbmltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuL2Nhc3RpbmdfYmFyLmpzXCJcbmltcG9ydCBDcmVlcCBmcm9tIFwiLi9jcmVlcC5qc1wiXG5pbXBvcnQgUHJvamVjdGlsZSBmcm9tIFwiLi9wcm9qZWN0aWxlLmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG5nby5zcGVsbHMgPSBbXTtcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGdvKVxuY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCB3b3JsZCA9IG5ldyBXb3JsZChnbylcbmNvbnN0IGNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGdvKVxuY2hhcmFjdGVyLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbylcbmNvbnN0IGxvb3RfYm94ID0gbmV3IExvb3RCb3goZ28pXG4vLyBjb25zdCBjb2xkID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHg6IDUsIHk6IDUsIHdpZHRoOiAyMDAsIGhlaWdodDogMjAgfSlcbmNvbnN0IGNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbyB9KVxuXG4vLyBDcmVlcFxuZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gIGxldCBjcmVlcCA9IG5ldyBDcmVlcChnbyk7XG4gIGNyZWVwLnggPSBNYXRoLnJhbmRvbSgpICogZ28ud29ybGQud2lkdGhcbiAgY3JlZXAueSA9IE1hdGgucmFuZG9tKCkgKiBnby53b3JsZC5oZWlnaHRcbiAgZ28uY2xpY2thYmxlcy5wdXNoKGNyZWVwKTtcbn1cbi8vIEVORCAtIENyZWVwXG5cbmNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IHNldENsaWNrQ2FsbGJhY2soZ28pXG5jbGlja19jYWxsYmFja3MucHVzaChjbGlja2FibGVfY2xpY2tlZClcbmZ1bmN0aW9uIGNsaWNrYWJsZV9jbGlja2VkKGV2KSB7XG4gIGxldCBjbGljayA9IHsgeDogZXYuY2xpZW50WCArIGdvLmNhbWVyYS54LCB5OiBldi5jbGllbnRZICsgZ28uY2FtZXJhLnksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICBjb25zdCBjbGlja2FibGUgPSBnby5jbGlja2FibGVzLmZpbmQoKGNsaWNrYWJsZSkgPT4gaXNfY29sbGlkaW5nKGNsaWNrYWJsZSwgY2xpY2spKVxuICBpZiAoY2xpY2thYmxlKSB7XG4gICAgY2xpY2thYmxlLmFjdGl2YXRlZCA9ICFjbGlja2FibGUuYWN0aXZhdGVkXG4gIH1cbiAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gY2xpY2thYmxlXG59XG5cbmxldCBtb3VzZV9pc19kb3duID0gZmFsc2VcbmxldCBtb3VzZV9wb3NpdGlvbiA9IHt9XG5jb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pXG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5mdW5jdGlvbiB0cmFja19tb3VzZV9wb3NpdGlvbihldnQpIHtcbiAgdmFyIHJlY3QgPSBnby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgbW91c2VfcG9zaXRpb24gPSB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQgKyBjYW1lcmEueCxcbiAgICB5OiBldnQuY2xpZW50WSAtIHJlY3QudG9wICsgY2FtZXJhLnlcbiAgfVxufVxuY29uc3QgbW91c2Vkb3duX2NhbGxiYWNrcyA9IHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKVxubW91c2Vkb3duX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5jb25zdCBtb3VzZXVwX2NhbGxiYWNrcyA9IHNldE1vdXNldXBDYWxsYmFjayhnbylcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKGxvb3RfYm94LmNoZWNrX2l0ZW1fY2xpY2tlZC5iaW5kKGxvb3RfYm94KSlcbmNvbnN0IHRvdWNoc3RhcnRfY2FsbGJhY2tzID0gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKVxudG91Y2hzdGFydF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSB0cnVlKVxuY29uc3QgdG91Y2hlbmRfY2FsbGJhY2tzID0gc2V0VG91Y2hlbmRDYWxsYmFjayhnbylcbnRvdWNoZW5kX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxuZnVuY3Rpb24gY29udHJvbHNfbW92ZW1lbnQoKSB7XG4gIC8vIGdvLmNsaWNrYWJsZXMuZm9yRWFjaCgoY2xpY2thYmxlKSA9PiB7XG4gIC8vICAgaWYgKGNsaWNrYWJsZS5hY3RpdmF0ZWQpIHtcbiAgLy8gICAgIGNsaWNrYWJsZS5jbGljaygpXG4gIC8vICAgfVxuICAvLyB9KVxufVxuXG5sZXQgY3VycmVudF9jb2xkX2xldmVsID0gMTAwXG5mdW5jdGlvbiB1cGRhdGVfY29sZF9sZXZlbCgpIHtcbiAgaWYgKGZpcmVzLmZpbmQoKGZpcmUpID0+IFZlY3RvcjIuZGlzdGFuY2UoZmlyZSwgY2hhcmFjdGVyKSA8PSAxNTApKSB7XG4gICAgaWYgKGN1cnJlbnRfY29sZF9sZXZlbCA8IDEwMCkge1xuICAgICAgaWYgKGN1cnJlbnRfY29sZF9sZXZlbCArIDUgPiAxMDApIHtcbiAgICAgICAgY3VycmVudF9jb2xkX2xldmVsID0gMTAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50X2NvbGRfbGV2ZWwgKz0gNTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudF9jb2xkX2xldmVsIC09IDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlX2Jvb25maXJlc19mdWVsKCkge1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZmlyZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgbGV0IGZpcmUgPSBmaXJlc1tpbmRleF1cbiAgICBpZiAoZmlyZS5mdWVsIDw9IDApIHtcbiAgICAgIGZpcmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcmUuZnVlbCAtPSAxO1xuICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCAtPSAxO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgRlBTID0gMzBcbmxldCBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG5cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wicVwiXSA9IFtjaGFyYWN0ZXIuc3BlbGxzW1wiZnJvc3Rib2x0XCJdXVxuXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGlmICgoRGF0ZS5ub3coKSAtIGxhc3RfdGljaykgPiAxMDAwKSB7XG4gICAgdXBkYXRlX2ZwcygpXG4gICAgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICB9XG4gIGNvbnRyb2xzX21vdmVtZW50KClcbiAgZ28uc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwudXBkYXRlKCkpXG4gIGdvLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IudXBkYXRlKCkpXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZV9mcHMoKSB7XG4gIHVwZGF0ZV9jb2xkX2xldmVsKClcbiAgdXBkYXRlX2Jvb25maXJlc19mdWVsKClcbiAgY2hhcmFjdGVyLnVwZGF0ZV9mcHMoKVxufVxuLy8gQ29tbWVudFxuY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgc2NyZWVuLmRyYXcoKVxuICBzdG9uZXMuZm9yRWFjaChzdG9uZSA9PiBzdG9uZS5kcmF3KCkpXG4gIHRyZWVzLmZvckVhY2godHJlZSA9PiB0cmVlLmRyYXcoKSlcbiAgZmlyZXMuZm9yRWFjaChmaXJlID0+IGZpcmUuZHJhdygpKVxuICBnby5kcmF3X3NlbGVjdGVkX2NsaWNrYWJsZSgpXG4gIGdvLnNwZWxscy5mb3JFYWNoKHNwZWxsID0+IHNwZWxsLmRyYXcoKSlcbiAgY2hhcmFjdGVyLmRyYXcoKVxuICBnby5tYW5hZ2VkX29iamVjdHMuZm9yRWFjaChtb2IgPT4gbW9iLmRyYXcoKSlcbiAgZ28uY3JlZXBzLmZvckVhY2goY3JlZXAgPT4gY3JlZXAuZHJhdygpKVxuICBzY3JlZW4uZHJhd19mb2coKVxuICBsb290X2JveC5kcmF3KClcbiAgLy8gY29sZC5kcmF3KDEwMCwgY3VycmVudF9jb2xkX2xldmVsKVxuICAvLyBjYXN0aW5nX2Jhci5kcmF3KClcbiAgaWYgKHNob3dfY29udHJvbF93aGVlbCkgZHJhd19jb250cm9sX3doZWVsKClcbiAgLy8gY29udHJvbHMuZHJhdygpYVxufVxuXG5jb25zdCBkaWNlID0gKHNpZGVzLCB0aW1lcyA9IDEpID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oQXJyYXkodGltZXMpKS5tYXAoKGkpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpZGVzKSArIDEpO1xufVxuXG5jb25zdCBmaXJlcyA9IFtdXG5jb25zdCBtYWtlX2ZpcmUgPSAoKSA9PiB7XG4gIGxldCBkcnlfbGVhdmVzID0gY2hhcmFjdGVyLmludmVudG9yeS5maW5kKFwiZHJ5IGxlYXZlc1wiKVxuICBsZXQgd29vZCA9IGNoYXJhY3Rlci5pbnZlbnRvcnkuZmluZChcIndvb2RcIilcbiAgbGV0IGZsaW50c3RvbmUgPSBjaGFyYWN0ZXIuaW52ZW50b3J5LmZpbmQoXCJmbGludHN0b25lXCIpXG4gIGlmIChkcnlfbGVhdmVzICYmIGRyeV9sZWF2ZXMucXVhbnRpdHkgPiAwICYmXG4gICAgd29vZCAmJiB3b29kLnF1YW50aXR5ID4gMCAmJlxuICAgIGZsaW50c3RvbmUgJiYgZmxpbnRzdG9uZS5xdWFudGl0eSA+IDApIHtcbiAgICBjYXN0aW5nX2Jhci5zdGFydCgxNTAwKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkcnlfbGVhdmVzLnF1YW50aXR5IC09IDFcbiAgICAgIHdvb2QucXVhbnRpdHkgLT0gMVxuICAgICAgaWYgKGdvLnNlbGVjdGVkX2NsaWNrYWJsZSAmJlxuICAgICAgICBnby5zZWxlY3RlZF9jbGlja2FibGUudHlwZSA9PT0gXCJCT05GSVJFXCIpIHtcbiAgICAgICAgbGV0IGZpcmUgPSBmaXJlcy5maW5kKChmaXJlKSA9PiBnby5zZWxlY3RlZF9jbGlja2FibGUgPT09IGZpcmUpO1xuICAgICAgICBmaXJlLmZ1ZWwgKz0gMjA7XG4gICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgKz0gMjA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZmlyZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICAgICAgICBmaXJlLnR5cGUgPSBcIkJPTkZJUkVcIlxuICAgICAgICBmaXJlLmltYWdlLnNyYyA9IFwiYm9uZmlyZS5wbmdcIlxuICAgICAgICBmaXJlLmltYWdlX3hfb2Zmc2V0ID0gMjUwXG4gICAgICAgIGZpcmUuaW1hZ2VfeV9vZmZzZXQgPSAyNTBcbiAgICAgICAgZmlyZS5pbWFnZV9oZWlnaHQgPSAzNTBcbiAgICAgICAgZmlyZS5pbWFnZV93aWR0aCA9IDMwMFxuICAgICAgICBmaXJlLndpZHRoID0gNjRcbiAgICAgICAgZmlyZS5oZWlnaHQgPSA2NFxuICAgICAgICBmaXJlLnggPSBjaGFyYWN0ZXIueDtcbiAgICAgICAgZmlyZS55ID0gY2hhcmFjdGVyLnk7XG4gICAgICAgIGZpcmUuZnVlbCA9IDIwO1xuICAgICAgICBmaXJlLnJlc291cmNlX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB4OiBmaXJlLngsIHk6IGZpcmUueSArIGZpcmUuaGVpZ2h0LCB3aWR0aDogZmlyZS53aWR0aCwgaGVpZ2h0OiA1IH0pXG4gICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLnN0YXRpYyA9IHRydWVcbiAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuZnVsbCA9IDIwO1xuICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ID0gMjA7XG4gICAgICAgIGZpcmVzLnB1c2goZmlyZSlcbiAgICAgICAgZ28uY2xpY2thYmxlcy5wdXNoKGZpcmUpXG4gICAgICB9XG4gICAgfSwgMTUwMClcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIllvdSBkb250IGhhdmUgYWxsIHJlcXVpcmVkIG1hdGVyaWFscyB0byBtYWtlIGEgZmlyZS5cIilcbiAgfVxufVxuLy89IERvb2RhZHNcblxuY29uc3QgdHJlZXMgPSBbXVxuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGxldCB0cmVlID0gbmV3IERvb2RhZCh7IGdvIH0pXG4gIHRyZWUueCA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLndpZHRoKSAtIHRyZWUud2lkdGg7XG4gIHRyZWUueSA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLmhlaWdodCkgLSB0cmVlLmhlaWdodDtcbiAgdHJlZXMucHVzaCh0cmVlKVxuICBnby5jbGlja2FibGVzLnB1c2godHJlZSlcbn0pXG5cbmxldCBsb290X3RhYmxlX3RyZWUgPSBbe1xuICBpdGVtOiB7IG5hbWU6IFwiV29vZFwiLCBpbWFnZV9zcmM6IFwiYnJhbmNoLnBuZ1wiIH0sXG4gIG1pbjogMSxcbiAgbWF4OiAzLFxuICBjaGFuY2U6IDk1XG59LFxue1xuICBpdGVtOiB7IG5hbWU6IFwiRHJ5IExlYXZlc1wiLCBpbWFnZV9zcmM6IFwibGVhdmVzLmpwZWdcIiB9LFxuICBtaW46IDEsXG4gIG1heDogMyxcbiAgY2hhbmNlOiAxMDBcbn1dXG5cbmZ1bmN0aW9uIHJlbW92ZV9jbGlja2FibGUoZG9vZGFkKSB7XG4gIGNvbnN0IGNsaWNrYWJsZV9pbmRleCA9IGdvLmNsaWNrYWJsZXMuaW5kZXhPZihkb29kYWQpXG4gIGlmIChjbGlja2FibGVfaW5kZXggPiAtMSkge1xuICAgIGdvLmNsaWNrYWJsZXMuc3BsaWNlKGNsaWNrYWJsZV9pbmRleCwgMSlcbiAgfVxuICBpZiAoZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBkb29kYWQpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIH1cbn1cblxuY29uc3QgY3V0X3RyZWUgPSAoKSA9PiB7XG4gIGNvbnN0IHRhcmdldGVkX3RyZWUgPSB0cmVlcy5maW5kKCh0cmVlKSA9PiB0cmVlID09PSBnby5zZWxlY3RlZF9jbGlja2FibGUpXG4gIGlmICgoIXRhcmdldGVkX3RyZWUpIHx8IChWZWN0b3IyLmRpc3RhbmNlKHRhcmdldGVkX3RyZWUsIGNoYXJhY3RlcikgPiAxMDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gdHJlZXMuaW5kZXhPZih0YXJnZXRlZF90cmVlKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBsb290X2JveC5pdGVtcyA9IHJvbGxfbG9vdChsb290X3RhYmxlX3RyZWUpXG4gICAgICBsb290X2JveC5zaG93KClcbiAgICAgIHRyZWVzLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF90cmVlKVxuICB9KTtcbn1cbmtleWJvYXJkX2lucHV0LmtleV9jYWxsYmFja3NbXCJmXCJdID0gW2N1dF90cmVlXVxuXG5sZXQgb3JkZXJlZF9jbGlja2FibGVzID0gW107XG5jb25zdCB0YWJfY3ljbGluZyA9IChldikgPT4ge1xuICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gIG9yZGVyZWRfY2xpY2thYmxlcyA9IGdvLmNyZWVwcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgcmV0dXJuIFZlY3RvcjIuZGlzdGFuY2UoYSwgY2hhcmFjdGVyKSAtIFZlY3RvcjIuZGlzdGFuY2UoYiwgY2hhcmFjdGVyKTtcbiAgfSlcbiAgaWYgKFZlY3RvcjIuZGlzdGFuY2Uob3JkZXJlZF9jbGlja2FibGVzWzBdLCBjaGFyYWN0ZXIpID4gNTAwKSByZXR1cm47XG5cbiAgaWYgKG9yZGVyZWRfY2xpY2thYmxlc1swXSA9PT0gZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gb3JkZXJlZF9jbGlja2FibGVzWzFdO1xuICB9IGVsc2Uge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG9yZGVyZWRfY2xpY2thYmxlc1swXVxuICB9XG59XG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1tcIlRhYlwiXSA9IFt0YWJfY3ljbGluZ11cblxubGV0IHNob3dfY29udHJvbF93aGVlbCA9IGZhbHNlXG5jb25zdCBkcmF3X2NvbnRyb2xfd2hlZWwgPSAoKSA9PiB7XG4gIGdvLmN0eC5iZWdpblBhdGgoKVxuICBnby5jdHguYXJjKFxuICAgIGNoYXJhY3Rlci54ICsgKGNoYXJhY3Rlci53aWR0aCAvIDIpIC0gZ28uY2FtZXJhLngsXG4gICAgY2hhcmFjdGVyLnkgKyAoY2hhcmFjdGVyLmhlaWdodCAvIDIpIC0gZ28uY2FtZXJhLnksXG4gICAgMjAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICBnby5jdHgubGluZVdpZHRoID0gNVxuICBnby5jdHguc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCJcbiAgZ28uY3R4LnN0cm9rZSgpO1xufVxuY29uc3QgdG9nZ2xlX2NvbnRyb2xfd2hlZWwgPSAoKSA9PiB7IHNob3dfY29udHJvbF93aGVlbCA9ICFzaG93X2NvbnRyb2xfd2hlZWwgfVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbXCJjXCJdID0gW3RvZ2dsZV9jb250cm9sX3doZWVsXVxuXG5jb25zdCBzdG9uZXMgPSBbXVxuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGxldCBzdG9uZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICBzdG9uZS5pbWFnZS5zcmMgPSBcImZsaW50c3RvbmUucG5nXCJcbiAgc3RvbmUueCA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLndpZHRoKTtcbiAgc3RvbmUueSA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGdvLndvcmxkLmhlaWdodCk7XG4gIHN0b25lLmltYWdlX3dpZHRoID0gODQwXG4gIHN0b25lLmltYWdlX2hlaWdodCA9IDg1OVxuICBzdG9uZS5pbWFnZV94X29mZnNldCA9IDBcbiAgc3RvbmUuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHN0b25lLndpZHRoID0gMzJcbiAgc3RvbmUuaGVpZ2h0ID0gMzJcbiAgc3RvbmVzLnB1c2goc3RvbmUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaChzdG9uZSlcbn0pXG5cbmxldCBsb290X3RhYmxlX3N0b25lID0gW3tcbiAgaXRlbTogeyBuYW1lOiBcIkZsaW50c3RvbmVcIiwgaW1hZ2Vfc3JjOiBcImZsaW50c3RvbmUucG5nXCIgfSxcbiAgbWluOiAxLFxuICBtYXg6IDEsXG4gIGNoYW5jZTogMTAwXG59XVxuXG5jb25zdCByb2xsX2xvb3QgPSAobG9vdF90YWJsZSkgPT4ge1xuICBsZXQgcmVzdWx0ID0gbG9vdF90YWJsZS5tYXAoKGxvb3RfZW50cnkpID0+IHtcbiAgICBsZXQgcm9sbCA9IGRpY2UoMTAwKVxuICAgIGlmIChyb2xsIDw9IGxvb3RfZW50cnkuY2hhbmNlKSB7XG4gICAgICBjb25zdCBpdGVtX2J1bmRsZSA9IG5ldyBJdGVtKGxvb3RfZW50cnkuaXRlbS5uYW1lKVxuICAgICAgaXRlbV9idW5kbGUuaW1hZ2Uuc3JjID0gbG9vdF9lbnRyeS5pdGVtLmltYWdlX3NyY1xuICAgICAgaXRlbV9idW5kbGUucXVhbnRpdHkgPSByYW5kb20obG9vdF9lbnRyeS5taW4sIGxvb3RfZW50cnkubWF4KVxuICAgICAgcmV0dXJuIG5ldyBMb290KGl0ZW1fYnVuZGxlLCBpdGVtX2J1bmRsZS5xdWFudGl0eSlcbiAgICB9XG4gIH0pLmZpbHRlcigoZW50cnkpID0+IGVudHJ5ICE9PSB1bmRlZmluZWQpXG4gIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgYnJlYWtfc3RvbmUgPSAoKSA9PiB7XG4gIGNvbnN0IHRhcmdldGVkX3N0b25lID0gc3RvbmVzLmZpbmQoKHN0b25lKSA9PiBzdG9uZSA9PT0gZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICBpZiAoKCF0YXJnZXRlZF9zdG9uZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfc3RvbmUsIGNoYXJhY3RlcikgPiAxMDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gc3RvbmVzLmluZGV4T2YodGFyZ2V0ZWRfc3RvbmUpXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxvb3RfYm94Lml0ZW1zID0gcm9sbF9sb290KGxvb3RfdGFibGVfc3RvbmUpXG4gICAgICBsb290X2JveC5zaG93KClcbiAgICAgIHN0b25lcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3N0b25lKVxuICAgIH1cbiAgfSlcbn1cbmtleWJvYXJkX2lucHV0LmtleV9jYWxsYmFja3NbXCJmXCJdLnB1c2goYnJlYWtfc3RvbmUpXG5cbmNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG5nYW1lX2xvb3AuZHJhdyA9IGRyYXdcbmdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IGdvLmtleWJvYXJkX2lucHV0LnByb2Nlc3Nfa2V5c19kb3duXG5nYW1lX2xvb3AudXBkYXRlID0gdXBkYXRlXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1sxXS5wdXNoKCgpID0+IG1ha2VfZmlyZSgpKVxuXG5jb25zdCBzdGFydCA9ICgpID0+IHtcbiAgY2hhcmFjdGVyLnggPSAxMDBcbiAgY2hhcmFjdGVyLnkgPSAxMDBcbiAgZ28ud29ybGQuZ2VuZXJhdGVfbWFwKClcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG59XG5cbnN0YXJ0KCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=