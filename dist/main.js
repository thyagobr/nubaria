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



function Spellcasting({ go, entity, spell, target }) {
    this.go = go
    this.target = target
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

    this.cast = (should_broadcast = true) => {
        this.go.action_bar.highlight_cast(this.spell);
        if (!this.spell.is_valid()) {
            console.log("spell is not valid")
            console.log(this.spell.entity.current_target)
            return;
        }

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

                if (should_broadcast) {
                    // TODO: extract
                    let payload = {
                        action: "spellcastingStarted",
                        args: {
                            spell: {
                                id: this.spell.id
                            },
                            target: {
                                id: this.target().id
                            },
                            caster: {
                                id: this.entity.id
                            }
                        }
                    }
                    this.go.server.conn.send(JSON.stringify(payload))
                    // END -- TODO: extract
                }

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
        // TODO: extract
        let payload = {
            action: "damage",
            args: {
                damaged_player: {
                    id: this.entity.id,
                },
                damage: damage
            }
        }
        this.go.server.conn.send(JSON.stringify(payload))
        // END -- TODO: extract
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
  this.current_target = undefined
  this.spell_target = () => {
    return this.current_target || this.go.selected_clickable
  }
  this.spells = {
    frostbolt: new _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this, spell: this.spellbook.frostbolt, target: this.spell_target }).cast,
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
      // TODO: extract
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
      // END -- TODO: extract
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
        let idText = `id: ${this.go.character.id.substr(0, 8)}`
        var idText_measurement = this.go.ctx.measureText(idText)
        this.go.ctx.fillText(idText, this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (idText_measurement.width / 2), this.right_panel_coords.y + 100 + 50 + 20)

        if (this.go.selected_clickable) this.draw_selection();
        if (this.go.character.current_target) this.draw_current_target();
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

        let idText = `id: ${this.go.selected_clickable.id.substr(0, 8)}`
        var idText_measurement = this.go.ctx.measureText(idText)
        this.go.ctx.fillText(idText, this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (idText_measurement.width / 2), this.right_panel_coords.y + 200 + 150)
    }

    this.draw_current_target = () => {
        this.go.entity.current_target.draw({
            x: this.right_panel_coords.x + this.right_panel_coords.width / 2 - 35,
            y: this.right_panel_coords.y + 300,
            width: 70,
            height: 70
        })
        let text = `x: ${this.go.entity.current_target.x.toFixed(2)}, y: ${this.go.entity.current_target.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (text_measurement.width / 2), this.right_panel_coords.y + 200 + 100)

        let idText = `id: ${this.go.entity.current_target.id.substr(0, 8)}`
        var idText_measurement = this.go.ctx.measureText(idText)
        this.go.ctx.fillText(idText, this.right_panel_coords.x + (this.right_panel_coords.width / 2) - (idText_measurement.width / 2), this.right_panel_coords.y + 200 + 150)
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
    this.conn = new WebSocket("ws://localhost:3010");
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
        case "damageLoad":
          let damaged_player = this.go.players.find(player => payload.player.id === player.id)
          if (!damaged_player && (payload.player.id === this.go.character.id)) {
            damaged_player = this.go.character
          }
          if (!damaged_player) {
            console.log("Player not found")
            return
          }
          damaged_player.stats.current_hp -= payload.damage
          break
          case "spellcastingStartedLoad":
          console.log("casting spell")
          const casting_player = this.go.players.find(player => payload.caster.id === player.id)
          if (!casting_player) {
            console.log("Player not found or is myself")
            return
          }
          const all_players = [...this.go.players, this.go.character]
          const target_player = all_players.find(player => payload.target.id === player.id)
          casting_player.current_target = target_player
          casting_player.spells["frostbolt"](false)
          break
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



function Frostbolt({ go, entity }) {
    this.id = "spell_frostbolt"
    this.entity = entity
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

        if (((0,_tapete__WEBPACK_IMPORTED_MODULE_1__.is_colliding)(this.projectile.bounds(), this.entity.spell_target()))) {
            if (damageable(this.entity.spell_target())) {
                const damage = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(5, 10);
                this.entity.spell_target().stats.take_damage({ damage });
            }
            this.end();
        } else {
            this.projectile.update()
        }
    }

    this.is_valid = () => !this.on_cooldown() && (this.entity.spell_target() && this.entity.spell_target().stats)

    this.act = () => {
        if (this.active) return;
        if ((this.entity.spell_target() === null) || (this.entity.spell_target() === undefined)) return;

        const start_position = { x: this.entity.x + 50, y: this.entity.y + 50 }
        const end_position = {
            x: this.entity.spell_target().x + this.entity.spell_target().width / 2,
            y: this.entity.spell_target().y + this.entity.spell_target().height / 2
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEIsa0JBQWtCLHlEQUFLLEdBQUcsSUFBSTtBQUM5QjtBQUNBO0FBQ0Esa0JBQWtCLHlEQUFLLEdBQUcsSUFBSTtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHdEQUFnQixpQkFBaUIsd0RBQWdCO0FBQzVELEdBQUc7QUFDSCxNQUFNLHdEQUFnQjs7QUFFdEI7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDOztBQUVBLHNCQUFzQixxREFBUTtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9hY3Rpb25fYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL2FnZ3JvLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbW92ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvbG9vdF9iYWcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3Mvc3RvbmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JvYXJkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FzdGluZ19iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jbGlja2FibGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jb250cm9scy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Rvb2RhZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2VkaXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2V2ZW50c19jYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX2xvb3AuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2l0ZW0uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9rZXlib2FyZF9pbnB1dC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290X2JveC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Byb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9icmVha19zdG9uZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9jdXRfdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9tYWtlX2ZpcmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvYmxpbmsuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvZnJvc3Rib2x0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc3RhcnRfbWVudS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3RhcGV0ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy93b3JsZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy93ZWlyZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGVcIjtcblxuZnVuY3Rpb24gQWN0aW9uQmFyKGdhbWVfb2JqZWN0KSB7XG4gIHRoaXMuZ2FtZV9vYmplY3QgPSBnYW1lX29iamVjdFxuICB0aGlzLmdhbWVfb2JqZWN0LmFjdGlvbl9iYXIgPSB0aGlzXG4gIHRoaXMubnVtYmVyX29mX3Nsb3RzID0gMTBcbiAgdGhpcy5zbG90X2hlaWdodCA9IHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogMztcbiAgdGhpcy5zbG90X3dpZHRoID0gdGhpcy5nYW1lX29iamVjdC50aWxlX3NpemUgKiAzO1xuICB0aGlzLnlfb2Zmc2V0ID0gMTAwXG4gIHRoaXMuYWN0aW9uX2Jhcl93aWR0aCA9IHRoaXMubnVtYmVyX29mX3Nsb3RzICogdGhpcy5zbG90X3dpZHRoXG4gIHRoaXMuYWN0aW9uX2Jhcl9oZWlnaHQgPSB0aGlzLm51bWJlcl9vZl9zbG90cyAqIHRoaXMuc2xvdF9oZWlnaHRcbiAgdGhpcy5hY3Rpb25fYmFyX3ggPSAodGhpcy5nYW1lX29iamVjdC5jYW52YXNfcmVjdC53aWR0aCAvIDIpIC0gKHRoaXMuYWN0aW9uX2Jhcl93aWR0aCAvIDIpXG4gIHRoaXMuYWN0aW9uX2Jhcl95ID0gdGhpcy5nYW1lX29iamVjdC5jYW52YXNfcmVjdC5oZWlnaHQgLSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDQgLSB0aGlzLnlfb2Zmc2V0XG5cbiAgLy8gY2hhcmFjdGVyLXNwZWNpZmljXG4gIHRoaXMuc2xvdHMgPSBbXVxuICB0aGlzLnNsb3Rfc2l6ZSA9IDEwXG4gIHRoaXMuc2xvdHNbMF0gPSB0aGlzLmdhbWVfb2JqZWN0LmNoYXJhY3Rlci5zcGVsbGJvb2suZnJvc3Rib2x0XG4gIHRoaXMuc2xvdHNbMV0gPSB0aGlzLmdhbWVfb2JqZWN0LmNoYXJhY3Rlci5zcGVsbGJvb2suYmxpbmtcbiAgLy8gRU5EIC0tIGNoYXJhY3Rlci1zcGVjaWZpY1xuXG4gIHRoaXMuaGlnaGxpZ2h0cyA9IFtdXG5cbiAgZnVuY3Rpb24gU2xvdCh7IHNwZWxsLCB4LCB5IH0pIHtcbiAgICB0aGlzLnNwZWxsID0gc3BlbGxcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICB0aGlzLmhpZ2hsaWdodF9jYXN0ID0gKHNwZWxsKSA9PiB7XG4gICAgdGhpcy5oaWdobGlnaHRzLnB1c2goc3BlbGwpXG4gIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgc2xvdF9pbmRleCA9IDA7IHNsb3RfaW5kZXggPD0gdGhpcy5zbG90X3NpemU7IHNsb3RfaW5kZXgrKykge1xuICAgICAgdmFyIHNsb3QgPSB0aGlzLnNsb3RzW3Nsb3RfaW5kZXhdO1xuXG4gICAgICB2YXIgeCA9IHRoaXMuYWN0aW9uX2Jhcl94ICsgKHRoaXMuc2xvdF93aWR0aCAqIHNsb3RfaW5kZXgpXG4gICAgICB2YXIgeSA9IHRoaXMuYWN0aW9uX2Jhcl95XG5cbiAgICAgIGlmIChzbG90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDQ2LCA0NiwgNDYsIDEpXCJcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFJlY3QoXG4gICAgICAgICAgeCwgeSxcbiAgICAgICAgICB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlU3R5bGUgPSBcImJsdWV2aW9sZXRcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0XG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZHJhd0ltYWdlKHNsb3QuaWNvbiwgeCwgeSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVN0eWxlID0gXCJibHVldmlvbGV0XCJcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodFxuICAgICAgICApXG5cbiAgICAgICAgLy8gSGlnaGxpZ2h0OiB0aGUgYWN0aW9uIGJhciBcImJsaW5rc1wiIGZvciBhIGZyYW1lIHdoZW4gdGhlIHNwZWxsIGlzIGNhc3RcbiAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0cy5maW5kKChzcGVsbCkgPT4gc3BlbGwuaWQgPT09IHNsb3QuaWQpKSB7XG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoc2xvdCwgdGhpcy5oaWdobGlnaHRzKVxuICAgICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC43KSdcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxSZWN0KHgsIHksIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb29sZG93biBpbmRpY2F0b3JcbiAgICAgICAgaWYgKHNsb3Qub25fY29vbGRvd24oKSkge1xuICAgICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gMSAtICgobm93IC0gc2xvdC5sYXN0X2Nhc3RfYXQpIC8gc2xvdC5jb29sZG93bl90aW1lX2luX21zKVxuICAgICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknXG4gICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5zbG90X3dpZHRoICogcGVyY2VudGFnZSwgdGhpcy5zbG90X2hlaWdodClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQWN0aW9uQmFyXG4iLCJpbXBvcnQgQm9hcmQgZnJvbSBcIi4uL2JvYXJkXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuL21vdmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBZ2dybyh7IGdvLCBlbnRpdHksIHJhZGl1cyA9IDIwIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzXG4gICAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7IGdvLCBlbnRpdHksIHJhZGl1czogTWF0aC5mbG9vcih0aGlzLnJhZGl1cyAvIHRoaXMuZ28udGlsZV9zaXplKSB9KVxuICAgIHRoaXMubW92ZSA9IG5ldyBNb3ZlKHsgZ28sIGVudGl0eSwgdGFyZ2V0X3Bvc2l0aW9uOiB0aGlzLmdvLmNoYXJhY3RlciB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IFZlY3RvcjIuZGlzdGFuY2UodGhpcy5nby5jaGFyYWN0ZXIsIGVudGl0eSlcbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgdGhpcy5yYWRpdXMpIHtcbiAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICh0aGlzLmdvLmNoYXJhY3Rlci53aWR0aCAvIDIpICsgKHRoaXMuZW50aXR5LndpZHRoIC8gMikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eS5zdGF0cy5hdHRhY2sodGhpcy5nby5jaGFyYWN0ZXIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZS5hY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZHJhd19wYXRoID0gKCkgPT4ge1xuXG4gICAgfVxuXG4gICAgY29uc3QgbmVpZ2hib3JfcG9zaXRpb25zID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5lbnRpdHkueCxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5lbnRpdHkud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZW50aXR5LmhlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGVmdCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeDogdGhpcy5lbnRpdHkueCAtPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IHJpZ2h0ID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB4OiB0aGlzLmVudGl0eS54ICs9IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgdXAgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHk6IHRoaXMuZW50aXR5LnkgLT0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCBkb3duID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB5OiB0aGlzLmVudGl0eS55ICs9IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICB9XG59ICIsImltcG9ydCBMb290Qm94IGZyb20gXCIuLi9sb290X2JveFwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvb3QoeyBnbywgZW50aXR5LCBsb290X2JhZyB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmxvb3RfYmFnID0gbG9vdF9iYWdcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5sb290X2JhZy5pdGVtcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5sb290X2JhZy5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KHRoaXMubG9vdF9iYWcuZW50aXR5Lmxvb3RfdGFibGUpXG4gICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lmxvb3RfYmFnID0gdGhpcy5sb290X2JhZ1xuICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMubG9vdF9iYWcuaXRlbXNcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyLCBpc19jb2xsaWRpbmcgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGNsYXNzIE1vdmUge1xuICAgIGNvbnN0cnVjdG9yKHsgZ28sIGVudGl0eSwgc3BlZWQgPSAxLCB0YXJnZXRfcG9zaXRpb24gfSkge1xuICAgICAgICB0aGlzLmdvID0gZ29cbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkXG4gICAgICAgIHRoaXMudGFyZ2V0X3Bvc2l0aW9uID0gdGFyZ2V0X3Bvc2l0aW9uXG4gICAgICAgIHRoaXMuYnBzID0gMDtcbiAgICAgICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLnBhdGggPSBudWxsXG4gICAgICAgIHRoaXMubmV4dF9wYXRoX2luZGV4ID0gbnVsbFxuICAgIH1cblxuICAgIGFjdCA9ICgpID0+IHtcbiAgICAgICAgLy8gdGhpcy5icHMgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpY2tcbiAgICAgICAgLy8gaWYgKCh0aGlzLmJwcykgPj0gODAwKSB7XG4gICAgICAgIC8vICAgICB0aGlzLnBhdGggPSB0aGlzLmVudGl0eS5hZ2dyby5ib2FyZC5maW5kX3BhdGgodGhpcy5lbnRpdHksIHRoaXMudGFyZ2V0X3Bvc2l0aW9uKVxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYFBhdGggbGVuZ3RoICR7dGhpcy5wYXRoLmxlbmd0aH1gKVxuICAgICAgICAvLyAgICAgdGhpcy5uZXh0X3BhdGhfaW5kZXggPSAwXG4gICAgICAgIC8vICAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KClcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmRyYXcoKVxuICAgICAgICAvL2lmICh0aGlzLnBhdGggPT09IHVuZGVmaW5lZCB8fCB0aGlzLnBhdGhbdGhpcy5uZXh0X3BhdGhfaW5kZXhdID09PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICAvL2NvbnN0IHRhcmdldGVkX3Bvc2l0aW9uID0gdGhpcy5wYXRoW3RoaXMubmV4dF9wYXRoX2luZGV4XVxuICAgICAgICBjb25zdCB0YXJnZXRlZF9wb3NpdGlvbiA9IHsgLi4udGhpcy50YXJnZXRfcG9zaXRpb24gfVxuICAgICAgICBjb25zdCBuZXh0X3N0ZXAgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmVudGl0eS54ICsgdGhpcy5zcGVlZCAqIE1hdGguY29zKFZlY3RvcjIuYW5nbGUodGhpcy5lbnRpdHksIHRhcmdldGVkX3Bvc2l0aW9uKSksXG4gICAgICAgICAgICB5OiB0aGlzLmVudGl0eS55ICsgdGhpcy5zcGVlZCAqIE1hdGguc2luKFZlY3RvcjIuYW5nbGUodGhpcy5lbnRpdHksIHRhcmdldGVkX3Bvc2l0aW9uKSksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5lbnRpdHkud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZW50aXR5LmhlaWdodFxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5nby50cmVlcy5zb21lKHRyZWUgPT4gKGlzX2NvbGxpZGluZyhuZXh0X3N0ZXAsIHRyZWUpKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnggPSBuZXh0X3N0ZXAueFxuICAgICAgICAgICAgdGhpcy5lbnRpdHkueSA9IG5leHRfc3RlcC55XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhtbW0uLi4gd2hlcmUgdG8/XCIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmVkaWN0X21vdmVtZW50ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgICAgICBpZiAoKHRoaXMuYnBzKSA+PSAzMDAwKSB7XG4gICAgICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmVudGl0eS5hZ2dyby5ib2FyZC5maW5kX3BhdGgodGhpcy5lbnRpdHksIHRoaXMudGFyZ2V0X3Bvc2l0aW9uKVxuICAgICAgICAgICAgY29uc29sZS5sb2coYFBhdGggbGVuZ3RoICR7dGhpcy5wYXRoLmxlbmd0aH1gKVxuICAgICAgICAgICAgdGhpcy5uZXh0X3BhdGhfaW5kZXggPSAwXG4gICAgICAgICAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXIuanNcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZS5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHksIHNwZWxsLCB0YXJnZXQgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnNwZWxsID0gc3BlbGxcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiBlbnRpdHkgfSlcbiAgICB0aGlzLmNhc3RpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jYXN0aW5nKSB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4geyB9XG5cbiAgICAvLyBUaGlzIGxvZ2ljIHdvbid0IHdvcmsgZm9yIGNoYW5uZWxpbmcgc3BlbGxzLlxuICAgIC8vIFRoZSBlZmZlY3RzIGFuZCB0aGUgY2FzdGluZyBiYXIgaGFwcGVuIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgLy8gU2FtZSB0aGluZyBmb3Igc29tZSBza2lsbHNcbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRpdHkuaXNfYnVzeV93aXRoID0gbnVsbFxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMpXG4gICAgICAgIGlmICh0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgPiB0aGlzLnNwZWxsLm1hbmFfY29zdCkge1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hIC09IHRoaXMuc3BlbGwubWFuYV9jb3N0XG4gICAgICAgICAgICB0aGlzLnNwZWxsLmFjdCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNhc3QgPSAoc2hvdWxkX2Jyb2FkY2FzdCA9IHRydWUpID0+IHtcbiAgICAgICAgdGhpcy5nby5hY3Rpb25fYmFyLmhpZ2hsaWdodF9jYXN0KHRoaXMuc3BlbGwpO1xuICAgICAgICBpZiAoIXRoaXMuc3BlbGwuaXNfdmFsaWQoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzcGVsbCBpcyBub3QgdmFsaWRcIilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3BlbGwuZW50aXR5LmN1cnJlbnRfdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbnRpdHkuaXNfYnVzeV93aXRoID0gdGhpcy5jYXN0aW5nX2JhclxuICAgICAgICBpZiAodGhpcy5zcGVsbC5jYXN0aW5nX3RpbWVfaW5fbXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc3RpbmdfYmFyLmR1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMpXG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdG9wKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSB0cnVlXG4gICAgICAgICAgICAgICAgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQodGhpcy5zcGVsbC5jYXN0aW5nX3RpbWVfaW5fbXMsIHRoaXMuZW5kKVxuXG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZF9icm9hZGNhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogZXh0cmFjdFxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogXCJzcGVsbGNhc3RpbmdTdGFydGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMuc3BlbGwuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy50YXJnZXQoKS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmVudGl0eS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLnNlcnZlci5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgICAgICAgICAgICAgICAgIC8vIEVORCAtLSBUT0RPOiBleHRyYWN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZCgpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IExvb3RCYWcgZnJvbSBcIi4uL2JlaW5ncy9sb290X2JhZ1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdGF0cyh7IGdvLCBlbnRpdHksIGhwID0gMTAwLCBjdXJyZW50X2hwLCBtYW5hLCBjdXJyZW50X21hbmEgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5ocCA9IGhwIHx8IDEwMFxuICAgIHRoaXMuY3VycmVudF9ocCA9IGN1cnJlbnRfaHAgfHwgaHBcbiAgICB0aGlzLm1hbmEgPSBtYW5hXG4gICAgdGhpcy5jdXJyZW50X21hbmEgPSBjdXJyZW50X21hbmEgfHwgbWFuYVxuICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBudWxsO1xuICAgIHRoaXMuYXR0YWNrX3NwZWVkID0gMTAwMDtcblxuICAgIHRoaXMuaGFzX21hbmEgPSAoKSA9PiB0aGlzLm1hbmEgPT09IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzX2RlYWQgPSAoKSA9PiB0aGlzLmN1cnJlbnRfaHAgPD0gMDtcbiAgICB0aGlzLmlzX2FsaXZlID0gKCkgPT4gIXRoaXMuaXNfZGVhZCgpO1xuICAgIHRoaXMudGFrZV9kYW1hZ2UgPSAoeyBkYW1hZ2UgfSkgPT4ge1xuICAgICAgICBuZXcgU2Nyb2xsRGFtYWdlVGV4dCh7IGdvOiB0aGlzLmdvLCBlbnRpdHk6IHRoaXMuZW50aXR5LCBkYW1hZ2UgfSkuc3Bhd24oKVxuICAgICAgICB0aGlzLmN1cnJlbnRfaHAgLT0gZGFtYWdlO1xuICAgICAgICAvLyBUT0RPOiBleHRyYWN0XG4gICAgICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgICAgICAgYWN0aW9uOiBcImRhbWFnZVwiLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIGRhbWFnZWRfcGxheWVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmVudGl0eS5pZCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhbWFnZTogZGFtYWdlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5zZXJ2ZXIuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICAgICAgICAvLyBFTkQgLS0gVE9ETzogZXh0cmFjdFxuICAgICAgICBpZiAodGhpcy5pc19kZWFkKCkpIHRoaXMuZGllKClcbiAgICB9XG4gICAgdGhpcy5kaWUgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jcmVlcHMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY3JlZXBzXCIpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jbGlja2FibGVzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNsaWNrYWJsZXNcIilcbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB0aGlzLmVudGl0eSkgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsO1xuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci51cGRhdGVfeHAodGhpcy5lbnRpdHkpXG4gICAgICAgIGlmICh0aGlzLmVudGl0eS5sb290X3RhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9iYWdzLnB1c2gobmV3IExvb3RCYWcoeyBnbzogdGhpcy5nbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KSlcbiAgICAgICAgICAgIC8vIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmVudGl0eS5sb290X3RhYmxlKVxuICAgICAgICAgICAgLy8gdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubGFzdF9hdHRhY2tfYXQgPT09IG51bGwgfHwgKHRoaXMubGFzdF9hdHRhY2tfYXQgKyB0aGlzLmF0dGFja19zcGVlZCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSByYW5kb20oNSwgMTIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKiAke3RoaXMuZW50aXR5Lm5hbWV9IGF0dGFja3MgJHt0YXJnZXQubmFtZX06ICR7ZGFtYWdlfSBkYW1hZ2VgKVxuICAgICAgICAgICAgdGFyZ2V0LnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlOiBkYW1hZ2UgfSlcbiAgICAgICAgICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBEYXRlLm5vdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gU2Nyb2xsRGFtYWdlVGV4dCh7IGdvLCBlbnRpdHksIGRhbWFnZSB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnbztcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IG51bGxcbiAgICAgICAgdGhpcy5kaXNwbGF5X3RpbWUgPSAyMDAwXG4gICAgICAgIHRoaXMuZm9udF9zaXplID0gMjFcbiAgICAgICAgdGhpcy54ID0gdGhpcy5lbnRpdHkueCArIChyYW5kb20oMCwgdGhpcy5lbnRpdHkud2lkdGgpKSAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgdGhpcy55ID0gdGhpcy5lbnRpdHkueSAtIHRoaXMuZ28uY2FtZXJhLnlcblxuICAgICAgICB0aGlzLnNwYXduID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydGluZ190aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBgJHt0aGlzLmZvbnRfc2l6ZX1weCBzYW5zLXNlcmlmYFxuICAgICAgICAgICAgbGV0IHRleHQgPSBgJHt0aGlzLmRhbWFnZX1gXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLngsIHRoaXMuZW50aXR5LnkgLSB0aGlzLmdvLmNhbWVyYS55KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmUgJiYgRGF0ZS5ub3coKSA+IHRoaXMuc3RhcnRpbmdfdGltZSArIHRoaXMuZGlzcGxheV90aW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZm9udF9zaXplICs9IDAuMlxuICAgICAgICAgICAgdGhpcy55IC09IDAuMlxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlX2ZwcyA9ICgpID0+IHsgfVxuICAgICAgICB0aGlzLmVuZCA9ICgpID0+IHsgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi4vcmVzb3VyY2VfYmFyLmpzXCJcbmltcG9ydCBBZ2dybyBmcm9tIFwiLi4vYmVoYXZpb3JzL2FnZ3JvLmpzXCJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi4vYmVoYXZpb3JzL3N0YXRzLmpzXCJcblxuZnVuY3Rpb24gQ3JlZXAoeyBnbyB9KSB7XG4gIGlmIChnby5jcmVlcHMgPT09IHVuZGVmaW5lZCkgZ28uY3JlZXBzID0gW11cbiAgdGhpcy5pZCA9IGdvLmNyZWVwcy5sZW5ndGhcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY3JlZXBzLnB1c2godGhpcylcbiAgdGhpcy5uYW1lID0gYENyZWVwICR7dGhpcy5pZH1gXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IFwiemVyZ2xpbmcucG5nXCIgLy8gcGxhY2Vob2xkZXIgaW1hZ2VcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDE1MFxuICB0aGlzLmltYWdlX2hlaWdodCA9IDE1MFxuICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aClcbiAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KVxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG4gIHRoaXMuc3BlZWQgPSAyXG4gIC8vdGhpcy5tb3ZlbWVudF9ib2FyZCA9IHRoaXMuZ28uYm9hcmQuZ3JpZFxuICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIGhwOiAyMCB9KTtcbiAgLy8gQmVoYXZpb3Vyc1xuICB0aGlzLmFnZ3JvID0gbmV3IEFnZ3JvKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiA1MDAgfSk7XG4gIC8vIEVORCAtIEJlaGF2aW91cnNcblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAodGFyZ2V0X3Bvc2l0aW9uKSB7XG4gICAgbGV0IHggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnggPyB0YXJnZXRfcG9zaXRpb24ueCA6IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICBsZXQgeSA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueSA/IHRhcmdldF9wb3NpdGlvbi55IDogdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueVxuICAgIGxldCB3aWR0aCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ud2lkdGggPyB0YXJnZXRfcG9zaXRpb24ud2lkdGggOiB0aGlzLndpZHRoXG4gICAgbGV0IGhlaWdodCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0ID8gdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA6IHRoaXMuaGVpZ2h0XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHRoaXMuaW1hZ2VfeF9vZmZzZXQsIHRoaXMuaW1hZ2VfeV9vZmZzZXQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICAgIGlmICh0YXJnZXRfcG9zaXRpb24pIHJldHVyblxuXG4gICAgdGhpcy5hZ2dyby5hY3QoKTtcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gIH1cblxuICB0aGlzLnNldF9tb3ZlbWVudF90YXJnZXQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbm9kZVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KSB7XG4gICAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldClcbiAgICB9XG4gIH1cblxuICB0aGlzLmxvb3RfdGFibGUgPSBbe1xuICAgIGl0ZW06IHsgbmFtZTogXCJXb29kXCIsIGltYWdlX3NyYzogXCJicmFuY2gucG5nXCIgfSxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAzLFxuICAgIGNoYW5jZTogOTVcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JlZXBcbiIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9vdEJhZyh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmlkID0gYGxvb3RfYmFnYFxuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy54ID0gZW50aXR5LnhcbiAgICB0aGlzLnkgPSBlbnRpdHkueVxuICAgIHRoaXMud2lkdGggPSA1MFxuICAgIHRoaXMuaGVpZ2h0ID0gNTBcbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltYWdlLnNyYyA9ICdiYWNrcGFjay5wbmcnXG4gICAgdGhpcy5nby5jbGlja2FibGVzLnB1c2godGhpcyk7XG4gICAgdGhpcy5pdGVtcyA9IG51bGxcbiAgICB0aGlzLmFjdGVkX2J5X3NraWxsID0gJ2xvb3QnXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCAxMDAwLCAxMDAwLCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLmNsaWNrYWJsZXMpXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5sb290X2JhZ3MpXG4gICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZV9mcHMgPSAoKSA9PiB7fVxufSIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9uZSh7IGdvIH0pIHtcbiAgICB0aGlzLl9fcHJvdG9fXyA9IG5ldyBEb29kYWQoeyBnbyB9KVxuXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBcImZsaW50c3RvbmUucG5nXCJcbiAgICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aCk7XG4gICAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KTtcbiAgICB0aGlzLmltYWdlX3dpZHRoID0gODQwXG4gICAgdGhpcy5pbWFnZV9oZWlnaHQgPSA4NTlcbiAgICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICAgIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gICAgdGhpcy53aWR0aCA9IDMyXG4gICAgdGhpcy5oZWlnaHQgPSAzMlxuICAgIHRoaXMuYWN0ZWRfYnlfc2tpbGwgPSAnYnJlYWtfc3RvbmUnXG59IiwiaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCI7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRyZWUoeyBnbyB9KSB7XG4gICAgdGhpcy5fX3Byb3RvX18gPSBuZXcgRG9vZGFkKHsgZ28gfSlcblxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gXCJwbGFudHMucG5nXCJcbiAgICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aCk7XG4gICAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KTtcbiAgICB0aGlzLmltYWdlX3dpZHRoID0gOThcbiAgICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMTI3XG4gICAgdGhpcy5pbWFnZV9oZWlnaHQgPSAxMjZcbiAgICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMjkwXG4gICAgdGhpcy53aWR0aCA9IDk4XG4gICAgdGhpcy5oZWlnaHQgPSAxMjZcbiAgICB0aGlzLmFjdGVkX2J5X3NraWxsID0gXCJjdXRfdHJlZVwiXG59IiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZS5qc1wiXG5pbXBvcnQgeyBpc19jb2xsaWRpbmcsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuLy8gQSBncmlkIG9mIHRpbGVzIGZvciB0aGUgbWFuaXB1bGF0aW9uXG5mdW5jdGlvbiBCb2FyZCh7IGdvLCBlbnRpdHksIHJhZGl1cyB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmJvYXJkID0gdGhpc1xuICB0aGlzLnRpbGVfc2l6ZSA9IHRoaXMuZ28udGlsZV9zaXplXG4gIHRoaXMuZ3JpZCA9IFtbXV1cbiAgdGhpcy5yYWRpdXMgPSByYWRpdXNcbiAgdGhpcy53aWR0aCA9IHRoaXMucmFkaXVzICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMucmFkaXVzICogMlxuICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICB0aGlzLnNob3VsZF9kcmF3ID0gZmFsc2VcblxuICB0aGlzLnRvZ2dsZV9ncmlkID0gKCkgPT4ge1xuICAgIHRoaXMuc2hvdWxkX2RyYXcgPSAhdGhpcy5zaG91bGRfZHJhd1xuICAgIGlmICh0aGlzLnNob3VsZF9kcmF3KSB0aGlzLmJ1aWxkX2dyaWQoKVxuICB9XG5cbiAgdGhpcy5icHMgPSAwO1xuICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG5cbiAgdGhpcy5idWlsZF9ncmlkID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgZ3JpZFwiKVxuICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgaWYgKCh0aGlzLmJwcykgPCAxMDAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuZ3JpZCA9IG5ldyBBcnJheSh0aGlzLndpZHRoKVxuXG4gICAgY29uc3QgeF9wb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5lbnRpdHkueCArIHRoaXMuZW50aXR5LndpZHRoIC8gMilcbiAgICBjb25zdCB5X3Bvc2l0aW9uID0gTWF0aC5mbG9vcih0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0IC8gMilcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0gPSBuZXcgQXJyYXkodGhpcy5oZWlnaHQpXG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKHtcbiAgICAgICAgICB4OiAoeF9wb3NpdGlvbiAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSArIHggKiB0aGlzLnRpbGVfc2l6ZSksXG4gICAgICAgICAgeTogKHlfcG9zaXRpb24gLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkgKyB5ICogdGhpcy50aWxlX3NpemUpLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnRpbGVfc2l6ZSxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMudGlsZV9zaXplLFxuICAgICAgICAgIGc6IEluZmluaXR5LCAvLyBDb3N0IHNvIGZhclxuICAgICAgICAgIGY6IEluZmluaXR5LCAvLyBDb3N0IGZyb20gaGVyZSB0byB0YXJnZXRcbiAgICAgICAgICBoOiBudWxsLCAvL1xuICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgICAgICBib3JkZXJfY29sb3VyOiBcImJsYWNrXCJcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5nby50cmVlcy5mb3JFYWNoKHRyZWUgPT4ge1xuICAgICAgICAgIGlmIChpc19jb2xsaWRpbmcobm9kZSwgdHJlZSkpIHtcbiAgICAgICAgICAgIG5vZGUuY29sb3VyID0gJ3JlZCc7XG4gICAgICAgICAgICBub2RlLmJsb2NrZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBub2RlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy53YXlfdG9fcGxheWVyID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5maW5kX3BhdGgodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUsIHRoaXMuZ28uY2hhcmFjdGVyKVxuICAgIH1cbiAgfVxuXG4gIC8vIEEqIEltcGxlbWVudGF0aW9uXG4gIC8vIGY6IENvc3Qgb2YgdGhlIGVudGlyZSB0cmF2ZWwgKHN1bSBvZiBnICsgaClcbiAgLy8gZzogQ29zdCBmcm9tIHN0YXJ0X25vZGUgdGlsbCBub2RlICh0cmF2ZWwgY29zdClcbiAgLy8gaDogQ29zdCBmcm9tIG5vZGUgdGlsbCBlbmRfbm9kZSAobGVmdG92ZXIgY29zdClcbiAgLy8gQWRkIHRoZSBjdXJyZW50IG5vZGUgaW4gYSBsaXN0XG4gIC8vIFBvcCB0aGUgb25lIHdob3NlIGYgaXMgdGhlIGxvd2VzdGFcbiAgLy8gQWRkIHRvIGEgbGlzdCBvZiBhbHJlYWR5LXZpc2l0ZWQgKGNsb3NlZClcbiAgLy8gVmlzaXQgYWxsIGl0cyBuZWlnaGJvdXJzXG4gIC8vIFVwZGF0ZSBmb3IgZWFjaDogdGhlIHRyYXZlbCBjb3N0IChnKSB5b3UgbWFuYWdlZCB0byBkbyBhbmQgeW91cnNlbGYgYXMgcGFyZW50XG4gIC8vLy8gU28gdGhhdCB3ZSBjYW4gcmV0cmFjZSBob3cgd2UgZ290IGhlcmVcbiAgdGhpcy5maW5kX3BhdGggPSAoc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbikgPT4ge1xuICAgIHRoaXMuYnVpbGRfZ3JpZCgpXG4gICAgY29uc3Qgc3RhcnRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKHN0YXJ0X3Bvc2l0aW9uKTtcbiAgICBjb25zdCBlbmRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKGVuZF9wb3NpdGlvbik7XG4gICAgaWYgKCFzdGFydF9ub2RlIHx8ICFlbmRfbm9kZSkge1xuICAgICAgY29uc29sZS5sb2coXCJub2RlcyBub3QgbWF0Y2hlZFwiKVxuICAgICAgZGVidWdnZXJcbiAgICB9XG5cbiAgICBzdGFydF9ub2RlLmNvbG91ciA9ICdvcmFuZ2UnXG4gICAgZW5kX25vZGUuY29sb3VyID0gJ29yYW5nZSdcblxuICAgIGNvbnN0IG9wZW5fc2V0ID0gW3N0YXJ0X25vZGVdO1xuICAgIGNvbnN0IGNsb3NlZF9zZXQgPSBbXTtcblxuICAgIGNvbnN0IGNvc3QgPSAobm9kZV9hLCBub2RlX2IpID0+IHtcbiAgICAgIGNvbnN0IGR4ID0gbm9kZV9hLnggLSBub2RlX2IueDtcbiAgICAgIGNvbnN0IGR5ID0gbm9kZV9hLnkgLSBub2RlX2IueTtcbiAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH1cblxuICAgIHN0YXJ0X25vZGUuZyA9IDA7XG4gICAgc3RhcnRfbm9kZS5mID0gY29zdChzdGFydF9ub2RlLCBlbmRfbm9kZSk7XG5cbiAgICB3aGlsZSAob3Blbl9zZXQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY3VycmVudF9ub2RlID0gb3Blbl9zZXQuc29ydCgoYSwgYikgPT4gKGEuZiA8IGIuZiA/IC0xIDogMSkpWzBdIC8vIEdldCB0aGUgbm9kZSB3aXRoIGxvd2VzdCBmIHZhbHVlIGluIHRoZSBvcGVuIHNldFxuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KGN1cnJlbnRfbm9kZSwgb3Blbl9zZXQpXG4gICAgICBjbG9zZWRfc2V0LnB1c2goY3VycmVudF9ub2RlKVxuICAgICAgXG4gICAgICBpZiAoY3VycmVudF9ub2RlID09PSBlbmRfbm9kZSkge1xuICAgICAgICBsZXQgY3VycmVudCA9IGN1cnJlbnRfbm9kZTtcbiAgICAgICAgbGV0IHBhdGggPSBbXTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQucGFyZW50KSB7XG4gICAgICAgICAgY3VycmVudC5jb2xvdXIgPSAncHVycGxlJ1xuICAgICAgICAgIHBhdGgucHVzaChjdXJyZW50KTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm5laWdoYm91cnMoY3VycmVudF9ub2RlKS5mb3JFYWNoKG5laWdoYm91cl9ub2RlID0+IHtcbiAgICAgICAgaWYgKCFuZWlnaGJvdXJfbm9kZS5ibG9ja2VkICYmICFjbG9zZWRfc2V0LmluY2x1ZGVzKG5laWdoYm91cl9ub2RlKSkge1xuICAgICAgICAgIGxldCBnX3VzZWQgPSBjdXJyZW50X25vZGUuZyArIGNvc3QoY3VycmVudF9ub2RlLCBuZWlnaGJvdXJfbm9kZSlcbiAgICAgICAgICBsZXQgYmVzdF9nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCFvcGVuX3NldC5pbmNsdWRlcyhuZWlnaGJvdXJfbm9kZSkpIHtcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLmggPSBjb3N0KG5laWdoYm91cl9ub2RlLCBlbmRfbm9kZSlcbiAgICAgICAgICAgIG9wZW5fc2V0LnB1c2gobmVpZ2hib3VyX25vZGUpXG4gICAgICAgICAgICBiZXN0X2cgPSB0cnVlXG4gICAgICAgICAgfSBlbHNlIGlmIChnX3VzZWQgPCBuZWlnaGJvdXJfbm9kZS5nKSB7XG4gICAgICAgICAgICBiZXN0X2cgPSB0cnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJlc3RfZykge1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUucGFyZW50ID0gY3VycmVudF9ub2RlO1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuZyA9IGdfdXNlZFxuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuZiA9IG5laWdoYm91cl9ub2RlLmcgKyBuZWlnaGJvdXJfbm9kZS5oXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubmVpZ2hib3VycyA9IChub2RlKSA9PiB7IC8vIDUsNVxuICAgIGNvbnN0IHhfb2Zmc2V0ID0gKE1hdGguZmxvb3IodGhpcy5lbnRpdHkueCArIHRoaXMuZW50aXR5LndpZHRoIC8gMikgLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkpXG4gICAgY29uc3QgeV9vZmZzZXQgPSAoTWF0aC5mbG9vcih0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0IC8gMikgLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkpXG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoKG5vZGUueCAtIHhfb2Zmc2V0KSAvIHRoaXMudGlsZV9zaXplKVxuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChub2RlLnkgLSB5X29mZnNldCkgLyB0aGlzLnRpbGVfc2l6ZSlcblxuICAgIGZ1bmN0aW9uIGZldGNoX2dyaWRfY2VsbChncmlkLCBseCwgbHkpIHtcbiAgICAgIHJldHVybiBncmlkW2x4XSAmJiBncmlkW2x4XVtseV1cbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCwgeSAtIDEpLCAvLyB0b3BcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5IC0gMSksIC8vIHRvcCBsZWZ0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSAtIDEpLCAvLyB0b3AgcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHgsIHkgKyAxKSwgLy8gYm90dG9tXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4IC0gMSwgeSArIDEpLCAvLyBib3R0b20gbGVmdFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCArIDEsIHkgKyAxKSwgLy8gYm90dG9tIHJpZ2h0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4IC0gMSwgeSksIC8vIHJpZ2h0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSkgLy8gbGVmdFxuICAgIF0uZmlsdGVyKG5vZGUgPT4gbm9kZSAhPT0gdW5kZWZpbmVkKVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5zaG91bGRfZHJhdykgcmV0dXJuXG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5ncmlkW3hdW3ldO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSBcIjFcIlxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IG5vZGUuYm9yZGVyX2NvbG91clxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBub2RlLmNvbG91clxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdChub2RlLnggLSB0aGlzLmdvLmNhbWVyYS54LCBub2RlLnkgLSB0aGlzLmdvLmNhbWVyYS55LCBub2RlLndpZHRoLCBub2RlLmhlaWdodClcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdChub2RlLnggLSB0aGlzLmdvLmNhbWVyYS54LCBub2RlLnkgLSB0aGlzLmdvLmNhbWVyYS55LCBub2RlLndpZHRoLCBub2RlLmhlaWdodClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkX2dyaWQoKVxuICB9XG5cbiAgLy8gUmVjZWl2ZXMgYSByZWN0IGFuZCByZXR1cm5zIGl0J3MgZmlyc3QgY29sbGlkaW5nIE5vZGVcbiAgdGhpcy5nZXRfbm9kZV9mb3IgPSAocmVjdCkgPT4ge1xuICAgIGlmIChyZWN0LndpZHRoID09IHVuZGVmaW5lZCkgcmVjdC53aWR0aCA9IDFcbiAgICBpZiAocmVjdC5oZWlnaHQgPT0gdW5kZWZpbmVkKSByZWN0LmhlaWdodCA9IDFcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGlmICgodGhpcy5ncmlkW3hdID09PSB1bmRlZmluZWQpIHx8ICh0aGlzLmdyaWRbeF1beV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHt4fSwke3l9IGNvb3JkaW5hdGVzIGlzIHVuZGVmaW5lZGApXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coYFdpZHRoOiAke3RoaXMud2lkdGh9OyBoZWlnaHQ6ICR7dGhpcy5oZWlnaHR9IChyYWRpdXM6ICR7dGhpcy5yYWRpdXN9KWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4ucmVjdCxcbiAgICAgICAgICAgIH0sIHRoaXMuZ3JpZFt4XVt5XSkpIHJldHVybiB0aGlzLmdyaWRbeF1beV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8vIFVOVVNFRCBPTEQgQUxHT1JJVEhNXG5cbiAgLy8gU2V0cyBhIGdsb2JhbCB0YXJnZXQgbm9kZVxuICAvLyBJdCB3YXMgdXNlZCBiZWZvcmUgdGhlIG1vdmVtZW50IGdvdCBkZXRhY2hlZCBmcm9tIHRoZSBwbGF5ZXIgY2hhcmFjdGVyXG4gIHRoaXMudGFyZ2V0X25vZGUgPSBudWxsXG4gIHRoaXMuc2V0X3RhcmdldCA9IChub2RlKSA9PiB7XG4gICAgdGhpcy5ncmlkLmZvckVhY2goKG5vZGUpID0+IG5vZGUuZGlzdGFuY2UgPSAwKVxuICAgIHRoaXMudGFyZ2V0X25vZGUgPSBub2RlXG4gIH1cblxuICAvLyBDYWxjdWxhdGVzIHBvc3NpYmxlIHBvc3NpdGlvbnMgZm9yIHRoZSBuZXh0IG1vdmVtZW50XG4gIHRoaXMuY2FsY3VsYXRlX25laWdoYm91cnMgPSAoY2hhcmFjdGVyKSA9PiB7XG4gICAgbGV0IGNoYXJhY3Rlcl9yZWN0ID0ge1xuICAgICAgeDogY2hhcmFjdGVyLnggLSBjaGFyYWN0ZXIuc3BlZWQsXG4gICAgICB5OiBjaGFyYWN0ZXIueSAtIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIHdpZHRoOiBjaGFyYWN0ZXIud2lkdGggKyBjaGFyYWN0ZXIuc3BlZWQsXG4gICAgICBoZWlnaHQ6IGNoYXJhY3Rlci5oZWlnaHQgKyBjaGFyYWN0ZXIuc3BlZWRcbiAgICB9XG5cbiAgICBsZXQgZnV0dXJlX21vdmVtZW50X2NvbGxpc2lvbnMgPSBjaGFyYWN0ZXIubW92ZW1lbnRfYm9hcmQuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gaXNfY29sbGlkaW5nKGNoYXJhY3Rlcl9yZWN0LCBub2RlKVxuICAgIH0pXG5cbiAgICAvLyBJJ20gZ29ubmEgY29weSB0aGVtIGhlcmUgb3RoZXJ3aXNlIGRpZmZlcmVudCBlbnRpdGllcyBjYWxjdWxhdGluZyBkaXN0YW5jZVxuICAgIC8vIHdpbGwgYWZmZWN0IGVhY2ggb3RoZXIncyBudW1iZXJzLiBUaGlzIGNhbiBiZSBzb2x2ZWQgd2l0aCBhIGRpZmZlcmVudFxuICAgIC8vIGNhbGN1bGF0aW9uIGFsZ29yaXRobSBhcyB3ZWxsLlxuICAgIHJldHVybiBmdXR1cmVfbW92ZW1lbnRfY29sbGlzaW9uc1xuICB9XG5cblxuICB0aGlzLm5leHRfc3RlcCA9IChjaGFyYWN0ZXIsIGNsb3Nlc3Rfbm9kZSwgdGFyZ2V0X25vZGUpID0+IHtcbiAgICAvLyBTdGVwOiBTZWxlY3QgYWxsIG5laWdoYm91cnNcbiAgICBsZXQgdmlzaXRlZCA9IFtdXG4gICAgbGV0IG5vZGVzX3Blcl9yb3cgPSBNYXRoLnRydW5jKDQwOTYgLyBnby50aWxlX3NpemUpXG4gICAgbGV0IG9yaWdpbl9pbmRleCA9IGNsb3Nlc3Rfbm9kZS5pZFxuXG4gICAgbGV0IG5laWdoYm91cnMgPSB0aGlzLmNhbGN1bGF0ZV9uZWlnaGJvdXJzKGNoYXJhY3RlcilcblxuICAgIC8vIFN0ZXA6IFNvcnQgbmVpZ2hib3VycyBieSBkaXN0YW5jZSAoc21hbGxlciBkaXN0YW5jZSBmaXJzdClcbiAgICAvLyBXZSBhZGQgdGhlIHdhbGsgbW92ZW1lbnQgdG8gcmUtdmlzaXRlZCBub2RlcyB0byBzaWduaWZ5IHRoaXMgY29zdFxuICAgIGxldCBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MgPSBuZWlnaGJvdXJzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmRpc3RhbmNlKSB7XG4gICAgICAgIC8vYS5kaXN0YW5jZSArPSAyICogY2hhcmFjdGVyLnNwZWVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhLmRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShhLCB0YXJnZXRfbm9kZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGIuZGlzdGFuY2UpIHtcbiAgICAgICAgLy9iLmRpc3RhbmNlICs9IGNoYXJhY3Rlci5zcGVlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYi5kaXN0YW5jZSA9IFZlY3RvcjIuZGlzdGFuY2UoYiwgdGFyZ2V0X25vZGUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhLmRpc3RhbmNlIC0gYi5kaXN0YW5jZVxuICAgIH0pXG5cbiAgICAvLyBTdGVwOiBTZWxlY3Qgb25seSBuZWlnaGJvdXIgbm9kZXMgdGhhdCBhcmUgbm90IGJsb2NrZWRcbiAgICBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MgPSBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gbm9kZS5ibG9ja2VkICE9PSB0cnVlXG4gICAgfSlcblxuICAgIC8vIFN0ZXA6IFJldHVybiB0aGUgY2xvc2VzdCB2YWxpZCBub2RlIHRvIHRoZSB0YXJnZXRcbiAgICAvLyByZXR1cm5zIHRydWUgaWYgdGhlIGNsb3Nlc3QgcG9pbnQgaXMgdGhlIHRhcmdldCBpdHNlbGZcbiAgICAvLyByZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGlzIG5vd2hlcmUgdG8gZ29cbiAgICBpZiAobmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGZ1dHVyZV9ub2RlID0gbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjWzBdXG4gICAgICByZXR1cm4gKGZ1dHVyZV9ub2RlLmlkID09IHRhcmdldF9ub2RlLmlkID8gdHJ1ZSA6IGZ1dHVyZV9ub2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZSA9IGZ1bmN0aW9uIChjaGFyYWN0ZXIsIHRhcmdldF9ub2RlKSB7XG4gICAgbGV0IGNoYXJfcG9zID0ge1xuICAgICAgeDogY2hhcmFjdGVyLngsXG4gICAgICB5OiBjaGFyYWN0ZXIueVxuICAgIH1cblxuICAgIGxldCBjdXJyZW50X25vZGUgPSB0aGlzLmdldF9ub2RlX2ZvcihjaGFyX3BvcylcbiAgICBsZXQgY2xvc2VzdF9ub2RlID0gdGhpcy5uZXh0X3N0ZXAoY2hhcmFjdGVyLCBjdXJyZW50X25vZGUsIHRhcmdldF9ub2RlKVxuXG4gICAgLy8gV2UgaGF2ZSBhIG5leHQgc3RlcFxuICAgIGlmICh0eXBlb2YgKGNsb3Nlc3Rfbm9kZSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGxldCBmdXR1cmVfbW92ZW1lbnQgPSB7IC4uLmNoYXJfcG9zIH1cbiAgICAgIGxldCB4X3NwZWVkID0gMFxuICAgICAgbGV0IHlfc3BlZWQgPSAwXG4gICAgICBpZiAoY2xvc2VzdF9ub2RlLnggIT0gY2hhcmFjdGVyLngpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlX3ggPSBjaGFyX3Bvcy54IC0gY2xvc2VzdF9ub2RlLnhcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlX3gpID49IGNoYXJhY3Rlci5zcGVlZCkge1xuICAgICAgICAgIHhfc3BlZWQgPSAoZGlzdGFuY2VfeCA+IDAgPyAtY2hhcmFjdGVyLnNwZWVkIDogY2hhcmFjdGVyLnNwZWVkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjaGFyX3Bvcy54IDwgY2xvc2VzdF9ub2RlLngpIHtcbiAgICAgICAgICAgIHhfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV94KSAqIC0xXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHhfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV94KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2xvc2VzdF9ub2RlLnkgIT0gY2hhcmFjdGVyLnkpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlX3kgPSBmdXR1cmVfbW92ZW1lbnQueSAtIGNsb3Nlc3Rfbm9kZS55XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZV95KSA+PSBjaGFyYWN0ZXIuc3BlZWQpIHtcbiAgICAgICAgICB5X3NwZWVkID0gKGRpc3RhbmNlX3kgPiAwID8gLWNoYXJhY3Rlci5zcGVlZCA6IGNoYXJhY3Rlci5zcGVlZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPCBjbG9zZXN0X25vZGUueSkge1xuICAgICAgICAgICAgeV9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3kpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHlfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV95KSAqIC0xXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gZnV0dXJlX21vdmVtZW50LnggKyB4X3NwZWVkXG4gICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGZ1dHVyZV9tb3ZlbWVudC55ICsgeV9zcGVlZFxuXG4gICAgICBjaGFyYWN0ZXIuY29vcmRzKGZ1dHVyZV9tb3ZlbWVudClcbiAgICAgIC8vIFdlJ3JlIGFscmVhZHkgYXQgdGhlIGJlc3Qgc3BvdFxuICAgIH0gZWxzZSBpZiAoY2xvc2VzdF9ub2RlID09PSB0cnVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInJlYWNoZWRcIilcbiAgICAgIGNoYXJhY3Rlci5tb3ZlbWVudF9ib2FyZCA9IFtdXG4gICAgICBjaGFyYWN0ZXIubW92aW5nID0gZmFsc2VcbiAgICAgIC8vIFdlJ3JlIHN0dWNrXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE86IGdvdCB0aGlzIG9uY2UgYWZ0ZXIgaGFkIGFscmVhZHkgcmVhY2hlZC4gXG4gICAgICBjb25zb2xlLmxvZyhcIm5vIHBhdGhcIilcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9hcmRcbiIsImZ1bmN0aW9uIENhbWVyYShnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jYW1lcmEgPSB0aGlzXG4gIHRoaXMueCA9IDBcbiAgdGhpcy55ID0gMFxuICB0aGlzLmNhbWVyYV9zcGVlZCA9IDNcblxuICB0aGlzLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UgPSAoZXYpID0+IHtcbiAgICAvL2lmICh0aGlzLmdvLmVkaXRvci5wYWludF9tb2RlKSByZXR1cm5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgYm90dG9tIG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPCAxMDApIHtcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IHkgKyB0aGUgbW92ZW1lbnQgd2UnbGwgbWFrZSBmdXJ0aGVyIHRoZXJlIGlzIGdyZWF0ZXIgdGhhblxuICAgICAgLy8gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgc2NyZWVuIG1pbnVzIHRoZSBoZWlnaHQgdGhhdCB3aWxsIGFscmVhZHkgYmUgdmlzaWJsZVxuICAgICAgLy8gKHRoZSBjYW52YXMgaGVpZ2h0KSwgZG9uJ3QgZ28gZnVydGhlciBvd25cbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLmhlaWdodCAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSB0b3Agb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIDEwMCkge1xuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA8IDEwMCkge1xuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4ud2lkdGggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gMTAwKSB7XG4gICAgICAvLyBEb24ndCBnbyBmdXJ0aGVyIGxlZnRcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZm9jdXMgPSAocG9pbnQpID0+IHtcbiAgICBsZXQgeCA9IHBvaW50LnggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICAgIGxldCB5ID0gcG9pbnQueSAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICAgIC8vIHNwZWNpZmljIG1hcCBjdXRzIChpdCBoYXMgYSBtYXAgb2Zmc2V0IG9mIDYwLDE2MClcbiAgICBpZiAoeSA8IDApIHsgeSA9IDAgfVxuICAgIGlmICh4IDwgMCkgeyB4ID0gMCB9XG4gICAgaWYgKHggKyB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoID4gdGhpcy5nby53b3JsZC53aWR0aCkgeyB4ID0gdGhpcy54IH1cbiAgICBpZiAoeSArIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0ID4gdGhpcy5nby53b3JsZC5oZWlnaHQpIHsgeSA9IHRoaXMueSB9XG4gICAgLy8gb2Zmc2V0IGNoYW5nZXMgZW5kXG4gICAgdGhpcy54ID0geFxuICAgIHRoaXMueSA9IHlcbiAgfVxuXG4gIHRoaXMuZ2xvYmFsX2Nvb3JkcyA9IChvYmopID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub2JqLFxuICAgICAgeDogb2JqLnggLSB0aGlzLngsXG4gICAgICB5OiBvYmoueSAtIHRoaXMueVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW1lcmFcbiIsImZ1bmN0aW9uIENhc3RpbmdCYXIoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuZHVyYXRpb24gPSBudWxsXG4gICAgdGhpcy53aWR0aCA9IGVudGl0eS53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gNVxuICAgIHRoaXMuY29sb3VyID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZnVsbCA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgdGhpcy5zdGFydGluZ190aW1lID0gbnVsbFxuICAgIHRoaXMubGFzdF90aW1lID0gbnVsbFxuICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsXG4gICAgLy8gU3RheXMgc3RhdGljIGluIGEgcG9zaXRpb24gaW4gdGhlIG1hcFxuICAgIC8vIE1lYW5pbmc6IGRvZXNuJ3QgbW92ZSB3aXRoIHRoZSBjYW1lcmFcbiAgICB0aGlzLnN0YXRpYyA9IGZhbHNlXG4gICAgdGhpcy54X29mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGljID9cbiAgICAgICAgICAgIHRoaXMuZ28uY2FtZXJhLnggOlxuICAgICAgICAgICAgMDtcbiAgICB9XG4gICAgdGhpcy55X29mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGljID9cbiAgICAgICAgICAgIHRoaXMuZ28uY2FtZXJhLnkgOlxuICAgICAgICAgICAgMDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0ID0gKGR1cmF0aW9uLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB9XG5cbiAgICB0aGlzLnN0b3AgPSAoKSA9PiB0aGlzLmR1cmF0aW9uID0gbnVsbFxuXG4gICAgdGhpcy5kcmF3ID0gKGZ1bGwgPSB0aGlzLmZ1bGwsIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZHVyYXRpb24gPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBsZXQgZWxhcHNlZF90aW1lID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aW1lO1xuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGVsYXBzZWRfdGltZTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCA8PSB0aGlzLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLmVudGl0eS54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgICAgICAgICAgdGhpcy55ID0gdGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCArIDEwIC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbGV0IGJhcl93aWR0aCA9ICgodGhpcy5jdXJyZW50IC8gdGhpcy5kdXJhdGlvbikgKiB0aGlzLndpZHRoKVxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmICgodGhpcy5jYWxsYmFjayAhPT0gbnVsbCkgJiYgKHRoaXMuY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkpIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FzdGluZ0JhclxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgcmFuZG9tLCBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuaW1wb3J0IEludmVudG9yeSBmcm9tIFwiLi9pbnZlbnRvcnlcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuL2JlaGF2aW9ycy9zdGF0cy5qc1wiXG5pbXBvcnQgU3BlbGxjYXN0aW5nIGZyb20gXCIuL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanNcIlxuaW1wb3J0IEZyb3N0Ym9sdCBmcm9tIFwiLi9zcGVsbHMvZnJvc3Rib2x0LmpzXCJcbmltcG9ydCBCbGluayBmcm9tIFwiLi9zcGVsbHMvYmxpbmsuanNcIlxuaW1wb3J0IEN1dFRyZWUgZnJvbSBcIi4vc2tpbGxzL2N1dF90cmVlLmpzXCJcbmltcG9ydCBTa2lsbCBmcm9tIFwiLi9za2lsbC5qc1wiXG5pbXBvcnQgQnJlYWtTdG9uZSBmcm9tIFwiLi9za2lsbHMvYnJlYWtfc3RvbmUuanNcIlxuaW1wb3J0IE1ha2VGaXJlIGZyb20gXCIuL3NraWxscy9tYWtlX2ZpcmUuanNcIlxuaW1wb3J0IEJvYXJkIGZyb20gXCIuL2JvYXJkLmpzXCJcbmltcG9ydCBMb290IGZyb20gXCIuL2JlaGF2aW9ycy9sb290LmpzXCJcblxuZnVuY3Rpb24gQ2hhcmFjdGVyKGdvLCBpZCkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5uYW1lID0gYFBsYXllciAke1N0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkpLnNsaWNlKDAsIDIpfWBcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwiY3Jpc2lzY29yZXBlZXBzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaWQgPSBpZFxuICB0aGlzLnggPSAxMDBcbiAgdGhpcy55ID0gMTAwXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IFwiZG93blwiXG4gIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9IDBcbiAgdGhpcy5zcGVlZCA9IDEuNFxuICB0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoeyBnbyB9KTtcbiAgdGhpcy5zcGVsbGJvb2sgPSB7XG4gICAgZnJvc3Rib2x0OiBuZXcgRnJvc3Rib2x0KHsgZ28sIGVudGl0eTogdGhpcyB9KSxcbiAgICBibGluazogbmV3IEJsaW5rKHsgZ28sIGVudGl0eTogdGhpcyB9KVxuICB9XG4gIHRoaXMuY3VycmVudF90YXJnZXQgPSB1bmRlZmluZWRcbiAgdGhpcy5zcGVsbF90YXJnZXQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudF90YXJnZXQgfHwgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGVcbiAgfVxuICB0aGlzLnNwZWxscyA9IHtcbiAgICBmcm9zdGJvbHQ6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogdGhpcy5zcGVsbGJvb2suZnJvc3Rib2x0LCB0YXJnZXQ6IHRoaXMuc3BlbGxfdGFyZ2V0IH0pLmNhc3QsXG4gICAgYmxpbms6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogdGhpcy5zcGVsbGJvb2suYmxpbmsgfSkuY2FzdFxuICB9XG4gIHRoaXMuc2tpbGxzID0ge1xuICAgIGN1dF90cmVlOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IEN1dFRyZWUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdCxcbiAgICBicmVha19zdG9uZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBCcmVha1N0b25lKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3QsXG4gICAgbWFrZV9maXJlOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IE1ha2VGaXJlKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3RcbiAgfVxuICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKHsgZ28sIGVudGl0eTogdGhpcywgbWFuYTogNTAgfSk7XG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHlfb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMubWFuYV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMTAsIGNvbG91cjogXCJibHVlXCIgfSlcbiAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7IGdvLCBlbnRpdHk6IHRoaXMsIHJhZGl1czogMjAgfSlcbiAgdGhpcy5leHBlcmllbmNlX3BvaW50cyA9IDBcbiAgdGhpcy5sZXZlbCA9IDE7XG4gIHRoaXMudXBkYXRlX3hwID0gKGVudGl0eSkgPT4ge1xuICAgIHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgKz0gMTAwO1xuICAgIGlmICh0aGlzLmV4cGVyaWVuY2VfcG9pbnRzID49IDEwMDApIHtcbiAgICAgIHRoaXMubGV2ZWwgKz0gMTtcbiAgICAgIHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgPSAwO1xuICAgIH1cbiAgfVxuICB0aGlzLmlzX2J1c3kgPSBmYWxzZVxuICB0aGlzLmlzX2J1c3lfd2l0aCA9IG51bGw7XG5cbiAgdGhpcy51cGRhdGVfZnBzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgaWYgKG5lYXJfYm9uZmlyZSgpKSB7XG4gICAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X2hwIDwgdGhpcy5zdGF0cy5ocCkgdGhpcy5zdGF0cy5jdXJyZW50X2hwICs9IHJhbmRvbSg0LCA3KVxuICAgICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9tYW5hIDwgdGhpcy5zdGF0cy5tYW5hKSB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSArPSByYW5kb20oMSwgMylcbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIGZ1bmN0aW9uIHRyaWVzIHRvIHNlZSBpZiB0aGUgc2VsZWN0ZWQgY2xpY2thYmxlIGhhcyBhIGRlZmF1bHQgYWN0aW9uIHNldCBmb3IgaW50ZXJhY3Rpb25cbiAgdGhpcy5za2lsbF9hY3Rpb24gPSAoKSA9PiB7XG4gICAgbGV0IG9iamVjdCA9IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlXG4gICAgaWYgKG9iamVjdC5hY3RlZF9ieV9za2lsbCA9PSAnbG9vdCcpIHtcbiAgICAgIGlmIChWZWN0b3IyLmRpc3RhbmNlKG9iamVjdCwgdGhpcykgPCBvYmplY3Qud2lkdGggKyAyMCkge1xuICAgICAgICBuZXcgTG9vdCh7IGdvLCBlbnRpdHk6IHRoaXMsIGxvb3RfYmFnOiBvYmplY3QgfSkuYWN0KClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9iamVjdCAmJiB0aGlzLnNraWxsc1tvYmplY3QuYWN0ZWRfYnlfc2tpbGxdKSB7XG4gICAgICB0aGlzLnNraWxsc1tvYmplY3QuYWN0ZWRfYnlfc2tpbGxdKClcbiAgICB9XG4gIH1cblxuICB0aGlzLmVzY2FwZV9rZXkgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuaXNfYnVzeV93aXRoKSB7XG4gICAgICB0aGlzLmlzX2J1c3lfd2l0aC5zdG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ28uc3RhcnRfbWVudS5hY3RpdmUgPSAhdGhpcy5nby5zdGFydF9tZW51LmFjdGl2ZVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5lYXJfYm9uZmlyZSA9ICgpID0+IHRoaXMuZ28uZmlyZXMuc29tZShmaXJlID0+IFZlY3RvcjIuZGlzdGFuY2UodGhpcywgZmlyZSkgPCAxMDApO1xuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy50YXJnZXRfbW92ZW1lbnQpIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQoKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgICB0aGlzLm1hbmFfYmFyLmRyYXcodGhpcy5zdGF0cy5tYW5hLCB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSlcbiAgfVxuXG4gIHRoaXMuZHJhd19jaGFyYWN0ZXIgPSAoeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0pID0+IHtcbiAgICB4ID0geCA9PT0gdW5kZWZpbmVkID8gdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCA6IHhcbiAgICB5ID0geSA9PT0gdW5kZWZpbmVkID8gdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSA6IHlcbiAgICB3aWR0aCA9IHdpZHRoID09PSB1bmRlZmluZWQgPyB0aGlzLndpZHRoIDogd2lkdGhcbiAgICBoZWlnaHQgPSBoZWlnaHQgPT09IHVuZGVmaW5lZCA/IHRoaXMuaGVpZ2h0IDogaGVpZ2h0XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIE1hdGguZmxvb3IodGhpcy53YWxrX2N5Y2xlX2luZGV4KSAqIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUoKSAqIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgfVxuXG4gIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHJldHVybiAyXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHJldHVybiAzXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICByZXR1cm4gMFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgICBjb25zdCBmdXR1cmVfcG9zaXRpb24gPSB7IHg6IHRoaXMueCwgeTogdGhpcy55LCB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9XG5cbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIGlmICh0aGlzLnggKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC53aWR0aCArIHRoaXMuZ28ud29ybGQueF9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueCArPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgaWYgKHRoaXMueSAtIHRoaXMuc3BlZWQgPiB0aGlzLmdvLndvcmxkLnlfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnkgLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgaWYgKHRoaXMueCAtIHRoaXMuc3BlZWQgPiB0aGlzLmdvLndvcmxkLnhfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnggLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgaWYgKHRoaXMueSArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLmhlaWdodCArIHRoaXMuZ28ud29ybGQueV9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueSArPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdvLnRyZWVzLnNvbWUodHJlZSA9PiAoaXNfY29sbGlkaW5nKGZ1dHVyZV9wb3NpdGlvbiwgdHJlZSkpKSkge1xuICAgICAgdGhpcy54ID0gZnV0dXJlX3Bvc2l0aW9uLnhcbiAgICAgIHRoaXMueSA9IGZ1dHVyZV9wb3NpdGlvbi55XG4gICAgICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAodGhpcy53YWxrX2N5Y2xlX2luZGV4ICsgKDAuMDMgKiB0aGlzLnNwZWVkKSkgJSAzXG4gICAgICB0aGlzLmdvLmNhbWVyYS5mb2N1cyh0aGlzKVxuICAgICAgLy8gVE9ETzogZXh0cmFjdFxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIGFjdGlvbjogXCJtb3ZlXCIsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeDogdGhpcy54LFxuICAgICAgICAgIHk6IHRoaXMueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmdvLnNlcnZlci5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgICAvLyBFTkQgLS0gVE9ETzogZXh0cmFjdFxuICAgIH1cbiAgfVxuXG4gIC8vIEV4cGVyaW1lbnRzXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cblxuICB0aGlzLmZpbmRfcGF0aCA9ICh0YXJnZXRfbW92ZW1lbnQpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSB0YXJnZXRfbW92ZW1lbnRcblxuICAgIGlmICh0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IHg6IHRoaXMueCArIHRoaXMuc3BlZWQsIHk6IHRoaXMueSArIHRoaXMuc3BlZWQgfSlcbiAgICB9XG5cbiAgICB2YXIgbGFzdF9zdGVwID0ge31cbiAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0ge31cblxuICAgIGRvIHtcbiAgICAgIGxhc3Rfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoW3RoaXMuY3VycmVudF9wYXRoLmxlbmd0aCAtIDFdXG4gICAgICBmdXR1cmVfbW92ZW1lbnQgPSB7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgICAgLy8gVGhpcyBjb2RlIHdpbGwga2VlcCB0cnlpbmcgdG8gZ28gYmFjayB0byB0aGUgc2FtZSBwcmV2aW91cyBmcm9tIHdoaWNoIHdlIGp1c3QgYnJhbmNoZWQgb3V0XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnggPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcblxuICAgICAgLy8gVGhpcyBpcyBwcmV0dHkgaGVhdnkuLi4gSXQncyBjYWxjdWxhdGluZyBhZ2FpbnN0IGFsbCB0aGUgYml0cyBpbiB0aGUgbWFwID1bXG4gICAgICB2YXIgZ29pbmdfdG9fY29sbGlkZSA9IHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpXG4gICAgICBpZiAoZ29pbmdfdG9fY29sbGlkZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ29sbGlzaW9uIGFoZWFkIScpXG4gICAgICAgIHZhciBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnggPSBuZXh0X21vdmVtZW50LnggLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgb24gWVwiKVxuICAgICAgICB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueSA9IG5leHRfbW92ZW1lbnQueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBYXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyAuLi5mdXR1cmVfbW92ZW1lbnQgfSlcbiAgICB9IHdoaWxlICgoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHx8IChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkpXG5cbiAgICB0aGlzLm1vdmluZyA9IHRydWVcbiAgfVxuXG4gIHRoaXMubW92ZV9vbl9wYXRoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdmFyIG5leHRfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoLnNoaWZ0KClcbiAgICAgIGlmIChuZXh0X3N0ZXApIHtcbiAgICAgICAgdGhpcy54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgdGhpcy55ID0gbmV4dF9zdGVwLnlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICAvL3RoaXMubW92ZSA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCkge1xuICAvLyAgaWYgKHRoaXMubW92aW5nKSB7XG4gIC8vICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7IHg6IHRoaXMueCwgeTogdGhpcy55IH1cblxuICAvLyAgICBpZiAoKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA8PSAxKSkge1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gIC8vICAgICAgdGFyZ2V0X21vdmVtZW50ID0ge31cbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCh0YXJnZXRfbW92ZW1lbnQpXG5cbiAgLy8gICAgICAvLyBQYXRoaW5nXG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgIH1cblxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQud2lkdGggPSB0aGlzLndpZHRoXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gIC8vICAgIGlmICgodGhpcy5nby5lbnRpdGllcy5ldmVyeSgoZW50aXR5KSA9PiBlbnRpdHkuaWQgPT09IHRoaXMuaWQgfHwgIWlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGVudGl0eSkgKSkgJiZcbiAgLy8gICAgICAoIXRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpKSkge1xuICAvLyAgICAgIHRoaXMueCA9IGZ1dHVyZV9tb3ZlbWVudC54XG4gIC8vICAgICAgdGhpcy55ID0gZnV0dXJlX21vdmVtZW50LnlcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIkJsb2NrZWRcIik7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAvLyAgICB9XG4gIC8vICB9XG4gIC8vICAvLyBFTkQgLSBDaGFyYWN0ZXIgTW92ZW1lbnRcbiAgLy99XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2xpY2thYmxlKGdvLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZV9zcmMpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2xpY2thYmxlcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5uYW1lID0gaW1hZ2Vfc3JjXG4gIHRoaXMueCA9IHhcbiAgdGhpcy55ID0geVxuICB0aGlzLndpZHRoID0gd2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gIHRoaXMuYWN0aXZhdGVkID0gZmFsc2VcbiAgdGhpcy5wYWRkaW5nID0gNVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQsIHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy5wYWRkaW5nLCB0aGlzLnkgLSB0aGlzLnBhZGRpbmcsIHRoaXMud2lkdGggKyAoMip0aGlzLnBhZGRpbmcpLCB0aGlzLmhlaWdodCArICgyKnRoaXMucGFkZGluZykpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsaWNrXCIpXG4gIH1cbn1cbiIsImltcG9ydCBDbGlja2FibGUgZnJvbSBcIi4vY2xpY2thYmxlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udHJvbHMoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY29udHJvbHMgPSB0aGlzXG4gIHRoaXMud2lkdGggPSBzY3JlZW4ud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBzY3JlZW4uaGVpZ2h0ICogMC40XG4gIHRoaXMuYXJyb3dzID0ge1xuICAgIHVwOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTAsIDgwLCA4MCwgXCJhcnJvd191cC5wbmdcIiksXG4gICAgbGVmdDogbmV3IENsaWNrYWJsZShnbywgNTAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19sZWZ0LnBuZ1wiKSxcbiAgICByaWdodDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSArIDcwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfcmlnaHQucG5nXCIpLFxuICAgIGRvd246IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMjAsIDgwLCA4MCwgXCJhcnJvd19kb3duLnBuZ1wiKSxcbiAgfVxuICB0aGlzLmFycm93cy51cC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIilcbiAgdGhpcy5hcnJvd3MuZG93bi5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKVxuICB0aGlzLmFycm93cy5sZWZ0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJsZWZ0XCIpXG4gIHRoaXMuYXJyb3dzLnJpZ2h0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJyaWdodFwiKVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuYXJyb3dzKS5mb3JFYWNoKGFycm93ID0+IGFycm93LmRyYXcoKSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlXCI7XG5cbmZ1bmN0aW9uIERvb2RhZCh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgdGhpcy54ID0gMDtcbiAgdGhpcy55ID0gMDtcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMud2lkdGggPSAzMlxuICB0aGlzLmhlaWdodCA9IDMyXG4gIHRoaXMucmVzb3VyY2VfYmFyID0gbnVsbFxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh0YXJnZXRfcG9zaXRpb24pIHtcbiAgICBsZXQgeCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueCA/IHRhcmdldF9wb3NpdGlvbi54IDogdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgIGxldCB5ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi55ID8gdGFyZ2V0X3Bvc2l0aW9uLnkgOiB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgbGV0IHdpZHRoID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi53aWR0aCA/IHRhcmdldF9wb3NpdGlvbi53aWR0aCA6IHRoaXMud2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgPyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAgaWYgKHRhcmdldF9wb3NpdGlvbikgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5yZXNvdXJjZV9iYXIpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmRyYXcoKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSBmdW5jdGlvbiAoKSB7IH1cbiAgdGhpcy51cGRhdGVfZnBzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZ1ZWwgPD0gMCkge1xuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIGdvLmZpcmVzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZ1ZWwgLT0gMTtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmN1cnJlbnQgLT0gMTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9vZGFkO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRWRpdG9yKHsgZ28gfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZ28uZWRpdG9yID0gdGhpc1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3JkcyA9IHtcbiAgICAgICAgeDogdGhpcy5nby5zY3JlZW4ud2lkdGggLSAzMDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogdGhpcy5nby5zY3JlZW4uaGVpZ2h0XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCwgdGhpcy5nby5zY3JlZW4uaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5kcmF3X2NoYXJhY3Rlcih7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyKSxcbiAgICAgICAgICAgIHk6IDUwLFxuICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MFxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgICAgIGxldCB0ZXh0ID0gYHg6ICR7dGhpcy5nby5jaGFyYWN0ZXIueC50b0ZpeGVkKDIpfSwgeTogJHt0aGlzLmdvLmNoYXJhY3Rlci55LnRvRml4ZWQoMil9YFxuICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyA1MCArIDUwICsgMjApXG4gICAgICAgIGxldCBpZFRleHQgPSBgaWQ6ICR7dGhpcy5nby5jaGFyYWN0ZXIuaWQuc3Vic3RyKDAsIDgpfWBcbiAgICAgICAgdmFyIGlkVGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KGlkVGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQoaWRUZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAoaWRUZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyAxMDAgKyA1MCArIDIwKVxuXG4gICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkgdGhpcy5kcmF3X3NlbGVjdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5nby5jaGFyYWN0ZXIuY3VycmVudF90YXJnZXQpIHRoaXMuZHJhd19jdXJyZW50X3RhcmdldCgpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd19zZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmRyYXcoe1xuICAgICAgICAgICAgeDogdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMiAtIDM1LFxuICAgICAgICAgICAgeTogdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDIwMCxcbiAgICAgICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgICAgIGhlaWdodDogNzBcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IHRleHQgPSBgeDogJHt0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54LnRvRml4ZWQoMil9LCB5OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnkudG9GaXhlZCgyKX1gXG4gICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dCwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArICh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDIwMCArIDEwMClcblxuICAgICAgICBsZXQgaWRUZXh0ID0gYGlkOiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmlkLnN1YnN0cigwLCA4KX1gXG4gICAgICAgIHZhciBpZFRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChpZFRleHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGlkVGV4dCwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArICh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKGlkVGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwICsgMTUwKVxuICAgIH1cblxuICAgIHRoaXMuZHJhd19jdXJyZW50X3RhcmdldCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5lbnRpdHkuY3VycmVudF90YXJnZXQuZHJhdyh7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyIC0gMzUsXG4gICAgICAgICAgICB5OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMzAwLFxuICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgaGVpZ2h0OiA3MFxuICAgICAgICB9KVxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uZW50aXR5LmN1cnJlbnRfdGFyZ2V0LngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5lbnRpdHkuY3VycmVudF90YXJnZXQueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwICsgMTAwKVxuXG4gICAgICAgIGxldCBpZFRleHQgPSBgaWQ6ICR7dGhpcy5nby5lbnRpdHkuY3VycmVudF90YXJnZXQuaWQuc3Vic3RyKDAsIDgpfWBcbiAgICAgICAgdmFyIGlkVGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KGlkVGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQoaWRUZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAoaWRUZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyAyMDAgKyAxNTApXG4gICAgfVxufSIsIi8vIFRoZSBjYWxsYmFja3Mgc3lzdGVtXG4vLyBcbi8vIFRvIHVzZSBpdDpcbi8vXG4vLyAqIGltcG9ydCB0aGUgY2FsbGJhY2tzIHlvdSB3YW50XG4vL1xuLy8gICAgaW1wb3J0IHsgc2V0TW91c2Vtb3ZlQ2FsbGJhY2sgfSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbi8vXG4vLyAqIGNhbGwgdGhlbSBhbmQgc3RvcmUgdGhlIGFycmF5IG9mIGNhbGxiYWNrIGZ1bmN0aW9uc1xuLy9cbi8vICAgIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbyk7XG4vL1xuLy8gKiBhZGQgb3IgcmVtb3ZlIGNhbGxiYWNrcyBmcm9tIGFycmF5XG4vL1xuLy8gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKGdvLmNhbWVyYS5tb3ZlX2NhbWVyYV93aXRoX21vdXNlKVxuLy8gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKHRyYWNrX21vdXNlX3Bvc2l0aW9uKVxuXG5mdW5jdGlvbiBzZXRNb3VzZW1vdmVDYWxsYmFjayhnbykge1xuICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fbW91c2Vtb3ZlID0gKGV2KSA9PiB7XG4gICAgbW91c2Vtb3ZlX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXYpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbl9tb3VzZW1vdmUsIGZhbHNlKVxuICByZXR1cm4gbW91c2Vtb3ZlX2NhbGxiYWNrcztcbn1cblxuXG5mdW5jdGlvbiBzZXRDbGlja0NhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IFtdXG4gIGdvLmNsaWNrX2NhbGxiYWNrcyA9IGNsaWNrX2NhbGxiYWNrc1xuICBjb25zdCBvbl9jbGljayAgPSAoZXYpID0+IHtcbiAgICBjbGlja19jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fY2xpY2ssIGZhbHNlKVxuICByZXR1cm4gY2xpY2tfY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRDYWxsYmFjayhnbywgZXZlbnQpIHtcbiAgY29uc3QgY2FsbGJhY2tzID0gW11cbiAgY29uc3QgaGFuZGxlciA9IChlKSA9PiB7XG4gICAgY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhlKVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKVxuICByZXR1cm4gY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZW1vdmUnKTtcbn1cblxuZnVuY3Rpb24gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2FsbGJhY2tfcXVldWUgPSBzZXRDYWxsYmFjayhnbywgJ21vdXNlZG93bicpO1xuICBnby5tb3VzZWRvd25fY2FsbGJhY2tzID0gY2FsbGJhY2tfcXVldWVcbiAgcmV0dXJuIGNhbGxiYWNrX3F1ZXVlXG59XG5cbmZ1bmN0aW9uIHNldE1vdXNldXBDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZXVwJyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICd0b3VjaHN0YXJ0Jyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hlbmQnKTtcbn1cblxuZXhwb3J0IHtcbiAgc2V0TW91c2Vtb3ZlQ2FsbGJhY2ssXG4gIHNldENsaWNrQ2FsbGJhY2ssXG4gIHNldE1vdXNlTW92ZUNhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2ssXG4gIHNldFRvdWNoZW5kQ2FsbGJhY2ssXG59O1xuIiwiLy8gVGhlIEdhbWUgTG9vcFxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG4vLyBnYW1lX2xvb3AuZHJhdyA9IGRyYXdcbi8vIGdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IHByb2Nlc3Nfa2V5c19kb3duXG4vLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG5cbmZ1bmN0aW9uIEdhbWVMb29wKCkge1xuICB0aGlzLmRyYXcgPSBudWxsXG4gIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24gPSBudWxsXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge31cbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24oKVxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgdGhpcy5kcmF3KClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUxvb3BcbiIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4nKVxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcblxuZnVuY3Rpb24gR2FtZU9iamVjdCgpIHtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXNcbiAgdGhpcy5jYW52YXNfcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5jYW52YXNfcmVjdC53aWR0aCk7XG4gIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5jYW52YXNfcmVjdC5oZWlnaHQpO1xuICB0aGlzLmN0eCA9IGN0eFxuICB0aGlzLnRpbGVfc2l6ZSA9IDIwXG4gIHRoaXMuY2hhcmFjdGVyID0ge31cbiAgdGhpcy5jbGlja2FibGVzID0gW11cbiAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB0aGlzLnBsYXllcnMgPSBbXVxuICB0aGlzLnNwZWxscyA9IFtdIC8vIFNwZWxsIHN5c3RlbSwgY291bGQgYmUgaW5qZWN0ZWQgYnkgaXQgYXMgd2VsbFxuICB0aGlzLnNraWxscyA9IFtdO1xuICB0aGlzLnRyZWVzID0gW107XG4gIHRoaXMuZmlyZXMgPSBbXTtcbiAgdGhpcy5zdG9uZXMgPSBbXTtcbiAgdGhpcy5sb290X2JhZ3MgPSBbXTtcbiAgdGhpcy5tYW5hZ2VkX29iamVjdHMgPSBbXSAvLyBSYW5kb20gb2JqZWN0cyB0byBkcmF3L3VwZGF0ZVxuXG4gIHRoaXMuZHJhd19vYmplY3RzID0gKCkgPT4ge1xuICAgIHRoaXMuc3RvbmVzLmZvckVhY2goc3RvbmUgPT4gc3RvbmUuZHJhdygpKVxuICAgIHRoaXMudHJlZXMuZm9yRWFjaCh0cmVlID0+IHRyZWUuZHJhdygpKVxuICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiBwbGF5ZXIuZHJhdygpKVxuICAgIHRoaXMuZmlyZXMuZm9yRWFjaChmaXJlID0+IGZpcmUuZHJhdygpKVxuICAgIHRoaXMuc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwuZHJhdygpKVxuICAgIHRoaXMuc2tpbGxzLmZvckVhY2goc2tpbGwgPT4gc2tpbGwuZHJhdygpKVxuICAgIHRoaXMuY3JlZXBzLmZvckVhY2goY3JlZXAgPT4gY3JlZXAuZHJhdygpKVxuICAgIHRoaXMubG9vdF9iYWdzLmZvckVhY2gobG9vdF9iYWcgPT4gbG9vdF9iYWcuZHJhdygpKVxuICAgIHRoaXMubWFuYWdlZF9vYmplY3RzLmZvckVhY2gobW9iID0+IG1vYi5kcmF3KCkpXG4gIH1cblxuICB0aGlzLnVwZGF0ZV9vYmplY3RzID0gKCkgPT4ge1xuICAgIHRoaXMuc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwudXBkYXRlKCkpXG4gICAgdGhpcy5sb290X2JhZ3MuZm9yRWFjaChsb290X2JhZyA9PiBsb290X2JhZy51cGRhdGUoKSlcbiAgICB0aGlzLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IudXBkYXRlKCkpXG4gIH1cblxuICB0aGlzLnVwZGF0ZV9mcHNfb2JqZWN0cyA9ICgpID0+IHtcbiAgICB0aGlzLmZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLnVwZGF0ZV9mcHMoKSlcbiAgfVxuXG4gIHRoaXMuZHJhd19zZWxlY3RlZF9jbGlja2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgICB0aGlzLmN0eC5zYXZlKClcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICB0aGlzLmN0eC5zaGFkb3dDb2xvciA9IFwieWVsbG93XCJcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LCAyNTUsIDAsIDAuNylgXG4gICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKVxuICAgICAgdGhpcy5jdHguYXJjKFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoIC8gMikgLSB0aGlzLmNhbWVyYS54LFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS55ICsgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDIpIC0gdGhpcy5jYW1lcmEueSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUud2lkdGgsIDAsIDUwXG4gICAgICApXG4gICAgICB0aGlzLmN0eC5zdHJva2UoKVxuICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lT2JqZWN0IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52ZW50b3J5KHsgZ28gfSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5tYXhfc2xvdHMgPSAxMlxuICB0aGlzLnNsb3RzX3Blcl9yb3cgPSA0XG4gIHRoaXMuc2xvdHMgPSBbXVxuICB0aGlzLnNsb3RfcGFkZGluZyA9IDEwXG4gIHRoaXMuc2xvdF93aWR0aCA9IDUwXG4gIHRoaXMuc2xvdF9oZWlnaHQgPSA1MFxuICB0aGlzLmluaXRpYWxfeCA9IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF93aWR0aCkgLSA1MDtcbiAgdGhpcy5pbml0aWFsX3kgPSB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSAodGhpcy5zbG90c19wZXJfcm93ICogdGhpcy5zbG90X2hlaWdodCkgLSA0MDA7XG4gIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgdGhpcy54ID0gKCkgPT4ge1xuICAgIGNvbnN0IHJpZ2h0X3BhbmVsX3dpZHRoID0gdGhpcy5nby5lZGl0b3IuYWN0aXZlID8gdGhpcy5nby5lZGl0b3IucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIDogMDtcbiAgICByZXR1cm4gdGhpcy5nby5zY3JlZW4ud2lkdGggLSAodGhpcy5zbG90c19wZXJfcm93ICogdGhpcy5zbG90X3dpZHRoKSAtIDUwIC0gcmlnaHRfcGFuZWxfd2lkdGg7XG4gIH1cblxuICB0aGlzLmFkZCA9IChpdGVtKSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmdfYnVuZGxlID0gdGhpcy5zbG90cy5maW5kKChidW5kbGUpID0+IHtcbiAgICAgIHJldHVybiBidW5kbGUubmFtZSA9PSBpdGVtLm5hbWVcbiAgICB9KVxuXG4gICAgaWYgKCh0aGlzLnNsb3RzLmxlbmd0aCA+PSB0aGlzLm1heF9zbG90cykgJiYgKCFleGlzdGluZ19idW5kbGUpKSByZXR1cm5cblxuICAgIGNvbnNvbGUubG9nKGAqKiogR290ICR7aXRlbS5xdWFudGl0eX0gJHtpdGVtLm5hbWV9YClcbiAgICBpZiAoZXhpc3RpbmdfYnVuZGxlKSB7XG4gICAgICBleGlzdGluZ19idW5kbGUucXVhbnRpdHkgKz0gaXRlbS5xdWFudGl0eVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNsb3RzLnB1c2goaXRlbSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmZpbmQgPSAoaXRlbV9uYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBpdGVtX25hbWUudG9Mb3dlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnRvZ2dsZV9kaXNwbGF5ID0gKCkgPT4ge1xuICAgIHRoaXMuYWN0aXZlID0gIXRoaXMuYWN0aXZlO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXhfc2xvdHM7IGkrKykge1xuICAgICAgbGV0IHggPSBNYXRoLmZsb29yKGkgJSA0KVxuICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkgLyA0KTtcblxuICAgICAgaWYgKCh0aGlzLnNsb3RzW2ldICE9PSB1bmRlZmluZWQpICYmICh0aGlzLnNsb3RzW2ldICE9PSBudWxsKSkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zbG90c1tpXTtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGl0ZW0uaW1hZ2UsIHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICAgIGlmIChpdGVtLnF1YW50aXR5ID4gMSkge1xuICAgICAgICAgIGxldCB0ZXh0ID0gaXRlbS5xdWFudGl0eVxuICAgICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyNHB4IHNhbnMtc2VyaWZcIlxuICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZykgKyAodGhpcy5zbG90X3dpZHRoIC0gMTUpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSArICh0aGlzLnNsb3RfaGVpZ2h0IC0gNSkpXG4gICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSAxXG4gICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlVGV4dCh0ZXh0LCB0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpICsgKHRoaXMuc2xvdF93aWR0aCAtIDE1KSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSkgKyAodGhpcy5zbG90X2hlaWdodCAtIDUpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICB9XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDYwLCA0MCwgMClcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXRlbShuYW1lLCBpbWFnZSwgcXVhbnRpdHkgPSAxLCBzcmNfaW1hZ2UpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICBpZiAoaW1hZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gc3JjX2ltYWdlXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlXG4gIH1cbiAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG59XG4iLCJmdW5jdGlvbiBLZXlib2FyZElucHV0KGdvKSB7XG4gIGNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbiAgICAvLyBUaGVzZSBhcmUgY2FsbGJhY2tzIHRoYXQgb25seSBnZXQgY2hlY2tlZCBvbmNlIG9uIHRoZSBldmVudFxuICAgIGlmICh0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID0gW11cbiAgICB9XG4gICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhldikpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uX2tleWRvd24sIGZhbHNlKVxuICBjb25zdCBvbl9rZXl1cCA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2VcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uX2tleXVwLCBmYWxzZSlcblxuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ua2V5Ym9hcmRfaW5wdXQgPSB0aGlzXG4gIHRoaXMua2V5X2NhbGxiYWNrcyA9IHtcbiAgICBkOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXSxcbiAgICB3OiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXSxcbiAgICBhOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIildLFxuICAgIHM6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKV0sXG4gIH1cbiAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrcyA9IHtcbiAgICAxOiBbXVxuICB9XG5cbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgICBjb25zdCBrZXlzX2Rvd24gPSBPYmplY3Qua2V5cyh0aGlzLmtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAgICBrZXlzX2Rvd24uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoIShPYmplY3Qua2V5cyh0aGlzLmtleV9jYWxsYmFja3MpLmluY2x1ZGVzKGtleSkpKSByZXR1cm5cblxuICAgICAgdGhpcy5rZXlfY2FsbGJhY2tzW2tleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMua2V5bWFwID0ge1xuICAgIGQ6IFwicmlnaHRcIixcbiAgICB3OiBcInVwXCIsXG4gICAgYTogXCJsZWZ0XCIsXG4gICAgczogXCJkb3duXCIsXG4gIH1cblxuICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd24gPSB7XG4gICAgZDogZmFsc2UsXG4gICAgdzogZmFsc2UsXG4gICAgYTogZmFsc2UsXG4gICAgczogZmFsc2UsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2V5Ym9hcmRJbnB1dDtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3Qge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW0sIHF1YW50aXR5ID0gMSkge1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyLCByYW5kb20sIGRpY2UgfSBmcm9tIFwiLi90YXBldGVcIlxuaW1wb3J0IEl0ZW0gZnJvbSBcIi4vaXRlbVwiXG5pbXBvcnQgTG9vdCBmcm9tIFwiLi9sb290XCJcblxuY2xhc3MgTG9vdEJveCB7XG4gICAgY29uc3RydWN0b3IoZ28pIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIGdvLmxvb3RfYm94ID0gdGhpc1xuICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgdGhpcy54ID0gMFxuICAgICAgICB0aGlzLnkgPSAwXG4gICAgICAgIHRoaXMud2lkdGggPSAzNTBcbiAgICB9XG5cbiAgICBkcmF3KCkge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgbW92ZXMgYXdheSwgZGVsZXRlIGl0ZW1zIGFuZCBoaWRlIGxvb3QgYm94IHNjcmVlblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCB0aGlzLmdvLmNoYXJhY3RlcikgPiA1MDApIHx8XG4gICAgICAgICAgICAodGhpcy5pdGVtcy5sZW5ndGggPD0gMClcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZUpvaW4gPSAnYmV2ZWwnO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDIwMCwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXNbaW5kZXhdXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgICAgICBsb290LnggPSB0aGlzLnggKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgICAgIGxvb3QueSA9IHRoaXMueSArIChpbmRleCAqIDYwKSArIDI1IC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbG9vdC53aWR0aCA9IDM0MFxuICAgICAgICAgICAgbG9vdC5oZWlnaHQgPSA1NVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QobG9vdC54LCBsb290LnksIGxvb3Qud2lkdGgsIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGxvb3QuaXRlbS5pbWFnZSwgbG9vdC54ICsgNSwgbG9vdC55ICsgNSwgNDUsIDQ1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9ICcyMnB4IHNlcmlmJ1xuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5xdWFudGl0eSwgbG9vdC54ICsgNjUsIGxvb3QueSArIDM1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5pdGVtLm5hbWUsIGxvb3QueCArIDEwMCwgbG9vdC55ICsgMzUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlXG4gICAgICAgIHRoaXMueCA9IHRoaXMuZ28uY2hhcmFjdGVyLnhcbiAgICAgICAgdGhpcy55ID0gdGhpcy5nby5jaGFyYWN0ZXIueVxuICAgIH1cblxuICAgIHRha2VfbG9vdChsb290X2luZGV4KSB7XG4gICAgICAgIGxldCBsb290ID0gdGhpcy5pdGVtcy5zcGxpY2UobG9vdF9pbmRleCwgMSlbMF1cbiAgICAgICAgaWYgKHRoaXMubG9vdF9iYWcpIHtcbiAgICAgICAgICAgIHRoaXMubG9vdF9iYWcuaXRlbXMuc3BsaWNlKGxvb3RfaW5kZXgsIDEpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIuaW52ZW50b3J5LmFkZChsb290Lml0ZW0pXG4gICAgfVxuXG4gICAgY2hlY2tfaXRlbV9jbGlja2VkKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm5cblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgobG9vdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA+PSBsb290LngpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPD0gbG9vdC54ICsgbG9vdC53aWR0aCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA+PSBsb290LnkpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPD0gbG9vdC55ICsgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICApXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudGFrZV9sb290KGluZGV4KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcm9sbF9sb290KGxvb3RfdGFibGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGxvb3RfdGFibGUubWFwKChsb290X2VudHJ5KSA9PiB7XG4gICAgICAgICAgICBsZXQgcm9sbCA9IGRpY2UoMTAwKVxuICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKiBMb290IHJvbGwgZm9yICR7bG9vdF9lbnRyeS5pdGVtLm5hbWV9OiAke3JvbGx9IChjaGFuY2U6ICR7bG9vdF9lbnRyeS5jaGFuY2V9KWApXG4gICAgICAgICAgICBpZiAocm9sbCA8PSBsb290X2VudHJ5LmNoYW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1fYnVuZGxlID0gbmV3IEl0ZW0obG9vdF9lbnRyeS5pdGVtLm5hbWUpXG4gICAgICAgICAgICAgICAgaXRlbV9idW5kbGUuaW1hZ2Uuc3JjID0gbG9vdF9lbnRyeS5pdGVtLmltYWdlX3NyY1xuICAgICAgICAgICAgICAgIGl0ZW1fYnVuZGxlLnF1YW50aXR5ID0gcmFuZG9tKGxvb3RfZW50cnkubWluLCBsb290X2VudHJ5Lm1heClcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExvb3QoaXRlbV9idW5kbGUsIGl0ZW1fYnVuZGxlLnF1YW50aXR5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvb3RCb3giLCJmdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgdGhpcy5pZCA9IGRhdGEuaWRcbiAgdGhpcy54ID0gZGF0YS54XG4gIHRoaXMueSA9IGRhdGEueVxuICB0aGlzLndpZHRoID0gZGF0YS53aWR0aFxuICB0aGlzLmhlaWdodCA9IGRhdGEuaGVpZ2h0XG4gIHRoaXMuY29sb3VyID0gXCJ0cmFuc3BhcmVudFwiXG4gIHRoaXMuYm9yZGVyX2NvbG91ciA9IFwiYmxhY2tcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBOb2RlXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJ0aWNsZShnbykge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoeyB4LCB5IH0pIHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5hcmMoeCAtIHRoaXMuZ28uY2FtZXJhLngsIHkgLSB0aGlzLmdvLmNhbWVyYS55LCAxNSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsKCk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gJ2xpZ2h0Ymx1ZSc7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpO1xuICAgIH1cbn0iLCJpbXBvcnQgUGFydGljbGUgZnJvbSBcIi4vcGFydGljbGUuanNcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2plY3RpbGUoeyBnbywgc3ViamVjdCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMucGFydGljbGUgPSBuZXcgUGFydGljbGUoZ28pO1xuICAgIHRoaXMuc3RhcnRfcG9zaXRpb24gPSBudWxsXG4gICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuZW5kX3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3RcbiAgICB0aGlzLnRyYWNlX2NvdW50ID0gN1xuICAgIHRoaXMuYm91bmRzID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLmN1cnJlbnRfcG9zaXRpb24sIHdpZHRoOiA1LCBoZWlnaHQ6IDUgfVxuICAgIH1cbiAgICB0aGlzLnRyYWNlID0gW107XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIHRoaXMuYWN0ID0gKHsgc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRfcG9zaXRpb24gPSBzdGFydF9wb3NpdGlvblxuICAgICAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSBPYmplY3QuY3JlYXRlKHRoaXMuc3RhcnRfcG9zaXRpb24pXG4gICAgICAgIHRoaXMuZW5kX3Bvc2l0aW9uID0gZW5kX3Bvc2l0aW9uXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIGlmIChWZWN0b3IyLmRpc3RhbmNlKHRoaXMuZW5kX3Bvc2l0aW9uLCB0aGlzLmN1cnJlbnRfcG9zaXRpb24pIDwgNSkge1xuICAgICAgICAgICAgdGhpcy5zdWJqZWN0LmVuZCgpO1xuICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlX3Bvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMudHJhY2UucHVzaChPYmplY3QuY3JlYXRlKHRoaXMuY3VycmVudF9wb3NpdGlvbikpXG4gICAgICAgIHRoaXMudHJhY2UgPSB0aGlzLnRyYWNlLnNsaWNlKC0xICogdGhpcy50cmFjZV9jb3VudClcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLnBhcnRpY2xlLmRyYXcodGhpcy5jdXJyZW50X3Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy50cmFjZS5mb3JFYWNoKHRyYWNlZF9wb3NpdGlvbiA9PiB0aGlzLnBhcnRpY2xlLmRyYXcodHJhY2VkX3Bvc2l0aW9uKSlcbiAgICB9XG5cbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGN1bGF0ZV9wb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgYW5nbGUgPSBWZWN0b3IyLmFuZ2xlKHRoaXMuY3VycmVudF9wb3NpdGlvbiwgdGhpcy5lbmRfcG9zaXRpb24pO1xuICAgICAgICBjb25zdCBzcGVlZCA9IHJhbmRvbSgzLCAxMik7XG4gICAgICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuY3VycmVudF9wb3NpdGlvbi54ICsgc3BlZWQgKiBNYXRoLmNvcyhhbmdsZSksXG4gICAgICAgICAgICB5OiB0aGlzLmN1cnJlbnRfcG9zaXRpb24ueSArIHNwZWVkICogTWF0aC5zaW4oYW5nbGUpXG4gICAgICAgIH1cbiAgICB9XG59IiwiZnVuY3Rpb24gUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0LCB5X29mZnNldCA9IDEwLCBjb2xvdXIgPSBcInJlZFwiLCBib3JkZXIsIGZpeGVkIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy50YXJnZXQud2lkdGggLyAxMDtcbiAgdGhpcy5jb2xvdXIgPSBjb2xvdXJcbiAgdGhpcy5mdWxsID0gMTAwXG4gIHRoaXMuY3VycmVudCA9IDEwMFxuICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgdGhpcy5ib3JkZXIgPSBib3JkZXJcbiAgdGhpcy5maXhlZCA9IGZpeGVkIHx8IGZhbHNlXG4gIHRoaXMueCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5maXhlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Lng7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC54IC0gdGhpcy5nby5jYW1lcmEueDtcbiAgICB9XG4gIH1cbiAgdGhpcy55ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmZpeGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQueTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnkgLSB0aGlzLmdvLmNhbWVyYS55O1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50LCBkZWJ1ZyA9IGZhbHNlKSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoKE1hdGgubWluKGN1cnJlbnQsIGZ1bGwpKSAvIGZ1bGwpICogdGhpcy50YXJnZXQud2lkdGgpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmJvcmRlciB8fCBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngoKSwgdGhpcy55KCkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCksIHRoaXMueSgpIC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCksIHRoaXMueSgpIC0gdGhpcy55X29mZnNldCwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUJhclxuIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMud2lkdGggID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodDtcbiAgdGhpcy5yYWRpdXMgPSA3MDBcblxuICB0aGlzLmNsZWFyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmNhbnZhcy53aWR0aCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5nby5jYW52YXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nby5jYW52YXNfcmVjdCA9IHRoaXMuZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5jbGVhcigpXG4gICAgdGhpcy5nby53b3JsZC5kcmF3KClcbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIHRoaXMuZHJhd19mb2cgPSAocmFkaXVzKSA9PiB7XG4gICAgdmFyIHggPSB0aGlzLmdvLmNoYXJhY3Rlci54ICsgdGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyIC0gdGhpcy5nby5jYW1lcmEueFxuICAgIHZhciB5ID0gdGhpcy5nby5jaGFyYWN0ZXIueSArIHRoaXMuZ28uY2hhcmFjdGVyLmhlaWdodCAvIDIgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgdmFyIGdyYWRpZW50ID0gdGhpcy5nby5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgcmFkaXVzIHx8IHRoaXMucmFkaXVzKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMCwgMCwgMCwgMCknKVxuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLCAwLCAwLCAxKScpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnRcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NyZWVuXG4iLCJpbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3RlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZXJ2ZXIoZ28sIHBsYXllcikge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXJcbiAgdGhpcy5nby5jaGFyYWN0ZXIgPSBwbGF5ZXJcbiAgZ28uc2VydmVyID0gdGhpc1xuXG4gIHRoaXMuY29ubiA9IHVuZGVmaW5lZDtcbiAgdGhpcy5jb25uZWN0ID0gKCkgPT4ge1xuICAgIHRoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDozMDEwXCIpO1xuICAgIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLmxvZ2luKHRoaXMuZ28uY2hhcmFjdGVyKVxuICAgIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBwYXlsb2FkID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuICAgICAgY29uc29sZS5sb2cocGF5bG9hZClcbiAgICAgIHN3aXRjaCAocGF5bG9hZC50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJsb2dpblwiLCBcImZpcnN0TG9hZFwiOlxuICAgICAgICAgIGZpcnN0X2xvYWQocGF5bG9hZClcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1vdmVMb2FkXCI6XG4gICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5nby5wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBheWxvYWQucGxheWVyLmlkID09PSBwbGF5ZXIuaWQpXG4gICAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIG5vdCBmb3VuZFwiKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT09IHRoaXMuZ28uY2hhcmFjdGVyLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklnbm9yaW5nIG1vdmVMb2FkIGZvciBzZWxmXCIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBQbGF5ZXIgZm91bmQ6ICR7cGxheWVyLm5hbWV9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgcGxheWVyLnggPSBwYXlsb2FkLnRhcmdldC54XG4gICAgICAgICAgcGxheWVyLnkgPSBwYXlsb2FkLnRhcmdldC55XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdQbGF5ZXJMb2FkXCI6XG4gICAgICAgICAgY29uc3QgbmV3X3BsYXllciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICAgICAgbmV3X3BsYXllci5pZCA9IHBheWxvYWQucGxheWVyLmlkXG4gICAgICAgICAgbmV3X3BsYXllci54ID0gcGF5bG9hZC5wbGF5ZXIucG9zaXRpb24ueFxuICAgICAgICAgIG5ld19wbGF5ZXIueSA9IHBheWxvYWQucGxheWVyLnBvc2l0aW9uLnlcbiAgICAgICAgICBnby5wbGF5ZXJzLnB1c2gobmV3X3BsYXllcilcbiAgICAgICAgICBnby5jbGlja2FibGVzLnB1c2gobmV3X3BsYXllcilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRhbWFnZUxvYWRcIjpcbiAgICAgICAgICBsZXQgZGFtYWdlZF9wbGF5ZXIgPSB0aGlzLmdvLnBsYXllcnMuZmluZChwbGF5ZXIgPT4gcGF5bG9hZC5wbGF5ZXIuaWQgPT09IHBsYXllci5pZClcbiAgICAgICAgICBpZiAoIWRhbWFnZWRfcGxheWVyICYmIChwYXlsb2FkLnBsYXllci5pZCA9PT0gdGhpcy5nby5jaGFyYWN0ZXIuaWQpKSB7XG4gICAgICAgICAgICBkYW1hZ2VkX3BsYXllciA9IHRoaXMuZ28uY2hhcmFjdGVyXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZGFtYWdlZF9wbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIG5vdCBmb3VuZFwiKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGRhbWFnZWRfcGxheWVyLnN0YXRzLmN1cnJlbnRfaHAgLT0gcGF5bG9hZC5kYW1hZ2VcbiAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgXCJzcGVsbGNhc3RpbmdTdGFydGVkTG9hZFwiOlxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FzdGluZyBzcGVsbFwiKVxuICAgICAgICAgIGNvbnN0IGNhc3RpbmdfcGxheWVyID0gdGhpcy5nby5wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBheWxvYWQuY2FzdGVyLmlkID09PSBwbGF5ZXIuaWQpXG4gICAgICAgICAgaWYgKCFjYXN0aW5nX3BsYXllcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5ZXIgbm90IGZvdW5kIG9yIGlzIG15c2VsZlwiKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGFsbF9wbGF5ZXJzID0gWy4uLnRoaXMuZ28ucGxheWVycywgdGhpcy5nby5jaGFyYWN0ZXJdXG4gICAgICAgICAgY29uc3QgdGFyZ2V0X3BsYXllciA9IGFsbF9wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBheWxvYWQudGFyZ2V0LmlkID09PSBwbGF5ZXIuaWQpXG4gICAgICAgICAgY2FzdGluZ19wbGF5ZXIuY3VycmVudF90YXJnZXQgPSB0YXJnZXRfcGxheWVyXG4gICAgICAgICAgY2FzdGluZ19wbGF5ZXIuc3BlbGxzW1wiZnJvc3Rib2x0XCJdKGZhbHNlKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJwaW5nXCI6XG4gICAgICAgIC8vZ28uY3R4LmZpbGxSZWN0KHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueCwgcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55LCA1MCwgNTApXG4gICAgICAgIC8vZ28uY3R4LnN0cm9rZSgpXG4gICAgICAgIC8vbGV0IHBsYXllciA9IHBsYXllcnNbMF0gLy9wbGF5ZXJzLmZpbmQocGxheWVyID0+IHBsYXllci5uYW1lID09PSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWUpXG4gICAgICAgIC8vaWYgKHBsYXllcikge1xuICAgICAgICAvLyAgcGxheWVyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbiAgICAgICAgLy8gIHBsYXllci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4gICAgICAgIC8vfVxuICAgICAgICAvL2JyZWFrO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKVxuICB9XG5cbiAgZnVuY3Rpb24gZmlyc3RfbG9hZChwYXlsb2FkLCBwbGF5ZXIpIHtcbiAgICBnby5jaGFyYWN0ZXIuaWQgPSBwYXlsb2FkLmN1cnJlbnRQbGF5ZXIuaWRcbiAgICBnby5jaGFyYWN0ZXIubmFtZSA9IHBheWxvYWQuY3VycmVudFBsYXllci5uYW1lXG4gICAgZ28uY2hhcmFjdGVyLnggPSBwYXlsb2FkLmN1cnJlbnRQbGF5ZXIucG9zaXRpb24ueFxuICAgIGdvLmNoYXJhY3Rlci55ID0gcGF5bG9hZC5jdXJyZW50UGxheWVyLnBvc2l0aW9uLnlcbiAgICBwYXlsb2FkLm90aGVyUGxheWVycy5mb3JFYWNoKChvdGhlclBsYXllclBheWxvYWQpID0+IHtcbiAgICAgIGxldCBvdGhlclBsYXllciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICBvdGhlclBsYXllci5pZCA9IG90aGVyUGxheWVyUGF5bG9hZC5pZFxuICAgICAgb3RoZXJQbGF5ZXIueCA9IG90aGVyUGxheWVyUGF5bG9hZC5wb3NpdGlvbi54XG4gICAgICBvdGhlclBsYXllci55ID0gb3RoZXJQbGF5ZXJQYXlsb2FkLnBvc2l0aW9uLnlcbiAgICAgIGdvLnBsYXllcnMucHVzaChvdGhlclBsYXllcilcbiAgICAgIGdvLmNsaWNrYWJsZXMucHVzaChvdGhlclBsYXllcilcbiAgICB9KVxuICAgIGdvLmNhbWVyYS5mb2N1cyhnby5jaGFyYWN0ZXIpXG4gIH1cblxuICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNoYXJhY3Rlcikge1xuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4gICAgICBhcmdzOiB7XG4gICAgICAgIHBsYXllcjoge1xuICAgICAgICAgIGlkOiBjaGFyYWN0ZXIuaWQsXG4gICAgICAgICAgbmFtZTogY2hhcmFjdGVyLm5hbWUsXG4gICAgICAgIH0sXG4gICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgfVxuXG4gIHRoaXMucGluZyA9IGZ1bmN0aW9uIChjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNraWxsKHsgZ28sIGVudGl0eSwgc2tpbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5za2lsbCA9IHNraWxsXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5za2lsbC5hY3QoKVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmVtb3ZlX2NsaWNrYWJsZSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJyZWFrX3N0b25lKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHkgfHwgZ28uY2hhcmFjdGVyXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogdGhpcy5lbnRpdHkgfSlcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXRlZF9zdG9uZSA9IHRoaXMuZ28uc3RvbmVzLmZpbmQoKHN0b25lKSA9PiBzdG9uZSA9PT0gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpXG4gICAgICAgIGlmICgoIXRhcmdldGVkX3N0b25lKSB8fCAoVmVjdG9yMi5kaXN0YW5jZSh0YXJnZXRlZF9zdG9uZSwgdGhpcy5lbnRpdHkpID4gMTAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nby5zdG9uZXMuaW5kZXhPZih0YXJnZXRlZF9zdG9uZSlcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KGxvb3RfdGFibGVfc3RvbmUpXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZ28uc3RvbmVzKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9jbGlja2FibGUodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZ28pXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCBsb290X3RhYmxlX3N0b25lID0gW3tcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIkZsaW50c3RvbmVcIiwgaW1hZ2Vfc3JjOiBcImZsaW50c3RvbmUucG5nXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDEsXG4gICAgICAgIGNoYW5jZTogMTAwXG4gICAgfV1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgcmVtb3ZlX2NsaWNrYWJsZSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDdXRUcmVlKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmxvb3RfYm94ID0gZ28ubG9vdF9ib3hcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiBlbnRpdHkgfSlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlOyAvLyBNYXliZSBHYW1lT2JqZWN0IHNob3VsZCBjb250cm9sIHRoaXMgdG9nZ2xlXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfdHJlZSA9IHRoaXMuZ28udHJlZXMuZmluZCgodHJlZSkgPT4gdHJlZSA9PT0gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpXG4gICAgICAgIGlmICgoIXRhcmdldGVkX3RyZWUpIHx8IChWZWN0b3IyLmRpc3RhbmNlKHRhcmdldGVkX3RyZWUsIHRoaXMuZ28uY2hhcmFjdGVyKSA+IDIwMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgzMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ28udHJlZXMuaW5kZXhPZih0YXJnZXRlZF90cmVlKVxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBsb290Ym94ZXMgaGF2ZSB0byBtb3ZlIGZyb20gd2VpcmRcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QodGhpcy5sb290X3RhYmxlKVxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRhcmdldGVkX3RyZWUsIHRoaXMuZ28udHJlZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3RyZWUsIHRoaXMuZ28pXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubG9vdF90YWJsZSA9IFt7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJXb29kXCIsIGltYWdlX3NyYzogXCJicmFuY2gucG5nXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDMsXG4gICAgICAgIGNoYW5jZTogOTVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJEcnkgTGVhdmVzXCIsIGltYWdlX3NyYzogXCJsZWF2ZXMuanBlZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAzLFxuICAgICAgICBjaGFuY2U6IDEwMFxuICAgICAgfV1cbiAgICAgIFxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIjtcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuLi9yZXNvdXJjZV9iYXJcIjtcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWFrZUZpcmUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHkgfHwgZ28uY2hhcmFjdGVyXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogdGhpcy5lbnRpdHkgfSlcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgZHJ5X2xlYXZlcyA9IHRoaXMuZW50aXR5LmludmVudG9yeS5maW5kKFwiZHJ5IGxlYXZlc1wiKVxuICAgICAgICBsZXQgd29vZCA9IHRoaXMuZW50aXR5LmludmVudG9yeS5maW5kKFwid29vZFwiKVxuICAgICAgICBsZXQgZmxpbnRzdG9uZSA9IHRoaXMuZW50aXR5LmludmVudG9yeS5maW5kKFwiZmxpbnRzdG9uZVwiKVxuICAgICAgICBpZiAoZHJ5X2xlYXZlcyAmJiBkcnlfbGVhdmVzLnF1YW50aXR5ID4gMCAmJlxuICAgICAgICAgICAgd29vZCAmJiB3b29kLnF1YW50aXR5ID4gMCAmJlxuICAgICAgICAgICAgZmxpbnRzdG9uZSAmJiBmbGludHN0b25lLnF1YW50aXR5ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgxNTAwKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBkcnlfbGVhdmVzLnF1YW50aXR5IC09IDFcbiAgICAgICAgICAgICAgICB3b29kLnF1YW50aXR5IC09IDFcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUudHlwZSA9PT0gXCJCT05GSVJFXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpcmUgPSB0aGlzLmdvLmZpcmVzLmZpbmQoKGZpcmUpID0+IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBmaXJlKTtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5mdWVsICs9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ICs9IDIwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJlID0gbmV3IERvb2RhZCh7IGdvIH0pXG4gICAgICAgICAgICAgICAgICAgIGZpcmUudHlwZSA9IFwiQk9ORklSRVwiXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2Uuc3JjID0gXCJib25maXJlLnBuZ1wiXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfeF9vZmZzZXQgPSAyNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV95X29mZnNldCA9IDI1MFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX2hlaWdodCA9IDM1MFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3dpZHRoID0gMzAwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUud2lkdGggPSA2NFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmhlaWdodCA9IDY0XG4gICAgICAgICAgICAgICAgICAgIGZpcmUueCA9IHRoaXMuZW50aXR5Lng7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUueSA9IHRoaXMuZW50aXR5Lnk7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuZnVlbCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvOiB0aGlzLmdvLCB0YXJnZXQ6IGZpcmUgfSlcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuc3RhdGljID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5mdWxsID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nby5maXJlcy5wdXNoKGZpcmUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uY2xpY2thYmxlcy5wdXNoKGZpcmUpXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxNTAwKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJZb3UgZG9udCBoYXZlIGFsbCByZXF1aXJlZCBtYXRlcmlhbHMgdG8gbWFrZSBhIGZpcmUuXCIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxpbmsoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmlkID0gXCJzcGVsbF9ibGlua1wiXG4gICAgdGhpcy5pY29uID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5pY29uLnNyYyA9IFwiYmxpbmtfc3BlbGwuanBnXCJcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm1hbmFfY29zdCA9IDdcbiAgICB0aGlzLmNhc3RpbmdfdGltZV9pbl9tcyA9IDBcbiAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IG51bGxcbiAgICB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXMgPSA3MDAwXG4gICAgdGhpcy5vbl9jb29sZG93biA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdF9jYXN0X2F0ICYmIERhdGUubm93KCkgLSB0aGlzLmxhc3RfY2FzdF9hdCA8IHRoaXMuY29vbGRvd25fdGltZV9pbl9tc1xuICAgIH1cblxuICAgIHRoaXMuaXNfdmFsaWQgPSAoKSA9PiAhdGhpcy5vbl9jb29sZG93bigpXG4gICAgXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm5cblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdwdXJwbGUnXG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyh0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnkgLSB0aGlzLmdvLmNhbWVyYS55LCA1MCwgMCwgTWF0aC5QSSAqIDIpXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7IH1cblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjbGlja19jYWxsYmFjaywgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgICAgICAgICB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MucHVzaChjbGlja19jYWxsYmFjaylcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbnRpdHkuY3VycmVudF9tYW5hIC09IHRoaXMubWFuYV9jb3N0XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscylcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KGNsaWNrX2NhbGxiYWNrLCB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MpXG4gICAgICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmdvLmNhbWVyYS5mb2N1cyh0aGlzLmVudGl0eSlcbiAgICB9XG5cbiAgICBjb25zdCBjbGlja19jYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRpdHkueCA9IHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5lbnRpdHkueSA9IHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICB9XG59IiwiaW1wb3J0IFByb2plY3RpbGUgZnJvbSBcIi4uL3Byb2plY3RpbGVcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGcm9zdGJvbHQoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmlkID0gXCJzcGVsbF9mcm9zdGJvbHRcIlxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5pY29uID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmljb24uc3JjID0gXCJodHRwczovL2NkbmEuYXJ0c3RhdGlvbi5jb20vcC9hc3NldHMvaW1hZ2VzL2ltYWdlcy8wMDkvMDMxLzE5MC9sYXJnZS9yaWNoYXJkLXRob21hcy1wYWludHMtMTEtdjIuanBnXCJcbiAgICB0aGlzLnByb2plY3RpbGUgPSBuZXcgUHJvamVjdGlsZSh7IGdvLCBzdWJqZWN0OiB0aGlzIH0pXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubWFuYV9jb3N0ID0gMTVcbiAgICB0aGlzLmNhc3RpbmdfdGltZV9pbl9tcyA9IDE1MDBcbiAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IG51bGxcbiAgICB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXMgPSAxMDBcbiAgICB0aGlzLm9uX2Nvb2xkb3duID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0X2Nhc3RfYXQgJiYgRGF0ZS5ub3coKSAtIHRoaXMubGFzdF9jYXN0X2F0IDwgdGhpcy5jb29sZG93bl90aW1lX2luX21zXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5kcmF3KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3Nsb3QgPSAoc2xvdCkgPT4ge1xuICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHgsIHksIHRoaXMuZ28uYWN0aW9uX2Jhci5zbG90X3dpZHRoLCB0aGlzLmdvLmFjdGlvbl9iYXIuc2xvdF9oZWlnaHQpXG4gICAgICAgIFxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm5cblxuICAgICAgICBpZiAoKGlzX2NvbGxpZGluZyh0aGlzLnByb2plY3RpbGUuYm91bmRzKCksIHRoaXMuZW50aXR5LnNwZWxsX3RhcmdldCgpKSkpIHtcbiAgICAgICAgICAgIGlmIChkYW1hZ2VhYmxlKHRoaXMuZW50aXR5LnNwZWxsX3RhcmdldCgpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhbWFnZSA9IHJhbmRvbSg1LCAxMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkuc3RhdHMudGFrZV9kYW1hZ2UoeyBkYW1hZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aWxlLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzX3ZhbGlkID0gKCkgPT4gIXRoaXMub25fY29vbGRvd24oKSAmJiAodGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkgJiYgdGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkuc3RhdHMpXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgIGlmICgodGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkgPT09IG51bGwpIHx8ICh0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKSA9PT0gdW5kZWZpbmVkKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHN0YXJ0X3Bvc2l0aW9uID0geyB4OiB0aGlzLmVudGl0eS54ICsgNTAsIHk6IHRoaXMuZW50aXR5LnkgKyA1MCB9XG4gICAgICAgIGNvbnN0IGVuZF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LnNwZWxsX3RhcmdldCgpLnggKyB0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKS53aWR0aCAvIDIsXG4gICAgICAgICAgICB5OiB0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKS55ICsgdGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkuaGVpZ2h0IC8gMlxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5hY3QoeyBzdGFydF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uIH0pXG5cbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgICAgIHRoaXMuZ28uc3BlbGxzLnB1c2godGhpcylcbiAgICB9XG5cbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc3BlbGxzKTtcbiAgICAgICAgdGhpcy5sYXN0X2Nhc3RfYXQgPSBEYXRlLm5vdygpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGFtYWdlYWJsZShvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5zdGF0cyAhPT0gdW5kZWZpbmVkICYmIG9iamVjdC5zdGF0cy50YWtlX2RhbWFnZSAhPT0gdW5kZWZpbmVkXG4gICAgfVxufSIsImltcG9ydCB7IGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YXJ0TWVudSh7IGdvIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmdvLnN0YXJ0X21lbnUgPSB0aGlzXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5idXR0b25fd2lkdGggPSAzMDBcbiAgICB0aGlzLmJ1dHRvbl9oZWlnaHQgPSA1MFxuXG4gICAgdGhpcy5jaGVja19idXR0b25fY2xpY2tlZCA9IChldikgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGNsaWNrID0geyB4OiBldi5jbGllbnRYLCB5OiBldi5jbGllbnRZLCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhjbGljaywgYnV0dG9uKSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5wZXJmb3JtKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5nby5jbGlja19jYWxsYmFja3MucHVzaCh0aGlzLmNoZWNrX2J1dHRvbl9jbGlja2VkKVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5zY3JlZW4uZHJhd19mb2coMCk7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMztcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2dyYXknO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh4LCB5LCB4LCB5KTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBcIk51YmFyaWFcIlxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZic7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgeCAvIDQsIHkgKyA3MClcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gdGhpcy5idXR0b25zW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IHhfb2Zmc2V0ID0geCArIHggLyAyO1xuICAgICAgICAgICAgY29uc3QgeV9vZmZzZXQgPSB5ICsgeSAvIDMgKyBpbmRleCAqIDUwICsgaW5kZXggKiAxMDtcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IGJ1dHRvbi5pc19ob3ZlcmVkID8gXCJyZ2JhKDksIDEwMCwgODAsIDEpXCIgOiBcInJnYmEoNywgMSwgMywgMSlcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QoeF9vZmZzZXQgLSB0aGlzLmJ1dHRvbl93aWR0aCAvIDIsIHlfb2Zmc2V0LCB0aGlzLmJ1dHRvbl93aWR0aCwgdGhpcy5idXR0b25faGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2luZGV4XS54ID0geF9vZmZzZXQgLSB0aGlzLmJ1dHRvbl93aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaW5kZXhdLnkgPSB5X29mZnNldDtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpbmRleF0ud2lkdGggPSB0aGlzLmJ1dHRvbl93aWR0aFxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2luZGV4XS5oZWlnaHQgPSB0aGlzLmJ1dHRvbl9oZWlnaHRcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KGJ1dHRvbi50ZXh0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQoYnV0dG9uLnRleHQsIHhfb2Zmc2V0IC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgeV9vZmZzZXQgKyAodGhpcy5idXR0b25faGVpZ2h0IC8gMikgKyB0aGlzLmFwcHJveGltYXRlX2xpbmVfaGVpZ2h0IC8gMilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmJ1dHRvbnMuZmluZCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKHRoaXMuZ28ubW91c2VfcG9zaXRpb24sIGJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uaXNfaG92ZXJlZCA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmlzX2hvdmVyZWQgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExMzQ1ODYvaG93LWNhbi15b3UtZmluZC10aGUtaGVpZ2h0LW9mLXRleHQtb24tYW4taHRtbC1jYW52YXNcbiAgICB0aGlzLmFwcHJveGltYXRlX2xpbmVfaGVpZ2h0ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQoJ00nKS53aWR0aDtcblxuICAgIHRoaXMuYnV0dG9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcIm5ld19nYW1lXCIsXG4gICAgICAgICAgICB0ZXh0OiBcIm5ld1wiLFxuICAgICAgICAgICAgcGVyZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3X2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgICAgICB0aGlzLm1lbnUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51LmdvLnNlcnZlci5jb25uZWN0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcImxvYWRfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJsb2FkXCIsXG4gICAgICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkX2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcInNhdmVfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJzYXZlXCIsXG4gICAgICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlX2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcImV4aXRfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJleGl0XCIsXG4gICAgICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJleGl0X2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJjb25zdCBkaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBNYXRoLmFicyhNYXRoLmZsb29yKGEpIC0gTWF0aC5mbG9vcihiKSk7XG59XG5cbmNvbnN0IFZlY3RvcjIgPSB7XG4gIGRpc3RhbmNlOiAoYSwgYikgPT4gTWF0aC50cnVuYyhNYXRoLnNxcnQoTWF0aC5wb3coYi54IC0gYS54LCAyKSArIE1hdGgucG93KGIueSAtIGEueSwgMikpKSxcbiAgYW5nbGU6IChjdXJyZW50X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24pID0+IE1hdGguYXRhbjIoZW5kX3Bvc2l0aW9uLnkgLSBjdXJyZW50X3Bvc2l0aW9uLnksIGVuZF9wb3NpdGlvbi54IC0gY3VycmVudF9wb3NpdGlvbi54KVxufVxuXG5jb25zdCBpc19jb2xsaWRpbmcgPSBmdW5jdGlvbihzZWxmLCB0YXJnZXQpIHtcbiAgY29uc3Qgc2VsZl9wb3NpdGlvbiA9IHsgd2lkaHQ6IDEsIGhlaWdodDogMSwgLi4uc2VsZiB9XG4gIGNvbnN0IHRhcmdldF9wb3NpdGlvbiA9IHsgd2lkaHQ6IDEsIGhlaWdodDogMSwgLi4udGFyZ2V0IH1cbiAgaWYgKFxuICAgIChzZWxmX3Bvc2l0aW9uLnggPCB0YXJnZXRfcG9zaXRpb24ueCArIHRhcmdldF9wb3NpdGlvbi53aWR0aCkgJiZcbiAgICAoc2VsZl9wb3NpdGlvbi54ICsgc2VsZl9wb3NpdGlvbi53aWR0aCA+IHRhcmdldF9wb3NpdGlvbi54KSAmJlxuICAgIChzZWxmX3Bvc2l0aW9uLnkgPCB0YXJnZXRfcG9zaXRpb24ueSArIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQpICYmXG4gICAgKHNlbGZfcG9zaXRpb24ueSArIHNlbGZfcG9zaXRpb24uaGVpZ2h0ID4gdGFyZ2V0X3Bvc2l0aW9uLnkpXG4gICkge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSBmdW5jdGlvbiAoeCA9IDEwLCB5ID0gMTAsIHcgPSAyMCwgaCA9IDIwLCBjb2xvciA9IFwicmdiKDE5MCwgMjAsIDEwKVwiKSB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xufVxuXG5jb25zdCByYW5kb20gPSAoc3RhcnQsIGVuZCkgPT4ge1xuICBpZiAoZW5kID09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHN0YXJ0XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgcmV0dXJuIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGVuZCkgKyBzdGFydCAgXG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChvYmplY3QsIGxpc3QpIHtcbiAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2Yob2JqZWN0KTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICByZXR1cm4gbGlzdC5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlX2NsaWNrYWJsZShkb29kYWQsIGdvKSB7XG4gIGNvbnN0IGNsaWNrYWJsZV9pbmRleCA9IGdvLmNsaWNrYWJsZXMuaW5kZXhPZihkb29kYWQpXG4gIGlmIChjbGlja2FibGVfaW5kZXggPiAtMSkge1xuICAgIGdvLmNsaWNrYWJsZXMuc3BsaWNlKGNsaWNrYWJsZV9pbmRleCwgMSlcbiAgfVxuICBpZiAoZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBkb29kYWQpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIH1cbn1cblxuY29uc3QgZGljZSA9IChzaWRlcywgdGltZXMgPSAxKSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKEFycmF5KHRpbWVzKSkubWFwKChpKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcykgKyAxKTtcbn1cblxuZXhwb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgZHJhd19zcXVhcmUsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBkaWNlLCByZW1vdmVfY2xpY2thYmxlIH1cbiIsImNsYXNzIFRpbGUge1xuICAgIGNvbnN0cnVjdG9yKGltYWdlX3NyYywgeF9vZmZzZXQgPSAwLCB5X29mZnNldCA9IDAsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gICAgICAgIHRoaXMueF9vZmZzZXQgPSB4X29mZnNldFxuICAgICAgICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaWxlIiwiaW1wb3J0IFRpbGUgZnJvbSBcIi4vdGlsZVwiXG5cbi8vIFRoZSBXb3JsZCBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBpdHNlbGYuXG5mdW5jdGlvbiBXb3JsZChnbykge1xuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ud29ybGQgPSB0aGlzO1xuICB0aGlzLndpZHRoID0gMTAwMDA7XG4gIHRoaXMuaGVpZ2h0ID0gMTAwMDA7XG4gIHRoaXMueF9vZmZzZXQgPSAwO1xuICB0aGlzLnlfb2Zmc2V0ID0gMDtcbiAgdGhpcy50aWxlX3NldCA9IHtcbiAgICBncmFzczogbmV3IFRpbGUoXCJncmFzcy5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBkaXJ0OiBuZXcgVGlsZShcImRpcnQyLnBuZ1wiLCAwLCAwLCA2NCwgNjMpLFxuICAgIHN0b25lOiBuZXcgVGlsZShcImZsaW50c3RvbmUucG5nXCIsIDAsIDAsIDg0MCwgODU5KSxcbiAgfVxuICB0aGlzLnBpY2tfcmFuZG9tX3RpbGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMudGlsZV9zZXQuZ3Jhc3NcbiAgfVxuICB0aGlzLnRpbGVfd2lkdGggPSA2NFxuICB0aGlzLnRpbGVfaGVpZ2h0ID0gNjRcbiAgdGhpcy50aWxlc19wZXJfcm93ID0gTWF0aC50cnVuYyh0aGlzLndpZHRoIC8gdGhpcy50aWxlX3dpZHRoKSArIDE7XG4gIHRoaXMudGlsZXNfcGVyX2NvbHVtbiA9IE1hdGgudHJ1bmModGhpcy5oZWlnaHQgLyB0aGlzLnRpbGVfaGVpZ2h0KSArIDE7XG4gIHRoaXMudGlsZXMgPSBudWxsO1xuICB0aGlzLmdlbmVyYXRlX21hcCA9ICgpID0+IHtcbiAgICB0aGlzLnRpbGVzID0gbmV3IEFycmF5KHRoaXMudGlsZXNfcGVyX3Jvdyk7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW3Jvd10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMudGlsZXNbcm93XSA9IFt0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10ucHVzaCh0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGxldCB0aWxlID0gdGhpcy50aWxlc1tyb3ddW2NvbHVtbl1cbiAgICAgICAgaWYgKHRpbGUgIT09IHRoaXMudGlsZV9zZXQuZ3Jhc3MpIHtcbiAgICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy50aWxlX3NldC5ncmFzcy5pbWFnZSxcbiAgICAgICAgICAgIHRoaXMudGlsZV9zZXQuZ3Jhc3MueF9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3MueV9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3Mud2lkdGgsIHRoaXMudGlsZV9zZXQuZ3Jhc3MuaGVpZ2h0LFxuICAgICAgICAgICAgdGhpcy54X29mZnNldCArIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCxcbiAgICAgICAgICAgIHRoaXMueV9vZmZzZXQgKyAoY29sdW1uICogdGhpcy50aWxlX2hlaWdodCkgLSB0aGlzLmdvLmNhbWVyYS55LCA2NCwgNjMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRpbGUuaW1hZ2UsXG4gICAgICAgICAgdGlsZS54X29mZnNldCwgdGlsZS55X29mZnNldCwgdGlsZS53aWR0aCwgdGlsZS5oZWlnaHQsXG4gICAgICAgICAgdGhpcy54X29mZnNldCArIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCxcbiAgICAgICAgICB0aGlzLnlfb2Zmc2V0ICsgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjUsIDY1KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXb3JsZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEtleWJvYXJkSW5wdXQgZnJvbSBcIi4va2V5Ym9hcmRfaW5wdXQuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQge1xuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbmltcG9ydCBHYW1lTG9vcCBmcm9tIFwiLi9nYW1lX2xvb3AuanNcIlxuaW1wb3J0IFdvcmxkIGZyb20gXCIuL3dvcmxkLmpzXCJcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4vZG9vZGFkLmpzXCJcbmltcG9ydCBDb250cm9scyBmcm9tIFwiLi9jb250cm9scy5qc1wiXG5pbXBvcnQgU2VydmVyIGZyb20gXCIuL3NlcnZlclwiXG5pbXBvcnQgTG9vdEJveCBmcm9tIFwiLi9sb290X2JveC5qc1wiXG5pbXBvcnQgQ3JlZXAgZnJvbSBcIi4vYmVpbmdzL2NyZWVwLmpzXCJcbmltcG9ydCBBY3Rpb25CYXIgZnJvbSBcIi4vYWN0aW9uX2Jhci5qc1wiXG5pbXBvcnQgU3RvbmUgZnJvbSBcIi4vYmVpbmdzL3N0b25lLmpzXCJcbmltcG9ydCBUcmVlIGZyb20gXCIuL2JlaW5ncy90cmVlLmpzXCJcbmltcG9ydCBFZGl0b3IgZnJvbSBcIi4vZWRpdG9yL2luZGV4LmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IFN0YXJ0TWVudSBmcm9tIFwiLi9zdGFydF9tZW51LmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG4vLyAtLS1cbi8vIERpc2FibGUgcmlnaHQgbW91c2UgY2xpY2tcbmdvLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9XG5cbmNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IHNldENsaWNrQ2FsbGJhY2soZ28pXG5jb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pXG5jb25zdCBtb3VzZWRvd25fY2FsbGJhY2tzID0gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pXG5jb25zdCBtb3VzZXVwX2NhbGxiYWNrcyA9IHNldE1vdXNldXBDYWxsYmFjayhnbylcbmNvbnN0IHRvdWNoc3RhcnRfY2FsbGJhY2tzID0gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKVxuY29uc3QgdG91Y2hlbmRfY2FsbGJhY2tzID0gc2V0VG91Y2hlbmRDYWxsYmFjayhnbylcblxuLy8tLS0tLVxuY29uc3QgY2FtZXJhID0gbmV3IENhbWVyYShnbylcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBzdGFydF9tZW51ID0gbmV3IFN0YXJ0TWVudSh7IGdvIH0pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbywgY2hhcmFjdGVyKVxuY29uc3Qga2V5Ym9hcmRfaW5wdXQgPSBuZXcgS2V5Ym9hcmRJbnB1dChnbylcbmNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKGdvKVxuY29uc3QgY29udHJvbHMgPSBuZXcgQ29udHJvbHMoZ28pXG5jb25zdCBsb290X2JveCA9IG5ldyBMb290Qm94KGdvKVxuY29uc3QgYWN0aW9uX2JhciA9IG5ldyBBY3Rpb25CYXIoZ28pXG5jb25zdCBlZGl0b3IgPSBuZXcgRWRpdG9yKHsgZ28gfSlcbmNvbnN0IGV4cGVyaWVuY2VfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogeyB4OiBnby5zY3JlZW4ud2lkdGggLyAyIC0gNTAwLCB5OiBnby5zY3JlZW4uaGVpZ2h0IC0gMzAsIHdpZHRoOiAxMDAwLCBoZWlnaHQ6IDUgfSwgY29sb3VyOiBcInB1cnBsZVwiLCBib3JkZXI6IFwid2hpdGVcIiwgZml4ZWQ6IHRydWUgfSk7XG5leHBlcmllbmNlX2Jhci5oZWlnaHQgPSAzMFxuXG4vLyBDYWxsYmFja3NcbmZ1bmN0aW9uIHRyYWNrX21vdXNlX3Bvc2l0aW9uKGV2dCkge1xuICB2YXIgcmVjdCA9IGdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBnby5tb3VzZV9wb3NpdGlvbiA9IHtcbiAgICB4OiBldnQuY2xpZW50WCAtIHJlY3QubGVmdCArIGNhbWVyYS54LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3AgKyBjYW1lcmEueSxcbiAgICB3aWR0aDogMSxcbiAgICBoZWlnaHQ6IDFcbiAgfVxufVxuXG5nby5tb3VzZV9wb3NpdGlvbiA9IHt9XG5sZXQgbW91c2VfaXNfZG93biA9IGZhbHNlXG5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKGxvb3RfYm94LmNoZWNrX2l0ZW1fY2xpY2tlZC5iaW5kKGxvb3RfYm94KSlcbnRvdWNoc3RhcnRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbnRvdWNoZW5kX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxuXG5mdW5jdGlvbiBjbGlja2FibGVfY2xpY2tlZChldikge1xuICBsZXQgY2xpY2sgPSB7IHg6IGV2LmNsaWVudFggKyBnby5jYW1lcmEueCwgeTogZXYuY2xpZW50WSArIGdvLmNhbWVyYS55LCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgY29uc3QgY2xpY2thYmxlID0gZ28uY2xpY2thYmxlcy5maW5kKChjbGlja2FibGUpID0+IGlzX2NvbGxpZGluZyhjbGlja2FibGUsIGNsaWNrKSlcbiAgaWYgKGNsaWNrYWJsZSkge1xuICAgIGNsaWNrYWJsZS5hY3RpdmF0ZWQgPSAhY2xpY2thYmxlLmFjdGl2YXRlZFxuICB9XG4gIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IGNsaWNrYWJsZVxufVxuY2xpY2tfY2FsbGJhY2tzLnB1c2goY2xpY2thYmxlX2NsaWNrZWQpXG5cbm1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcblxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbJ0VzY2FwZSddID0gW2NoYXJhY3Rlci5lc2NhcGVfa2V5XVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuZiA9IFtjaGFyYWN0ZXIuc2tpbGxfYWN0aW9uXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMF0gPSBbY2hhcmFjdGVyLnNraWxscy5tYWtlX2ZpcmVdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1sxXSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmZyb3N0Ym9sdF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWzJdID0gW2NoYXJhY3Rlci5zcGVsbHMuYmxpbmtdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5pID0gW2NoYXJhY3Rlci5pbnZlbnRvcnkudG9nZ2xlX2Rpc3BsYXldXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5iID0gW2NoYXJhY3Rlci5ib2FyZC50b2dnbGVfZ3JpZF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmUgPSBbKCkgPT4gZWRpdG9yLmFjdGl2ZSA9ICFlZGl0b3IuYWN0aXZlXVxuLy9rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5wID0gW2JvYXJkLndheV90b19wbGF5ZXJdXG5cbi8vIEVORCAtLSBDYWxsYmFja3NcblxubGV0IGVsYXBzZWRfdGltZSA9IDBcbmxldCBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG5sZXQgZnJhbWVzID0gMDtcbmNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgaWYgKHN0YXJ0X21lbnUuYWN0aXZlKSB7XG4gICAgc3RhcnRfbWVudS51cGRhdGUoKVxuICAgIHJldHVybjtcbiAgfVxuICBmcmFtZXMgKz0gMTtcbiAgZWxhcHNlZF90aW1lID0gRGF0ZS5ub3coKSAtIGxhc3RfdGlja1xuICBpZiAoKGVsYXBzZWRfdGltZSkgPiAxMDAwKSB7XG4gICAgZnJhbWVzID0gMDtcbiAgICBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgdXBkYXRlX2ZwcygpXG4gIH1cbiAgaWYgKCFjaGFyYWN0ZXIuc3RhdHMuaXNfYWxpdmUoKSkge1xuICAgIGNvbnRyb2xzX21vdmVtZW50KClcbiAgfSBlbHNlIHtcbiAgICBnby51cGRhdGVfb2JqZWN0cygpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlX2ZwcygpIHtcbiAgaWYgKHN0YXJ0X21lbnUuYWN0aXZlKSByZXR1cm47XG5cbiAgaWYgKGNoYXJhY3Rlci5zdGF0cy5pc19hbGl2ZSgpKSB7XG4gICAgY2hhcmFjdGVyLnVwZGF0ZV9mcHMoKVxuICB9XG4gIGdvLnVwZGF0ZV9mcHNfb2JqZWN0cygpXG59XG4vLyBDb21tZW50XG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBpZiAoc3RhcnRfbWVudS5hY3RpdmUpIHtcbiAgICBzdGFydF9tZW51LmRyYXcoKTtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoY2hhcmFjdGVyLnN0YXRzLmlzX2RlYWQoKSkge1xuICAgIHNjcmVlbi5kcmF3X2dhbWVfb3ZlcigpXG4gIH0gZWxzZSB7XG4gICAgc2NyZWVuLmRyYXcoKVxuICAgIGdvLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlKClcbiAgICBnby5kcmF3X29iamVjdHMoKVxuICAgIGNoYXJhY3Rlci5kcmF3KClcbiAgICBzY3JlZW4uZHJhd19mb2coKVxuICAgIGxvb3RfYm94LmRyYXcoKVxuICAgIGdvLmNoYXJhY3Rlci5pbnZlbnRvcnkuZHJhdygpXG4gICAgYWN0aW9uX2Jhci5kcmF3KClcbiAgICBjaGFyYWN0ZXIuYm9hcmQuZHJhdygpXG4gICAgZWRpdG9yLmRyYXcoKVxuICAgIGV4cGVyaWVuY2VfYmFyLmRyYXcoMTAwMCwgZ28uY2hhcmFjdGVyLmV4cGVyaWVuY2VfcG9pbnRzKVxuICAgIGlmIChzaG93X2NvbnRyb2xfd2hlZWwpIGRyYXdfY29udHJvbF93aGVlbCgpXG4gIH1cbn0gXG5cbi8vIFRyZWVzXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgbGV0IHRyZWUgPSBuZXcgVHJlZSh7IGdvIH0pXG4gIGdvLnRyZWVzLnB1c2godHJlZSlcbiAgZ28uY2xpY2thYmxlcy5wdXNoKHRyZWUpXG59KVxuLy8gU3RvbmVzXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgY29uc3Qgc3RvbmUgPSBuZXcgU3RvbmUoeyBnbyB9KTtcbiAgZ28uc3RvbmVzLnB1c2goc3RvbmUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaChzdG9uZSlcbn0pXG4vLyBDcmVlcFxuZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gIGxldCBjcmVlcCA9IG5ldyBDcmVlcCh7IGdvIH0pO1xuICBnby5jbGlja2FibGVzLnB1c2goY3JlZXApO1xufVxuY29uc3QgZHVtbXkgPSBuZXcgQ3JlZXAoeyBnbyB9KVxuZHVtbXkueCA9IDgwMDtcbmR1bW15LnkgPSAyMDA7XG5nby5jbGlja2FibGVzLnB1c2goZHVtbXkpXG5cbmxldCBvcmRlcmVkX2NsaWNrYWJsZXMgPSBbXTtcbmNvbnN0IHRhYl9jeWNsaW5nID0gKGV2KSA9PiB7XG4gIGV2LnByZXZlbnREZWZhdWx0KClcbiAgb3JkZXJlZF9jbGlja2FibGVzID0gZ28uY3JlZXBzLnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gVmVjdG9yMi5kaXN0YW5jZShhLCBjaGFyYWN0ZXIpIC0gVmVjdG9yMi5kaXN0YW5jZShiLCBjaGFyYWN0ZXIpO1xuICB9KVxuICBpZiAoVmVjdG9yMi5kaXN0YW5jZShvcmRlcmVkX2NsaWNrYWJsZXNbMF0sIGNoYXJhY3RlcikgPiA1MDApIHJldHVybjtcblxuICBpZiAob3JkZXJlZF9jbGlja2FibGVzWzBdID09PSBnby5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBvcmRlcmVkX2NsaWNrYWJsZXNbMV07XG4gIH0gZWxzZSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gb3JkZXJlZF9jbGlja2FibGVzWzBdXG4gIH1cbn1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wiVGFiXCJdID0gW3RhYl9jeWNsaW5nXVxuXG5sZXQgc2hvd19jb250cm9sX3doZWVsID0gZmFsc2VcbmNvbnN0IGRyYXdfY29udHJvbF93aGVlbCA9ICgpID0+IHtcbiAgZ28uY3R4LmJlZ2luUGF0aCgpXG4gIGdvLmN0eC5hcmMoXG4gICAgY2hhcmFjdGVyLnggKyAoY2hhcmFjdGVyLndpZHRoIC8gMikgLSBnby5jYW1lcmEueCxcbiAgICBjaGFyYWN0ZXIueSArIChjaGFyYWN0ZXIuaGVpZ2h0IC8gMikgLSBnby5jYW1lcmEueSxcbiAgICAyMDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gIGdvLmN0eC5saW5lV2lkdGggPSA1XG4gIGdvLmN0eC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIlxuICBnby5jdHguc3Ryb2tlKCk7XG59XG5jb25zdCB0b2dnbGVfY29udHJvbF93aGVlbCA9ICgpID0+IHsgc2hvd19jb250cm9sX3doZWVsID0gIXNob3dfY29udHJvbF93aGVlbCB9XG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1tcImNcIl0gPSBbdG9nZ2xlX2NvbnRyb2xfd2hlZWxdXG5cbmNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG5nYW1lX2xvb3AuZHJhdyA9IGRyYXdcbmdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IGdvLmtleWJvYXJkX2lucHV0LnByb2Nlc3Nfa2V5c19kb3duXG5nYW1lX2xvb3AudXBkYXRlID0gdXBkYXRlXG5cbmNvbnN0IHN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuICBjaGFyYWN0ZXIueCA9IDEwMFxuICBjaGFyYWN0ZXIueSA9IDEwMFxuICBnby53b3JsZC5nZW5lcmF0ZV9tYXAoKVxuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZV9sb29wLmxvb3AuYmluZChnYW1lX2xvb3ApKTtcbn1cblxuc3RhcnQoKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==