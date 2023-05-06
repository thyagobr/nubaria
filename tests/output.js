/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

    // This logic won't work for channeling spells.
    // The effects and the casting bar happen at the same time.
    // Same thing for some skills
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
/* harmony import */ var _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./behaviors/stats.js */ "./src/behaviors/stats.js");
/* harmony import */ var _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./behaviors/spellcasting.js */ "./src/behaviors/spellcasting.js");
/* harmony import */ var _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./spells/frostbolt.js */ "./src/spells/frostbolt.js");
/* harmony import */ var _skills_cut_tree_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./skills/cut_tree.js */ "./src/skills/cut_tree.js");








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
    frostbolt: new _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this, spell: new _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_5__["default"]({ go, entity: this }) }).cast
  }
  this.skills = {
    cut_tree: new Skill({ go, entity: this, skill: new _skills_cut_tree_js__WEBPACK_IMPORTED_MODULE_6__["default"]({ go, entity: this })}).act
  }
  function Skill({ go, entity, skill }) {
    this.go = go
    this.entity = entity
    this.skill = skill

    this.act = () => {
      this.skill.act()
    }
  }
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this, mana: 50 });
  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 20, colour: "red" })
  this.mana_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 10, colour: "blue" })

  this.update_fps = () => {
    if (this.stats.current_mana < this.stats.mana) this.stats.current_mana += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    if (near_bonfire()) {
      if (this.stats.current_hp < this.stats.hp) this.stats.current_hp += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    }
  }

  const near_bonfire = () => false;

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
  this.speed = 1.2

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

/***/ "./src/skills/cut_tree.js":
/*!********************************!*\
  !*** ./src/skills/cut_tree.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CutTree)
/* harmony export */ });
/* harmony import */ var _casting_bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../casting_bar */ "./src/casting_bar.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function CutTree({ go, entity }) {
    this.go = go
    this.entity = entity
    this.loot_box = go.loot_box
    this.casting_bar = new _casting_bar__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, entity: entity })
    this.active = false; // Maybe GameObject should control this toggle

    this.act = () => {
        if (this.active) return;

        const targeted_tree = this.go.trees.find((tree) => tree === this.go.selected_clickable)
        if ((!targeted_tree) || (_tapete__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(targeted_tree, this.go.character) > 100)) {
            return;
        }

        this.go.skills.push(this)
        this.casting_bar.start(3000, () => {
            const index = this.go.trees.indexOf(targeted_tree)
            if (index > -1) {
                // lootboxes have to move from weird
                this.go.loot_box.items = this.go.loot_box.roll_loot(this.loot_table)
                this.go.loot_box.show()
                ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(targeted_tree, this.go.trees)
            }
            (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_clickable)(targeted_tree, this.go)
            ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.skills)
        });
    }

    this.loot_table = [{
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
      

    this.draw = () => {
        this.casting_bar.draw()
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
/* harmony export */   "dice": () => (/* binding */ dice),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "draw_square": () => (/* binding */ draw_square),
/* harmony export */   "is_colliding": () => (/* binding */ is_colliding),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "remove_clickable": () => (/* binding */ remove_clickable),
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

function remove_clickable(doodad, go) {
  const clickable_index = go.clickables.indexOf(doodad)
  if (clickable_index > -1) {
    go.clickables.splice(clickable_index, 1)
  }
  if (go.selected_clickable === doodad) {
    go.selected_clickable = null
  }
}

const dice = (sides, times = 1) => {
  return Array.from(Array(times)).map((i) => Math.floor(Math.random() * sides) + 1);
}




/***/ }),

/***/ "./tests/character.test.js":
/*!*********************************!*\
  !*** ./tests/character.test.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CharacterTest)
/* harmony export */ });
/* harmony import */ var _src_character_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/character.js */ "./src/character.js");
/* harmony import */ var _src_game_object_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/game_object.js */ "./src/game_object.js");



function CharacterTest() {
    this.run = () => {
        let name = "Archon"
        const go = new _src_game_object_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
        const character = new _src_character_js__WEBPACK_IMPORTED_MODULE_0__["default"](go)
        character.name = name

        if (character.name === name) {
            console.log("*PASS*")
        } else {
            console.log("*FAIL*")
        }
    }
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
/*!************************!*\
  !*** ./tests/index.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _character_test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character.test */ "./tests/character.test.js");


new _character_test__WEBPACK_IMPORTED_MODULE_0__["default"]().run();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN2Qzs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNoQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ042Qzs7QUFFN0MsSUFBSSx1REFBYSxTIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3BlbGxjYXN0aW5nLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL3N0YXRzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FzdGluZ19iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3BhcnRpY2xlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcHJvamVjdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Jlc291cmNlX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9jdXRfdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NwZWxscy9mcm9zdGJvbHQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90YXBldGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3Rlc3RzL2NoYXJhY3Rlci50ZXN0LmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vdGVzdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyLmpzXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5LCBzcGVsbCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnNwZWxsID0gc3BlbGxcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiBlbnRpdHkgfSlcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgY29uc29sZS5sb2coXCJTZWxsY2FzdGluZyNlbmRcIilcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSA+IHRoaXMuc3BlbGwubWFuYV9jb3N0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgLT0gdGhpcy5zcGVsbC5tYW5hX2Nvc3RcbiAgICAgICAgICAgIHRoaXMuc3BlbGwuYWN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2FzdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSB8fCAhdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuc3RhdHMpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZ19iYXIuZHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlbGxjYXN0aW5nI3N0b3BcIilcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMCwgdGhpcy5lbmQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlbGxjYXN0aW5nI2Nhc3RcIilcbiAgICAgICAgICAgIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzLnB1c2godGhpcylcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMCwgdGhpcy5lbmQpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YXRzKHsgZ28sIGVudGl0eSwgaHAgPSAxMDAsIGN1cnJlbnRfaHAsIG1hbmEsIGN1cnJlbnRfbWFuYSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmhwID0gaHAgfHwgMTAwXG4gICAgdGhpcy5jdXJyZW50X2hwID0gY3VycmVudF9ocCB8fCBocFxuICAgIHRoaXMubWFuYSA9IG1hbmFcbiAgICB0aGlzLmN1cnJlbnRfbWFuYSA9IGN1cnJlbnRfbWFuYSB8fCBtYW5hXG5cbiAgICB0aGlzLmhhc19tYW5hID0gKCkgPT4gdGhpcy5tYW5hID09PSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc19kZWFkID0gKCkgPT4gdGhpcy5jdXJyZW50X2hwIDw9IDA7XG4gICAgdGhpcy5pc19hbGl2ZSA9ICgpID0+ICF0aGlzLmlzX2RlYWQoKTtcbiAgICB0aGlzLnRha2VfZGFtYWdlID0gKHsgZGFtYWdlIH0pID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50X2hwIC09IGRhbWFnZTtcbiAgICAgICAgaWYgKHRoaXMuaXNfZGVhZCgpKSB0aGlzLmRpZSgpXG4gICAgfVxuICAgIHRoaXMuZGllID0gKCkgPT4ge1xuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcy5lbnRpdHksIHRoaXMuZ28uY3JlZXBzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNyZWVwc1wiKVxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcy5lbnRpdHksIHRoaXMuZ28uY2xpY2thYmxlcykgfHwgY29uc29sZS5sb2coXCJOb3Qgb24gbGlzdCBvZiBjbGlja2FibGVzXCIpXG4gICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gdGhpcy5lbnRpdHkpIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbDtcbiAgICB9XG59IiwiZnVuY3Rpb24gQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5kdXJhdGlvbiA9IG51bGxcbiAgICB0aGlzLndpZHRoID0gZ28uY2hhcmFjdGVyLndpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSA1XG4gICAgdGhpcy5jb2xvdXIgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5mdWxsID0gbnVsbFxuICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBudWxsXG4gICAgdGhpcy5sYXN0X3RpbWUgPSBudWxsXG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGxcbiAgICAvLyBTdGF5cyBzdGF0aWMgaW4gYSBwb3NpdGlvbiBpbiB0aGUgbWFwXG4gICAgLy8gTWVhbmluZzogZG9lc24ndCBtb3ZlIHdpdGggdGhlIGNhbWVyYVxuICAgIHRoaXMuc3RhdGljID0gZmFsc2VcbiAgICB0aGlzLnhfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueCA6XG4gICAgICAgICAgICAwO1xuICAgIH1cbiAgICB0aGlzLnlfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueSA6XG4gICAgICAgICAgICAwO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnQgPSAoZHVyYXRpb24sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZHJhd2luZyBjYXN0aW5nIGJhclwiKVxuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuZHVyYXRpb24gPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBsZXQgZWxhcHNlZF90aW1lID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aW1lO1xuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGVsYXBzZWRfdGltZTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCA8PSB0aGlzLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLmVudGl0eS54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgICAgICAgICAgdGhpcy55ID0gdGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCArIDEwIC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbGV0IGJhcl93aWR0aCA9ICgodGhpcy5jdXJyZW50IC8gdGhpcy5kdXJhdGlvbikgKiB0aGlzLndpZHRoKVxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrICE9PSBudWxsKSB0aGlzLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhc3RpbmdCYXJcbiIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcbmltcG9ydCBJbnZlbnRvcnkgZnJvbSBcIi4vaW52ZW50b3J5XCJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuaW1wb3J0IFNwZWxsY2FzdGluZyBmcm9tIFwiLi9iZWhhdmlvcnMvc3BlbGxjYXN0aW5nLmpzXCJcbmltcG9ydCBGcm9zdGJvbHQgZnJvbSBcIi4vc3BlbGxzL2Zyb3N0Ym9sdC5qc1wiXG5pbXBvcnQgQ3V0VHJlZSBmcm9tIFwiLi9za2lsbHMvY3V0X3RyZWUuanNcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNoYXJhY3RlciA9IHRoaXNcbiAgdGhpcy5lZGl0b3IgPSBnby5lZGl0b3JcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwiY3Jpc2lzY29yZXBlZXBzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaWQgPSBpZFxuICB0aGlzLnggPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICB0aGlzLnkgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gXCJkb3duXCJcbiAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gMFxuICB0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoKTtcbiAgdGhpcy5zcGVsbHMgPSB7XG4gICAgZnJvc3Rib2x0OiBuZXcgU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eTogdGhpcywgc3BlbGw6IG5ldyBGcm9zdGJvbHQoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmNhc3RcbiAgfVxuICB0aGlzLnNraWxscyA9IHtcbiAgICBjdXRfdHJlZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBDdXRUcmVlKHsgZ28sIGVudGl0eTogdGhpcyB9KX0pLmFjdFxuICB9XG4gIGZ1bmN0aW9uIFNraWxsKHsgZ28sIGVudGl0eSwgc2tpbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5za2lsbCA9IHNraWxsXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2tpbGwuYWN0KClcbiAgICB9XG4gIH1cbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIG1hbmE6IDUwIH0pO1xuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgeV9vZmZzZXQ6IDEwLCBjb2xvdXI6IFwiYmx1ZVwiIH0pXG5cbiAgdGhpcy51cGRhdGVfZnBzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgaWYgKG5lYXJfYm9uZmlyZSgpKSB7XG4gICAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X2hwIDwgdGhpcy5zdGF0cy5ocCkgdGhpcy5zdGF0cy5jdXJyZW50X2hwICs9IHJhbmRvbSgxLCAzKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5lYXJfYm9uZmlyZSA9ICgpID0+IGZhbHNlO1xuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy50YXJnZXRfbW92ZW1lbnQpIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQoKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgICB0aGlzLm1hbmFfYmFyLmRyYXcodGhpcy5zdGF0cy5tYW5hLCB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSlcbiAgfVxuXG4gIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHJldHVybiAyXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHJldHVybiAzXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICByZXR1cm4gMFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cblxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgaWYgKHRoaXMueCArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLndpZHRoKSB7XG4gICAgICAgICAgdGhpcy54ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICBpZiAodGhpcy55IC0gdGhpcy5zcGVlZCA+IDApIHtcbiAgICAgICAgICB0aGlzLnkgLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgaWYgKHRoaXMueCAtIHRoaXMuc3BlZWQgPiAwKSB7XG4gICAgICAgICAgdGhpcy54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC5oZWlnaHQpIHtcbiAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAodGhpcy53YWxrX2N5Y2xlX2luZGV4ICsgKDAuMDMgKiB0aGlzLnNwZWVkKSkgJSAzXG4gICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcylcbiAgfVxuXG4gIC8vIEV4cGVyaW1lbnRzXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgdGhpcy5zcGVlZCA9IDEuMlxuXG4gIHRoaXMuZmluZF9wYXRoID0gKHRhcmdldF9tb3ZlbWVudCkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG5cbiAgICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IHRhcmdldF9tb3ZlbWVudFxuXG4gICAgaWYgKHRoaXMuY3VycmVudF9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgeDogdGhpcy54ICsgdGhpcy5zcGVlZCwgeTogdGhpcy55ICsgdGhpcy5zcGVlZCB9KVxuICAgIH1cblxuICAgIHZhciBsYXN0X3N0ZXAgPSB7fVxuICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7fVxuXG4gICAgZG8ge1xuICAgICAgbGFzdF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGhbdGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoIC0gMV1cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudCA9IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgICAvLyBUaGlzIGNvZGUgd2lsbCBrZWVwIHRyeWluZyB0byBnbyBiYWNrIHRvIHRoZSBzYW1lIHByZXZpb3VzIGZyb20gd2hpY2ggd2UganVzdCBicmFuY2hlZCBvdXRcbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuXG4gICAgICAvLyBUaGlzIGlzIHByZXR0eSBoZWF2eS4uLiBJdCdzIGNhbGN1bGF0aW5nIGFnYWluc3QgYWxsIHRoZSBiaXRzIGluIHRoZSBtYXAgPVtcbiAgICAgIHZhciBnb2luZ190b19jb2xsaWRlID0gdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSlcbiAgICAgIGlmIChnb2luZ190b19jb2xsaWRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb2xsaXNpb24gYWhlYWQhJylcbiAgICAgICAgdmFyIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueCA9IG5leHRfbW92ZW1lbnQueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBvbiBZXCIpXG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC55ID0gbmV4dF9tb3ZlbWVudC55IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIFhcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9KVxuICAgIH0gd2hpbGUgKChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkgfHwgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSlcblxuICAgIHRoaXMubW92aW5nID0gdHJ1ZVxuICB9XG5cbiAgdGhpcy5tb3ZlX29uX3BhdGggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB2YXIgbmV4dF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGguc2hpZnQoKVxuICAgICAgaWYgKG5leHRfc3RlcCkge1xuICAgICAgICB0aGlzLnggPSBuZXh0X3N0ZXAueFxuICAgICAgICB0aGlzLnkgPSBuZXh0X3N0ZXAueVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdXG5cbiAgdGhpcy5tb3ZlX3RvX3dheXBvaW50ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jb29yZHMobm9kZSlcbiAgfVxuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIC8vdGhpcy5tb3ZlID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50KSB7XG4gIC8vICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgLy8gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxuXG4gIC8vICAgIGlmICgoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPD0gMSkgJiYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpIDw9IDEpKSB7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgLy8gICAgICB0YXJnZXRfbW92ZW1lbnQgPSB7fVxuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiU3RvcHBlZFwiKTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KHRhcmdldF9tb3ZlbWVudClcblxuICAvLyAgICAgIC8vIFBhdGhpbmdcbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgfVxuXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC53aWR0aCA9IHRoaXMud2lkdGhcbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gICAgaWYgKCh0aGlzLmdvLmVudGl0aWVzLmV2ZXJ5KChlbnRpdHkpID0+IGVudGl0eS5pZCA9PT0gdGhpcy5pZCB8fCAhaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgZW50aXR5KSApKSAmJlxuICAvLyAgICAgICghdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSkpKSB7XG4gIC8vICAgICAgdGhpcy54ID0gZnV0dXJlX21vdmVtZW50LnhcbiAgLy8gICAgICB0aGlzLnkgPSBmdXR1cmVfbW92ZW1lbnQueVxuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiQmxvY2tlZFwiKTtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIC8vICAgIH1cbiAgLy8gIH1cbiAgLy8gIC8vIEVORCAtIENoYXJhY3RlciBNb3ZlbWVudFxuICAvL31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuY2FudmFzX3JlY3Qud2lkdGgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FudmFzX3JlY3QuaGVpZ2h0KTtcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNsaWNrYWJsZXMgPSBbXVxuICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgdGhpcy5zcGVsbHMgPSBbXSAvLyBTcGVsbCBzeXN0ZW0sIGNvdWxkIGJlIGluamVjdGVkIGJ5IGl0IGFzIHdlbGxcbiAgdGhpcy5tYW5hZ2VkX29iamVjdHMgPSBbXSAvLyBSYW5kb20gb2JqZWN0cyB0byBkcmF3L3VwZGF0ZVxuICB0aGlzLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5jdHguc2F2ZSgpXG4gICAgICB0aGlzLmN0eC5zaGFkb3dCbHVyID0gMTA7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSBcInllbGxvd1wiXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMCwgMC43KVwiXG4gICAgICB0aGlzLmN0eC5zdHJva2VSZWN0KFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS54IC0gdGhpcy5jYW1lcmEueCAtIDUsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnkgLSB0aGlzLmNhbWVyYS55IC0gNSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggKyAxMCxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUuaGVpZ2h0ICsgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnJlc291cmNlX2JhciA/IDIwIDogMTApKTtcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZU9iamVjdCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludmVudG9yeSgpIHtcbiAgdGhpcy5tYXhfc2xvdHMgPSAxMFxuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5hZGQgPSAoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nX2J1bmRsZSA9IHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUgPT0gaXRlbS5uYW1lXG4gICAgfSlcblxuICAgIGlmICgodGhpcy5zbG90cy5sZW5ndGggPj0gdGhpcy5tYXhfc2xvdHMpICYmICghZXhpc3RpbmdfYnVuZGxlKSkgcmV0dXJuXG5cbiAgICBjb25zb2xlLmxvZyhgKioqIEdvdCAke2l0ZW0ucXVhbnRpdHl9ICR7aXRlbS5uYW1lfWApXG4gICAgaWYgKGV4aXN0aW5nX2J1bmRsZSkge1xuICAgICAgZXhpc3RpbmdfYnVuZGxlLnF1YW50aXR5ICs9IGl0ZW0ucXVhbnRpdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zbG90cy5wdXNoKGl0ZW0pXG4gICAgfVxuICB9XG4gIHRoaXMuZmluZCA9IChpdGVtX25hbWUpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zbG90cy5maW5kKChidW5kbGUpID0+IHtcbiAgICAgIHJldHVybiBidW5kbGUubmFtZS50b0xvd2VyQ2FzZSgpID09IGl0ZW1fbmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC44KVwiO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDIwLCAyMCwgMjAwLCAyMDApO1xuXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoNjAsIDQwLCAwKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMjUsIDI1LCA1MCwgNTApXG5cbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMzAsIDMwLCA0MCwgNDApXG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhcnRpY2xlKGdvKSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh7IHgsIHkgfSkge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyh4IC0gdGhpcy5nby5jYW1lcmEueCwgeSAtIHRoaXMuZ28uY2FtZXJhLnksIDE1LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmx1ZSc7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSAnbGlnaHRibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlKCk7XG4gICAgfVxufSIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9wYXJ0aWNsZS5qc1wiXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2plY3RpbGUoeyBnbywgc3ViamVjdCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMucGFydGljbGUgPSBuZXcgUGFydGljbGUoZ28pO1xuICAgIHRoaXMuc3RhcnRfcG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcbiAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcbiAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IHsgeDogbnVsbCwgeTogbnVsbCB9O1xuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3RcbiAgICB0aGlzLmJvdW5kcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB3aWR0aDogNSwgaGVpZ2h0OiA1IH1cbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBpZiAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmVuZF9wb3NpdGlvbiwgdGhpcy5jdXJyZW50X3Bvc2l0aW9uKSA8IDUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImh1aFwiKVxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0LmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5kcmF3KHRoaXMuY3VycmVudF9wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMi5hbmdsZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24sIHRoaXMuZW5kX3Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnggKyA1ICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICAgICAgeTogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnkgKyA1ICogTWF0aC5zaW4oYW5nbGUpXG4gICAgICAgIH1cbiAgICB9XG59IiwiZnVuY3Rpb24gUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0LCB5X29mZnNldCA9IDEwLCBjb2xvdXIgPSBcInJlZFwiIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy50YXJnZXQud2lkdGggLyAxMDtcbiAgdGhpcy5jb2xvdXIgPSBjb2xvdXJcbiAgdGhpcy5mdWxsID0gMTAwXG4gIHRoaXMuY3VycmVudCA9IDEwMFxuICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgdGhpcy54ID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRhcmdldC54O1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKGZ1bGwgPSB0aGlzLmZ1bGwsIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQpID0+IHtcbiAgICBsZXQgYmFyX3dpZHRoID0gKCgoTWF0aC5taW4oY3VycmVudCwgZnVsbCkpIC8gZnVsbCkgKiB0aGlzLnRhcmdldC53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCgpIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy50YXJnZXQueS0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMueV9vZmZzZXQsIHRoaXMudGFyZ2V0LndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMudGFyZ2V0LnktIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvdXJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMudGFyZ2V0LnktIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLnlfb2Zmc2V0LCBiYXJfd2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlQmFyXG4iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCByZW1vdmVfY2xpY2thYmxlIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEN1dFRyZWUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMubG9vdF9ib3ggPSBnby5sb290X2JveFxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IGVudGl0eSB9KVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7IC8vIE1heWJlIEdhbWVPYmplY3Qgc2hvdWxkIGNvbnRyb2wgdGhpcyB0b2dnbGVcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICBjb25zdCB0YXJnZXRlZF90cmVlID0gdGhpcy5nby50cmVlcy5maW5kKCh0cmVlKSA9PiB0cmVlID09PSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSlcbiAgICAgICAgaWYgKCghdGFyZ2V0ZWRfdHJlZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nby5jaGFyYWN0ZXIpID4gMTAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nby50cmVlcy5pbmRleE9mKHRhcmdldGVkX3RyZWUpXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGxvb3Rib3hlcyBoYXZlIHRvIG1vdmUgZnJvbSB3ZWlyZFxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmxvb3RfdGFibGUpXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nby50cmVlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZV9jbGlja2FibGUodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nbylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5sb290X3RhYmxlID0gW3tcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIldvb2RcIiwgaW1hZ2Vfc3JjOiBcImJyYW5jaC5wbmdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMyxcbiAgICAgICAgY2hhbmNlOiA5NVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIkRyeSBMZWF2ZXNcIiwgaW1hZ2Vfc3JjOiBcImxlYXZlcy5qcGVnXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDMsXG4gICAgICAgIGNoYW5jZTogMTAwXG4gICAgICB9XVxuICAgICAgXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCBQcm9qZWN0aWxlIGZyb20gXCIuLi9wcm9qZWN0aWxlXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgaXNfY29sbGlkaW5nLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRnJvc3Rib2x0KHsgZ28gfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMucHJvamVjdGlsZSA9IG5ldyBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3Q6IHRoaXMgfSlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5tYW5hX2Nvc3QgPSAxNVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZHJhd2luZyBGcm9zdGJvbHRcIilcbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmRyYXcoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIChpc19jb2xsaWRpbmcodGhpcy5wcm9qZWN0aWxlLmJvdW5kcygpLCB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkpKSB7XG4gICAgICAgICAgICBpZiAoZGFtYWdlYWJsZSh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSByYW5kb20oNSwgMTApO1xuICAgICAgICAgICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNhc3RpbmcgRnJvc3Rib2x0XCIpXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBpZiAoKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBudWxsKSB8fCAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IHVuZGVmaW5lZCkpIHJldHVybjtcblxuICAgICAgICB0aGlzLnByb2plY3RpbGUuc3RhcnRfcG9zaXRpb24gPSB7IHg6IHRoaXMuZ28uY2hhcmFjdGVyLnggKyA1MCwgeTogdGhpcy5nby5jaGFyYWN0ZXIueSArIDUwIH1cbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmN1cnJlbnRfcG9zaXRpb24gPSB7IHg6IHRoaXMuZ28uY2hhcmFjdGVyLnggKyA1MCwgeTogdGhpcy5nby5jaGFyYWN0ZXIueSArIDUwIH1cbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmVuZF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnggKyB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS53aWR0aCAvIDIsXG4gICAgICAgICAgICB5OiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS55ICsgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuaGVpZ2h0IC8gMlxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5hY3RpdmUgPSB0cnVlXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW5kaW5nIGZyb3N0Ym9sdFwiKVxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhbWFnZWFibGUob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3Quc3RhdHMgIT09IHVuZGVmaW5lZCAmJiBvYmplY3Quc3RhdHMudGFrZV9kYW1hZ2UgIT09IHVuZGVmaW5lZFxuICAgIH1cbn0iLCJjb25zdCBkaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBNYXRoLmFicyhNYXRoLmZsb29yKGEpIC0gTWF0aC5mbG9vcihiKSk7XG59XG5cbmNvbnN0IFZlY3RvcjIgPSB7XG4gIGRpc3RhbmNlOiAoYSwgYikgPT4gTWF0aC50cnVuYyhNYXRoLnNxcnQoTWF0aC5wb3coYi54IC0gYS54LCAyKSArIE1hdGgucG93KGIueSAtIGEueSwgMikpKSxcbiAgYW5nbGU6IChjdXJyZW50X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24pID0+IE1hdGguYXRhbjIoZW5kX3Bvc2l0aW9uLnkgLSBjdXJyZW50X3Bvc2l0aW9uLnksIGVuZF9wb3NpdGlvbi54IC0gY3VycmVudF9wb3NpdGlvbi54KVxufVxuXG5jb25zdCBpc19jb2xsaWRpbmcgPSBmdW5jdGlvbihzZWxmLCB0YXJnZXQpIHtcbiAgaWYgKFxuICAgIChzZWxmLnggPCB0YXJnZXQueCArIHRhcmdldC53aWR0aCkgJiZcbiAgICAoc2VsZi54ICsgc2VsZi53aWR0aCA+IHRhcmdldC54KSAmJlxuICAgIChzZWxmLnkgPCB0YXJnZXQueSArIHRhcmdldC5oZWlnaHQpICYmXG4gICAgKHNlbGYueSArIHNlbGYuaGVpZ2h0ID4gdGFyZ2V0LnkpXG4gICkge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSBmdW5jdGlvbiAoeCA9IDEwLCB5ID0gMTAsIHcgPSAyMCwgaCA9IDIwLCBjb2xvciA9IFwicmdiKDE5MCwgMjAsIDEwKVwiKSB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xufVxuXG5jb25zdCByYW5kb20gPSAoc3RhcnQsIGVuZCkgPT4ge1xuICBpZiAoZW5kID09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHN0YXJ0XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgcmV0dXJuIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGVuZCkgKyBzdGFydCAgXG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChvYmplY3QsIGxpc3QpIHtcbiAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2Yob2JqZWN0KTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICByZXR1cm4gbGlzdC5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlX2NsaWNrYWJsZShkb29kYWQsIGdvKSB7XG4gIGNvbnN0IGNsaWNrYWJsZV9pbmRleCA9IGdvLmNsaWNrYWJsZXMuaW5kZXhPZihkb29kYWQpXG4gIGlmIChjbGlja2FibGVfaW5kZXggPiAtMSkge1xuICAgIGdvLmNsaWNrYWJsZXMuc3BsaWNlKGNsaWNrYWJsZV9pbmRleCwgMSlcbiAgfVxuICBpZiAoZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBkb29kYWQpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIH1cbn1cblxuY29uc3QgZGljZSA9IChzaWRlcywgdGltZXMgPSAxKSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKEFycmF5KHRpbWVzKSkubWFwKChpKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcykgKyAxKTtcbn1cblxuZXhwb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgZHJhd19zcXVhcmUsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBkaWNlLCByZW1vdmVfY2xpY2thYmxlIH1cbiIsImltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uL3NyYy9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4uL3NyYy9nYW1lX29iamVjdC5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYXJhY3RlclRlc3QoKSB7XG4gICAgdGhpcy5ydW4gPSAoKSA9PiB7XG4gICAgICAgIGxldCBuYW1lID0gXCJBcmNob25cIlxuICAgICAgICBjb25zdCBnbyA9IG5ldyBHYW1lT2JqZWN0KClcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbiAgICAgICAgY2hhcmFjdGVyLm5hbWUgPSBuYW1lXG5cbiAgICAgICAgaWYgKGNoYXJhY3Rlci5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIipQQVNTKlwiKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIqRkFJTCpcIilcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBDaGFyYWN0ZXJUZXN0IGZyb20gXCIuL2NoYXJhY3Rlci50ZXN0XCI7XG5cbm5ldyBDaGFyYWN0ZXJUZXN0KCkucnVuKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9