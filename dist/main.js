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
        this.entity.is_busy_with = null
        ;(0,_tapete_js__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.managed_objects)
        if (this.entity.stats.current_mana > this.spell.mana_cost) {
            this.entity.stats.current_mana -= this.spell.mana_cost
            this.spell.act()
        }
    }

    this.cast = () => {
        this.go.action_bar.highlight_cast(this.spell);
        if (!this.spell.is_valid()) return;

        this.entity.is_busy_with = this.casting_bar
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
        new ScrollDamageText({ go: this.go, entity: this.entity, damage }).spawn()
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

    function ScrollDamageText({ go, entity, damage }) {
        this.go = go;
        this.entity = entity;
        this.damage = damage;
        this.active = false
        this.starting_time = null
        this.display_time = 2000
        this.font_size = 21
        this.x = this.entity.x + ((0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(0, this.entity.width)) - this.go.camera.x
        this.y = this.entity.y - this.go.camera.y

        this.spawn = () => {
            this.starting_time = Date.now();
            this.active = true
            this.go.managed_objects.push(this);
        }

        this.draw = () => {
            this.go.ctx.fillStyle = 'white'
            this.go.ctx.font = `${this.font_size}px sans-serif`
            let text = `${this.damage}`
            this.go.ctx.fillText(text, this.x, this.entity.y - this.go.camera.y)
        }

        this.update = () => { 
            if (this.active && Date.now() > this.starting_time + this.display_time) {
                this.active = false
                ;(0,_tapete__WEBPACK_IMPORTED_MODULE_1__.remove_object_if_present)(this, this.go.managed_objects)
            }
            this.font_size += 0.2
            this.y -= 0.2
        }
        this.update_fps = () => { }
        this.end = () => { }
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
            this.go.selected_clickable = null;
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
    this.width = entity.width
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
  this.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
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
  this.is_busy = false
  this.is_busy_with = null;

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

  this.escape_key = () => {
    if (this.is_busy_with) {
      this.is_busy_with.stop();
    } else {
      this.go.start_menu.active = !this.go.start_menu.active
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
      let payload = {
        action: "move",
        args: {
          player: {
            id: this.id,
          },
          x: this.x,
          y: this.y
        }
      }
      this.go.server.conn.send(JSON.stringify(payload))
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
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete */ "./src/tapete.js");


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
      (0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this, go.fires)
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
  go.click_callbacks = click_callbacks
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
  this.character = {}
  this.clickables = []
  this.messages = []
  this.selected_clickable = null
  this.players = []
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
    this.players.forEach(player => player.draw())
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

  this.draw_fog = (radius) => {
    var x = this.go.character.x + this.go.character.width / 2 - this.go.camera.x
    var y = this.go.character.y + this.go.character.height / 2 - this.go.camera.y
    var gradient = this.go.ctx.createRadialGradient(x, y, 0, x, y, radius || this.radius);
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
/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character */ "./src/character.js");


function Server(go, player) {
  this.go = go
  this.player = player
  this.go.character = player
  go.server = this

  this.conn = undefined;
  this.connect = () => {
    this.conn = new WebSocket("ws://0.tcp.eu.ngrok.io:17890");
    this.conn.onopen = () => this.login(this.go.character)
    this.conn.onmessage = function (event) {
      let payload = JSON.parse(event.data)
      console.log(payload)
      switch (payload.type) {
        case "login", "firstLoad":
          first_load(payload)
          break;
        case "moveLoad":
          const player = this.go.players.find(player => payload.player.id === player.id)
          if (!player) {
            console.log("Player not found")
            return
          }
          if (player.id === this.go.character.id) {
            console.log("Ignoring moveLoad for self")
          } else {
            console.log(`Player found: ${player.name}`)
          }
          player.x = payload.target.x
          player.y = payload.target.y
          break;
        case "newPlayerLoad":
          const new_player = new _character__WEBPACK_IMPORTED_MODULE_0__["default"](go)
          new_player.id = payload.player.id
          new_player.x = payload.player.position.x
          new_player.y = payload.player.position.y
          go.players.push(new_player)
          go.clickables.push(new_player)
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
    }.bind(this)
  }

  function first_load(payload, player) {
    go.character.id = payload.currentPlayer.id
    go.character.name = payload.currentPlayer.name
    go.character.x = payload.currentPlayer.position.x
    go.character.y = payload.currentPlayer.position.y
    payload.otherPlayers.forEach((otherPlayerPayload) => {
      let otherPlayer = new _character__WEBPACK_IMPORTED_MODULE_0__["default"](go)
      otherPlayer.id = otherPlayerPayload.id
      otherPlayer.x = otherPlayerPayload.position.x
      otherPlayer.y = otherPlayerPayload.position.y
      go.players.push(otherPlayer)
      go.clickables.push(otherPlayer)
    })
    go.camera.focus(go.character)
  }

  this.login = function (character) {
    let payload = {
      action: "login",
      args: {
        player: {
          id: character.id,
          name: character.name,
        },
        x: character.x,
        y: character.y
      }
    }
    this.conn.send(JSON.stringify(payload))
  }

  this.ping = function (character) {
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
        this.go.camera.focus(this.entity)
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

/***/ "./src/start_menu.js":
/*!***************************!*\
  !*** ./src/start_menu.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StartMenu)
/* harmony export */ });
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tapete */ "./src/tapete.js");


function StartMenu({ go }) {
    this.go = go
    this.go.start_menu = this
    this.active = true
    this.button_width = 300
    this.button_height = 50

    this.check_button_clicked = (ev) => {
        if (!this.active) return;

        let click = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
        this.buttons.forEach((button) => {
            if ((0,_tapete__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(click, button)) {
                button.perform()
            }
        })
    }
    this.go.click_callbacks.push(this.check_button_clicked)

    this.draw = () => {
        if (!this.active) return;

        this.go.screen.draw_fog(0);
        const x = this.go.canvas_rect.width / 3;
        const y = this.go.canvas_rect.height / 3;
        this.go.ctx.fillStyle = 'gray';
        this.go.ctx.fillRect(x, y, x, y);
        const title = "Nubaria"
        this.go.ctx.fillStyle = 'black'
        this.go.ctx.font = '72px serif';
        this.go.ctx.fillText(title, x + x / 4, y + 70)

        for (let index = 0; index < this.buttons.length; index++) {
            const button = this.buttons[index];
            const x_offset = x + x / 2;
            const y_offset = y + y / 3 + index * 50 + index * 10;
            this.go.ctx.fillStyle = button.is_hovered ? "rgba(9, 100, 80, 1)" : "rgba(7, 1, 3, 1)"
            this.go.ctx.fillRect(x_offset - this.button_width / 2, y_offset, this.button_width, this.button_height)
            this.buttons[index].x = x_offset - this.button_width / 2;
            this.buttons[index].y = y_offset;
            this.buttons[index].width = this.button_width
            this.buttons[index].height = this.button_height
            this.go.ctx.fillStyle = "white";
            this.go.ctx.font = "21px sans-serif"
            var text_measurement = this.go.ctx.measureText(button.text)
            this.go.ctx.fillText(button.text, x_offset - (text_measurement.width / 2), y_offset + (this.button_height / 2) + this.approximate_line_height / 2)
        }
    }

    this.update = () => {
        this.buttons.find((button) => {
            if ((0,_tapete__WEBPACK_IMPORTED_MODULE_0__.is_colliding)(this.go.mouse_position, button)) {
                button.is_hovered = true
            } else {
                button.is_hovered = false
            }
        })
    }

    // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
    this.approximate_line_height = this.go.ctx.measureText('M').width;

    this.buttons = [
        {
            menu: this,
            id: "new_game",
            text: "new",
            perform: function () {
                console.log("new_game button clicked")
                this.menu.active = false;
                this.menu.go.server.connect()
            }
        },
        {
            menu: this,
            id: "load_game",
            text: "load",
            perform: function () {
                console.log("load_game button clicked")
            }
        },
        {
            menu: this,
            id: "save_game",
            text: "save",
            perform: function () {
                console.log("save_game button clicked")
            }
        },
        {
            menu: this,
            id: "exit_game",
            text: "exit",
            perform: function () {
                console.log("exit_game button clicked")
            }
        }
    ]
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
  const self_position = { widht: 1, height: 1, ...self }
  const target_position = { widht: 1, height: 1, ...target }
  if (
    (self_position.x < target_position.x + target_position.width) &&
    (self_position.x + self_position.width > target_position.x) &&
    (self_position.y < target_position.y + target_position.height) &&
    (self_position.y + self_position.height > target_position.y)
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
/* harmony import */ var _start_menu_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./start_menu.js */ "./src/start_menu.js");





















const go = new _game_object_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
// ---
// Disable right mouse click
go.canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }

const click_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setClickCallback)(go)
const mousemove_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMouseMoveCallback)(go)
const mousedown_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMousedownCallback)(go)
const mouseup_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setMouseupCallback)(go)
const touchstart_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setTouchstartCallback)(go)
const touchend_callbacks = (0,_events_callbacks_js__WEBPACK_IMPORTED_MODULE_6__.setTouchendCallback)(go)

//-----
const camera = new _camera_js__WEBPACK_IMPORTED_MODULE_2__["default"](go)
const screen = new _screen_js__WEBPACK_IMPORTED_MODULE_1__["default"](go)
const start_menu = new _start_menu_js__WEBPACK_IMPORTED_MODULE_19__["default"]({ go })
const character = new _character_js__WEBPACK_IMPORTED_MODULE_3__["default"](go)
const server = new _server__WEBPACK_IMPORTED_MODULE_11__["default"](go, character)
const keyboard_input = new _keyboard_input_js__WEBPACK_IMPORTED_MODULE_4__["default"](go)
const world = new _world_js__WEBPACK_IMPORTED_MODULE_8__["default"](go)
const controls = new _controls_js__WEBPACK_IMPORTED_MODULE_10__["default"](go)
const loot_box = new _loot_box_js__WEBPACK_IMPORTED_MODULE_12__["default"](go)
const action_bar = new _action_bar_js__WEBPACK_IMPORTED_MODULE_14__["default"](go)
const editor = new _editor_index_js__WEBPACK_IMPORTED_MODULE_17__["default"]({ go })
const experience_bar = new _resource_bar_js__WEBPACK_IMPORTED_MODULE_18__["default"]({ go, target: { x: go.screen.width / 2 - 500, y: go.screen.height - 30, width: 1000, height: 5 }, colour: "purple", border: "white", fixed: true });
experience_bar.height = 30

// Callbacks
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  go.mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y,
    width: 1,
    height: 1
  }
}

go.mouse_position = {}
let mouse_is_down = false
mousedown_callbacks.push((ev) => mouse_is_down = true)
mouseup_callbacks.push((ev) => mouse_is_down = false)
mouseup_callbacks.push(loot_box.check_item_clicked.bind(loot_box))
touchstart_callbacks.push((ev) => mouse_is_down = true)
touchend_callbacks.push((ev) => mouse_is_down = false)

function clickable_clicked(ev) {
  let click = { x: ev.clientX + go.camera.x, y: ev.clientY + go.camera.y, width: 1, height: 1 }
  const clickable = go.clickables.find((clickable) => (0,_tapete_js__WEBPACK_IMPORTED_MODULE_5__.is_colliding)(clickable, click))
  if (clickable) {
    clickable.activated = !clickable.activated
  }
  go.selected_clickable = clickable
}
click_callbacks.push(clickable_clicked)

mousemove_callbacks.push(track_mouse_position)

keyboard_input.on_keydown_callbacks['Escape'] = [character.escape_key]
keyboard_input.on_keydown_callbacks.f = [character.skill_action]
keyboard_input.on_keydown_callbacks[0] = [character.skills.make_fire]
keyboard_input.on_keydown_callbacks[1] = [character.spells.frostbolt]
keyboard_input.on_keydown_callbacks[2] = [character.spells.blink]
keyboard_input.on_keydown_callbacks.i = [character.inventory.toggle_display]
keyboard_input.on_keydown_callbacks.b = [character.board.toggle_grid]
keyboard_input.on_keydown_callbacks.e = [() => editor.active = !editor.active]
//keyboard_input.on_keydown_callbacks.p = [board.way_to_player]

// END -- Callbacks

let elapsed_time = 0
let last_tick = Date.now()
let frames = 0;
const update = () => {
  if (start_menu.active) {
    start_menu.update()
    return;
  }
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
  if (start_menu.active) return;

  if (character.stats.is_alive()) {
    character.update_fps()
  }
  go.update_fps_objects()
}
// Comment
const draw = () => {
  if (start_menu.active) {
    start_menu.draw();
    return
  }
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

const start = async () => {
  character.x = 100
  character.y = 100
  go.world.generate_map()

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBVUU7Ozs7Ozs7Ozs7Ozs7OztBQ2xGRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7QUMxQnZCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7OztBQy9EQSxxQkFBcUIsSUFBSTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLDJCQUEyQixlQUFlLEVBQUUsVUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHdEQUFJLEdBQUcsSUFBSTtBQUM1QjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxvQkFBb0IseURBQUssR0FBRyxJQUFJO0FBQ2hDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4QixrQkFBa0IseURBQUssR0FBRyxJQUFJO0FBQzlCO0FBQ0E7QUFDQSxrQkFBa0IseURBQUssR0FBRyxJQUFJO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsd0RBQWdCLGlCQUFpQix3REFBZ0I7QUFDNUQsR0FBRztBQUNILE1BQU0sd0RBQWdCOztBQUV0QjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUEsc0JBQXNCLHFEQUFRO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FjdGlvbl9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvYWdncm8uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbG9vdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9tb3ZlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL3NwZWxsY2FzdGluZy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zdGF0cy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaW5ncy9jcmVlcC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaW5ncy9sb290X2JhZy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaW5ncy9zdG9uZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaW5ncy90cmVlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYm9hcmQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jYXN0aW5nX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NsaWNrYWJsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NvbnRyb2xzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZG9vZGFkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZWRpdG9yL2luZGV4LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZXZlbnRzX2NhbGxiYWNrcy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfbG9vcC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dhbWVfb2JqZWN0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvaW52ZW50b3J5LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvaXRlbS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2tleWJvYXJkX2lucHV0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbG9vdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3RfYm94LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3BhcnRpY2xlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcHJvamVjdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Jlc291cmNlX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NjcmVlbi5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxsLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGxzL2JyZWFrX3N0b25lLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGxzL2N1dF90cmVlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGxzL21ha2VfZmlyZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NwZWxscy9ibGluay5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NwZWxscy9mcm9zdGJvbHQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zdGFydF9tZW51LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZVwiO1xuXG5mdW5jdGlvbiBBY3Rpb25CYXIoZ2FtZV9vYmplY3QpIHtcbiAgdGhpcy5nYW1lX29iamVjdCA9IGdhbWVfb2JqZWN0XG4gIHRoaXMuZ2FtZV9vYmplY3QuYWN0aW9uX2JhciA9IHRoaXNcbiAgdGhpcy5udW1iZXJfb2Zfc2xvdHMgPSAxMFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gdGhpcy5nYW1lX29iamVjdC50aWxlX3NpemUgKiAzO1xuICB0aGlzLnNsb3Rfd2lkdGggPSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDM7XG4gIHRoaXMueV9vZmZzZXQgPSAxMDBcbiAgdGhpcy5hY3Rpb25fYmFyX3dpZHRoID0gdGhpcy5udW1iZXJfb2Zfc2xvdHMgKiB0aGlzLnNsb3Rfd2lkdGhcbiAgdGhpcy5hY3Rpb25fYmFyX2hlaWdodCA9IHRoaXMubnVtYmVyX29mX3Nsb3RzICogdGhpcy5zbG90X2hlaWdodFxuICB0aGlzLmFjdGlvbl9iYXJfeCA9ICh0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LndpZHRoIC8gMikgLSAodGhpcy5hY3Rpb25fYmFyX3dpZHRoIC8gMilcbiAgdGhpcy5hY3Rpb25fYmFyX3kgPSB0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LmhlaWdodCAtIHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogNCAtIHRoaXMueV9vZmZzZXRcblxuICAvLyBjaGFyYWN0ZXItc3BlY2lmaWNcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuc2xvdF9zaXplID0gMTBcbiAgdGhpcy5zbG90c1swXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5mcm9zdGJvbHRcbiAgdGhpcy5zbG90c1sxXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5ibGlua1xuICAvLyBFTkQgLS0gY2hhcmFjdGVyLXNwZWNpZmljXG5cbiAgdGhpcy5oaWdobGlnaHRzID0gW11cblxuICBmdW5jdGlvbiBTbG90KHsgc3BlbGwsIHgsIHkgfSkge1xuICAgIHRoaXMuc3BlbGwgPSBzcGVsbFxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIHRoaXMuaGlnaGxpZ2h0X2Nhc3QgPSAoc3BlbGwpID0+IHtcbiAgICB0aGlzLmhpZ2hsaWdodHMucHVzaChzcGVsbClcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzbG90X2luZGV4ID0gMDsgc2xvdF9pbmRleCA8PSB0aGlzLnNsb3Rfc2l6ZTsgc2xvdF9pbmRleCsrKSB7XG4gICAgICB2YXIgc2xvdCA9IHRoaXMuc2xvdHNbc2xvdF9pbmRleF07XG5cbiAgICAgIHZhciB4ID0gdGhpcy5hY3Rpb25fYmFyX3ggKyAodGhpcy5zbG90X3dpZHRoICogc2xvdF9pbmRleClcbiAgICAgIHZhciB5ID0gdGhpcy5hY3Rpb25fYmFyX3lcblxuICAgICAgaWYgKHNsb3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSBcInJnYmEoNDYsIDQ2LCA0NiwgMSlcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZXZpb2xldFwiXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgICAgeCwgeSxcbiAgICAgICAgICB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHRcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5kcmF3SW1hZ2Uoc2xvdC5pY29uLCB4LCB5LCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlU3R5bGUgPSBcImJsdWV2aW9sZXRcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0XG4gICAgICAgIClcblxuICAgICAgICAvLyBIaWdobGlnaHQ6IHRoZSBhY3Rpb24gYmFyIFwiYmxpbmtzXCIgZm9yIGEgZnJhbWUgd2hlbiB0aGUgc3BlbGwgaXMgY2FzdFxuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRzLmZpbmQoKHNwZWxsKSA9PiBzcGVsbC5pZCA9PT0gc2xvdC5pZCkpIHtcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChzbG90LCB0aGlzLmhpZ2hsaWdodHMpXG4gICAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpJ1xuICAgICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvb2xkb3duIGluZGljYXRvclxuICAgICAgICBpZiAoc2xvdC5vbl9jb29sZG93bigpKSB7XG4gICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAxIC0gKChub3cgLSBzbG90Lmxhc3RfY2FzdF9hdCkgLyBzbG90LmNvb2xkb3duX3RpbWVfaW5fbXMpXG4gICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcbiAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdCh4LCB5LCB0aGlzLnNsb3Rfd2lkdGggKiBwZXJjZW50YWdlLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBY3Rpb25CYXJcbiIsImltcG9ydCBCb2FyZCBmcm9tIFwiLi4vYm9hcmRcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5pbXBvcnQgeyBNb3ZlIH0gZnJvbSBcIi4vbW92ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFnZ3JvKHsgZ28sIGVudGl0eSwgcmFkaXVzID0gMjAgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXNcbiAgICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHsgZ28sIGVudGl0eSwgcmFkaXVzOiBNYXRoLmZsb29yKHRoaXMucmFkaXVzIC8gdGhpcy5nby50aWxlX3NpemUpIH0pXG4gICAgdGhpcy5tb3ZlID0gbmV3IE1vdmUoeyBnbywgZW50aXR5LCB0YXJnZXRfcG9zaXRpb246IHRoaXMuZ28uY2hhcmFjdGVyIH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmdvLmNoYXJhY3RlciwgZW50aXR5KVxuICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLnJhZGl1cykge1xuICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgKHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMikgKyAodGhpcy5lbnRpdHkud2lkdGggLyAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LnN0YXRzLmF0dGFjayh0aGlzLmdvLmNoYXJhY3RlcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlLmFjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3BhdGggPSAoKSA9PiB7XG5cbiAgICB9XG5cbiAgICBjb25zdCBuZWlnaGJvcl9wb3NpdGlvbnMgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmVudGl0eS54LFxuICAgICAgICAgICAgeTogdGhpcy5lbnRpdHkueSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVudGl0eS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbnRpdHkuaGVpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZWZ0ID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB4OiB0aGlzLmVudGl0eS54IC09IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgcmlnaHQgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHg6IHRoaXMuZW50aXR5LnggKz0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCB1cCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeTogdGhpcy5lbnRpdHkueSAtPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IGRvd24gPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHk6IHRoaXMuZW50aXR5LnkgKz0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgIH1cbn0gIiwiaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4uL2xvb3RfYm94XCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9vdCh7IGdvLCBlbnRpdHksIGxvb3RfYmFnIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMubG9vdF9iYWcgPSBsb290X2JhZ1xuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxvb3RfYmFnLml0ZW1zID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmxvb3RfYmFnLml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QodGhpcy5sb290X2JhZy5lbnRpdHkubG9vdF90YWJsZSlcbiAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3gubG9vdF9iYWcgPSB0aGlzLmxvb3RfYmFnXG4gICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5sb290X2JhZy5pdGVtc1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvcjIsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gICAgY29uc3RydWN0b3IoeyBnbywgZW50aXR5LCBzcGVlZCA9IDEsIHRhcmdldF9wb3NpdGlvbiB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgdGhpcy50YXJnZXRfcG9zaXRpb24gPSB0YXJnZXRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5icHMgPSAwO1xuICAgICAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMucGF0aCA9IG51bGxcbiAgICAgICAgdGhpcy5uZXh0X3BhdGhfaW5kZXggPSBudWxsXG4gICAgfVxuXG4gICAgYWN0ID0gKCkgPT4ge1xuICAgICAgICAvLyB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgICAgICAvLyBpZiAoKHRoaXMuYnBzKSA+PSA4MDApIHtcbiAgICAgICAgLy8gICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgIC8vICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgLy8gICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZHJhdygpXG4gICAgICAgIC8vaWYgKHRoaXMucGF0aCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGF0aFt0aGlzLm5leHRfcGF0aF9pbmRleF0gPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIC8vY29uc3QgdGFyZ2V0ZWRfcG9zaXRpb24gPSB0aGlzLnBhdGhbdGhpcy5uZXh0X3BhdGhfaW5kZXhdXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3Bvc2l0aW9uID0geyAuLi50aGlzLnRhcmdldF9wb3NpdGlvbiB9XG4gICAgICAgIGNvbnN0IG5leHRfc3RlcCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LnggKyB0aGlzLnNwZWVkICogTWF0aC5jb3MoVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnkgKyB0aGlzLnNwZWVkICogTWF0aC5zaW4oVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVudGl0eS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbnRpdHkuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdvLnRyZWVzLnNvbWUodHJlZSA9PiAoaXNfY29sbGlkaW5nKG5leHRfc3RlcCwgdHJlZSkpKSkge1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkueCA9IG5leHRfc3RlcC54XG4gICAgICAgICAgICB0aGlzLmVudGl0eS55ID0gbmV4dF9zdGVwLnlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaG1tbS4uLiB3aGVyZSB0bz9cIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZWRpY3RfbW92ZW1lbnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgICAgIGlmICgodGhpcy5icHMpID49IDMwMDApIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2Jhci5qc1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eSwgc3BlbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5zcGVsbCA9IHNwZWxsXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50aXR5LmlzX2J1c3lfd2l0aCA9IG51bGxcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzKVxuICAgICAgICBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSAtPSB0aGlzLnNwZWxsLm1hbmFfY29zdFxuICAgICAgICAgICAgdGhpcy5zcGVsbC5hY3QoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jYXN0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmdvLmFjdGlvbl9iYXIuaGlnaGxpZ2h0X2Nhc3QodGhpcy5zcGVsbCk7XG4gICAgICAgIGlmICghdGhpcy5zcGVsbC5pc192YWxpZCgpKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5lbnRpdHkuaXNfYnVzeV93aXRoID0gdGhpcy5jYXN0aW5nX2JhclxuICAgICAgICBpZiAodGhpcy5zcGVsbC5jYXN0aW5nX3RpbWVfaW5fbXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc3RpbmdfYmFyLmR1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMpXG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdG9wKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSB0cnVlXG4gICAgICAgICAgICAgICAgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQodGhpcy5zcGVsbC5jYXN0aW5nX3RpbWVfaW5fbXMsIHRoaXMuZW5kKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmQoKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBMb290QmFnIGZyb20gXCIuLi9iZWluZ3MvbG9vdF9iYWdcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhdHMoeyBnbywgZW50aXR5LCBocCA9IDEwMCwgY3VycmVudF9ocCwgbWFuYSwgY3VycmVudF9tYW5hIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuaHAgPSBocCB8fCAxMDBcbiAgICB0aGlzLmN1cnJlbnRfaHAgPSBjdXJyZW50X2hwIHx8IGhwXG4gICAgdGhpcy5tYW5hID0gbWFuYVxuICAgIHRoaXMuY3VycmVudF9tYW5hID0gY3VycmVudF9tYW5hIHx8IG1hbmFcbiAgICB0aGlzLmxhc3RfYXR0YWNrX2F0ID0gbnVsbDtcbiAgICB0aGlzLmF0dGFja19zcGVlZCA9IDEwMDA7XG5cbiAgICB0aGlzLmhhc19tYW5hID0gKCkgPT4gdGhpcy5tYW5hID09PSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc19kZWFkID0gKCkgPT4gdGhpcy5jdXJyZW50X2hwIDw9IDA7XG4gICAgdGhpcy5pc19hbGl2ZSA9ICgpID0+ICF0aGlzLmlzX2RlYWQoKTtcbiAgICB0aGlzLnRha2VfZGFtYWdlID0gKHsgZGFtYWdlIH0pID0+IHtcbiAgICAgICAgbmV3IFNjcm9sbERhbWFnZVRleHQoeyBnbzogdGhpcy5nbywgZW50aXR5OiB0aGlzLmVudGl0eSwgZGFtYWdlIH0pLnNwYXduKClcbiAgICAgICAgdGhpcy5jdXJyZW50X2hwIC09IGRhbWFnZTtcbiAgICAgICAgaWYgKHRoaXMuaXNfZGVhZCgpKSB0aGlzLmRpZSgpXG4gICAgfVxuICAgIHRoaXMuZGllID0gKCkgPT4ge1xuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcy5lbnRpdHksIHRoaXMuZ28uY3JlZXBzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNyZWVwc1wiKVxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcy5lbnRpdHksIHRoaXMuZ28uY2xpY2thYmxlcykgfHwgY29uc29sZS5sb2coXCJOb3Qgb24gbGlzdCBvZiBjbGlja2FibGVzXCIpXG4gICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gdGhpcy5lbnRpdHkpIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIudXBkYXRlX3hwKHRoaXMuZW50aXR5KVxuICAgICAgICBpZiAodGhpcy5lbnRpdHkubG9vdF90YWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmdvLmxvb3RfYmFncy5wdXNoKG5ldyBMb290QmFnKHsgZ286IHRoaXMuZ28sIGVudGl0eTogdGhpcy5lbnRpdHkgfSkpXG4gICAgICAgICAgICAvLyB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QodGhpcy5lbnRpdHkubG9vdF90YWJsZSlcbiAgICAgICAgICAgIC8vIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hdHRhY2sgPSAodGFyZ2V0KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RfYXR0YWNrX2F0ID09PSBudWxsIHx8ICh0aGlzLmxhc3RfYXR0YWNrX2F0ICsgdGhpcy5hdHRhY2tfc3BlZWQpIDwgRGF0ZS5ub3coKSkge1xuICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gcmFuZG9tKDUsIDEyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAqKiogJHt0aGlzLmVudGl0eS5uYW1lfSBhdHRhY2tzICR7dGFyZ2V0Lm5hbWV9OiAke2RhbWFnZX0gZGFtYWdlYClcbiAgICAgICAgICAgIHRhcmdldC5zdGF0cy50YWtlX2RhbWFnZSh7IGRhbWFnZTogZGFtYWdlIH0pXG4gICAgICAgICAgICB0aGlzLmxhc3RfYXR0YWNrX2F0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFNjcm9sbERhbWFnZVRleHQoeyBnbywgZW50aXR5LCBkYW1hZ2UgfSkge1xuICAgICAgICB0aGlzLmdvID0gZ287XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmRhbWFnZSA9IGRhbWFnZTtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBudWxsXG4gICAgICAgIHRoaXMuZGlzcGxheV90aW1lID0gMjAwMFxuICAgICAgICB0aGlzLmZvbnRfc2l6ZSA9IDIxXG4gICAgICAgIHRoaXMueCA9IHRoaXMuZW50aXR5LnggKyAocmFuZG9tKDAsIHRoaXMuZW50aXR5LndpZHRoKSkgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgIHRoaXMueSA9IHRoaXMuZW50aXR5LnkgLSB0aGlzLmdvLmNhbWVyYS55XG5cbiAgICAgICAgdGhpcy5zcGF3biA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzLnB1c2godGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gYCR7dGhpcy5mb250X3NpemV9cHggc2Fucy1zZXJpZmBcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gYCR7dGhpcy5kYW1hZ2V9YFxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dCwgdGhpcy54LCB0aGlzLmVudGl0eS55IC0gdGhpcy5nby5jYW1lcmEueSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlID0gKCkgPT4geyBcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiBEYXRlLm5vdygpID4gdGhpcy5zdGFydGluZ190aW1lICsgdGhpcy5kaXNwbGF5X3RpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mb250X3NpemUgKz0gMC4yXG4gICAgICAgICAgICB0aGlzLnkgLT0gMC4yXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVfZnBzID0gKCkgPT4geyB9XG4gICAgICAgIHRoaXMuZW5kID0gKCkgPT4geyB9XG4gICAgfVxufSIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IEFnZ3JvIGZyb20gXCIuLi9iZWhhdmlvcnMvYWdncm8uanNcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuXG5mdW5jdGlvbiBDcmVlcCh7IGdvIH0pIHtcbiAgaWYgKGdvLmNyZWVwcyA9PT0gdW5kZWZpbmVkKSBnby5jcmVlcHMgPSBbXVxuICB0aGlzLmlkID0gZ28uY3JlZXBzLmxlbmd0aFxuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jcmVlcHMucHVzaCh0aGlzKVxuICB0aGlzLm5hbWUgPSBgQ3JlZXAgJHt0aGlzLmlkfWBcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJ6ZXJnbGluZy5wbmdcIiAvLyBwbGFjZWhvbGRlciBpbWFnZVxuICB0aGlzLmltYWdlX3dpZHRoID0gMTUwXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTUwXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKVxuICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDRcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDRcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IG51bGxcbiAgdGhpcy5zcGVlZCA9IDJcbiAgLy90aGlzLm1vdmVtZW50X2JvYXJkID0gdGhpcy5nby5ib2FyZC5ncmlkXG4gIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBudWxsXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKHsgZ28sIGVudGl0eTogdGhpcywgaHA6IDIwIH0pO1xuICAvLyBCZWhhdmlvdXJzXG4gIHRoaXMuYWdncm8gPSBuZXcgQWdncm8oeyBnbywgZW50aXR5OiB0aGlzLCByYWRpdXM6IDUwMCB9KTtcbiAgLy8gRU5EIC0gQmVoYXZpb3Vyc1xuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh0YXJnZXRfcG9zaXRpb24pIHtcbiAgICBsZXQgeCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueCA/IHRhcmdldF9wb3NpdGlvbi54IDogdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgIGxldCB5ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi55ID8gdGFyZ2V0X3Bvc2l0aW9uLnkgOiB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgbGV0IHdpZHRoID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi53aWR0aCA/IHRhcmdldF9wb3NpdGlvbi53aWR0aCA6IHRoaXMud2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgPyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAgaWYgKHRhcmdldF9wb3NpdGlvbikgcmV0dXJuXG5cbiAgICB0aGlzLmFnZ3JvLmFjdCgpO1xuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgfVxuXG4gIHRoaXMuc2V0X21vdmVtZW50X3RhcmdldCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBub2RlXG4gIH1cblxuICB0aGlzLm1vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpIHtcbiAgICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubG9vdF90YWJsZSA9IFt7XG4gICAgaXRlbTogeyBuYW1lOiBcIldvb2RcIiwgaW1hZ2Vfc3JjOiBcImJyYW5jaC5wbmdcIiB9LFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDMsXG4gICAgY2hhbmNlOiA5NVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDcmVlcFxuIiwiaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb290QmFnKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5fX3Byb3RvX18gPSBuZXcgRG9vZGFkKHsgZ28gfSlcblxuICAgIHRoaXMuaWQgPSBgbG9vdF9iYWdgXG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnggPSBlbnRpdHkueFxuICAgIHRoaXMueSA9IGVudGl0eS55XG4gICAgdGhpcy53aWR0aCA9IDUwXG4gICAgdGhpcy5oZWlnaHQgPSA1MFxuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gJ2JhY2twYWNrLnBuZydcbiAgICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaCh0aGlzKTtcbiAgICB0aGlzLml0ZW1zID0gbnVsbFxuICAgIHRoaXMuYWN0ZWRfYnlfc2tpbGwgPSAnbG9vdCdcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIDEwMDAsIDEwMDAsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uY2xpY2thYmxlcylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLmxvb3RfYmFncylcbiAgICAgICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlX2ZwcyA9ICgpID0+IHt9XG59IiwiaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCI7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b25lKHsgZ28gfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmltYWdlLnNyYyA9IFwiZmxpbnRzdG9uZS5wbmdcIlxuICAgIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKTtcbiAgICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpO1xuICAgIHRoaXMuaW1hZ2Vfd2lkdGggPSA4NDBcbiAgICB0aGlzLmltYWdlX2hlaWdodCA9IDg1OVxuICAgIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gICAgdGhpcy5pbWFnZV95X29mZnNldCA9IDBcbiAgICB0aGlzLndpZHRoID0gMzJcbiAgICB0aGlzLmhlaWdodCA9IDMyXG4gICAgdGhpcy5hY3RlZF9ieV9za2lsbCA9ICdicmVha19zdG9uZSdcbn0iLCJpbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVHJlZSh7IGdvIH0pIHtcbiAgICB0aGlzLl9fcHJvdG9fXyA9IG5ldyBEb29kYWQoeyBnbyB9KVxuXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBcInBsYW50cy5wbmdcIlxuICAgIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKTtcbiAgICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpO1xuICAgIHRoaXMuaW1hZ2Vfd2lkdGggPSA5OFxuICAgIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAxMjdcbiAgICB0aGlzLmltYWdlX2hlaWdodCA9IDEyNlxuICAgIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAyOTBcbiAgICB0aGlzLndpZHRoID0gOThcbiAgICB0aGlzLmhlaWdodCA9IDEyNlxuICAgIHRoaXMuYWN0ZWRfYnlfc2tpbGwgPSBcImN1dF90cmVlXCJcbn0iLCJpbXBvcnQgTm9kZSBmcm9tIFwiLi9ub2RlLmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiwgcmFuZG9tLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuXG4vLyBBIGdyaWQgb2YgdGlsZXMgZm9yIHRoZSBtYW5pcHVsYXRpb25cbmZ1bmN0aW9uIEJvYXJkKHsgZ28sIGVudGl0eSwgcmFkaXVzIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uYm9hcmQgPSB0aGlzXG4gIHRoaXMudGlsZV9zaXplID0gdGhpcy5nby50aWxlX3NpemVcbiAgdGhpcy5ncmlkID0gW1tdXVxuICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyXG4gIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gIHRoaXMuc2hvdWxkX2RyYXcgPSBmYWxzZVxuXG4gIHRoaXMudG9nZ2xlX2dyaWQgPSAoKSA9PiB7XG4gICAgdGhpcy5zaG91bGRfZHJhdyA9ICF0aGlzLnNob3VsZF9kcmF3XG4gICAgaWYgKHRoaXMuc2hvdWxkX2RyYXcpIHRoaXMuYnVpbGRfZ3JpZCgpXG4gIH1cblxuICB0aGlzLmJwcyA9IDA7XG4gIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKTtcblxuICB0aGlzLmJ1aWxkX2dyaWQgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJidWlsZGluZyBncmlkXCIpXG4gICAgdGhpcy5icHMgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpY2tcbiAgICBpZiAoKHRoaXMuYnBzKSA8IDEwMDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5ncmlkID0gbmV3IEFycmF5KHRoaXMud2lkdGgpXG5cbiAgICBjb25zdCB4X3Bvc2l0aW9uID0gTWF0aC5mbG9vcih0aGlzLmVudGl0eS54ICsgdGhpcy5lbnRpdHkud2lkdGggLyAyKVxuICAgIGNvbnN0IHlfcG9zaXRpb24gPSBNYXRoLmZsb29yKHRoaXMuZW50aXR5LnkgKyB0aGlzLmVudGl0eS5oZWlnaHQgLyAyKVxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgIHRoaXMuZ3JpZFt4XSA9IG5ldyBBcnJheSh0aGlzLmhlaWdodClcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoe1xuICAgICAgICAgIHg6ICh4X3Bvc2l0aW9uIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpICsgeCAqIHRoaXMudGlsZV9zaXplKSxcbiAgICAgICAgICB5OiAoeV9wb3NpdGlvbiAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSArIHkgKiB0aGlzLnRpbGVfc2l6ZSksXG4gICAgICAgICAgd2lkdGg6IHRoaXMudGlsZV9zaXplLFxuICAgICAgICAgIGhlaWdodDogdGhpcy50aWxlX3NpemUsXG4gICAgICAgICAgZzogSW5maW5pdHksIC8vIENvc3Qgc28gZmFyXG4gICAgICAgICAgZjogSW5maW5pdHksIC8vIENvc3QgZnJvbSBoZXJlIHRvIHRhcmdldFxuICAgICAgICAgIGg6IG51bGwsIC8vXG4gICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgICAgIGJvcmRlcl9jb2xvdXI6IFwiYmxhY2tcIlxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdvLnRyZWVzLmZvckVhY2godHJlZSA9PiB7XG4gICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhub2RlLCB0cmVlKSkge1xuICAgICAgICAgICAgbm9kZS5jb2xvdXIgPSAncmVkJztcbiAgICAgICAgICAgIG5vZGUuYmxvY2tlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZ3JpZFt4XVt5XSA9IG5vZGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLndheV90b19wbGF5ZXIgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgICB0aGlzLmZpbmRfcGF0aCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSwgdGhpcy5nby5jaGFyYWN0ZXIpXG4gICAgfVxuICB9XG5cbiAgLy8gQSogSW1wbGVtZW50YXRpb25cbiAgLy8gZjogQ29zdCBvZiB0aGUgZW50aXJlIHRyYXZlbCAoc3VtIG9mIGcgKyBoKVxuICAvLyBnOiBDb3N0IGZyb20gc3RhcnRfbm9kZSB0aWxsIG5vZGUgKHRyYXZlbCBjb3N0KVxuICAvLyBoOiBDb3N0IGZyb20gbm9kZSB0aWxsIGVuZF9ub2RlIChsZWZ0b3ZlciBjb3N0KVxuICAvLyBBZGQgdGhlIGN1cnJlbnQgbm9kZSBpbiBhIGxpc3RcbiAgLy8gUG9wIHRoZSBvbmUgd2hvc2UgZiBpcyB0aGUgbG93ZXN0YVxuICAvLyBBZGQgdG8gYSBsaXN0IG9mIGFscmVhZHktdmlzaXRlZCAoY2xvc2VkKVxuICAvLyBWaXNpdCBhbGwgaXRzIG5laWdoYm91cnNcbiAgLy8gVXBkYXRlIGZvciBlYWNoOiB0aGUgdHJhdmVsIGNvc3QgKGcpIHlvdSBtYW5hZ2VkIHRvIGRvIGFuZCB5b3Vyc2VsZiBhcyBwYXJlbnRcbiAgLy8vLyBTbyB0aGF0IHdlIGNhbiByZXRyYWNlIGhvdyB3ZSBnb3QgaGVyZVxuICB0aGlzLmZpbmRfcGF0aCA9IChzdGFydF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiB7XG4gICAgdGhpcy5idWlsZF9ncmlkKClcbiAgICBjb25zdCBzdGFydF9ub2RlID0gdGhpcy5nZXRfbm9kZV9mb3Ioc3RhcnRfcG9zaXRpb24pO1xuICAgIGNvbnN0IGVuZF9ub2RlID0gdGhpcy5nZXRfbm9kZV9mb3IoZW5kX3Bvc2l0aW9uKTtcbiAgICBpZiAoIXN0YXJ0X25vZGUgfHwgIWVuZF9ub2RlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vZGVzIG5vdCBtYXRjaGVkXCIpXG4gICAgICBkZWJ1Z2dlclxuICAgIH1cblxuICAgIHN0YXJ0X25vZGUuY29sb3VyID0gJ29yYW5nZSdcbiAgICBlbmRfbm9kZS5jb2xvdXIgPSAnb3JhbmdlJ1xuXG4gICAgY29uc3Qgb3Blbl9zZXQgPSBbc3RhcnRfbm9kZV07XG4gICAgY29uc3QgY2xvc2VkX3NldCA9IFtdO1xuXG4gICAgY29uc3QgY29zdCA9IChub2RlX2EsIG5vZGVfYikgPT4ge1xuICAgICAgY29uc3QgZHggPSBub2RlX2EueCAtIG5vZGVfYi54O1xuICAgICAgY29uc3QgZHkgPSBub2RlX2EueSAtIG5vZGVfYi55O1xuICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgfVxuXG4gICAgc3RhcnRfbm9kZS5nID0gMDtcbiAgICBzdGFydF9ub2RlLmYgPSBjb3N0KHN0YXJ0X25vZGUsIGVuZF9ub2RlKTtcblxuICAgIHdoaWxlIChvcGVuX3NldC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjdXJyZW50X25vZGUgPSBvcGVuX3NldC5zb3J0KChhLCBiKSA9PiAoYS5mIDwgYi5mID8gLTEgOiAxKSlbMF0gLy8gR2V0IHRoZSBub2RlIHdpdGggbG93ZXN0IGYgdmFsdWUgaW4gdGhlIG9wZW4gc2V0XG4gICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoY3VycmVudF9ub2RlLCBvcGVuX3NldClcbiAgICAgIGNsb3NlZF9zZXQucHVzaChjdXJyZW50X25vZGUpXG4gICAgICBcbiAgICAgIGlmIChjdXJyZW50X25vZGUgPT09IGVuZF9ub2RlKSB7XG4gICAgICAgIGxldCBjdXJyZW50ID0gY3VycmVudF9ub2RlO1xuICAgICAgICBsZXQgcGF0aCA9IFtdO1xuICAgICAgICB3aGlsZSAoY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgICBjdXJyZW50LmNvbG91ciA9ICdwdXJwbGUnXG4gICAgICAgICAgcGF0aC5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMubmVpZ2hib3VycyhjdXJyZW50X25vZGUpLmZvckVhY2gobmVpZ2hib3VyX25vZGUgPT4ge1xuICAgICAgICBpZiAoIW5laWdoYm91cl9ub2RlLmJsb2NrZWQgJiYgIWNsb3NlZF9zZXQuaW5jbHVkZXMobmVpZ2hib3VyX25vZGUpKSB7XG4gICAgICAgICAgbGV0IGdfdXNlZCA9IGN1cnJlbnRfbm9kZS5nICsgY29zdChjdXJyZW50X25vZGUsIG5laWdoYm91cl9ub2RlKVxuICAgICAgICAgIGxldCBiZXN0X2cgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIW9wZW5fc2V0LmluY2x1ZGVzKG5laWdoYm91cl9ub2RlKSkge1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuaCA9IGNvc3QobmVpZ2hib3VyX25vZGUsIGVuZF9ub2RlKVxuICAgICAgICAgICAgb3Blbl9zZXQucHVzaChuZWlnaGJvdXJfbm9kZSlcbiAgICAgICAgICAgIGJlc3RfZyA9IHRydWVcbiAgICAgICAgICB9IGVsc2UgaWYgKGdfdXNlZCA8IG5laWdoYm91cl9ub2RlLmcpIHtcbiAgICAgICAgICAgIGJlc3RfZyA9IHRydWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmVzdF9nKSB7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5wYXJlbnQgPSBjdXJyZW50X25vZGU7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5nID0gZ191c2VkXG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5mID0gbmVpZ2hib3VyX25vZGUuZyArIG5laWdoYm91cl9ub2RlLmhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdGhpcy5uZWlnaGJvdXJzID0gKG5vZGUpID0+IHsgLy8gNSw1XG4gICAgY29uc3QgeF9vZmZzZXQgPSAoTWF0aC5mbG9vcih0aGlzLmVudGl0eS54ICsgdGhpcy5lbnRpdHkud2lkdGggLyAyKSAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSlcbiAgICBjb25zdCB5X29mZnNldCA9IChNYXRoLmZsb29yKHRoaXMuZW50aXR5LnkgKyB0aGlzLmVudGl0eS5oZWlnaHQgLyAyKSAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSlcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigobm9kZS54IC0geF9vZmZzZXQpIC8gdGhpcy50aWxlX3NpemUpXG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoKG5vZGUueSAtIHlfb2Zmc2V0KSAvIHRoaXMudGlsZV9zaXplKVxuXG4gICAgZnVuY3Rpb24gZmV0Y2hfZ3JpZF9jZWxsKGdyaWQsIGx4LCBseSkge1xuICAgICAgcmV0dXJuIGdyaWRbbHhdICYmIGdyaWRbbHhdW2x5XVxuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4LCB5IC0gMSksIC8vIHRvcFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkgLSAxKSwgLy8gdG9wIGxlZnRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5IC0gMSksIC8vIHRvcCByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCwgeSArIDEpLCAvLyBib3R0b21cbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5ICsgMSksIC8vIGJvdHRvbSBsZWZ0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSArIDEpLCAvLyBib3R0b20gcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5KSwgLy8gcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5KSAvLyBsZWZ0XG4gICAgXS5maWx0ZXIobm9kZSA9PiBub2RlICE9PSB1bmRlZmluZWQpXG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnNob3VsZF9kcmF3KSByZXR1cm5cblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmdyaWRbeF1beV07XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IFwiMVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gbm9kZS5ib3JkZXJfY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IG5vZGUuY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KG5vZGUueCAtIHRoaXMuZ28uY2FtZXJhLngsIG5vZGUueSAtIHRoaXMuZ28uY2FtZXJhLnksIG5vZGUud2lkdGgsIG5vZGUuaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KG5vZGUueCAtIHRoaXMuZ28uY2FtZXJhLngsIG5vZGUueSAtIHRoaXMuZ28uY2FtZXJhLnksIG5vZGUud2lkdGgsIG5vZGUuaGVpZ2h0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYnVpbGRfZ3JpZCgpXG4gIH1cblxuICAvLyBSZWNlaXZlcyBhIHJlY3QgYW5kIHJldHVybnMgaXQncyBmaXJzdCBjb2xsaWRpbmcgTm9kZVxuICB0aGlzLmdldF9ub2RlX2ZvciA9IChyZWN0KSA9PiB7XG4gICAgaWYgKHJlY3Qud2lkdGggPT0gdW5kZWZpbmVkKSByZWN0LndpZHRoID0gMVxuICAgIGlmIChyZWN0LmhlaWdodCA9PSB1bmRlZmluZWQpIHJlY3QuaGVpZ2h0ID0gMVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgaWYgKCh0aGlzLmdyaWRbeF0gPT09IHVuZGVmaW5lZCkgfHwgKHRoaXMuZ3JpZFt4XVt5XSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3h9LCR7eX0gY29vcmRpbmF0ZXMgaXMgdW5kZWZpbmVkYClcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgV2lkdGg6ICR7dGhpcy53aWR0aH07IGhlaWdodDogJHt0aGlzLmhlaWdodH0gKHJhZGl1czogJHt0aGlzLnJhZGl1c30pYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5yZWN0LFxuICAgICAgICAgICAgfSwgdGhpcy5ncmlkW3hdW3ldKSkgcmV0dXJuIHRoaXMuZ3JpZFt4XVt5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gVU5VU0VEIE9MRCBBTEdPUklUSE1cblxuICAvLyBTZXRzIGEgZ2xvYmFsIHRhcmdldCBub2RlXG4gIC8vIEl0IHdhcyB1c2VkIGJlZm9yZSB0aGUgbW92ZW1lbnQgZ290IGRldGFjaGVkIGZyb20gdGhlIHBsYXllciBjaGFyYWN0ZXJcbiAgdGhpcy50YXJnZXRfbm9kZSA9IG51bGxcbiAgdGhpcy5zZXRfdGFyZ2V0ID0gKG5vZGUpID0+IHtcbiAgICB0aGlzLmdyaWQuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5kaXN0YW5jZSA9IDApXG4gICAgdGhpcy50YXJnZXRfbm9kZSA9IG5vZGVcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZXMgcG9zc2libGUgcG9zc2l0aW9ucyBmb3IgdGhlIG5leHQgbW92ZW1lbnRcbiAgdGhpcy5jYWxjdWxhdGVfbmVpZ2hib3VycyA9IChjaGFyYWN0ZXIpID0+IHtcbiAgICBsZXQgY2hhcmFjdGVyX3JlY3QgPSB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCAtIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIHk6IGNoYXJhY3Rlci55IC0gY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgd2lkdGg6IGNoYXJhY3Rlci53aWR0aCArIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIGhlaWdodDogY2hhcmFjdGVyLmhlaWdodCArIGNoYXJhY3Rlci5zcGVlZFxuICAgIH1cblxuICAgIGxldCBmdXR1cmVfbW92ZW1lbnRfY29sbGlzaW9ucyA9IGNoYXJhY3Rlci5tb3ZlbWVudF9ib2FyZC5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBpc19jb2xsaWRpbmcoY2hhcmFjdGVyX3JlY3QsIG5vZGUpXG4gICAgfSlcblxuICAgIC8vIEknbSBnb25uYSBjb3B5IHRoZW0gaGVyZSBvdGhlcndpc2UgZGlmZmVyZW50IGVudGl0aWVzIGNhbGN1bGF0aW5nIGRpc3RhbmNlXG4gICAgLy8gd2lsbCBhZmZlY3QgZWFjaCBvdGhlcidzIG51bWJlcnMuIFRoaXMgY2FuIGJlIHNvbHZlZCB3aXRoIGEgZGlmZmVyZW50XG4gICAgLy8gY2FsY3VsYXRpb24gYWxnb3JpdGhtIGFzIHdlbGwuXG4gICAgcmV0dXJuIGZ1dHVyZV9tb3ZlbWVudF9jb2xsaXNpb25zXG4gIH1cblxuXG4gIHRoaXMubmV4dF9zdGVwID0gKGNoYXJhY3RlciwgY2xvc2VzdF9ub2RlLCB0YXJnZXRfbm9kZSkgPT4ge1xuICAgIC8vIFN0ZXA6IFNlbGVjdCBhbGwgbmVpZ2hib3Vyc1xuICAgIGxldCB2aXNpdGVkID0gW11cbiAgICBsZXQgbm9kZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmMoNDA5NiAvIGdvLnRpbGVfc2l6ZSlcbiAgICBsZXQgb3JpZ2luX2luZGV4ID0gY2xvc2VzdF9ub2RlLmlkXG5cbiAgICBsZXQgbmVpZ2hib3VycyA9IHRoaXMuY2FsY3VsYXRlX25laWdoYm91cnMoY2hhcmFjdGVyKVxuXG4gICAgLy8gU3RlcDogU29ydCBuZWlnaGJvdXJzIGJ5IGRpc3RhbmNlIChzbWFsbGVyIGRpc3RhbmNlIGZpcnN0KVxuICAgIC8vIFdlIGFkZCB0aGUgd2FsayBtb3ZlbWVudCB0byByZS12aXNpdGVkIG5vZGVzIHRvIHNpZ25pZnkgdGhpcyBjb3N0XG4gICAgbGV0IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYyA9IG5laWdoYm91cnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEuZGlzdGFuY2UpIHtcbiAgICAgICAgLy9hLmRpc3RhbmNlICs9IDIgKiBjaGFyYWN0ZXIuc3BlZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEuZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKGEsIHRhcmdldF9ub2RlKVxuICAgICAgfVxuXG4gICAgICBpZiAoYi5kaXN0YW5jZSkge1xuICAgICAgICAvL2IuZGlzdGFuY2UgKz0gY2hhcmFjdGVyLnNwZWVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiLmRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShiLCB0YXJnZXRfbm9kZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlXG4gICAgfSlcblxuICAgIC8vIFN0ZXA6IFNlbGVjdCBvbmx5IG5laWdoYm91ciBub2RlcyB0aGF0IGFyZSBub3QgYmxvY2tlZFxuICAgIG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYyA9IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYy5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBub2RlLmJsb2NrZWQgIT09IHRydWVcbiAgICB9KVxuXG4gICAgLy8gU3RlcDogUmV0dXJuIHRoZSBjbG9zZXN0IHZhbGlkIG5vZGUgdG8gdGhlIHRhcmdldFxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZiB0aGUgY2xvc2VzdCBwb2ludCBpcyB0aGUgdGFyZ2V0IGl0c2VsZlxuICAgIC8vIHJldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgbm93aGVyZSB0byBnb1xuICAgIGlmIChuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZnV0dXJlX25vZGUgPSBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2NbMF1cbiAgICAgIHJldHVybiAoZnV0dXJlX25vZGUuaWQgPT0gdGFyZ2V0X25vZGUuaWQgPyB0cnVlIDogZnV0dXJlX25vZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gZnVuY3Rpb24gKGNoYXJhY3RlciwgdGFyZ2V0X25vZGUpIHtcbiAgICBsZXQgY2hhcl9wb3MgPSB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbnRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKGNoYXJfcG9zKVxuICAgIGxldCBjbG9zZXN0X25vZGUgPSB0aGlzLm5leHRfc3RlcChjaGFyYWN0ZXIsIGN1cnJlbnRfbm9kZSwgdGFyZ2V0X25vZGUpXG5cbiAgICAvLyBXZSBoYXZlIGEgbmV4dCBzdGVwXG4gICAgaWYgKHR5cGVvZiAoY2xvc2VzdF9ub2RlKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgbGV0IGZ1dHVyZV9tb3ZlbWVudCA9IHsgLi4uY2hhcl9wb3MgfVxuICAgICAgbGV0IHhfc3BlZWQgPSAwXG4gICAgICBsZXQgeV9zcGVlZCA9IDBcbiAgICAgIGlmIChjbG9zZXN0X25vZGUueCAhPSBjaGFyYWN0ZXIueCkge1xuICAgICAgICBsZXQgZGlzdGFuY2VfeCA9IGNoYXJfcG9zLnggLSBjbG9zZXN0X25vZGUueFxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VfeCkgPj0gY2hhcmFjdGVyLnNwZWVkKSB7XG4gICAgICAgICAgeF9zcGVlZCA9IChkaXN0YW5jZV94ID4gMCA/IC1jaGFyYWN0ZXIuc3BlZWQgOiBjaGFyYWN0ZXIuc3BlZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNoYXJfcG9zLnggPCBjbG9zZXN0X25vZGUueCkge1xuICAgICAgICAgICAgeF9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3gpICogLTFcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeF9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3gpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjbG9zZXN0X25vZGUueSAhPSBjaGFyYWN0ZXIueSkge1xuICAgICAgICBsZXQgZGlzdGFuY2VfeSA9IGZ1dHVyZV9tb3ZlbWVudC55IC0gY2xvc2VzdF9ub2RlLnlcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlX3kpID49IGNoYXJhY3Rlci5zcGVlZCkge1xuICAgICAgICAgIHlfc3BlZWQgPSAoZGlzdGFuY2VfeSA+IDAgPyAtY2hhcmFjdGVyLnNwZWVkIDogY2hhcmFjdGVyLnNwZWVkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA8IGNsb3Nlc3Rfbm9kZS55KSB7XG4gICAgICAgICAgICB5X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeV9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3kpICogLTFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBmdXR1cmVfbW92ZW1lbnQueCArIHhfc3BlZWRcbiAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gZnV0dXJlX21vdmVtZW50LnkgKyB5X3NwZWVkXG5cbiAgICAgIGNoYXJhY3Rlci5jb29yZHMoZnV0dXJlX21vdmVtZW50KVxuICAgICAgLy8gV2UncmUgYWxyZWFkeSBhdCB0aGUgYmVzdCBzcG90XG4gICAgfSBlbHNlIGlmIChjbG9zZXN0X25vZGUgPT09IHRydWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVhY2hlZFwiKVxuICAgICAgY2hhcmFjdGVyLm1vdmVtZW50X2JvYXJkID0gW11cbiAgICAgIGNoYXJhY3Rlci5tb3ZpbmcgPSBmYWxzZVxuICAgICAgLy8gV2UncmUgc3R1Y2tcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogZ290IHRoaXMgb25jZSBhZnRlciBoYWQgYWxyZWFkeSByZWFjaGVkLiBcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gcGF0aFwiKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFxuIiwiZnVuY3Rpb24gQ2FtZXJhKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNhbWVyYSA9IHRoaXNcbiAgdGhpcy54ID0gMFxuICB0aGlzLnkgPSAwXG4gIHRoaXMuY2FtZXJhX3NwZWVkID0gM1xuXG4gIHRoaXMubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSA9IChldikgPT4ge1xuICAgIC8vaWYgKHRoaXMuZ28uZWRpdG9yLnBhaW50X21vZGUpIHJldHVyblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA8IDEwMCkge1xuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgeSArIHRoZSBtb3ZlbWVudCB3ZSdsbCBtYWtlIGZ1cnRoZXIgdGhlcmUgaXMgZ3JlYXRlciB0aGFuXG4gICAgICAvLyB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBzY3JlZW4gbWludXMgdGhlIGhlaWdodCB0aGF0IHdpbGwgYWxyZWFkeSBiZSB2aXNpYmxlXG4gICAgICAvLyAodGhlIGNhbnZhcyBoZWlnaHQpLCBkb24ndCBnbyBmdXJ0aGVyIG93blxuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA+IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gMTAwKSB7XG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpIDwgMTAwKSB7XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA+IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSAxMDApIHtcbiAgICAgIC8vIERvbid0IGdvIGZ1cnRoZXIgbGVmdFxuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuICB9XG5cbiAgdGhpcy5mb2N1cyA9IChwb2ludCkgPT4ge1xuICAgIGxldCB4ID0gcG9pbnQueCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gICAgbGV0IHkgPSBwb2ludC55IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gICAgLy8gc3BlY2lmaWMgbWFwIGN1dHMgKGl0IGhhcyBhIG1hcCBvZmZzZXQgb2YgNjAsMTYwKVxuICAgIGlmICh5IDwgMCkgeyB5ID0gMCB9XG4gICAgaWYgKHggPCAwKSB7IHggPSAwIH1cbiAgICBpZiAoeCArIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggPiB0aGlzLmdvLndvcmxkLndpZHRoKSB7IHggPSB0aGlzLnggfVxuICAgIGlmICh5ICsgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgPiB0aGlzLmdvLndvcmxkLmhlaWdodCkgeyB5ID0gdGhpcy55IH1cbiAgICAvLyBvZmZzZXQgY2hhbmdlcyBlbmRcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgdGhpcy5nbG9iYWxfY29vcmRzID0gKG9iaikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICB4OiBvYmoueCAtIHRoaXMueCxcbiAgICAgIHk6IG9iai55IC0gdGhpcy55XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbWVyYVxuIiwiZnVuY3Rpb24gQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5kdXJhdGlvbiA9IG51bGxcbiAgICB0aGlzLndpZHRoID0gZW50aXR5LndpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSA1XG4gICAgdGhpcy5jb2xvdXIgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5mdWxsID0gbnVsbFxuICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBudWxsXG4gICAgdGhpcy5sYXN0X3RpbWUgPSBudWxsXG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGxcbiAgICAvLyBTdGF5cyBzdGF0aWMgaW4gYSBwb3NpdGlvbiBpbiB0aGUgbWFwXG4gICAgLy8gTWVhbmluZzogZG9lc24ndCBtb3ZlIHdpdGggdGhlIGNhbWVyYVxuICAgIHRoaXMuc3RhdGljID0gZmFsc2VcbiAgICB0aGlzLnhfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueCA6XG4gICAgICAgICAgICAwO1xuICAgIH1cbiAgICB0aGlzLnlfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueSA6XG4gICAgICAgICAgICAwO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnQgPSAoZHVyYXRpb24sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCA9ICgpID0+IHRoaXMuZHVyYXRpb24gPSBudWxsXG5cbiAgICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5kdXJhdGlvbiA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBlbGFwc2VkX3RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpbWU7XG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gZWxhcHNlZF90aW1lO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50IDw9IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMuZW50aXR5LnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICB0aGlzLnkgPSB0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0ICsgMTAgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsZXQgYmFyX3dpZHRoID0gKCh0aGlzLmN1cnJlbnQgLyB0aGlzLmR1cmF0aW9uKSAqIHRoaXMud2lkdGgpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmNhbGxiYWNrICE9PSBudWxsKSAmJiAodGhpcy5jYWxsYmFjayAhPT0gdW5kZWZpbmVkKSkgdGhpcy5jYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXN0aW5nQmFyXG4iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCByYW5kb20sIFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5pbXBvcnQgSW52ZW50b3J5IGZyb20gXCIuL2ludmVudG9yeVwiXG5pbXBvcnQgU3RhdHMgZnJvbSBcIi4vYmVoYXZpb3JzL3N0YXRzLmpzXCJcbmltcG9ydCBTcGVsbGNhc3RpbmcgZnJvbSBcIi4vYmVoYXZpb3JzL3NwZWxsY2FzdGluZy5qc1wiXG5pbXBvcnQgRnJvc3Rib2x0IGZyb20gXCIuL3NwZWxscy9mcm9zdGJvbHQuanNcIlxuaW1wb3J0IEJsaW5rIGZyb20gXCIuL3NwZWxscy9ibGluay5qc1wiXG5pbXBvcnQgQ3V0VHJlZSBmcm9tIFwiLi9za2lsbHMvY3V0X3RyZWUuanNcIlxuaW1wb3J0IFNraWxsIGZyb20gXCIuL3NraWxsLmpzXCJcbmltcG9ydCBCcmVha1N0b25lIGZyb20gXCIuL3NraWxscy9icmVha19zdG9uZS5qc1wiXG5pbXBvcnQgTWFrZUZpcmUgZnJvbSBcIi4vc2tpbGxzL21ha2VfZmlyZS5qc1wiXG5pbXBvcnQgQm9hcmQgZnJvbSBcIi4vYm9hcmQuanNcIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vYmVoYXZpb3JzL2xvb3QuanNcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJjcmlzaXNjb3JlcGVlcHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pZCA9IGlkXG4gIHRoaXMueCA9IDEwMFxuICB0aGlzLnkgPSAxMDBcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gXCJkb3duXCJcbiAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gMFxuICB0aGlzLnNwZWVkID0gMS40XG4gIHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSh7IGdvIH0pO1xuICB0aGlzLnNwZWxsYm9vayA9IHtcbiAgICBmcm9zdGJvbHQ6IG5ldyBGcm9zdGJvbHQoeyBnbywgZW50aXR5OiB0aGlzIH0pLFxuICAgIGJsaW5rOiBuZXcgQmxpbmsoeyBnbywgZW50aXR5OiB0aGlzIH0pXG4gIH1cbiAgdGhpcy5zcGVsbHMgPSB7XG4gICAgZnJvc3Rib2x0OiBuZXcgU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eTogdGhpcywgc3BlbGw6IHRoaXMuc3BlbGxib29rLmZyb3N0Ym9sdCB9KS5jYXN0LFxuICAgIGJsaW5rOiBuZXcgU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eTogdGhpcywgc3BlbGw6IHRoaXMuc3BlbGxib29rLmJsaW5rIH0pLmNhc3RcbiAgfVxuICB0aGlzLnNraWxscyA9IHtcbiAgICBjdXRfdHJlZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBDdXRUcmVlKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3QsXG4gICAgYnJlYWtfc3RvbmU6IG5ldyBTa2lsbCh7IGdvLCBlbnRpdHk6IHRoaXMsIHNraWxsOiBuZXcgQnJlYWtTdG9uZSh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuYWN0LFxuICAgIG1ha2VfZmlyZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBNYWtlRmlyZSh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuYWN0XG4gIH1cbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIG1hbmE6IDUwIH0pO1xuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgeV9vZmZzZXQ6IDEwLCBjb2xvdXI6IFwiYmx1ZVwiIH0pXG4gIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQoeyBnbywgZW50aXR5OiB0aGlzLCByYWRpdXM6IDIwIH0pXG4gIHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgPSAwXG4gIHRoaXMubGV2ZWwgPSAxO1xuICB0aGlzLnVwZGF0ZV94cCA9IChlbnRpdHkpID0+IHtcbiAgICB0aGlzLmV4cGVyaWVuY2VfcG9pbnRzICs9IDEwMDtcbiAgICBpZiAodGhpcy5leHBlcmllbmNlX3BvaW50cyA+PSAxMDAwKSB7XG4gICAgICB0aGlzLmxldmVsICs9IDE7XG4gICAgICB0aGlzLmV4cGVyaWVuY2VfcG9pbnRzID0gMDtcbiAgICB9XG4gIH1cbiAgdGhpcy5pc19idXN5ID0gZmFsc2VcbiAgdGhpcy5pc19idXN5X3dpdGggPSBudWxsO1xuXG4gIHRoaXMudXBkYXRlX2ZwcyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X21hbmEgPCB0aGlzLnN0YXRzLm1hbmEpIHRoaXMuc3RhdHMuY3VycmVudF9tYW5hICs9IHJhbmRvbSgxLCAzKVxuICAgIGlmIChuZWFyX2JvbmZpcmUoKSkge1xuICAgICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9ocCA8IHRoaXMuc3RhdHMuaHApIHRoaXMuc3RhdHMuY3VycmVudF9ocCArPSByYW5kb20oNCwgNylcbiAgICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiB0cmllcyB0byBzZWUgaWYgdGhlIHNlbGVjdGVkIGNsaWNrYWJsZSBoYXMgYSBkZWZhdWx0IGFjdGlvbiBzZXQgZm9yIGludGVyYWN0aW9uXG4gIHRoaXMuc2tpbGxfYWN0aW9uID0gKCkgPT4ge1xuICAgIGxldCBvYmplY3QgPSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZVxuICAgIGlmIChvYmplY3QuYWN0ZWRfYnlfc2tpbGwgPT0gJ2xvb3QnKSB7XG4gICAgICBpZiAoVmVjdG9yMi5kaXN0YW5jZShvYmplY3QsIHRoaXMpIDwgb2JqZWN0LndpZHRoICsgMjApIHtcbiAgICAgICAgbmV3IExvb3QoeyBnbywgZW50aXR5OiB0aGlzLCBsb290X2JhZzogb2JqZWN0IH0pLmFjdCgpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvYmplY3QgJiYgdGhpcy5za2lsbHNbb2JqZWN0LmFjdGVkX2J5X3NraWxsXSkge1xuICAgICAgdGhpcy5za2lsbHNbb2JqZWN0LmFjdGVkX2J5X3NraWxsXSgpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5lc2NhcGVfa2V5ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmlzX2J1c3lfd2l0aCkge1xuICAgICAgdGhpcy5pc19idXN5X3dpdGguc3RvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdvLnN0YXJ0X21lbnUuYWN0aXZlID0gIXRoaXMuZ28uc3RhcnRfbWVudS5hY3RpdmVcbiAgICB9XG4gIH1cblxuICBjb25zdCBuZWFyX2JvbmZpcmUgPSAoKSA9PiB0aGlzLmdvLmZpcmVzLnNvbWUoZmlyZSA9PiBWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIGZpcmUpIDwgMTAwKTtcblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMudGFyZ2V0X21vdmVtZW50KSB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KClcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgTWF0aC5mbG9vcih0aGlzLndhbGtfY3ljbGVfaW5kZXgpICogdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSgpICogdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gICAgdGhpcy5tYW5hX2Jhci5kcmF3KHRoaXMuc3RhdHMubWFuYSwgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEpXG4gIH1cblxuICB0aGlzLmRyYXdfY2hhcmFjdGVyID0gKHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9KSA9PiB7XG4gICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnggOiB4XG4gICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnkgOiB5XG4gICAgd2lkdGggPSB3aWR0aCA9PT0gdW5kZWZpbmVkID8gdGhpcy53aWR0aCA6IHdpZHRoXG4gICAgaGVpZ2h0ID0gaGVpZ2h0ID09PSB1bmRlZmluZWQgPyB0aGlzLmhlaWdodCA6IGhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gIH1cblxuICB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICByZXR1cm4gMlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICByZXR1cm4gM1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHJldHVybiAxXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gICAgY29uc3QgZnV0dXJlX3Bvc2l0aW9uID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSwgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICBpZiAodGhpcy54ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQud2lkdGggKyB0aGlzLmdvLndvcmxkLnhfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnggKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIGlmICh0aGlzLnkgLSB0aGlzLnNwZWVkID4gdGhpcy5nby53b3JsZC55X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi55IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIGlmICh0aGlzLnggLSB0aGlzLnNwZWVkID4gdGhpcy5nby53b3JsZC54X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC5oZWlnaHQgKyB0aGlzLmdvLndvcmxkLnlfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5nby50cmVlcy5zb21lKHRyZWUgPT4gKGlzX2NvbGxpZGluZyhmdXR1cmVfcG9zaXRpb24sIHRyZWUpKSkpIHtcbiAgICAgIHRoaXMueCA9IGZ1dHVyZV9wb3NpdGlvbi54XG4gICAgICB0aGlzLnkgPSBmdXR1cmVfcG9zaXRpb24ueVxuICAgICAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gKHRoaXMud2Fsa19jeWNsZV9pbmRleCArICgwLjAzICogdGhpcy5zcGVlZCkpICUgM1xuICAgICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcylcbiAgICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgICBhY3Rpb246IFwibW92ZVwiLFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgICB5OiB0aGlzLnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5nby5zZXJ2ZXIuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICAgIH1cbiAgfVxuXG4gIC8vIEV4cGVyaW1lbnRzXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cblxuICB0aGlzLmZpbmRfcGF0aCA9ICh0YXJnZXRfbW92ZW1lbnQpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSB0YXJnZXRfbW92ZW1lbnRcblxuICAgIGlmICh0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IHg6IHRoaXMueCArIHRoaXMuc3BlZWQsIHk6IHRoaXMueSArIHRoaXMuc3BlZWQgfSlcbiAgICB9XG5cbiAgICB2YXIgbGFzdF9zdGVwID0ge31cbiAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0ge31cblxuICAgIGRvIHtcbiAgICAgIGxhc3Rfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoW3RoaXMuY3VycmVudF9wYXRoLmxlbmd0aCAtIDFdXG4gICAgICBmdXR1cmVfbW92ZW1lbnQgPSB7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgICAgLy8gVGhpcyBjb2RlIHdpbGwga2VlcCB0cnlpbmcgdG8gZ28gYmFjayB0byB0aGUgc2FtZSBwcmV2aW91cyBmcm9tIHdoaWNoIHdlIGp1c3QgYnJhbmNoZWQgb3V0XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnggPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcblxuICAgICAgLy8gVGhpcyBpcyBwcmV0dHkgaGVhdnkuLi4gSXQncyBjYWxjdWxhdGluZyBhZ2FpbnN0IGFsbCB0aGUgYml0cyBpbiB0aGUgbWFwID1bXG4gICAgICB2YXIgZ29pbmdfdG9fY29sbGlkZSA9IHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpXG4gICAgICBpZiAoZ29pbmdfdG9fY29sbGlkZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ29sbGlzaW9uIGFoZWFkIScpXG4gICAgICAgIHZhciBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnggPSBuZXh0X21vdmVtZW50LnggLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgb24gWVwiKVxuICAgICAgICB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueSA9IG5leHRfbW92ZW1lbnQueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBYXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyAuLi5mdXR1cmVfbW92ZW1lbnQgfSlcbiAgICB9IHdoaWxlICgoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHx8IChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkpXG5cbiAgICB0aGlzLm1vdmluZyA9IHRydWVcbiAgfVxuXG4gIHRoaXMubW92ZV9vbl9wYXRoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdmFyIG5leHRfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoLnNoaWZ0KClcbiAgICAgIGlmIChuZXh0X3N0ZXApIHtcbiAgICAgICAgdGhpcy54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgdGhpcy55ID0gbmV4dF9zdGVwLnlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICAvL3RoaXMubW92ZSA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCkge1xuICAvLyAgaWYgKHRoaXMubW92aW5nKSB7XG4gIC8vICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7IHg6IHRoaXMueCwgeTogdGhpcy55IH1cblxuICAvLyAgICBpZiAoKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA8PSAxKSkge1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gIC8vICAgICAgdGFyZ2V0X21vdmVtZW50ID0ge31cbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCh0YXJnZXRfbW92ZW1lbnQpXG5cbiAgLy8gICAgICAvLyBQYXRoaW5nXG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgIH1cblxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQud2lkdGggPSB0aGlzLndpZHRoXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gIC8vICAgIGlmICgodGhpcy5nby5lbnRpdGllcy5ldmVyeSgoZW50aXR5KSA9PiBlbnRpdHkuaWQgPT09IHRoaXMuaWQgfHwgIWlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGVudGl0eSkgKSkgJiZcbiAgLy8gICAgICAoIXRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpKSkge1xuICAvLyAgICAgIHRoaXMueCA9IGZ1dHVyZV9tb3ZlbWVudC54XG4gIC8vICAgICAgdGhpcy55ID0gZnV0dXJlX21vdmVtZW50LnlcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIkJsb2NrZWRcIik7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAvLyAgICB9XG4gIC8vICB9XG4gIC8vICAvLyBFTkQgLSBDaGFyYWN0ZXIgTW92ZW1lbnRcbiAgLy99XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2xpY2thYmxlKGdvLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZV9zcmMpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2xpY2thYmxlcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5uYW1lID0gaW1hZ2Vfc3JjXG4gIHRoaXMueCA9IHhcbiAgdGhpcy55ID0geVxuICB0aGlzLndpZHRoID0gd2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gIHRoaXMuYWN0aXZhdGVkID0gZmFsc2VcbiAgdGhpcy5wYWRkaW5nID0gNVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQsIHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy5wYWRkaW5nLCB0aGlzLnkgLSB0aGlzLnBhZGRpbmcsIHRoaXMud2lkdGggKyAoMip0aGlzLnBhZGRpbmcpLCB0aGlzLmhlaWdodCArICgyKnRoaXMucGFkZGluZykpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsaWNrXCIpXG4gIH1cbn1cbiIsImltcG9ydCBDbGlja2FibGUgZnJvbSBcIi4vY2xpY2thYmxlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udHJvbHMoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY29udHJvbHMgPSB0aGlzXG4gIHRoaXMud2lkdGggPSBzY3JlZW4ud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBzY3JlZW4uaGVpZ2h0ICogMC40XG4gIHRoaXMuYXJyb3dzID0ge1xuICAgIHVwOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTAsIDgwLCA4MCwgXCJhcnJvd191cC5wbmdcIiksXG4gICAgbGVmdDogbmV3IENsaWNrYWJsZShnbywgNTAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19sZWZ0LnBuZ1wiKSxcbiAgICByaWdodDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSArIDcwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfcmlnaHQucG5nXCIpLFxuICAgIGRvd246IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMjAsIDgwLCA4MCwgXCJhcnJvd19kb3duLnBuZ1wiKSxcbiAgfVxuICB0aGlzLmFycm93cy51cC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIilcbiAgdGhpcy5hcnJvd3MuZG93bi5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKVxuICB0aGlzLmFycm93cy5sZWZ0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJsZWZ0XCIpXG4gIHRoaXMuYXJyb3dzLnJpZ2h0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJyaWdodFwiKVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuYXJyb3dzKS5mb3JFYWNoKGFycm93ID0+IGFycm93LmRyYXcoKSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlXCI7XG5cbmZ1bmN0aW9uIERvb2RhZCh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgdGhpcy54ID0gMDtcbiAgdGhpcy55ID0gMDtcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMud2lkdGggPSAzMlxuICB0aGlzLmhlaWdodCA9IDMyXG4gIHRoaXMucmVzb3VyY2VfYmFyID0gbnVsbFxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh0YXJnZXRfcG9zaXRpb24pIHtcbiAgICBsZXQgeCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueCA/IHRhcmdldF9wb3NpdGlvbi54IDogdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgIGxldCB5ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi55ID8gdGFyZ2V0X3Bvc2l0aW9uLnkgOiB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgbGV0IHdpZHRoID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi53aWR0aCA/IHRhcmdldF9wb3NpdGlvbi53aWR0aCA6IHRoaXMud2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgPyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAgaWYgKHRhcmdldF9wb3NpdGlvbikgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5yZXNvdXJjZV9iYXIpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmRyYXcoKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSBmdW5jdGlvbiAoKSB7IH1cbiAgdGhpcy51cGRhdGVfZnBzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZ1ZWwgPD0gMCkge1xuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIGdvLmZpcmVzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZ1ZWwgLT0gMTtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmN1cnJlbnQgLT0gMTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9vZGFkO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRWRpdG9yKHsgZ28gfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZ28uZWRpdG9yID0gdGhpc1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3JkcyA9IHtcbiAgICAgICAgeDogdGhpcy5nby5zY3JlZW4ud2lkdGggLSAzMDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogdGhpcy5nby5zY3JlZW4uaGVpZ2h0XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCwgdGhpcy5nby5zY3JlZW4uaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5kcmF3X2NoYXJhY3Rlcih7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyKSxcbiAgICAgICAgICAgIHk6IDUwLFxuICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MFxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgICAgIGxldCB0ZXh0ID0gYHg6ICR7dGhpcy5nby5jaGFyYWN0ZXIueC50b0ZpeGVkKDIpfSwgeTogJHt0aGlzLmdvLmNoYXJhY3Rlci55LnRvRml4ZWQoMil9YFxuICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyA1MCArIDUwICsgMjApXG5cbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB0aGlzLmRyYXdfc2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3NlbGVjdGlvbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuZHJhdyh7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyIC0gMzUsXG4gICAgICAgICAgICB5OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwLFxuICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgaGVpZ2h0OiA3MFxuICAgICAgICB9KVxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwICsgMTAwKVxuICAgIH1cbn0iLCIvLyBUaGUgY2FsbGJhY2tzIHN5c3RlbVxuLy8gXG4vLyBUbyB1c2UgaXQ6XG4vL1xuLy8gKiBpbXBvcnQgdGhlIGNhbGxiYWNrcyB5b3Ugd2FudFxuLy9cbi8vICAgIGltcG9ydCB7IHNldE1vdXNlbW92ZUNhbGxiYWNrIH0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG4vL1xuLy8gKiBjYWxsIHRoZW0gYW5kIHN0b3JlIHRoZSBhcnJheSBvZiBjYWxsYmFjayBmdW5jdGlvbnNcbi8vXG4vLyAgICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pO1xuLy9cbi8vICogYWRkIG9yIHJlbW92ZSBjYWxsYmFja3MgZnJvbSBhcnJheVxuLy9cbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaChnby5jYW1lcmEubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSlcbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcblxuZnVuY3Rpb24gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IG9uX21vdXNlbW92ZSA9IChldikgPT4ge1xuICAgIG1vdXNlbW92ZV9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25fbW91c2Vtb3ZlLCBmYWxzZSlcbiAgcmV0dXJuIG1vdXNlbW92ZV9jYWxsYmFja3M7XG59XG5cblxuZnVuY3Rpb24gc2V0Q2xpY2tDYWxsYmFjayhnbykge1xuICBjb25zdCBjbGlja19jYWxsYmFja3MgPSBbXVxuICBnby5jbGlja19jYWxsYmFja3MgPSBjbGlja19jYWxsYmFja3NcbiAgY29uc3Qgb25fY2xpY2sgID0gKGV2KSA9PiB7XG4gICAgY2xpY2tfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcbiAgcmV0dXJuIGNsaWNrX2NhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0Q2FsbGJhY2soZ28sIGV2ZW50KSB7XG4gIGNvbnN0IGNhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4ge1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZSlcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSlcbiAgcmV0dXJuIGNhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vtb3ZlJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IGNhbGxiYWNrX3F1ZXVlID0gc2V0Q2FsbGJhY2soZ28sICdtb3VzZWRvd24nKTtcbiAgZ28ubW91c2Vkb3duX2NhbGxiYWNrcyA9IGNhbGxiYWNrX3F1ZXVlXG4gIHJldHVybiBjYWxsYmFja19xdWV1ZVxufVxuXG5mdW5jdGlvbiBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2V1cCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hzdGFydCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoZW5kJyk7XG59XG5cbmV4cG9ydCB7XG4gIHNldE1vdXNlbW92ZUNhbGxiYWNrLFxuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufTtcbiIsIi8vIFRoZSBHYW1lIExvb3Bcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBjb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuLy8gZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG4vLyBnYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBwcm9jZXNzX2tleXNfZG93blxuLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xuXG5mdW5jdGlvbiBHYW1lTG9vcCgpIHtcbiAgdGhpcy5kcmF3ID0gbnVsbFxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gbnVsbFxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHt9XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duKClcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIHRoaXMuZHJhdygpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVMb29wXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuY2FudmFzX3JlY3Qud2lkdGgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FudmFzX3JlY3QuaGVpZ2h0KTtcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNoYXJhY3RlciA9IHt9XG4gIHRoaXMuY2xpY2thYmxlcyA9IFtdXG4gIHRoaXMubWVzc2FnZXMgPSBbXVxuICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgdGhpcy5wbGF5ZXJzID0gW11cbiAgdGhpcy5zcGVsbHMgPSBbXSAvLyBTcGVsbCBzeXN0ZW0sIGNvdWxkIGJlIGluamVjdGVkIGJ5IGl0IGFzIHdlbGxcbiAgdGhpcy5za2lsbHMgPSBbXTtcbiAgdGhpcy50cmVlcyA9IFtdO1xuICB0aGlzLmZpcmVzID0gW107XG4gIHRoaXMuc3RvbmVzID0gW107XG4gIHRoaXMubG9vdF9iYWdzID0gW107XG4gIHRoaXMubWFuYWdlZF9vYmplY3RzID0gW10gLy8gUmFuZG9tIG9iamVjdHMgdG8gZHJhdy91cGRhdGVcblxuICB0aGlzLmRyYXdfb2JqZWN0cyA9ICgpID0+IHtcbiAgICB0aGlzLnN0b25lcy5mb3JFYWNoKHN0b25lID0+IHN0b25lLmRyYXcoKSlcbiAgICB0aGlzLnRyZWVzLmZvckVhY2godHJlZSA9PiB0cmVlLmRyYXcoKSlcbiAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gcGxheWVyLmRyYXcoKSlcbiAgICB0aGlzLmZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLmRyYXcoKSlcbiAgICB0aGlzLnNwZWxscy5mb3JFYWNoKHNwZWxsID0+IHNwZWxsLmRyYXcoKSlcbiAgICB0aGlzLnNraWxscy5mb3JFYWNoKHNraWxsID0+IHNraWxsLmRyYXcoKSlcbiAgICB0aGlzLmNyZWVwcy5mb3JFYWNoKGNyZWVwID0+IGNyZWVwLmRyYXcoKSlcbiAgICB0aGlzLmxvb3RfYmFncy5mb3JFYWNoKGxvb3RfYmFnID0+IGxvb3RfYmFnLmRyYXcoKSlcbiAgICB0aGlzLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IuZHJhdygpKVxuICB9XG5cbiAgdGhpcy51cGRhdGVfb2JqZWN0cyA9ICgpID0+IHtcbiAgICB0aGlzLnNwZWxscy5mb3JFYWNoKHNwZWxsID0+IHNwZWxsLnVwZGF0ZSgpKVxuICAgIHRoaXMubG9vdF9iYWdzLmZvckVhY2gobG9vdF9iYWcgPT4gbG9vdF9iYWcudXBkYXRlKCkpXG4gICAgdGhpcy5tYW5hZ2VkX29iamVjdHMuZm9yRWFjaChtb2IgPT4gbW9iLnVwZGF0ZSgpKVxuICB9XG5cbiAgdGhpcy51cGRhdGVfZnBzX29iamVjdHMgPSAoKSA9PiB7XG4gICAgdGhpcy5maXJlcy5mb3JFYWNoKGZpcmUgPT4gZmlyZS51cGRhdGVfZnBzKCkpXG4gIH1cblxuICB0aGlzLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5jdHguc2F2ZSgpXG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSBcInllbGxvd1wiXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwgMjU1LCAwLCAwLjcpYFxuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgIHRoaXMuY3R4LmFyYyhcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueCArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS53aWR0aCAvIDIpIC0gdGhpcy5jYW1lcmEueCxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueSArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS5oZWlnaHQgLyAyKSAtIHRoaXMuY2FtZXJhLnksXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoLCAwLCA1MFxuICAgICAgKVxuICAgICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZU9iamVjdCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludmVudG9yeSh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMubWF4X3Nsb3RzID0gMTJcbiAgdGhpcy5zbG90c19wZXJfcm93ID0gNFxuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5zbG90X3BhZGRpbmcgPSAxMFxuICB0aGlzLnNsb3Rfd2lkdGggPSA1MFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gNTBcbiAgdGhpcy5pbml0aWFsX3ggPSB0aGlzLmdvLnNjcmVlbi53aWR0aCAtICh0aGlzLnNsb3RzX3Blcl9yb3cgKiB0aGlzLnNsb3Rfd2lkdGgpIC0gNTA7XG4gIHRoaXMuaW5pdGlhbF95ID0gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF9oZWlnaHQpIC0gNDAwO1xuICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIHRoaXMueCA9ICgpID0+IHtcbiAgICBjb25zdCByaWdodF9wYW5lbF93aWR0aCA9IHRoaXMuZ28uZWRpdG9yLmFjdGl2ZSA/IHRoaXMuZ28uZWRpdG9yLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCA6IDA7XG4gICAgcmV0dXJuIHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF93aWR0aCkgLSA1MCAtIHJpZ2h0X3BhbmVsX3dpZHRoO1xuICB9XG5cbiAgdGhpcy5hZGQgPSAoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nX2J1bmRsZSA9IHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUgPT0gaXRlbS5uYW1lXG4gICAgfSlcblxuICAgIGlmICgodGhpcy5zbG90cy5sZW5ndGggPj0gdGhpcy5tYXhfc2xvdHMpICYmICghZXhpc3RpbmdfYnVuZGxlKSkgcmV0dXJuXG5cbiAgICBjb25zb2xlLmxvZyhgKioqIEdvdCAke2l0ZW0ucXVhbnRpdHl9ICR7aXRlbS5uYW1lfWApXG4gICAgaWYgKGV4aXN0aW5nX2J1bmRsZSkge1xuICAgICAgZXhpc3RpbmdfYnVuZGxlLnF1YW50aXR5ICs9IGl0ZW0ucXVhbnRpdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zbG90cy5wdXNoKGl0ZW0pXG4gICAgfVxuICB9XG5cbiAgdGhpcy5maW5kID0gKGl0ZW1fbmFtZSkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gaXRlbV9uYW1lLnRvTG93ZXJDYXNlKClcbiAgICB9KVxuICB9XG5cbiAgdGhpcy50b2dnbGVfZGlzcGxheSA9ICgpID0+IHtcbiAgICB0aGlzLmFjdGl2ZSA9ICF0aGlzLmFjdGl2ZTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF4X3Nsb3RzOyBpKyspIHtcbiAgICAgIGxldCB4ID0gTWF0aC5mbG9vcihpICUgNClcbiAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihpIC8gNCk7XG5cbiAgICAgIGlmICgodGhpcy5zbG90c1tpXSAhPT0gdW5kZWZpbmVkKSAmJiAodGhpcy5zbG90c1tpXSAhPT0gbnVsbCkpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc2xvdHNbaV07XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShpdGVtLmltYWdlLCB0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICBpZiAoaXRlbS5xdWFudGl0eSA+IDEpIHtcbiAgICAgICAgICBsZXQgdGV4dCA9IGl0ZW0ucXVhbnRpdHlcbiAgICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9IFwiMjRweCBzYW5zLXNlcmlmXCJcbiAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpICsgKHRoaXMuc2xvdF93aWR0aCAtIDE1KSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSkgKyAodGhpcy5zbG90X2hlaWdodCAtIDUpKVxuICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gMVxuICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVRleHQodGV4dCwgdGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSArICh0aGlzLnNsb3Rfd2lkdGggLSAxNSksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpICsgKHRoaXMuc2xvdF9oZWlnaHQgLSA1KSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgfVxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYig2MCwgNDAsIDApXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSksIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEl0ZW0obmFtZSwgaW1hZ2UsIHF1YW50aXR5ID0gMSwgc3JjX2ltYWdlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgaWYgKGltYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltYWdlLnNyYyA9IHNyY19pbWFnZVxuICB9IGVsc2Uge1xuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZVxuICB9XG4gIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxufVxuIiwiZnVuY3Rpb24gS2V5Ym9hcmRJbnB1dChnbykge1xuICBjb25zdCBvbl9rZXlkb3duID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSB0cnVlXG4gICAgLy8gVGhlc2UgYXJlIGNhbGxiYWNrcyB0aGF0IG9ubHkgZ2V0IGNoZWNrZWQgb25jZSBvbiB0aGUgZXZlbnRcbiAgICBpZiAodGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XSA9IFtdXG4gICAgfVxuICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soZXYpKVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbl9rZXlkb3duLCBmYWxzZSlcbiAgY29uc3Qgb25fa2V5dXAgPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IGZhbHNlXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbl9rZXl1cCwgZmFsc2UpXG5cbiAgdGhpcy5nbyA9IGdvO1xuICB0aGlzLmdvLmtleWJvYXJkX2lucHV0ID0gdGhpc1xuICB0aGlzLmtleV9jYWxsYmFja3MgPSB7XG4gICAgZDogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJyaWdodFwiKV0sXG4gICAgdzogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJ1cFwiKV0sXG4gICAgYTogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJsZWZ0XCIpXSxcbiAgICBzOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImRvd25cIildLFxuICB9XG4gIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3MgPSB7XG4gICAgMTogW11cbiAgfVxuXG4gIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24gPSAoKSA9PiB7XG4gICAgY29uc3Qga2V5c19kb3duID0gT2JqZWN0LmtleXModGhpcy5rZXlzX2N1cnJlbnRseV9kb3duKS5maWx0ZXIoKGtleSkgPT4gdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2tleV0gPT09IHRydWUpXG4gICAga2V5c19kb3duLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKCEoT2JqZWN0LmtleXModGhpcy5rZXlfY2FsbGJhY2tzKS5pbmNsdWRlcyhrZXkpKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMua2V5X2NhbGxiYWNrc1trZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjaygpKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLmtleW1hcCA9IHtcbiAgICBkOiBcInJpZ2h0XCIsXG4gICAgdzogXCJ1cFwiLFxuICAgIGE6IFwibGVmdFwiLFxuICAgIHM6IFwiZG93blwiLFxuICB9XG5cbiAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duID0ge1xuICAgIGQ6IGZhbHNlLFxuICAgIHc6IGZhbHNlLFxuICAgIGE6IGZhbHNlLFxuICAgIHM6IGZhbHNlLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtleWJvYXJkSW5wdXQ7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb290IHtcbiAgICBjb25zdHJ1Y3RvcihpdGVtLCBxdWFudGl0eSA9IDEpIHtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbVxuICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcbiAgICB9XG59IiwiaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tLCBkaWNlIH0gZnJvbSBcIi4vdGFwZXRlXCJcbmltcG9ydCBJdGVtIGZyb20gXCIuL2l0ZW1cIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vbG9vdFwiXG5cbmNsYXNzIExvb3RCb3gge1xuICAgIGNvbnN0cnVjdG9yKGdvKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICBnby5sb290X2JveCA9IHRoaXNcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgICAgIHRoaXMueCA9IDBcbiAgICAgICAgdGhpcy55ID0gMFxuICAgICAgICB0aGlzLndpZHRoID0gMzUwXG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybjtcblxuICAgICAgICAvLyBJZiB0aGUgcGxheWVyIG1vdmVzIGF3YXksIGRlbGV0ZSBpdGVtcyBhbmQgaGlkZSBsb290IGJveCBzY3JlZW5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKFZlY3RvcjIuZGlzdGFuY2UodGhpcywgdGhpcy5nby5jaGFyYWN0ZXIpID4gNTAwKSB8fFxuICAgICAgICAgICAgKHRoaXMuaXRlbXMubGVuZ3RoIDw9IDApXG4gICAgICAgICkge1xuXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVKb2luID0gJ2JldmVsJztcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyMDAsIDI1NSwgMC41KVwiO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zW2luZGV4XVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICAgICAgbG9vdC54ID0gdGhpcy54ICsgMjUgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICBsb290LnkgPSB0aGlzLnkgKyAoaW5kZXggKiA2MCkgKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICAgICAgICAgIGxvb3Qud2lkdGggPSAzNDBcbiAgICAgICAgICAgIGxvb3QuaGVpZ2h0ID0gNTVcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KGxvb3QueCwgbG9vdC55LCBsb290LndpZHRoLCBsb290LmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShsb290Lml0ZW0uaW1hZ2UsIGxvb3QueCArIDUsIGxvb3QueSArIDUsIDQ1LCA0NSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnMjJweCBzZXJpZidcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QucXVhbnRpdHksIGxvb3QueCArIDY1LCBsb290LnkgKyAzNSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QuaXRlbS5uYW1lLCBsb290LnggKyAxMDAsIGxvb3QueSArIDM1KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZVxuICAgICAgICB0aGlzLnggPSB0aGlzLmdvLmNoYXJhY3Rlci54XG4gICAgICAgIHRoaXMueSA9IHRoaXMuZ28uY2hhcmFjdGVyLnlcbiAgICB9XG5cbiAgICB0YWtlX2xvb3QobG9vdF9pbmRleCkge1xuICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXMuc3BsaWNlKGxvb3RfaW5kZXgsIDEpWzBdXG4gICAgICAgIGlmICh0aGlzLmxvb3RfYmFnKSB7XG4gICAgICAgICAgICB0aGlzLmxvb3RfYmFnLml0ZW1zLnNwbGljZShsb290X2luZGV4LCAxKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLmludmVudG9yeS5hZGQobG9vdC5pdGVtKVxuICAgIH1cblxuICAgIGNoZWNrX2l0ZW1fY2xpY2tlZChldikge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuXG5cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGxvb3QpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPj0gbG9vdC54KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRYIDw9IGxvb3QueCArIGxvb3Qud2lkdGgpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPj0gbG9vdC55KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRZIDw9IGxvb3QueSArIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgKVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnRha2VfbG9vdChpbmRleClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJvbGxfbG9vdChsb290X3RhYmxlKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBsb290X3RhYmxlLm1hcCgobG9vdF9lbnRyeSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJvbGwgPSBkaWNlKDEwMClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAqKiogTG9vdCByb2xsIGZvciAke2xvb3RfZW50cnkuaXRlbS5uYW1lfTogJHtyb2xsfSAoY2hhbmNlOiAke2xvb3RfZW50cnkuY2hhbmNlfSlgKVxuICAgICAgICAgICAgaWYgKHJvbGwgPD0gbG9vdF9lbnRyeS5jaGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtX2J1bmRsZSA9IG5ldyBJdGVtKGxvb3RfZW50cnkuaXRlbS5uYW1lKVxuICAgICAgICAgICAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IGxvb3RfZW50cnkuaXRlbS5pbWFnZV9zcmNcbiAgICAgICAgICAgICAgICBpdGVtX2J1bmRsZS5xdWFudGl0eSA9IHJhbmRvbShsb290X2VudHJ5Lm1pbiwgbG9vdF9lbnRyeS5tYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMb290KGl0ZW1fYnVuZGxlLCBpdGVtX2J1bmRsZS5xdWFudGl0eSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMb290Qm94IiwiZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gIHRoaXMuaWQgPSBkYXRhLmlkXG4gIHRoaXMueCA9IGRhdGEueFxuICB0aGlzLnkgPSBkYXRhLnlcbiAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodFxuICB0aGlzLmNvbG91ciA9IFwidHJhbnNwYXJlbnRcIlxuICB0aGlzLmJvcmRlcl9jb2xvdXIgPSBcImJsYWNrXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFydGljbGUoZ28pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKHsgeCwgeSB9KSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKHggLSB0aGlzLmdvLmNhbWVyYS54LCB5IC0gdGhpcy5nby5jYW1lcmEueSwgMTUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICdibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdsaWdodGJsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKTtcbiAgICB9XG59IiwiaW1wb3J0IFBhcnRpY2xlIGZyb20gXCIuL3BhcnRpY2xlLmpzXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3QgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLnBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKGdvKTtcbiAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0XG4gICAgdGhpcy50cmFjZV9jb3VudCA9IDdcbiAgICB0aGlzLmJvdW5kcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB3aWR0aDogNSwgaGVpZ2h0OiA1IH1cbiAgICB9XG4gICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLmFjdCA9ICh7IHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24gfSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gc3RhcnRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN0YXJ0X3Bvc2l0aW9uKVxuICAgICAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IGVuZF9wb3NpdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmVuZF9wb3NpdGlvbiwgdGhpcy5jdXJyZW50X3Bvc2l0aW9uKSA8IDUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdC5lbmQoKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZV9wb3NpdGlvbigpO1xuICAgICAgICB0aGlzLnRyYWNlLnB1c2goT2JqZWN0LmNyZWF0ZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24pKVxuICAgICAgICB0aGlzLnRyYWNlID0gdGhpcy50cmFjZS5zbGljZSgtMSAqIHRoaXMudHJhY2VfY291bnQpXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5kcmF3KHRoaXMuY3VycmVudF9wb3NpdGlvbik7XG4gICAgICAgIHRoaXMudHJhY2UuZm9yRWFjaCh0cmFjZWRfcG9zaXRpb24gPT4gdGhpcy5wYXJ0aWNsZS5kcmF3KHRyYWNlZF9wb3NpdGlvbikpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMi5hbmdsZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24sIHRoaXMuZW5kX3Bvc2l0aW9uKTtcbiAgICAgICAgY29uc3Qgc3BlZWQgPSByYW5kb20oMywgMTIpO1xuICAgICAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmN1cnJlbnRfcG9zaXRpb24ueCArIHNwZWVkICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICAgICAgeTogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnkgKyBzcGVlZCAqIE1hdGguc2luKGFuZ2xlKVxuICAgICAgICB9XG4gICAgfVxufSIsImZ1bmN0aW9uIFJlc291cmNlQmFyKHsgZ28sIHRhcmdldCwgeV9vZmZzZXQgPSAxMCwgY29sb3VyID0gXCJyZWRcIiwgYm9yZGVyLCBmaXhlZCB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLnRhcmdldCA9IHRhcmdldFxuICB0aGlzLmhlaWdodCA9IHRoaXMudGFyZ2V0LndpZHRoIC8gMTA7XG4gIHRoaXMuY29sb3VyID0gY29sb3VyXG4gIHRoaXMuZnVsbCA9IDEwMFxuICB0aGlzLmN1cnJlbnQgPSAxMDBcbiAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gIHRoaXMuYm9yZGVyID0gYm9yZGVyXG4gIHRoaXMuZml4ZWQgPSBmaXhlZCB8fCBmYWxzZVxuICB0aGlzLnggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuZml4ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC54O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQueCAtIHRoaXMuZ28uY2FtZXJhLng7XG4gICAgfVxuICB9XG4gIHRoaXMueSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5maXhlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Lnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC55IC0gdGhpcy5nby5jYW1lcmEueTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCwgZGVidWcgPSBmYWxzZSkgPT4ge1xuICAgIGxldCBiYXJfd2lkdGggPSAoKChNYXRoLm1pbihjdXJyZW50LCBmdWxsKSkgLyBmdWxsKSAqIHRoaXMudGFyZ2V0LndpZHRoKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5ib3JkZXIgfHwgXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54KCksIHRoaXMueSgpIC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpLCB0aGlzLnkoKSAtIHRoaXMueV9vZmZzZXQsIHRoaXMudGFyZ2V0LndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpLCB0aGlzLnkoKSAtIHRoaXMueV9vZmZzZXQsIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VCYXJcbiIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuXG5mdW5jdGlvbiBTY3JlZW4oZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uc2NyZWVuID0gdGhpc1xuICB0aGlzLndpZHRoICA9IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQ7XG4gIHRoaXMucmFkaXVzID0gNzAwXG5cbiAgdGhpcy5jbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jYW52YXMud2lkdGggPSB0aGlzLmdvLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuZ28uY2FudmFzLmhlaWdodCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuZ28uY2FudmFzX3JlY3QgPSB0aGlzLmdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMuY2xlYXIoKVxuICAgIHRoaXMuZ28ud29ybGQuZHJhdygpXG4gIH1cblxuICB0aGlzLmRyYXdfZ2FtZV9vdmVyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjcpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICB0aGlzLmdvLmN0eC5mb250ID0gJzcycHggc2VyaWYnXG4gICAgdGhpcy5nby5jdHguZmlsbFRleHQoXCJHYW1lIE92ZXJcIiwgKHRoaXMuZ28uY2FudmFzLndpZHRoIC8gMikgLSAodGhpcy5nby5jdHgubWVhc3VyZVRleHQoXCJHYW1lIE92ZXJcIikud2lkdGggLyAyKSwgdGhpcy5nby5jYW52YXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICB0aGlzLmRyYXdfZm9nID0gKHJhZGl1cykgPT4ge1xuICAgIHZhciB4ID0gdGhpcy5nby5jaGFyYWN0ZXIueCArIHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMiAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICB2YXIgeSA9IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyB0aGlzLmdvLmNoYXJhY3Rlci5oZWlnaHQgLyAyIC0gdGhpcy5nby5jYW1lcmEueVxuICAgIHZhciBncmFkaWVudCA9IHRoaXMuZ28uY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHJhZGl1cyB8fCB0aGlzLnJhZGl1cyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDAsIDAsIDAsIDApJylcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwgMCwgMCwgMSknKVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50XG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgMCwgc2NyZWVuLndpZHRoLCBzY3JlZW4uaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjcmVlblxuIiwiaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2VydmVyKGdvLCBwbGF5ZXIpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMucGxheWVyID0gcGxheWVyXG4gIHRoaXMuZ28uY2hhcmFjdGVyID0gcGxheWVyXG4gIGdvLnNlcnZlciA9IHRoaXNcblxuICB0aGlzLmNvbm4gPSB1bmRlZmluZWQ7XG4gIHRoaXMuY29ubmVjdCA9ICgpID0+IHtcbiAgICB0aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly8wLnRjcC5ldS5uZ3Jvay5pbzoxNzg5MFwiKTtcbiAgICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5sb2dpbih0aGlzLmdvLmNoYXJhY3RlcilcbiAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgcGF5bG9hZCA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSlcbiAgICAgIGNvbnNvbGUubG9nKHBheWxvYWQpXG4gICAgICBzd2l0Y2ggKHBheWxvYWQudHlwZSkge1xuICAgICAgICBjYXNlIFwibG9naW5cIiwgXCJmaXJzdExvYWRcIjpcbiAgICAgICAgICBmaXJzdF9sb2FkKHBheWxvYWQpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtb3ZlTG9hZFwiOlxuICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMuZ28ucGxheWVycy5maW5kKHBsYXllciA9PiBwYXlsb2FkLnBsYXllci5pZCA9PT0gcGxheWVyLmlkKVxuICAgICAgICAgIGlmICghcGxheWVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciBub3QgZm91bmRcIilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGxheWVyLmlkID09PSB0aGlzLmdvLmNoYXJhY3Rlci5pZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZ25vcmluZyBtb3ZlTG9hZCBmb3Igc2VsZlwiKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyIGZvdW5kOiAke3BsYXllci5uYW1lfWApXG4gICAgICAgICAgfVxuICAgICAgICAgIHBsYXllci54ID0gcGF5bG9hZC50YXJnZXQueFxuICAgICAgICAgIHBsYXllci55ID0gcGF5bG9hZC50YXJnZXQueVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3UGxheWVyTG9hZFwiOlxuICAgICAgICAgIGNvbnN0IG5ld19wbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuICAgICAgICAgIG5ld19wbGF5ZXIuaWQgPSBwYXlsb2FkLnBsYXllci5pZFxuICAgICAgICAgIG5ld19wbGF5ZXIueCA9IHBheWxvYWQucGxheWVyLnBvc2l0aW9uLnhcbiAgICAgICAgICBuZXdfcGxheWVyLnkgPSBwYXlsb2FkLnBsYXllci5wb3NpdGlvbi55XG4gICAgICAgICAgZ28ucGxheWVycy5wdXNoKG5ld19wbGF5ZXIpXG4gICAgICAgICAgZ28uY2xpY2thYmxlcy5wdXNoKG5ld19wbGF5ZXIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwaW5nXCI6XG4gICAgICAgIC8vZ28uY3R4LmZpbGxSZWN0KHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueCwgcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55LCA1MCwgNTApXG4gICAgICAgIC8vZ28uY3R4LnN0cm9rZSgpXG4gICAgICAgIC8vbGV0IHBsYXllciA9IHBsYXllcnNbMF0gLy9wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBsYXllci5uYW1lID09PSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWUpXG4gICAgICAgIC8vaWYgKHBsYXllcikge1xuICAgICAgICAvLyAgcGxheWVyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbiAgICAgICAgLy8gIHBsYXllci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4gICAgICAgIC8vfVxuICAgICAgICAvL2JyZWFrO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKVxuICB9XG5cbiAgZnVuY3Rpb24gZmlyc3RfbG9hZChwYXlsb2FkLCBwbGF5ZXIpIHtcbiAgICBnby5jaGFyYWN0ZXIuaWQgPSBwYXlsb2FkLmN1cnJlbnRQbGF5ZXIuaWRcbiAgICBnby5jaGFyYWN0ZXIubmFtZSA9IHBheWxvYWQuY3VycmVudFBsYXllci5uYW1lXG4gICAgZ28uY2hhcmFjdGVyLnggPSBwYXlsb2FkLmN1cnJlbnRQbGF5ZXIucG9zaXRpb24ueFxuICAgIGdvLmNoYXJhY3Rlci55ID0gcGF5bG9hZC5jdXJyZW50UGxheWVyLnBvc2l0aW9uLnlcbiAgICBwYXlsb2FkLm90aGVyUGxheWVycy5mb3JFYWNoKChvdGhlclBsYXllclBheWxvYWQpID0+IHtcbiAgICAgIGxldCBvdGhlclBsYXllciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICBvdGhlclBsYXllci5pZCA9IG90aGVyUGxheWVyUGF5bG9hZC5pZFxuICAgICAgb3RoZXJQbGF5ZXIueCA9IG90aGVyUGxheWVyUGF5bG9hZC5wb3NpdGlvbi54XG4gICAgICBvdGhlclBsYXllci55ID0gb3RoZXJQbGF5ZXJQYXlsb2FkLnBvc2l0aW9uLnlcbiAgICAgIGdvLnBsYXllcnMucHVzaChvdGhlclBsYXllcilcbiAgICAgIGdvLmNsaWNrYWJsZXMucHVzaChvdGhlclBsYXllcilcbiAgICB9KVxuICAgIGdvLmNhbWVyYS5mb2N1cyhnby5jaGFyYWN0ZXIpXG4gIH1cblxuICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNoYXJhY3Rlcikge1xuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4gICAgICBhcmdzOiB7XG4gICAgICAgIHBsYXllcjoge1xuICAgICAgICAgIGlkOiBjaGFyYWN0ZXIuaWQsXG4gICAgICAgICAgbmFtZTogY2hhcmFjdGVyLm5hbWUsXG4gICAgICAgIH0sXG4gICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgfVxuXG4gIHRoaXMucGluZyA9IGZ1bmN0aW9uIChjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNraWxsKHsgZ28sIGVudGl0eSwgc2tpbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5za2lsbCA9IHNraWxsXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5za2lsbC5hY3QoKVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmVtb3ZlX2NsaWNrYWJsZSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJyZWFrX3N0b25lKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHkgfHwgZ28uY2hhcmFjdGVyXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogdGhpcy5lbnRpdHkgfSlcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXRlZF9zdG9uZSA9IHRoaXMuZ28uc3RvbmVzLmZpbmQoKHN0b25lKSA9PiBzdG9uZSA9PT0gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpXG4gICAgICAgIGlmICgoIXRhcmdldGVkX3N0b25lKSB8fCAoVmVjdG9yMi5kaXN0YW5jZSh0YXJnZXRlZF9zdG9uZSwgdGhpcy5lbnRpdHkpID4gMTAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nby5zdG9uZXMuaW5kZXhPZih0YXJnZXRlZF9zdG9uZSlcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KGxvb3RfdGFibGVfc3RvbmUpXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZ28uc3RvbmVzKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9jbGlja2FibGUodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZ28pXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBsb290X3RhYmxlX3N0b25lID0gW3tcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIkZsaW50c3RvbmVcIiwgaW1hZ2Vfc3JjOiBcImZsaW50c3RvbmUucG5nXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGNoYW5jZTogMTAwXG4gICAgfV1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgcmVtb3ZlX2NsaWNrYWJsZSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDdXRUcmVlKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmxvb3RfYm94ID0gZ28ubG9vdF9ib3hcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiBlbnRpdHkgfSlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlOyAvLyBNYXliZSBHYW1lT2JqZWN0IHNob3VsZCBjb250cm9sIHRoaXMgdG9nZ2xlXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfdHJlZSA9IHRoaXMuZ28udHJlZXMuZmluZCgodHJlZSkgPT4gdHJlZSA9PT0gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpXG4gICAgICAgIGlmICgoIXRhcmdldGVkX3RyZWUpIHx8IChWZWN0b3IyLmRpc3RhbmNlKHRhcmdldGVkX3RyZWUsIHRoaXMuZ28uY2hhcmFjdGVyKSA+IDIwMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgzMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ28udHJlZXMuaW5kZXhPZih0YXJnZXRlZF90cmVlKVxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBsb290Ym94ZXMgaGF2ZSB0byBtb3ZlIGZyb20gd2VpcmRcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QodGhpcy5sb290X3RhYmxlKVxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRhcmdldGVkX3RyZWUsIHRoaXMuZ28udHJlZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3RyZWUsIHRoaXMuZ28pXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubG9vdF90YWJsZSA9IFt7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJXb29kXCIsIGltYWdlX3NyYzogXCJicmFuY2gucG5nXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDMsXG4gICAgICAgIGNoYW5jZTogOTVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJEcnkgTGVhdmVzXCIsIGltYWdlX3NyYzogXCJsZWF2ZXMuanBlZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAzLFxuICAgICAgICBjaGFuY2U6IDEwMFxuICAgICAgfV1cbiAgICAgIFxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIjtcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuLi9yZXNvdXJjZV9iYXJcIjtcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWFrZUZpcmUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHkgfHwgZ28uY2hhcmFjdGVyXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogdGhpcy5lbnRpdHkgfSlcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgZHJ5X2xlYXZlcyA9IHRoaXMuZW50aXR5LmludmVudG9yeS5maW5kKFwiZHJ5IGxlYXZlc1wiKVxuICAgICAgICBsZXQgd29vZCA9IHRoaXMuZW50aXR5LmludmVudG9yeS5maW5kKFwid29vZFwiKVxuICAgICAgICBsZXQgZmxpbnRzdG9uZSA9IHRoaXMuZW50aXR5LmludmVudG9yeS5maW5kKFwiZmxpbnRzdG9uZVwiKVxuICAgICAgICBpZiAoZHJ5X2xlYXZlcyAmJiBkcnlfbGVhdmVzLnF1YW50aXR5ID4gMCAmJlxuICAgICAgICAgICAgd29vZCAmJiB3b29kLnF1YW50aXR5ID4gMCAmJlxuICAgICAgICAgICAgZmxpbnRzdG9uZSAmJiBmbGludHN0b25lLnF1YW50aXR5ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgxNTAwKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBkcnlfbGVhdmVzLnF1YW50aXR5IC09IDFcbiAgICAgICAgICAgICAgICB3b29kLnF1YW50aXR5IC09IDFcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUudHlwZSA9PT0gXCJCT05GSVJFXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpcmUgPSB0aGlzLmdvLmZpcmVzLmZpbmQoKGZpcmUpID0+IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBmaXJlKTtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5mdWVsICs9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ICs9IDIwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJlID0gbmV3IERvb2RhZCh7IGdvIH0pXG4gICAgICAgICAgICAgICAgICAgIGZpcmUudHlwZSA9IFwiQk9ORklSRVwiXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2Uuc3JjID0gXCJib25maXJlLnBuZ1wiXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfeF9vZmZzZXQgPSAyNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV95X29mZnNldCA9IDI1MFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX2hlaWdodCA9IDM1MFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3dpZHRoID0gMzAwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUud2lkdGggPSA2NFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmhlaWdodCA9IDY0XG4gICAgICAgICAgICAgICAgICAgIGZpcmUueCA9IHRoaXMuZW50aXR5Lng7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUueSA9IHRoaXMuZW50aXR5Lnk7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuZnVlbCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvOiB0aGlzLmdvLCB0YXJnZXQ6IGZpcmUgfSlcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuc3RhdGljID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5mdWxsID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nby5maXJlcy5wdXNoKGZpcmUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uY2xpY2thYmxlcy5wdXNoKGZpcmUpXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxNTAwKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJZb3UgZG9udCBoYXZlIGFsbCByZXF1aXJlZCBtYXRlcmlhbHMgdG8gbWFrZSBhIGZpcmUuXCIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxpbmsoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmlkID0gXCJzcGVsbF9ibGlua1wiXG4gICAgdGhpcy5pY29uID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5pY29uLnNyYyA9IFwiYmxpbmtfc3BlbGwuanBnXCJcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm1hbmFfY29zdCA9IDdcbiAgICB0aGlzLmNhc3RpbmdfdGltZV9pbl9tcyA9IDBcbiAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IG51bGxcbiAgICB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXMgPSA3MDAwXG4gICAgdGhpcy5vbl9jb29sZG93biA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdF9jYXN0X2F0ICYmIERhdGUubm93KCkgLSB0aGlzLmxhc3RfY2FzdF9hdCA8IHRoaXMuY29vbGRvd25fdGltZV9pbl9tc1xuICAgIH1cblxuICAgIHRoaXMuaXNfdmFsaWQgPSAoKSA9PiAhdGhpcy5vbl9jb29sZG93bigpXG4gICAgXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm5cblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdwdXJwbGUnXG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyh0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnkgLSB0aGlzLmdvLmNhbWVyYS55LCA1MCwgMCwgTWF0aC5QSSAqIDIpXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7IH1cblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjbGlja19jYWxsYmFjaywgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgICAgICAgICB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MucHVzaChjbGlja19jYWxsYmFjaylcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbnRpdHkuY3VycmVudF9tYW5hIC09IHRoaXMubWFuYV9jb3N0XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscylcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KGNsaWNrX2NhbGxiYWNrLCB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MpXG4gICAgICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmdvLmNhbWVyYS5mb2N1cyh0aGlzLmVudGl0eSlcbiAgICB9XG5cbiAgICBjb25zdCBjbGlja19jYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRpdHkueCA9IHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5lbnRpdHkueSA9IHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICB9XG59IiwiaW1wb3J0IFByb2plY3RpbGUgZnJvbSBcIi4uL3Byb2plY3RpbGVcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGcm9zdGJvbHQoeyBnbyB9KSB7XG4gICAgdGhpcy5pZCA9IFwic3BlbGxfZnJvc3Rib2x0XCJcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmljb24gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaWNvbi5zcmMgPSBcImh0dHBzOi8vY2RuYS5hcnRzdGF0aW9uLmNvbS9wL2Fzc2V0cy9pbWFnZXMvaW1hZ2VzLzAwOS8wMzEvMTkwL2xhcmdlL3JpY2hhcmQtdGhvbWFzLXBhaW50cy0xMS12Mi5qcGdcIlxuICAgIHRoaXMucHJvamVjdGlsZSA9IG5ldyBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3Q6IHRoaXMgfSlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5tYW5hX2Nvc3QgPSAxNVxuICAgIHRoaXMuY2FzdGluZ190aW1lX2luX21zID0gMTUwMFxuICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gbnVsbFxuICAgIHRoaXMuY29vbGRvd25fdGltZV9pbl9tcyA9IDEwMFxuICAgIHRoaXMub25fY29vbGRvd24gPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3RfY2FzdF9hdCAmJiBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X2Nhc3RfYXQgPCB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXNcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmRyYXcoKTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdfc2xvdCA9IChzbG90KSA9PiB7XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgeCwgeSwgdGhpcy5nby5hY3Rpb25fYmFyLnNsb3Rfd2lkdGgsIHRoaXMuZ28uYWN0aW9uX2Jhci5zbG90X2hlaWdodClcbiAgICAgICAgXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVyblxuXG4gICAgICAgIGlmICgoaXNfY29sbGlkaW5nKHRoaXMucHJvamVjdGlsZS5ib3VuZHMoKSwgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSkge1xuICAgICAgICAgICAgaWYgKGRhbWFnZWFibGUodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gcmFuZG9tKDUsIDEwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cy50YWtlX2RhbWFnZSh7IGRhbWFnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb2plY3RpbGUudXBkYXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNfdmFsaWQgPSAoKSA9PiAhdGhpcy5vbl9jb29sZG93bigpICYmIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlICYmIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnN0YXRzO1xuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICBpZiAoKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBudWxsKSB8fCAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IHVuZGVmaW5lZCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzdGFydF9wb3NpdGlvbiA9IHsgeDogdGhpcy5nby5jaGFyYWN0ZXIueCArIDUwLCB5OiB0aGlzLmdvLmNoYXJhY3Rlci55ICsgNTAgfVxuICAgICAgICBjb25zdCBlbmRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueSArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2plY3RpbGUuYWN0KHsgc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbiB9KVxuXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscyk7XG4gICAgICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gRGF0ZS5ub3coKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhbWFnZWFibGUob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3Quc3RhdHMgIT09IHVuZGVmaW5lZCAmJiBvYmplY3Quc3RhdHMudGFrZV9kYW1hZ2UgIT09IHVuZGVmaW5lZFxuICAgIH1cbn0iLCJpbXBvcnQgeyBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdGFydE1lbnUoeyBnbyB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5nby5zdGFydF9tZW51ID0gdGhpc1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMuYnV0dG9uX3dpZHRoID0gMzAwXG4gICAgdGhpcy5idXR0b25faGVpZ2h0ID0gNTBcblxuICAgIHRoaXMuY2hlY2tfYnV0dG9uX2NsaWNrZWQgPSAoZXYpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBjbGljayA9IHsgeDogZXYuY2xpZW50WCwgeTogZXYuY2xpZW50WSwgd2lkdGg6IDEsIGhlaWdodDogMSB9XG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgIGlmIChpc19jb2xsaWRpbmcoY2xpY2ssIGJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgICBidXR0b24ucGVyZm9ybSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZ28uY2xpY2tfY2FsbGJhY2tzLnB1c2godGhpcy5jaGVja19idXR0b25fY2xpY2tlZClcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZ28uc2NyZWVuLmRyYXdfZm9nKDApO1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDM7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDM7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICdncmF5JztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QoeCwgeSwgeCwgeSk7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gXCJOdWJhcmlhXCJcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gJzcycHggc2VyaWYnO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0aXRsZSwgeCArIHggLyA0LCB5ICsgNzApXG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCB4X29mZnNldCA9IHggKyB4IC8gMjtcbiAgICAgICAgICAgIGNvbnN0IHlfb2Zmc2V0ID0geSArIHkgLyAzICsgaW5kZXggKiA1MCArIGluZGV4ICogMTA7XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBidXR0b24uaXNfaG92ZXJlZCA/IFwicmdiYSg5LCAxMDAsIDgwLCAxKVwiIDogXCJyZ2JhKDcsIDEsIDMsIDEpXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHhfb2Zmc2V0IC0gdGhpcy5idXR0b25fd2lkdGggLyAyLCB5X29mZnNldCwgdGhpcy5idXR0b25fd2lkdGgsIHRoaXMuYnV0dG9uX2hlaWdodClcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpbmRleF0ueCA9IHhfb2Zmc2V0IC0gdGhpcy5idXR0b25fd2lkdGggLyAyO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zW2luZGV4XS55ID0geV9vZmZzZXQ7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaW5kZXhdLndpZHRoID0gdGhpcy5idXR0b25fd2lkdGhcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpbmRleF0uaGVpZ2h0ID0gdGhpcy5idXR0b25faGVpZ2h0XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyMXB4IHNhbnMtc2VyaWZcIlxuICAgICAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChidXR0b24udGV4dClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGJ1dHRvbi50ZXh0LCB4X29mZnNldCAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHlfb2Zmc2V0ICsgKHRoaXMuYnV0dG9uX2hlaWdodCAvIDIpICsgdGhpcy5hcHByb3hpbWF0ZV9saW5lX2hlaWdodCAvIDIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5idXR0b25zLmZpbmQoKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyh0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLCBidXR0b24pKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmlzX2hvdmVyZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5pc19ob3ZlcmVkID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTM0NTg2L2hvdy1jYW4teW91LWZpbmQtdGhlLWhlaWdodC1vZi10ZXh0LW9uLWFuLWh0bWwtY2FudmFzXG4gICAgdGhpcy5hcHByb3hpbWF0ZV9saW5lX2hlaWdodCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KCdNJykud2lkdGg7XG5cbiAgICB0aGlzLmJ1dHRvbnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1lbnU6IHRoaXMsXG4gICAgICAgICAgICBpZDogXCJuZXdfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJuZXdcIixcbiAgICAgICAgICAgIHBlcmZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld19nYW1lIGJ1dHRvbiBjbGlja2VkXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5tZW51LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMubWVudS5nby5zZXJ2ZXIuY29ubmVjdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1lbnU6IHRoaXMsXG4gICAgICAgICAgICBpZDogXCJsb2FkX2dhbWVcIixcbiAgICAgICAgICAgIHRleHQ6IFwibG9hZFwiLFxuICAgICAgICAgICAgcGVyZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZF9nYW1lIGJ1dHRvbiBjbGlja2VkXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1lbnU6IHRoaXMsXG4gICAgICAgICAgICBpZDogXCJzYXZlX2dhbWVcIixcbiAgICAgICAgICAgIHRleHQ6IFwic2F2ZVwiLFxuICAgICAgICAgICAgcGVyZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZV9nYW1lIGJ1dHRvbiBjbGlja2VkXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1lbnU6IHRoaXMsXG4gICAgICAgICAgICBpZDogXCJleGl0X2dhbWVcIixcbiAgICAgICAgICAgIHRleHQ6IFwiZXhpdFwiLFxuICAgICAgICAgICAgcGVyZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXhpdF9nYW1lIGJ1dHRvbiBjbGlja2VkXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdXG59IiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSksXG4gIGFuZ2xlOiAoY3VycmVudF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiBNYXRoLmF0YW4yKGVuZF9wb3NpdGlvbi55IC0gY3VycmVudF9wb3NpdGlvbi55LCBlbmRfcG9zaXRpb24ueCAtIGN1cnJlbnRfcG9zaXRpb24ueClcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGNvbnN0IHNlbGZfcG9zaXRpb24gPSB7IHdpZGh0OiAxLCBoZWlnaHQ6IDEsIC4uLnNlbGYgfVxuICBjb25zdCB0YXJnZXRfcG9zaXRpb24gPSB7IHdpZGh0OiAxLCBoZWlnaHQ6IDEsIC4uLnRhcmdldCB9XG4gIGlmIChcbiAgICAoc2VsZl9wb3NpdGlvbi54IDwgdGFyZ2V0X3Bvc2l0aW9uLnggKyB0YXJnZXRfcG9zaXRpb24ud2lkdGgpICYmXG4gICAgKHNlbGZfcG9zaXRpb24ueCArIHNlbGZfcG9zaXRpb24ud2lkdGggPiB0YXJnZXRfcG9zaXRpb24ueCkgJiZcbiAgICAoc2VsZl9wb3NpdGlvbi55IDwgdGFyZ2V0X3Bvc2l0aW9uLnkgKyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0KSAmJlxuICAgIChzZWxmX3Bvc2l0aW9uLnkgKyBzZWxmX3Bvc2l0aW9uLmhlaWdodCA+IHRhcmdldF9wb3NpdGlvbi55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuY29uc3QgcmFuZG9tID0gKHN0YXJ0LCBlbmQpID0+IHtcbiAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydFxuICAgIHN0YXJ0ID0gMFxuICB9XG4gIHJldHVybiBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBlbmQpICsgc3RhcnQgIFxufVxuXG5mdW5jdGlvbiByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQob2JqZWN0LCBsaXN0KSB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKG9iamVjdCk7XG4gIGlmIChpbmRleCA+IC0xKSB7XG4gICAgcmV0dXJuIGxpc3Quc3BsaWNlKGluZGV4LCAxKVswXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9jbGlja2FibGUoZG9vZGFkLCBnbykge1xuICBjb25zdCBjbGlja2FibGVfaW5kZXggPSBnby5jbGlja2FibGVzLmluZGV4T2YoZG9vZGFkKVxuICBpZiAoY2xpY2thYmxlX2luZGV4ID4gLTEpIHtcbiAgICBnby5jbGlja2FibGVzLnNwbGljZShjbGlja2FibGVfaW5kZXgsIDEpXG4gIH1cbiAgaWYgKGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZG9vZGFkKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB9XG59XG5cbmNvbnN0IGRpY2UgPSAoc2lkZXMsIHRpbWVzID0gMSkgPT4ge1xuICByZXR1cm4gQXJyYXkuZnJvbShBcnJheSh0aW1lcykpLm1hcCgoaSkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2lkZXMpICsgMSk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgZGljZSwgcmVtb3ZlX2NsaWNrYWJsZSB9XG4iLCJjbGFzcyBUaWxlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZV9zcmMsIHhfb2Zmc2V0ID0gMCwgeV9vZmZzZXQgPSAwLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICAgICAgICB0aGlzLnhfb2Zmc2V0ID0geF9vZmZzZXRcbiAgICAgICAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGlsZSIsImltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGVcIlxuXG4vLyBUaGUgV29ybGQgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgaXRzZWxmLlxuZnVuY3Rpb24gV29ybGQoZ28pIHtcbiAgdGhpcy5nbyA9IGdvO1xuICB0aGlzLmdvLndvcmxkID0gdGhpcztcbiAgdGhpcy53aWR0aCA9IDEwMDAwO1xuICB0aGlzLmhlaWdodCA9IDEwMDAwO1xuICB0aGlzLnhfb2Zmc2V0ID0gMDtcbiAgdGhpcy55X29mZnNldCA9IDA7XG4gIHRoaXMudGlsZV9zZXQgPSB7XG4gICAgZ3Jhc3M6IG5ldyBUaWxlKFwiZ3Jhc3MucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgZGlydDogbmV3IFRpbGUoXCJkaXJ0Mi5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBzdG9uZTogbmV3IFRpbGUoXCJmbGludHN0b25lLnBuZ1wiLCAwLCAwLCA4NDAsIDg1OSksXG4gIH1cbiAgdGhpcy5waWNrX3JhbmRvbV90aWxlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRpbGVfc2V0LmdyYXNzXG4gIH1cbiAgdGhpcy50aWxlX3dpZHRoID0gNjRcbiAgdGhpcy50aWxlX2hlaWdodCA9IDY0XG4gIHRoaXMudGlsZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmModGhpcy53aWR0aCAvIHRoaXMudGlsZV93aWR0aCkgKyAxO1xuICB0aGlzLnRpbGVzX3Blcl9jb2x1bW4gPSBNYXRoLnRydW5jKHRoaXMuaGVpZ2h0IC8gdGhpcy50aWxlX2hlaWdodCkgKyAxO1xuICB0aGlzLnRpbGVzID0gbnVsbDtcbiAgdGhpcy5nZW5lcmF0ZV9tYXAgPSAoKSA9PiB7XG4gICAgdGhpcy50aWxlcyA9IG5ldyBBcnJheSh0aGlzLnRpbGVzX3Blcl9yb3cpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBpZiAodGhpcy50aWxlc1tyb3ddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10gPSBbdGhpcy5waWNrX3JhbmRvbV90aWxlKCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddLnB1c2godGhpcy5waWNrX3JhbmRvbV90aWxlKCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMudGlsZXNbcm93XVtjb2x1bW5dXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGVfc2V0LmdyYXNzKSB7XG4gICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMudGlsZV9zZXQuZ3Jhc3MuaW1hZ2UsXG4gICAgICAgICAgICB0aGlzLnRpbGVfc2V0LmdyYXNzLnhfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLnlfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLndpZHRoLCB0aGlzLnRpbGVfc2V0LmdyYXNzLmhlaWdodCxcbiAgICAgICAgICAgIHRoaXMueF9vZmZzZXQgKyAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsXG4gICAgICAgICAgICB0aGlzLnlfb2Zmc2V0ICsgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDYzKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aWxlLmltYWdlLFxuICAgICAgICAgIHRpbGUueF9vZmZzZXQsIHRpbGUueV9vZmZzZXQsIHRpbGUud2lkdGgsIHRpbGUuaGVpZ2h0LFxuICAgICAgICAgIHRoaXMueF9vZmZzZXQgKyAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsXG4gICAgICAgICAgdGhpcy55X29mZnNldCArIChjb2x1bW4gKiB0aGlzLnRpbGVfaGVpZ2h0KSAtIHRoaXMuZ28uY2FtZXJhLnksIDY1LCA2NSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV29ybGQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gXCIuL2dhbWVfb2JqZWN0LmpzXCJcbmltcG9ydCBTY3JlZW4gZnJvbSBcIi4vc2NyZWVuLmpzXCJcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vY2FtZXJhLmpzXCJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyLmpzXCJcbmltcG9ydCBLZXlib2FyZElucHV0IGZyb20gXCIuL2tleWJvYXJkX2lucHV0LmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiwgcmFuZG9tLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IHtcbiAgc2V0Q2xpY2tDYWxsYmFjayxcbiAgc2V0TW91c2VNb3ZlQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldFRvdWNoc3RhcnRDYWxsYmFjayxcbiAgc2V0VG91Y2hlbmRDYWxsYmFjayxcbn0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG5pbXBvcnQgR2FtZUxvb3AgZnJvbSBcIi4vZ2FtZV9sb29wLmpzXCJcbmltcG9ydCBXb3JsZCBmcm9tIFwiLi93b3JsZC5qc1wiXG5pbXBvcnQgRG9vZGFkIGZyb20gXCIuL2Rvb2RhZC5qc1wiXG5pbXBvcnQgQ29udHJvbHMgZnJvbSBcIi4vY29udHJvbHMuanNcIlxuaW1wb3J0IFNlcnZlciBmcm9tIFwiLi9zZXJ2ZXJcIlxuaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4vbG9vdF9ib3guanNcIlxuaW1wb3J0IENyZWVwIGZyb20gXCIuL2JlaW5ncy9jcmVlcC5qc1wiXG5pbXBvcnQgQWN0aW9uQmFyIGZyb20gXCIuL2FjdGlvbl9iYXIuanNcIlxuaW1wb3J0IFN0b25lIGZyb20gXCIuL2JlaW5ncy9zdG9uZS5qc1wiXG5pbXBvcnQgVHJlZSBmcm9tIFwiLi9iZWluZ3MvdHJlZS5qc1wiXG5pbXBvcnQgRWRpdG9yIGZyb20gXCIuL2VkaXRvci9pbmRleC5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyLmpzXCJcbmltcG9ydCBTdGFydE1lbnUgZnJvbSBcIi4vc3RhcnRfbWVudS5qc1wiXG5cbmNvbnN0IGdvID0gbmV3IEdhbWVPYmplY3QoKVxuLy8gLS0tXG4vLyBEaXNhYmxlIHJpZ2h0IG1vdXNlIGNsaWNrXG5nby5jYW52YXMub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7IGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfVxuXG5jb25zdCBjbGlja19jYWxsYmFja3MgPSBzZXRDbGlja0NhbGxiYWNrKGdvKVxuY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlTW92ZUNhbGxiYWNrKGdvKVxuY29uc3QgbW91c2Vkb3duX2NhbGxiYWNrcyA9IHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKVxuY29uc3QgbW91c2V1cF9jYWxsYmFja3MgPSBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pXG5jb25zdCB0b3VjaHN0YXJ0X2NhbGxiYWNrcyA9IHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbylcbmNvbnN0IHRvdWNoZW5kX2NhbGxiYWNrcyA9IHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pXG5cbi8vLS0tLS1cbmNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoZ28pXG5jb25zdCBzY3JlZW4gPSBuZXcgU2NyZWVuKGdvKVxuY29uc3Qgc3RhcnRfbWVudSA9IG5ldyBTdGFydE1lbnUoeyBnbyB9KVxuY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoZ28sIGNoYXJhY3RlcilcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCB3b3JsZCA9IG5ldyBXb3JsZChnbylcbmNvbnN0IGNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGdvKVxuY29uc3QgbG9vdF9ib3ggPSBuZXcgTG9vdEJveChnbylcbmNvbnN0IGFjdGlvbl9iYXIgPSBuZXcgQWN0aW9uQmFyKGdvKVxuY29uc3QgZWRpdG9yID0gbmV3IEVkaXRvcih7IGdvIH0pXG5jb25zdCBleHBlcmllbmNlX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHsgeDogZ28uc2NyZWVuLndpZHRoIC8gMiAtIDUwMCwgeTogZ28uc2NyZWVuLmhlaWdodCAtIDMwLCB3aWR0aDogMTAwMCwgaGVpZ2h0OiA1IH0sIGNvbG91cjogXCJwdXJwbGVcIiwgYm9yZGVyOiBcIndoaXRlXCIsIGZpeGVkOiB0cnVlIH0pO1xuZXhwZXJpZW5jZV9iYXIuaGVpZ2h0ID0gMzBcblxuLy8gQ2FsbGJhY2tzXG5mdW5jdGlvbiB0cmFja19tb3VzZV9wb3NpdGlvbihldnQpIHtcbiAgdmFyIHJlY3QgPSBnby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgZ28ubW91c2VfcG9zaXRpb24gPSB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQgKyBjYW1lcmEueCxcbiAgICB5OiBldnQuY2xpZW50WSAtIHJlY3QudG9wICsgY2FtZXJhLnksXG4gICAgd2lkdGg6IDEsXG4gICAgaGVpZ2h0OiAxXG4gIH1cbn1cblxuZ28ubW91c2VfcG9zaXRpb24gPSB7fVxubGV0IG1vdXNlX2lzX2Rvd24gPSBmYWxzZVxubW91c2Vkb3duX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxubW91c2V1cF9jYWxsYmFja3MucHVzaChsb290X2JveC5jaGVja19pdGVtX2NsaWNrZWQuYmluZChsb290X2JveCkpXG50b3VjaHN0YXJ0X2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG50b3VjaGVuZF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSBmYWxzZSlcblxuZnVuY3Rpb24gY2xpY2thYmxlX2NsaWNrZWQoZXYpIHtcbiAgbGV0IGNsaWNrID0geyB4OiBldi5jbGllbnRYICsgZ28uY2FtZXJhLngsIHk6IGV2LmNsaWVudFkgKyBnby5jYW1lcmEueSwgd2lkdGg6IDEsIGhlaWdodDogMSB9XG4gIGNvbnN0IGNsaWNrYWJsZSA9IGdvLmNsaWNrYWJsZXMuZmluZCgoY2xpY2thYmxlKSA9PiBpc19jb2xsaWRpbmcoY2xpY2thYmxlLCBjbGljaykpXG4gIGlmIChjbGlja2FibGUpIHtcbiAgICBjbGlja2FibGUuYWN0aXZhdGVkID0gIWNsaWNrYWJsZS5hY3RpdmF0ZWRcbiAgfVxuICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBjbGlja2FibGVcbn1cbmNsaWNrX2NhbGxiYWNrcy5wdXNoKGNsaWNrYWJsZV9jbGlja2VkKVxuXG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWydFc2NhcGUnXSA9IFtjaGFyYWN0ZXIuZXNjYXBlX2tleV1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmYgPSBbY2hhcmFjdGVyLnNraWxsX2FjdGlvbl1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWzBdID0gW2NoYXJhY3Rlci5za2lsbHMubWFrZV9maXJlXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMV0gPSBbY2hhcmFjdGVyLnNwZWxscy5mcm9zdGJvbHRdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1syXSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmJsaW5rXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuaSA9IFtjaGFyYWN0ZXIuaW52ZW50b3J5LnRvZ2dsZV9kaXNwbGF5XVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuYiA9IFtjaGFyYWN0ZXIuYm9hcmQudG9nZ2xlX2dyaWRdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5lID0gWygpID0+IGVkaXRvci5hY3RpdmUgPSAhZWRpdG9yLmFjdGl2ZV1cbi8va2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MucCA9IFtib2FyZC53YXlfdG9fcGxheWVyXVxuXG4vLyBFTkQgLS0gQ2FsbGJhY2tzXG5cbmxldCBlbGFwc2VkX3RpbWUgPSAwXG5sZXQgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxubGV0IGZyYW1lcyA9IDA7XG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGlmIChzdGFydF9tZW51LmFjdGl2ZSkge1xuICAgIHN0YXJ0X21lbnUudXBkYXRlKClcbiAgICByZXR1cm47XG4gIH1cbiAgZnJhbWVzICs9IDE7XG4gIGVsYXBzZWRfdGltZSA9IERhdGUubm93KCkgLSBsYXN0X3RpY2tcbiAgaWYgKChlbGFwc2VkX3RpbWUpID4gMTAwMCkge1xuICAgIGZyYW1lcyA9IDA7XG4gICAgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgIHVwZGF0ZV9mcHMoKVxuICB9XG4gIGlmICghY2hhcmFjdGVyLnN0YXRzLmlzX2FsaXZlKCkpIHtcbiAgICBjb250cm9sc19tb3ZlbWVudCgpXG4gIH0gZWxzZSB7XG4gICAgZ28udXBkYXRlX29iamVjdHMoKVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZV9mcHMoKSB7XG4gIGlmIChzdGFydF9tZW51LmFjdGl2ZSkgcmV0dXJuO1xuXG4gIGlmIChjaGFyYWN0ZXIuc3RhdHMuaXNfYWxpdmUoKSkge1xuICAgIGNoYXJhY3Rlci51cGRhdGVfZnBzKClcbiAgfVxuICBnby51cGRhdGVfZnBzX29iamVjdHMoKVxufVxuLy8gQ29tbWVudFxuY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgaWYgKHN0YXJ0X21lbnUuYWN0aXZlKSB7XG4gICAgc3RhcnRfbWVudS5kcmF3KCk7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKGNoYXJhY3Rlci5zdGF0cy5pc19kZWFkKCkpIHtcbiAgICBzY3JlZW4uZHJhd19nYW1lX292ZXIoKVxuICB9IGVsc2Uge1xuICAgIHNjcmVlbi5kcmF3KClcbiAgICBnby5kcmF3X3NlbGVjdGVkX2NsaWNrYWJsZSgpXG4gICAgZ28uZHJhd19vYmplY3RzKClcbiAgICBjaGFyYWN0ZXIuZHJhdygpXG4gICAgc2NyZWVuLmRyYXdfZm9nKClcbiAgICBsb290X2JveC5kcmF3KClcbiAgICBnby5jaGFyYWN0ZXIuaW52ZW50b3J5LmRyYXcoKVxuICAgIGFjdGlvbl9iYXIuZHJhdygpXG4gICAgY2hhcmFjdGVyLmJvYXJkLmRyYXcoKVxuICAgIGVkaXRvci5kcmF3KClcbiAgICBleHBlcmllbmNlX2Jhci5kcmF3KDEwMDAsIGdvLmNoYXJhY3Rlci5leHBlcmllbmNlX3BvaW50cylcbiAgICBpZiAoc2hvd19jb250cm9sX3doZWVsKSBkcmF3X2NvbnRyb2xfd2hlZWwoKVxuICB9XG59IFxuXG4vLyBUcmVlc1xuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGxldCB0cmVlID0gbmV3IFRyZWUoeyBnbyB9KVxuICBnby50cmVlcy5wdXNoKHRyZWUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaCh0cmVlKVxufSlcbi8vIFN0b25lc1xuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGNvbnN0IHN0b25lID0gbmV3IFN0b25lKHsgZ28gfSk7XG4gIGdvLnN0b25lcy5wdXNoKHN0b25lKVxuICBnby5jbGlja2FibGVzLnB1c2goc3RvbmUpXG59KVxuLy8gQ3JlZXBcbmZvciAobGV0IGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICBsZXQgY3JlZXAgPSBuZXcgQ3JlZXAoeyBnbyB9KTtcbiAgZ28uY2xpY2thYmxlcy5wdXNoKGNyZWVwKTtcbn1cbmNvbnN0IGR1bW15ID0gbmV3IENyZWVwKHsgZ28gfSlcbmR1bW15LnggPSA4MDA7XG5kdW1teS55ID0gMjAwO1xuZ28uY2xpY2thYmxlcy5wdXNoKGR1bW15KVxuXG5sZXQgb3JkZXJlZF9jbGlja2FibGVzID0gW107XG5jb25zdCB0YWJfY3ljbGluZyA9IChldikgPT4ge1xuICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gIG9yZGVyZWRfY2xpY2thYmxlcyA9IGdvLmNyZWVwcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgcmV0dXJuIFZlY3RvcjIuZGlzdGFuY2UoYSwgY2hhcmFjdGVyKSAtIFZlY3RvcjIuZGlzdGFuY2UoYiwgY2hhcmFjdGVyKTtcbiAgfSlcbiAgaWYgKFZlY3RvcjIuZGlzdGFuY2Uob3JkZXJlZF9jbGlja2FibGVzWzBdLCBjaGFyYWN0ZXIpID4gNTAwKSByZXR1cm47XG5cbiAgaWYgKG9yZGVyZWRfY2xpY2thYmxlc1swXSA9PT0gZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gb3JkZXJlZF9jbGlja2FibGVzWzFdO1xuICB9IGVsc2Uge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG9yZGVyZWRfY2xpY2thYmxlc1swXVxuICB9XG59XG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1tcIlRhYlwiXSA9IFt0YWJfY3ljbGluZ11cblxubGV0IHNob3dfY29udHJvbF93aGVlbCA9IGZhbHNlXG5jb25zdCBkcmF3X2NvbnRyb2xfd2hlZWwgPSAoKSA9PiB7XG4gIGdvLmN0eC5iZWdpblBhdGgoKVxuICBnby5jdHguYXJjKFxuICAgIGNoYXJhY3Rlci54ICsgKGNoYXJhY3Rlci53aWR0aCAvIDIpIC0gZ28uY2FtZXJhLngsXG4gICAgY2hhcmFjdGVyLnkgKyAoY2hhcmFjdGVyLmhlaWdodCAvIDIpIC0gZ28uY2FtZXJhLnksXG4gICAgMjAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICBnby5jdHgubGluZVdpZHRoID0gNVxuICBnby5jdHguc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCJcbiAgZ28uY3R4LnN0cm9rZSgpO1xufVxuY29uc3QgdG9nZ2xlX2NvbnRyb2xfd2hlZWwgPSAoKSA9PiB7IHNob3dfY29udHJvbF93aGVlbCA9ICFzaG93X2NvbnRyb2xfd2hlZWwgfVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbXCJjXCJdID0gW3RvZ2dsZV9jb250cm9sX3doZWVsXVxuXG5jb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG5nYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBnby5rZXlib2FyZF9pbnB1dC5wcm9jZXNzX2tleXNfZG93blxuZ2FtZV9sb29wLnVwZGF0ZSA9IHVwZGF0ZVxuXG5jb25zdCBzdGFydCA9IGFzeW5jICgpID0+IHtcbiAgY2hhcmFjdGVyLnggPSAxMDBcbiAgY2hhcmFjdGVyLnkgPSAxMDBcbiAgZ28ud29ybGQuZ2VuZXJhdGVfbWFwKClcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG59XG5cbnN0YXJ0KCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=