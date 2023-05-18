/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/action_bar.js":
/*!***************************!*\
  !*** ./src/action_bar.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete */ "./src/tapete.js");


function ActionBar(game_object) {
  this.game_object = game_object
  this.game_object.action_bar = this
  this.number_of_slots = 10
  this.slot_height = this.game_object.tile_size * 3;
  this.slot_width = this.game_object.tile_size * 3;
  this.y_offset = 100
  this.action_bar_width = this.number_of_slots * this.slot_width
  this.action_bar_height = this.number_of_slots * this.slot_height
  this.action_bar_x = (this.game_object.canvas_rect.width / 2) - (this.action_bar_width / 2)
  this.action_bar_y = this.game_object.canvas_rect.height - this.game_object.tile_size * 4 - this.y_offset

  // character-specific
  this.slots = []
  this.slot_size = 10
  this.slots[0] = this.game_object.character.spellbook.frostbolt
  this.slots[1] = this.game_object.character.spellbook.blink
  // END -- character-specific

  this.highlights = []

  function Slot({ spell, x, y }) {
    this.spell = spell
    this.x = x;
    this.y = y;
  }

  this.highlight_cast = (spell) => {
    this.highlights.push(spell)
  }

  this.draw = function () {
    for (var slot_index = 0; slot_index <= this.slot_size; slot_index++) {
      var slot = this.slots[slot_index];

      var x = this.action_bar_x + (this.slot_width * slot_index)
      var y = this.action_bar_y

      if (slot === undefined) {
        this.game_object.ctx.fillStyle = "rgba(46, 46, 46, 1)"
        this.game_object.ctx.fillRect(
          x, y,
          this.slot_width, this.slot_height)

        this.game_object.ctx.strokeStyle = "blueviolet"
        this.game_object.ctx.lineWidth = 2;
        this.game_object.ctx.strokeRect(
          x, y,
          this.slot_width, this.slot_height
        )
      } else {

        this.game_object.ctx.drawImage(slot.icon, x, y, this.slot_width, this.slot_height)

        this.game_object.ctx.strokeStyle = "blueviolet"
        this.game_object.ctx.lineWidth = 2;
        this.game_object.ctx.strokeRect(
          x, y,
          this.slot_width, this.slot_height
        )

        // Highlight: the action bar "blinks" for a frame when the spell is cast
        if (this.highlights.length > 0) {
          if (this.highlights.find((spell) => spell.id === slot.id)) {
            (0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(slot, this.highlights)
            this.game_object.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
            this.game_object.ctx.fillRect(x, y, this.slot_width, this.slot_height)
          }
        }

        // Cooldown indicator
        if (slot.on_cooldown()) {
          const now = Date.now()
          const percentage = 1 - ((now - slot.last_cast_at) / slot.cooldown_time_in_ms)
          this.game_object.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
          this.game_object.ctx.fillRect(x, y, this.slot_width * percentage, this.slot_height)
        }
      }
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActionBar);


/***/ }),

/***/ "./src/behaviors/aggro.js":
/*!********************************!*\
  !*** ./src/behaviors/aggro.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Aggro)
/* harmony export */ });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../board */ "./src/board.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");
/* harmony import */ var _move__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./move */ "./src/behaviors/move.js");




function Aggro({ go, entity, radius = 20 }) {
    this.go = go
    this.entity = entity
    this.radius = radius
    this.board = new _board__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, entity, radius: Math.floor(this.radius / this.go.tile_size) })
    this.move = new _move__WEBPACK_IMPORTED_MODULE_2__.Move({ go, entity, target_position: this.go.character })

    this.act = () => {
        let distance = _tapete__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(this.go.character, entity)
        if (distance < this.radius) {
            if (distance < (this.go.character.width / 2) + (this.entity.width / 2)) {
                this.entity.stats.attack(this.go.character)
            } else {
                this.move.act();
            }
        }
    }

    this.draw_path = () => {

    }

    const neighbor_positions = () => {
        const current_position = {
            x: this.entity.x,
            y: this.entity.y,
            width: this.entity.width,
            height: this.entity.height
        }

        const left = { ...current_position, x: this.entity.x -= this.entity.speed }
        const right = { ...current_position, x: this.entity.x += this.entity.speed }
        const up = { ...current_position, y: this.entity.y -= this.entity.speed }
        const down = { ...current_position, y: this.entity.y += this.entity.speed }
    }
} 

/***/ }),

/***/ "./src/behaviors/loot.js":
/*!*******************************!*\
  !*** ./src/behaviors/loot.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Loot)
/* harmony export */ });
/* harmony import */ var _loot_box__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loot_box */ "./src/loot_box.js");


function Loot({ go, entity, loot_bag }) {
    this.go = go
    this.entity = entity
    this.loot_bag = loot_bag

    this.act = () => {
        if (this.loot_bag.items === null) {
            this.loot_bag.items = this.go.loot_box.roll_loot(this.loot_bag.entity.loot_table)
            this.go.loot_box.loot_bag = this.loot_bag
            this.go.loot_box.items = this.loot_bag.items
        }
        this.go.loot_box.show()
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
        this.bps = 0;
        this.last_tick = Date.now();
        this.path = null
        this.next_path_index = null
    }

    act = () => {
        // this.bps = Date.now() - this.last_tick
        // if ((this.bps) >= 800) {
        //     this.path = this.entity.aggro.board.find_path(this.entity, this.target_position)
        //     console.log(`Path length ${this.path.length}`)
        //     this.next_path_index = 0
        //     this.last_tick = Date.now()
        //     return;
        // }

        // this.entity.aggro.board.draw()
        //if (this.path === undefined || this.path[this.next_path_index] === undefined) return
        //const targeted_position = this.path[this.next_path_index]
        const targeted_position = { ...this.target_position }
        const next_step = {
            x: this.entity.x + this.speed * Math.cos(_tapete__WEBPACK_IMPORTED_MODULE_0__.Vector2.angle(this.entity, targeted_position)),
            y: this.entity.y + this.speed * Math.sin(_tapete__WEBPACK_IMPORTED_MODULE_0__.Vector2.angle(this.entity, targeted_position)),
            width: this.entity.width,
            height: this.entity.height
        }
        if (!this.go.trees.some(tree => ((0,_tapete__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(next_step, tree)))) {
            this.entity.x = next_step.x
            this.entity.y = next_step.y
        } else {
            // console.log("hmmm... where to?")
        }
    }

    predict_movement = () => {
        this.bps = Date.now() - this.last_tick
        if ((this.bps) >= 3000) {
            this.path = this.entity.aggro.board.find_path(this.entity, this.target_position)
            console.log(`Path length ${this.path.length}`)
            this.next_path_index = 0
            this.last_tick = Date.now()
            return;
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
    this.casting = false

    this.draw = () => {
        if (this.casting) this.casting_bar.draw()
    }

    this.update = () => { }

    // This logic won't work for channeling spells.
    // The effects and the casting bar happen at the same time.
    // Same thing for some skills
    this.end = () => {
        ;(0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.managed_objects)
        if (this.entity.stats.current_mana > this.spell.mana_cost) {
            this.entity.stats.current_mana -= this.spell.mana_cost
            this.spell.act()
        }
    }

    this.cast = () => {
        this.go.action_bar.highlight_cast(this.spell);
        if (!this.spell.is_valid()) return;

        if (this.spell.casting_time_in_ms) {
            if (this.casting_bar.duration !== null) {
                this.casting = false
                ;(0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.managed_objects)
                this.casting_bar.stop()
            } else if (this.entity.stats.current_mana > this.spell.mana_cost) {
                this.casting = true
                this.go.managed_objects.push(this)
                this.casting_bar.start(this.spell.casting_time_in_ms, this.end)
            }
        } else {
            this.end()
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
/* harmony import */ var _beings_loot_bag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../beings/loot_bag */ "./src/beings/loot_bag.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function Stats({ go, entity, hp = 100, current_hp, mana, current_mana }) {
    this.go = go
    this.entity = entity
    this.hp = hp || 100
    this.current_hp = current_hp || hp
    this.mana = mana
    this.current_mana = current_mana || mana
    this.last_attack_at = null;
    this.attack_speed = 1000;

    this.has_mana = () => this.mana === undefined;
    this.is_dead = () => this.current_hp <= 0;
    this.is_alive = () => !this.is_dead();
    this.take_damage = ({ damage }) => {
        this.current_hp -= damage;
        if (this.is_dead()) this.die()
    }
    this.die = () => {
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this.entity, this.go.creeps) || console.log("Not on list of creeps")
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this.entity, this.go.clickables) || console.log("Not on list of clickables")
        if (this.go.selected_clickable === this.entity) this.go.selected_clickable = null;
        this.go.character.update_xp(this.entity)
        if (this.entity.loot_table !== undefined) {
            this.go.loot_bags.push(new _beings_loot_bag__WEBPACK_IMPORTED_MODULE_0__["default"]({ go: this.go, entity: this.entity }))
            // this.go.loot_box.items = this.go.loot_box.roll_loot(this.entity.loot_table)
            // this.go.loot_box.show()
        }
    }
    this.attack = (target) => {
        if (this.last_attack_at === null || (this.last_attack_at + this.attack_speed) < Date.now()) {
            const damage = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(5, 12);
            console.log(`*** ${this.entity.name} attacks ${target.name}: ${damage} damage`)
            target.stats.take_damage({ damage: damage })
            this.last_attack_at = Date.now();
        }
    }
}

/***/ }),

/***/ "./src/beings/creep.js":
/*!*****************************!*\
  !*** ./src/beings/creep.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete.js */ "./src/tapete.js");
/* harmony import */ var _resource_bar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../resource_bar.js */ "./src/resource_bar.js");
/* harmony import */ var _behaviors_aggro_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../behaviors/aggro.js */ "./src/behaviors/aggro.js");
/* harmony import */ var _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../behaviors/stats.js */ "./src/behaviors/stats.js");





function Creep({ go }) {
  if (go.creeps === undefined) go.creeps = []
  this.id = go.creeps.length
  this.go = go
  this.go.creeps.push(this)
  this.name = `Creep ${this.id}`
  this.image = new Image()
  this.image.src = "zergling.png" // placeholder image
  this.image_width = 150
  this.image_height = 150
  this.image_x_offset = 0
  this.image_y_offset = 0
  this.x = (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, this.go.world.width)
  this.y = (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, this.go.world.height)
  this.width = this.go.tile_size * 4
  this.height = this.go.tile_size * 4
  this.moving = false
  this.direction = null
  this.speed = 2
  //this.movement_board = this.go.board.grid
  this.current_movement_target = null
  this.health_bar = new _resource_bar_js__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, width: 100, height: 10, colour: "red" })
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this, hp: 20 });
  // Behaviours
  this.aggro = new _behaviors_aggro_js__WEBPACK_IMPORTED_MODULE_2__["default"]({ go, entity: this, radius: 500 });
  // END - Behaviours

  this.coords = function (coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function (target_position) {
    let x = target_position && target_position.x ? target_position.x : this.x - this.go.camera.x
    let y = target_position && target_position.y ? target_position.y : this.y - this.go.camera.y
    let width = target_position && target_position.width ? target_position.width : this.width
    let height = target_position && target_position.height ? target_position.height : this.height
    this.go.ctx.drawImage(this.image, this.image_x_offset, this.image_y_offset, this.image_width, this.image_height, x, y, width, height)
    if (target_position) return

    this.aggro.act();
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

  this.loot_table = [{
    item: { name: "Wood", image_src: "branch.png" },
    min: 1,
    max: 3,
    chance: 95
  }]
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Creep);


/***/ }),

/***/ "./src/beings/loot_bag.js":
/*!********************************!*\
  !*** ./src/beings/loot_bag.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LootBag)
/* harmony export */ });
/* harmony import */ var _doodad__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../doodad */ "./src/doodad.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function LootBag({ go, entity }) {
    this.__proto__ = new _doodad__WEBPACK_IMPORTED_MODULE_0__["default"]({ go })

    this.id = `loot_bag`
    this.go = go
    this.entity = entity
    this.x = entity.x
    this.y = entity.y
    this.width = 50
    this.height = 50
    this.image = new Image()
    this.image.src = 'backpack.png'
    this.go.clickables.push(this);
    this.items = null
    this.acted_by_skill = 'loot'

    this.draw = () => {
        this.go.ctx.drawImage(this.image, 0, 0, 1000, 1000, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
    }

    this.update = () => {
        if (this.items && this.items.length === 0) {
            (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.clickables)
            ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.loot_bags)
        }
    }

    this.update_fps = () => {}
}

/***/ }),

/***/ "./src/beings/stone.js":
/*!*****************************!*\
  !*** ./src/beings/stone.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Stone)
/* harmony export */ });
/* harmony import */ var _doodad__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../doodad */ "./src/doodad.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function Stone({ go }) {
    this.__proto__ = new _doodad__WEBPACK_IMPORTED_MODULE_0__["default"]({ go })

    this.image.src = "flintstone.png"
    this.x = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(1, this.go.world.width);
    this.y = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(1, this.go.world.height);
    this.image_width = 840
    this.image_height = 859
    this.image_x_offset = 0
    this.image_y_offset = 0
    this.width = 32
    this.height = 32
    this.acted_by_skill = 'break_stone'
}

/***/ }),

/***/ "./src/beings/tree.js":
/*!****************************!*\
  !*** ./src/beings/tree.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tree)
/* harmony export */ });
/* harmony import */ var _doodad__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../doodad */ "./src/doodad.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function Tree({ go }) {
    this.__proto__ = new _doodad__WEBPACK_IMPORTED_MODULE_0__["default"]({ go })

    this.image.src = "plants.png"
    this.x = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(1, this.go.world.width);
    this.y = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(1, this.go.world.height);
    this.image_width = 98
    this.image_x_offset = 127
    this.image_height = 126
    this.image_y_offset = 290
    this.width = 98
    this.height = 126
    this.acted_by_skill = "cut_tree"
}

/***/ }),

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node.js */ "./src/node.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");



// A grid of tiles for the manipulation
function Board({ go, entity, radius }) {
  this.go = go
  this.go.board = this
  this.tile_size = this.go.tile_size
  this.grid = [[]]
  this.radius = radius
  this.width = this.radius * 2
  this.height = this.radius * 2
  this.entity = entity
  this.should_draw = false

  this.toggle_grid = () => {
    this.should_draw = !this.should_draw
    if (this.should_draw) this.build_grid()
  }

  this.bps = 0;
  this.last_tick = Date.now();

  this.build_grid = () => {
    console.log("building grid")
    this.bps = Date.now() - this.last_tick
    if ((this.bps) < 1000) {
      return;
    }
    this.last_tick = Date.now()
    this.grid = new Array(this.width)

    const x_position = Math.floor(this.entity.x + this.entity.width / 2)
    const y_position = Math.floor(this.entity.y + this.entity.height / 2)

    for (let x = 0; x < this.width; x++) {
      this.grid[x] = new Array(this.height)
      for (let y = 0; y < this.height; y++) {
        const node = new _node_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
          x: (x_position - (this.radius * this.tile_size) + x * this.tile_size),
          y: (y_position - (this.radius * this.tile_size) + y * this.tile_size),
          width: this.tile_size,
          height: this.tile_size,
          g: Infinity, // Cost so far
          f: Infinity, // Cost from here to target
          h: null, //
          parent: null,
          visited: false,
          border_colour: "black"
        })
        this.go.trees.forEach(tree => {
          if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.is_colliding)(node, tree)) {
            node.colour = 'red';
            node.blocked = true
          }
        })
        this.grid[x][y] = node
      }
    }
  }

  this.way_to_player = () => {
    if (this.go.selected_clickable) {
      this.find_path(this.go.selected_clickable, this.go.character)
    }
  }

  // A* Implementation
  // f: Cost of the entire travel (sum of g + h)
  // g: Cost from start_node till node (travel cost)
  // h: Cost from node till end_node (leftover cost)
  // Add the current node in a list
  // Pop the one whose f is the lowesta
  // Add to a list of already-visited (closed)
  // Visit all its neighbours
  // Update for each: the travel cost (g) you managed to do and yourself as parent
  //// So that we can retrace how we got here
  this.find_path = (start_position, end_position) => {
    this.build_grid()
    const start_node = this.get_node_for(start_position);
    const end_node = this.get_node_for(end_position);
    if (!start_node || !end_node) {
      console.log("nodes not matched")
      debugger
    }

    start_node.colour = 'orange'
    end_node.colour = 'orange'

    const open_set = [start_node];
    const closed_set = [];

    const cost = (node_a, node_b) => {
      const dx = node_a.x - node_b.x;
      const dy = node_a.y - node_b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    start_node.g = 0;
    start_node.f = cost(start_node, end_node);

    while (open_set.length > 0) {
      const current_node = open_set.sort((a, b) => (a.f < b.f ? -1 : 1))[0] // Get the node with lowest f value in the open set
      ;(0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(current_node, open_set)
      closed_set.push(current_node)
      
      if (current_node === end_node) {
        let current = current_node;
        let path = [];
        while (current.parent) {
          current.colour = 'purple'
          path.push(current);
          current = current.parent;
        }
        return path.reverse();
      }
      
      this.neighbours(current_node).forEach(neighbour_node => {
        if (!neighbour_node.blocked && !closed_set.includes(neighbour_node)) {
          let g_used = current_node.g + cost(current_node, neighbour_node)
          let best_g = false;
          if (!open_set.includes(neighbour_node)) {
            neighbour_node.h = cost(neighbour_node, end_node)
            open_set.push(neighbour_node)
            best_g = true
          } else if (g_used < neighbour_node.g) {
            best_g = true
          }

          if (best_g) {
            neighbour_node.parent = current_node;
            neighbour_node.g = g_used
            neighbour_node.f = neighbour_node.g + neighbour_node.h
          }
        }
      })
    }
  }

  this.neighbours = (node) => { // 5,5
    const x_offset = (Math.floor(this.entity.x + this.entity.width / 2) - (this.radius * this.tile_size))
    const y_offset = (Math.floor(this.entity.y + this.entity.height / 2) - (this.radius * this.tile_size))
    const x = Math.floor((node.x - x_offset) / this.tile_size)
    const y = Math.floor((node.y - y_offset) / this.tile_size)

    function fetch_grid_cell(grid, lx, ly) {
      return grid[lx] && grid[lx][ly]
    }

    return [
      fetch_grid_cell(this.grid, x, y - 1), // top
      fetch_grid_cell(this.grid, x - 1, y - 1), // top left
      fetch_grid_cell(this.grid, x + 1, y - 1), // top right
      fetch_grid_cell(this.grid, x, y + 1), // bottom
      fetch_grid_cell(this.grid, x - 1, y + 1), // bottom left
      fetch_grid_cell(this.grid, x + 1, y + 1), // bottom right
      fetch_grid_cell(this.grid, x - 1, y), // right
      fetch_grid_cell(this.grid, x + 1, y) // left
    ].filter(node => node !== undefined)
  }

  this.draw = () => {
    if (!this.should_draw) return

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let node = this.grid[x][y];
        this.go.ctx.lineWidth = "1"
        this.go.ctx.strokeStyle = node.border_colour
        this.go.ctx.fillStyle = node.colour
        this.go.ctx.fillRect(node.x - this.go.camera.x, node.y - this.go.camera.y, node.width, node.height)
        this.go.ctx.strokeRect(node.x - this.go.camera.x, node.y - this.go.camera.y, node.width, node.height)
      }
    }

    this.build_grid()
  }

  // Receives a rect and returns it's first colliding Node
  this.get_node_for = (rect) => {
    if (rect.width == undefined) rect.width = 1
    if (rect.height == undefined) rect.height = 1
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if ((this.grid[x] === undefined) || (this.grid[x][y] === undefined)) {
          // console.log(`${x},${y} coordinates is undefined`)
          // console.log(`Width: ${this.width}; height: ${this.height} (radius: ${this.radius})`)
        } else {
          if ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.is_colliding)(
            {
              ...rect,
            }, this.grid[x][y])) return this.grid[x][y];
        }
      }
    }
  }


  // UNUSED OLD ALGORITHM

  // Sets a global target node
  // It was used before the movement got detached from the player character
  this.target_node = null
  this.set_target = (node) => {
    this.grid.forEach((node) => node.distance = 0)
    this.target_node = node
  }

  // Calculates possible possitions for the next movement
  this.calculate_neighbours = (character) => {
    let character_rect = {
      x: character.x - character.speed,
      y: character.y - character.speed,
      width: character.width + character.speed,
      height: character.height + character.speed
    }

    let future_movement_collisions = character.movement_board.filter((node) => {
      return (0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.is_colliding)(character_rect, node)
    })

    // I'm gonna copy them here otherwise different entities calculating distance
    // will affect each other's numbers. This can be solved with a different
    // calculation algorithm as well.
    return future_movement_collisions
  }


  this.next_step = (character, closest_node, target_node) => {
    // Step: Select all neighbours
    let visited = []
    let nodes_per_row = Math.trunc(4096 / go.tile_size)
    let origin_index = closest_node.id

    let neighbours = this.calculate_neighbours(character)

    // Step: Sort neighbours by distance (smaller distance first)
    // We add the walk movement to re-visited nodes to signify this cost
    let neighbours_sorted_by_distance_asc = neighbours.sort((a, b) => {
      if (a.distance) {
        //a.distance += 2 * character.speed
      } else {
        a.distance = _tapete_js__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(a, target_node)
      }

      if (b.distance) {
        //b.distance += character.speed
      } else {
        b.distance = _tapete_js__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(b, target_node)
      }

      return a.distance - b.distance
    })

    // Step: Select only neighbour nodes that are not blocked
    neighbours_sorted_by_distance_asc = neighbours_sorted_by_distance_asc.filter((node) => {
      return node.blocked !== true
    })

    // Step: Return the closest valid node to the target
    // returns true if the closest point is the target itself
    // returns false if there is nowhere to go
    if (neighbours_sorted_by_distance_asc.length == 0) {
      return false
    } else {
      let future_node = neighbours_sorted_by_distance_asc[0]
      return (future_node.id == target_node.id ? true : future_node)
    }
  }

  this.move = function (character, target_node) {
    let char_pos = {
      x: character.x,
      y: character.y
    }

    let current_node = this.get_node_for(char_pos)
    let closest_node = this.next_step(character, current_node, target_node)

    // We have a next step
    if (typeof (closest_node) === "object") {
      let future_movement = { ...char_pos }
      let x_speed = 0
      let y_speed = 0
      if (closest_node.x != character.x) {
        let distance_x = char_pos.x - closest_node.x
        if (Math.abs(distance_x) >= character.speed) {
          x_speed = (distance_x > 0 ? -character.speed : character.speed)
        } else {
          if (char_pos.x < closest_node.x) {
            x_speed = Math.abs(distance_x) * -1
          } else {
            x_speed = Math.abs(distance_x)
          }
        }
      }

      if (closest_node.y != character.y) {
        let distance_y = future_movement.y - closest_node.y
        if (Math.abs(distance_y) >= character.speed) {
          y_speed = (distance_y > 0 ? -character.speed : character.speed)
        } else {
          if (future_movement.y < closest_node.y) {
            y_speed = Math.abs(distance_y)
          } else {
            y_speed = Math.abs(distance_y) * -1
          }
        }
      }

      future_movement.x = future_movement.x + x_speed
      future_movement.y = future_movement.y + y_speed

      character.coords(future_movement)
      // We're already at the best spot
    } else if (closest_node === true) {
      console.log("reached")
      character.movement_board = []
      character.moving = false
      // We're stuck
    } else {
      // TODO: got this once after had already reached. 
      console.log("no path")
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Board);


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

    this.stop = () => this.duration = null

    this.draw = (full = this.full, current = this.current) => {
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
            if ((this.callback !== null) && (this.callback !== undefined)) this.callback();
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
/* harmony import */ var _spells_blink_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./spells/blink.js */ "./src/spells/blink.js");
/* harmony import */ var _skills_cut_tree_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./skills/cut_tree.js */ "./src/skills/cut_tree.js");
/* harmony import */ var _skill_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./skill.js */ "./src/skill.js");
/* harmony import */ var _skills_break_stone_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./skills/break_stone.js */ "./src/skills/break_stone.js");
/* harmony import */ var _skills_make_fire_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./skills/make_fire.js */ "./src/skills/make_fire.js");
/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./board.js */ "./src/board.js");
/* harmony import */ var _behaviors_loot_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./behaviors/loot.js */ "./src/behaviors/loot.js");














function Character(go, id) {
  this.go = go
  this.go.character = this
  this.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
  this.editor = go.editor
  this.image = new Image();
  this.image.src = "crisiscorepeeps.png"
  this.image_width = 32
  this.image_height = 32
  this.id = id
  this.x = 100
  this.y = 100
  this.width = this.go.tile_size * 2
  this.height = this.go.tile_size * 2
  this.moving = false
  this.direction = "down"
  this.walk_cycle_index = 0
  this.speed = 1.4
  this.inventory = new _inventory__WEBPACK_IMPORTED_MODULE_2__["default"]({ go });
  this.spellbook = {
    frostbolt: new _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_5__["default"]({ go, entity: this }),
    blink: new _spells_blink_js__WEBPACK_IMPORTED_MODULE_6__["default"]({ go, entity: this })
  }
  this.spells = {
    frostbolt: new _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this, spell: this.spellbook.frostbolt }).cast,
    blink: new _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this, spell: this.spellbook.blink }).cast
  }
  this.skills = {
    cut_tree: new _skill_js__WEBPACK_IMPORTED_MODULE_8__["default"]({ go, entity: this, skill: new _skills_cut_tree_js__WEBPACK_IMPORTED_MODULE_7__["default"]({ go, entity: this }) }).act,
    break_stone: new _skill_js__WEBPACK_IMPORTED_MODULE_8__["default"]({ go, entity: this, skill: new _skills_break_stone_js__WEBPACK_IMPORTED_MODULE_9__["default"]({ go, entity: this }) }).act,
    make_fire: new _skill_js__WEBPACK_IMPORTED_MODULE_8__["default"]({ go, entity: this, skill: new _skills_make_fire_js__WEBPACK_IMPORTED_MODULE_10__["default"]({ go, entity: this }) }).act
  }
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this, mana: 50 });
  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 20, colour: "red" })
  this.mana_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 10, colour: "blue" })
  this.board = new _board_js__WEBPACK_IMPORTED_MODULE_11__["default"]({ go, entity: this, radius: 20 })
  this.experience_points = 0
  this.level = 1;
  this.update_xp = (entity) => {
    this.experience_points += 100;
    if (this.experience_points >= 1000) {
      this.level += 1;
      this.experience_points = 0;
    }
  }

  this.update_fps = () => {
    if (this.stats.current_mana < this.stats.mana) this.stats.current_mana += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    if (near_bonfire()) {
      if (this.stats.current_hp < this.stats.hp) this.stats.current_hp += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(4, 7)
      if (this.stats.current_mana < this.stats.mana) this.stats.current_mana += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    }
  }

  // This function tries to see if the selected clickable has a default action set for interaction
  this.skill_action = () => {
    let object = this.go.selected_clickable
    if (object.acted_by_skill == 'loot') {
      if (_tapete_js__WEBPACK_IMPORTED_MODULE_0__.Vector2.distance(object, this) < object.width + 20) {
        new _behaviors_loot_js__WEBPACK_IMPORTED_MODULE_12__["default"]({ go, entity: this, loot_bag: object }).act()
      }
    }
    if (object && this.skills[object.acted_by_skill]) {
      this.skills[object.acted_by_skill]()
    }
  }

  const near_bonfire = () => this.go.fires.some(fire => _tapete_js__WEBPACK_IMPORTED_MODULE_0__.Vector2.distance(this, fire) < 100);

  this.draw = function () {
    if (this.moving && this.target_movement) this.draw_movement_target()
    this.go.ctx.drawImage(this.image, Math.floor(this.walk_cycle_index) * this.image_width, this.get_direction_sprite() * this.image_height, this.image_width, this.image_height, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
    this.health_bar.draw(this.stats.hp, this.stats.current_hp)
    this.mana_bar.draw(this.stats.mana, this.stats.current_mana)
  }

  this.draw_character = ({ x, y, width, height }) => {
    x = x === undefined ? this.x - this.go.camera.x : x
    y = y === undefined ? this.y - this.go.camera.y : y
    width = width === undefined ? this.width : width
    height = height === undefined ? this.height : height
    this.go.ctx.drawImage(this.image, Math.floor(this.walk_cycle_index) * this.image_width, this.get_direction_sprite() * this.image_height, this.image_width, this.image_height, x, y, width, height)
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
    const future_position = { x: this.x, y: this.y, width: this.width, height: this.height }

    switch (direction) {
      case "right":
        if (this.x + this.speed < this.go.world.width + this.go.world.x_offset) {
          future_position.x += this.speed
        }
        break;
      case "up":
        if (this.y - this.speed > this.go.world.y_offset) {
          future_position.y -= this.speed
        }
        break;
      case "left":
        if (this.x - this.speed > this.go.world.x_offset) {
          future_position.x -= this.speed
        }
        break;
      case "down":
        if (this.y + this.speed < this.go.world.height + this.go.world.y_offset) {
          future_position.y += this.speed
        }
        break;
    }

    if (!this.go.trees.some(tree => ((0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(future_position, tree)))) {
      this.x = future_position.x
      this.y = future_position.y
      this.walk_cycle_index = (this.walk_cycle_index + (0.03 * this.speed)) % 3
      this.go.camera.focus(this)
    }
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
  this.image_width = 32
  this.image_height = 32
  this.image_x_offset = 0
  this.image_y_offset = 0
  this.width = 32
  this.height = 32
  this.resource_bar = null

  this.draw = function (target_position) {
    let x = target_position && target_position.x ? target_position.x : this.x - this.go.camera.x
    let y = target_position && target_position.y ? target_position.y : this.y - this.go.camera.y
    let width = target_position && target_position.width ? target_position.width : this.width
    let height = target_position && target_position.height ? target_position.height : this.height
    this.go.ctx.drawImage(this.image, this.image_x_offset, this.image_y_offset, this.image_width, this.image_height, x, y, width, height)
    if (target_position) return

    if (this.resource_bar) {
      this.resource_bar.draw()
    }
  }

  this.click = function () { }
  this.update_fps = function () {
    if (this.fuel <= 0) {
      remove_object_if_present(this, go.fires)
    } else {
      this.fuel -= 1;
      this.resource_bar.current -= 1;
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Doodad);


/***/ }),

/***/ "./src/editor/index.js":
/*!*****************************!*\
  !*** ./src/editor/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Editor)
/* harmony export */ });
function Editor({ go }) {
    this.go = go
    this.go.editor = this
    this.active = false
    this.right_panel_coords = {
        x: this.go.screen.width - 300,
        y: 0,
        width: 300,
        height: this.go.screen.height
    }

    this.draw = () => {
        if (!this.active) return;

        this.go.ctx.fillStyle = 'white'
        this.go.ctx.fillRect(this.right_panel_coords.x, this.right_panel_coords.y, this.right_panel_coords.width, this.go.screen.height)
        this.go.character.draw_character({
            x: this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (this.go.character.width / 2),
            y: 50,
            width: 50,
            height: 50
        })
        this.go.ctx.fillStyle = 'black'
        this.go.ctx.font = "21px sans-serif"
        let text = `x: ${this.go.character.x.toFixed(2)}, y: ${this.go.character.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (text_measurement.width / 2), this.right_panel_coords.y + 50 + 50 + 20)

        if (this.go.selected_clickable) this.draw_selection();
    }

    this.draw_selection = () => {
        this.go.selected_clickable.draw({
            x: this.right_panel_coords.x + this.right_panel_coords.width / 2 - 35,
            y: this.right_panel_coords.y + 200,
            width: 70,
            height: 70
        })
        let text = `x: ${this.go.selected_clickable.x.toFixed(2)}, y: ${this.go.selected_clickable.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (text_measurement.width / 2), this.right_panel_coords.y + 200 + 100)
    }
}

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
  const callback_queue = setCallback(go, 'mousedown');
  go.mousedown_callbacks = callback_queue
  return callback_queue
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
  this.skills = [];
  this.trees = [];
  this.fires = [];
  this.stones = [];
  this.loot_bags = [];
  this.managed_objects = [] // Random objects to draw/update

  this.draw_objects = () => {
    this.stones.forEach(stone => stone.draw())
    this.trees.forEach(tree => tree.draw())
    this.fires.forEach(fire => fire.draw())
    this.spells.forEach(spell => spell.draw())
    this.skills.forEach(skill => skill.draw())
    this.creeps.forEach(creep => creep.draw())
    this.loot_bags.forEach(loot_bag => loot_bag.draw())
    this.managed_objects.forEach(mob => mob.draw())
  }

  this.update_objects = () => {
    this.spells.forEach(spell => spell.update())
    this.loot_bags.forEach(loot_bag => loot_bag.update())
    this.managed_objects.forEach(mob => mob.update())
  }

  this.update_fps_objects = () => {
    this.fires.forEach(fire => fire.update_fps())
  }

  this.draw_selected_clickable = function () {
    if (this.selected_clickable) {
      this.ctx.save()
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = "yellow"
      this.ctx.strokeStyle = `rgba(255, 255, 0, 0.7)`
      this.ctx.beginPath()
      this.ctx.arc(
        this.selected_clickable.x + (this.selected_clickable.width / 2) - this.camera.x,
        this.selected_clickable.y + (this.selected_clickable.height / 2) - this.camera.y,
        this.selected_clickable.width, 0, 50
      )
      this.ctx.stroke()
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
function Inventory({ go }) {
  this.go = go
  this.max_slots = 12
  this.slots_per_row = 4
  this.slots = []
  this.slot_padding = 10
  this.slot_width = 50
  this.slot_height = 50
  this.initial_x = this.go.screen.width - (this.slots_per_row * this.slot_width) - 50;
  this.initial_y = this.go.screen.height - (this.slots_per_row * this.slot_height) - 400;
  this.active = false;

  this.x = () => {
    const right_panel_width = this.go.editor.active ? this.go.editor.right_panel_coords.width : 0;
    return this.go.screen.width - (this.slots_per_row * this.slot_width) - 50 - right_panel_width;
  }

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

  this.toggle_display = () => {
    this.active = !this.active;
  }

  this.draw = () => {
    if (!this.active) return;

    for (let i = 0; i < this.max_slots; i++) {
      let x = Math.floor(i % 4)
      let y = Math.floor(i / 4);

      if ((this.slots[i] !== undefined) && (this.slots[i] !== null)) {
        const item = this.slots[i];
        this.go.ctx.drawImage(item.image, this.x() + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
        if (item.quantity > 1) {
          let text = item.quantity
          var text_measurement = this.go.ctx.measureText(text)
          this.go.ctx.fillStyle = "white"
          this.go.ctx.font = "24px sans-serif"
          this.go.ctx.fillText(text, this.x() + (this.slot_width * x) + (x * this.slot_padding) + (this.slot_width - 15), this.initial_y + (this.slot_height * y) + (this.slot_padding * y) + (this.slot_height - 5))
          this.go.ctx.strokeStyle = "black"
          this.go.ctx.lineWidth = 1
          this.go.ctx.strokeText(text, this.x() + (this.slot_width * x) + (x * this.slot_padding) + (this.slot_width - 15), this.initial_y + (this.slot_height * y) + (this.slot_padding * y) + (this.slot_height - 5))
        }
      } else {
        this.go.ctx.fillStyle = "rgb(0, 0, 0)"
        this.go.ctx.fillRect(this.x() + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
      }
      this.go.ctx.strokeStyle = "rgb(60, 40, 0)"
      this.go.ctx.strokeRect(this.x() + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
    }
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
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./item */ "./src/item.js");
/* harmony import */ var _loot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loot */ "./src/loot.js");




class LootBox {
    constructor(go) {
        this.visible = false
        this.go = go
        go.loot_box = this
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
        if (this.loot_bag) {
            this.loot_bag.items.splice(loot_index, 1)
        }
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

    roll_loot(loot_table) {
        let result = loot_table.map((loot_entry) => {
            let roll = (0,_tapete__WEBPACK_IMPORTED_MODULE_0__.dice)(100)
            console.log(`*** Loot roll for ${loot_entry.item.name}: ${roll} (chance: ${loot_entry.chance})`)
            if (roll <= loot_entry.chance) {
                const item_bundle = new _item__WEBPACK_IMPORTED_MODULE_1__["default"](loot_entry.item.name)
                item_bundle.image.src = loot_entry.item.image_src
                item_bundle.quantity = (0,_tapete__WEBPACK_IMPORTED_MODULE_0__.random)(loot_entry.min, loot_entry.max)
                return new _loot__WEBPACK_IMPORTED_MODULE_2__["default"](item_bundle, item_bundle.quantity)
            }
        }).filter((entry) => entry !== undefined)
        return result
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LootBox);

/***/ }),

/***/ "./src/node.js":
/*!*********************!*\
  !*** ./src/node.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Node(data) {
  this.id = data.id
  this.x = data.x
  this.y = data.y
  this.width = data.width
  this.height = data.height
  this.colour = "transparent"
  this.border_colour = "black"
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Node);


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
    this.start_position = null
    this.current_position = null
    this.end_position = null
    this.subject = subject
    this.trace_count = 7
    this.bounds = () => {
        return { ...this.current_position, width: 5, height: 5 }
    }
    this.trace = [];
    this.active = false;

    this.act = ({ start_position, end_position }) => {
        this.start_position = start_position
        this.current_position = Object.create(this.start_position)
        this.end_position = end_position
        this.active = true
        this.trace = [];
    }

    this.update = () => {
        if (_tapete_js__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(this.end_position, this.current_position) < 5) {
            this.subject.end();
            this.end();
            return;
        }

        this.calculate_position();
        this.trace.push(Object.create(this.current_position))
        this.trace = this.trace.slice(-1 * this.trace_count)
    }

    this.draw = () => {
        if (!this.active) return;

        this.particle.draw(this.current_position);
        this.trace.forEach(traced_position => this.particle.draw(traced_position))
    }

    this.end = () => {
        this.active = false;
    }

    this.calculate_position = () => {
        const angle = _tapete_js__WEBPACK_IMPORTED_MODULE_1__.Vector2.angle(this.current_position, this.end_position);
        const speed = (0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.random)(3, 12);
        this.current_position = {
            x: this.current_position.x + speed * Math.cos(angle),
            y: this.current_position.y + speed * Math.sin(angle)
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
function ResourceBar({ go, target, y_offset = 10, colour = "red", border, fixed }) {
  this.go = go
  this.target = target
  this.height = this.target.width / 10;
  this.colour = colour
  this.full = 100
  this.current = 100
  this.y_offset = y_offset
  this.border = border
  this.fixed = fixed || false
  this.x = () => {
    if (this.fixed) {
      return this.target.x;
    } else {
      return this.target.x - this.go.camera.x;
    }
  }
  this.y = () => {
    if (this.fixed) {
      return this.target.y;
    } else {
      return this.target.y - this.go.camera.y;
    }
  }

  this.draw = (full = this.full, current = this.current, debug = false) => {
    let bar_width = (((Math.min(current, full)) / full) * this.target.width)
    this.go.ctx.strokeStyle = this.border || "black"
    this.go.ctx.lineWidth = 4
    this.go.ctx.strokeRect(this.x(), this.y() - this.y_offset, this.target.width, this.height)
    this.go.ctx.fillStyle = "black"
    this.go.ctx.fillRect(this.x(), this.y() - this.y_offset, this.target.width, this.height)
    this.go.ctx.fillStyle = this.colour
    this.go.ctx.fillRect(this.x(), this.y() - this.y_offset, bar_width, this.height)
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
  this.radius = 700

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
    var gradient = this.go.ctx.createRadialGradient(x, y, 0, x, y, this.radius);
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

/***/ "./src/skill.js":
/*!**********************!*\
  !*** ./src/skill.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Skill)
/* harmony export */ });
function Skill({ go, entity, skill }) {
    this.go = go
    this.entity = entity
    this.skill = skill

    this.act = () => {
        this.skill.act()
    }
}

/***/ }),

/***/ "./src/skills/break_stone.js":
/*!***********************************!*\
  !*** ./src/skills/break_stone.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ break_stone)
/* harmony export */ });
/* harmony import */ var _casting_bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../casting_bar */ "./src/casting_bar.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");



function break_stone({ go, entity }) {
    this.go = go
    this.entity = entity || go.character
    this.casting_bar = new _casting_bar__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, entity: this.entity })

    this.act = () => {
        const targeted_stone = this.go.stones.find((stone) => stone === this.go.selected_clickable)
        if ((!targeted_stone) || (_tapete__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(targeted_stone, this.entity) > 100)) {
            return;
        }

        this.go.skills.push(this)
        this.casting_bar.start(3000, () => {
            const index = this.go.stones.indexOf(targeted_stone)
            if (index > -1) {
                this.go.loot_box.items = this.go.loot_box.roll_loot(loot_table_stone)
                this.go.loot_box.show()
                ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(targeted_stone, this.go.stones)
                ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_clickable)(targeted_stone, this.go)
                ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.skills)
            }
        })
    }

    let loot_table_stone = [{
        item: { name: "Flintstone", image_src: "flintstone.png" },
        min: 1,
        max: 1,
        chance: 100
    }]

    this.draw = () => {
        this.casting_bar.draw()
    }
}

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
        if ((!targeted_tree) || (_tapete__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(targeted_tree, this.go.character) > 200)) {
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

/***/ "./src/skills/make_fire.js":
/*!*********************************!*\
  !*** ./src/skills/make_fire.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MakeFire)
/* harmony export */ });
/* harmony import */ var _casting_bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../casting_bar */ "./src/casting_bar.js");
/* harmony import */ var _doodad__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../doodad */ "./src/doodad.js");
/* harmony import */ var _resource_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../resource_bar */ "./src/resource_bar.js");
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");





function MakeFire({ go, entity }) {
    this.go = go;
    this.entity = entity || go.character
    this.casting_bar = new _casting_bar__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, entity: this.entity })

    this.act = () => {
        let dry_leaves = this.entity.inventory.find("dry leaves")
        let wood = this.entity.inventory.find("wood")
        let flintstone = this.entity.inventory.find("flintstone")
        if (dry_leaves && dry_leaves.quantity > 0 &&
            wood && wood.quantity > 0 &&
            flintstone && flintstone.quantity > 0) {
            this.casting_bar.start(1500)
            
            this.go.skills.push(this)
            setTimeout(() => {
                dry_leaves.quantity -= 1
                wood.quantity -= 1
                if (this.go.selected_clickable &&
                    this.go.selected_clickable.type === "BONFIRE") {
                    let fire = this.go.fires.find((fire) => this.go.selected_clickable === fire);
                    fire.fuel += 20;
                    fire.resource_bar.current += 20;
                } else {
                    let fire = new _doodad__WEBPACK_IMPORTED_MODULE_1__["default"]({ go })
                    fire.type = "BONFIRE"
                    fire.image.src = "bonfire.png"
                    fire.image_x_offset = 250
                    fire.image_y_offset = 250
                    fire.image_height = 350
                    fire.image_width = 300
                    fire.width = 64
                    fire.height = 64
                    fire.x = this.entity.x;
                    fire.y = this.entity.y;
                    fire.fuel = 20;
                    fire.resource_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_2__["default"]({ go: this.go, target: fire })
                    fire.resource_bar.static = true
                    fire.resource_bar.full = 20;
                    fire.resource_bar.current = 20;
                    this.go.fires.push(fire)
                    this.go.clickables.push(fire)
                    ;(0,_tapete__WEBPACK_IMPORTED_MODULE_3__.remove_object_if_present)(this, this.go.skills)
                }
            }, 1500)
        } else {
            console.log("You dont have all required materials to make a fire.")
        }
    }

    this.draw = () => {
        this.casting_bar.draw()
    }
}

/***/ }),

/***/ "./src/spells/blink.js":
/*!*****************************!*\
  !*** ./src/spells/blink.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Blink)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");


function Blink({ go, entity }) {
    this.id = "spell_blink"
    this.icon = new Image();
    this.icon.src = "blink_spell.jpg"
    this.go = go
    this.entity = entity
    this.active = false
    this.mana_cost = 7
    this.casting_time_in_ms = 0
    this.last_cast_at = null
    this.cooldown_time_in_ms = 7000
    this.on_cooldown = () => {
        return this.last_cast_at && Date.now() - this.last_cast_at < this.cooldown_time_in_ms
    }

    this.is_valid = () => !this.on_cooldown()
    
    this.draw = () => {
        if (!this.active) return

        this.go.ctx.beginPath()
        this.go.ctx.lineWidth = 3;
        this.go.ctx.strokeStyle = 'purple'
        this.go.ctx.arc(this.go.mouse_position.x - this.go.camera.x, this.go.mouse_position.y - this.go.camera.y, 50, 0, Math.PI * 2)
        this.go.ctx.stroke()
    }

    this.update = () => { }

    this.act = () => {
        if (this.active) {
            this.active = false
            ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this, this.go.spells)
            ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(click_callback, this.go.mousedown_callbacks)
        } else {
            this.active = true
            this.go.spells.push(this)
            this.go.mousedown_callbacks.push(click_callback)

        }
    }

    this.end = () => {
        this.active = false
        this.entity.current_mana -= this.mana_cost
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this, this.go.spells)
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(click_callback, this.go.mousedown_callbacks)
        this.last_cast_at = Date.now()
    }

    const click_callback = () => {
        this.entity.x = this.go.mouse_position.x;
        this.entity.y = this.go.mouse_position.y;
        this.end();
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
    this.id = "spell_frostbolt"
    this.go = go
    this.icon = new Image()
    this.icon.src = "https://cdna.artstation.com/p/assets/images/images/009/031/190/large/richard-thomas-paints-11-v2.jpg"
    this.projectile = new _projectile__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, subject: this })
    this.active = false
    this.mana_cost = 15
    this.casting_time_in_ms = 1500
    this.last_cast_at = null
    this.cooldown_time_in_ms = 100
    this.on_cooldown = () => {
        return this.last_cast_at && Date.now() - this.last_cast_at < this.cooldown_time_in_ms
    }

    this.draw = () => {
        if (!this.active) return;
        this.projectile.draw();
    }

    this.draw_slot = (slot) => {
        this.go.ctx.drawImage(this.img, x, y, this.go.action_bar.slot_width, this.go.action_bar.slot_height)
        
    }

    this.update = () => {
        if (!this.active) return

        if (((0,_tapete__WEBPACK_IMPORTED_MODULE_1__.is_colliding)(this.projectile.bounds(), this.go.selected_clickable))) {
            if (damageable(this.go.selected_clickable)) {
                const damage = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(5, 10);
                this.go.selected_clickable.stats.take_damage({ damage });
            }
            this.end();
        } else {
            this.projectile.update()
        }
    }

    this.is_valid = () => !this.on_cooldown() && this.go.selected_clickable && this.go.selected_clickable.stats;

    this.act = () => {
        if (this.active) return;
        if ((this.go.selected_clickable === null) || (this.go.selected_clickable === undefined)) return;

        const start_position = { x: this.go.character.x + 50, y: this.go.character.y + 50 }
        const end_position = {
            x: this.go.selected_clickable.x + this.go.selected_clickable.width / 2,
            y: this.go.selected_clickable.y + this.go.selected_clickable.height / 2
        }
        this.projectile.act({ start_position, end_position })

        this.active = true
        this.go.spells.push(this)
    }

    this.end = () => {
        this.active = false;
        (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.spells);
        this.last_cast_at = Date.now()
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


// The World is responsible for drawing itself.
function World(go) {
  this.go = go;
  this.go.world = this;
  this.width = 10000;
  this.height = 10000;
  this.x_offset = 0;
  this.y_offset = 0;
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
            this.x_offset + (row * this.tile_width) - this.go.camera.x,
            this.y_offset + (column * this.tile_height) - this.go.camera.y, 64, 63)
        }
        this.go.ctx.drawImage(tile.image,
          tile.x_offset, tile.y_offset, tile.width, tile.height,
          this.x_offset + (row * this.tile_width) - this.go.camera.x,
          this.y_offset + (column * this.tile_height) - this.go.camera.y, 65, 65)
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
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./server */ "./src/server.js");
/* harmony import */ var _loot_box_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./loot_box.js */ "./src/loot_box.js");
/* harmony import */ var _beings_creep_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./beings/creep.js */ "./src/beings/creep.js");
/* harmony import */ var _action_bar_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./action_bar.js */ "./src/action_bar.js");
/* harmony import */ var _beings_stone_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./beings/stone.js */ "./src/beings/stone.js");
/* harmony import */ var _beings_tree_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./beings/tree.js */ "./src/beings/tree.js");
/* harmony import */ var _editor_index_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./editor/index.js */ "./src/editor/index.js");
/* harmony import */ var _resource_bar_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./resource_bar.js */ "./src/resource_bar.js");




















const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
const character = new _character_js__WEBPACK_IMPORTED_MODULE_3__["default"](go)
const keyboard_input = new _keyboard_input_js__WEBPACK_IMPORTED_MODULE_4__["default"](go)
const world = new _world_js__WEBPACK_IMPORTED_MODULE_8__["default"](go)
const controls = new _controls_js__WEBPACK_IMPORTED_MODULE_10__["default"](go)
const server = new _server__WEBPACK_IMPORTED_MODULE_11__["default"](go)
const loot_box = new _loot_box_js__WEBPACK_IMPORTED_MODULE_12__["default"](go)
const action_bar = new _action_bar_js__WEBPACK_IMPORTED_MODULE_14__["default"](go)
const editor = new _editor_index_js__WEBPACK_IMPORTED_MODULE_17__["default"]({ go })
const experience_bar = new _resource_bar_js__WEBPACK_IMPORTED_MODULE_18__["default"]({ go, target: { x: go.screen.width / 2 - 500, y: go.screen.height - 30, width: 1000, height: 5 }, colour: "purple", border: "white", fixed: true });
experience_bar.height = 30

// Disable right mouse click
go.canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }

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
go.mouse_position = {}
const mousemove_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMouseMoveCallback)(go)
mousemove_callbacks.push(track_mouse_position)
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  go.mouse_position = {
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


keyboard_input.on_keydown_callbacks.f = [character.skill_action]
keyboard_input.on_keydown_callbacks[0] = [character.skills.make_fire]
keyboard_input.on_keydown_callbacks[1] = [character.spells.frostbolt]
keyboard_input.on_keydown_callbacks[2] = [character.spells.blink]
keyboard_input.on_keydown_callbacks.i = [character.inventory.toggle_display]
keyboard_input.on_keydown_callbacks.b = [character.board.toggle_grid]
keyboard_input.on_keydown_callbacks.e = [() => editor.active = !editor.active]
//keyboard_input.on_keydown_callbacks.p = [board.way_to_player]

let elapsed_time = 0
let last_tick = Date.now()
let frames = 0;
const update = () => {
  frames += 1;
  elapsed_time = Date.now() - last_tick
  if ((elapsed_time) > 1000) {
    frames = 0;
    last_tick = Date.now()
    update_fps()
  }
  if (!character.stats.is_alive()) {
    controls_movement()
  } else {
    go.update_objects()
  }
}

function update_fps() {
  if (character.stats.is_alive()) {
    character.update_fps()
  }
  go.update_fps_objects()
}
// Comment
const draw = () => {
  if (character.stats.is_dead()) {
    screen.draw_game_over()
  } else {
    screen.draw()
    go.draw_selected_clickable()
    go.draw_objects()
    character.draw()
    screen.draw_fog()
    loot_box.draw()
    go.character.inventory.draw()
    action_bar.draw()
    character.board.draw()
    editor.draw()
    experience_bar.draw(1000, go.character.experience_points)
    if (show_control_wheel) draw_control_wheel()
  }
} 

// Trees
Array.from(Array(300)).forEach((j, i) => {
  let tree = new _beings_tree_js__WEBPACK_IMPORTED_MODULE_16__["default"]({ go })
  go.trees.push(tree)
  go.clickables.push(tree)
})
// Stones
Array.from(Array(300)).forEach((j, i) => {
  const stone = new _beings_stone_js__WEBPACK_IMPORTED_MODULE_15__["default"]({ go });
  go.stones.push(stone)
  go.clickables.push(stone)
})
// Creep
for (let i = 0; i < 50; i++) {
  let creep = new _beings_creep_js__WEBPACK_IMPORTED_MODULE_13__["default"]({ go });
  go.clickables.push(creep);
}
const dummy = new _beings_creep_js__WEBPACK_IMPORTED_MODULE_13__["default"]({ go })
dummy.x = 800;
dummy.y = 200;
go.clickables.push(dummy)

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

const game_loop = new _game_loop_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down
game_loop.update = update

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHdEQUFnQixpQkFBaUIsd0RBQWdCO0FBQzVELEdBQUc7QUFDSCxNQUFNLHdEQUFnQjs7QUFFdEI7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDOztBQUVBLHNCQUFzQixxREFBUTtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hY3Rpb25fYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL2FnZ3JvLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbW92ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvbG9vdF9iYWcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3Mvc3RvbmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JvYXJkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FzdGluZ19iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jbGlja2FibGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jb250cm9scy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Rvb2RhZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2VkaXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2V2ZW50c19jYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX2xvb3AuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2l0ZW0uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9rZXlib2FyZF9pbnB1dC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290X2JveC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Byb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9icmVha19zdG9uZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9jdXRfdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9tYWtlX2ZpcmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvYmxpbmsuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvZnJvc3Rib2x0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZVwiO1xuXG5mdW5jdGlvbiBBY3Rpb25CYXIoZ2FtZV9vYmplY3QpIHtcbiAgdGhpcy5nYW1lX29iamVjdCA9IGdhbWVfb2JqZWN0XG4gIHRoaXMuZ2FtZV9vYmplY3QuYWN0aW9uX2JhciA9IHRoaXNcbiAgdGhpcy5udW1iZXJfb2Zfc2xvdHMgPSAxMFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gdGhpcy5nYW1lX29iamVjdC50aWxlX3NpemUgKiAzO1xuICB0aGlzLnNsb3Rfd2lkdGggPSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDM7XG4gIHRoaXMueV9vZmZzZXQgPSAxMDBcbiAgdGhpcy5hY3Rpb25fYmFyX3dpZHRoID0gdGhpcy5udW1iZXJfb2Zfc2xvdHMgKiB0aGlzLnNsb3Rfd2lkdGhcbiAgdGhpcy5hY3Rpb25fYmFyX2hlaWdodCA9IHRoaXMubnVtYmVyX29mX3Nsb3RzICogdGhpcy5zbG90X2hlaWdodFxuICB0aGlzLmFjdGlvbl9iYXJfeCA9ICh0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LndpZHRoIC8gMikgLSAodGhpcy5hY3Rpb25fYmFyX3dpZHRoIC8gMilcbiAgdGhpcy5hY3Rpb25fYmFyX3kgPSB0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LmhlaWdodCAtIHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogNCAtIHRoaXMueV9vZmZzZXRcblxuICAvLyBjaGFyYWN0ZXItc3BlY2lmaWNcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuc2xvdF9zaXplID0gMTBcbiAgdGhpcy5zbG90c1swXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5mcm9zdGJvbHRcbiAgdGhpcy5zbG90c1sxXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5ibGlua1xuICAvLyBFTkQgLS0gY2hhcmFjdGVyLXNwZWNpZmljXG5cbiAgdGhpcy5oaWdobGlnaHRzID0gW11cblxuICBmdW5jdGlvbiBTbG90KHsgc3BlbGwsIHgsIHkgfSkge1xuICAgIHRoaXMuc3BlbGwgPSBzcGVsbFxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIHRoaXMuaGlnaGxpZ2h0X2Nhc3QgPSAoc3BlbGwpID0+IHtcbiAgICB0aGlzLmhpZ2hsaWdodHMucHVzaChzcGVsbClcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzbG90X2luZGV4ID0gMDsgc2xvdF9pbmRleCA8PSB0aGlzLnNsb3Rfc2l6ZTsgc2xvdF9pbmRleCsrKSB7XG4gICAgICB2YXIgc2xvdCA9IHRoaXMuc2xvdHNbc2xvdF9pbmRleF07XG5cbiAgICAgIHZhciB4ID0gdGhpcy5hY3Rpb25fYmFyX3ggKyAodGhpcy5zbG90X3dpZHRoICogc2xvdF9pbmRleClcbiAgICAgIHZhciB5ID0gdGhpcy5hY3Rpb25fYmFyX3lcblxuICAgICAgaWYgKHNsb3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSBcInJnYmEoNDYsIDQ2LCA0NiwgMSlcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZXZpb2xldFwiXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgICAgeCwgeSxcbiAgICAgICAgICB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHRcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5kcmF3SW1hZ2Uoc2xvdC5pY29uLCB4LCB5LCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlU3R5bGUgPSBcImJsdWV2aW9sZXRcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0XG4gICAgICAgIClcblxuICAgICAgICAvLyBIaWdobGlnaHQ6IHRoZSBhY3Rpb24gYmFyIFwiYmxpbmtzXCIgZm9yIGEgZnJhbWUgd2hlbiB0aGUgc3BlbGwgaXMgY2FzdFxuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRzLmZpbmQoKHNwZWxsKSA9PiBzcGVsbC5pZCA9PT0gc2xvdC5pZCkpIHtcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChzbG90LCB0aGlzLmhpZ2hsaWdodHMpXG4gICAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpJ1xuICAgICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvb2xkb3duIGluZGljYXRvclxuICAgICAgICBpZiAoc2xvdC5vbl9jb29sZG93bigpKSB7XG4gICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAxIC0gKChub3cgLSBzbG90Lmxhc3RfY2FzdF9hdCkgLyBzbG90LmNvb2xkb3duX3RpbWVfaW5fbXMpXG4gICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcbiAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdCh4LCB5LCB0aGlzLnNsb3Rfd2lkdGggKiBwZXJjZW50YWdlLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBY3Rpb25CYXJcbiIsImltcG9ydCBCb2FyZCBmcm9tIFwiLi4vYm9hcmRcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5pbXBvcnQgeyBNb3ZlIH0gZnJvbSBcIi4vbW92ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFnZ3JvKHsgZ28sIGVudGl0eSwgcmFkaXVzID0gMjAgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXNcbiAgICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHsgZ28sIGVudGl0eSwgcmFkaXVzOiBNYXRoLmZsb29yKHRoaXMucmFkaXVzIC8gdGhpcy5nby50aWxlX3NpemUpIH0pXG4gICAgdGhpcy5tb3ZlID0gbmV3IE1vdmUoeyBnbywgZW50aXR5LCB0YXJnZXRfcG9zaXRpb246IHRoaXMuZ28uY2hhcmFjdGVyIH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmdvLmNoYXJhY3RlciwgZW50aXR5KVxuICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLnJhZGl1cykge1xuICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgKHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMikgKyAodGhpcy5lbnRpdHkud2lkdGggLyAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LnN0YXRzLmF0dGFjayh0aGlzLmdvLmNoYXJhY3RlcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlLmFjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3BhdGggPSAoKSA9PiB7XG5cbiAgICB9XG5cbiAgICBjb25zdCBuZWlnaGJvcl9wb3NpdGlvbnMgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmVudGl0eS54LFxuICAgICAgICAgICAgeTogdGhpcy5lbnRpdHkueSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVudGl0eS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbnRpdHkuaGVpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZWZ0ID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB4OiB0aGlzLmVudGl0eS54IC09IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgcmlnaHQgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHg6IHRoaXMuZW50aXR5LnggKz0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCB1cCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeTogdGhpcy5lbnRpdHkueSAtPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IGRvd24gPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHk6IHRoaXMuZW50aXR5LnkgKz0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgIH1cbn0gIiwiaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4uL2xvb3RfYm94XCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9vdCh7IGdvLCBlbnRpdHksIGxvb3RfYmFnIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMubG9vdF9iYWcgPSBsb290X2JhZ1xuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxvb3RfYmFnLml0ZW1zID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmxvb3RfYmFnLml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QodGhpcy5sb290X2JhZy5lbnRpdHkubG9vdF90YWJsZSlcbiAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3gubG9vdF9iYWcgPSB0aGlzLmxvb3RfYmFnXG4gICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5sb290X2JhZy5pdGVtc1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvcjIsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gICAgY29uc3RydWN0b3IoeyBnbywgZW50aXR5LCBzcGVlZCA9IDEsIHRhcmdldF9wb3NpdGlvbiB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgdGhpcy50YXJnZXRfcG9zaXRpb24gPSB0YXJnZXRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5icHMgPSAwO1xuICAgICAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMucGF0aCA9IG51bGxcbiAgICAgICAgdGhpcy5uZXh0X3BhdGhfaW5kZXggPSBudWxsXG4gICAgfVxuXG4gICAgYWN0ID0gKCkgPT4ge1xuICAgICAgICAvLyB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgICAgICAvLyBpZiAoKHRoaXMuYnBzKSA+PSA4MDApIHtcbiAgICAgICAgLy8gICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgIC8vICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgLy8gICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZHJhdygpXG4gICAgICAgIC8vaWYgKHRoaXMucGF0aCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGF0aFt0aGlzLm5leHRfcGF0aF9pbmRleF0gPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIC8vY29uc3QgdGFyZ2V0ZWRfcG9zaXRpb24gPSB0aGlzLnBhdGhbdGhpcy5uZXh0X3BhdGhfaW5kZXhdXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3Bvc2l0aW9uID0geyAuLi50aGlzLnRhcmdldF9wb3NpdGlvbiB9XG4gICAgICAgIGNvbnN0IG5leHRfc3RlcCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LnggKyB0aGlzLnNwZWVkICogTWF0aC5jb3MoVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnkgKyB0aGlzLnNwZWVkICogTWF0aC5zaW4oVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVudGl0eS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbnRpdHkuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdvLnRyZWVzLnNvbWUodHJlZSA9PiAoaXNfY29sbGlkaW5nKG5leHRfc3RlcCwgdHJlZSkpKSkge1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkueCA9IG5leHRfc3RlcC54XG4gICAgICAgICAgICB0aGlzLmVudGl0eS55ID0gbmV4dF9zdGVwLnlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaG1tbS4uLiB3aGVyZSB0bz9cIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZWRpY3RfbW92ZW1lbnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgICAgIGlmICgodGhpcy5icHMpID49IDMwMDApIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2Jhci5qc1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eSwgc3BlbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5zcGVsbCA9IHNwZWxsXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSA+IHRoaXMuc3BlbGwubWFuYV9jb3N0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgLT0gdGhpcy5zcGVsbC5tYW5hX2Nvc3RcbiAgICAgICAgICAgIHRoaXMuc3BlbGwuYWN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2FzdCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5hY3Rpb25fYmFyLmhpZ2hsaWdodF9jYXN0KHRoaXMuc3BlbGwpO1xuICAgICAgICBpZiAoIXRoaXMuc3BlbGwuaXNfdmFsaWQoKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNwZWxsLmNhc3RpbmdfdGltZV9pbl9tcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FzdGluZ19iYXIuZHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0b3AoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgPiB0aGlzLnNwZWxsLm1hbmFfY29zdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cy5wdXNoKHRoaXMpXG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCh0aGlzLnNwZWxsLmNhc3RpbmdfdGltZV9pbl9tcywgdGhpcy5lbmQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZCgpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IExvb3RCYWcgZnJvbSBcIi4uL2JlaW5ncy9sb290X2JhZ1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdGF0cyh7IGdvLCBlbnRpdHksIGhwID0gMTAwLCBjdXJyZW50X2hwLCBtYW5hLCBjdXJyZW50X21hbmEgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5ocCA9IGhwIHx8IDEwMFxuICAgIHRoaXMuY3VycmVudF9ocCA9IGN1cnJlbnRfaHAgfHwgaHBcbiAgICB0aGlzLm1hbmEgPSBtYW5hXG4gICAgdGhpcy5jdXJyZW50X21hbmEgPSBjdXJyZW50X21hbmEgfHwgbWFuYVxuICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBudWxsO1xuICAgIHRoaXMuYXR0YWNrX3NwZWVkID0gMTAwMDtcblxuICAgIHRoaXMuaGFzX21hbmEgPSAoKSA9PiB0aGlzLm1hbmEgPT09IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzX2RlYWQgPSAoKSA9PiB0aGlzLmN1cnJlbnRfaHAgPD0gMDtcbiAgICB0aGlzLmlzX2FsaXZlID0gKCkgPT4gIXRoaXMuaXNfZGVhZCgpO1xuICAgIHRoaXMudGFrZV9kYW1hZ2UgPSAoeyBkYW1hZ2UgfSkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRfaHAgLT0gZGFtYWdlO1xuICAgICAgICBpZiAodGhpcy5pc19kZWFkKCkpIHRoaXMuZGllKClcbiAgICB9XG4gICAgdGhpcy5kaWUgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jcmVlcHMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY3JlZXBzXCIpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jbGlja2FibGVzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNsaWNrYWJsZXNcIilcbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB0aGlzLmVudGl0eSkgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsO1xuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci51cGRhdGVfeHAodGhpcy5lbnRpdHkpXG4gICAgICAgIGlmICh0aGlzLmVudGl0eS5sb290X3RhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9iYWdzLnB1c2gobmV3IExvb3RCYWcoeyBnbzogdGhpcy5nbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KSlcbiAgICAgICAgICAgIC8vIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmVudGl0eS5sb290X3RhYmxlKVxuICAgICAgICAgICAgLy8gdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubGFzdF9hdHRhY2tfYXQgPT09IG51bGwgfHwgKHRoaXMubGFzdF9hdHRhY2tfYXQgKyB0aGlzLmF0dGFja19zcGVlZCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSByYW5kb20oNSwgMTIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKiAke3RoaXMuZW50aXR5Lm5hbWV9IGF0dGFja3MgJHt0YXJnZXQubmFtZX06ICR7ZGFtYWdlfSBkYW1hZ2VgKVxuICAgICAgICAgICAgdGFyZ2V0LnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlOiBkYW1hZ2UgfSlcbiAgICAgICAgICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBEYXRlLm5vdygpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IEFnZ3JvIGZyb20gXCIuLi9iZWhhdmlvcnMvYWdncm8uanNcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuXG5mdW5jdGlvbiBDcmVlcCh7IGdvIH0pIHtcbiAgaWYgKGdvLmNyZWVwcyA9PT0gdW5kZWZpbmVkKSBnby5jcmVlcHMgPSBbXVxuICB0aGlzLmlkID0gZ28uY3JlZXBzLmxlbmd0aFxuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jcmVlcHMucHVzaCh0aGlzKVxuICB0aGlzLm5hbWUgPSBgQ3JlZXAgJHt0aGlzLmlkfWBcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJ6ZXJnbGluZy5wbmdcIiAvLyBwbGFjZWhvbGRlciBpbWFnZVxuICB0aGlzLmltYWdlX3dpZHRoID0gMTUwXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTUwXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKVxuICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDRcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDRcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IG51bGxcbiAgdGhpcy5zcGVlZCA9IDJcbiAgLy90aGlzLm1vdmVtZW50X2JvYXJkID0gdGhpcy5nby5ib2FyZC5ncmlkXG4gIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBudWxsXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKHsgZ28sIGVudGl0eTogdGhpcywgaHA6IDIwIH0pO1xuICAvLyBCZWhhdmlvdXJzXG4gIHRoaXMuYWdncm8gPSBuZXcgQWdncm8oeyBnbywgZW50aXR5OiB0aGlzLCByYWRpdXM6IDUwMCB9KTtcbiAgLy8gRU5EIC0gQmVoYXZpb3Vyc1xuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh0YXJnZXRfcG9zaXRpb24pIHtcbiAgICBsZXQgeCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueCA/IHRhcmdldF9wb3NpdGlvbi54IDogdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgIGxldCB5ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi55ID8gdGFyZ2V0X3Bvc2l0aW9uLnkgOiB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgbGV0IHdpZHRoID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi53aWR0aCA/IHRhcmdldF9wb3NpdGlvbi53aWR0aCA6IHRoaXMud2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgPyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAgaWYgKHRhcmdldF9wb3NpdGlvbikgcmV0dXJuXG5cbiAgICB0aGlzLmFnZ3JvLmFjdCgpO1xuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgfVxuXG4gIHRoaXMuc2V0X21vdmVtZW50X3RhcmdldCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBub2RlXG4gIH1cblxuICB0aGlzLm1vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpIHtcbiAgICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubG9vdF90YWJsZSA9IFt7XG4gICAgaXRlbTogeyBuYW1lOiBcIldvb2RcIiwgaW1hZ2Vfc3JjOiBcImJyYW5jaC5wbmdcIiB9LFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDMsXG4gICAgY2hhbmNlOiA5NVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDcmVlcFxuIiwiaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb290QmFnKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5fX3Byb3RvX18gPSBuZXcgRG9vZGFkKHsgZ28gfSlcblxuICAgIHRoaXMuaWQgPSBgbG9vdF9iYWdgXG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnggPSBlbnRpdHkueFxuICAgIHRoaXMueSA9IGVudGl0eS55XG4gICAgdGhpcy53aWR0aCA9IDUwXG4gICAgdGhpcy5oZWlnaHQgPSA1MFxuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gJ2JhY2twYWNrLnBuZydcbiAgICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaCh0aGlzKTtcbiAgICB0aGlzLml0ZW1zID0gbnVsbFxuICAgIHRoaXMuYWN0ZWRfYnlfc2tpbGwgPSAnbG9vdCdcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIDEwMDAsIDEwMDAsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uY2xpY2thYmxlcylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLmxvb3RfYmFncylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlX2ZwcyA9ICgpID0+IHt9XG59IiwiaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCI7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b25lKHsgZ28gfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmltYWdlLnNyYyA9IFwiZmxpbnRzdG9uZS5wbmdcIlxuICAgIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKTtcbiAgICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpO1xuICAgIHRoaXMuaW1hZ2Vfd2lkdGggPSA4NDBcbiAgICB0aGlzLmltYWdlX2hlaWdodCA9IDg1OVxuICAgIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gICAgdGhpcy5pbWFnZV95X29mZnNldCA9IDBcbiAgICB0aGlzLndpZHRoID0gMzJcbiAgICB0aGlzLmhlaWdodCA9IDMyXG4gICAgdGhpcy5hY3RlZF9ieV9za2lsbCA9ICdicmVha19zdG9uZSdcbn0iLCJpbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVHJlZSh7IGdvIH0pIHtcbiAgICB0aGlzLl9fcHJvdG9fXyA9IG5ldyBEb29kYWQoeyBnbyB9KVxuXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBcInBsYW50cy5wbmdcIlxuICAgIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKTtcbiAgICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpO1xuICAgIHRoaXMuaW1hZ2Vfd2lkdGggPSA5OFxuICAgIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAxMjdcbiAgICB0aGlzLmltYWdlX2hlaWdodCA9IDEyNlxuICAgIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAyOTBcbiAgICB0aGlzLndpZHRoID0gOThcbiAgICB0aGlzLmhlaWdodCA9IDEyNlxuICAgIHRoaXMuYWN0ZWRfYnlfc2tpbGwgPSBcImN1dF90cmVlXCJcbn0iLCJpbXBvcnQgTm9kZSBmcm9tIFwiLi9ub2RlLmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiwgcmFuZG9tLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuXG4vLyBBIGdyaWQgb2YgdGlsZXMgZm9yIHRoZSBtYW5pcHVsYXRpb25cbmZ1bmN0aW9uIEJvYXJkKHsgZ28sIGVudGl0eSwgcmFkaXVzIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uYm9hcmQgPSB0aGlzXG4gIHRoaXMudGlsZV9zaXplID0gdGhpcy5nby50aWxlX3NpemVcbiAgdGhpcy5ncmlkID0gW1tdXVxuICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyXG4gIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gIHRoaXMuc2hvdWxkX2RyYXcgPSBmYWxzZVxuXG4gIHRoaXMudG9nZ2xlX2dyaWQgPSAoKSA9PiB7XG4gICAgdGhpcy5zaG91bGRfZHJhdyA9ICF0aGlzLnNob3VsZF9kcmF3XG4gICAgaWYgKHRoaXMuc2hvdWxkX2RyYXcpIHRoaXMuYnVpbGRfZ3JpZCgpXG4gIH1cblxuICB0aGlzLmJwcyA9IDA7XG4gIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKTtcblxuICB0aGlzLmJ1aWxkX2dyaWQgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJidWlsZGluZyBncmlkXCIpXG4gICAgdGhpcy5icHMgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpY2tcbiAgICBpZiAoKHRoaXMuYnBzKSA8IDEwMDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5ncmlkID0gbmV3IEFycmF5KHRoaXMud2lkdGgpXG5cbiAgICBjb25zdCB4X3Bvc2l0aW9uID0gTWF0aC5mbG9vcih0aGlzLmVudGl0eS54ICsgdGhpcy5lbnRpdHkud2lkdGggLyAyKVxuICAgIGNvbnN0IHlfcG9zaXRpb24gPSBNYXRoLmZsb29yKHRoaXMuZW50aXR5LnkgKyB0aGlzLmVudGl0eS5oZWlnaHQgLyAyKVxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgIHRoaXMuZ3JpZFt4XSA9IG5ldyBBcnJheSh0aGlzLmhlaWdodClcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoe1xuICAgICAgICAgIHg6ICh4X3Bvc2l0aW9uIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpICsgeCAqIHRoaXMudGlsZV9zaXplKSxcbiAgICAgICAgICB5OiAoeV9wb3NpdGlvbiAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSArIHkgKiB0aGlzLnRpbGVfc2l6ZSksXG4gICAgICAgICAgd2lkdGg6IHRoaXMudGlsZV9zaXplLFxuICAgICAgICAgIGhlaWdodDogdGhpcy50aWxlX3NpemUsXG4gICAgICAgICAgZzogSW5maW5pdHksIC8vIENvc3Qgc28gZmFyXG4gICAgICAgICAgZjogSW5maW5pdHksIC8vIENvc3QgZnJvbSBoZXJlIHRvIHRhcmdldFxuICAgICAgICAgIGg6IG51bGwsIC8vXG4gICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgICAgIGJvcmRlcl9jb2xvdXI6IFwiYmxhY2tcIlxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdvLnRyZWVzLmZvckVhY2godHJlZSA9PiB7XG4gICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhub2RlLCB0cmVlKSkge1xuICAgICAgICAgICAgbm9kZS5jb2xvdXIgPSAncmVkJztcbiAgICAgICAgICAgIG5vZGUuYmxvY2tlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZ3JpZFt4XVt5XSA9IG5vZGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLndheV90b19wbGF5ZXIgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgICB0aGlzLmZpbmRfcGF0aCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSwgdGhpcy5nby5jaGFyYWN0ZXIpXG4gICAgfVxuICB9XG5cbiAgLy8gQSogSW1wbGVtZW50YXRpb25cbiAgLy8gZjogQ29zdCBvZiB0aGUgZW50aXJlIHRyYXZlbCAoc3VtIG9mIGcgKyBoKVxuICAvLyBnOiBDb3N0IGZyb20gc3RhcnRfbm9kZSB0aWxsIG5vZGUgKHRyYXZlbCBjb3N0KVxuICAvLyBoOiBDb3N0IGZyb20gbm9kZSB0aWxsIGVuZF9ub2RlIChsZWZ0b3ZlciBjb3N0KVxuICAvLyBBZGQgdGhlIGN1cnJlbnQgbm9kZSBpbiBhIGxpc3RcbiAgLy8gUG9wIHRoZSBvbmUgd2hvc2UgZiBpcyB0aGUgbG93ZXN0YVxuICAvLyBBZGQgdG8gYSBsaXN0IG9mIGFscmVhZHktdmlzaXRlZCAoY2xvc2VkKVxuICAvLyBWaXNpdCBhbGwgaXRzIG5laWdoYm91cnNcbiAgLy8gVXBkYXRlIGZvciBlYWNoOiB0aGUgdHJhdmVsIGNvc3QgKGcpIHlvdSBtYW5hZ2VkIHRvIGRvIGFuZCB5b3Vyc2VsZiBhcyBwYXJlbnRcbiAgLy8vLyBTbyB0aGF0IHdlIGNhbiByZXRyYWNlIGhvdyB3ZSBnb3QgaGVyZVxuICB0aGlzLmZpbmRfcGF0aCA9IChzdGFydF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiB7XG4gICAgdGhpcy5idWlsZF9ncmlkKClcbiAgICBjb25zdCBzdGFydF9ub2RlID0gdGhpcy5nZXRfbm9kZV9mb3Ioc3RhcnRfcG9zaXRpb24pO1xuICAgIGNvbnN0IGVuZF9ub2RlID0gdGhpcy5nZXRfbm9kZV9mb3IoZW5kX3Bvc2l0aW9uKTtcbiAgICBpZiAoIXN0YXJ0X25vZGUgfHwgIWVuZF9ub2RlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vZGVzIG5vdCBtYXRjaGVkXCIpXG4gICAgICBkZWJ1Z2dlclxuICAgIH1cblxuICAgIHN0YXJ0X25vZGUuY29sb3VyID0gJ29yYW5nZSdcbiAgICBlbmRfbm9kZS5jb2xvdXIgPSAnb3JhbmdlJ1xuXG4gICAgY29uc3Qgb3Blbl9zZXQgPSBbc3RhcnRfbm9kZV07XG4gICAgY29uc3QgY2xvc2VkX3NldCA9IFtdO1xuXG4gICAgY29uc3QgY29zdCA9IChub2RlX2EsIG5vZGVfYikgPT4ge1xuICAgICAgY29uc3QgZHggPSBub2RlX2EueCAtIG5vZGVfYi54O1xuICAgICAgY29uc3QgZHkgPSBub2RlX2EueSAtIG5vZGVfYi55O1xuICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgfVxuXG4gICAgc3RhcnRfbm9kZS5nID0gMDtcbiAgICBzdGFydF9ub2RlLmYgPSBjb3N0KHN0YXJ0X25vZGUsIGVuZF9ub2RlKTtcblxuICAgIHdoaWxlIChvcGVuX3NldC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjdXJyZW50X25vZGUgPSBvcGVuX3NldC5zb3J0KChhLCBiKSA9PiAoYS5mIDwgYi5mID8gLTEgOiAxKSlbMF0gLy8gR2V0IHRoZSBub2RlIHdpdGggbG93ZXN0IGYgdmFsdWUgaW4gdGhlIG9wZW4gc2V0XG4gICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoY3VycmVudF9ub2RlLCBvcGVuX3NldClcbiAgICAgIGNsb3NlZF9zZXQucHVzaChjdXJyZW50X25vZGUpXG4gICAgICBcbiAgICAgIGlmIChjdXJyZW50X25vZGUgPT09IGVuZF9ub2RlKSB7XG4gICAgICAgIGxldCBjdXJyZW50ID0gY3VycmVudF9ub2RlO1xuICAgICAgICBsZXQgcGF0aCA9IFtdO1xuICAgICAgICB3aGlsZSAoY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgICBjdXJyZW50LmNvbG91ciA9ICdwdXJwbGUnXG4gICAgICAgICAgcGF0aC5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMubmVpZ2hib3VycyhjdXJyZW50X25vZGUpLmZvckVhY2gobmVpZ2hib3VyX25vZGUgPT4ge1xuICAgICAgICBpZiAoIW5laWdoYm91cl9ub2RlLmJsb2NrZWQgJiYgIWNsb3NlZF9zZXQuaW5jbHVkZXMobmVpZ2hib3VyX25vZGUpKSB7XG4gICAgICAgICAgbGV0IGdfdXNlZCA9IGN1cnJlbnRfbm9kZS5nICsgY29zdChjdXJyZW50X25vZGUsIG5laWdoYm91cl9ub2RlKVxuICAgICAgICAgIGxldCBiZXN0X2cgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIW9wZW5fc2V0LmluY2x1ZGVzKG5laWdoYm91cl9ub2RlKSkge1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuaCA9IGNvc3QobmVpZ2hib3VyX25vZGUsIGVuZF9ub2RlKVxuICAgICAgICAgICAgb3Blbl9zZXQucHVzaChuZWlnaGJvdXJfbm9kZSlcbiAgICAgICAgICAgIGJlc3RfZyA9IHRydWVcbiAgICAgICAgICB9IGVsc2UgaWYgKGdfdXNlZCA8IG5laWdoYm91cl9ub2RlLmcpIHtcbiAgICAgICAgICAgIGJlc3RfZyA9IHRydWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmVzdF9nKSB7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5wYXJlbnQgPSBjdXJyZW50X25vZGU7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5nID0gZ191c2VkXG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5mID0gbmVpZ2hib3VyX25vZGUuZyArIG5laWdoYm91cl9ub2RlLmhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdGhpcy5uZWlnaGJvdXJzID0gKG5vZGUpID0+IHsgLy8gNSw1XG4gICAgY29uc3QgeF9vZmZzZXQgPSAoTWF0aC5mbG9vcih0aGlzLmVudGl0eS54ICsgdGhpcy5lbnRpdHkud2lkdGggLyAyKSAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSlcbiAgICBjb25zdCB5X29mZnNldCA9IChNYXRoLmZsb29yKHRoaXMuZW50aXR5LnkgKyB0aGlzLmVudGl0eS5oZWlnaHQgLyAyKSAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSlcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigobm9kZS54IC0geF9vZmZzZXQpIC8gdGhpcy50aWxlX3NpemUpXG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoKG5vZGUueSAtIHlfb2Zmc2V0KSAvIHRoaXMudGlsZV9zaXplKVxuXG4gICAgZnVuY3Rpb24gZmV0Y2hfZ3JpZF9jZWxsKGdyaWQsIGx4LCBseSkge1xuICAgICAgcmV0dXJuIGdyaWRbbHhdICYmIGdyaWRbbHhdW2x5XVxuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4LCB5IC0gMSksIC8vIHRvcFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkgLSAxKSwgLy8gdG9wIGxlZnRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5IC0gMSksIC8vIHRvcCByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCwgeSArIDEpLCAvLyBib3R0b21cbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5ICsgMSksIC8vIGJvdHRvbSBsZWZ0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSArIDEpLCAvLyBib3R0b20gcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5KSwgLy8gcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5KSAvLyBsZWZ0XG4gICAgXS5maWx0ZXIobm9kZSA9PiBub2RlICE9PSB1bmRlZmluZWQpXG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnNob3VsZF9kcmF3KSByZXR1cm5cblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmdyaWRbeF1beV07XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IFwiMVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gbm9kZS5ib3JkZXJfY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IG5vZGUuY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KG5vZGUueCAtIHRoaXMuZ28uY2FtZXJhLngsIG5vZGUueSAtIHRoaXMuZ28uY2FtZXJhLnksIG5vZGUud2lkdGgsIG5vZGUuaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KG5vZGUueCAtIHRoaXMuZ28uY2FtZXJhLngsIG5vZGUueSAtIHRoaXMuZ28uY2FtZXJhLnksIG5vZGUud2lkdGgsIG5vZGUuaGVpZ2h0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYnVpbGRfZ3JpZCgpXG4gIH1cblxuICAvLyBSZWNlaXZlcyBhIHJlY3QgYW5kIHJldHVybnMgaXQncyBmaXJzdCBjb2xsaWRpbmcgTm9kZVxuICB0aGlzLmdldF9ub2RlX2ZvciA9IChyZWN0KSA9PiB7XG4gICAgaWYgKHJlY3Qud2lkdGggPT0gdW5kZWZpbmVkKSByZWN0LndpZHRoID0gMVxuICAgIGlmIChyZWN0LmhlaWdodCA9PSB1bmRlZmluZWQpIHJlY3QuaGVpZ2h0ID0gMVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgaWYgKCh0aGlzLmdyaWRbeF0gPT09IHVuZGVmaW5lZCkgfHwgKHRoaXMuZ3JpZFt4XVt5XSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3h9LCR7eX0gY29vcmRpbmF0ZXMgaXMgdW5kZWZpbmVkYClcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgV2lkdGg6ICR7dGhpcy53aWR0aH07IGhlaWdodDogJHt0aGlzLmhlaWdodH0gKHJhZGl1czogJHt0aGlzLnJhZGl1c30pYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5yZWN0LFxuICAgICAgICAgICAgfSwgdGhpcy5ncmlkW3hdW3ldKSkgcmV0dXJuIHRoaXMuZ3JpZFt4XVt5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gVU5VU0VEIE9MRCBBTEdPUklUSE1cblxuICAvLyBTZXRzIGEgZ2xvYmFsIHRhcmdldCBub2RlXG4gIC8vIEl0IHdhcyB1c2VkIGJlZm9yZSB0aGUgbW92ZW1lbnQgZ290IGRldGFjaGVkIGZyb20gdGhlIHBsYXllciBjaGFyYWN0ZXJcbiAgdGhpcy50YXJnZXRfbm9kZSA9IG51bGxcbiAgdGhpcy5zZXRfdGFyZ2V0ID0gKG5vZGUpID0+IHtcbiAgICB0aGlzLmdyaWQuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5kaXN0YW5jZSA9IDApXG4gICAgdGhpcy50YXJnZXRfbm9kZSA9IG5vZGVcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZXMgcG9zc2libGUgcG9zc2l0aW9ucyBmb3IgdGhlIG5leHQgbW92ZW1lbnRcbiAgdGhpcy5jYWxjdWxhdGVfbmVpZ2hib3VycyA9IChjaGFyYWN0ZXIpID0+IHtcbiAgICBsZXQgY2hhcmFjdGVyX3JlY3QgPSB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCAtIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIHk6IGNoYXJhY3Rlci55IC0gY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgd2lkdGg6IGNoYXJhY3Rlci53aWR0aCArIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIGhlaWdodDogY2hhcmFjdGVyLmhlaWdodCArIGNoYXJhY3Rlci5zcGVlZFxuICAgIH1cblxuICAgIGxldCBmdXR1cmVfbW92ZW1lbnRfY29sbGlzaW9ucyA9IGNoYXJhY3Rlci5tb3ZlbWVudF9ib2FyZC5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBpc19jb2xsaWRpbmcoY2hhcmFjdGVyX3JlY3QsIG5vZGUpXG4gICAgfSlcblxuICAgIC8vIEknbSBnb25uYSBjb3B5IHRoZW0gaGVyZSBvdGhlcndpc2UgZGlmZmVyZW50IGVudGl0aWVzIGNhbGN1bGF0aW5nIGRpc3RhbmNlXG4gICAgLy8gd2lsbCBhZmZlY3QgZWFjaCBvdGhlcidzIG51bWJlcnMuIFRoaXMgY2FuIGJlIHNvbHZlZCB3aXRoIGEgZGlmZmVyZW50XG4gICAgLy8gY2FsY3VsYXRpb24gYWxnb3JpdGhtIGFzIHdlbGwuXG4gICAgcmV0dXJuIGZ1dHVyZV9tb3ZlbWVudF9jb2xsaXNpb25zXG4gIH1cblxuXG4gIHRoaXMubmV4dF9zdGVwID0gKGNoYXJhY3RlciwgY2xvc2VzdF9ub2RlLCB0YXJnZXRfbm9kZSkgPT4ge1xuICAgIC8vIFN0ZXA6IFNlbGVjdCBhbGwgbmVpZ2hib3Vyc1xuICAgIGxldCB2aXNpdGVkID0gW11cbiAgICBsZXQgbm9kZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmMoNDA5NiAvIGdvLnRpbGVfc2l6ZSlcbiAgICBsZXQgb3JpZ2luX2luZGV4ID0gY2xvc2VzdF9ub2RlLmlkXG5cbiAgICBsZXQgbmVpZ2hib3VycyA9IHRoaXMuY2FsY3VsYXRlX25laWdoYm91cnMoY2hhcmFjdGVyKVxuXG4gICAgLy8gU3RlcDogU29ydCBuZWlnaGJvdXJzIGJ5IGRpc3RhbmNlIChzbWFsbGVyIGRpc3RhbmNlIGZpcnN0KVxuICAgIC8vIFdlIGFkZCB0aGUgd2FsayBtb3ZlbWVudCB0byByZS12aXNpdGVkIG5vZGVzIHRvIHNpZ25pZnkgdGhpcyBjb3N0XG4gICAgbGV0IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYyA9IG5laWdoYm91cnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEuZGlzdGFuY2UpIHtcbiAgICAgICAgLy9hLmRpc3RhbmNlICs9IDIgKiBjaGFyYWN0ZXIuc3BlZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEuZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKGEsIHRhcmdldF9ub2RlKVxuICAgICAgfVxuXG4gICAgICBpZiAoYi5kaXN0YW5jZSkge1xuICAgICAgICAvL2IuZGlzdGFuY2UgKz0gY2hhcmFjdGVyLnNwZWVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiLmRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShiLCB0YXJnZXRfbm9kZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlXG4gICAgfSlcblxuICAgIC8vIFN0ZXA6IFNlbGVjdCBvbmx5IG5laWdoYm91ciBub2RlcyB0aGF0IGFyZSBub3QgYmxvY2tlZFxuICAgIG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYyA9IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYy5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBub2RlLmJsb2NrZWQgIT09IHRydWVcbiAgICB9KVxuXG4gICAgLy8gU3RlcDogUmV0dXJuIHRoZSBjbG9zZXN0IHZhbGlkIG5vZGUgdG8gdGhlIHRhcmdldFxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZiB0aGUgY2xvc2VzdCBwb2ludCBpcyB0aGUgdGFyZ2V0IGl0c2VsZlxuICAgIC8vIHJldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgbm93aGVyZSB0byBnb1xuICAgIGlmIChuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZnV0dXJlX25vZGUgPSBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2NbMF1cbiAgICAgIHJldHVybiAoZnV0dXJlX25vZGUuaWQgPT0gdGFyZ2V0X25vZGUuaWQgPyB0cnVlIDogZnV0dXJlX25vZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gZnVuY3Rpb24gKGNoYXJhY3RlciwgdGFyZ2V0X25vZGUpIHtcbiAgICBsZXQgY2hhcl9wb3MgPSB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbnRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKGNoYXJfcG9zKVxuICAgIGxldCBjbG9zZXN0X25vZGUgPSB0aGlzLm5leHRfc3RlcChjaGFyYWN0ZXIsIGN1cnJlbnRfbm9kZSwgdGFyZ2V0X25vZGUpXG5cbiAgICAvLyBXZSBoYXZlIGEgbmV4dCBzdGVwXG4gICAgaWYgKHR5cGVvZiAoY2xvc2VzdF9ub2RlKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgbGV0IGZ1dHVyZV9tb3ZlbWVudCA9IHsgLi4uY2hhcl9wb3MgfVxuICAgICAgbGV0IHhfc3BlZWQgPSAwXG4gICAgICBsZXQgeV9zcGVlZCA9IDBcbiAgICAgIGlmIChjbG9zZXN0X25vZGUueCAhPSBjaGFyYWN0ZXIueCkge1xuICAgICAgICBsZXQgZGlzdGFuY2VfeCA9IGNoYXJfcG9zLnggLSBjbG9zZXN0X25vZGUueFxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VfeCkgPj0gY2hhcmFjdGVyLnNwZWVkKSB7XG4gICAgICAgICAgeF9zcGVlZCA9IChkaXN0YW5jZV94ID4gMCA/IC1jaGFyYWN0ZXIuc3BlZWQgOiBjaGFyYWN0ZXIuc3BlZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNoYXJfcG9zLnggPCBjbG9zZXN0X25vZGUueCkge1xuICAgICAgICAgICAgeF9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3gpICogLTFcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeF9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3gpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjbG9zZXN0X25vZGUueSAhPSBjaGFyYWN0ZXIueSkge1xuICAgICAgICBsZXQgZGlzdGFuY2VfeSA9IGZ1dHVyZV9tb3ZlbWVudC55IC0gY2xvc2VzdF9ub2RlLnlcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlX3kpID49IGNoYXJhY3Rlci5zcGVlZCkge1xuICAgICAgICAgIHlfc3BlZWQgPSAoZGlzdGFuY2VfeSA+IDAgPyAtY2hhcmFjdGVyLnNwZWVkIDogY2hhcmFjdGVyLnNwZWVkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA8IGNsb3Nlc3Rfbm9kZS55KSB7XG4gICAgICAgICAgICB5X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeV9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3kpICogLTFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBmdXR1cmVfbW92ZW1lbnQueCArIHhfc3BlZWRcbiAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gZnV0dXJlX21vdmVtZW50LnkgKyB5X3NwZWVkXG5cbiAgICAgIGNoYXJhY3Rlci5jb29yZHMoZnV0dXJlX21vdmVtZW50KVxuICAgICAgLy8gV2UncmUgYWxyZWFkeSBhdCB0aGUgYmVzdCBzcG90XG4gICAgfSBlbHNlIGlmIChjbG9zZXN0X25vZGUgPT09IHRydWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVhY2hlZFwiKVxuICAgICAgY2hhcmFjdGVyLm1vdmVtZW50X2JvYXJkID0gW11cbiAgICAgIGNoYXJhY3Rlci5tb3ZpbmcgPSBmYWxzZVxuICAgICAgLy8gV2UncmUgc3R1Y2tcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogZ290IHRoaXMgb25jZSBhZnRlciBoYWQgYWxyZWFkeSByZWFjaGVkLiBcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gcGF0aFwiKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFxuIiwiZnVuY3Rpb24gQ2FtZXJhKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNhbWVyYSA9IHRoaXNcbiAgdGhpcy54ID0gMFxuICB0aGlzLnkgPSAwXG4gIHRoaXMuY2FtZXJhX3NwZWVkID0gM1xuXG4gIHRoaXMubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSA9IChldikgPT4ge1xuICAgIC8vaWYgKHRoaXMuZ28uZWRpdG9yLnBhaW50X21vZGUpIHJldHVyblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA8IDEwMCkge1xuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgeSArIHRoZSBtb3ZlbWVudCB3ZSdsbCBtYWtlIGZ1cnRoZXIgdGhlcmUgaXMgZ3JlYXRlciB0aGFuXG4gICAgICAvLyB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBzY3JlZW4gbWludXMgdGhlIGhlaWdodCB0aGF0IHdpbGwgYWxyZWFkeSBiZSB2aXNpYmxlXG4gICAgICAvLyAodGhlIGNhbnZhcyBoZWlnaHQpLCBkb24ndCBnbyBmdXJ0aGVyIG93blxuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA+IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gMTAwKSB7XG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpIDwgMTAwKSB7XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA+IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSAxMDApIHtcbiAgICAgIC8vIERvbid0IGdvIGZ1cnRoZXIgbGVmdFxuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuICB9XG5cbiAgdGhpcy5mb2N1cyA9IChwb2ludCkgPT4ge1xuICAgIGxldCB4ID0gcG9pbnQueCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gICAgbGV0IHkgPSBwb2ludC55IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gICAgLy8gc3BlY2lmaWMgbWFwIGN1dHMgKGl0IGhhcyBhIG1hcCBvZmZzZXQgb2YgNjAsMTYwKVxuICAgIGlmICh5IDwgMCkgeyB5ID0gMCB9XG4gICAgaWYgKHggPCAwKSB7IHggPSAwIH1cbiAgICBpZiAoeCArIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggPiB0aGlzLmdvLndvcmxkLndpZHRoKSB7IHggPSB0aGlzLnggfVxuICAgIGlmICh5ICsgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgPiB0aGlzLmdvLndvcmxkLmhlaWdodCkgeyB5ID0gdGhpcy55IH1cbiAgICAvLyBvZmZzZXQgY2hhbmdlcyBlbmRcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgdGhpcy5nbG9iYWxfY29vcmRzID0gKG9iaikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICB4OiBvYmoueCAtIHRoaXMueCxcbiAgICAgIHk6IG9iai55IC0gdGhpcy55XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbWVyYVxuIiwiZnVuY3Rpb24gQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5kdXJhdGlvbiA9IG51bGxcbiAgICB0aGlzLndpZHRoID0gZ28uY2hhcmFjdGVyLndpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSA1XG4gICAgdGhpcy5jb2xvdXIgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5mdWxsID0gbnVsbFxuICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBudWxsXG4gICAgdGhpcy5sYXN0X3RpbWUgPSBudWxsXG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGxcbiAgICAvLyBTdGF5cyBzdGF0aWMgaW4gYSBwb3NpdGlvbiBpbiB0aGUgbWFwXG4gICAgLy8gTWVhbmluZzogZG9lc24ndCBtb3ZlIHdpdGggdGhlIGNhbWVyYVxuICAgIHRoaXMuc3RhdGljID0gZmFsc2VcbiAgICB0aGlzLnhfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueCA6XG4gICAgICAgICAgICAwO1xuICAgIH1cbiAgICB0aGlzLnlfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueSA6XG4gICAgICAgICAgICAwO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnQgPSAoZHVyYXRpb24sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCA9ICgpID0+IHRoaXMuZHVyYXRpb24gPSBudWxsXG5cbiAgICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5kdXJhdGlvbiA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBlbGFwc2VkX3RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpbWU7XG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gZWxhcHNlZF90aW1lO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50IDw9IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMuZW50aXR5LnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICB0aGlzLnkgPSB0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0ICsgMTAgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsZXQgYmFyX3dpZHRoID0gKCh0aGlzLmN1cnJlbnQgLyB0aGlzLmR1cmF0aW9uKSAqIHRoaXMud2lkdGgpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmNhbGxiYWNrICE9PSBudWxsKSAmJiAodGhpcy5jYWxsYmFjayAhPT0gdW5kZWZpbmVkKSkgdGhpcy5jYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXN0aW5nQmFyXG4iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCByYW5kb20sIFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5pbXBvcnQgSW52ZW50b3J5IGZyb20gXCIuL2ludmVudG9yeVwiXG5pbXBvcnQgU3RhdHMgZnJvbSBcIi4vYmVoYXZpb3JzL3N0YXRzLmpzXCJcbmltcG9ydCBTcGVsbGNhc3RpbmcgZnJvbSBcIi4vYmVoYXZpb3JzL3NwZWxsY2FzdGluZy5qc1wiXG5pbXBvcnQgRnJvc3Rib2x0IGZyb20gXCIuL3NwZWxscy9mcm9zdGJvbHQuanNcIlxuaW1wb3J0IEJsaW5rIGZyb20gXCIuL3NwZWxscy9ibGluay5qc1wiXG5pbXBvcnQgQ3V0VHJlZSBmcm9tIFwiLi9za2lsbHMvY3V0X3RyZWUuanNcIlxuaW1wb3J0IFNraWxsIGZyb20gXCIuL3NraWxsLmpzXCJcbmltcG9ydCBCcmVha1N0b25lIGZyb20gXCIuL3NraWxscy9icmVha19zdG9uZS5qc1wiXG5pbXBvcnQgTWFrZUZpcmUgZnJvbSBcIi4vc2tpbGxzL21ha2VfZmlyZS5qc1wiXG5pbXBvcnQgQm9hcmQgZnJvbSBcIi4vYm9hcmQuanNcIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vYmVoYXZpb3JzL2xvb3QuanNcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNoYXJhY3RlciA9IHRoaXNcbiAgdGhpcy5uYW1lID0gYFBsYXllciAke1N0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkpLnNsaWNlKDAsIDIpfWBcbiAgdGhpcy5lZGl0b3IgPSBnby5lZGl0b3JcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwiY3Jpc2lzY29yZXBlZXBzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaWQgPSBpZFxuICB0aGlzLnggPSAxMDBcbiAgdGhpcy55ID0gMTAwXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IFwiZG93blwiXG4gIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9IDBcbiAgdGhpcy5zcGVlZCA9IDEuNFxuICB0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoeyBnbyB9KTtcbiAgdGhpcy5zcGVsbGJvb2sgPSB7XG4gICAgZnJvc3Rib2x0OiBuZXcgRnJvc3Rib2x0KHsgZ28sIGVudGl0eTogdGhpcyB9KSxcbiAgICBibGluazogbmV3IEJsaW5rKHsgZ28sIGVudGl0eTogdGhpcyB9KVxuICB9XG4gIHRoaXMuc3BlbGxzID0ge1xuICAgIGZyb3N0Ym9sdDogbmV3IFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHk6IHRoaXMsIHNwZWxsOiB0aGlzLnNwZWxsYm9vay5mcm9zdGJvbHQgfSkuY2FzdCxcbiAgICBibGluazogbmV3IFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHk6IHRoaXMsIHNwZWxsOiB0aGlzLnNwZWxsYm9vay5ibGluayB9KS5jYXN0XG4gIH1cbiAgdGhpcy5za2lsbHMgPSB7XG4gICAgY3V0X3RyZWU6IG5ldyBTa2lsbCh7IGdvLCBlbnRpdHk6IHRoaXMsIHNraWxsOiBuZXcgQ3V0VHJlZSh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuYWN0LFxuICAgIGJyZWFrX3N0b25lOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IEJyZWFrU3RvbmUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdCxcbiAgICBtYWtlX2ZpcmU6IG5ldyBTa2lsbCh7IGdvLCBlbnRpdHk6IHRoaXMsIHNraWxsOiBuZXcgTWFrZUZpcmUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdFxuICB9XG4gIHRoaXMuc3RhdHMgPSBuZXcgU3RhdHMoeyBnbywgZW50aXR5OiB0aGlzLCBtYW5hOiA1MCB9KTtcbiAgdGhpcy5oZWFsdGhfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgeV9vZmZzZXQ6IDIwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5tYW5hX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHlfb2Zmc2V0OiAxMCwgY29sb3VyOiBcImJsdWVcIiB9KVxuICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiAyMCB9KVxuICB0aGlzLmV4cGVyaWVuY2VfcG9pbnRzID0gMFxuICB0aGlzLmxldmVsID0gMTtcbiAgdGhpcy51cGRhdGVfeHAgPSAoZW50aXR5KSA9PiB7XG4gICAgdGhpcy5leHBlcmllbmNlX3BvaW50cyArPSAxMDA7XG4gICAgaWYgKHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgPj0gMTAwMCkge1xuICAgICAgdGhpcy5sZXZlbCArPSAxO1xuICAgICAgdGhpcy5leHBlcmllbmNlX3BvaW50cyA9IDA7XG4gICAgfVxuICB9XG5cbiAgdGhpcy51cGRhdGVfZnBzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgaWYgKG5lYXJfYm9uZmlyZSgpKSB7XG4gICAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X2hwIDwgdGhpcy5zdGF0cy5ocCkgdGhpcy5zdGF0cy5jdXJyZW50X2hwICs9IHJhbmRvbSg0LCA3KVxuICAgICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9tYW5hIDwgdGhpcy5zdGF0cy5tYW5hKSB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSArPSByYW5kb20oMSwgMylcbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIGZ1bmN0aW9uIHRyaWVzIHRvIHNlZSBpZiB0aGUgc2VsZWN0ZWQgY2xpY2thYmxlIGhhcyBhIGRlZmF1bHQgYWN0aW9uIHNldCBmb3IgaW50ZXJhY3Rpb25cbiAgdGhpcy5za2lsbF9hY3Rpb24gPSAoKSA9PiB7XG4gICAgbGV0IG9iamVjdCA9IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlXG4gICAgaWYgKG9iamVjdC5hY3RlZF9ieV9za2lsbCA9PSAnbG9vdCcpIHtcbiAgICAgIGlmIChWZWN0b3IyLmRpc3RhbmNlKG9iamVjdCwgdGhpcykgPCBvYmplY3Qud2lkdGggKyAyMCkge1xuICAgICAgICBuZXcgTG9vdCh7IGdvLCBlbnRpdHk6IHRoaXMsIGxvb3RfYmFnOiBvYmplY3QgfSkuYWN0KClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9iamVjdCAmJiB0aGlzLnNraWxsc1tvYmplY3QuYWN0ZWRfYnlfc2tpbGxdKSB7XG4gICAgICB0aGlzLnNraWxsc1tvYmplY3QuYWN0ZWRfYnlfc2tpbGxdKClcbiAgICB9XG4gIH1cblxuICBjb25zdCBuZWFyX2JvbmZpcmUgPSAoKSA9PiB0aGlzLmdvLmZpcmVzLnNvbWUoZmlyZSA9PiBWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIGZpcmUpIDwgMTAwKTtcblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMudGFyZ2V0X21vdmVtZW50KSB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KClcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgTWF0aC5mbG9vcih0aGlzLndhbGtfY3ljbGVfaW5kZXgpICogdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSgpICogdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gICAgdGhpcy5tYW5hX2Jhci5kcmF3KHRoaXMuc3RhdHMubWFuYSwgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEpXG4gIH1cblxuICB0aGlzLmRyYXdfY2hhcmFjdGVyID0gKHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9KSA9PiB7XG4gICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnggOiB4XG4gICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnkgOiB5XG4gICAgd2lkdGggPSB3aWR0aCA9PT0gdW5kZWZpbmVkID8gdGhpcy53aWR0aCA6IHdpZHRoXG4gICAgaGVpZ2h0ID0gaGVpZ2h0ID09PSB1bmRlZmluZWQgPyB0aGlzLmhlaWdodCA6IGhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gIH1cblxuICB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICByZXR1cm4gMlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICByZXR1cm4gM1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHJldHVybiAxXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gICAgY29uc3QgZnV0dXJlX3Bvc2l0aW9uID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSwgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICBpZiAodGhpcy54ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQud2lkdGggKyB0aGlzLmdvLndvcmxkLnhfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnggKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIGlmICh0aGlzLnkgLSB0aGlzLnNwZWVkID4gdGhpcy5nby53b3JsZC55X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi55IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIGlmICh0aGlzLnggLSB0aGlzLnNwZWVkID4gdGhpcy5nby53b3JsZC54X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC5oZWlnaHQgKyB0aGlzLmdvLndvcmxkLnlfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5nby50cmVlcy5zb21lKHRyZWUgPT4gKGlzX2NvbGxpZGluZyhmdXR1cmVfcG9zaXRpb24sIHRyZWUpKSkpIHtcbiAgICAgIHRoaXMueCA9IGZ1dHVyZV9wb3NpdGlvbi54XG4gICAgICB0aGlzLnkgPSBmdXR1cmVfcG9zaXRpb24ueVxuICAgICAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gKHRoaXMud2Fsa19jeWNsZV9pbmRleCArICgwLjAzICogdGhpcy5zcGVlZCkpICUgM1xuICAgICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcylcbiAgICB9XG4gIH1cblxuICAvLyBFeHBlcmltZW50c1xuXG4gIEFycmF5LnByb3RvdHlwZS5sYXN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIH1cbiAgQXJyYXkucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1swXSB9XG5cbiAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXRfbW92ZW1lbnQgPSB0aGlzLnRhcmdldF9tb3ZlbWVudCkge1xuICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpXG4gICAgdGhpcy5nby5jdHguYXJjKCh0YXJnZXRfbW92ZW1lbnQueCAtIHRoaXMuZ28uY2FtZXJhLngpICsgMTAsICh0YXJnZXRfbW92ZW1lbnQueSAtIHRoaXMuZ28uY2FtZXJhLnkpICsgMTAsIDIwLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNDtcbiAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICB9XG5cbiAgLy8gQVVUTy1NT1ZFIChwYXRoZmluZGVyKSAtLSByZW5hbWUgaXQgdG8gbW92ZSB3aGVuIHVzaW5nIHBsYXlncm91bmRcbiAgdGhpcy5hdXRvX21vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92ZW1lbnRfYm9hcmQubGVuZ3RoID09PSAwKSB7IHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXS5jb25jYXQodGhpcy5nby5ib2FyZC5ncmlkKSB9XG4gICAgdGhpcy5nby5ib2FyZC5tb3ZlKHRoaXMsIHRoaXMuZ28uYm9hcmQudGFyZ2V0X25vZGUpXG4gIH1cblxuICAvLyBTdG9yZXMgdGhlIHRlbXBvcmFyeSB0YXJnZXQgb2YgdGhlIG1vdmVtZW50IGJlaW5nIGV4ZWN1dGVkXG4gIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gbnVsbFxuICAvLyBTdG9yZXMgdGhlIHBhdGggYmVpbmcgY2FsY3VsYXRlZFxuICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG5cbiAgdGhpcy5maW5kX3BhdGggPSAodGFyZ2V0X21vdmVtZW50KSA9PiB7XG4gICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgIHRoaXMubW92aW5nID0gZmFsc2VcblxuICAgIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gdGFyZ2V0X21vdmVtZW50XG5cbiAgICBpZiAodGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyB4OiB0aGlzLnggKyB0aGlzLnNwZWVkLCB5OiB0aGlzLnkgKyB0aGlzLnNwZWVkIH0pXG4gICAgfVxuXG4gICAgdmFyIGxhc3Rfc3RlcCA9IHt9XG4gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHt9XG5cbiAgICBkbyB7XG4gICAgICBsYXN0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aFt0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggLSAxXVxuICAgICAgZnV0dXJlX21vdmVtZW50ID0geyB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9XG5cbiAgICAgIC8vIFRoaXMgY29kZSB3aWxsIGtlZXAgdHJ5aW5nIHRvIGdvIGJhY2sgdG8gdGhlIHNhbWUgcHJldmlvdXMgZnJvbSB3aGljaCB3ZSBqdXN0IGJyYW5jaGVkIG91dFxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC54ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG5cbiAgICAgIC8vIFRoaXMgaXMgcHJldHR5IGhlYXZ5Li4uIEl0J3MgY2FsY3VsYXRpbmcgYWdhaW5zdCBhbGwgdGhlIGJpdHMgaW4gdGhlIG1hcCA9W1xuICAgICAgdmFyIGdvaW5nX3RvX2NvbGxpZGUgPSB0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKVxuICAgICAgaWYgKGdvaW5nX3RvX2NvbGxpZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbGxpc2lvbiBhaGVhZCEnKVxuICAgICAgICB2YXIgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC54ID0gbmV4dF9tb3ZlbWVudC54IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIG9uIFlcIilcbiAgICAgICAgfVxuICAgICAgICBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnkgPSBuZXh0X21vdmVtZW50LnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgWFwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgLi4uZnV0dXJlX21vdmVtZW50IH0pXG4gICAgfSB3aGlsZSAoKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB8fCAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpKVxuXG4gICAgdGhpcy5tb3ZpbmcgPSB0cnVlXG4gIH1cblxuICB0aGlzLm1vdmVfb25fcGF0aCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgICAgIHZhciBuZXh0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aC5zaGlmdCgpXG4gICAgICBpZiAobmV4dF9zdGVwKSB7XG4gICAgICAgIHRoaXMueCA9IG5leHRfc3RlcC54XG4gICAgICAgIHRoaXMueSA9IG5leHRfc3RlcC55XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmVtZW50X2JvYXJkID0gW11cblxuICB0aGlzLm1vdmVfdG9fd2F5cG9pbnQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmNvb3Jkcyhub2RlKVxuICB9XG5cbiAgdGhpcy5jb29yZHMgPSBmdW5jdGlvbiAoY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgLy90aGlzLm1vdmUgPSBmdW5jdGlvbih0YXJnZXRfbW92ZW1lbnQpIHtcbiAgLy8gIGlmICh0aGlzLm1vdmluZykge1xuICAvLyAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9XG5cbiAgLy8gICAgaWYgKChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA8PSAxKSAmJiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPD0gMSkpIHtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAvLyAgICAgIHRhcmdldF9tb3ZlbWVudCA9IHt9XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJTdG9wcGVkXCIpO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQodGFyZ2V0X21vdmVtZW50KVxuXG4gIC8vICAgICAgLy8gUGF0aGluZ1xuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICB9XG5cbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LndpZHRoID0gdGhpcy53aWR0aFxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcblxuICAvLyAgICBpZiAoKHRoaXMuZ28uZW50aXRpZXMuZXZlcnkoKGVudGl0eSkgPT4gZW50aXR5LmlkID09PSB0aGlzLmlkIHx8ICFpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBlbnRpdHkpICkpICYmXG4gIC8vICAgICAgKCF0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKSkpIHtcbiAgLy8gICAgICB0aGlzLnggPSBmdXR1cmVfbW92ZW1lbnQueFxuICAvLyAgICAgIHRoaXMueSA9IGZ1dHVyZV9tb3ZlbWVudC55XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJCbG9ja2VkXCIpO1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgLy8gICAgfVxuICAvLyAgfVxuICAvLyAgLy8gRU5EIC0gQ2hhcmFjdGVyIE1vdmVtZW50XG4gIC8vfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENsaWNrYWJsZShnbywgeCwgeSwgd2lkdGgsIGhlaWdodCwgaW1hZ2Vfc3JjKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaCh0aGlzKVxuXG4gIHRoaXMubmFtZSA9IGltYWdlX3NyY1xuICB0aGlzLnggPSB4XG4gIHRoaXMueSA9IHlcbiAgdGhpcy53aWR0aCA9IHdpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICB0aGlzLmFjdGl2YXRlZCA9IGZhbHNlXG4gIHRoaXMucGFkZGluZyA9IDVcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0LCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgaWYgKHRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiI2ZmZlwiXG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCAtIHRoaXMucGFkZGluZywgdGhpcy55IC0gdGhpcy5wYWRkaW5nLCB0aGlzLndpZHRoICsgKDIqdGhpcy5wYWRkaW5nKSwgdGhpcy5oZWlnaHQgKyAoMip0aGlzLnBhZGRpbmcpKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbGlja1wiKVxuICB9XG59XG4iLCJpbXBvcnQgQ2xpY2thYmxlIGZyb20gXCIuL2NsaWNrYWJsZS5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnRyb2xzKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNvbnRyb2xzID0gdGhpc1xuICB0aGlzLndpZHRoID0gc2NyZWVuLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gc2NyZWVuLmhlaWdodCAqIDAuNFxuICB0aGlzLmFycm93cyA9IHtcbiAgICB1cDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEwLCA4MCwgODAsIFwiYXJyb3dfdXAucG5nXCIpLFxuICAgIGxlZnQ6IG5ldyBDbGlja2FibGUoZ28sIDUwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfbGVmdC5wbmdcIiksXG4gICAgcmlnaHQ6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgKyA3MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X3JpZ2h0LnBuZ1wiKSxcbiAgICBkb3duOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTIwLCA4MCwgODAsIFwiYXJyb3dfZG93bi5wbmdcIiksXG4gIH1cbiAgdGhpcy5hcnJvd3MudXAuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXG4gIHRoaXMuYXJyb3dzLmRvd24uY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImRvd25cIilcbiAgdGhpcy5hcnJvd3MubGVmdC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKVxuICB0aGlzLmFycm93cy5yaWdodC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIilcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMilcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFycm93cykuZm9yRWFjaChhcnJvdyA9PiBhcnJvdy5kcmF3KCkpXG4gIH1cbn1cbiIsImZ1bmN0aW9uIERvb2RhZCh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgdGhpcy54ID0gMDtcbiAgdGhpcy55ID0gMDtcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMud2lkdGggPSAzMlxuICB0aGlzLmhlaWdodCA9IDMyXG4gIHRoaXMucmVzb3VyY2VfYmFyID0gbnVsbFxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh0YXJnZXRfcG9zaXRpb24pIHtcbiAgICBsZXQgeCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueCA/IHRhcmdldF9wb3NpdGlvbi54IDogdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgIGxldCB5ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi55ID8gdGFyZ2V0X3Bvc2l0aW9uLnkgOiB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgbGV0IHdpZHRoID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi53aWR0aCA/IHRhcmdldF9wb3NpdGlvbi53aWR0aCA6IHRoaXMud2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgPyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAgaWYgKHRhcmdldF9wb3NpdGlvbikgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5yZXNvdXJjZV9iYXIpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmRyYXcoKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSBmdW5jdGlvbiAoKSB7IH1cbiAgdGhpcy51cGRhdGVfZnBzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZ1ZWwgPD0gMCkge1xuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIGdvLmZpcmVzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZ1ZWwgLT0gMTtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmN1cnJlbnQgLT0gMTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9vZGFkO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRWRpdG9yKHsgZ28gfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZ28uZWRpdG9yID0gdGhpc1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3JkcyA9IHtcbiAgICAgICAgeDogdGhpcy5nby5zY3JlZW4ud2lkdGggLSAzMDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogdGhpcy5nby5zY3JlZW4uaGVpZ2h0XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCwgdGhpcy5nby5zY3JlZW4uaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5kcmF3X2NoYXJhY3Rlcih7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyKSxcbiAgICAgICAgICAgIHk6IDUwLFxuICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MFxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgICAgIGxldCB0ZXh0ID0gYHg6ICR7dGhpcy5nby5jaGFyYWN0ZXIueC50b0ZpeGVkKDIpfSwgeTogJHt0aGlzLmdvLmNoYXJhY3Rlci55LnRvRml4ZWQoMil9YFxuICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyA1MCArIDUwICsgMjApXG5cbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB0aGlzLmRyYXdfc2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3NlbGVjdGlvbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuZHJhdyh7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyIC0gMzUsXG4gICAgICAgICAgICB5OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwLFxuICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgaGVpZ2h0OiA3MFxuICAgICAgICB9KVxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwICsgMTAwKVxuICAgIH1cbn0iLCIvLyBUaGUgY2FsbGJhY2tzIHN5c3RlbVxuLy8gXG4vLyBUbyB1c2UgaXQ6XG4vL1xuLy8gKiBpbXBvcnQgdGhlIGNhbGxiYWNrcyB5b3Ugd2FudFxuLy9cbi8vICAgIGltcG9ydCB7IHNldE1vdXNlbW92ZUNhbGxiYWNrIH0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG4vL1xuLy8gKiBjYWxsIHRoZW0gYW5kIHN0b3JlIHRoZSBhcnJheSBvZiBjYWxsYmFjayBmdW5jdGlvbnNcbi8vXG4vLyAgICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pO1xuLy9cbi8vICogYWRkIG9yIHJlbW92ZSBjYWxsYmFja3MgZnJvbSBhcnJheVxuLy9cbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaChnby5jYW1lcmEubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSlcbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcblxuZnVuY3Rpb24gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IG9uX21vdXNlbW92ZSA9IChldikgPT4ge1xuICAgIG1vdXNlbW92ZV9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25fbW91c2Vtb3ZlLCBmYWxzZSlcbiAgcmV0dXJuIG1vdXNlbW92ZV9jYWxsYmFja3M7XG59XG5cblxuZnVuY3Rpb24gc2V0Q2xpY2tDYWxsYmFjayhnbykge1xuICBjb25zdCBjbGlja19jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9jbGljayAgPSAoZXYpID0+IHtcbiAgICBjbGlja19jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fY2xpY2ssIGZhbHNlKVxuICByZXR1cm4gY2xpY2tfY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRDYWxsYmFjayhnbywgZXZlbnQpIHtcbiAgY29uc3QgY2FsbGJhY2tzID0gW11cbiAgY29uc3QgaGFuZGxlciA9IChlKSA9PiB7XG4gICAgY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhlKVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKVxuICByZXR1cm4gY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZW1vdmUnKTtcbn1cblxuZnVuY3Rpb24gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2FsbGJhY2tfcXVldWUgPSBzZXRDYWxsYmFjayhnbywgJ21vdXNlZG93bicpO1xuICBnby5tb3VzZWRvd25fY2FsbGJhY2tzID0gY2FsbGJhY2tfcXVldWVcbiAgcmV0dXJuIGNhbGxiYWNrX3F1ZXVlXG59XG5cbmZ1bmN0aW9uIHNldE1vdXNldXBDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZXVwJyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICd0b3VjaHN0YXJ0Jyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hlbmQnKTtcbn1cblxuZXhwb3J0IHtcbiAgc2V0TW91c2Vtb3ZlQ2FsbGJhY2ssXG4gIHNldENsaWNrQ2FsbGJhY2ssXG4gIHNldE1vdXNlTW92ZUNhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2ssXG4gIHNldFRvdWNoZW5kQ2FsbGJhY2ssXG59O1xuIiwiLy8gVGhlIEdhbWUgTG9vcFxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG4vLyBnYW1lX2xvb3AuZHJhdyA9IGRyYXdcbi8vIGdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IHByb2Nlc3Nfa2V5c19kb3duXG4vLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG5cbmZ1bmN0aW9uIEdhbWVMb29wKCkge1xuICB0aGlzLmRyYXcgPSBudWxsXG4gIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24gPSBudWxsXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge31cbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24oKVxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgdGhpcy5kcmF3KClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUxvb3BcbiIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4nKVxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcblxuZnVuY3Rpb24gR2FtZU9iamVjdCgpIHtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXNcbiAgdGhpcy5jYW52YXNfcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5jYW52YXNfcmVjdC53aWR0aCk7XG4gIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5jYW52YXNfcmVjdC5oZWlnaHQpO1xuICB0aGlzLmN0eCA9IGN0eFxuICB0aGlzLnRpbGVfc2l6ZSA9IDIwXG4gIHRoaXMuY2xpY2thYmxlcyA9IFtdXG4gIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB0aGlzLnNwZWxscyA9IFtdIC8vIFNwZWxsIHN5c3RlbSwgY291bGQgYmUgaW5qZWN0ZWQgYnkgaXQgYXMgd2VsbFxuICB0aGlzLnNraWxscyA9IFtdO1xuICB0aGlzLnRyZWVzID0gW107XG4gIHRoaXMuZmlyZXMgPSBbXTtcbiAgdGhpcy5zdG9uZXMgPSBbXTtcbiAgdGhpcy5sb290X2JhZ3MgPSBbXTtcbiAgdGhpcy5tYW5hZ2VkX29iamVjdHMgPSBbXSAvLyBSYW5kb20gb2JqZWN0cyB0byBkcmF3L3VwZGF0ZVxuXG4gIHRoaXMuZHJhd19vYmplY3RzID0gKCkgPT4ge1xuICAgIHRoaXMuc3RvbmVzLmZvckVhY2goc3RvbmUgPT4gc3RvbmUuZHJhdygpKVxuICAgIHRoaXMudHJlZXMuZm9yRWFjaCh0cmVlID0+IHRyZWUuZHJhdygpKVxuICAgIHRoaXMuZmlyZXMuZm9yRWFjaChmaXJlID0+IGZpcmUuZHJhdygpKVxuICAgIHRoaXMuc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwuZHJhdygpKVxuICAgIHRoaXMuc2tpbGxzLmZvckVhY2goc2tpbGwgPT4gc2tpbGwuZHJhdygpKVxuICAgIHRoaXMuY3JlZXBzLmZvckVhY2goY3JlZXAgPT4gY3JlZXAuZHJhdygpKVxuICAgIHRoaXMubG9vdF9iYWdzLmZvckVhY2gobG9vdF9iYWcgPT4gbG9vdF9iYWcuZHJhdygpKVxuICAgIHRoaXMubWFuYWdlZF9vYmplY3RzLmZvckVhY2gobW9iID0+IG1vYi5kcmF3KCkpXG4gIH1cblxuICB0aGlzLnVwZGF0ZV9vYmplY3RzID0gKCkgPT4ge1xuICAgIHRoaXMuc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwudXBkYXRlKCkpXG4gICAgdGhpcy5sb290X2JhZ3MuZm9yRWFjaChsb290X2JhZyA9PiBsb290X2JhZy51cGRhdGUoKSlcbiAgICB0aGlzLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IudXBkYXRlKCkpXG4gIH1cblxuICB0aGlzLnVwZGF0ZV9mcHNfb2JqZWN0cyA9ICgpID0+IHtcbiAgICB0aGlzLmZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLnVwZGF0ZV9mcHMoKSlcbiAgfVxuXG4gIHRoaXMuZHJhd19zZWxlY3RlZF9jbGlja2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgICB0aGlzLmN0eC5zYXZlKClcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICB0aGlzLmN0eC5zaGFkb3dDb2xvciA9IFwieWVsbG93XCJcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LCAyNTUsIDAsIDAuNylgXG4gICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKVxuICAgICAgdGhpcy5jdHguYXJjKFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoIC8gMikgLSB0aGlzLmNhbWVyYS54LFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS55ICsgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDIpIC0gdGhpcy5jYW1lcmEueSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUud2lkdGgsIDAsIDUwXG4gICAgICApXG4gICAgICB0aGlzLmN0eC5zdHJva2UoKVxuICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52ZW50b3J5KHsgZ28gfSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5tYXhfc2xvdHMgPSAxMlxuICB0aGlzLnNsb3RzX3Blcl9yb3cgPSA0XG4gIHRoaXMuc2xvdHMgPSBbXVxuICB0aGlzLnNsb3RfcGFkZGluZyA9IDEwXG4gIHRoaXMuc2xvdF93aWR0aCA9IDUwXG4gIHRoaXMuc2xvdF9oZWlnaHQgPSA1MFxuICB0aGlzLmluaXRpYWxfeCA9IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF93aWR0aCkgLSA1MDtcbiAgdGhpcy5pbml0aWFsX3kgPSB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSAodGhpcy5zbG90c19wZXJfcm93ICogdGhpcy5zbG90X2hlaWdodCkgLSA0MDA7XG4gIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgdGhpcy54ID0gKCkgPT4ge1xuICAgIGNvbnN0IHJpZ2h0X3BhbmVsX3dpZHRoID0gdGhpcy5nby5lZGl0b3IuYWN0aXZlID8gdGhpcy5nby5lZGl0b3IucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIDogMDtcbiAgICByZXR1cm4gdGhpcy5nby5zY3JlZW4ud2lkdGggLSAodGhpcy5zbG90c19wZXJfcm93ICogdGhpcy5zbG90X3dpZHRoKSAtIDUwIC0gcmlnaHRfcGFuZWxfd2lkdGg7XG4gIH1cblxuICB0aGlzLmFkZCA9IChpdGVtKSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmdfYnVuZGxlID0gdGhpcy5zbG90cy5maW5kKChidW5kbGUpID0+IHtcbiAgICAgIHJldHVybiBidW5kbGUubmFtZSA9PSBpdGVtLm5hbWVcbiAgICB9KVxuXG4gICAgaWYgKCh0aGlzLnNsb3RzLmxlbmd0aCA+PSB0aGlzLm1heF9zbG90cykgJiYgKCFleGlzdGluZ19idW5kbGUpKSByZXR1cm5cblxuICAgIGNvbnNvbGUubG9nKGAqKiogR290ICR7aXRlbS5xdWFudGl0eX0gJHtpdGVtLm5hbWV9YClcbiAgICBpZiAoZXhpc3RpbmdfYnVuZGxlKSB7XG4gICAgICBleGlzdGluZ19idW5kbGUucXVhbnRpdHkgKz0gaXRlbS5xdWFudGl0eVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNsb3RzLnB1c2goaXRlbSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmZpbmQgPSAoaXRlbV9uYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBpdGVtX25hbWUudG9Mb3dlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnRvZ2dsZV9kaXNwbGF5ID0gKCkgPT4ge1xuICAgIHRoaXMuYWN0aXZlID0gIXRoaXMuYWN0aXZlO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXhfc2xvdHM7IGkrKykge1xuICAgICAgbGV0IHggPSBNYXRoLmZsb29yKGkgJSA0KVxuICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkgLyA0KTtcblxuICAgICAgaWYgKCh0aGlzLnNsb3RzW2ldICE9PSB1bmRlZmluZWQpICYmICh0aGlzLnNsb3RzW2ldICE9PSBudWxsKSkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zbG90c1tpXTtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGl0ZW0uaW1hZ2UsIHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICAgIGlmIChpdGVtLnF1YW50aXR5ID4gMSkge1xuICAgICAgICAgIGxldCB0ZXh0ID0gaXRlbS5xdWFudGl0eVxuICAgICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyNHB4IHNhbnMtc2VyaWZcIlxuICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZykgKyAodGhpcy5zbG90X3dpZHRoIC0gMTUpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSArICh0aGlzLnNsb3RfaGVpZ2h0IC0gNSkpXG4gICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSAxXG4gICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlVGV4dCh0ZXh0LCB0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpICsgKHRoaXMuc2xvdF93aWR0aCAtIDE1KSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSkgKyAodGhpcy5zbG90X2hlaWdodCAtIDUpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICB9XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDYwLCA0MCwgMClcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXRlbShuYW1lLCBpbWFnZSwgcXVhbnRpdHkgPSAxLCBzcmNfaW1hZ2UpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICBpZiAoaW1hZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gc3JjX2ltYWdlXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlXG4gIH1cbiAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG59XG4iLCJmdW5jdGlvbiBLZXlib2FyZElucHV0KGdvKSB7XG4gIGNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbiAgICAvLyBUaGVzZSBhcmUgY2FsbGJhY2tzIHRoYXQgb25seSBnZXQgY2hlY2tlZCBvbmNlIG9uIHRoZSBldmVudFxuICAgIGlmICh0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID0gW11cbiAgICB9XG4gICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhldikpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uX2tleWRvd24sIGZhbHNlKVxuICBjb25zdCBvbl9rZXl1cCA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2VcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uX2tleXVwLCBmYWxzZSlcblxuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ua2V5Ym9hcmRfaW5wdXQgPSB0aGlzXG4gIHRoaXMua2V5X2NhbGxiYWNrcyA9IHtcbiAgICBkOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXSxcbiAgICB3OiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXSxcbiAgICBhOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIildLFxuICAgIHM6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKV0sXG4gIH1cbiAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrcyA9IHtcbiAgICAxOiBbXVxuICB9XG5cbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgICBjb25zdCBrZXlzX2Rvd24gPSBPYmplY3Qua2V5cyh0aGlzLmtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAgICBrZXlzX2Rvd24uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoIShPYmplY3Qua2V5cyh0aGlzLmtleV9jYWxsYmFja3MpLmluY2x1ZGVzKGtleSkpKSByZXR1cm5cblxuICAgICAgdGhpcy5rZXlfY2FsbGJhY2tzW2tleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMua2V5bWFwID0ge1xuICAgIGQ6IFwicmlnaHRcIixcbiAgICB3OiBcInVwXCIsXG4gICAgYTogXCJsZWZ0XCIsXG4gICAgczogXCJkb3duXCIsXG4gIH1cblxuICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd24gPSB7XG4gICAgZDogZmFsc2UsXG4gICAgdzogZmFsc2UsXG4gICAgYTogZmFsc2UsXG4gICAgczogZmFsc2UsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2V5Ym9hcmRJbnB1dDtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3Qge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW0sIHF1YW50aXR5ID0gMSkge1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyLCByYW5kb20sIGRpY2UgfSBmcm9tIFwiLi90YXBldGVcIlxuaW1wb3J0IEl0ZW0gZnJvbSBcIi4vaXRlbVwiXG5pbXBvcnQgTG9vdCBmcm9tIFwiLi9sb290XCJcblxuY2xhc3MgTG9vdEJveCB7XG4gICAgY29uc3RydWN0b3IoZ28pIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIGdvLmxvb3RfYm94ID0gdGhpc1xuICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgdGhpcy54ID0gMFxuICAgICAgICB0aGlzLnkgPSAwXG4gICAgICAgIHRoaXMud2lkdGggPSAzNTBcbiAgICB9XG5cbiAgICBkcmF3KCkge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgbW92ZXMgYXdheSwgZGVsZXRlIGl0ZW1zIGFuZCBoaWRlIGxvb3QgYm94IHNjcmVlblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCB0aGlzLmdvLmNoYXJhY3RlcikgPiA1MDApIHx8XG4gICAgICAgICAgICAodGhpcy5pdGVtcy5sZW5ndGggPD0gMClcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZUpvaW4gPSAnYmV2ZWwnO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDIwMCwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXNbaW5kZXhdXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgICAgICBsb290LnggPSB0aGlzLnggKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgICAgIGxvb3QueSA9IHRoaXMueSArIChpbmRleCAqIDYwKSArIDI1IC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbG9vdC53aWR0aCA9IDM0MFxuICAgICAgICAgICAgbG9vdC5oZWlnaHQgPSA1NVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QobG9vdC54LCBsb290LnksIGxvb3Qud2lkdGgsIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGxvb3QuaXRlbS5pbWFnZSwgbG9vdC54ICsgNSwgbG9vdC55ICsgNSwgNDUsIDQ1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9ICcyMnB4IHNlcmlmJ1xuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5xdWFudGl0eSwgbG9vdC54ICsgNjUsIGxvb3QueSArIDM1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5pdGVtLm5hbWUsIGxvb3QueCArIDEwMCwgbG9vdC55ICsgMzUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlXG4gICAgICAgIHRoaXMueCA9IHRoaXMuZ28uY2hhcmFjdGVyLnhcbiAgICAgICAgdGhpcy55ID0gdGhpcy5nby5jaGFyYWN0ZXIueVxuICAgIH1cblxuICAgIHRha2VfbG9vdChsb290X2luZGV4KSB7XG4gICAgICAgIGxldCBsb290ID0gdGhpcy5pdGVtcy5zcGxpY2UobG9vdF9pbmRleCwgMSlbMF1cbiAgICAgICAgaWYgKHRoaXMubG9vdF9iYWcpIHtcbiAgICAgICAgICAgIHRoaXMubG9vdF9iYWcuaXRlbXMuc3BsaWNlKGxvb3RfaW5kZXgsIDEpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIuaW52ZW50b3J5LmFkZChsb290Lml0ZW0pXG4gICAgfVxuXG4gICAgY2hlY2tfaXRlbV9jbGlja2VkKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm5cblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgobG9vdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA+PSBsb290LngpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPD0gbG9vdC54ICsgbG9vdC53aWR0aCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA+PSBsb290LnkpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPD0gbG9vdC55ICsgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICApXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudGFrZV9sb290KGluZGV4KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcm9sbF9sb290KGxvb3RfdGFibGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGxvb3RfdGFibGUubWFwKChsb290X2VudHJ5KSA9PiB7XG4gICAgICAgICAgICBsZXQgcm9sbCA9IGRpY2UoMTAwKVxuICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKiBMb290IHJvbGwgZm9yICR7bG9vdF9lbnRyeS5pdGVtLm5hbWV9OiAke3JvbGx9IChjaGFuY2U6ICR7bG9vdF9lbnRyeS5jaGFuY2V9KWApXG4gICAgICAgICAgICBpZiAocm9sbCA8PSBsb290X2VudHJ5LmNoYW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1fYnVuZGxlID0gbmV3IEl0ZW0obG9vdF9lbnRyeS5pdGVtLm5hbWUpXG4gICAgICAgICAgICAgICAgaXRlbV9idW5kbGUuaW1hZ2Uuc3JjID0gbG9vdF9lbnRyeS5pdGVtLmltYWdlX3NyY1xuICAgICAgICAgICAgICAgIGl0ZW1fYnVuZGxlLnF1YW50aXR5ID0gcmFuZG9tKGxvb3RfZW50cnkubWluLCBsb290X2VudHJ5Lm1heClcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExvb3QoaXRlbV9idW5kbGUsIGl0ZW1fYnVuZGxlLnF1YW50aXR5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvb3RCb3giLCJmdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgdGhpcy5pZCA9IGRhdGEuaWRcbiAgdGhpcy54ID0gZGF0YS54XG4gIHRoaXMueSA9IGRhdGEueVxuICB0aGlzLndpZHRoID0gZGF0YS53aWR0aFxuICB0aGlzLmhlaWdodCA9IGRhdGEuaGVpZ2h0XG4gIHRoaXMuY29sb3VyID0gXCJ0cmFuc3BhcmVudFwiXG4gIHRoaXMuYm9yZGVyX2NvbG91ciA9IFwiYmxhY2tcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBOb2RlXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJ0aWNsZShnbykge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoeyB4LCB5IH0pIHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5hcmMoeCAtIHRoaXMuZ28uY2FtZXJhLngsIHkgLSB0aGlzLmdvLmNhbWVyYS55LCAxNSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsKCk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gJ2xpZ2h0Ymx1ZSc7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpO1xuICAgIH1cbn0iLCJpbXBvcnQgUGFydGljbGUgZnJvbSBcIi4vcGFydGljbGUuanNcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2plY3RpbGUoeyBnbywgc3ViamVjdCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMucGFydGljbGUgPSBuZXcgUGFydGljbGUoZ28pO1xuICAgIHRoaXMuc3RhcnRfcG9zaXRpb24gPSBudWxsXG4gICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuZW5kX3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3RcbiAgICB0aGlzLnRyYWNlX2NvdW50ID0gN1xuICAgIHRoaXMuYm91bmRzID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLmN1cnJlbnRfcG9zaXRpb24sIHdpZHRoOiA1LCBoZWlnaHQ6IDUgfVxuICAgIH1cbiAgICB0aGlzLnRyYWNlID0gW107XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIHRoaXMuYWN0ID0gKHsgc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRfcG9zaXRpb24gPSBzdGFydF9wb3NpdGlvblxuICAgICAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSBPYmplY3QuY3JlYXRlKHRoaXMuc3RhcnRfcG9zaXRpb24pXG4gICAgICAgIHRoaXMuZW5kX3Bvc2l0aW9uID0gZW5kX3Bvc2l0aW9uXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIGlmIChWZWN0b3IyLmRpc3RhbmNlKHRoaXMuZW5kX3Bvc2l0aW9uLCB0aGlzLmN1cnJlbnRfcG9zaXRpb24pIDwgNSkge1xuICAgICAgICAgICAgdGhpcy5zdWJqZWN0LmVuZCgpO1xuICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlX3Bvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMudHJhY2UucHVzaChPYmplY3QuY3JlYXRlKHRoaXMuY3VycmVudF9wb3NpdGlvbikpXG4gICAgICAgIHRoaXMudHJhY2UgPSB0aGlzLnRyYWNlLnNsaWNlKC0xICogdGhpcy50cmFjZV9jb3VudClcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLnBhcnRpY2xlLmRyYXcodGhpcy5jdXJyZW50X3Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy50cmFjZS5mb3JFYWNoKHRyYWNlZF9wb3NpdGlvbiA9PiB0aGlzLnBhcnRpY2xlLmRyYXcodHJhY2VkX3Bvc2l0aW9uKSlcbiAgICB9XG5cbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGN1bGF0ZV9wb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgYW5nbGUgPSBWZWN0b3IyLmFuZ2xlKHRoaXMuY3VycmVudF9wb3NpdGlvbiwgdGhpcy5lbmRfcG9zaXRpb24pO1xuICAgICAgICBjb25zdCBzcGVlZCA9IHJhbmRvbSgzLCAxMik7XG4gICAgICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuY3VycmVudF9wb3NpdGlvbi54ICsgc3BlZWQgKiBNYXRoLmNvcyhhbmdsZSksXG4gICAgICAgICAgICB5OiB0aGlzLmN1cnJlbnRfcG9zaXRpb24ueSArIHNwZWVkICogTWF0aC5zaW4oYW5nbGUpXG4gICAgICAgIH1cbiAgICB9XG59IiwiZnVuY3Rpb24gUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0LCB5X29mZnNldCA9IDEwLCBjb2xvdXIgPSBcInJlZFwiLCBib3JkZXIsIGZpeGVkIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy50YXJnZXQud2lkdGggLyAxMDtcbiAgdGhpcy5jb2xvdXIgPSBjb2xvdXJcbiAgdGhpcy5mdWxsID0gMTAwXG4gIHRoaXMuY3VycmVudCA9IDEwMFxuICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgdGhpcy5ib3JkZXIgPSBib3JkZXJcbiAgdGhpcy5maXhlZCA9IGZpeGVkIHx8IGZhbHNlXG4gIHRoaXMueCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5maXhlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Lng7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC54IC0gdGhpcy5nby5jYW1lcmEueDtcbiAgICB9XG4gIH1cbiAgdGhpcy55ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmZpeGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQueTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnkgLSB0aGlzLmdvLmNhbWVyYS55O1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50LCBkZWJ1ZyA9IGZhbHNlKSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoKE1hdGgubWluKGN1cnJlbnQsIGZ1bGwpKSAvIGZ1bGwpICogdGhpcy50YXJnZXQud2lkdGgpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmJvcmRlciB8fCBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngoKSwgdGhpcy55KCkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCksIHRoaXMueSgpIC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCksIHRoaXMueSgpIC0gdGhpcy55X29mZnNldCwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUJhclxuIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMud2lkdGggID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodDtcbiAgdGhpcy5yYWRpdXMgPSA3MDBcblxuICB0aGlzLmNsZWFyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmNhbnZhcy53aWR0aCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5nby5jYW52YXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nby5jYW52YXNfcmVjdCA9IHRoaXMuZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5jbGVhcigpXG4gICAgdGhpcy5nby53b3JsZC5kcmF3KClcbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIHRoaXMuZHJhd19mb2cgPSAoKSA9PiB7XG4gICAgdmFyIHggPSB0aGlzLmdvLmNoYXJhY3Rlci54ICsgdGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyIC0gdGhpcy5nby5jYW1lcmEueFxuICAgIHZhciB5ID0gdGhpcy5nby5jaGFyYWN0ZXIueSArIHRoaXMuZ28uY2hhcmFjdGVyLmhlaWdodCAvIDIgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgdmFyIGdyYWRpZW50ID0gdGhpcy5nby5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgdGhpcy5yYWRpdXMpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLCAwLCAwLCAwKScpXG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsIDAsIDAsIDEpJylcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudFxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHNjcmVlbi53aWR0aCwgc2NyZWVuLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlcnZlcihnbykge1xuICB0aGlzLmdvID0gZ29cblxuICAvL3RoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4OTk5XCIpXG4gIHRoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL251YmFyaWEuaGVyb2t1YXBwLmNvbTo1NDA4MlwiKVxuICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5sb2dpbih0aGlzLmdvLmNoYXJhY3RlcilcbiAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGV0IHBheWxvYWQgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpXG4gICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvbikge1xuICAgICAgY2FzZSBcImxvZ2luXCI6XG4gICAgICAgIGxldCBuZXdfY2hhciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICAgIG5ld19jaGFyLm5hbWUgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWVcbiAgICAgICAgbmV3X2NoYXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICBuZXdfY2hhci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4gICAgICAgIGNvbnNvbGUubG9nKGBBZGRpbmcgbmV3IGNoYXJgKVxuICAgICAgICBwbGF5ZXJzLnB1c2gobmV3X2NoYXIpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwicGluZ1wiOlxuICAgICAgICAvL2dvLmN0eC5maWxsUmVjdChwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLngsIHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueSwgNTAsIDUwKVxuICAgICAgICAvL2dvLmN0eC5zdHJva2UoKVxuICAgICAgICAvL2xldCBwbGF5ZXIgPSBwbGF5ZXJzWzBdIC8vcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIubmFtZSA9PT0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lKVxuICAgICAgICAvL2lmIChwbGF5ZXIpIHtcbiAgICAgICAgLy8gIHBsYXllci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4gICAgICAgIC8vICBwbGF5ZXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICAvL31cbiAgICAgICAgLy9icmVhaztcbiAgICB9XG4gIH0gLy9cbiAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cblxuICB0aGlzLnBpbmcgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLCBcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTa2lsbCh7IGdvLCBlbnRpdHksIHNraWxsIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuc2tpbGwgPSBza2lsbFxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2tpbGwuYWN0KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJlbW92ZV9jbGlja2FibGUsIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBicmVha19zdG9uZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5IHx8IGdvLmNoYXJhY3RlclxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IHRoaXMuZW50aXR5IH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfc3RvbmUgPSB0aGlzLmdvLnN0b25lcy5maW5kKChzdG9uZSkgPT4gc3RvbmUgPT09IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICAgICAgICBpZiAoKCF0YXJnZXRlZF9zdG9uZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZW50aXR5KSA+IDEwMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgzMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ28uc3RvbmVzLmluZGV4T2YodGFyZ2V0ZWRfc3RvbmUpXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdChsb290X3RhYmxlX3N0b25lKVxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRhcmdldGVkX3N0b25lLCB0aGlzLmdvLnN0b25lcylcbiAgICAgICAgICAgICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3N0b25lLCB0aGlzLmdvKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgbG9vdF90YWJsZV9zdG9uZSA9IFt7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJGbGludHN0b25lXCIsIGltYWdlX3NyYzogXCJmbGludHN0b25lLnBuZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjaGFuY2U6IDEwMFxuICAgIH1dXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiXG5pbXBvcnQgeyBWZWN0b3IyLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIHJlbW92ZV9jbGlja2FibGUgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3V0VHJlZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5sb290X2JveCA9IGdvLmxvb3RfYm94XG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTsgLy8gTWF5YmUgR2FtZU9iamVjdCBzaG91bGQgY29udHJvbCB0aGlzIHRvZ2dsZVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3RyZWUgPSB0aGlzLmdvLnRyZWVzLmZpbmQoKHRyZWUpID0+IHRyZWUgPT09IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICAgICAgICBpZiAoKCF0YXJnZXRlZF90cmVlKSB8fCAoVmVjdG9yMi5kaXN0YW5jZSh0YXJnZXRlZF90cmVlLCB0aGlzLmdvLmNoYXJhY3RlcikgPiAyMDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdvLnRyZWVzLmluZGV4T2YodGFyZ2V0ZWRfdHJlZSlcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vdGJveGVzIGhhdmUgdG8gbW92ZSBmcm9tIHdlaXJkXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KHRoaXMubG9vdF90YWJsZSlcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0YXJnZXRlZF90cmVlLCB0aGlzLmdvLnRyZWVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF90cmVlLCB0aGlzLmdvKVxuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmxvb3RfdGFibGUgPSBbe1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiV29vZFwiLCBpbWFnZV9zcmM6IFwiYnJhbmNoLnBuZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAzLFxuICAgICAgICBjaGFuY2U6IDk1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiRHJ5IExlYXZlc1wiLCBpbWFnZV9zcmM6IFwibGVhdmVzLmpwZWdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMyxcbiAgICAgICAgY2hhbmNlOiAxMDBcbiAgICAgIH1dXG4gICAgICBcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCI7XG5pbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi4vcmVzb3VyY2VfYmFyXCI7XG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1ha2VGaXJlKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5IHx8IGdvLmNoYXJhY3RlclxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IHRoaXMuZW50aXR5IH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRyeV9sZWF2ZXMgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcImRyeSBsZWF2ZXNcIilcbiAgICAgICAgbGV0IHdvb2QgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcIndvb2RcIilcbiAgICAgICAgbGV0IGZsaW50c3RvbmUgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcImZsaW50c3RvbmVcIilcbiAgICAgICAgaWYgKGRyeV9sZWF2ZXMgJiYgZHJ5X2xlYXZlcy5xdWFudGl0eSA+IDAgJiZcbiAgICAgICAgICAgIHdvb2QgJiYgd29vZC5xdWFudGl0eSA+IDAgJiZcbiAgICAgICAgICAgIGZsaW50c3RvbmUgJiYgZmxpbnRzdG9uZS5xdWFudGl0eSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZHJ5X2xlYXZlcy5xdWFudGl0eSAtPSAxXG4gICAgICAgICAgICAgICAgd29vZC5xdWFudGl0eSAtPSAxXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnR5cGUgPT09IFwiQk9ORklSRVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJlID0gdGhpcy5nby5maXJlcy5maW5kKChmaXJlKSA9PiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZmlyZSk7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuZnVlbCArPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCArPSAyMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnR5cGUgPSBcIkJPTkZJUkVcIlxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlLnNyYyA9IFwiYm9uZmlyZS5wbmdcIlxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3hfb2Zmc2V0ID0gMjUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfeV9vZmZzZXQgPSAyNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV9oZWlnaHQgPSAzNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV93aWR0aCA9IDMwMFxuICAgICAgICAgICAgICAgICAgICBmaXJlLndpZHRoID0gNjRcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5oZWlnaHQgPSA2NFxuICAgICAgICAgICAgICAgICAgICBmaXJlLnggPSB0aGlzLmVudGl0eS54O1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnkgPSB0aGlzLmVudGl0eS55O1xuICAgICAgICAgICAgICAgICAgICBmaXJlLmZ1ZWwgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbzogdGhpcy5nbywgdGFyZ2V0OiBmaXJlIH0pXG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLnN0YXRpYyA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuZnVsbCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uZmlyZXMucHVzaChmaXJlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaChmaXJlKVxuICAgICAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTUwMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWW91IGRvbnQgaGF2ZSBhbGwgcmVxdWlyZWQgbWF0ZXJpYWxzIHRvIG1ha2UgYSBmaXJlLlwiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsaW5rKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5pZCA9IFwic3BlbGxfYmxpbmtcIlxuICAgIHRoaXMuaWNvbiA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuaWNvbi5zcmMgPSBcImJsaW5rX3NwZWxsLmpwZ1wiXG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5tYW5hX2Nvc3QgPSA3XG4gICAgdGhpcy5jYXN0aW5nX3RpbWVfaW5fbXMgPSAwXG4gICAgdGhpcy5sYXN0X2Nhc3RfYXQgPSBudWxsXG4gICAgdGhpcy5jb29sZG93bl90aW1lX2luX21zID0gNzAwMFxuICAgIHRoaXMub25fY29vbGRvd24gPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3RfY2FzdF9hdCAmJiBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X2Nhc3RfYXQgPCB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXNcbiAgICB9XG5cbiAgICB0aGlzLmlzX3ZhbGlkID0gKCkgPT4gIXRoaXMub25fY29vbGRvd24oKVxuICAgIFxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gMztcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSAncHVycGxlJ1xuICAgICAgICB0aGlzLmdvLmN0eC5hcmModGhpcy5nby5tb3VzZV9wb3NpdGlvbi54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5nby5tb3VzZV9wb3NpdGlvbi55IC0gdGhpcy5nby5jYW1lcmEueSwgNTAsIDAsIE1hdGguUEkgKiAyKVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4geyB9XG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoY2xpY2tfY2FsbGJhY2ssIHRoaXMuZ28ubW91c2Vkb3duX2NhbGxiYWNrcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5nby5zcGVsbHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goY2xpY2tfY2FsbGJhY2spXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuZW50aXR5LmN1cnJlbnRfbWFuYSAtPSB0aGlzLm1hbmFfY29zdFxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjbGlja19jYWxsYmFjaywgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzKVxuICAgICAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IERhdGUubm93KClcbiAgICB9XG5cbiAgICBjb25zdCBjbGlja19jYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRpdHkueCA9IHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5lbnRpdHkueSA9IHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICB9XG59IiwiaW1wb3J0IFByb2plY3RpbGUgZnJvbSBcIi4uL3Byb2plY3RpbGVcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGcm9zdGJvbHQoeyBnbyB9KSB7XG4gICAgdGhpcy5pZCA9IFwic3BlbGxfZnJvc3Rib2x0XCJcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmljb24gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaWNvbi5zcmMgPSBcImh0dHBzOi8vY2RuYS5hcnRzdGF0aW9uLmNvbS9wL2Fzc2V0cy9pbWFnZXMvaW1hZ2VzLzAwOS8wMzEvMTkwL2xhcmdlL3JpY2hhcmQtdGhvbWFzLXBhaW50cy0xMS12Mi5qcGdcIlxuICAgIHRoaXMucHJvamVjdGlsZSA9IG5ldyBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3Q6IHRoaXMgfSlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5tYW5hX2Nvc3QgPSAxNVxuICAgIHRoaXMuY2FzdGluZ190aW1lX2luX21zID0gMTUwMFxuICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gbnVsbFxuICAgIHRoaXMuY29vbGRvd25fdGltZV9pbl9tcyA9IDEwMFxuICAgIHRoaXMub25fY29vbGRvd24gPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3RfY2FzdF9hdCAmJiBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X2Nhc3RfYXQgPCB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXNcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmRyYXcoKTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdfc2xvdCA9IChzbG90KSA9PiB7XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgeCwgeSwgdGhpcy5nby5hY3Rpb25fYmFyLnNsb3Rfd2lkdGgsIHRoaXMuZ28uYWN0aW9uX2Jhci5zbG90X2hlaWdodClcbiAgICAgICAgXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVyblxuXG4gICAgICAgIGlmICgoaXNfY29sbGlkaW5nKHRoaXMucHJvamVjdGlsZS5ib3VuZHMoKSwgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSkge1xuICAgICAgICAgICAgaWYgKGRhbWFnZWFibGUodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gcmFuZG9tKDUsIDEwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cy50YWtlX2RhbWFnZSh7IGRhbWFnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb2plY3RpbGUudXBkYXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNfdmFsaWQgPSAoKSA9PiAhdGhpcy5vbl9jb29sZG93bigpICYmIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlICYmIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnN0YXRzO1xuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBpZiAoKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBudWxsKSB8fCAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IHVuZGVmaW5lZCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzdGFydF9wb3NpdGlvbiA9IHsgeDogdGhpcy5nby5jaGFyYWN0ZXIueCArIDUwLCB5OiB0aGlzLmdvLmNoYXJhY3Rlci55ICsgNTAgfVxuICAgICAgICBjb25zdCBlbmRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueSArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2plY3RpbGUuYWN0KHsgc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbiB9KVxuXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscyk7XG4gICAgICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gRGF0ZS5ub3coKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhbWFnZWFibGUob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3Quc3RhdHMgIT09IHVuZGVmaW5lZCAmJiBvYmplY3Quc3RhdHMudGFrZV9kYW1hZ2UgIT09IHVuZGVmaW5lZFxuICAgIH1cbn0iLCJjb25zdCBkaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBNYXRoLmFicyhNYXRoLmZsb29yKGEpIC0gTWF0aC5mbG9vcihiKSk7XG59XG5cbmNvbnN0IFZlY3RvcjIgPSB7XG4gIGRpc3RhbmNlOiAoYSwgYikgPT4gTWF0aC50cnVuYyhNYXRoLnNxcnQoTWF0aC5wb3coYi54IC0gYS54LCAyKSArIE1hdGgucG93KGIueSAtIGEueSwgMikpKSxcbiAgYW5nbGU6IChjdXJyZW50X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24pID0+IE1hdGguYXRhbjIoZW5kX3Bvc2l0aW9uLnkgLSBjdXJyZW50X3Bvc2l0aW9uLnksIGVuZF9wb3NpdGlvbi54IC0gY3VycmVudF9wb3NpdGlvbi54KVxufVxuXG5jb25zdCBpc19jb2xsaWRpbmcgPSBmdW5jdGlvbihzZWxmLCB0YXJnZXQpIHtcbiAgaWYgKFxuICAgIChzZWxmLnggPCB0YXJnZXQueCArIHRhcmdldC53aWR0aCkgJiZcbiAgICAoc2VsZi54ICsgc2VsZi53aWR0aCA+IHRhcmdldC54KSAmJlxuICAgIChzZWxmLnkgPCB0YXJnZXQueSArIHRhcmdldC5oZWlnaHQpICYmXG4gICAgKHNlbGYueSArIHNlbGYuaGVpZ2h0ID4gdGFyZ2V0LnkpXG4gICkge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSBmdW5jdGlvbiAoeCA9IDEwLCB5ID0gMTAsIHcgPSAyMCwgaCA9IDIwLCBjb2xvciA9IFwicmdiKDE5MCwgMjAsIDEwKVwiKSB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xufVxuXG5jb25zdCByYW5kb20gPSAoc3RhcnQsIGVuZCkgPT4ge1xuICBpZiAoZW5kID09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHN0YXJ0XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgcmV0dXJuIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGVuZCkgKyBzdGFydCAgXG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChvYmplY3QsIGxpc3QpIHtcbiAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2Yob2JqZWN0KTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICByZXR1cm4gbGlzdC5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlX2NsaWNrYWJsZShkb29kYWQsIGdvKSB7XG4gIGNvbnN0IGNsaWNrYWJsZV9pbmRleCA9IGdvLmNsaWNrYWJsZXMuaW5kZXhPZihkb29kYWQpXG4gIGlmIChjbGlja2FibGVfaW5kZXggPiAtMSkge1xuICAgIGdvLmNsaWNrYWJsZXMuc3BsaWNlKGNsaWNrYWJsZV9pbmRleCwgMSlcbiAgfVxuICBpZiAoZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBkb29kYWQpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIH1cbn1cblxuY29uc3QgZGljZSA9IChzaWRlcywgdGltZXMgPSAxKSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKEFycmF5KHRpbWVzKSkubWFwKChpKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcykgKyAxKTtcbn1cblxuZXhwb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgZHJhd19zcXVhcmUsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBkaWNlLCByZW1vdmVfY2xpY2thYmxlIH1cbiIsImNsYXNzIFRpbGUge1xuICAgIGNvbnN0cnVjdG9yKGltYWdlX3NyYywgeF9vZmZzZXQgPSAwLCB5X29mZnNldCA9IDAsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gICAgICAgIHRoaXMueF9vZmZzZXQgPSB4X29mZnNldFxuICAgICAgICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaWxlIiwiaW1wb3J0IFRpbGUgZnJvbSBcIi4vdGlsZVwiXG5cbi8vIFRoZSBXb3JsZCBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBpdHNlbGYuXG5mdW5jdGlvbiBXb3JsZChnbykge1xuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ud29ybGQgPSB0aGlzO1xuICB0aGlzLndpZHRoID0gMTAwMDA7XG4gIHRoaXMuaGVpZ2h0ID0gMTAwMDA7XG4gIHRoaXMueF9vZmZzZXQgPSAwO1xuICB0aGlzLnlfb2Zmc2V0ID0gMDtcbiAgdGhpcy50aWxlX3NldCA9IHtcbiAgICBncmFzczogbmV3IFRpbGUoXCJncmFzcy5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBkaXJ0OiBuZXcgVGlsZShcImRpcnQyLnBuZ1wiLCAwLCAwLCA2NCwgNjMpLFxuICAgIHN0b25lOiBuZXcgVGlsZShcImZsaW50c3RvbmUucG5nXCIsIDAsIDAsIDg0MCwgODU5KSxcbiAgfVxuICB0aGlzLnBpY2tfcmFuZG9tX3RpbGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMudGlsZV9zZXQuZ3Jhc3NcbiAgfVxuICB0aGlzLnRpbGVfd2lkdGggPSA2NFxuICB0aGlzLnRpbGVfaGVpZ2h0ID0gNjRcbiAgdGhpcy50aWxlc19wZXJfcm93ID0gTWF0aC50cnVuYyh0aGlzLndpZHRoIC8gdGhpcy50aWxlX3dpZHRoKSArIDE7XG4gIHRoaXMudGlsZXNfcGVyX2NvbHVtbiA9IE1hdGgudHJ1bmModGhpcy5oZWlnaHQgLyB0aGlzLnRpbGVfaGVpZ2h0KSArIDE7XG4gIHRoaXMudGlsZXMgPSBudWxsO1xuICB0aGlzLmdlbmVyYXRlX21hcCA9ICgpID0+IHtcbiAgICB0aGlzLnRpbGVzID0gbmV3IEFycmF5KHRoaXMudGlsZXNfcGVyX3Jvdyk7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW3Jvd10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMudGlsZXNbcm93XSA9IFt0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10ucHVzaCh0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGxldCB0aWxlID0gdGhpcy50aWxlc1tyb3ddW2NvbHVtbl1cbiAgICAgICAgaWYgKHRpbGUgIT09IHRoaXMudGlsZV9zZXQuZ3Jhc3MpIHtcbiAgICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy50aWxlX3NldC5ncmFzcy5pbWFnZSxcbiAgICAgICAgICAgIHRoaXMudGlsZV9zZXQuZ3Jhc3MueF9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3MueV9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3Mud2lkdGgsIHRoaXMudGlsZV9zZXQuZ3Jhc3MuaGVpZ2h0LFxuICAgICAgICAgICAgdGhpcy54X29mZnNldCArIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCxcbiAgICAgICAgICAgIHRoaXMueV9vZmZzZXQgKyAoY29sdW1uICogdGhpcy50aWxlX2hlaWdodCkgLSB0aGlzLmdvLmNhbWVyYS55LCA2NCwgNjMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRpbGUuaW1hZ2UsXG4gICAgICAgICAgdGlsZS54X29mZnNldCwgdGlsZS55X29mZnNldCwgdGlsZS53aWR0aCwgdGlsZS5oZWlnaHQsXG4gICAgICAgICAgdGhpcy54X29mZnNldCArIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCxcbiAgICAgICAgICB0aGlzLnlfb2Zmc2V0ICsgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjUsIDY1KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXb3JsZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEtleWJvYXJkSW5wdXQgZnJvbSBcIi4va2V5Ym9hcmRfaW5wdXQuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQge1xuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbmltcG9ydCBHYW1lTG9vcCBmcm9tIFwiLi9nYW1lX2xvb3AuanNcIlxuaW1wb3J0IFdvcmxkIGZyb20gXCIuL3dvcmxkLmpzXCJcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4vZG9vZGFkLmpzXCJcbmltcG9ydCBDb250cm9scyBmcm9tIFwiLi9jb250cm9scy5qc1wiXG5pbXBvcnQgU2VydmVyIGZyb20gXCIuL3NlcnZlclwiXG5pbXBvcnQgTG9vdEJveCBmcm9tIFwiLi9sb290X2JveC5qc1wiXG5pbXBvcnQgQ3JlZXAgZnJvbSBcIi4vYmVpbmdzL2NyZWVwLmpzXCJcbmltcG9ydCBBY3Rpb25CYXIgZnJvbSBcIi4vYWN0aW9uX2Jhci5qc1wiXG5pbXBvcnQgU3RvbmUgZnJvbSBcIi4vYmVpbmdzL3N0b25lLmpzXCJcbmltcG9ydCBUcmVlIGZyb20gXCIuL2JlaW5ncy90cmVlLmpzXCJcbmltcG9ydCBFZGl0b3IgZnJvbSBcIi4vZWRpdG9yL2luZGV4LmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXIuanNcIlxuXG5jb25zdCBnbyA9IG5ldyBHYW1lT2JqZWN0KClcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGdvKVxuY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCB3b3JsZCA9IG5ldyBXb3JsZChnbylcbmNvbnN0IGNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGdvKVxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbylcbmNvbnN0IGxvb3RfYm94ID0gbmV3IExvb3RCb3goZ28pXG5jb25zdCBhY3Rpb25fYmFyID0gbmV3IEFjdGlvbkJhcihnbylcbmNvbnN0IGVkaXRvciA9IG5ldyBFZGl0b3IoeyBnbyB9KVxuY29uc3QgZXhwZXJpZW5jZV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB7IHg6IGdvLnNjcmVlbi53aWR0aCAvIDIgLSA1MDAsIHk6IGdvLnNjcmVlbi5oZWlnaHQgLSAzMCwgd2lkdGg6IDEwMDAsIGhlaWdodDogNSB9LCBjb2xvdXI6IFwicHVycGxlXCIsIGJvcmRlcjogXCJ3aGl0ZVwiLCBmaXhlZDogdHJ1ZSB9KTtcbmV4cGVyaWVuY2VfYmFyLmhlaWdodCA9IDMwXG5cbi8vIERpc2FibGUgcmlnaHQgbW91c2UgY2xpY2tcbmdvLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9XG5cbmNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IHNldENsaWNrQ2FsbGJhY2soZ28pXG5jbGlja19jYWxsYmFja3MucHVzaChjbGlja2FibGVfY2xpY2tlZClcbmZ1bmN0aW9uIGNsaWNrYWJsZV9jbGlja2VkKGV2KSB7XG4gIGxldCBjbGljayA9IHsgeDogZXYuY2xpZW50WCArIGdvLmNhbWVyYS54LCB5OiBldi5jbGllbnRZICsgZ28uY2FtZXJhLnksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICBjb25zdCBjbGlja2FibGUgPSBnby5jbGlja2FibGVzLmZpbmQoKGNsaWNrYWJsZSkgPT4gaXNfY29sbGlkaW5nKGNsaWNrYWJsZSwgY2xpY2spKVxuICBpZiAoY2xpY2thYmxlKSB7XG4gICAgY2xpY2thYmxlLmFjdGl2YXRlZCA9ICFjbGlja2FibGUuYWN0aXZhdGVkXG4gIH1cbiAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gY2xpY2thYmxlXG59XG5cbmxldCBtb3VzZV9pc19kb3duID0gZmFsc2VcbmdvLm1vdXNlX3Bvc2l0aW9uID0ge31cbmNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbylcbm1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcbmZ1bmN0aW9uIHRyYWNrX21vdXNlX3Bvc2l0aW9uKGV2dCkge1xuICB2YXIgcmVjdCA9IGdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBnby5tb3VzZV9wb3NpdGlvbiA9IHtcbiAgICB4OiBldnQuY2xpZW50WCAtIHJlY3QubGVmdCArIGNhbWVyYS54LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3AgKyBjYW1lcmEueVxuICB9XG59XG5jb25zdCBtb3VzZWRvd25fY2FsbGJhY2tzID0gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pXG5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbmNvbnN0IG1vdXNldXBfY2FsbGJhY2tzID0gc2V0TW91c2V1cENhbGxiYWNrKGdvKVxubW91c2V1cF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSBmYWxzZSlcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2gobG9vdF9ib3guY2hlY2tfaXRlbV9jbGlja2VkLmJpbmQobG9vdF9ib3gpKVxuY29uc3QgdG91Y2hzdGFydF9jYWxsYmFja3MgPSBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pXG50b3VjaHN0YXJ0X2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5jb25zdCB0b3VjaGVuZF9jYWxsYmFja3MgPSBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKVxudG91Y2hlbmRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5mdW5jdGlvbiBjb250cm9sc19tb3ZlbWVudCgpIHtcbiAgLy8gZ28uY2xpY2thYmxlcy5mb3JFYWNoKChjbGlja2FibGUpID0+IHtcbiAgLy8gICBpZiAoY2xpY2thYmxlLmFjdGl2YXRlZCkge1xuICAvLyAgICAgY2xpY2thYmxlLmNsaWNrKClcbiAgLy8gICB9XG4gIC8vIH0pXG59XG5cblxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuZiA9IFtjaGFyYWN0ZXIuc2tpbGxfYWN0aW9uXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMF0gPSBbY2hhcmFjdGVyLnNraWxscy5tYWtlX2ZpcmVdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1sxXSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmZyb3N0Ym9sdF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWzJdID0gW2NoYXJhY3Rlci5zcGVsbHMuYmxpbmtdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5pID0gW2NoYXJhY3Rlci5pbnZlbnRvcnkudG9nZ2xlX2Rpc3BsYXldXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5iID0gW2NoYXJhY3Rlci5ib2FyZC50b2dnbGVfZ3JpZF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmUgPSBbKCkgPT4gZWRpdG9yLmFjdGl2ZSA9ICFlZGl0b3IuYWN0aXZlXVxuLy9rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5wID0gW2JvYXJkLndheV90b19wbGF5ZXJdXG5cbmxldCBlbGFwc2VkX3RpbWUgPSAwXG5sZXQgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxubGV0IGZyYW1lcyA9IDA7XG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGZyYW1lcyArPSAxO1xuICBlbGFwc2VkX3RpbWUgPSBEYXRlLm5vdygpIC0gbGFzdF90aWNrXG4gIGlmICgoZWxhcHNlZF90aW1lKSA+IDEwMDApIHtcbiAgICBmcmFtZXMgPSAwO1xuICAgIGxhc3RfdGljayA9IERhdGUubm93KClcbiAgICB1cGRhdGVfZnBzKClcbiAgfVxuICBpZiAoIWNoYXJhY3Rlci5zdGF0cy5pc19hbGl2ZSgpKSB7XG4gICAgY29udHJvbHNfbW92ZW1lbnQoKVxuICB9IGVsc2Uge1xuICAgIGdvLnVwZGF0ZV9vYmplY3RzKClcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVfZnBzKCkge1xuICBpZiAoY2hhcmFjdGVyLnN0YXRzLmlzX2FsaXZlKCkpIHtcbiAgICBjaGFyYWN0ZXIudXBkYXRlX2ZwcygpXG4gIH1cbiAgZ28udXBkYXRlX2Zwc19vYmplY3RzKClcbn1cbi8vIENvbW1lbnRcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIGlmIChjaGFyYWN0ZXIuc3RhdHMuaXNfZGVhZCgpKSB7XG4gICAgc2NyZWVuLmRyYXdfZ2FtZV9vdmVyKClcbiAgfSBlbHNlIHtcbiAgICBzY3JlZW4uZHJhdygpXG4gICAgZ28uZHJhd19zZWxlY3RlZF9jbGlja2FibGUoKVxuICAgIGdvLmRyYXdfb2JqZWN0cygpXG4gICAgY2hhcmFjdGVyLmRyYXcoKVxuICAgIHNjcmVlbi5kcmF3X2ZvZygpXG4gICAgbG9vdF9ib3guZHJhdygpXG4gICAgZ28uY2hhcmFjdGVyLmludmVudG9yeS5kcmF3KClcbiAgICBhY3Rpb25fYmFyLmRyYXcoKVxuICAgIGNoYXJhY3Rlci5ib2FyZC5kcmF3KClcbiAgICBlZGl0b3IuZHJhdygpXG4gICAgZXhwZXJpZW5jZV9iYXIuZHJhdygxMDAwLCBnby5jaGFyYWN0ZXIuZXhwZXJpZW5jZV9wb2ludHMpXG4gICAgaWYgKHNob3dfY29udHJvbF93aGVlbCkgZHJhd19jb250cm9sX3doZWVsKClcbiAgfVxufSBcblxuLy8gVHJlZXNcbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBsZXQgdHJlZSA9IG5ldyBUcmVlKHsgZ28gfSlcbiAgZ28udHJlZXMucHVzaCh0cmVlKVxuICBnby5jbGlja2FibGVzLnB1c2godHJlZSlcbn0pXG4vLyBTdG9uZXNcbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBjb25zdCBzdG9uZSA9IG5ldyBTdG9uZSh7IGdvIH0pO1xuICBnby5zdG9uZXMucHVzaChzdG9uZSlcbiAgZ28uY2xpY2thYmxlcy5wdXNoKHN0b25lKVxufSlcbi8vIENyZWVwXG5mb3IgKGxldCBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgbGV0IGNyZWVwID0gbmV3IENyZWVwKHsgZ28gfSk7XG4gIGdvLmNsaWNrYWJsZXMucHVzaChjcmVlcCk7XG59XG5jb25zdCBkdW1teSA9IG5ldyBDcmVlcCh7IGdvIH0pXG5kdW1teS54ID0gODAwO1xuZHVtbXkueSA9IDIwMDtcbmdvLmNsaWNrYWJsZXMucHVzaChkdW1teSlcblxubGV0IG9yZGVyZWRfY2xpY2thYmxlcyA9IFtdO1xuY29uc3QgdGFiX2N5Y2xpbmcgPSAoZXYpID0+IHtcbiAgZXYucHJldmVudERlZmF1bHQoKVxuICBvcmRlcmVkX2NsaWNrYWJsZXMgPSBnby5jcmVlcHMuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBWZWN0b3IyLmRpc3RhbmNlKGEsIGNoYXJhY3RlcikgLSBWZWN0b3IyLmRpc3RhbmNlKGIsIGNoYXJhY3Rlcik7XG4gIH0pXG4gIGlmIChWZWN0b3IyLmRpc3RhbmNlKG9yZGVyZWRfY2xpY2thYmxlc1swXSwgY2hhcmFjdGVyKSA+IDUwMCkgcmV0dXJuO1xuXG4gIGlmIChvcmRlcmVkX2NsaWNrYWJsZXNbMF0gPT09IGdvLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG9yZGVyZWRfY2xpY2thYmxlc1sxXTtcbiAgfSBlbHNlIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBvcmRlcmVkX2NsaWNrYWJsZXNbMF1cbiAgfVxufVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbXCJUYWJcIl0gPSBbdGFiX2N5Y2xpbmddXG5cbmxldCBzaG93X2NvbnRyb2xfd2hlZWwgPSBmYWxzZVxuY29uc3QgZHJhd19jb250cm9sX3doZWVsID0gKCkgPT4ge1xuICBnby5jdHguYmVnaW5QYXRoKClcbiAgZ28uY3R4LmFyYyhcbiAgICBjaGFyYWN0ZXIueCArIChjaGFyYWN0ZXIud2lkdGggLyAyKSAtIGdvLmNhbWVyYS54LFxuICAgIGNoYXJhY3Rlci55ICsgKGNoYXJhY3Rlci5oZWlnaHQgLyAyKSAtIGdvLmNhbWVyYS55LFxuICAgIDIwMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgZ28uY3R4LmxpbmVXaWR0aCA9IDVcbiAgZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJ3aGl0ZVwiXG4gIGdvLmN0eC5zdHJva2UoKTtcbn1cbmNvbnN0IHRvZ2dsZV9jb250cm9sX3doZWVsID0gKCkgPT4geyBzaG93X2NvbnRyb2xfd2hlZWwgPSAhc2hvd19jb250cm9sX3doZWVsIH1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wiY1wiXSA9IFt0b2dnbGVfY29udHJvbF93aGVlbF1cblxuY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbmdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gZ28ua2V5Ym9hcmRfaW5wdXQucHJvY2Vzc19rZXlzX2Rvd25cbmdhbWVfbG9vcC51cGRhdGUgPSB1cGRhdGVcblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNoYXJhY3Rlci54ID0gMTAwXG4gIGNoYXJhY3Rlci55ID0gMTAwXG4gIGdvLndvcmxkLmdlbmVyYXRlX21hcCgpXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xufVxuXG5zdGFydCgpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9