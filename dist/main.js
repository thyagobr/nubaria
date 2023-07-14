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

    // is_self_cast: if true, the spell is being cast by the player
    this.cast = (is_self_cast = true) => {
        if (!this.spell.is_valid()) {
            console.log("spell is not valid")
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

                if (is_self_cast) {
                    this.go.action_bar.highlight_cast(this.spell);
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
          casting_player.spells[payload.spell.id.replace("spell_", "")](false)
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
                const damage = (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(5, 10) * this.entity.level;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0Qiw2QkFBNkI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IscURBQVk7QUFDNUI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRWlIOzs7Ozs7Ozs7Ozs7Ozs7QUM1RGpIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlOzs7Ozs7Ozs7Ozs7Ozs7QUNYVTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7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LGdCQUFnQixRQUFRO0FBQ3hCLGtCQUFrQix5REFBSyxHQUFHLElBQUk7QUFDOUI7QUFDQTtBQUNBLGtCQUFrQix5REFBSyxHQUFHLElBQUk7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyx3REFBZ0IsaUJBQWlCLHdEQUFnQjtBQUM1RCxHQUFHO0FBQ0gsTUFBTSx3REFBZ0I7O0FBRXRCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQzs7QUFFQSxzQkFBc0IscURBQVE7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsTyIsInNvdXJjZXMiOlsid2VicGFjazovL251YmFyaWEvLi9zcmMvYWN0aW9uX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9hZ2dyby5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9sb290LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL21vdmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3BlbGxjYXN0aW5nLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVoYXZpb3JzL3N0YXRzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVpbmdzL2NyZWVwLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVpbmdzL2xvb3RfYmFnLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVpbmdzL3N0b25lLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvYmVpbmdzL3RyZWUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9ib2FyZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2NhbWVyYS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Nhc3RpbmdfYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2hhcmFjdGVyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2xpY2thYmxlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9kb29kYWQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9lZGl0b3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9ldmVudHNfY2FsbGJhY2tzLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9sb29wLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZV9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pbnZlbnRvcnkuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9pdGVtLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMva2V5Ym9hcmRfaW5wdXQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvbG9vdF9ib3guanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9ub2RlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcGFydGljbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wcm9qZWN0aWxlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcmVzb3VyY2VfYmFyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2NyZWVuLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2VydmVyLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGwuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbHMvYnJlYWtfc3RvbmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbHMvY3V0X3RyZWUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbHMvbWFrZV9maXJlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc3BlbGxzL2JsaW5rLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc3BlbGxzL2Zyb3N0Ym9sdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3N0YXJ0X21lbnUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90YXBldGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90aWxlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd29ybGQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd2VpcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlXCI7XG5cbmZ1bmN0aW9uIEFjdGlvbkJhcihnYW1lX29iamVjdCkge1xuICB0aGlzLmdhbWVfb2JqZWN0ID0gZ2FtZV9vYmplY3RcbiAgdGhpcy5nYW1lX29iamVjdC5hY3Rpb25fYmFyID0gdGhpc1xuICB0aGlzLm51bWJlcl9vZl9zbG90cyA9IDEwXG4gIHRoaXMuc2xvdF9oZWlnaHQgPSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDM7XG4gIHRoaXMuc2xvdF93aWR0aCA9IHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogMztcbiAgdGhpcy55X29mZnNldCA9IDEwMFxuICB0aGlzLmFjdGlvbl9iYXJfd2lkdGggPSB0aGlzLm51bWJlcl9vZl9zbG90cyAqIHRoaXMuc2xvdF93aWR0aFxuICB0aGlzLmFjdGlvbl9iYXJfaGVpZ2h0ID0gdGhpcy5udW1iZXJfb2Zfc2xvdHMgKiB0aGlzLnNsb3RfaGVpZ2h0XG4gIHRoaXMuYWN0aW9uX2Jhcl94ID0gKHRoaXMuZ2FtZV9vYmplY3QuY2FudmFzX3JlY3Qud2lkdGggLyAyKSAtICh0aGlzLmFjdGlvbl9iYXJfd2lkdGggLyAyKVxuICB0aGlzLmFjdGlvbl9iYXJfeSA9IHRoaXMuZ2FtZV9vYmplY3QuY2FudmFzX3JlY3QuaGVpZ2h0IC0gdGhpcy5nYW1lX29iamVjdC50aWxlX3NpemUgKiA0IC0gdGhpcy55X29mZnNldFxuXG4gIC8vIGNoYXJhY3Rlci1zcGVjaWZpY1xuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5zbG90X3NpemUgPSAxMFxuICB0aGlzLnNsb3RzWzBdID0gdGhpcy5nYW1lX29iamVjdC5jaGFyYWN0ZXIuc3BlbGxib29rLmZyb3N0Ym9sdFxuICB0aGlzLnNsb3RzWzFdID0gdGhpcy5nYW1lX29iamVjdC5jaGFyYWN0ZXIuc3BlbGxib29rLmJsaW5rXG4gIC8vIEVORCAtLSBjaGFyYWN0ZXItc3BlY2lmaWNcblxuICB0aGlzLmhpZ2hsaWdodHMgPSBbXVxuXG4gIGZ1bmN0aW9uIFNsb3QoeyBzcGVsbCwgeCwgeSB9KSB7XG4gICAgdGhpcy5zcGVsbCA9IHNwZWxsXG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgdGhpcy5oaWdobGlnaHRfY2FzdCA9IChzcGVsbCkgPT4ge1xuICAgIHRoaXMuaGlnaGxpZ2h0cy5wdXNoKHNwZWxsKVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIHNsb3RfaW5kZXggPSAwOyBzbG90X2luZGV4IDw9IHRoaXMuc2xvdF9zaXplOyBzbG90X2luZGV4KyspIHtcbiAgICAgIHZhciBzbG90ID0gdGhpcy5zbG90c1tzbG90X2luZGV4XTtcblxuICAgICAgdmFyIHggPSB0aGlzLmFjdGlvbl9iYXJfeCArICh0aGlzLnNsb3Rfd2lkdGggKiBzbG90X2luZGV4KVxuICAgICAgdmFyIHkgPSB0aGlzLmFjdGlvbl9iYXJfeVxuXG4gICAgICBpZiAoc2xvdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSg0NiwgNDYsIDQ2LCAxKVwiXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVN0eWxlID0gXCJibHVldmlvbGV0XCJcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodFxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmRyYXdJbWFnZShzbG90Lmljb24sIHgsIHksIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZXZpb2xldFwiXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgICAgeCwgeSxcbiAgICAgICAgICB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHRcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEhpZ2hsaWdodDogdGhlIGFjdGlvbiBiYXIgXCJibGlua3NcIiBmb3IgYSBmcmFtZSB3aGVuIHRoZSBzcGVsbCBpcyBjYXN0XG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodHMuZmluZCgoc3BlbGwpID0+IHNwZWxsLmlkID09PSBzbG90LmlkKSkge1xuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHNsb3QsIHRoaXMuaGlnaGxpZ2h0cylcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNyknXG4gICAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdCh4LCB5LCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29vbGRvd24gaW5kaWNhdG9yXG4gICAgICAgIGlmIChzbG90Lm9uX2Nvb2xkb3duKCkpIHtcbiAgICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IDEgLSAoKG5vdyAtIHNsb3QubGFzdF9jYXN0X2F0KSAvIHNsb3QuY29vbGRvd25fdGltZV9pbl9tcylcbiAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjcpJ1xuICAgICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxSZWN0KHgsIHksIHRoaXMuc2xvdF93aWR0aCAqIHBlcmNlbnRhZ2UsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbkJhclxuIiwiaW1wb3J0IEJvYXJkIGZyb20gXCIuLi9ib2FyZFwiXG5pbXBvcnQgeyBWZWN0b3IyLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCJcbmltcG9ydCB7IE1vdmUgfSBmcm9tIFwiLi9tb3ZlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWdncm8oeyBnbywgZW50aXR5LCByYWRpdXMgPSAyMCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQoeyBnbywgZW50aXR5LCByYWRpdXM6IE1hdGguZmxvb3IodGhpcy5yYWRpdXMgLyB0aGlzLmdvLnRpbGVfc2l6ZSkgfSlcbiAgICB0aGlzLm1vdmUgPSBuZXcgTW92ZSh7IGdvLCBlbnRpdHksIHRhcmdldF9wb3NpdGlvbjogdGhpcy5nby5jaGFyYWN0ZXIgfSlcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKHRoaXMuZ28uY2hhcmFjdGVyLCBlbnRpdHkpXG4gICAgICAgIGlmIChkaXN0YW5jZSA8IHRoaXMucmFkaXVzKSB7XG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCAodGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyKSArICh0aGlzLmVudGl0eS53aWR0aCAvIDIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdHkuc3RhdHMuYXR0YWNrKHRoaXMuZ28uY2hhcmFjdGVyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUuYWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRyYXdfcGF0aCA9ICgpID0+IHtcblxuICAgIH1cblxuICAgIGNvbnN0IG5laWdoYm9yX3Bvc2l0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LngsXG4gICAgICAgICAgICB5OiB0aGlzLmVudGl0eS55LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZW50aXR5LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmVudGl0eS5oZWlnaHRcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxlZnQgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHg6IHRoaXMuZW50aXR5LnggLT0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCByaWdodCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeDogdGhpcy5lbnRpdHkueCArPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IHVwID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB5OiB0aGlzLmVudGl0eS55IC09IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgZG93biA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeTogdGhpcy5lbnRpdHkueSArPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgfVxufSAiLCJpbXBvcnQgTG9vdEJveCBmcm9tIFwiLi4vbG9vdF9ib3hcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb290KHsgZ28sIGVudGl0eSwgbG9vdF9iYWcgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5sb290X2JhZyA9IGxvb3RfYmFnXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubG9vdF9iYWcuaXRlbXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMubG9vdF9iYWcuaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmxvb3RfYmFnLmVudGl0eS5sb290X3RhYmxlKVxuICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5sb290X2JhZyA9IHRoaXMubG9vdF9iYWdcbiAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmxvb3RfYmFnLml0ZW1zXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICB9XG59IiwiaW1wb3J0IHsgVmVjdG9yMiwgaXNfY29sbGlkaW5nIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBjbGFzcyBNb3ZlIHtcbiAgICBjb25zdHJ1Y3Rvcih7IGdvLCBlbnRpdHksIHNwZWVkID0gMSwgdGFyZ2V0X3Bvc2l0aW9uIH0pIHtcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxuICAgICAgICB0aGlzLnRhcmdldF9wb3NpdGlvbiA9IHRhcmdldF9wb3NpdGlvblxuICAgICAgICB0aGlzLmJwcyA9IDA7XG4gICAgICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5wYXRoID0gbnVsbFxuICAgICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IG51bGxcbiAgICB9XG5cbiAgICBhY3QgPSAoKSA9PiB7XG4gICAgICAgIC8vIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgICAgIC8vIGlmICgodGhpcy5icHMpID49IDgwMCkge1xuICAgICAgICAvLyAgICAgdGhpcy5wYXRoID0gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZmluZF9wYXRoKHRoaXMuZW50aXR5LCB0aGlzLnRhcmdldF9wb3NpdGlvbilcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGBQYXRoIGxlbmd0aCAke3RoaXMucGF0aC5sZW5ndGh9YClcbiAgICAgICAgLy8gICAgIHRoaXMubmV4dF9wYXRoX2luZGV4ID0gMFxuICAgICAgICAvLyAgICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyB0aGlzLmVudGl0eS5hZ2dyby5ib2FyZC5kcmF3KClcbiAgICAgICAgLy9pZiAodGhpcy5wYXRoID09PSB1bmRlZmluZWQgfHwgdGhpcy5wYXRoW3RoaXMubmV4dF9wYXRoX2luZGV4XSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgLy9jb25zdCB0YXJnZXRlZF9wb3NpdGlvbiA9IHRoaXMucGF0aFt0aGlzLm5leHRfcGF0aF9pbmRleF1cbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfcG9zaXRpb24gPSB7IC4uLnRoaXMudGFyZ2V0X3Bvc2l0aW9uIH1cbiAgICAgICAgY29uc3QgbmV4dF9zdGVwID0ge1xuICAgICAgICAgICAgeDogdGhpcy5lbnRpdHkueCArIHRoaXMuc3BlZWQgKiBNYXRoLmNvcyhWZWN0b3IyLmFuZ2xlKHRoaXMuZW50aXR5LCB0YXJnZXRlZF9wb3NpdGlvbikpLFxuICAgICAgICAgICAgeTogdGhpcy5lbnRpdHkueSArIHRoaXMuc3BlZWQgKiBNYXRoLnNpbihWZWN0b3IyLmFuZ2xlKHRoaXMuZW50aXR5LCB0YXJnZXRlZF9wb3NpdGlvbikpLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZW50aXR5LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmVudGl0eS5oZWlnaHRcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZ28udHJlZXMuc29tZSh0cmVlID0+IChpc19jb2xsaWRpbmcobmV4dF9zdGVwLCB0cmVlKSkpKSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnkgPSBuZXh0X3N0ZXAueVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJobW1tLi4uIHdoZXJlIHRvP1wiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJlZGljdF9tb3ZlbWVudCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5icHMgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpY2tcbiAgICAgICAgaWYgKCh0aGlzLmJwcykgPj0gMzAwMCkge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZmluZF9wYXRoKHRoaXMuZW50aXR5LCB0aGlzLnRhcmdldF9wb3NpdGlvbilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBQYXRoIGxlbmd0aCAke3RoaXMucGF0aC5sZW5ndGh9YClcbiAgICAgICAgICAgIHRoaXMubmV4dF9wYXRoX2luZGV4ID0gMFxuICAgICAgICAgICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyLmpzXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5LCBzcGVsbCwgdGFyZ2V0IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldFxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5zcGVsbCA9IHNwZWxsXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50aXR5LmlzX2J1c3lfd2l0aCA9IG51bGxcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzKVxuICAgICAgICBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSAtPSB0aGlzLnNwZWxsLm1hbmFfY29zdFxuICAgICAgICAgICAgdGhpcy5zcGVsbC5hY3QoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaXNfc2VsZl9jYXN0OiBpZiB0cnVlLCB0aGUgc3BlbGwgaXMgYmVpbmcgY2FzdCBieSB0aGUgcGxheWVyXG4gICAgdGhpcy5jYXN0ID0gKGlzX3NlbGZfY2FzdCA9IHRydWUpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNwZWxsLmlzX3ZhbGlkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3BlbGwgaXMgbm90IHZhbGlkXCIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVudGl0eS5pc19idXN5X3dpdGggPSB0aGlzLmNhc3RpbmdfYmFyXG4gICAgICAgIGlmICh0aGlzLnNwZWxsLmNhc3RpbmdfdGltZV9pbl9tcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FzdGluZ19iYXIuZHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0b3AoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgPiB0aGlzLnNwZWxsLm1hbmFfY29zdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cy5wdXNoKHRoaXMpXG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCh0aGlzLnNwZWxsLmNhc3RpbmdfdGltZV9pbl9tcywgdGhpcy5lbmQpXG5cbiAgICAgICAgICAgICAgICBpZiAoaXNfc2VsZl9jYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uYWN0aW9uX2Jhci5oaWdobGlnaHRfY2FzdCh0aGlzLnNwZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogZXh0cmFjdFxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogXCJzcGVsbGNhc3RpbmdTdGFydGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMuc3BlbGwuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy50YXJnZXQoKS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmVudGl0eS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLnNlcnZlci5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgICAgICAgICAgICAgICAgIC8vIEVORCAtLSBUT0RPOiBleHRyYWN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZCgpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IExvb3RCYWcgZnJvbSBcIi4uL2JlaW5ncy9sb290X2JhZ1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdGF0cyh7IGdvLCBlbnRpdHksIGhwID0gMTAwLCBjdXJyZW50X2hwLCBtYW5hLCBjdXJyZW50X21hbmEgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5ocCA9IGhwIHx8IDEwMFxuICAgIHRoaXMuY3VycmVudF9ocCA9IGN1cnJlbnRfaHAgfHwgaHBcbiAgICB0aGlzLm1hbmEgPSBtYW5hXG4gICAgdGhpcy5jdXJyZW50X21hbmEgPSBjdXJyZW50X21hbmEgfHwgbWFuYVxuICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBudWxsO1xuICAgIHRoaXMuYXR0YWNrX3NwZWVkID0gMTAwMDtcblxuICAgIHRoaXMuaGFzX21hbmEgPSAoKSA9PiB0aGlzLm1hbmEgPT09IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzX2RlYWQgPSAoKSA9PiB0aGlzLmN1cnJlbnRfaHAgPD0gMDtcbiAgICB0aGlzLmlzX2FsaXZlID0gKCkgPT4gIXRoaXMuaXNfZGVhZCgpO1xuICAgIHRoaXMudGFrZV9kYW1hZ2UgPSAoeyBkYW1hZ2UgfSkgPT4ge1xuICAgICAgICBuZXcgU2Nyb2xsRGFtYWdlVGV4dCh7IGdvOiB0aGlzLmdvLCBlbnRpdHk6IHRoaXMuZW50aXR5LCBkYW1hZ2UgfSkuc3Bhd24oKVxuICAgICAgICB0aGlzLmN1cnJlbnRfaHAgLT0gZGFtYWdlO1xuICAgICAgICAvLyBUT0RPOiBleHRyYWN0XG4gICAgICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgICAgICAgYWN0aW9uOiBcImRhbWFnZVwiLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIGRhbWFnZWRfcGxheWVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmVudGl0eS5pZCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhbWFnZTogZGFtYWdlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5zZXJ2ZXIuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICAgICAgICAvLyBFTkQgLS0gVE9ETzogZXh0cmFjdFxuICAgICAgICBpZiAodGhpcy5pc19kZWFkKCkpIHRoaXMuZGllKClcbiAgICB9XG4gICAgdGhpcy5kaWUgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jcmVlcHMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY3JlZXBzXCIpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLmVudGl0eSwgdGhpcy5nby5jbGlja2FibGVzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNsaWNrYWJsZXNcIilcbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB0aGlzLmVudGl0eSkgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsO1xuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci51cGRhdGVfeHAodGhpcy5lbnRpdHkpXG4gICAgICAgIGlmICh0aGlzLmVudGl0eS5sb290X3RhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9iYWdzLnB1c2gobmV3IExvb3RCYWcoeyBnbzogdGhpcy5nbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KSlcbiAgICAgICAgICAgIC8vIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmVudGl0eS5sb290X3RhYmxlKVxuICAgICAgICAgICAgLy8gdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmF0dGFjayA9ICh0YXJnZXQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubGFzdF9hdHRhY2tfYXQgPT09IG51bGwgfHwgKHRoaXMubGFzdF9hdHRhY2tfYXQgKyB0aGlzLmF0dGFja19zcGVlZCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSByYW5kb20oNSwgMTIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKiAke3RoaXMuZW50aXR5Lm5hbWV9IGF0dGFja3MgJHt0YXJnZXQubmFtZX06ICR7ZGFtYWdlfSBkYW1hZ2VgKVxuICAgICAgICAgICAgdGFyZ2V0LnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlOiBkYW1hZ2UgfSlcbiAgICAgICAgICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBEYXRlLm5vdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gU2Nyb2xsRGFtYWdlVGV4dCh7IGdvLCBlbnRpdHksIGRhbWFnZSB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnbztcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IG51bGxcbiAgICAgICAgdGhpcy5kaXNwbGF5X3RpbWUgPSAyMDAwXG4gICAgICAgIHRoaXMuZm9udF9zaXplID0gMjFcbiAgICAgICAgdGhpcy54ID0gdGhpcy5lbnRpdHkueCArIChyYW5kb20oMCwgdGhpcy5lbnRpdHkud2lkdGgpKSAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgdGhpcy55ID0gdGhpcy5lbnRpdHkueSAtIHRoaXMuZ28uY2FtZXJhLnlcblxuICAgICAgICB0aGlzLnNwYXduID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydGluZ190aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBgJHt0aGlzLmZvbnRfc2l6ZX1weCBzYW5zLXNlcmlmYFxuICAgICAgICAgICAgbGV0IHRleHQgPSBgJHt0aGlzLmRhbWFnZX1gXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLngsIHRoaXMuZW50aXR5LnkgLSB0aGlzLmdvLmNhbWVyYS55KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmUgJiYgRGF0ZS5ub3coKSA+IHRoaXMuc3RhcnRpbmdfdGltZSArIHRoaXMuZGlzcGxheV90aW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZm9udF9zaXplICs9IDAuMlxuICAgICAgICAgICAgdGhpcy55IC09IDAuMlxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlX2ZwcyA9ICgpID0+IHsgfVxuICAgICAgICB0aGlzLmVuZCA9ICgpID0+IHsgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi4vcmVzb3VyY2VfYmFyLmpzXCJcbmltcG9ydCBBZ2dybyBmcm9tIFwiLi4vYmVoYXZpb3JzL2FnZ3JvLmpzXCJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi4vYmVoYXZpb3JzL3N0YXRzLmpzXCJcblxuZnVuY3Rpb24gQ3JlZXAoeyBnbyB9KSB7XG4gIGlmIChnby5jcmVlcHMgPT09IHVuZGVmaW5lZCkgZ28uY3JlZXBzID0gW11cbiAgdGhpcy5pZCA9IGdvLmNyZWVwcy5sZW5ndGhcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY3JlZXBzLnB1c2godGhpcylcbiAgdGhpcy5uYW1lID0gYENyZWVwICR7dGhpcy5pZH1gXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IFwiemVyZ2xpbmcucG5nXCIgLy8gcGxhY2Vob2xkZXIgaW1hZ2VcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDE1MFxuICB0aGlzLmltYWdlX2hlaWdodCA9IDE1MFxuICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aClcbiAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KVxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG4gIHRoaXMuc3BlZWQgPSAyXG4gIC8vdGhpcy5tb3ZlbWVudF9ib2FyZCA9IHRoaXMuZ28uYm9hcmQuZ3JpZFxuICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIGhwOiAyMCB9KTtcbiAgLy8gQmVoYXZpb3Vyc1xuICB0aGlzLmFnZ3JvID0gbmV3IEFnZ3JvKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiA1MDAgfSk7XG4gIC8vIEVORCAtIEJlaGF2aW91cnNcblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAodGFyZ2V0X3Bvc2l0aW9uKSB7XG4gICAgbGV0IHggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnggPyB0YXJnZXRfcG9zaXRpb24ueCA6IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICBsZXQgeSA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueSA/IHRhcmdldF9wb3NpdGlvbi55IDogdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueVxuICAgIGxldCB3aWR0aCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ud2lkdGggPyB0YXJnZXRfcG9zaXRpb24ud2lkdGggOiB0aGlzLndpZHRoXG4gICAgbGV0IGhlaWdodCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0ID8gdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA6IHRoaXMuaGVpZ2h0XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHRoaXMuaW1hZ2VfeF9vZmZzZXQsIHRoaXMuaW1hZ2VfeV9vZmZzZXQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICAgIGlmICh0YXJnZXRfcG9zaXRpb24pIHJldHVyblxuXG4gICAgdGhpcy5hZ2dyby5hY3QoKTtcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gIH1cblxuICB0aGlzLnNldF9tb3ZlbWVudF90YXJnZXQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbm9kZVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KSB7XG4gICAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldClcbiAgICB9XG4gIH1cblxuICB0aGlzLmxvb3RfdGFibGUgPSBbe1xuICAgIGl0ZW06IHsgbmFtZTogXCJXb29kXCIsIGltYWdlX3NyYzogXCJicmFuY2gucG5nXCIgfSxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAzLFxuICAgIGNoYW5jZTogOTVcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JlZXBcbiIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9vdEJhZyh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmlkID0gYGxvb3RfYmFnYFxuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy54ID0gZW50aXR5LnhcbiAgICB0aGlzLnkgPSBlbnRpdHkueVxuICAgIHRoaXMud2lkdGggPSA1MFxuICAgIHRoaXMuaGVpZ2h0ID0gNTBcbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltYWdlLnNyYyA9ICdiYWNrcGFjay5wbmcnXG4gICAgdGhpcy5nby5jbGlja2FibGVzLnB1c2godGhpcyk7XG4gICAgdGhpcy5pdGVtcyA9IG51bGxcbiAgICB0aGlzLmFjdGVkX2J5X3NraWxsID0gJ2xvb3QnXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCAxMDAwLCAxMDAwLCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLmNsaWNrYWJsZXMpXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5sb290X2JhZ3MpXG4gICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZV9mcHMgPSAoKSA9PiB7fVxufSIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9uZSh7IGdvIH0pIHtcbiAgICB0aGlzLl9fcHJvdG9fXyA9IG5ldyBEb29kYWQoeyBnbyB9KVxuXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBcImZsaW50c3RvbmUucG5nXCJcbiAgICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aCk7XG4gICAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KTtcbiAgICB0aGlzLmltYWdlX3dpZHRoID0gODQwXG4gICAgdGhpcy5pbWFnZV9oZWlnaHQgPSA4NTlcbiAgICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICAgIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gICAgdGhpcy53aWR0aCA9IDMyXG4gICAgdGhpcy5oZWlnaHQgPSAzMlxuICAgIHRoaXMuYWN0ZWRfYnlfc2tpbGwgPSAnYnJlYWtfc3RvbmUnXG59IiwiaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCI7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRyZWUoeyBnbyB9KSB7XG4gICAgdGhpcy5fX3Byb3RvX18gPSBuZXcgRG9vZGFkKHsgZ28gfSlcblxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gXCJwbGFudHMucG5nXCJcbiAgICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aCk7XG4gICAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KTtcbiAgICB0aGlzLmltYWdlX3dpZHRoID0gOThcbiAgICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMTI3XG4gICAgdGhpcy5pbWFnZV9oZWlnaHQgPSAxMjZcbiAgICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMjkwXG4gICAgdGhpcy53aWR0aCA9IDk4XG4gICAgdGhpcy5oZWlnaHQgPSAxMjZcbiAgICB0aGlzLmFjdGVkX2J5X3NraWxsID0gXCJjdXRfdHJlZVwiXG59IiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZS5qc1wiXG5pbXBvcnQgeyBpc19jb2xsaWRpbmcsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuLy8gQSBncmlkIG9mIHRpbGVzIGZvciB0aGUgbWFuaXB1bGF0aW9uXG5mdW5jdGlvbiBCb2FyZCh7IGdvLCBlbnRpdHksIHJhZGl1cyB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmJvYXJkID0gdGhpc1xuICB0aGlzLnRpbGVfc2l6ZSA9IHRoaXMuZ28udGlsZV9zaXplXG4gIHRoaXMuZ3JpZCA9IFtbXV1cbiAgdGhpcy5yYWRpdXMgPSByYWRpdXNcbiAgdGhpcy53aWR0aCA9IHRoaXMucmFkaXVzICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMucmFkaXVzICogMlxuICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICB0aGlzLnNob3VsZF9kcmF3ID0gZmFsc2VcblxuICB0aGlzLnRvZ2dsZV9ncmlkID0gKCkgPT4ge1xuICAgIHRoaXMuc2hvdWxkX2RyYXcgPSAhdGhpcy5zaG91bGRfZHJhd1xuICAgIGlmICh0aGlzLnNob3VsZF9kcmF3KSB0aGlzLmJ1aWxkX2dyaWQoKVxuICB9XG5cbiAgdGhpcy5icHMgPSAwO1xuICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG5cbiAgdGhpcy5idWlsZF9ncmlkID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgZ3JpZFwiKVxuICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgaWYgKCh0aGlzLmJwcykgPCAxMDAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuZ3JpZCA9IG5ldyBBcnJheSh0aGlzLndpZHRoKVxuXG4gICAgY29uc3QgeF9wb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5lbnRpdHkueCArIHRoaXMuZW50aXR5LndpZHRoIC8gMilcbiAgICBjb25zdCB5X3Bvc2l0aW9uID0gTWF0aC5mbG9vcih0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0IC8gMilcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0gPSBuZXcgQXJyYXkodGhpcy5oZWlnaHQpXG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKHtcbiAgICAgICAgICB4OiAoeF9wb3NpdGlvbiAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSArIHggKiB0aGlzLnRpbGVfc2l6ZSksXG4gICAgICAgICAgeTogKHlfcG9zaXRpb24gLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkgKyB5ICogdGhpcy50aWxlX3NpemUpLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnRpbGVfc2l6ZSxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMudGlsZV9zaXplLFxuICAgICAgICAgIGc6IEluZmluaXR5LCAvLyBDb3N0IHNvIGZhclxuICAgICAgICAgIGY6IEluZmluaXR5LCAvLyBDb3N0IGZyb20gaGVyZSB0byB0YXJnZXRcbiAgICAgICAgICBoOiBudWxsLCAvL1xuICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgICAgICBib3JkZXJfY29sb3VyOiBcImJsYWNrXCJcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5nby50cmVlcy5mb3JFYWNoKHRyZWUgPT4ge1xuICAgICAgICAgIGlmIChpc19jb2xsaWRpbmcobm9kZSwgdHJlZSkpIHtcbiAgICAgICAgICAgIG5vZGUuY29sb3VyID0gJ3JlZCc7XG4gICAgICAgICAgICBub2RlLmJsb2NrZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBub2RlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy53YXlfdG9fcGxheWVyID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5maW5kX3BhdGgodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUsIHRoaXMuZ28uY2hhcmFjdGVyKVxuICAgIH1cbiAgfVxuXG4gIC8vIEEqIEltcGxlbWVudGF0aW9uXG4gIC8vIGY6IENvc3Qgb2YgdGhlIGVudGlyZSB0cmF2ZWwgKHN1bSBvZiBnICsgaClcbiAgLy8gZzogQ29zdCBmcm9tIHN0YXJ0X25vZGUgdGlsbCBub2RlICh0cmF2ZWwgY29zdClcbiAgLy8gaDogQ29zdCBmcm9tIG5vZGUgdGlsbCBlbmRfbm9kZSAobGVmdG92ZXIgY29zdClcbiAgLy8gQWRkIHRoZSBjdXJyZW50IG5vZGUgaW4gYSBsaXN0XG4gIC8vIFBvcCB0aGUgb25lIHdob3NlIGYgaXMgdGhlIGxvd2VzdGFcbiAgLy8gQWRkIHRvIGEgbGlzdCBvZiBhbHJlYWR5LXZpc2l0ZWQgKGNsb3NlZClcbiAgLy8gVmlzaXQgYWxsIGl0cyBuZWlnaGJvdXJzXG4gIC8vIFVwZGF0ZSBmb3IgZWFjaDogdGhlIHRyYXZlbCBjb3N0IChnKSB5b3UgbWFuYWdlZCB0byBkbyBhbmQgeW91cnNlbGYgYXMgcGFyZW50XG4gIC8vLy8gU28gdGhhdCB3ZSBjYW4gcmV0cmFjZSBob3cgd2UgZ290IGhlcmVcbiAgdGhpcy5maW5kX3BhdGggPSAoc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbikgPT4ge1xuICAgIHRoaXMuYnVpbGRfZ3JpZCgpXG4gICAgY29uc3Qgc3RhcnRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKHN0YXJ0X3Bvc2l0aW9uKTtcbiAgICBjb25zdCBlbmRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKGVuZF9wb3NpdGlvbik7XG4gICAgaWYgKCFzdGFydF9ub2RlIHx8ICFlbmRfbm9kZSkge1xuICAgICAgY29uc29sZS5sb2coXCJub2RlcyBub3QgbWF0Y2hlZFwiKVxuICAgIH1cblxuICAgIHN0YXJ0X25vZGUuY29sb3VyID0gJ29yYW5nZSdcbiAgICBlbmRfbm9kZS5jb2xvdXIgPSAnb3JhbmdlJ1xuXG4gICAgY29uc3Qgb3Blbl9zZXQgPSBbc3RhcnRfbm9kZV07XG4gICAgY29uc3QgY2xvc2VkX3NldCA9IFtdO1xuXG4gICAgY29uc3QgY29zdCA9IChub2RlX2EsIG5vZGVfYikgPT4ge1xuICAgICAgY29uc3QgZHggPSBub2RlX2EueCAtIG5vZGVfYi54O1xuICAgICAgY29uc3QgZHkgPSBub2RlX2EueSAtIG5vZGVfYi55O1xuICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgfVxuXG4gICAgc3RhcnRfbm9kZS5nID0gMDtcbiAgICBzdGFydF9ub2RlLmYgPSBjb3N0KHN0YXJ0X25vZGUsIGVuZF9ub2RlKTtcblxuICAgIHdoaWxlIChvcGVuX3NldC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjdXJyZW50X25vZGUgPSBvcGVuX3NldC5zb3J0KChhLCBiKSA9PiAoYS5mIDwgYi5mID8gLTEgOiAxKSlbMF0gLy8gR2V0IHRoZSBub2RlIHdpdGggbG93ZXN0IGYgdmFsdWUgaW4gdGhlIG9wZW4gc2V0XG4gICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoY3VycmVudF9ub2RlLCBvcGVuX3NldClcbiAgICAgIGNsb3NlZF9zZXQucHVzaChjdXJyZW50X25vZGUpXG4gICAgICBcbiAgICAgIGlmIChjdXJyZW50X25vZGUgPT09IGVuZF9ub2RlKSB7XG4gICAgICAgIGxldCBjdXJyZW50ID0gY3VycmVudF9ub2RlO1xuICAgICAgICBsZXQgcGF0aCA9IFtdO1xuICAgICAgICB3aGlsZSAoY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgICBjdXJyZW50LmNvbG91ciA9ICdwdXJwbGUnXG4gICAgICAgICAgcGF0aC5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMubmVpZ2hib3VycyhjdXJyZW50X25vZGUpLmZvckVhY2gobmVpZ2hib3VyX25vZGUgPT4ge1xuICAgICAgICBpZiAoIW5laWdoYm91cl9ub2RlLmJsb2NrZWQgJiYgIWNsb3NlZF9zZXQuaW5jbHVkZXMobmVpZ2hib3VyX25vZGUpKSB7XG4gICAgICAgICAgbGV0IGdfdXNlZCA9IGN1cnJlbnRfbm9kZS5nICsgY29zdChjdXJyZW50X25vZGUsIG5laWdoYm91cl9ub2RlKVxuICAgICAgICAgIGxldCBiZXN0X2cgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoIW9wZW5fc2V0LmluY2x1ZGVzKG5laWdoYm91cl9ub2RlKSkge1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuaCA9IGNvc3QobmVpZ2hib3VyX25vZGUsIGVuZF9ub2RlKVxuICAgICAgICAgICAgb3Blbl9zZXQucHVzaChuZWlnaGJvdXJfbm9kZSlcbiAgICAgICAgICAgIGJlc3RfZyA9IHRydWVcbiAgICAgICAgICB9IGVsc2UgaWYgKGdfdXNlZCA8IG5laWdoYm91cl9ub2RlLmcpIHtcbiAgICAgICAgICAgIGJlc3RfZyA9IHRydWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmVzdF9nKSB7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5wYXJlbnQgPSBjdXJyZW50X25vZGU7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5nID0gZ191c2VkXG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5mID0gbmVpZ2hib3VyX25vZGUuZyArIG5laWdoYm91cl9ub2RlLmhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdGhpcy5uZWlnaGJvdXJzID0gKG5vZGUpID0+IHsgLy8gNSw1XG4gICAgY29uc3QgeF9vZmZzZXQgPSAoTWF0aC5mbG9vcih0aGlzLmVudGl0eS54ICsgdGhpcy5lbnRpdHkud2lkdGggLyAyKSAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSlcbiAgICBjb25zdCB5X29mZnNldCA9IChNYXRoLmZsb29yKHRoaXMuZW50aXR5LnkgKyB0aGlzLmVudGl0eS5oZWlnaHQgLyAyKSAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSlcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigobm9kZS54IC0geF9vZmZzZXQpIC8gdGhpcy50aWxlX3NpemUpXG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoKG5vZGUueSAtIHlfb2Zmc2V0KSAvIHRoaXMudGlsZV9zaXplKVxuXG4gICAgZnVuY3Rpb24gZmV0Y2hfZ3JpZF9jZWxsKGdyaWQsIGx4LCBseSkge1xuICAgICAgcmV0dXJuIGdyaWRbbHhdICYmIGdyaWRbbHhdW2x5XVxuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4LCB5IC0gMSksIC8vIHRvcFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkgLSAxKSwgLy8gdG9wIGxlZnRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5IC0gMSksIC8vIHRvcCByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCwgeSArIDEpLCAvLyBib3R0b21cbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5ICsgMSksIC8vIGJvdHRvbSBsZWZ0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSArIDEpLCAvLyBib3R0b20gcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5KSwgLy8gcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5KSAvLyBsZWZ0XG4gICAgXS5maWx0ZXIobm9kZSA9PiBub2RlICE9PSB1bmRlZmluZWQpXG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnNob3VsZF9kcmF3KSByZXR1cm5cblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmdyaWRbeF1beV07XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IFwiMVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gbm9kZS5ib3JkZXJfY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IG5vZGUuY29sb3VyXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KG5vZGUueCAtIHRoaXMuZ28uY2FtZXJhLngsIG5vZGUueSAtIHRoaXMuZ28uY2FtZXJhLnksIG5vZGUud2lkdGgsIG5vZGUuaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KG5vZGUueCAtIHRoaXMuZ28uY2FtZXJhLngsIG5vZGUueSAtIHRoaXMuZ28uY2FtZXJhLnksIG5vZGUud2lkdGgsIG5vZGUuaGVpZ2h0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYnVpbGRfZ3JpZCgpXG4gIH1cblxuICAvLyBSZWNlaXZlcyBhIHJlY3QgYW5kIHJldHVybnMgaXQncyBmaXJzdCBjb2xsaWRpbmcgTm9kZVxuICB0aGlzLmdldF9ub2RlX2ZvciA9IChyZWN0KSA9PiB7XG4gICAgaWYgKHJlY3Qud2lkdGggPT0gdW5kZWZpbmVkKSByZWN0LndpZHRoID0gMVxuICAgIGlmIChyZWN0LmhlaWdodCA9PSB1bmRlZmluZWQpIHJlY3QuaGVpZ2h0ID0gMVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgaWYgKCh0aGlzLmdyaWRbeF0gPT09IHVuZGVmaW5lZCkgfHwgKHRoaXMuZ3JpZFt4XVt5XSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3h9LCR7eX0gY29vcmRpbmF0ZXMgaXMgdW5kZWZpbmVkYClcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgV2lkdGg6ICR7dGhpcy53aWR0aH07IGhlaWdodDogJHt0aGlzLmhlaWdodH0gKHJhZGl1czogJHt0aGlzLnJhZGl1c30pYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5yZWN0LFxuICAgICAgICAgICAgfSwgdGhpcy5ncmlkW3hdW3ldKSkgcmV0dXJuIHRoaXMuZ3JpZFt4XVt5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gVU5VU0VEIE9MRCBBTEdPUklUSE1cblxuICAvLyBTZXRzIGEgZ2xvYmFsIHRhcmdldCBub2RlXG4gIC8vIEl0IHdhcyB1c2VkIGJlZm9yZSB0aGUgbW92ZW1lbnQgZ290IGRldGFjaGVkIGZyb20gdGhlIHBsYXllciBjaGFyYWN0ZXJcbiAgdGhpcy50YXJnZXRfbm9kZSA9IG51bGxcbiAgdGhpcy5zZXRfdGFyZ2V0ID0gKG5vZGUpID0+IHtcbiAgICB0aGlzLmdyaWQuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5kaXN0YW5jZSA9IDApXG4gICAgdGhpcy50YXJnZXRfbm9kZSA9IG5vZGVcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZXMgcG9zc2libGUgcG9zc2l0aW9ucyBmb3IgdGhlIG5leHQgbW92ZW1lbnRcbiAgdGhpcy5jYWxjdWxhdGVfbmVpZ2hib3VycyA9IChjaGFyYWN0ZXIpID0+IHtcbiAgICBsZXQgY2hhcmFjdGVyX3JlY3QgPSB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCAtIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIHk6IGNoYXJhY3Rlci55IC0gY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgd2lkdGg6IGNoYXJhY3Rlci53aWR0aCArIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIGhlaWdodDogY2hhcmFjdGVyLmhlaWdodCArIGNoYXJhY3Rlci5zcGVlZFxuICAgIH1cblxuICAgIGxldCBmdXR1cmVfbW92ZW1lbnRfY29sbGlzaW9ucyA9IGNoYXJhY3Rlci5tb3ZlbWVudF9ib2FyZC5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBpc19jb2xsaWRpbmcoY2hhcmFjdGVyX3JlY3QsIG5vZGUpXG4gICAgfSlcblxuICAgIC8vIEknbSBnb25uYSBjb3B5IHRoZW0gaGVyZSBvdGhlcndpc2UgZGlmZmVyZW50IGVudGl0aWVzIGNhbGN1bGF0aW5nIGRpc3RhbmNlXG4gICAgLy8gd2lsbCBhZmZlY3QgZWFjaCBvdGhlcidzIG51bWJlcnMuIFRoaXMgY2FuIGJlIHNvbHZlZCB3aXRoIGEgZGlmZmVyZW50XG4gICAgLy8gY2FsY3VsYXRpb24gYWxnb3JpdGhtIGFzIHdlbGwuXG4gICAgcmV0dXJuIGZ1dHVyZV9tb3ZlbWVudF9jb2xsaXNpb25zXG4gIH1cblxuXG4gIHRoaXMubmV4dF9zdGVwID0gKGNoYXJhY3RlciwgY2xvc2VzdF9ub2RlLCB0YXJnZXRfbm9kZSkgPT4ge1xuICAgIC8vIFN0ZXA6IFNlbGVjdCBhbGwgbmVpZ2hib3Vyc1xuICAgIGxldCB2aXNpdGVkID0gW11cbiAgICBsZXQgbm9kZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmMoNDA5NiAvIGdvLnRpbGVfc2l6ZSlcbiAgICBsZXQgb3JpZ2luX2luZGV4ID0gY2xvc2VzdF9ub2RlLmlkXG5cbiAgICBsZXQgbmVpZ2hib3VycyA9IHRoaXMuY2FsY3VsYXRlX25laWdoYm91cnMoY2hhcmFjdGVyKVxuXG4gICAgLy8gU3RlcDogU29ydCBuZWlnaGJvdXJzIGJ5IGRpc3RhbmNlIChzbWFsbGVyIGRpc3RhbmNlIGZpcnN0KVxuICAgIC8vIFdlIGFkZCB0aGUgd2FsayBtb3ZlbWVudCB0byByZS12aXNpdGVkIG5vZGVzIHRvIHNpZ25pZnkgdGhpcyBjb3N0XG4gICAgbGV0IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYyA9IG5laWdoYm91cnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEuZGlzdGFuY2UpIHtcbiAgICAgICAgLy9hLmRpc3RhbmNlICs9IDIgKiBjaGFyYWN0ZXIuc3BlZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEuZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKGEsIHRhcmdldF9ub2RlKVxuICAgICAgfVxuXG4gICAgICBpZiAoYi5kaXN0YW5jZSkge1xuICAgICAgICAvL2IuZGlzdGFuY2UgKz0gY2hhcmFjdGVyLnNwZWVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiLmRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShiLCB0YXJnZXRfbm9kZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlXG4gICAgfSlcblxuICAgIC8vIFN0ZXA6IFNlbGVjdCBvbmx5IG5laWdoYm91ciBub2RlcyB0aGF0IGFyZSBub3QgYmxvY2tlZFxuICAgIG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYyA9IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYy5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBub2RlLmJsb2NrZWQgIT09IHRydWVcbiAgICB9KVxuXG4gICAgLy8gU3RlcDogUmV0dXJuIHRoZSBjbG9zZXN0IHZhbGlkIG5vZGUgdG8gdGhlIHRhcmdldFxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZiB0aGUgY2xvc2VzdCBwb2ludCBpcyB0aGUgdGFyZ2V0IGl0c2VsZlxuICAgIC8vIHJldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgbm93aGVyZSB0byBnb1xuICAgIGlmIChuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZnV0dXJlX25vZGUgPSBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2NbMF1cbiAgICAgIHJldHVybiAoZnV0dXJlX25vZGUuaWQgPT0gdGFyZ2V0X25vZGUuaWQgPyB0cnVlIDogZnV0dXJlX25vZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gZnVuY3Rpb24gKGNoYXJhY3RlciwgdGFyZ2V0X25vZGUpIHtcbiAgICBsZXQgY2hhcl9wb3MgPSB7XG4gICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbnRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKGNoYXJfcG9zKVxuICAgIGxldCBjbG9zZXN0X25vZGUgPSB0aGlzLm5leHRfc3RlcChjaGFyYWN0ZXIsIGN1cnJlbnRfbm9kZSwgdGFyZ2V0X25vZGUpXG5cbiAgICAvLyBXZSBoYXZlIGEgbmV4dCBzdGVwXG4gICAgaWYgKHR5cGVvZiAoY2xvc2VzdF9ub2RlKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgbGV0IGZ1dHVyZV9tb3ZlbWVudCA9IHsgLi4uY2hhcl9wb3MgfVxuICAgICAgbGV0IHhfc3BlZWQgPSAwXG4gICAgICBsZXQgeV9zcGVlZCA9IDBcbiAgICAgIGlmIChjbG9zZXN0X25vZGUueCAhPSBjaGFyYWN0ZXIueCkge1xuICAgICAgICBsZXQgZGlzdGFuY2VfeCA9IGNoYXJfcG9zLnggLSBjbG9zZXN0X25vZGUueFxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VfeCkgPj0gY2hhcmFjdGVyLnNwZWVkKSB7XG4gICAgICAgICAgeF9zcGVlZCA9IChkaXN0YW5jZV94ID4gMCA/IC1jaGFyYWN0ZXIuc3BlZWQgOiBjaGFyYWN0ZXIuc3BlZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNoYXJfcG9zLnggPCBjbG9zZXN0X25vZGUueCkge1xuICAgICAgICAgICAgeF9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3gpICogLTFcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeF9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3gpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjbG9zZXN0X25vZGUueSAhPSBjaGFyYWN0ZXIueSkge1xuICAgICAgICBsZXQgZGlzdGFuY2VfeSA9IGZ1dHVyZV9tb3ZlbWVudC55IC0gY2xvc2VzdF9ub2RlLnlcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlX3kpID49IGNoYXJhY3Rlci5zcGVlZCkge1xuICAgICAgICAgIHlfc3BlZWQgPSAoZGlzdGFuY2VfeSA+IDAgPyAtY2hhcmFjdGVyLnNwZWVkIDogY2hhcmFjdGVyLnNwZWVkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA8IGNsb3Nlc3Rfbm9kZS55KSB7XG4gICAgICAgICAgICB5X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeV9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3kpICogLTFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBmdXR1cmVfbW92ZW1lbnQueCArIHhfc3BlZWRcbiAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gZnV0dXJlX21vdmVtZW50LnkgKyB5X3NwZWVkXG5cbiAgICAgIGNoYXJhY3Rlci5jb29yZHMoZnV0dXJlX21vdmVtZW50KVxuICAgICAgLy8gV2UncmUgYWxyZWFkeSBhdCB0aGUgYmVzdCBzcG90XG4gICAgfSBlbHNlIGlmIChjbG9zZXN0X25vZGUgPT09IHRydWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVhY2hlZFwiKVxuICAgICAgY2hhcmFjdGVyLm1vdmVtZW50X2JvYXJkID0gW11cbiAgICAgIGNoYXJhY3Rlci5tb3ZpbmcgPSBmYWxzZVxuICAgICAgLy8gV2UncmUgc3R1Y2tcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogZ290IHRoaXMgb25jZSBhZnRlciBoYWQgYWxyZWFkeSByZWFjaGVkLiBcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gcGF0aFwiKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFxuIiwiZnVuY3Rpb24gQ2FtZXJhKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNhbWVyYSA9IHRoaXNcbiAgdGhpcy54ID0gMFxuICB0aGlzLnkgPSAwXG4gIHRoaXMuY2FtZXJhX3NwZWVkID0gM1xuXG4gIHRoaXMubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSA9IChldikgPT4ge1xuICAgIC8vaWYgKHRoaXMuZ28uZWRpdG9yLnBhaW50X21vZGUpIHJldHVyblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA8IDEwMCkge1xuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgeSArIHRoZSBtb3ZlbWVudCB3ZSdsbCBtYWtlIGZ1cnRoZXIgdGhlcmUgaXMgZ3JlYXRlciB0aGFuXG4gICAgICAvLyB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBzY3JlZW4gbWludXMgdGhlIGhlaWdodCB0aGF0IHdpbGwgYWxyZWFkeSBiZSB2aXNpYmxlXG4gICAgICAvLyAodGhlIGNhbnZhcyBoZWlnaHQpLCBkb24ndCBnbyBmdXJ0aGVyIG93blxuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSBldi5jbGllbnRZKSA+IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gMTAwKSB7XG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xuICAgIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpIDwgMTAwKSB7XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGgpIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggKyB0aGlzLmNhbWVyYV9zcGVlZFxuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA+IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSAxMDApIHtcbiAgICAgIC8vIERvbid0IGdvIGZ1cnRoZXIgbGVmdFxuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuICB9XG5cbiAgdGhpcy5mb2N1cyA9IChwb2ludCkgPT4ge1xuICAgIGxldCB4ID0gcG9pbnQueCAtIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLyAyXG4gICAgbGV0IHkgPSBwb2ludC55IC0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLyAyXG4gICAgLy8gc3BlY2lmaWMgbWFwIGN1dHMgKGl0IGhhcyBhIG1hcCBvZmZzZXQgb2YgNjAsMTYwKVxuICAgIGlmICh5IDwgMCkgeyB5ID0gMCB9XG4gICAgaWYgKHggPCAwKSB7IHggPSAwIH1cbiAgICBpZiAoeCArIHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggPiB0aGlzLmdvLndvcmxkLndpZHRoKSB7IHggPSB0aGlzLnggfVxuICAgIGlmICh5ICsgdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgPiB0aGlzLmdvLndvcmxkLmhlaWdodCkgeyB5ID0gdGhpcy55IH1cbiAgICAvLyBvZmZzZXQgY2hhbmdlcyBlbmRcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgdGhpcy5nbG9iYWxfY29vcmRzID0gKG9iaikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICB4OiBvYmoueCAtIHRoaXMueCxcbiAgICAgIHk6IG9iai55IC0gdGhpcy55XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbWVyYVxuIiwiZnVuY3Rpb24gQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5kdXJhdGlvbiA9IG51bGxcbiAgICB0aGlzLndpZHRoID0gZW50aXR5LndpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSA1XG4gICAgdGhpcy5jb2xvdXIgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5mdWxsID0gbnVsbFxuICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBudWxsXG4gICAgdGhpcy5sYXN0X3RpbWUgPSBudWxsXG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGxcbiAgICAvLyBTdGF5cyBzdGF0aWMgaW4gYSBwb3NpdGlvbiBpbiB0aGUgbWFwXG4gICAgLy8gTWVhbmluZzogZG9lc24ndCBtb3ZlIHdpdGggdGhlIGNhbWVyYVxuICAgIHRoaXMuc3RhdGljID0gZmFsc2VcbiAgICB0aGlzLnhfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueCA6XG4gICAgICAgICAgICAwO1xuICAgIH1cbiAgICB0aGlzLnlfb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWMgP1xuICAgICAgICAgICAgdGhpcy5nby5jYW1lcmEueSA6XG4gICAgICAgICAgICAwO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnQgPSAoZHVyYXRpb24sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDBcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCA9ICgpID0+IHRoaXMuZHVyYXRpb24gPSBudWxsXG5cbiAgICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5kdXJhdGlvbiA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBlbGFwc2VkX3RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpbWU7XG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gZWxhcHNlZF90aW1lO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50IDw9IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMuZW50aXR5LnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICB0aGlzLnkgPSB0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0ICsgMTAgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsZXQgYmFyX3dpZHRoID0gKCh0aGlzLmN1cnJlbnQgLyB0aGlzLmR1cmF0aW9uKSAqIHRoaXMud2lkdGgpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmNhbGxiYWNrICE9PSBudWxsKSAmJiAodGhpcy5jYWxsYmFjayAhPT0gdW5kZWZpbmVkKSkgdGhpcy5jYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXN0aW5nQmFyXG4iLCJpbXBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCByYW5kb20sIFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuL3Jlc291cmNlX2JhclwiXG5pbXBvcnQgSW52ZW50b3J5IGZyb20gXCIuL2ludmVudG9yeVwiXG5pbXBvcnQgU3RhdHMgZnJvbSBcIi4vYmVoYXZpb3JzL3N0YXRzLmpzXCJcbmltcG9ydCBTcGVsbGNhc3RpbmcgZnJvbSBcIi4vYmVoYXZpb3JzL3NwZWxsY2FzdGluZy5qc1wiXG5pbXBvcnQgRnJvc3Rib2x0IGZyb20gXCIuL3NwZWxscy9mcm9zdGJvbHQuanNcIlxuaW1wb3J0IEJsaW5rIGZyb20gXCIuL3NwZWxscy9ibGluay5qc1wiXG5pbXBvcnQgQ3V0VHJlZSBmcm9tIFwiLi9za2lsbHMvY3V0X3RyZWUuanNcIlxuaW1wb3J0IFNraWxsIGZyb20gXCIuL3NraWxsLmpzXCJcbmltcG9ydCBCcmVha1N0b25lIGZyb20gXCIuL3NraWxscy9icmVha19zdG9uZS5qc1wiXG5pbXBvcnQgTWFrZUZpcmUgZnJvbSBcIi4vc2tpbGxzL21ha2VfZmlyZS5qc1wiXG5pbXBvcnQgQm9hcmQgZnJvbSBcIi4vYm9hcmQuanNcIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vYmVoYXZpb3JzL2xvb3QuanNcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLm5hbWUgPSBgUGxheWVyICR7U3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSkuc2xpY2UoMCwgMil9YFxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJjcmlzaXNjb3JlcGVlcHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pZCA9IGlkXG4gIHRoaXMueCA9IDEwMFxuICB0aGlzLnkgPSAxMDBcbiAgdGhpcy53aWR0aCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28udGlsZV9zaXplICogMlxuICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIHRoaXMuZGlyZWN0aW9uID0gXCJkb3duXCJcbiAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gMFxuICB0aGlzLnNwZWVkID0gMS40XG4gIHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSh7IGdvIH0pO1xuICB0aGlzLnNwZWxsYm9vayA9IHtcbiAgICBmcm9zdGJvbHQ6IG5ldyBGcm9zdGJvbHQoeyBnbywgZW50aXR5OiB0aGlzIH0pLFxuICAgIGJsaW5rOiBuZXcgQmxpbmsoeyBnbywgZW50aXR5OiB0aGlzIH0pXG4gIH1cbiAgdGhpcy5jdXJyZW50X3RhcmdldCA9IHVuZGVmaW5lZFxuICB0aGlzLnNwZWxsX3RhcmdldCA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50X3RhcmdldCB8fCB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZVxuICB9XG4gIHRoaXMuc3BlbGxzID0ge1xuICAgIGZyb3N0Ym9sdDogbmV3IFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHk6IHRoaXMsIHNwZWxsOiB0aGlzLnNwZWxsYm9vay5mcm9zdGJvbHQsIHRhcmdldDogdGhpcy5zcGVsbF90YXJnZXQgfSkuY2FzdCxcbiAgICBibGluazogbmV3IFNwZWxsY2FzdGluZyh7IGdvLCBlbnRpdHk6IHRoaXMsIHNwZWxsOiB0aGlzLnNwZWxsYm9vay5ibGluayB9KS5jYXN0XG4gIH1cbiAgdGhpcy5za2lsbHMgPSB7XG4gICAgY3V0X3RyZWU6IG5ldyBTa2lsbCh7IGdvLCBlbnRpdHk6IHRoaXMsIHNraWxsOiBuZXcgQ3V0VHJlZSh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuYWN0LFxuICAgIGJyZWFrX3N0b25lOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IEJyZWFrU3RvbmUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdCxcbiAgICBtYWtlX2ZpcmU6IG5ldyBTa2lsbCh7IGdvLCBlbnRpdHk6IHRoaXMsIHNraWxsOiBuZXcgTWFrZUZpcmUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdFxuICB9XG4gIHRoaXMuc3RhdHMgPSBuZXcgU3RhdHMoeyBnbywgZW50aXR5OiB0aGlzLCBtYW5hOiA1MCB9KTtcbiAgdGhpcy5oZWFsdGhfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgeV9vZmZzZXQ6IDIwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5tYW5hX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHlfb2Zmc2V0OiAxMCwgY29sb3VyOiBcImJsdWVcIiB9KVxuICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiAyMCB9KVxuICB0aGlzLmV4cGVyaWVuY2VfcG9pbnRzID0gMFxuICB0aGlzLmxldmVsID0gMTtcbiAgdGhpcy51cGRhdGVfeHAgPSAoZW50aXR5KSA9PiB7XG4gICAgdGhpcy5leHBlcmllbmNlX3BvaW50cyArPSAxMDA7XG4gICAgaWYgKHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgPj0gMTAwMCkge1xuICAgICAgdGhpcy5sZXZlbCArPSAxO1xuICAgICAgdGhpcy5leHBlcmllbmNlX3BvaW50cyA9IDA7XG4gICAgfVxuICB9XG4gIHRoaXMuaXNfYnVzeSA9IGZhbHNlXG4gIHRoaXMuaXNfYnVzeV93aXRoID0gbnVsbDtcblxuICB0aGlzLnVwZGF0ZV9mcHMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9tYW5hIDwgdGhpcy5zdGF0cy5tYW5hKSB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSArPSByYW5kb20oMSwgMylcbiAgICBpZiAobmVhcl9ib25maXJlKCkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfaHAgPCB0aGlzLnN0YXRzLmhwKSB0aGlzLnN0YXRzLmN1cnJlbnRfaHAgKz0gcmFuZG9tKDQsIDcpXG4gICAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X21hbmEgPCB0aGlzLnN0YXRzLm1hbmEpIHRoaXMuc3RhdHMuY3VycmVudF9tYW5hICs9IHJhbmRvbSgxLCAzKVxuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgZnVuY3Rpb24gdHJpZXMgdG8gc2VlIGlmIHRoZSBzZWxlY3RlZCBjbGlja2FibGUgaGFzIGEgZGVmYXVsdCBhY3Rpb24gc2V0IGZvciBpbnRlcmFjdGlvblxuICB0aGlzLnNraWxsX2FjdGlvbiA9ICgpID0+IHtcbiAgICBsZXQgb2JqZWN0ID0gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGVcbiAgICBpZiAob2JqZWN0LmFjdGVkX2J5X3NraWxsID09ICdsb290Jykge1xuICAgICAgaWYgKFZlY3RvcjIuZGlzdGFuY2Uob2JqZWN0LCB0aGlzKSA8IG9iamVjdC53aWR0aCArIDIwKSB7XG4gICAgICAgIG5ldyBMb290KHsgZ28sIGVudGl0eTogdGhpcywgbG9vdF9iYWc6IG9iamVjdCB9KS5hY3QoKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2JqZWN0ICYmIHRoaXMuc2tpbGxzW29iamVjdC5hY3RlZF9ieV9za2lsbF0pIHtcbiAgICAgIHRoaXMuc2tpbGxzW29iamVjdC5hY3RlZF9ieV9za2lsbF0oKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZXNjYXBlX2tleSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc19idXN5X3dpdGgpIHtcbiAgICAgIHRoaXMuaXNfYnVzeV93aXRoLnN0b3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nby5zdGFydF9tZW51LmFjdGl2ZSA9ICF0aGlzLmdvLnN0YXJ0X21lbnUuYWN0aXZlXG4gICAgfVxuICB9XG5cbiAgY29uc3QgbmVhcl9ib25maXJlID0gKCkgPT4gdGhpcy5nby5maXJlcy5zb21lKGZpcmUgPT4gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCBmaXJlKSA8IDEwMCk7XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLnRhcmdldF9tb3ZlbWVudCkgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCgpXG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIE1hdGguZmxvb3IodGhpcy53YWxrX2N5Y2xlX2luZGV4KSAqIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUoKSAqIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5zdGF0cy5ocCwgdGhpcy5zdGF0cy5jdXJyZW50X2hwKVxuICAgIHRoaXMubWFuYV9iYXIuZHJhdyh0aGlzLnN0YXRzLm1hbmEsIHRoaXMuc3RhdHMuY3VycmVudF9tYW5hKVxuICB9XG5cbiAgdGhpcy5kcmF3X2NoYXJhY3RlciA9ICh7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSkgPT4ge1xuICAgIHggPSB4ID09PSB1bmRlZmluZWQgPyB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54IDogeFxuICAgIHkgPSB5ID09PSB1bmRlZmluZWQgPyB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55IDogeVxuICAgIHdpZHRoID0gd2lkdGggPT09IHVuZGVmaW5lZCA/IHRoaXMud2lkdGggOiB3aWR0aFxuICAgIGhlaWdodCA9IGhlaWdodCA9PT0gdW5kZWZpbmVkID8gdGhpcy5oZWlnaHQgOiBoZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgTWF0aC5mbG9vcih0aGlzLndhbGtfY3ljbGVfaW5kZXgpICogdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSgpICogdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICB9XG5cbiAgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgcmV0dXJuIDJcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgcmV0dXJuIDNcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICByZXR1cm4gMVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHJldHVybiAwXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZSA9IChkaXJlY3Rpb24pID0+IHtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICAgIGNvbnN0IGZ1dHVyZV9wb3NpdGlvbiA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnksIHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgaWYgKHRoaXMueCArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLndpZHRoICsgdGhpcy5nby53b3JsZC54X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi54ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICBpZiAodGhpcy55IC0gdGhpcy5zcGVlZCA+IHRoaXMuZ28ud29ybGQueV9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueSAtPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICBpZiAodGhpcy54IC0gdGhpcy5zcGVlZCA+IHRoaXMuZ28ud29ybGQueF9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueCAtPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQuaGVpZ2h0ICsgdGhpcy5nby53b3JsZC55X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi55ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ28udHJlZXMuc29tZSh0cmVlID0+IChpc19jb2xsaWRpbmcoZnV0dXJlX3Bvc2l0aW9uLCB0cmVlKSkpKSB7XG4gICAgICB0aGlzLnggPSBmdXR1cmVfcG9zaXRpb24ueFxuICAgICAgdGhpcy55ID0gZnV0dXJlX3Bvc2l0aW9uLnlcbiAgICAgIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9ICh0aGlzLndhbGtfY3ljbGVfaW5kZXggKyAoMC4wMyAqIHRoaXMuc3BlZWQpKSAlIDNcbiAgICAgIHRoaXMuZ28uY2FtZXJhLmZvY3VzKHRoaXMpXG4gICAgICAvLyBUT0RPOiBleHRyYWN0XG4gICAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgICAgYWN0aW9uOiBcIm1vdmVcIixcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgIHBsYXllcjoge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgICAgeTogdGhpcy55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZ28uc2VydmVyLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgICAgIC8vIEVORCAtLSBUT0RPOiBleHRyYWN0XG4gICAgfVxuICB9XG5cbiAgLy8gRXhwZXJpbWVudHNcblxuICBBcnJheS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXSB9XG4gIEFycmF5LnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXNbMF0gfVxuXG4gIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0X21vdmVtZW50ID0gdGhpcy50YXJnZXRfbW92ZW1lbnQpIHtcbiAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgIHRoaXMuZ28uY3R4LmFyYygodGFyZ2V0X21vdmVtZW50LnggLSB0aGlzLmdvLmNhbWVyYS54KSArIDEwLCAodGFyZ2V0X21vdmVtZW50LnkgLSB0aGlzLmdvLmNhbWVyYS55KSArIDEwLCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vIEFVVE8tTU9WRSAocGF0aGZpbmRlcikgLS0gcmVuYW1lIGl0IHRvIG1vdmUgd2hlbiB1c2luZyBwbGF5Z3JvdW5kXG4gIHRoaXMuYXV0b19tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmVtZW50X2JvYXJkLmxlbmd0aCA9PT0gMCkgeyB0aGlzLm1vdmVtZW50X2JvYXJkID0gW10uY29uY2F0KHRoaXMuZ28uYm9hcmQuZ3JpZCkgfVxuICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmdvLmJvYXJkLnRhcmdldF9ub2RlKVxuICB9XG5cbiAgLy8gU3RvcmVzIHRoZSB0ZW1wb3JhcnkgdGFyZ2V0IG9mIHRoZSBtb3ZlbWVudCBiZWluZyBleGVjdXRlZFxuICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IG51bGxcbiAgLy8gU3RvcmVzIHRoZSBwYXRoIGJlaW5nIGNhbGN1bGF0ZWRcbiAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuXG4gIHRoaXMuZmluZF9wYXRoID0gKHRhcmdldF9tb3ZlbWVudCkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG5cbiAgICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IHRhcmdldF9tb3ZlbWVudFxuXG4gICAgaWYgKHRoaXMuY3VycmVudF9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgeDogdGhpcy54ICsgdGhpcy5zcGVlZCwgeTogdGhpcy55ICsgdGhpcy5zcGVlZCB9KVxuICAgIH1cblxuICAgIHZhciBsYXN0X3N0ZXAgPSB7fVxuICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7fVxuXG4gICAgZG8ge1xuICAgICAgbGFzdF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGhbdGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoIC0gMV1cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudCA9IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgICAvLyBUaGlzIGNvZGUgd2lsbCBrZWVwIHRyeWluZyB0byBnbyBiYWNrIHRvIHRoZSBzYW1lIHByZXZpb3VzIGZyb20gd2hpY2ggd2UganVzdCBicmFuY2hlZCBvdXRcbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuXG4gICAgICAvLyBUaGlzIGlzIHByZXR0eSBoZWF2eS4uLiBJdCdzIGNhbGN1bGF0aW5nIGFnYWluc3QgYWxsIHRoZSBiaXRzIGluIHRoZSBtYXAgPVtcbiAgICAgIHZhciBnb2luZ190b19jb2xsaWRlID0gdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSlcbiAgICAgIGlmIChnb2luZ190b19jb2xsaWRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb2xsaXNpb24gYWhlYWQhJylcbiAgICAgICAgdmFyIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueCA9IG5leHRfbW92ZW1lbnQueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBvbiBZXCIpXG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC55ID0gbmV4dF9tb3ZlbWVudC55IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIFhcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9KVxuICAgIH0gd2hpbGUgKChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkgfHwgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSlcblxuICAgIHRoaXMubW92aW5nID0gdHJ1ZVxuICB9XG5cbiAgdGhpcy5tb3ZlX29uX3BhdGggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB2YXIgbmV4dF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGguc2hpZnQoKVxuICAgICAgaWYgKG5leHRfc3RlcCkge1xuICAgICAgICB0aGlzLnggPSBuZXh0X3N0ZXAueFxuICAgICAgICB0aGlzLnkgPSBuZXh0X3N0ZXAueVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdXG5cbiAgdGhpcy5tb3ZlX3RvX3dheXBvaW50ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jb29yZHMobm9kZSlcbiAgfVxuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIC8vdGhpcy5tb3ZlID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50KSB7XG4gIC8vICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgLy8gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxuXG4gIC8vICAgIGlmICgoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPD0gMSkgJiYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpIDw9IDEpKSB7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgLy8gICAgICB0YXJnZXRfbW92ZW1lbnQgPSB7fVxuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiU3RvcHBlZFwiKTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KHRhcmdldF9tb3ZlbWVudClcblxuICAvLyAgICAgIC8vIFBhdGhpbmdcbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgfVxuXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC53aWR0aCA9IHRoaXMud2lkdGhcbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gICAgaWYgKCh0aGlzLmdvLmVudGl0aWVzLmV2ZXJ5KChlbnRpdHkpID0+IGVudGl0eS5pZCA9PT0gdGhpcy5pZCB8fCAhaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgZW50aXR5KSApKSAmJlxuICAvLyAgICAgICghdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSkpKSB7XG4gIC8vICAgICAgdGhpcy54ID0gZnV0dXJlX21vdmVtZW50LnhcbiAgLy8gICAgICB0aGlzLnkgPSBmdXR1cmVfbW92ZW1lbnQueVxuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiQmxvY2tlZFwiKTtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIC8vICAgIH1cbiAgLy8gIH1cbiAgLy8gIC8vIEVORCAtIENoYXJhY3RlciBNb3ZlbWVudFxuICAvL31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDbGlja2FibGUoZ28sIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlX3NyYykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jbGlja2FibGVzLnB1c2godGhpcylcblxuICB0aGlzLm5hbWUgPSBpbWFnZV9zcmNcbiAgdGhpcy54ID0geFxuICB0aGlzLnkgPSB5XG4gIHRoaXMud2lkdGggPSB3aWR0aFxuICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5pbWFnZS5zcmMgPSBpbWFnZV9zcmNcbiAgdGhpcy5hY3RpdmF0ZWQgPSBmYWxzZVxuICB0aGlzLnBhZGRpbmcgPSA1XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCwgdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIGlmICh0aGlzLmFjdGl2YXRlZCkge1xuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcIiNmZmZcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnBhZGRpbmcsIHRoaXMueSAtIHRoaXMucGFkZGluZywgdGhpcy53aWR0aCArICgyKnRoaXMucGFkZGluZyksIHRoaXMuaGVpZ2h0ICsgKDIqdGhpcy5wYWRkaW5nKSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xpY2tcIilcbiAgfVxufVxuIiwiaW1wb3J0IENsaWNrYWJsZSBmcm9tIFwiLi9jbGlja2FibGUuanNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb250cm9scyhnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jb250cm9scyA9IHRoaXNcbiAgdGhpcy53aWR0aCA9IHNjcmVlbi53aWR0aFxuICB0aGlzLmhlaWdodCA9IHNjcmVlbi5oZWlnaHQgKiAwLjRcbiAgdGhpcy5hcnJvd3MgPSB7XG4gICAgdXA6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMCwgODAsIDgwLCBcImFycm93X3VwLnBuZ1wiKSxcbiAgICBsZWZ0OiBuZXcgQ2xpY2thYmxlKGdvLCA1MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X2xlZnQucG5nXCIpLFxuICAgIHJpZ2h0OiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpICsgNzAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19yaWdodC5wbmdcIiksXG4gICAgZG93bjogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEyMCwgODAsIDgwLCBcImFycm93X2Rvd24ucG5nXCIpLFxuICB9XG4gIHRoaXMuYXJyb3dzLnVwLmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJ1cFwiKVxuICB0aGlzLmFycm93cy5kb3duLmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXG4gIHRoaXMuYXJyb3dzLmxlZnQuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIilcbiAgdGhpcy5hcnJvd3MucmlnaHQuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCBzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIE9iamVjdC52YWx1ZXModGhpcy5hcnJvd3MpLmZvckVhY2goYXJyb3cgPT4gYXJyb3cuZHJhdygpKVxuICB9XG59XG4iLCJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGVcIjtcblxuZnVuY3Rpb24gRG9vZGFkKHsgZ28gfSkge1xuICB0aGlzLmdvID0gZ29cblxuICB0aGlzLnggPSAwO1xuICB0aGlzLnkgPSAwO1xuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJwbGFudHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pbWFnZV94X29mZnNldCA9IDBcbiAgdGhpcy5pbWFnZV95X29mZnNldCA9IDBcbiAgdGhpcy53aWR0aCA9IDMyXG4gIHRoaXMuaGVpZ2h0ID0gMzJcbiAgdGhpcy5yZXNvdXJjZV9iYXIgPSBudWxsXG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKHRhcmdldF9wb3NpdGlvbikge1xuICAgIGxldCB4ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi54ID8gdGFyZ2V0X3Bvc2l0aW9uLnggOiB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgbGV0IHkgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnkgPyB0YXJnZXRfcG9zaXRpb24ueSA6IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICBsZXQgd2lkdGggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLndpZHRoID8gdGFyZ2V0X3Bvc2l0aW9uLndpZHRoIDogdGhpcy53aWR0aFxuICAgIGxldCBoZWlnaHQgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA/IHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgOiB0aGlzLmhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLmltYWdlX3hfb2Zmc2V0LCB0aGlzLmltYWdlX3lfb2Zmc2V0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICBpZiAodGFyZ2V0X3Bvc2l0aW9uKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnJlc291cmNlX2Jhcikge1xuICAgICAgdGhpcy5yZXNvdXJjZV9iYXIuZHJhdygpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9IGZ1bmN0aW9uICgpIHsgfVxuICB0aGlzLnVwZGF0ZV9mcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZnVlbCA8PSAwKSB7XG4gICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgZ28uZmlyZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnVlbCAtPSAxO1xuICAgICAgdGhpcy5yZXNvdXJjZV9iYXIuY3VycmVudCAtPSAxO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEb29kYWQ7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFZGl0b3IoeyBnbyB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5nby5lZGl0b3IgPSB0aGlzXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzID0ge1xuICAgICAgICB4OiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtIDMwMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgd2lkdGg6IDMwMCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmdvLnNjcmVlbi5oZWlnaHRcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLngsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoLCB0aGlzLmdvLnNjcmVlbi5oZWlnaHQpXG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLmRyYXdfY2hhcmFjdGVyKHtcbiAgICAgICAgICAgIHg6IHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtICh0aGlzLmdvLmNoYXJhY3Rlci53aWR0aCAvIDIpLFxuICAgICAgICAgICAgeTogNTAsXG4gICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDUwXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICAgICAgdGhpcy5nby5jdHguZm9udCA9IFwiMjFweCBzYW5zLXNlcmlmXCJcbiAgICAgICAgbGV0IHRleHQgPSBgeDogJHt0aGlzLmdvLmNoYXJhY3Rlci54LnRvRml4ZWQoMil9LCB5OiAke3RoaXMuZ28uY2hhcmFjdGVyLnkudG9GaXhlZCgyKX1gXG4gICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dCwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArICh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDUwICsgNTAgKyAyMClcbiAgICAgICAgbGV0IGlkVGV4dCA9IGBpZDogJHt0aGlzLmdvLmNoYXJhY3Rlci5pZC5zdWJzdHIoMCwgOCl9YFxuICAgICAgICB2YXIgaWRUZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQoaWRUZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChpZFRleHQsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtIChpZFRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDEwMCArIDUwICsgMjApXG5cbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB0aGlzLmRyYXdfc2VsZWN0aW9uKCk7XG4gICAgICAgIGlmICh0aGlzLmdvLmNoYXJhY3Rlci5jdXJyZW50X3RhcmdldCkgdGhpcy5kcmF3X2N1cnJlbnRfdGFyZ2V0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3NlbGVjdGlvbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuZHJhdyh7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyIC0gMzUsXG4gICAgICAgICAgICB5OiB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwLFxuICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgaGVpZ2h0OiA3MFxuICAgICAgICB9KVxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwICsgMTAwKVxuXG4gICAgICAgIGxldCBpZFRleHQgPSBgaWQ6ICR7dGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuaWQuc3Vic3RyKDAsIDgpfWBcbiAgICAgICAgdmFyIGlkVGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KGlkVGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQoaWRUZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAoaWRUZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyAyMDAgKyAxNTApXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X2N1cnJlbnRfdGFyZ2V0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmdvLmVudGl0eS5jdXJyZW50X3RhcmdldC5kcmF3KHtcbiAgICAgICAgICAgIHg6IHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIgLSAzNSxcbiAgICAgICAgICAgIHk6IHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyAzMDAsXG4gICAgICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgICAgICBoZWlnaHQ6IDcwXG4gICAgICAgIH0pXG4gICAgICAgIGxldCB0ZXh0ID0gYHg6ICR7dGhpcy5nby5lbnRpdHkuY3VycmVudF90YXJnZXQueC50b0ZpeGVkKDIpfSwgeTogJHt0aGlzLmdvLmVudGl0eS5jdXJyZW50X3RhcmdldC55LnRvRml4ZWQoMil9YFxuICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnkgKyAyMDAgKyAxMDApXG5cbiAgICAgICAgbGV0IGlkVGV4dCA9IGBpZDogJHt0aGlzLmdvLmVudGl0eS5jdXJyZW50X3RhcmdldC5pZC5zdWJzdHIoMCwgOCl9YFxuICAgICAgICB2YXIgaWRUZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQoaWRUZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChpZFRleHQsIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtIChpZFRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDIwMCArIDE1MClcbiAgICB9XG59IiwiLy8gVGhlIGNhbGxiYWNrcyBzeXN0ZW1cbi8vIFxuLy8gVG8gdXNlIGl0OlxuLy9cbi8vICogaW1wb3J0IHRoZSBjYWxsYmFja3MgeW91IHdhbnRcbi8vXG4vLyAgICBpbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuLy9cbi8vICogY2FsbCB0aGVtIGFuZCBzdG9yZSB0aGUgYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zXG4vL1xuLy8gICAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKTtcbi8vXG4vLyAqIGFkZCBvciByZW1vdmUgY2FsbGJhY2tzIGZyb20gYXJyYXlcbi8vXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmZ1bmN0aW9uIHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4gIHJldHVybiBtb3VzZW1vdmVfY2FsbGJhY2tzO1xufVxuXG5cbmZ1bmN0aW9uIHNldENsaWNrQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gW11cbiAgZ28uY2xpY2tfY2FsbGJhY2tzID0gY2xpY2tfY2FsbGJhY2tzXG4gIGNvbnN0IG9uX2NsaWNrICA9IChldikgPT4ge1xuICAgIGNsaWNrX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXYpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbl9jbGljaywgZmFsc2UpXG4gIHJldHVybiBjbGlja19jYWxsYmFja3M7XG59XG5cbmZ1bmN0aW9uIHNldENhbGxiYWNrKGdvLCBldmVudCkge1xuICBjb25zdCBjYWxsYmFja3MgPSBbXVxuICBjb25zdCBoYW5kbGVyID0gKGUpID0+IHtcbiAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGUpXG4gICAgfSlcbiAgfVxuICBnby5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpXG4gIHJldHVybiBjYWxsYmFja3M7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlTW92ZUNhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ21vdXNlbW92ZScpO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZWRvd25DYWxsYmFjayhnbykge1xuICBjb25zdCBjYWxsYmFja19xdWV1ZSA9IHNldENhbGxiYWNrKGdvLCAnbW91c2Vkb3duJyk7XG4gIGdvLm1vdXNlZG93bl9jYWxsYmFja3MgPSBjYWxsYmFja19xdWV1ZVxuICByZXR1cm4gY2FsbGJhY2tfcXVldWVcbn1cblxuZnVuY3Rpb24gc2V0TW91c2V1cENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ21vdXNldXAnKTtcbn1cblxuZnVuY3Rpb24gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoc3RhcnQnKTtcbn1cblxuZnVuY3Rpb24gc2V0VG91Y2hlbmRDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICd0b3VjaGVuZCcpO1xufVxuXG5leHBvcnQge1xuICBzZXRNb3VzZW1vdmVDYWxsYmFjayxcbiAgc2V0Q2xpY2tDYWxsYmFjayxcbiAgc2V0TW91c2VNb3ZlQ2FsbGJhY2ssXG4gIHNldE1vdXNlZG93bkNhbGxiYWNrLFxuICBzZXRNb3VzZXVwQ2FsbGJhY2ssXG4gIHNldFRvdWNoc3RhcnRDYWxsYmFjayxcbiAgc2V0VG91Y2hlbmRDYWxsYmFjayxcbn07XG4iLCIvLyBUaGUgR2FtZSBMb29wXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbi8vIGdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuLy8gZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gcHJvY2Vzc19rZXlzX2Rvd25cbi8vIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZV9sb29wLmxvb3AuYmluZChnYW1lX2xvb3ApKTtcblxuZnVuY3Rpb24gR2FtZUxvb3AoKSB7XG4gIHRoaXMuZHJhdyA9IG51bGxcbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9IG51bGxcbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7fVxuICB0aGlzLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5wcm9jZXNzX2tleXNfZG93bigpXG4gICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB0aGlzLmRyYXcoKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lTG9vcFxuIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5mdW5jdGlvbiBHYW1lT2JqZWN0KCkge1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhc1xuICB0aGlzLmNhbnZhc19yZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLmNhbnZhc19yZWN0LndpZHRoKTtcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLmNhbnZhc19yZWN0LmhlaWdodCk7XG4gIHRoaXMuY3R4ID0gY3R4XG4gIHRoaXMudGlsZV9zaXplID0gMjBcbiAgdGhpcy5jaGFyYWN0ZXIgPSB7fVxuICB0aGlzLmNsaWNrYWJsZXMgPSBbXVxuICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIHRoaXMucGxheWVycyA9IFtdXG4gIHRoaXMuc3BlbGxzID0gW10gLy8gU3BlbGwgc3lzdGVtLCBjb3VsZCBiZSBpbmplY3RlZCBieSBpdCBhcyB3ZWxsXG4gIHRoaXMuc2tpbGxzID0gW107XG4gIHRoaXMudHJlZXMgPSBbXTtcbiAgdGhpcy5maXJlcyA9IFtdO1xuICB0aGlzLnN0b25lcyA9IFtdO1xuICB0aGlzLmxvb3RfYmFncyA9IFtdO1xuICB0aGlzLm1hbmFnZWRfb2JqZWN0cyA9IFtdIC8vIFJhbmRvbSBvYmplY3RzIHRvIGRyYXcvdXBkYXRlXG5cbiAgdGhpcy5kcmF3X29iamVjdHMgPSAoKSA9PiB7XG4gICAgdGhpcy5zdG9uZXMuZm9yRWFjaChzdG9uZSA9PiBzdG9uZS5kcmF3KCkpXG4gICAgdGhpcy50cmVlcy5mb3JFYWNoKHRyZWUgPT4gdHJlZS5kcmF3KCkpXG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5kcmF3KCkpXG4gICAgdGhpcy5maXJlcy5mb3JFYWNoKGZpcmUgPT4gZmlyZS5kcmF3KCkpXG4gICAgdGhpcy5zcGVsbHMuZm9yRWFjaChzcGVsbCA9PiBzcGVsbC5kcmF3KCkpXG4gICAgdGhpcy5za2lsbHMuZm9yRWFjaChza2lsbCA9PiBza2lsbC5kcmF3KCkpXG4gICAgdGhpcy5jcmVlcHMuZm9yRWFjaChjcmVlcCA9PiBjcmVlcC5kcmF3KCkpXG4gICAgdGhpcy5sb290X2JhZ3MuZm9yRWFjaChsb290X2JhZyA9PiBsb290X2JhZy5kcmF3KCkpXG4gICAgdGhpcy5tYW5hZ2VkX29iamVjdHMuZm9yRWFjaChtb2IgPT4gbW9iLmRyYXcoKSlcbiAgfVxuXG4gIHRoaXMudXBkYXRlX29iamVjdHMgPSAoKSA9PiB7XG4gICAgdGhpcy5zcGVsbHMuZm9yRWFjaChzcGVsbCA9PiBzcGVsbC51cGRhdGUoKSlcbiAgICB0aGlzLmxvb3RfYmFncy5mb3JFYWNoKGxvb3RfYmFnID0+IGxvb3RfYmFnLnVwZGF0ZSgpKVxuICAgIHRoaXMubWFuYWdlZF9vYmplY3RzLmZvckVhY2gobW9iID0+IG1vYi51cGRhdGUoKSlcbiAgfVxuXG4gIHRoaXMudXBkYXRlX2Zwc19vYmplY3RzID0gKCkgPT4ge1xuICAgIHRoaXMuZmlyZXMuZm9yRWFjaChmaXJlID0+IGZpcmUudXBkYXRlX2ZwcygpKVxuICB9XG5cbiAgdGhpcy5kcmF3X3NlbGVjdGVkX2NsaWNrYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICAgIHRoaXMuY3R4LnNhdmUoKVxuICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gXCJ5ZWxsb3dcIlxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsIDI1NSwgMCwgMC43KWBcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpXG4gICAgICB0aGlzLmN0eC5hcmMoXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnggKyAodGhpcy5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggLyAyKSAtIHRoaXMuY2FtZXJhLngsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnkgKyAodGhpcy5zZWxlY3RlZF9jbGlja2FibGUuaGVpZ2h0IC8gMikgLSB0aGlzLmNhbWVyYS55LFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS53aWR0aCwgMCwgNTBcbiAgICAgIClcbiAgICAgIHRoaXMuY3R4LnN0cm9rZSgpXG4gICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVPYmplY3QiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZlbnRvcnkoeyBnbyB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLm1heF9zbG90cyA9IDEyXG4gIHRoaXMuc2xvdHNfcGVyX3JvdyA9IDRcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuc2xvdF9wYWRkaW5nID0gMTBcbiAgdGhpcy5zbG90X3dpZHRoID0gNTBcbiAgdGhpcy5zbG90X2hlaWdodCA9IDUwXG4gIHRoaXMuaW5pdGlhbF94ID0gdGhpcy5nby5zY3JlZW4ud2lkdGggLSAodGhpcy5zbG90c19wZXJfcm93ICogdGhpcy5zbG90X3dpZHRoKSAtIDUwO1xuICB0aGlzLmluaXRpYWxfeSA9IHRoaXMuZ28uc2NyZWVuLmhlaWdodCAtICh0aGlzLnNsb3RzX3Blcl9yb3cgKiB0aGlzLnNsb3RfaGVpZ2h0KSAtIDQwMDtcbiAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB0aGlzLnggPSAoKSA9PiB7XG4gICAgY29uc3QgcmlnaHRfcGFuZWxfd2lkdGggPSB0aGlzLmdvLmVkaXRvci5hY3RpdmUgPyB0aGlzLmdvLmVkaXRvci5yaWdodF9wYW5lbF9jb29yZHMud2lkdGggOiAwO1xuICAgIHJldHVybiB0aGlzLmdvLnNjcmVlbi53aWR0aCAtICh0aGlzLnNsb3RzX3Blcl9yb3cgKiB0aGlzLnNsb3Rfd2lkdGgpIC0gNTAgLSByaWdodF9wYW5lbF93aWR0aDtcbiAgfVxuXG4gIHRoaXMuYWRkID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZ19idW5kbGUgPSB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lID09IGl0ZW0ubmFtZVxuICAgIH0pXG5cbiAgICBpZiAoKHRoaXMuc2xvdHMubGVuZ3RoID49IHRoaXMubWF4X3Nsb3RzKSAmJiAoIWV4aXN0aW5nX2J1bmRsZSkpIHJldHVyblxuXG4gICAgY29uc29sZS5sb2coYCoqKiBHb3QgJHtpdGVtLnF1YW50aXR5fSAke2l0ZW0ubmFtZX1gKVxuICAgIGlmIChleGlzdGluZ19idW5kbGUpIHtcbiAgICAgIGV4aXN0aW5nX2J1bmRsZS5xdWFudGl0eSArPSBpdGVtLnF1YW50aXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2xvdHMucHVzaChpdGVtKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZmluZCA9IChpdGVtX25hbWUpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zbG90cy5maW5kKChidW5kbGUpID0+IHtcbiAgICAgIHJldHVybiBidW5kbGUubmFtZS50b0xvd2VyQ2FzZSgpID09IGl0ZW1fbmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMudG9nZ2xlX2Rpc3BsYXkgPSAoKSA9PiB7XG4gICAgdGhpcy5hY3RpdmUgPSAhdGhpcy5hY3RpdmU7XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1heF9zbG90czsgaSsrKSB7XG4gICAgICBsZXQgeCA9IE1hdGguZmxvb3IoaSAlIDQpXG4gICAgICBsZXQgeSA9IE1hdGguZmxvb3IoaSAvIDQpO1xuXG4gICAgICBpZiAoKHRoaXMuc2xvdHNbaV0gIT09IHVuZGVmaW5lZCkgJiYgKHRoaXMuc2xvdHNbaV0gIT09IG51bGwpKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnNsb3RzW2ldO1xuICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UoaXRlbS5pbWFnZSwgdGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSksIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcbiAgICAgICAgaWYgKGl0ZW0ucXVhbnRpdHkgPiAxKSB7XG4gICAgICAgICAgbGV0IHRleHQgPSBpdGVtLnF1YW50aXR5XG4gICAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjI0cHggc2Fucy1zZXJpZlwiXG4gICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dCwgdGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSArICh0aGlzLnNsb3Rfd2lkdGggLSAxNSksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpICsgKHRoaXMuc2xvdF9oZWlnaHQgLSA1KSlcbiAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDFcbiAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VUZXh0KHRleHQsIHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZykgKyAodGhpcy5zbG90X3dpZHRoIC0gMTUpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSArICh0aGlzLnNsb3RfaGVpZ2h0IC0gNSkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsIDAsIDApXCJcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSksIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcbiAgICAgIH1cbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2IoNjAsIDQwLCAwKVwiXG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCgpICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJdGVtKG5hbWUsIGltYWdlLCBxdWFudGl0eSA9IDEsIHNyY19pbWFnZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIGlmIChpbWFnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBzcmNfaW1hZ2VcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmltYWdlID0gaW1hZ2VcbiAgfVxuICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcbn1cbiIsImZ1bmN0aW9uIEtleWJvYXJkSW5wdXQoZ28pIHtcbiAgY29uc3Qgb25fa2V5ZG93biA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gdHJ1ZVxuICAgIC8vIFRoZXNlIGFyZSBjYWxsYmFja3MgdGhhdCBvbmx5IGdldCBjaGVja2VkIG9uY2Ugb24gdGhlIGV2ZW50XG4gICAgaWYgKHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPSBbXVxuICAgIH1cbiAgICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKGV2KSlcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25fa2V5ZG93biwgZmFsc2UpXG4gIGNvbnN0IG9uX2tleXVwID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSBmYWxzZVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25fa2V5dXAsIGZhbHNlKVxuXG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby5rZXlib2FyZF9pbnB1dCA9IHRoaXNcbiAgdGhpcy5rZXlfY2FsbGJhY2tzID0ge1xuICAgIGQ6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIildLFxuICAgIHc6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIildLFxuICAgIGE6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKV0sXG4gICAgczogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXSxcbiAgfVxuICB0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzID0ge1xuICAgIDE6IFtdXG4gIH1cblxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gKCkgPT4ge1xuICAgIGNvbnN0IGtleXNfZG93biA9IE9iamVjdC5rZXlzKHRoaXMua2V5c19jdXJyZW50bHlfZG93bikuZmlsdGVyKChrZXkpID0+IHRoaXMua2V5c19jdXJyZW50bHlfZG93bltrZXldID09PSB0cnVlKVxuICAgIGtleXNfZG93bi5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICghKE9iamVjdC5rZXlzKHRoaXMua2V5X2NhbGxiYWNrcykuaW5jbHVkZXMoa2V5KSkpIHJldHVyblxuXG4gICAgICB0aGlzLmtleV9jYWxsYmFja3Nba2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soKSlcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5rZXltYXAgPSB7XG4gICAgZDogXCJyaWdodFwiLFxuICAgIHc6IFwidXBcIixcbiAgICBhOiBcImxlZnRcIixcbiAgICBzOiBcImRvd25cIixcbiAgfVxuXG4gIHRoaXMua2V5c19jdXJyZW50bHlfZG93biA9IHtcbiAgICBkOiBmYWxzZSxcbiAgICB3OiBmYWxzZSxcbiAgICBhOiBmYWxzZSxcbiAgICBzOiBmYWxzZSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBLZXlib2FyZElucHV0O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vdCB7XG4gICAgY29uc3RydWN0b3IoaXRlbSwgcXVhbnRpdHkgPSAxKSB7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG4gICAgfVxufSIsImltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSwgZGljZSB9IGZyb20gXCIuL3RhcGV0ZVwiXG5pbXBvcnQgSXRlbSBmcm9tIFwiLi9pdGVtXCJcbmltcG9ydCBMb290IGZyb20gXCIuL2xvb3RcIlxuXG5jbGFzcyBMb290Qm94IHtcbiAgICBjb25zdHJ1Y3Rvcihnbykge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZVxuICAgICAgICB0aGlzLmdvID0gZ29cbiAgICAgICAgZ28ubG9vdF9ib3ggPSB0aGlzXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICB0aGlzLnggPSAwXG4gICAgICAgIHRoaXMueSA9IDBcbiAgICAgICAgdGhpcy53aWR0aCA9IDM1MFxuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBtb3ZlcyBhd2F5LCBkZWxldGUgaXRlbXMgYW5kIGhpZGUgbG9vdCBib3ggc2NyZWVuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIChWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIHRoaXMuZ28uY2hhcmFjdGVyKSA+IDUwMCkgfHxcbiAgICAgICAgICAgICh0aGlzLml0ZW1zLmxlbmd0aCA8PSAwKVxuICAgICAgICApIHtcblxuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KVwiO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lSm9pbiA9ICdiZXZlbCc7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgKyAyMCAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaXRlbXMubGVuZ3RoICogNjAgKyA1KTtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjAwLCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgKyAyMCAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaXRlbXMubGVuZ3RoICogNjAgKyA1KTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBsb290ID0gdGhpcy5pdGVtc1tpbmRleF1cbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsIDAsIDApXCJcbiAgICAgICAgICAgIGxvb3QueCA9IHRoaXMueCArIDI1IC0gdGhpcy5nby5jYW1lcmEueFxuICAgICAgICAgICAgbG9vdC55ID0gdGhpcy55ICsgKGluZGV4ICogNjApICsgMjUgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgICAgICAgICBsb290LndpZHRoID0gMzQwXG4gICAgICAgICAgICBsb290LmhlaWdodCA9IDU1XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdChsb290LngsIGxvb3QueSwgbG9vdC53aWR0aCwgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UobG9vdC5pdGVtLmltYWdlLCBsb290LnggKyA1LCBsb290LnkgKyA1LCA0NSwgNDUpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gJzIycHggc2VyaWYnXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChsb290LnF1YW50aXR5LCBsb290LnggKyA2NSwgbG9vdC55ICsgMzUpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChsb290Lml0ZW0ubmFtZSwgbG9vdC54ICsgMTAwLCBsb290LnkgKyAzNSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWVcbiAgICAgICAgdGhpcy54ID0gdGhpcy5nby5jaGFyYWN0ZXIueFxuICAgICAgICB0aGlzLnkgPSB0aGlzLmdvLmNoYXJhY3Rlci55XG4gICAgfVxuXG4gICAgdGFrZV9sb290KGxvb3RfaW5kZXgpIHtcbiAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zLnNwbGljZShsb290X2luZGV4LCAxKVswXVxuICAgICAgICBpZiAodGhpcy5sb290X2JhZykge1xuICAgICAgICAgICAgdGhpcy5sb290X2JhZy5pdGVtcy5zcGxpY2UobG9vdF9pbmRleCwgMSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5pbnZlbnRvcnkuYWRkKGxvb3QuaXRlbSlcbiAgICB9XG5cbiAgICBjaGVja19pdGVtX2NsaWNrZWQoZXYpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVyblxuXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChsb290KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChldi5jbGllbnRYID49IGxvb3QueCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA8PSBsb290LnggKyBsb290LndpZHRoKSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRZID49IGxvb3QueSkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA8PSBsb290LnkgKyBsb290LmhlaWdodClcbiAgICAgICAgICAgIClcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy50YWtlX2xvb3QoaW5kZXgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByb2xsX2xvb3QobG9vdF90YWJsZSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gbG9vdF90YWJsZS5tYXAoKGxvb3RfZW50cnkpID0+IHtcbiAgICAgICAgICAgIGxldCByb2xsID0gZGljZSgxMDApXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgKioqIExvb3Qgcm9sbCBmb3IgJHtsb290X2VudHJ5Lml0ZW0ubmFtZX06ICR7cm9sbH0gKGNoYW5jZTogJHtsb290X2VudHJ5LmNoYW5jZX0pYClcbiAgICAgICAgICAgIGlmIChyb2xsIDw9IGxvb3RfZW50cnkuY2hhbmNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbV9idW5kbGUgPSBuZXcgSXRlbShsb290X2VudHJ5Lml0ZW0ubmFtZSlcbiAgICAgICAgICAgICAgICBpdGVtX2J1bmRsZS5pbWFnZS5zcmMgPSBsb290X2VudHJ5Lml0ZW0uaW1hZ2Vfc3JjXG4gICAgICAgICAgICAgICAgaXRlbV9idW5kbGUucXVhbnRpdHkgPSByYW5kb20obG9vdF9lbnRyeS5taW4sIGxvb3RfZW50cnkubWF4KVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTG9vdChpdGVtX2J1bmRsZSwgaXRlbV9idW5kbGUucXVhbnRpdHkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmZpbHRlcigoZW50cnkpID0+IGVudHJ5ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vdEJveCIsImZ1bmN0aW9uIE5vZGUoZGF0YSkge1xuICB0aGlzLmlkID0gZGF0YS5pZFxuICB0aGlzLnggPSBkYXRhLnhcbiAgdGhpcy55ID0gZGF0YS55XG4gIHRoaXMud2lkdGggPSBkYXRhLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHRcbiAgdGhpcy5jb2xvdXIgPSBcInRyYW5zcGFyZW50XCJcbiAgdGhpcy5ib3JkZXJfY29sb3VyID0gXCJibGFja1wiXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhcnRpY2xlKGdvKSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh7IHgsIHkgfSkge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyh4IC0gdGhpcy5nby5jYW1lcmEueCwgeSAtIHRoaXMuZ28uY2FtZXJhLnksIDE1LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmx1ZSc7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSAnbGlnaHRibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlKCk7XG4gICAgfVxufSIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9wYXJ0aWNsZS5qc1wiXG5pbXBvcnQgeyBWZWN0b3IyLCByYW5kb20gfSBmcm9tIFwiLi90YXBldGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUHJvamVjdGlsZSh7IGdvLCBzdWJqZWN0IH0pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5wYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZShnbyk7XG4gICAgdGhpcy5zdGFydF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSBudWxsXG4gICAgdGhpcy5lbmRfcG9zaXRpb24gPSBudWxsXG4gICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdFxuICAgIHRoaXMudHJhY2VfY291bnQgPSA3XG4gICAgdGhpcy5ib3VuZHMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuY3VycmVudF9wb3NpdGlvbiwgd2lkdGg6IDUsIGhlaWdodDogNSB9XG4gICAgfVxuICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5hY3QgPSAoeyBzdGFydF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgdGhpcy5zdGFydF9wb3NpdGlvbiA9IHN0YXJ0X3Bvc2l0aW9uXG4gICAgICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IE9iamVjdC5jcmVhdGUodGhpcy5zdGFydF9wb3NpdGlvbilcbiAgICAgICAgdGhpcy5lbmRfcG9zaXRpb24gPSBlbmRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKFZlY3RvcjIuZGlzdGFuY2UodGhpcy5lbmRfcG9zaXRpb24sIHRoaXMuY3VycmVudF9wb3NpdGlvbikgPCA1KSB7XG4gICAgICAgICAgICB0aGlzLnN1YmplY3QuZW5kKCk7XG4gICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy50cmFjZS5wdXNoKE9iamVjdC5jcmVhdGUodGhpcy5jdXJyZW50X3Bvc2l0aW9uKSlcbiAgICAgICAgdGhpcy50cmFjZSA9IHRoaXMudHJhY2Uuc2xpY2UoLTEgKiB0aGlzLnRyYWNlX2NvdW50KVxuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucGFydGljbGUuZHJhdyh0aGlzLmN1cnJlbnRfcG9zaXRpb24pO1xuICAgICAgICB0aGlzLnRyYWNlLmZvckVhY2godHJhY2VkX3Bvc2l0aW9uID0+IHRoaXMucGFydGljbGUuZHJhdyh0cmFjZWRfcG9zaXRpb24pKVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY2FsY3VsYXRlX3Bvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBhbmdsZSA9IFZlY3RvcjIuYW5nbGUodGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB0aGlzLmVuZF9wb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHNwZWVkID0gcmFuZG9tKDMsIDEyKTtcbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnggKyBzcGVlZCAqIE1hdGguY29zKGFuZ2xlKSxcbiAgICAgICAgICAgIHk6IHRoaXMuY3VycmVudF9wb3NpdGlvbi55ICsgc3BlZWQgKiBNYXRoLnNpbihhbmdsZSlcbiAgICAgICAgfVxuICAgIH1cbn0iLCJmdW5jdGlvbiBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQsIHlfb2Zmc2V0ID0gMTAsIGNvbG91ciA9IFwicmVkXCIsIGJvcmRlciwgZml4ZWQgfSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy50YXJnZXQgPSB0YXJnZXRcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLnRhcmdldC53aWR0aCAvIDEwO1xuICB0aGlzLmNvbG91ciA9IGNvbG91clxuICB0aGlzLmZ1bGwgPSAxMDBcbiAgdGhpcy5jdXJyZW50ID0gMTAwXG4gIHRoaXMueV9vZmZzZXQgPSB5X29mZnNldFxuICB0aGlzLmJvcmRlciA9IGJvcmRlclxuICB0aGlzLmZpeGVkID0gZml4ZWQgfHwgZmFsc2VcbiAgdGhpcy54ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmZpeGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQueDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnggLSB0aGlzLmdvLmNhbWVyYS54O1xuICAgIH1cbiAgfVxuICB0aGlzLnkgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuZml4ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC55O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQueSAtIHRoaXMuZ28uY2FtZXJhLnk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gKGZ1bGwgPSB0aGlzLmZ1bGwsIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQsIGRlYnVnID0gZmFsc2UpID0+IHtcbiAgICBsZXQgYmFyX3dpZHRoID0gKCgoTWF0aC5taW4oY3VycmVudCwgZnVsbCkpIC8gZnVsbCkgKiB0aGlzLnRhcmdldC53aWR0aClcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMuYm9yZGVyIHx8IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCgpLCB0aGlzLnkoKSAtIHRoaXMueV9vZmZzZXQsIHRoaXMudGFyZ2V0LndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSwgdGhpcy55KCkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvdXJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSwgdGhpcy55KCkgLSB0aGlzLnlfb2Zmc2V0LCBiYXJfd2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlQmFyXG4iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuZnVuY3Rpb24gU2NyZWVuKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLnNjcmVlbiA9IHRoaXNcbiAgdGhpcy53aWR0aCAgPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoO1xuICB0aGlzLmhlaWdodCA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0O1xuICB0aGlzLnJhZGl1cyA9IDcwMFxuXG4gIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY2FudmFzLndpZHRoID0gdGhpcy5nby5jYW52YXMuY2xpZW50V2lkdGhcbiAgICB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICB0aGlzLmdvLmNhbnZhc19yZWN0ID0gdGhpcy5nby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLmNsZWFyKClcbiAgICB0aGlzLmdvLndvcmxkLmRyYXcoKVxuICB9XG5cbiAgdGhpcy5kcmF3X2dhbWVfb3ZlciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC43KVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5nby5jdHguZm9udCA9ICc3MnB4IHNlcmlmJ1xuICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KFwiR2FtZSBPdmVyXCIsICh0aGlzLmdvLmNhbnZhcy53aWR0aCAvIDIpIC0gKHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KFwiR2FtZSBPdmVyXCIpLndpZHRoIC8gMiksIHRoaXMuZ28uY2FudmFzLmhlaWdodCAvIDIpO1xuICB9XG5cbiAgdGhpcy5kcmF3X2ZvZyA9IChyYWRpdXMpID0+IHtcbiAgICB2YXIgeCA9IHRoaXMuZ28uY2hhcmFjdGVyLnggKyB0aGlzLmdvLmNoYXJhY3Rlci53aWR0aCAvIDIgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgdmFyIHkgPSB0aGlzLmdvLmNoYXJhY3Rlci55ICsgdGhpcy5nby5jaGFyYWN0ZXIuaGVpZ2h0IC8gMiAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICB2YXIgZ3JhZGllbnQgPSB0aGlzLmdvLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByYWRpdXMgfHwgdGhpcy5yYWRpdXMpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLCAwLCAwLCAwKScpXG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsIDAsIDAsIDEpJylcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudFxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHNjcmVlbi53aWR0aCwgc2NyZWVuLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlcnZlcihnbywgcGxheWVyKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLnBsYXllciA9IHBsYXllclxuICB0aGlzLmdvLmNoYXJhY3RlciA9IHBsYXllclxuICBnby5zZXJ2ZXIgPSB0aGlzXG5cbiAgdGhpcy5jb25uID0gdW5kZWZpbmVkO1xuICB0aGlzLmNvbm5lY3QgPSAoKSA9PiB7XG4gICAgdGhpcy5jb25uID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjMwMTBcIik7XG4gICAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMubG9naW4odGhpcy5nby5jaGFyYWN0ZXIpXG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHBheWxvYWQgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpXG4gICAgICBjb25zb2xlLmxvZyhwYXlsb2FkKVxuICAgICAgc3dpdGNoIChwYXlsb2FkLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcImxvZ2luXCIsIFwiZmlyc3RMb2FkXCI6XG4gICAgICAgICAgZmlyc3RfbG9hZChwYXlsb2FkKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibW92ZUxvYWRcIjpcbiAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLmdvLnBsYXllcnMuZmluZChwbGF5ZXIgPT4gcGF5bG9hZC5wbGF5ZXIuaWQgPT09IHBsYXllci5pZClcbiAgICAgICAgICBpZiAoIXBsYXllcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5ZXIgbm90IGZvdW5kXCIpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBsYXllci5pZCA9PT0gdGhpcy5nby5jaGFyYWN0ZXIuaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgbW92ZUxvYWQgZm9yIHNlbGZcIilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFBsYXllciBmb3VuZDogJHtwbGF5ZXIubmFtZX1gKVxuICAgICAgICAgIH1cbiAgICAgICAgICBwbGF5ZXIueCA9IHBheWxvYWQudGFyZ2V0LnhcbiAgICAgICAgICBwbGF5ZXIueSA9IHBheWxvYWQudGFyZ2V0LnlcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1BsYXllckxvYWRcIjpcbiAgICAgICAgICBjb25zdCBuZXdfcGxheWVyID0gbmV3IENoYXJhY3RlcihnbylcbiAgICAgICAgICBuZXdfcGxheWVyLmlkID0gcGF5bG9hZC5wbGF5ZXIuaWRcbiAgICAgICAgICBuZXdfcGxheWVyLnggPSBwYXlsb2FkLnBsYXllci5wb3NpdGlvbi54XG4gICAgICAgICAgbmV3X3BsYXllci55ID0gcGF5bG9hZC5wbGF5ZXIucG9zaXRpb24ueVxuICAgICAgICAgIGdvLnBsYXllcnMucHVzaChuZXdfcGxheWVyKVxuICAgICAgICAgIGdvLmNsaWNrYWJsZXMucHVzaChuZXdfcGxheWVyKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGFtYWdlTG9hZFwiOlxuICAgICAgICAgIGxldCBkYW1hZ2VkX3BsYXllciA9IHRoaXMuZ28ucGxheWVycy5maW5kKHBsYXllciA9PiBwYXlsb2FkLnBsYXllci5pZCA9PT0gcGxheWVyLmlkKVxuICAgICAgICAgIGlmICghZGFtYWdlZF9wbGF5ZXIgJiYgKHBheWxvYWQucGxheWVyLmlkID09PSB0aGlzLmdvLmNoYXJhY3Rlci5pZCkpIHtcbiAgICAgICAgICAgIGRhbWFnZWRfcGxheWVyID0gdGhpcy5nby5jaGFyYWN0ZXJcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFkYW1hZ2VkX3BsYXllcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5ZXIgbm90IGZvdW5kXCIpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgZGFtYWdlZF9wbGF5ZXIuc3RhdHMuY3VycmVudF9ocCAtPSBwYXlsb2FkLmRhbWFnZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBcInNwZWxsY2FzdGluZ1N0YXJ0ZWRMb2FkXCI6XG4gICAgICAgICAgY29uc29sZS5sb2coXCJjYXN0aW5nIHNwZWxsXCIpXG4gICAgICAgICAgY29uc3QgY2FzdGluZ19wbGF5ZXIgPSB0aGlzLmdvLnBsYXllcnMuZmluZChwbGF5ZXIgPT4gcGF5bG9hZC5jYXN0ZXIuaWQgPT09IHBsYXllci5pZClcbiAgICAgICAgICBpZiAoIWNhc3RpbmdfcGxheWVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciBub3QgZm91bmQgb3IgaXMgbXlzZWxmXCIpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgYWxsX3BsYXllcnMgPSBbLi4udGhpcy5nby5wbGF5ZXJzLCB0aGlzLmdvLmNoYXJhY3Rlcl1cbiAgICAgICAgICBjb25zdCB0YXJnZXRfcGxheWVyID0gYWxsX3BsYXllcnMuZmluZChwbGF5ZXIgPT4gcGF5bG9hZC50YXJnZXQuaWQgPT09IHBsYXllci5pZClcbiAgICAgICAgICBjYXN0aW5nX3BsYXllci5jdXJyZW50X3RhcmdldCA9IHRhcmdldF9wbGF5ZXJcbiAgICAgICAgICBjYXN0aW5nX3BsYXllci5zcGVsbHNbcGF5bG9hZC5zcGVsbC5pZC5yZXBsYWNlKFwic3BlbGxfXCIsIFwiXCIpXShmYWxzZSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwicGluZ1wiOlxuICAgICAgICAvL2dvLmN0eC5maWxsUmVjdChwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLngsIHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueSwgNTAsIDUwKVxuICAgICAgICAvL2dvLmN0eC5zdHJva2UoKVxuICAgICAgICAvL2xldCBwbGF5ZXIgPSBwbGF5ZXJzWzBdIC8vcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIubmFtZSA9PT0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lKVxuICAgICAgICAvL2lmIChwbGF5ZXIpIHtcbiAgICAgICAgLy8gIHBsYXllci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4gICAgICAgIC8vICBwbGF5ZXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICAvL31cbiAgICAgICAgLy9icmVhaztcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcylcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcnN0X2xvYWQocGF5bG9hZCwgcGxheWVyKSB7XG4gICAgZ28uY2hhcmFjdGVyLmlkID0gcGF5bG9hZC5jdXJyZW50UGxheWVyLmlkXG4gICAgZ28uY2hhcmFjdGVyLm5hbWUgPSBwYXlsb2FkLmN1cnJlbnRQbGF5ZXIubmFtZVxuICAgIGdvLmNoYXJhY3Rlci54ID0gcGF5bG9hZC5jdXJyZW50UGxheWVyLnBvc2l0aW9uLnhcbiAgICBnby5jaGFyYWN0ZXIueSA9IHBheWxvYWQuY3VycmVudFBsYXllci5wb3NpdGlvbi55XG4gICAgcGF5bG9hZC5vdGhlclBsYXllcnMuZm9yRWFjaCgob3RoZXJQbGF5ZXJQYXlsb2FkKSA9PiB7XG4gICAgICBsZXQgb3RoZXJQbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuICAgICAgb3RoZXJQbGF5ZXIuaWQgPSBvdGhlclBsYXllclBheWxvYWQuaWRcbiAgICAgIG90aGVyUGxheWVyLnggPSBvdGhlclBsYXllclBheWxvYWQucG9zaXRpb24ueFxuICAgICAgb3RoZXJQbGF5ZXIueSA9IG90aGVyUGxheWVyUGF5bG9hZC5wb3NpdGlvbi55XG4gICAgICBnby5wbGF5ZXJzLnB1c2gob3RoZXJQbGF5ZXIpXG4gICAgICBnby5jbGlja2FibGVzLnB1c2gob3RoZXJQbGF5ZXIpXG4gICAgfSlcbiAgICBnby5jYW1lcmEuZm9jdXMoZ28uY2hhcmFjdGVyKVxuICB9XG5cbiAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJsb2dpblwiLFxuICAgICAgYXJnczoge1xuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICBpZDogY2hhcmFjdGVyLmlkLFxuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICB9LFxuICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cblxuICB0aGlzLnBpbmcgPSBmdW5jdGlvbiAoY2hhcmFjdGVyKSB7XG4gICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICBhY3Rpb246IFwicGluZ1wiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSxcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTa2lsbCh7IGdvLCBlbnRpdHksIHNraWxsIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuc2tpbGwgPSBza2lsbFxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2tpbGwuYWN0KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJlbW92ZV9jbGlja2FibGUsIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBicmVha19zdG9uZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5IHx8IGdvLmNoYXJhY3RlclxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IHRoaXMuZW50aXR5IH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfc3RvbmUgPSB0aGlzLmdvLnN0b25lcy5maW5kKChzdG9uZSkgPT4gc3RvbmUgPT09IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICAgICAgICBpZiAoKCF0YXJnZXRlZF9zdG9uZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZW50aXR5KSA+IDEwMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgzMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ28uc3RvbmVzLmluZGV4T2YodGFyZ2V0ZWRfc3RvbmUpXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdChsb290X3RhYmxlX3N0b25lKVxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRhcmdldGVkX3N0b25lLCB0aGlzLmdvLnN0b25lcylcbiAgICAgICAgICAgICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3N0b25lLCB0aGlzLmdvKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgbG9vdF90YWJsZV9zdG9uZSA9IFt7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJGbGludHN0b25lXCIsIGltYWdlX3NyYzogXCJmbGludHN0b25lLnBuZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjaGFuY2U6IDEwMFxuICAgIH1dXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiXG5pbXBvcnQgeyBWZWN0b3IyLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIHJlbW92ZV9jbGlja2FibGUgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3V0VHJlZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5sb290X2JveCA9IGdvLmxvb3RfYm94XG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTsgLy8gTWF5YmUgR2FtZU9iamVjdCBzaG91bGQgY29udHJvbCB0aGlzIHRvZ2dsZVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3RyZWUgPSB0aGlzLmdvLnRyZWVzLmZpbmQoKHRyZWUpID0+IHRyZWUgPT09IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICAgICAgICBpZiAoKCF0YXJnZXRlZF90cmVlKSB8fCAoVmVjdG9yMi5kaXN0YW5jZSh0YXJnZXRlZF90cmVlLCB0aGlzLmdvLmNoYXJhY3RlcikgPiAyMDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdvLnRyZWVzLmluZGV4T2YodGFyZ2V0ZWRfdHJlZSlcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vdGJveGVzIGhhdmUgdG8gbW92ZSBmcm9tIHdlaXJkXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KHRoaXMubG9vdF90YWJsZSlcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0YXJnZXRlZF90cmVlLCB0aGlzLmdvLnRyZWVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF90cmVlLCB0aGlzLmdvKVxuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmxvb3RfdGFibGUgPSBbe1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiV29vZFwiLCBpbWFnZV9zcmM6IFwiYnJhbmNoLnBuZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAzLFxuICAgICAgICBjaGFuY2U6IDk1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiRHJ5IExlYXZlc1wiLCBpbWFnZV9zcmM6IFwibGVhdmVzLmpwZWdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMyxcbiAgICAgICAgY2hhbmNlOiAxMDBcbiAgICAgIH1dXG4gICAgICBcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCI7XG5pbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi4vcmVzb3VyY2VfYmFyXCI7XG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1ha2VGaXJlKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5IHx8IGdvLmNoYXJhY3RlclxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IHRoaXMuZW50aXR5IH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRyeV9sZWF2ZXMgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcImRyeSBsZWF2ZXNcIilcbiAgICAgICAgbGV0IHdvb2QgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcIndvb2RcIilcbiAgICAgICAgbGV0IGZsaW50c3RvbmUgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcImZsaW50c3RvbmVcIilcbiAgICAgICAgaWYgKGRyeV9sZWF2ZXMgJiYgZHJ5X2xlYXZlcy5xdWFudGl0eSA+IDAgJiZcbiAgICAgICAgICAgIHdvb2QgJiYgd29vZC5xdWFudGl0eSA+IDAgJiZcbiAgICAgICAgICAgIGZsaW50c3RvbmUgJiYgZmxpbnRzdG9uZS5xdWFudGl0eSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZHJ5X2xlYXZlcy5xdWFudGl0eSAtPSAxXG4gICAgICAgICAgICAgICAgd29vZC5xdWFudGl0eSAtPSAxXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnR5cGUgPT09IFwiQk9ORklSRVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJlID0gdGhpcy5nby5maXJlcy5maW5kKChmaXJlKSA9PiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZmlyZSk7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuZnVlbCArPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCArPSAyMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnR5cGUgPSBcIkJPTkZJUkVcIlxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlLnNyYyA9IFwiYm9uZmlyZS5wbmdcIlxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3hfb2Zmc2V0ID0gMjUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfeV9vZmZzZXQgPSAyNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV9oZWlnaHQgPSAzNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV93aWR0aCA9IDMwMFxuICAgICAgICAgICAgICAgICAgICBmaXJlLndpZHRoID0gNjRcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5oZWlnaHQgPSA2NFxuICAgICAgICAgICAgICAgICAgICBmaXJlLnggPSB0aGlzLmVudGl0eS54O1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnkgPSB0aGlzLmVudGl0eS55O1xuICAgICAgICAgICAgICAgICAgICBmaXJlLmZ1ZWwgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbzogdGhpcy5nbywgdGFyZ2V0OiBmaXJlIH0pXG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLnN0YXRpYyA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuZnVsbCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uZmlyZXMucHVzaChmaXJlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaChmaXJlKVxuICAgICAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTUwMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWW91IGRvbnQgaGF2ZSBhbGwgcmVxdWlyZWQgbWF0ZXJpYWxzIHRvIG1ha2UgYSBmaXJlLlwiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsaW5rKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5pZCA9IFwic3BlbGxfYmxpbmtcIlxuICAgIHRoaXMuaWNvbiA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuaWNvbi5zcmMgPSBcImJsaW5rX3NwZWxsLmpwZ1wiXG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5tYW5hX2Nvc3QgPSA3XG4gICAgdGhpcy5jYXN0aW5nX3RpbWVfaW5fbXMgPSAwXG4gICAgdGhpcy5sYXN0X2Nhc3RfYXQgPSBudWxsXG4gICAgdGhpcy5jb29sZG93bl90aW1lX2luX21zID0gNzAwMFxuICAgIHRoaXMub25fY29vbGRvd24gPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3RfY2FzdF9hdCAmJiBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X2Nhc3RfYXQgPCB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXNcbiAgICB9XG5cbiAgICB0aGlzLmlzX3ZhbGlkID0gKCkgPT4gIXRoaXMub25fY29vbGRvd24oKVxuICAgIFxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gMztcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSAncHVycGxlJ1xuICAgICAgICB0aGlzLmdvLmN0eC5hcmModGhpcy5nby5tb3VzZV9wb3NpdGlvbi54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy5nby5tb3VzZV9wb3NpdGlvbi55IC0gdGhpcy5nby5jYW1lcmEueSwgNTAsIDAsIE1hdGguUEkgKiAyKVxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4geyB9XG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpXG4gICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoY2xpY2tfY2FsbGJhY2ssIHRoaXMuZ28ubW91c2Vkb3duX2NhbGxiYWNrcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5nby5zcGVsbHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goY2xpY2tfY2FsbGJhY2spXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuZW50aXR5LmN1cnJlbnRfbWFuYSAtPSB0aGlzLm1hbmFfY29zdFxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpXG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjbGlja19jYWxsYmFjaywgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzKVxuICAgICAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcy5lbnRpdHkpXG4gICAgfVxuXG4gICAgY29uc3QgY2xpY2tfY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50aXR5LnggPSB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLng7XG4gICAgICAgIHRoaXMuZW50aXR5LnkgPSB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnk7XG4gICAgICAgIHRoaXMuZW5kKCk7XG4gICAgfVxufSIsImltcG9ydCBQcm9qZWN0aWxlIGZyb20gXCIuLi9wcm9qZWN0aWxlXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgaXNfY29sbGlkaW5nLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRnJvc3Rib2x0KHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5pZCA9IFwic3BlbGxfZnJvc3Rib2x0XCJcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuaWNvbiA9IG5ldyBJbWFnZSgpXG4gICAgdGhpcy5pY29uLnNyYyA9IFwiaHR0cHM6Ly9jZG5hLmFydHN0YXRpb24uY29tL3AvYXNzZXRzL2ltYWdlcy9pbWFnZXMvMDA5LzAzMS8xOTAvbGFyZ2UvcmljaGFyZC10aG9tYXMtcGFpbnRzLTExLXYyLmpwZ1wiXG4gICAgdGhpcy5wcm9qZWN0aWxlID0gbmV3IFByb2plY3RpbGUoeyBnbywgc3ViamVjdDogdGhpcyB9KVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm1hbmFfY29zdCA9IDE1XG4gICAgdGhpcy5jYXN0aW5nX3RpbWVfaW5fbXMgPSAxNTAwXG4gICAgdGhpcy5sYXN0X2Nhc3RfYXQgPSBudWxsXG4gICAgdGhpcy5jb29sZG93bl90aW1lX2luX21zID0gMTAwXG4gICAgdGhpcy5vbl9jb29sZG93biA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdF9jYXN0X2F0ICYmIERhdGUubm93KCkgLSB0aGlzLmxhc3RfY2FzdF9hdCA8IHRoaXMuY29vbGRvd25fdGltZV9pbl9tc1xuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnByb2plY3RpbGUuZHJhdygpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd19zbG90ID0gKHNsb3QpID0+IHtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1nLCB4LCB5LCB0aGlzLmdvLmFjdGlvbl9iYXIuc2xvdF93aWR0aCwgdGhpcy5nby5hY3Rpb25fYmFyLnNsb3RfaGVpZ2h0KVxuICAgICAgICBcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgICAgaWYgKChpc19jb2xsaWRpbmcodGhpcy5wcm9qZWN0aWxlLmJvdW5kcygpLCB0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKSkpKSB7XG4gICAgICAgICAgICBpZiAoZGFtYWdlYWJsZSh0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSByYW5kb20oNSwgMTApICogdGhpcy5lbnRpdHkubGV2ZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkuc3RhdHMudGFrZV9kYW1hZ2UoeyBkYW1hZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aWxlLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzX3ZhbGlkID0gKCkgPT4gIXRoaXMub25fY29vbGRvd24oKSAmJiAodGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkgJiYgdGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkuc3RhdHMpXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgIGlmICgodGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkgPT09IG51bGwpIHx8ICh0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKSA9PT0gdW5kZWZpbmVkKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHN0YXJ0X3Bvc2l0aW9uID0geyB4OiB0aGlzLmVudGl0eS54ICsgNTAsIHk6IHRoaXMuZW50aXR5LnkgKyA1MCB9XG4gICAgICAgIGNvbnN0IGVuZF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LnNwZWxsX3RhcmdldCgpLnggKyB0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKS53aWR0aCAvIDIsXG4gICAgICAgICAgICB5OiB0aGlzLmVudGl0eS5zcGVsbF90YXJnZXQoKS55ICsgdGhpcy5lbnRpdHkuc3BlbGxfdGFyZ2V0KCkuaGVpZ2h0IC8gMlxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5hY3QoeyBzdGFydF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uIH0pXG5cbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgICAgIHRoaXMuZ28uc3BlbGxzLnB1c2godGhpcylcbiAgICB9XG5cbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc3BlbGxzKTtcbiAgICAgICAgdGhpcy5sYXN0X2Nhc3RfYXQgPSBEYXRlLm5vdygpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGFtYWdlYWJsZShvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5zdGF0cyAhPT0gdW5kZWZpbmVkICYmIG9iamVjdC5zdGF0cy50YWtlX2RhbWFnZSAhPT0gdW5kZWZpbmVkXG4gICAgfVxufSIsImltcG9ydCB7IGlzX2NvbGxpZGluZyB9IGZyb20gXCIuL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YXJ0TWVudSh7IGdvIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmdvLnN0YXJ0X21lbnUgPSB0aGlzXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5idXR0b25fd2lkdGggPSAzMDBcbiAgICB0aGlzLmJ1dHRvbl9oZWlnaHQgPSA1MFxuXG4gICAgdGhpcy5jaGVja19idXR0b25fY2xpY2tlZCA9IChldikgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGNsaWNrID0geyB4OiBldi5jbGllbnRYLCB5OiBldi5jbGllbnRZLCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhjbGljaywgYnV0dG9uKSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5wZXJmb3JtKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5nby5jbGlja19jYWxsYmFja3MucHVzaCh0aGlzLmNoZWNrX2J1dHRvbl9jbGlja2VkKVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5nby5zY3JlZW4uZHJhd19mb2coMCk7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMztcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2dyYXknO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh4LCB5LCB4LCB5KTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBcIk51YmFyaWFcIlxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZic7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgeCAvIDQsIHkgKyA3MClcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gdGhpcy5idXR0b25zW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IHhfb2Zmc2V0ID0geCArIHggLyAyO1xuICAgICAgICAgICAgY29uc3QgeV9vZmZzZXQgPSB5ICsgeSAvIDMgKyBpbmRleCAqIDUwICsgaW5kZXggKiAxMDtcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IGJ1dHRvbi5pc19ob3ZlcmVkID8gXCJyZ2JhKDksIDEwMCwgODAsIDEpXCIgOiBcInJnYmEoNywgMSwgMywgMSlcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QoeF9vZmZzZXQgLSB0aGlzLmJ1dHRvbl93aWR0aCAvIDIsIHlfb2Zmc2V0LCB0aGlzLmJ1dHRvbl93aWR0aCwgdGhpcy5idXR0b25faGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2luZGV4XS54ID0geF9vZmZzZXQgLSB0aGlzLmJ1dHRvbl93aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaW5kZXhdLnkgPSB5X29mZnNldDtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpbmRleF0ud2lkdGggPSB0aGlzLmJ1dHRvbl93aWR0aFxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2luZGV4XS5oZWlnaHQgPSB0aGlzLmJ1dHRvbl9oZWlnaHRcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KGJ1dHRvbi50ZXh0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQoYnV0dG9uLnRleHQsIHhfb2Zmc2V0IC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgeV9vZmZzZXQgKyAodGhpcy5idXR0b25faGVpZ2h0IC8gMikgKyB0aGlzLmFwcHJveGltYXRlX2xpbmVfaGVpZ2h0IC8gMilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmJ1dHRvbnMuZmluZCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKHRoaXMuZ28ubW91c2VfcG9zaXRpb24sIGJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uaXNfaG92ZXJlZCA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmlzX2hvdmVyZWQgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExMzQ1ODYvaG93LWNhbi15b3UtZmluZC10aGUtaGVpZ2h0LW9mLXRleHQtb24tYW4taHRtbC1jYW52YXNcbiAgICB0aGlzLmFwcHJveGltYXRlX2xpbmVfaGVpZ2h0ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQoJ00nKS53aWR0aDtcblxuICAgIHRoaXMuYnV0dG9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcIm5ld19nYW1lXCIsXG4gICAgICAgICAgICB0ZXh0OiBcIm5ld1wiLFxuICAgICAgICAgICAgcGVyZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3X2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgICAgICB0aGlzLm1lbnUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51LmdvLnNlcnZlci5jb25uZWN0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcImxvYWRfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJsb2FkXCIsXG4gICAgICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkX2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcInNhdmVfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJzYXZlXCIsXG4gICAgICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlX2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbWVudTogdGhpcyxcbiAgICAgICAgICAgIGlkOiBcImV4aXRfZ2FtZVwiLFxuICAgICAgICAgICAgdGV4dDogXCJleGl0XCIsXG4gICAgICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJleGl0X2dhbWUgYnV0dG9uIGNsaWNrZWRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF1cbn0iLCJjb25zdCBkaXN0YW5jZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBNYXRoLmFicyhNYXRoLmZsb29yKGEpIC0gTWF0aC5mbG9vcihiKSk7XG59XG5cbmNvbnN0IFZlY3RvcjIgPSB7XG4gIGRpc3RhbmNlOiAoYSwgYikgPT4gTWF0aC50cnVuYyhNYXRoLnNxcnQoTWF0aC5wb3coYi54IC0gYS54LCAyKSArIE1hdGgucG93KGIueSAtIGEueSwgMikpKSxcbiAgYW5nbGU6IChjdXJyZW50X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24pID0+IE1hdGguYXRhbjIoZW5kX3Bvc2l0aW9uLnkgLSBjdXJyZW50X3Bvc2l0aW9uLnksIGVuZF9wb3NpdGlvbi54IC0gY3VycmVudF9wb3NpdGlvbi54KVxufVxuXG5jb25zdCBpc19jb2xsaWRpbmcgPSBmdW5jdGlvbihzZWxmLCB0YXJnZXQpIHtcbiAgY29uc3Qgc2VsZl9wb3NpdGlvbiA9IHsgd2lkaHQ6IDEsIGhlaWdodDogMSwgLi4uc2VsZiB9XG4gIGNvbnN0IHRhcmdldF9wb3NpdGlvbiA9IHsgd2lkaHQ6IDEsIGhlaWdodDogMSwgLi4udGFyZ2V0IH1cbiAgaWYgKFxuICAgIChzZWxmX3Bvc2l0aW9uLnggPCB0YXJnZXRfcG9zaXRpb24ueCArIHRhcmdldF9wb3NpdGlvbi53aWR0aCkgJiZcbiAgICAoc2VsZl9wb3NpdGlvbi54ICsgc2VsZl9wb3NpdGlvbi53aWR0aCA+IHRhcmdldF9wb3NpdGlvbi54KSAmJlxuICAgIChzZWxmX3Bvc2l0aW9uLnkgPCB0YXJnZXRfcG9zaXRpb24ueSArIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQpICYmXG4gICAgKHNlbGZfcG9zaXRpb24ueSArIHNlbGZfcG9zaXRpb24uaGVpZ2h0ID4gdGFyZ2V0X3Bvc2l0aW9uLnkpXG4gICkge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZHJhd19zcXVhcmUgPSBmdW5jdGlvbiAoeCA9IDEwLCB5ID0gMTAsIHcgPSAyMCwgaCA9IDIwLCBjb2xvciA9IFwicmdiKDE5MCwgMjAsIDEwKVwiKSB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmZpbGxSZWN0KHgsIHksIHcsIGgpO1xufVxuXG5jb25zdCByYW5kb20gPSAoc3RhcnQsIGVuZCkgPT4ge1xuICBpZiAoZW5kID09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHN0YXJ0XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgcmV0dXJuIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIGVuZCkgKyBzdGFydCAgXG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChvYmplY3QsIGxpc3QpIHtcbiAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2Yob2JqZWN0KTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICByZXR1cm4gbGlzdC5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlX2NsaWNrYWJsZShkb29kYWQsIGdvKSB7XG4gIGNvbnN0IGNsaWNrYWJsZV9pbmRleCA9IGdvLmNsaWNrYWJsZXMuaW5kZXhPZihkb29kYWQpXG4gIGlmIChjbGlja2FibGVfaW5kZXggPiAtMSkge1xuICAgIGdvLmNsaWNrYWJsZXMuc3BsaWNlKGNsaWNrYWJsZV9pbmRleCwgMSlcbiAgfVxuICBpZiAoZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSBkb29kYWQpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBudWxsXG4gIH1cbn1cblxuY29uc3QgZGljZSA9IChzaWRlcywgdGltZXMgPSAxKSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKEFycmF5KHRpbWVzKSkubWFwKChpKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcykgKyAxKTtcbn1cblxuZXhwb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgZHJhd19zcXVhcmUsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBkaWNlLCByZW1vdmVfY2xpY2thYmxlIH1cbiIsImNsYXNzIFRpbGUge1xuICAgIGNvbnN0cnVjdG9yKGltYWdlX3NyYywgeF9vZmZzZXQgPSAwLCB5X29mZnNldCA9IDAsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gICAgICAgIHRoaXMueF9vZmZzZXQgPSB4X29mZnNldFxuICAgICAgICB0aGlzLnlfb2Zmc2V0ID0geV9vZmZzZXRcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaWxlIiwiaW1wb3J0IFRpbGUgZnJvbSBcIi4vdGlsZVwiXG5cbi8vIFRoZSBXb3JsZCBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBpdHNlbGYuXG5mdW5jdGlvbiBXb3JsZChnbykge1xuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ud29ybGQgPSB0aGlzO1xuICB0aGlzLndpZHRoID0gMTAwMDA7XG4gIHRoaXMuaGVpZ2h0ID0gMTAwMDA7XG4gIHRoaXMueF9vZmZzZXQgPSAwO1xuICB0aGlzLnlfb2Zmc2V0ID0gMDtcbiAgdGhpcy50aWxlX3NldCA9IHtcbiAgICBncmFzczogbmV3IFRpbGUoXCJncmFzcy5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBkaXJ0OiBuZXcgVGlsZShcImRpcnQyLnBuZ1wiLCAwLCAwLCA2NCwgNjMpLFxuICAgIHN0b25lOiBuZXcgVGlsZShcImZsaW50c3RvbmUucG5nXCIsIDAsIDAsIDg0MCwgODU5KSxcbiAgfVxuICB0aGlzLnBpY2tfcmFuZG9tX3RpbGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMudGlsZV9zZXQuZ3Jhc3NcbiAgfVxuICB0aGlzLnRpbGVfd2lkdGggPSA2NFxuICB0aGlzLnRpbGVfaGVpZ2h0ID0gNjRcbiAgdGhpcy50aWxlc19wZXJfcm93ID0gTWF0aC50cnVuYyh0aGlzLndpZHRoIC8gdGhpcy50aWxlX3dpZHRoKSArIDE7XG4gIHRoaXMudGlsZXNfcGVyX2NvbHVtbiA9IE1hdGgudHJ1bmModGhpcy5oZWlnaHQgLyB0aGlzLnRpbGVfaGVpZ2h0KSArIDE7XG4gIHRoaXMudGlsZXMgPSBudWxsO1xuICB0aGlzLmdlbmVyYXRlX21hcCA9ICgpID0+IHtcbiAgICB0aGlzLnRpbGVzID0gbmV3IEFycmF5KHRoaXMudGlsZXNfcGVyX3Jvdyk7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW3Jvd10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMudGlsZXNbcm93XSA9IFt0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10ucHVzaCh0aGlzLnBpY2tfcmFuZG9tX3RpbGUoKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDw9IHRoaXMudGlsZXNfcGVyX3Jvdzsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8PSB0aGlzLnRpbGVzX3Blcl9jb2x1bW47IGNvbHVtbisrKSB7XG4gICAgICAgIGxldCB0aWxlID0gdGhpcy50aWxlc1tyb3ddW2NvbHVtbl1cbiAgICAgICAgaWYgKHRpbGUgIT09IHRoaXMudGlsZV9zZXQuZ3Jhc3MpIHtcbiAgICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy50aWxlX3NldC5ncmFzcy5pbWFnZSxcbiAgICAgICAgICAgIHRoaXMudGlsZV9zZXQuZ3Jhc3MueF9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3MueV9vZmZzZXQsIHRoaXMudGlsZV9zZXQuZ3Jhc3Mud2lkdGgsIHRoaXMudGlsZV9zZXQuZ3Jhc3MuaGVpZ2h0LFxuICAgICAgICAgICAgdGhpcy54X29mZnNldCArIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCxcbiAgICAgICAgICAgIHRoaXMueV9vZmZzZXQgKyAoY29sdW1uICogdGhpcy50aWxlX2hlaWdodCkgLSB0aGlzLmdvLmNhbWVyYS55LCA2NCwgNjMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRpbGUuaW1hZ2UsXG4gICAgICAgICAgdGlsZS54X29mZnNldCwgdGlsZS55X29mZnNldCwgdGlsZS53aWR0aCwgdGlsZS5oZWlnaHQsXG4gICAgICAgICAgdGhpcy54X29mZnNldCArIChyb3cgKiB0aGlzLnRpbGVfd2lkdGgpIC0gdGhpcy5nby5jYW1lcmEueCxcbiAgICAgICAgICB0aGlzLnlfb2Zmc2V0ICsgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjUsIDY1KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXb3JsZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4vZ2FtZV9vYmplY3QuanNcIlxuaW1wb3J0IFNjcmVlbiBmcm9tIFwiLi9zY3JlZW4uanNcIlxuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9jYW1lcmEuanNcIlxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIuanNcIlxuaW1wb3J0IEtleWJvYXJkSW5wdXQgZnJvbSBcIi4va2V5Ym9hcmRfaW5wdXQuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQge1xuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufSBmcm9tIFwiLi9ldmVudHNfY2FsbGJhY2tzLmpzXCJcbmltcG9ydCBHYW1lTG9vcCBmcm9tIFwiLi9nYW1lX2xvb3AuanNcIlxuaW1wb3J0IFdvcmxkIGZyb20gXCIuL3dvcmxkLmpzXCJcbmltcG9ydCBEb29kYWQgZnJvbSBcIi4vZG9vZGFkLmpzXCJcbmltcG9ydCBDb250cm9scyBmcm9tIFwiLi9jb250cm9scy5qc1wiXG5pbXBvcnQgU2VydmVyIGZyb20gXCIuL3NlcnZlclwiXG5pbXBvcnQgTG9vdEJveCBmcm9tIFwiLi9sb290X2JveC5qc1wiXG5pbXBvcnQgQ3JlZXAgZnJvbSBcIi4vYmVpbmdzL2NyZWVwLmpzXCJcbmltcG9ydCBBY3Rpb25CYXIgZnJvbSBcIi4vYWN0aW9uX2Jhci5qc1wiXG5pbXBvcnQgU3RvbmUgZnJvbSBcIi4vYmVpbmdzL3N0b25lLmpzXCJcbmltcG9ydCBUcmVlIGZyb20gXCIuL2JlaW5ncy90cmVlLmpzXCJcbmltcG9ydCBFZGl0b3IgZnJvbSBcIi4vZWRpdG9yL2luZGV4LmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IFN0YXJ0TWVudSBmcm9tIFwiLi9zdGFydF9tZW51LmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG4vLyAtLS1cbi8vIERpc2FibGUgcmlnaHQgbW91c2UgY2xpY2tcbmdvLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9XG5cbmNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IHNldENsaWNrQ2FsbGJhY2soZ28pXG5jb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pXG5jb25zdCBtb3VzZWRvd25fY2FsbGJhY2tzID0gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pXG5jb25zdCBtb3VzZXVwX2NhbGxiYWNrcyA9IHNldE1vdXNldXBDYWxsYmFjayhnbylcbmNvbnN0IHRvdWNoc3RhcnRfY2FsbGJhY2tzID0gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKVxuY29uc3QgdG91Y2hlbmRfY2FsbGJhY2tzID0gc2V0VG91Y2hlbmRDYWxsYmFjayhnbylcblxuLy8tLS0tLVxuY29uc3QgY2FtZXJhID0gbmV3IENhbWVyYShnbylcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBzdGFydF9tZW51ID0gbmV3IFN0YXJ0TWVudSh7IGdvIH0pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbywgY2hhcmFjdGVyKVxuY29uc3Qga2V5Ym9hcmRfaW5wdXQgPSBuZXcgS2V5Ym9hcmRJbnB1dChnbylcbmNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKGdvKVxuY29uc3QgY29udHJvbHMgPSBuZXcgQ29udHJvbHMoZ28pXG5jb25zdCBsb290X2JveCA9IG5ldyBMb290Qm94KGdvKVxuY29uc3QgYWN0aW9uX2JhciA9IG5ldyBBY3Rpb25CYXIoZ28pXG5jb25zdCBlZGl0b3IgPSBuZXcgRWRpdG9yKHsgZ28gfSlcbmNvbnN0IGV4cGVyaWVuY2VfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogeyB4OiBnby5zY3JlZW4ud2lkdGggLyAyIC0gNTAwLCB5OiBnby5zY3JlZW4uaGVpZ2h0IC0gMzAsIHdpZHRoOiAxMDAwLCBoZWlnaHQ6IDUgfSwgY29sb3VyOiBcInB1cnBsZVwiLCBib3JkZXI6IFwid2hpdGVcIiwgZml4ZWQ6IHRydWUgfSk7XG5leHBlcmllbmNlX2Jhci5oZWlnaHQgPSAzMFxuXG4vLyBDYWxsYmFja3NcbmZ1bmN0aW9uIHRyYWNrX21vdXNlX3Bvc2l0aW9uKGV2dCkge1xuICB2YXIgcmVjdCA9IGdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBnby5tb3VzZV9wb3NpdGlvbiA9IHtcbiAgICB4OiBldnQuY2xpZW50WCAtIHJlY3QubGVmdCArIGNhbWVyYS54LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3AgKyBjYW1lcmEueSxcbiAgICB3aWR0aDogMSxcbiAgICBoZWlnaHQ6IDFcbiAgfVxufVxuXG5nby5tb3VzZV9wb3NpdGlvbiA9IHt9XG5sZXQgbW91c2VfaXNfZG93biA9IGZhbHNlXG5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKGxvb3RfYm94LmNoZWNrX2l0ZW1fY2xpY2tlZC5iaW5kKGxvb3RfYm94KSlcbnRvdWNoc3RhcnRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbnRvdWNoZW5kX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxuXG5mdW5jdGlvbiBjbGlja2FibGVfY2xpY2tlZChldikge1xuICBsZXQgY2xpY2sgPSB7IHg6IGV2LmNsaWVudFggKyBnby5jYW1lcmEueCwgeTogZXYuY2xpZW50WSArIGdvLmNhbWVyYS55LCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgY29uc3QgY2xpY2thYmxlID0gZ28uY2xpY2thYmxlcy5maW5kKChjbGlja2FibGUpID0+IGlzX2NvbGxpZGluZyhjbGlja2FibGUsIGNsaWNrKSlcbiAgaWYgKGNsaWNrYWJsZSkge1xuICAgIGNsaWNrYWJsZS5hY3RpdmF0ZWQgPSAhY2xpY2thYmxlLmFjdGl2YXRlZFxuICB9XG4gIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IGNsaWNrYWJsZVxufVxuY2xpY2tfY2FsbGJhY2tzLnB1c2goY2xpY2thYmxlX2NsaWNrZWQpXG5cbm1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcblxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbJ0VzY2FwZSddID0gW2NoYXJhY3Rlci5lc2NhcGVfa2V5XVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuZiA9IFtjaGFyYWN0ZXIuc2tpbGxfYWN0aW9uXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMF0gPSBbY2hhcmFjdGVyLnNraWxscy5tYWtlX2ZpcmVdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1sxXSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmZyb3N0Ym9sdF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWzJdID0gW2NoYXJhY3Rlci5zcGVsbHMuYmxpbmtdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5pID0gW2NoYXJhY3Rlci5pbnZlbnRvcnkudG9nZ2xlX2Rpc3BsYXldXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5iID0gW2NoYXJhY3Rlci5ib2FyZC50b2dnbGVfZ3JpZF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmUgPSBbKCkgPT4gZWRpdG9yLmFjdGl2ZSA9ICFlZGl0b3IuYWN0aXZlXVxuLy9rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5wID0gW2JvYXJkLndheV90b19wbGF5ZXJdXG5cbi8vIEVORCAtLSBDYWxsYmFja3NcblxubGV0IGVsYXBzZWRfdGltZSA9IDBcbmxldCBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG5sZXQgZnJhbWVzID0gMDtcbmNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgaWYgKHN0YXJ0X21lbnUuYWN0aXZlKSB7XG4gICAgc3RhcnRfbWVudS51cGRhdGUoKVxuICAgIHJldHVybjtcbiAgfVxuICBmcmFtZXMgKz0gMTtcbiAgZWxhcHNlZF90aW1lID0gRGF0ZS5ub3coKSAtIGxhc3RfdGlja1xuICBpZiAoKGVsYXBzZWRfdGltZSkgPiAxMDAwKSB7XG4gICAgZnJhbWVzID0gMDtcbiAgICBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgdXBkYXRlX2ZwcygpXG4gIH1cbiAgaWYgKCFjaGFyYWN0ZXIuc3RhdHMuaXNfYWxpdmUoKSkge1xuICAgIGNvbnRyb2xzX21vdmVtZW50KClcbiAgfSBlbHNlIHtcbiAgICBnby51cGRhdGVfb2JqZWN0cygpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlX2ZwcygpIHtcbiAgaWYgKHN0YXJ0X21lbnUuYWN0aXZlKSByZXR1cm47XG5cbiAgaWYgKGNoYXJhY3Rlci5zdGF0cy5pc19hbGl2ZSgpKSB7XG4gICAgY2hhcmFjdGVyLnVwZGF0ZV9mcHMoKVxuICB9XG4gIGdvLnVwZGF0ZV9mcHNfb2JqZWN0cygpXG59XG4vLyBDb21tZW50XG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBpZiAoc3RhcnRfbWVudS5hY3RpdmUpIHtcbiAgICBzdGFydF9tZW51LmRyYXcoKTtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoY2hhcmFjdGVyLnN0YXRzLmlzX2RlYWQoKSkge1xuICAgIHNjcmVlbi5kcmF3X2dhbWVfb3ZlcigpXG4gIH0gZWxzZSB7XG4gICAgc2NyZWVuLmRyYXcoKVxuICAgIGdvLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlKClcbiAgICBnby5kcmF3X29iamVjdHMoKVxuICAgIGNoYXJhY3Rlci5kcmF3KClcbiAgICBzY3JlZW4uZHJhd19mb2coKVxuICAgIGxvb3RfYm94LmRyYXcoKVxuICAgIGdvLmNoYXJhY3Rlci5pbnZlbnRvcnkuZHJhdygpXG4gICAgYWN0aW9uX2Jhci5kcmF3KClcbiAgICBjaGFyYWN0ZXIuYm9hcmQuZHJhdygpXG4gICAgZWRpdG9yLmRyYXcoKVxuICAgIGV4cGVyaWVuY2VfYmFyLmRyYXcoMTAwMCwgZ28uY2hhcmFjdGVyLmV4cGVyaWVuY2VfcG9pbnRzKVxuICAgIGlmIChzaG93X2NvbnRyb2xfd2hlZWwpIGRyYXdfY29udHJvbF93aGVlbCgpXG4gIH1cbn0gXG5cbi8vIFRyZWVzXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgbGV0IHRyZWUgPSBuZXcgVHJlZSh7IGdvIH0pXG4gIGdvLnRyZWVzLnB1c2godHJlZSlcbiAgZ28uY2xpY2thYmxlcy5wdXNoKHRyZWUpXG59KVxuLy8gU3RvbmVzXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgY29uc3Qgc3RvbmUgPSBuZXcgU3RvbmUoeyBnbyB9KTtcbiAgZ28uc3RvbmVzLnB1c2goc3RvbmUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaChzdG9uZSlcbn0pXG4vLyBDcmVlcFxuZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gIGxldCBjcmVlcCA9IG5ldyBDcmVlcCh7IGdvIH0pO1xuICBnby5jbGlja2FibGVzLnB1c2goY3JlZXApO1xufVxuY29uc3QgZHVtbXkgPSBuZXcgQ3JlZXAoeyBnbyB9KVxuZHVtbXkueCA9IDgwMDtcbmR1bW15LnkgPSAyMDA7XG5nby5jbGlja2FibGVzLnB1c2goZHVtbXkpXG5cbmxldCBvcmRlcmVkX2NsaWNrYWJsZXMgPSBbXTtcbmNvbnN0IHRhYl9jeWNsaW5nID0gKGV2KSA9PiB7XG4gIGV2LnByZXZlbnREZWZhdWx0KClcbiAgb3JkZXJlZF9jbGlja2FibGVzID0gZ28uY3JlZXBzLnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gVmVjdG9yMi5kaXN0YW5jZShhLCBjaGFyYWN0ZXIpIC0gVmVjdG9yMi5kaXN0YW5jZShiLCBjaGFyYWN0ZXIpO1xuICB9KVxuICBpZiAoVmVjdG9yMi5kaXN0YW5jZShvcmRlcmVkX2NsaWNrYWJsZXNbMF0sIGNoYXJhY3RlcikgPiA1MDApIHJldHVybjtcblxuICBpZiAob3JkZXJlZF9jbGlja2FibGVzWzBdID09PSBnby5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBvcmRlcmVkX2NsaWNrYWJsZXNbMV07XG4gIH0gZWxzZSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gb3JkZXJlZF9jbGlja2FibGVzWzBdXG4gIH1cbn1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wiVGFiXCJdID0gW3RhYl9jeWNsaW5nXVxuXG5sZXQgc2hvd19jb250cm9sX3doZWVsID0gZmFsc2VcbmNvbnN0IGRyYXdfY29udHJvbF93aGVlbCA9ICgpID0+IHtcbiAgZ28uY3R4LmJlZ2luUGF0aCgpXG4gIGdvLmN0eC5hcmMoXG4gICAgY2hhcmFjdGVyLnggKyAoY2hhcmFjdGVyLndpZHRoIC8gMikgLSBnby5jYW1lcmEueCxcbiAgICBjaGFyYWN0ZXIueSArIChjaGFyYWN0ZXIuaGVpZ2h0IC8gMikgLSBnby5jYW1lcmEueSxcbiAgICAyMDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gIGdvLmN0eC5saW5lV2lkdGggPSA1XG4gIGdvLmN0eC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIlxuICBnby5jdHguc3Ryb2tlKCk7XG59XG5jb25zdCB0b2dnbGVfY29udHJvbF93aGVlbCA9ICgpID0+IHsgc2hvd19jb250cm9sX3doZWVsID0gIXNob3dfY29udHJvbF93aGVlbCB9XG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1tcImNcIl0gPSBbdG9nZ2xlX2NvbnRyb2xfd2hlZWxdXG5cbmNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG5nYW1lX2xvb3AuZHJhdyA9IGRyYXdcbmdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IGdvLmtleWJvYXJkX2lucHV0LnByb2Nlc3Nfa2V5c19kb3duXG5nYW1lX2xvb3AudXBkYXRlID0gdXBkYXRlXG5cbmNvbnN0IHN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuICBjaGFyYWN0ZXIueCA9IDEwMFxuICBjaGFyYWN0ZXIueSA9IDEwMFxuICBnby53b3JsZC5nZW5lcmF0ZV9tYXAoKVxuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZV9sb29wLmxvb3AuYmluZChnYW1lX2xvb3ApKTtcbn1cblxuc3RhcnQoKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==