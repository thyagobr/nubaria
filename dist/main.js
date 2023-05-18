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
          console.log(`spell.id = ${this.highlights[0].id}; slot.id = ${slot.id}`)
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
            this.move.act();
            // this.board.draw();
        if (distance < 5) {
            this.entity.stats.attack(this.go.character)
        }}

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
            console.log("hmmm... where to?")
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
/* harmony import */ var _tapete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tapete */ "./src/tapete.js");


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
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this.entity, this.go.creeps) || console.log("Not on list of creeps")
        ;(0,_tapete__WEBPACK_IMPORTED_MODULE_0__.remove_object_if_present)(this.entity, this.go.clickables) || console.log("Not on list of clickables")
        if (this.go.selected_clickable === this.entity) this.go.selected_clickable = null;
        this.go.character.update_xp(this.entity)
        if (this.entity.loot_table !== undefined) {
            this.go.loot_box.items = this.go.loot_box.roll_loot(this.entity.loot_table)
            this.go.loot_box.show()
        }
    }
    this.attack = (target) => {
        if (this.last_attack_at === null || (this.last_attack_at + this.attack_speed) < Date.now()) {
            const damage = random(5, 12);
            console.log(`*** [${this.entity.name} attacks: ${damage} damage`)
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

  this.coords = function(coords) {
    this.x = coords.x
    this.y = coords.y
  }

  this.draw = function(target_position) {
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
    let entity = this.go.selected_clickable
    if (entity && this.skills[entity.acted_by_skill]) {
      this.skills[entity.acted_by_skill]()
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
  this.managed_objects = [] // Random objects to draw/update

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

let FPS = 0
let last_tick = Date.now()
const update = () => {
  FPS = Date.now() - last_tick
  if ((FPS) > 1000) {
    update_fps()
    console.log(FPS)
    last_tick = Date.now()
  }
  if (!character.stats.is_alive()) {
    controls_movement()
  } else {
    go.spells.forEach(spell => spell.update())
    go.managed_objects.forEach(mob => mob.update())
  }
}

function update_fps() {
  if (character.stats.is_alive()) {
    character.update_fps()
  }
  go.fires.forEach(fire => fire.update_fps())
}
// Comment
const draw = () => {
  if (character.stats.is_dead()) {
    screen.draw_game_over()
  } else {
    screen.draw()
    go.draw_selected_clickable()
    go.stones.forEach(stone => stone.draw())
    go.trees.forEach(tree => tree.draw())
    go.fires.forEach(fire => fire.draw())
    go.spells.forEach(spell => spell.draw())
    go.skills.forEach(skill => skill.draw())
    character.draw()
    go.managed_objects.forEach(mob => mob.draw())
    go.creeps.forEach(creep => creep.draw())
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsZUFBZSx1QkFBdUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFVRTs7Ozs7Ozs7Ozs7Ozs7O0FDakZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFFBQVE7Ozs7Ozs7Ozs7Ozs7OztBQzFCdkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZTs7Ozs7Ozs7Ozs7Ozs7QUNyQ0EscUJBQXFCLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQSwyQkFBMkIsZUFBZSxFQUFFLFVBQVU7QUFDdEQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHdEQUFJLEdBQUcsSUFBSTtBQUM1QjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxvQkFBb0IseURBQUssR0FBRyxJQUFJO0FBQ2hDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4QixrQkFBa0IseURBQUssR0FBRyxJQUFJO0FBQzlCO0FBQ0E7QUFDQSxrQkFBa0IseURBQUssR0FBRyxJQUFJO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsd0RBQWdCLGlCQUFpQix3REFBZ0I7QUFDNUQsR0FBRztBQUNILE1BQU0sd0RBQWdCOztBQUV0QjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUEsc0JBQXNCLHFEQUFRO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FjdGlvbl9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvYWdncm8uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbW92ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3Mvc3RvbmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JvYXJkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FzdGluZ19iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jbGlja2FibGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jb250cm9scy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Rvb2RhZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2VkaXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2V2ZW50c19jYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX2xvb3AuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2l0ZW0uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9rZXlib2FyZF9pbnB1dC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290X2JveC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Byb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9icmVha19zdG9uZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9jdXRfdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9tYWtlX2ZpcmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvYmxpbmsuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvZnJvc3Rib2x0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZVwiO1xuXG5mdW5jdGlvbiBBY3Rpb25CYXIoZ2FtZV9vYmplY3QpIHtcbiAgdGhpcy5nYW1lX29iamVjdCA9IGdhbWVfb2JqZWN0XG4gIHRoaXMuZ2FtZV9vYmplY3QuYWN0aW9uX2JhciA9IHRoaXNcbiAgdGhpcy5udW1iZXJfb2Zfc2xvdHMgPSAxMFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gdGhpcy5nYW1lX29iamVjdC50aWxlX3NpemUgKiAzO1xuICB0aGlzLnNsb3Rfd2lkdGggPSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDM7XG4gIHRoaXMueV9vZmZzZXQgPSAxMDBcbiAgdGhpcy5hY3Rpb25fYmFyX3dpZHRoID0gdGhpcy5udW1iZXJfb2Zfc2xvdHMgKiB0aGlzLnNsb3Rfd2lkdGhcbiAgdGhpcy5hY3Rpb25fYmFyX2hlaWdodCA9IHRoaXMubnVtYmVyX29mX3Nsb3RzICogdGhpcy5zbG90X2hlaWdodFxuICB0aGlzLmFjdGlvbl9iYXJfeCA9ICh0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LndpZHRoIC8gMikgLSAodGhpcy5hY3Rpb25fYmFyX3dpZHRoIC8gMilcbiAgdGhpcy5hY3Rpb25fYmFyX3kgPSB0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LmhlaWdodCAtIHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogNCAtIHRoaXMueV9vZmZzZXRcblxuICAvLyBjaGFyYWN0ZXItc3BlY2lmaWNcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuc2xvdF9zaXplID0gMTBcbiAgdGhpcy5zbG90c1swXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5mcm9zdGJvbHRcbiAgdGhpcy5zbG90c1sxXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5ibGlua1xuICAvLyBFTkQgLS0gY2hhcmFjdGVyLXNwZWNpZmljXG5cbiAgdGhpcy5oaWdobGlnaHRzID0gW11cblxuICBmdW5jdGlvbiBTbG90KHsgc3BlbGwsIHgsIHkgfSkge1xuICAgIHRoaXMuc3BlbGwgPSBzcGVsbFxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIHRoaXMuaGlnaGxpZ2h0X2Nhc3QgPSAoc3BlbGwpID0+IHtcbiAgICB0aGlzLmhpZ2hsaWdodHMucHVzaChzcGVsbClcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzbG90X2luZGV4ID0gMDsgc2xvdF9pbmRleCA8PSB0aGlzLnNsb3Rfc2l6ZTsgc2xvdF9pbmRleCsrKSB7XG4gICAgICB2YXIgc2xvdCA9IHRoaXMuc2xvdHNbc2xvdF9pbmRleF07XG5cbiAgICAgIHZhciB4ID0gdGhpcy5hY3Rpb25fYmFyX3ggKyAodGhpcy5zbG90X3dpZHRoICogc2xvdF9pbmRleClcbiAgICAgIHZhciB5ID0gdGhpcy5hY3Rpb25fYmFyX3lcblxuICAgICAgaWYgKHNsb3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSBcInJnYmEoNDYsIDQ2LCA0NiwgMSlcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZXZpb2xldFwiXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgICAgeCwgeSxcbiAgICAgICAgICB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHRcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5kcmF3SW1hZ2Uoc2xvdC5pY29uLCB4LCB5LCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlU3R5bGUgPSBcImJsdWV2aW9sZXRcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0XG4gICAgICAgIClcblxuICAgICAgICAvLyBIaWdobGlnaHQ6IHRoZSBhY3Rpb24gYmFyIFwiYmxpbmtzXCIgZm9yIGEgZnJhbWUgd2hlbiB0aGUgc3BlbGwgaXMgY2FzdFxuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgc3BlbGwuaWQgPSAke3RoaXMuaGlnaGxpZ2h0c1swXS5pZH07IHNsb3QuaWQgPSAke3Nsb3QuaWR9YClcbiAgICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRzLmZpbmQoKHNwZWxsKSA9PiBzcGVsbC5pZCA9PT0gc2xvdC5pZCkpIHtcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChzbG90LCB0aGlzLmhpZ2hsaWdodHMpXG4gICAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpJ1xuICAgICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvb2xkb3duIGluZGljYXRvclxuICAgICAgICBpZiAoc2xvdC5vbl9jb29sZG93bigpKSB7XG4gICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAxIC0gKChub3cgLSBzbG90Lmxhc3RfY2FzdF9hdCkgLyBzbG90LmNvb2xkb3duX3RpbWVfaW5fbXMpXG4gICAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcbiAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsUmVjdCh4LCB5LCB0aGlzLnNsb3Rfd2lkdGggKiBwZXJjZW50YWdlLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBY3Rpb25CYXJcbiIsImltcG9ydCBCb2FyZCBmcm9tIFwiLi4vYm9hcmRcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5pbXBvcnQgeyBNb3ZlIH0gZnJvbSBcIi4vbW92ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFnZ3JvKHsgZ28sIGVudGl0eSwgcmFkaXVzID0gMjAgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXNcbiAgICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHsgZ28sIGVudGl0eSwgcmFkaXVzOiBNYXRoLmZsb29yKHRoaXMucmFkaXVzIC8gdGhpcy5nby50aWxlX3NpemUpIH0pXG4gICAgdGhpcy5tb3ZlID0gbmV3IE1vdmUoeyBnbywgZW50aXR5LCB0YXJnZXRfcG9zaXRpb246IHRoaXMuZ28uY2hhcmFjdGVyIH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmdvLmNoYXJhY3RlciwgZW50aXR5KVxuICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLnJhZGl1cykge1xuICAgICAgICAgICAgdGhpcy5tb3ZlLmFjdCgpO1xuICAgICAgICAgICAgLy8gdGhpcy5ib2FyZC5kcmF3KCk7XG4gICAgICAgIGlmIChkaXN0YW5jZSA8IDUpIHtcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnN0YXRzLmF0dGFjayh0aGlzLmdvLmNoYXJhY3RlcilcbiAgICAgICAgfX1cblxuICAgIH1cblxuICAgIHRoaXMuZHJhd19wYXRoID0gKCkgPT4ge1xuXG4gICAgfVxuXG4gICAgY29uc3QgbmVpZ2hib3JfcG9zaXRpb25zID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5lbnRpdHkueCxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5lbnRpdHkud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZW50aXR5LmhlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGVmdCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeDogdGhpcy5lbnRpdHkueCAtPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IHJpZ2h0ID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB4OiB0aGlzLmVudGl0eS54ICs9IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgdXAgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHk6IHRoaXMuZW50aXR5LnkgLT0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCBkb3duID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB5OiB0aGlzLmVudGl0eS55ICs9IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICB9XG59ICIsImltcG9ydCB7IFZlY3RvcjIsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gICAgY29uc3RydWN0b3IoeyBnbywgZW50aXR5LCBzcGVlZCA9IDEsIHRhcmdldF9wb3NpdGlvbiB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgdGhpcy50YXJnZXRfcG9zaXRpb24gPSB0YXJnZXRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5icHMgPSAwO1xuICAgICAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMucGF0aCA9IG51bGxcbiAgICAgICAgdGhpcy5uZXh0X3BhdGhfaW5kZXggPSBudWxsXG4gICAgfVxuXG4gICAgYWN0ID0gKCkgPT4ge1xuICAgICAgICAvLyB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgICAgICAvLyBpZiAoKHRoaXMuYnBzKSA+PSA4MDApIHtcbiAgICAgICAgLy8gICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgIC8vICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgLy8gICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZHJhdygpXG4gICAgICAgIC8vaWYgKHRoaXMucGF0aCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGF0aFt0aGlzLm5leHRfcGF0aF9pbmRleF0gPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIC8vY29uc3QgdGFyZ2V0ZWRfcG9zaXRpb24gPSB0aGlzLnBhdGhbdGhpcy5uZXh0X3BhdGhfaW5kZXhdXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3Bvc2l0aW9uID0geyAuLi50aGlzLnRhcmdldF9wb3NpdGlvbiB9XG4gICAgICAgIGNvbnN0IG5leHRfc3RlcCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LnggKyB0aGlzLnNwZWVkICogTWF0aC5jb3MoVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnkgKyB0aGlzLnNwZWVkICogTWF0aC5zaW4oVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVudGl0eS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbnRpdHkuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdvLnRyZWVzLnNvbWUodHJlZSA9PiAoaXNfY29sbGlkaW5nKG5leHRfc3RlcCwgdHJlZSkpKSkge1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkueCA9IG5leHRfc3RlcC54XG4gICAgICAgICAgICB0aGlzLmVudGl0eS55ID0gbmV4dF9zdGVwLnlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaG1tbS4uLiB3aGVyZSB0bz9cIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZWRpY3RfbW92ZW1lbnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgICAgIGlmICgodGhpcy5icHMpID49IDMwMDApIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2Jhci5qc1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eSwgc3BlbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5zcGVsbCA9IHNwZWxsXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSA+IHRoaXMuc3BlbGwubWFuYV9jb3N0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgLT0gdGhpcy5zcGVsbC5tYW5hX2Nvc3RcbiAgICAgICAgICAgIHRoaXMuc3BlbGwuYWN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2FzdCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5hY3Rpb25fYmFyLmhpZ2hsaWdodF9jYXN0KHRoaXMuc3BlbGwpO1xuICAgICAgICBpZiAoIXRoaXMuc3BlbGwuaXNfdmFsaWQoKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnNwZWxsLmNhc3RpbmdfdGltZV9pbl9tcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FzdGluZ19iYXIuZHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0b3AoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgPiB0aGlzLnNwZWxsLm1hbmFfY29zdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cy5wdXNoKHRoaXMpXG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCh0aGlzLnNwZWxsLmNhc3RpbmdfdGltZV9pbl9tcywgdGhpcy5lbmQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZCgpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YXRzKHsgZ28sIGVudGl0eSwgaHAgPSAxMDAsIGN1cnJlbnRfaHAsIG1hbmEsIGN1cnJlbnRfbWFuYSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmhwID0gaHAgfHwgMTAwXG4gICAgdGhpcy5jdXJyZW50X2hwID0gY3VycmVudF9ocCB8fCBocFxuICAgIHRoaXMubWFuYSA9IG1hbmFcbiAgICB0aGlzLmN1cnJlbnRfbWFuYSA9IGN1cnJlbnRfbWFuYSB8fCBtYW5hXG4gICAgdGhpcy5sYXN0X2F0dGFja19hdCA9IG51bGw7XG4gICAgdGhpcy5hdHRhY2tfc3BlZWQgPSAxMDAwO1xuXG4gICAgdGhpcy5oYXNfbWFuYSA9ICgpID0+IHRoaXMubWFuYSA9PT0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNfZGVhZCA9ICgpID0+IHRoaXMuY3VycmVudF9ocCA8PSAwO1xuICAgIHRoaXMuaXNfYWxpdmUgPSAoKSA9PiAhdGhpcy5pc19kZWFkKCk7XG4gICAgdGhpcy50YWtlX2RhbWFnZSA9ICh7IGRhbWFnZSB9KSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudF9ocCAtPSBkYW1hZ2U7XG4gICAgICAgIGlmICh0aGlzLmlzX2RlYWQoKSkgdGhpcy5kaWUoKVxuICAgIH1cbiAgICB0aGlzLmRpZSA9ICgpID0+IHtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMuZW50aXR5LCB0aGlzLmdvLmNyZWVwcykgfHwgY29uc29sZS5sb2coXCJOb3Qgb24gbGlzdCBvZiBjcmVlcHNcIilcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMuZW50aXR5LCB0aGlzLmdvLmNsaWNrYWJsZXMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY2xpY2thYmxlc1wiKVxuICAgICAgICBpZiAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IHRoaXMuZW50aXR5KSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLnVwZGF0ZV94cCh0aGlzLmVudGl0eSlcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5Lmxvb3RfdGFibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KHRoaXMuZW50aXR5Lmxvb3RfdGFibGUpXG4gICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuYXR0YWNrID0gKHRhcmdldCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5sYXN0X2F0dGFja19hdCA9PT0gbnVsbCB8fCAodGhpcy5sYXN0X2F0dGFja19hdCArIHRoaXMuYXR0YWNrX3NwZWVkKSA8IERhdGUubm93KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhbWFnZSA9IHJhbmRvbSg1LCAxMik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgKioqIFske3RoaXMuZW50aXR5Lm5hbWV9IGF0dGFja3M6ICR7ZGFtYWdlfSBkYW1hZ2VgKVxuICAgICAgICAgICAgdGFyZ2V0LnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlOiBkYW1hZ2UgfSlcbiAgICAgICAgICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBEYXRlLm5vdygpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IEFnZ3JvIGZyb20gXCIuLi9iZWhhdmlvcnMvYWdncm8uanNcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuXG5mdW5jdGlvbiBDcmVlcCh7IGdvIH0pIHtcbiAgaWYgKGdvLmNyZWVwcyA9PT0gdW5kZWZpbmVkKSBnby5jcmVlcHMgPSBbXVxuICB0aGlzLmlkID0gZ28uY3JlZXBzLmxlbmd0aFxuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jcmVlcHMucHVzaCh0aGlzKVxuXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IFwiemVyZ2xpbmcucG5nXCIgLy8gcGxhY2Vob2xkZXIgaW1hZ2VcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDE1MFxuICB0aGlzLmltYWdlX2hlaWdodCA9IDE1MFxuICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aClcbiAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KVxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG4gIHRoaXMuc3BlZWQgPSAyXG4gIC8vdGhpcy5tb3ZlbWVudF9ib2FyZCA9IHRoaXMuZ28uYm9hcmQuZ3JpZFxuICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIGhwOiAyMCB9KTtcbiAgLy8gQmVoYXZpb3Vyc1xuICB0aGlzLmFnZ3JvID0gbmV3IEFnZ3JvKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiA1MDAgfSk7XG4gIC8vIEVORCAtIEJlaGF2aW91cnNcblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKHRhcmdldF9wb3NpdGlvbikge1xuICAgIGxldCB4ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi54ID8gdGFyZ2V0X3Bvc2l0aW9uLnggOiB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgbGV0IHkgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnkgPyB0YXJnZXRfcG9zaXRpb24ueSA6IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICBsZXQgd2lkdGggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLndpZHRoID8gdGFyZ2V0X3Bvc2l0aW9uLndpZHRoIDogdGhpcy53aWR0aFxuICAgIGxldCBoZWlnaHQgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA/IHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgOiB0aGlzLmhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLmltYWdlX3hfb2Zmc2V0LCB0aGlzLmltYWdlX3lfb2Zmc2V0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICBpZiAodGFyZ2V0X3Bvc2l0aW9uKSByZXR1cm5cblxuICAgIHRoaXMuYWdncm8uYWN0KCk7XG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5zdGF0cy5ocCwgdGhpcy5zdGF0cy5jdXJyZW50X2hwKVxuICB9XG5cbiAgdGhpcy5zZXRfbW92ZW1lbnRfdGFyZ2V0ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCA9IG5vZGVcbiAgfVxuXG4gIHRoaXMubW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCkge1xuICAgICAgdGhpcy5nby5ib2FyZC5tb3ZlKHRoaXMsIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5sb290X3RhYmxlID0gW3tcbiAgICBpdGVtOiB7IG5hbWU6IFwiV29vZFwiLCBpbWFnZV9zcmM6IFwiYnJhbmNoLnBuZ1wiIH0sXG4gICAgbWluOiAxLFxuICAgIG1heDogMyxcbiAgICBjaGFuY2U6IDk1XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENyZWVwXG4iLCJpbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RvbmUoeyBnbyB9KSB7XG4gICAgdGhpcy5fX3Byb3RvX18gPSBuZXcgRG9vZGFkKHsgZ28gfSlcblxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gXCJmbGludHN0b25lLnBuZ1wiXG4gICAgdGhpcy54ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQud2lkdGgpO1xuICAgIHRoaXMueSA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLmhlaWdodCk7XG4gICAgdGhpcy5pbWFnZV93aWR0aCA9IDg0MFxuICAgIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gODU5XG4gICAgdGhpcy5pbWFnZV94X29mZnNldCA9IDBcbiAgICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICAgIHRoaXMud2lkdGggPSAzMlxuICAgIHRoaXMuaGVpZ2h0ID0gMzJcbiAgICB0aGlzLmFjdGVkX2J5X3NraWxsID0gJ2JyZWFrX3N0b25lJ1xufSIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUcmVlKHsgZ28gfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gICAgdGhpcy54ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQud2lkdGgpO1xuICAgIHRoaXMueSA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLmhlaWdodCk7XG4gICAgdGhpcy5pbWFnZV93aWR0aCA9IDk4XG4gICAgdGhpcy5pbWFnZV94X29mZnNldCA9IDEyN1xuICAgIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTI2XG4gICAgdGhpcy5pbWFnZV95X29mZnNldCA9IDI5MFxuICAgIHRoaXMud2lkdGggPSA5OFxuICAgIHRoaXMuaGVpZ2h0ID0gMTI2XG4gICAgdGhpcy5hY3RlZF9ieV9za2lsbCA9IFwiY3V0X3RyZWVcIlxufSIsImltcG9ydCBOb2RlIGZyb20gXCIuL25vZGUuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbi8vIEEgZ3JpZCBvZiB0aWxlcyBmb3IgdGhlIG1hbmlwdWxhdGlvblxuZnVuY3Rpb24gQm9hcmQoeyBnbywgZW50aXR5LCByYWRpdXMgfSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5ib2FyZCA9IHRoaXNcbiAgdGhpcy50aWxlX3NpemUgPSB0aGlzLmdvLnRpbGVfc2l6ZVxuICB0aGlzLmdyaWQgPSBbW11dXG4gIHRoaXMucmFkaXVzID0gcmFkaXVzXG4gIHRoaXMud2lkdGggPSB0aGlzLnJhZGl1cyAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDJcbiAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgdGhpcy5zaG91bGRfZHJhdyA9IGZhbHNlXG5cbiAgdGhpcy50b2dnbGVfZ3JpZCA9ICgpID0+IHtcbiAgICB0aGlzLnNob3VsZF9kcmF3ID0gIXRoaXMuc2hvdWxkX2RyYXdcbiAgICBpZiAodGhpcy5zaG91bGRfZHJhdykgdGhpcy5idWlsZF9ncmlkKClcbiAgfVxuXG4gIHRoaXMuYnBzID0gMDtcbiAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpO1xuXG4gIHRoaXMuYnVpbGRfZ3JpZCA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImJ1aWxkaW5nIGdyaWRcIilcbiAgICB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgIGlmICgodGhpcy5icHMpIDwgMTAwMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KClcbiAgICB0aGlzLmdyaWQgPSBuZXcgQXJyYXkodGhpcy53aWR0aClcblxuICAgIGNvbnN0IHhfcG9zaXRpb24gPSBNYXRoLmZsb29yKHRoaXMuZW50aXR5LnggKyB0aGlzLmVudGl0eS53aWR0aCAvIDIpXG4gICAgY29uc3QgeV9wb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCAvIDIpXG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgdGhpcy5ncmlkW3hdID0gbmV3IEFycmF5KHRoaXMuaGVpZ2h0KVxuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgTm9kZSh7XG4gICAgICAgICAgeDogKHhfcG9zaXRpb24gLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkgKyB4ICogdGhpcy50aWxlX3NpemUpLFxuICAgICAgICAgIHk6ICh5X3Bvc2l0aW9uIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpICsgeSAqIHRoaXMudGlsZV9zaXplKSxcbiAgICAgICAgICB3aWR0aDogdGhpcy50aWxlX3NpemUsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnRpbGVfc2l6ZSxcbiAgICAgICAgICBnOiBJbmZpbml0eSwgLy8gQ29zdCBzbyBmYXJcbiAgICAgICAgICBmOiBJbmZpbml0eSwgLy8gQ29zdCBmcm9tIGhlcmUgdG8gdGFyZ2V0XG4gICAgICAgICAgaDogbnVsbCwgLy9cbiAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgdmlzaXRlZDogZmFsc2UsXG4gICAgICAgICAgYm9yZGVyX2NvbG91cjogXCJibGFja1wiXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZ28udHJlZXMuZm9yRWFjaCh0cmVlID0+IHtcbiAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKG5vZGUsIHRyZWUpKSB7XG4gICAgICAgICAgICBub2RlLmNvbG91ciA9ICdyZWQnO1xuICAgICAgICAgICAgbm9kZS5ibG9ja2VkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5ncmlkW3hdW3ldID0gbm9kZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMud2F5X3RvX3BsYXllciA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICAgIHRoaXMuZmluZF9wYXRoKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLCB0aGlzLmdvLmNoYXJhY3RlcilcbiAgICB9XG4gIH1cblxuICAvLyBBKiBJbXBsZW1lbnRhdGlvblxuICAvLyBmOiBDb3N0IG9mIHRoZSBlbnRpcmUgdHJhdmVsIChzdW0gb2YgZyArIGgpXG4gIC8vIGc6IENvc3QgZnJvbSBzdGFydF9ub2RlIHRpbGwgbm9kZSAodHJhdmVsIGNvc3QpXG4gIC8vIGg6IENvc3QgZnJvbSBub2RlIHRpbGwgZW5kX25vZGUgKGxlZnRvdmVyIGNvc3QpXG4gIC8vIEFkZCB0aGUgY3VycmVudCBub2RlIGluIGEgbGlzdFxuICAvLyBQb3AgdGhlIG9uZSB3aG9zZSBmIGlzIHRoZSBsb3dlc3RhXG4gIC8vIEFkZCB0byBhIGxpc3Qgb2YgYWxyZWFkeS12aXNpdGVkIChjbG9zZWQpXG4gIC8vIFZpc2l0IGFsbCBpdHMgbmVpZ2hib3Vyc1xuICAvLyBVcGRhdGUgZm9yIGVhY2g6IHRoZSB0cmF2ZWwgY29zdCAoZykgeW91IG1hbmFnZWQgdG8gZG8gYW5kIHlvdXJzZWxmIGFzIHBhcmVudFxuICAvLy8vIFNvIHRoYXQgd2UgY2FuIHJldHJhY2UgaG93IHdlIGdvdCBoZXJlXG4gIHRoaXMuZmluZF9wYXRoID0gKHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24pID0+IHtcbiAgICB0aGlzLmJ1aWxkX2dyaWQoKVxuICAgIGNvbnN0IHN0YXJ0X25vZGUgPSB0aGlzLmdldF9ub2RlX2ZvcihzdGFydF9wb3NpdGlvbik7XG4gICAgY29uc3QgZW5kX25vZGUgPSB0aGlzLmdldF9ub2RlX2ZvcihlbmRfcG9zaXRpb24pO1xuICAgIGlmICghc3RhcnRfbm9kZSB8fCAhZW5kX25vZGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm9kZXMgbm90IG1hdGNoZWRcIilcbiAgICAgIGRlYnVnZ2VyXG4gICAgfVxuXG4gICAgc3RhcnRfbm9kZS5jb2xvdXIgPSAnb3JhbmdlJ1xuICAgIGVuZF9ub2RlLmNvbG91ciA9ICdvcmFuZ2UnXG5cbiAgICBjb25zdCBvcGVuX3NldCA9IFtzdGFydF9ub2RlXTtcbiAgICBjb25zdCBjbG9zZWRfc2V0ID0gW107XG5cbiAgICBjb25zdCBjb3N0ID0gKG5vZGVfYSwgbm9kZV9iKSA9PiB7XG4gICAgICBjb25zdCBkeCA9IG5vZGVfYS54IC0gbm9kZV9iLng7XG4gICAgICBjb25zdCBkeSA9IG5vZGVfYS55IC0gbm9kZV9iLnk7XG4gICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICB9XG5cbiAgICBzdGFydF9ub2RlLmcgPSAwO1xuICAgIHN0YXJ0X25vZGUuZiA9IGNvc3Qoc3RhcnRfbm9kZSwgZW5kX25vZGUpO1xuXG4gICAgd2hpbGUgKG9wZW5fc2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRfbm9kZSA9IG9wZW5fc2V0LnNvcnQoKGEsIGIpID0+IChhLmYgPCBiLmYgPyAtMSA6IDEpKVswXSAvLyBHZXQgdGhlIG5vZGUgd2l0aCBsb3dlc3QgZiB2YWx1ZSBpbiB0aGUgb3BlbiBzZXRcbiAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjdXJyZW50X25vZGUsIG9wZW5fc2V0KVxuICAgICAgY2xvc2VkX3NldC5wdXNoKGN1cnJlbnRfbm9kZSlcbiAgICAgIFxuICAgICAgaWYgKGN1cnJlbnRfbm9kZSA9PT0gZW5kX25vZGUpIHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjdXJyZW50X25vZGU7XG4gICAgICAgIGxldCBwYXRoID0gW107XG4gICAgICAgIHdoaWxlIChjdXJyZW50LnBhcmVudCkge1xuICAgICAgICAgIGN1cnJlbnQuY29sb3VyID0gJ3B1cnBsZSdcbiAgICAgICAgICBwYXRoLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5uZWlnaGJvdXJzKGN1cnJlbnRfbm9kZSkuZm9yRWFjaChuZWlnaGJvdXJfbm9kZSA9PiB7XG4gICAgICAgIGlmICghbmVpZ2hib3VyX25vZGUuYmxvY2tlZCAmJiAhY2xvc2VkX3NldC5pbmNsdWRlcyhuZWlnaGJvdXJfbm9kZSkpIHtcbiAgICAgICAgICBsZXQgZ191c2VkID0gY3VycmVudF9ub2RlLmcgKyBjb3N0KGN1cnJlbnRfbm9kZSwgbmVpZ2hib3VyX25vZGUpXG4gICAgICAgICAgbGV0IGJlc3RfZyA9IGZhbHNlO1xuICAgICAgICAgIGlmICghb3Blbl9zZXQuaW5jbHVkZXMobmVpZ2hib3VyX25vZGUpKSB7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5oID0gY29zdChuZWlnaGJvdXJfbm9kZSwgZW5kX25vZGUpXG4gICAgICAgICAgICBvcGVuX3NldC5wdXNoKG5laWdoYm91cl9ub2RlKVxuICAgICAgICAgICAgYmVzdF9nID0gdHJ1ZVxuICAgICAgICAgIH0gZWxzZSBpZiAoZ191c2VkIDwgbmVpZ2hib3VyX25vZGUuZykge1xuICAgICAgICAgICAgYmVzdF9nID0gdHJ1ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiZXN0X2cpIHtcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLnBhcmVudCA9IGN1cnJlbnRfbm9kZTtcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLmcgPSBnX3VzZWRcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLmYgPSBuZWlnaGJvdXJfbm9kZS5nICsgbmVpZ2hib3VyX25vZGUuaFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB0aGlzLm5laWdoYm91cnMgPSAobm9kZSkgPT4geyAvLyA1LDVcbiAgICBjb25zdCB4X29mZnNldCA9IChNYXRoLmZsb29yKHRoaXMuZW50aXR5LnggKyB0aGlzLmVudGl0eS53aWR0aCAvIDIpIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpKVxuICAgIGNvbnN0IHlfb2Zmc2V0ID0gKE1hdGguZmxvb3IodGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCAvIDIpIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpKVxuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKChub2RlLnggLSB4X29mZnNldCkgLyB0aGlzLnRpbGVfc2l6ZSlcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigobm9kZS55IC0geV9vZmZzZXQpIC8gdGhpcy50aWxlX3NpemUpXG5cbiAgICBmdW5jdGlvbiBmZXRjaF9ncmlkX2NlbGwoZ3JpZCwgbHgsIGx5KSB7XG4gICAgICByZXR1cm4gZ3JpZFtseF0gJiYgZ3JpZFtseF1bbHldXG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHgsIHkgLSAxKSwgLy8gdG9wXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4IC0gMSwgeSAtIDEpLCAvLyB0b3AgbGVmdFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCArIDEsIHkgLSAxKSwgLy8gdG9wIHJpZ2h0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4LCB5ICsgMSksIC8vIGJvdHRvbVxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkgKyAxKSwgLy8gYm90dG9tIGxlZnRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5ICsgMSksIC8vIGJvdHRvbSByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkpLCAvLyByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCArIDEsIHkpIC8vIGxlZnRcbiAgICBdLmZpbHRlcihub2RlID0+IG5vZGUgIT09IHVuZGVmaW5lZClcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkX2RyYXcpIHJldHVyblxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZ3JpZFt4XVt5XTtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gXCIxXCJcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBub2RlLmJvcmRlcl9jb2xvdXJcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gbm9kZS5jb2xvdXJcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3Qobm9kZS54IC0gdGhpcy5nby5jYW1lcmEueCwgbm9kZS55IC0gdGhpcy5nby5jYW1lcmEueSwgbm9kZS53aWR0aCwgbm9kZS5oZWlnaHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3Qobm9kZS54IC0gdGhpcy5nby5jYW1lcmEueCwgbm9kZS55IC0gdGhpcy5nby5jYW1lcmEueSwgbm9kZS53aWR0aCwgbm9kZS5oZWlnaHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZF9ncmlkKClcbiAgfVxuXG4gIC8vIFJlY2VpdmVzIGEgcmVjdCBhbmQgcmV0dXJucyBpdCdzIGZpcnN0IGNvbGxpZGluZyBOb2RlXG4gIHRoaXMuZ2V0X25vZGVfZm9yID0gKHJlY3QpID0+IHtcbiAgICBpZiAocmVjdC53aWR0aCA9PSB1bmRlZmluZWQpIHJlY3Qud2lkdGggPSAxXG4gICAgaWYgKHJlY3QuaGVpZ2h0ID09IHVuZGVmaW5lZCkgcmVjdC5oZWlnaHQgPSAxXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICBpZiAoKHRoaXMuZ3JpZFt4XSA9PT0gdW5kZWZpbmVkKSB8fCAodGhpcy5ncmlkW3hdW3ldID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7eH0sJHt5fSBjb29yZGluYXRlcyBpcyB1bmRlZmluZWRgKVxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBXaWR0aDogJHt0aGlzLndpZHRofTsgaGVpZ2h0OiAke3RoaXMuaGVpZ2h0fSAocmFkaXVzOiAke3RoaXMucmFkaXVzfSlgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpc19jb2xsaWRpbmcoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC4uLnJlY3QsXG4gICAgICAgICAgICB9LCB0aGlzLmdyaWRbeF1beV0pKSByZXR1cm4gdGhpcy5ncmlkW3hdW3ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvLyBVTlVTRUQgT0xEIEFMR09SSVRITVxuXG4gIC8vIFNldHMgYSBnbG9iYWwgdGFyZ2V0IG5vZGVcbiAgLy8gSXQgd2FzIHVzZWQgYmVmb3JlIHRoZSBtb3ZlbWVudCBnb3QgZGV0YWNoZWQgZnJvbSB0aGUgcGxheWVyIGNoYXJhY3RlclxuICB0aGlzLnRhcmdldF9ub2RlID0gbnVsbFxuICB0aGlzLnNldF90YXJnZXQgPSAobm9kZSkgPT4ge1xuICAgIHRoaXMuZ3JpZC5mb3JFYWNoKChub2RlKSA9PiBub2RlLmRpc3RhbmNlID0gMClcbiAgICB0aGlzLnRhcmdldF9ub2RlID0gbm9kZVxuICB9XG5cbiAgLy8gQ2FsY3VsYXRlcyBwb3NzaWJsZSBwb3NzaXRpb25zIGZvciB0aGUgbmV4dCBtb3ZlbWVudFxuICB0aGlzLmNhbGN1bGF0ZV9uZWlnaGJvdXJzID0gKGNoYXJhY3RlcikgPT4ge1xuICAgIGxldCBjaGFyYWN0ZXJfcmVjdCA9IHtcbiAgICAgIHg6IGNoYXJhY3Rlci54IC0gY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgeTogY2hhcmFjdGVyLnkgLSBjaGFyYWN0ZXIuc3BlZWQsXG4gICAgICB3aWR0aDogY2hhcmFjdGVyLndpZHRoICsgY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgaGVpZ2h0OiBjaGFyYWN0ZXIuaGVpZ2h0ICsgY2hhcmFjdGVyLnNwZWVkXG4gICAgfVxuXG4gICAgbGV0IGZ1dHVyZV9tb3ZlbWVudF9jb2xsaXNpb25zID0gY2hhcmFjdGVyLm1vdmVtZW50X2JvYXJkLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIGlzX2NvbGxpZGluZyhjaGFyYWN0ZXJfcmVjdCwgbm9kZSlcbiAgICB9KVxuXG4gICAgLy8gSSdtIGdvbm5hIGNvcHkgdGhlbSBoZXJlIG90aGVyd2lzZSBkaWZmZXJlbnQgZW50aXRpZXMgY2FsY3VsYXRpbmcgZGlzdGFuY2VcbiAgICAvLyB3aWxsIGFmZmVjdCBlYWNoIG90aGVyJ3MgbnVtYmVycy4gVGhpcyBjYW4gYmUgc29sdmVkIHdpdGggYSBkaWZmZXJlbnRcbiAgICAvLyBjYWxjdWxhdGlvbiBhbGdvcml0aG0gYXMgd2VsbC5cbiAgICByZXR1cm4gZnV0dXJlX21vdmVtZW50X2NvbGxpc2lvbnNcbiAgfVxuXG5cbiAgdGhpcy5uZXh0X3N0ZXAgPSAoY2hhcmFjdGVyLCBjbG9zZXN0X25vZGUsIHRhcmdldF9ub2RlKSA9PiB7XG4gICAgLy8gU3RlcDogU2VsZWN0IGFsbCBuZWlnaGJvdXJzXG4gICAgbGV0IHZpc2l0ZWQgPSBbXVxuICAgIGxldCBub2Rlc19wZXJfcm93ID0gTWF0aC50cnVuYyg0MDk2IC8gZ28udGlsZV9zaXplKVxuICAgIGxldCBvcmlnaW5faW5kZXggPSBjbG9zZXN0X25vZGUuaWRcblxuICAgIGxldCBuZWlnaGJvdXJzID0gdGhpcy5jYWxjdWxhdGVfbmVpZ2hib3VycyhjaGFyYWN0ZXIpXG5cbiAgICAvLyBTdGVwOiBTb3J0IG5laWdoYm91cnMgYnkgZGlzdGFuY2UgKHNtYWxsZXIgZGlzdGFuY2UgZmlyc3QpXG4gICAgLy8gV2UgYWRkIHRoZSB3YWxrIG1vdmVtZW50IHRvIHJlLXZpc2l0ZWQgbm9kZXMgdG8gc2lnbmlmeSB0aGlzIGNvc3RcbiAgICBsZXQgbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjID0gbmVpZ2hib3Vycy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5kaXN0YW5jZSkge1xuICAgICAgICAvL2EuZGlzdGFuY2UgKz0gMiAqIGNoYXJhY3Rlci5zcGVlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYS5kaXN0YW5jZSA9IFZlY3RvcjIuZGlzdGFuY2UoYSwgdGFyZ2V0X25vZGUpXG4gICAgICB9XG5cbiAgICAgIGlmIChiLmRpc3RhbmNlKSB7XG4gICAgICAgIC8vYi5kaXN0YW5jZSArPSBjaGFyYWN0ZXIuc3BlZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGIuZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKGIsIHRhcmdldF9ub2RlKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2VcbiAgICB9KVxuXG4gICAgLy8gU3RlcDogU2VsZWN0IG9ubHkgbmVpZ2hib3VyIG5vZGVzIHRoYXQgYXJlIG5vdCBibG9ja2VkXG4gICAgbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjID0gbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGUuYmxvY2tlZCAhPT0gdHJ1ZVxuICAgIH0pXG5cbiAgICAvLyBTdGVwOiBSZXR1cm4gdGhlIGNsb3Nlc3QgdmFsaWQgbm9kZSB0byB0aGUgdGFyZ2V0XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmIHRoZSBjbG9zZXN0IHBvaW50IGlzIHRoZSB0YXJnZXQgaXRzZWxmXG4gICAgLy8gcmV0dXJucyBmYWxzZSBpZiB0aGVyZSBpcyBub3doZXJlIHRvIGdvXG4gICAgaWYgKG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmdXR1cmVfbm9kZSA9IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzY1swXVxuICAgICAgcmV0dXJuIChmdXR1cmVfbm9kZS5pZCA9PSB0YXJnZXRfbm9kZS5pZCA/IHRydWUgOiBmdXR1cmVfbm9kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmUgPSBmdW5jdGlvbiAoY2hhcmFjdGVyLCB0YXJnZXRfbm9kZSkge1xuICAgIGxldCBjaGFyX3BvcyA9IHtcbiAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICB9XG5cbiAgICBsZXQgY3VycmVudF9ub2RlID0gdGhpcy5nZXRfbm9kZV9mb3IoY2hhcl9wb3MpXG4gICAgbGV0IGNsb3Nlc3Rfbm9kZSA9IHRoaXMubmV4dF9zdGVwKGNoYXJhY3RlciwgY3VycmVudF9ub2RlLCB0YXJnZXRfbm9kZSlcblxuICAgIC8vIFdlIGhhdmUgYSBuZXh0IHN0ZXBcbiAgICBpZiAodHlwZW9mIChjbG9zZXN0X25vZGUpID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBsZXQgZnV0dXJlX21vdmVtZW50ID0geyAuLi5jaGFyX3BvcyB9XG4gICAgICBsZXQgeF9zcGVlZCA9IDBcbiAgICAgIGxldCB5X3NwZWVkID0gMFxuICAgICAgaWYgKGNsb3Nlc3Rfbm9kZS54ICE9IGNoYXJhY3Rlci54KSB7XG4gICAgICAgIGxldCBkaXN0YW5jZV94ID0gY2hhcl9wb3MueCAtIGNsb3Nlc3Rfbm9kZS54XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZV94KSA+PSBjaGFyYWN0ZXIuc3BlZWQpIHtcbiAgICAgICAgICB4X3NwZWVkID0gKGRpc3RhbmNlX3ggPiAwID8gLWNoYXJhY3Rlci5zcGVlZCA6IGNoYXJhY3Rlci5zcGVlZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY2hhcl9wb3MueCA8IGNsb3Nlc3Rfbm9kZS54KSB7XG4gICAgICAgICAgICB4X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeCkgKiAtMVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsb3Nlc3Rfbm9kZS55ICE9IGNoYXJhY3Rlci55KSB7XG4gICAgICAgIGxldCBkaXN0YW5jZV95ID0gZnV0dXJlX21vdmVtZW50LnkgLSBjbG9zZXN0X25vZGUueVxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VfeSkgPj0gY2hhcmFjdGVyLnNwZWVkKSB7XG4gICAgICAgICAgeV9zcGVlZCA9IChkaXN0YW5jZV95ID4gMCA/IC1jaGFyYWN0ZXIuc3BlZWQgOiBjaGFyYWN0ZXIuc3BlZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55IDwgY2xvc2VzdF9ub2RlLnkpIHtcbiAgICAgICAgICAgIHlfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV95KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB5X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeSkgKiAtMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGZ1dHVyZV9tb3ZlbWVudC54ICsgeF9zcGVlZFxuICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBmdXR1cmVfbW92ZW1lbnQueSArIHlfc3BlZWRcblxuICAgICAgY2hhcmFjdGVyLmNvb3JkcyhmdXR1cmVfbW92ZW1lbnQpXG4gICAgICAvLyBXZSdyZSBhbHJlYWR5IGF0IHRoZSBiZXN0IHNwb3RcbiAgICB9IGVsc2UgaWYgKGNsb3Nlc3Rfbm9kZSA9PT0gdHJ1ZSkge1xuICAgICAgY29uc29sZS5sb2coXCJyZWFjaGVkXCIpXG4gICAgICBjaGFyYWN0ZXIubW92ZW1lbnRfYm9hcmQgPSBbXVxuICAgICAgY2hhcmFjdGVyLm1vdmluZyA9IGZhbHNlXG4gICAgICAvLyBXZSdyZSBzdHVja1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPOiBnb3QgdGhpcyBvbmNlIGFmdGVyIGhhZCBhbHJlYWR5IHJlYWNoZWQuIFxuICAgICAgY29uc29sZS5sb2coXCJubyBwYXRoXCIpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkXG4iLCJmdW5jdGlvbiBDYW1lcmEoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2FtZXJhID0gdGhpc1xuICB0aGlzLnggPSAwXG4gIHRoaXMueSA9IDBcbiAgdGhpcy5jYW1lcmFfc3BlZWQgPSAzXG5cbiAgdGhpcy5tb3ZlX2NhbWVyYV93aXRoX21vdXNlID0gKGV2KSA9PiB7XG4gICAgLy9pZiAodGhpcy5nby5lZGl0b3IucGFpbnRfbW9kZSkgcmV0dXJuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpIDwgMTAwKSB7XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCB5ICsgdGhlIG1vdmVtZW50IHdlJ2xsIG1ha2UgZnVydGhlciB0aGVyZSBpcyBncmVhdGVyIHRoYW5cbiAgICAgIC8vIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIHNjcmVlbiBtaW51cyB0aGUgaGVpZ2h0IHRoYXQgd2lsbCBhbHJlYWR5IGJlIHZpc2libGVcbiAgICAgIC8vICh0aGUgY2FudmFzIGhlaWdodCksIGRvbid0IGdvIGZ1cnRoZXIgb3duXG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgdG9wIG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpID4gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSAxMDApIHtcbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPCAxMDApIHtcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpID4gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIDEwMCkge1xuICAgICAgLy8gRG9uJ3QgZ28gZnVydGhlciBsZWZ0XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG4gIH1cblxuICB0aGlzLmZvY3VzID0gKHBvaW50KSA9PiB7XG4gICAgbGV0IHggPSBwb2ludC54IC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgICBsZXQgeSA9IHBvaW50LnkgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgICAvLyBzcGVjaWZpYyBtYXAgY3V0cyAoaXQgaGFzIGEgbWFwIG9mZnNldCBvZiA2MCwxNjApXG4gICAgaWYgKHkgPCAwKSB7IHkgPSAwIH1cbiAgICBpZiAoeCA8IDApIHsgeCA9IDAgfVxuICAgIGlmICh4ICsgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCA+IHRoaXMuZ28ud29ybGQud2lkdGgpIHsgeCA9IHRoaXMueCB9XG4gICAgaWYgKHkgKyB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCA+IHRoaXMuZ28ud29ybGQuaGVpZ2h0KSB7IHkgPSB0aGlzLnkgfVxuICAgIC8vIG9mZnNldCBjaGFuZ2VzIGVuZFxuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gIH1cblxuICB0aGlzLmdsb2JhbF9jb29yZHMgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9iaixcbiAgICAgIHg6IG9iai54IC0gdGhpcy54LFxuICAgICAgeTogb2JqLnkgLSB0aGlzLnlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FtZXJhXG4iLCJmdW5jdGlvbiBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmR1cmF0aW9uID0gbnVsbFxuICAgIHRoaXMud2lkdGggPSBnby5jaGFyYWN0ZXIud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IDVcbiAgICB0aGlzLmNvbG91ciA9IFwicHVycGxlXCJcbiAgICB0aGlzLmZ1bGwgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50ID0gMFxuICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IG51bGxcbiAgICB0aGlzLmxhc3RfdGltZSA9IG51bGxcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbFxuICAgIC8vIFN0YXlzIHN0YXRpYyBpbiBhIHBvc2l0aW9uIGluIHRoZSBtYXBcbiAgICAvLyBNZWFuaW5nOiBkb2Vzbid0IG1vdmUgd2l0aCB0aGUgY2FtZXJhXG4gICAgdGhpcy5zdGF0aWMgPSBmYWxzZVxuICAgIHRoaXMueF9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS54IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuICAgIHRoaXMueV9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS55IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydCA9IChkdXJhdGlvbiwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgdGhpcy5zdGFydGluZ190aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMFxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb25cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgfVxuXG4gICAgdGhpcy5zdG9wID0gKCkgPT4gdGhpcy5kdXJhdGlvbiA9IG51bGxcblxuICAgIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZHJhd2luZyBjYXN0aW5nIGJhclwiKVxuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuZHVyYXRpb24gPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBsZXQgZWxhcHNlZF90aW1lID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aW1lO1xuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGVsYXBzZWRfdGltZTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCA8PSB0aGlzLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLmVudGl0eS54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgICAgICAgICAgdGhpcy55ID0gdGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCArIDEwIC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbGV0IGJhcl93aWR0aCA9ICgodGhpcy5jdXJyZW50IC8gdGhpcy5kdXJhdGlvbikgKiB0aGlzLndpZHRoKVxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmICgodGhpcy5jYWxsYmFjayAhPT0gbnVsbCkgJiYgKHRoaXMuY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkpIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FzdGluZ0JhclxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgcmFuZG9tLCBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuaW1wb3J0IEludmVudG9yeSBmcm9tIFwiLi9pbnZlbnRvcnlcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuL2JlaGF2aW9ycy9zdGF0cy5qc1wiXG5pbXBvcnQgU3BlbGxjYXN0aW5nIGZyb20gXCIuL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanNcIlxuaW1wb3J0IEZyb3N0Ym9sdCBmcm9tIFwiLi9zcGVsbHMvZnJvc3Rib2x0LmpzXCJcbmltcG9ydCBCbGluayBmcm9tIFwiLi9zcGVsbHMvYmxpbmsuanNcIlxuaW1wb3J0IEN1dFRyZWUgZnJvbSBcIi4vc2tpbGxzL2N1dF90cmVlLmpzXCJcbmltcG9ydCBTa2lsbCBmcm9tIFwiLi9za2lsbC5qc1wiXG5pbXBvcnQgQnJlYWtTdG9uZSBmcm9tIFwiLi9za2lsbHMvYnJlYWtfc3RvbmUuanNcIlxuaW1wb3J0IE1ha2VGaXJlIGZyb20gXCIuL3NraWxscy9tYWtlX2ZpcmUuanNcIlxuaW1wb3J0IEJvYXJkIGZyb20gXCIuL2JvYXJkLmpzXCJcblxuZnVuY3Rpb24gQ2hhcmFjdGVyKGdvLCBpZCkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jaGFyYWN0ZXIgPSB0aGlzXG4gIHRoaXMubmFtZSA9IGBQbGF5ZXIgJHtTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApKS5zbGljZSgwLCAyKX1gXG4gIHRoaXMuZWRpdG9yID0gZ28uZWRpdG9yXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcImNyaXNpc2NvcmVwZWVwcy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLmlkID0gaWRcbiAgdGhpcy54ID0gMTAwXG4gIHRoaXMueSA9IDEwMFxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBcImRvd25cIlxuICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAwXG4gIHRoaXMuc3BlZWQgPSAxLjRcbiAgdGhpcy5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KHsgZ28gfSk7XG4gIHRoaXMuc3BlbGxib29rID0ge1xuICAgIGZyb3N0Ym9sdDogbmV3IEZyb3N0Ym9sdCh7IGdvLCBlbnRpdHk6IHRoaXMgfSksXG4gICAgYmxpbms6IG5ldyBCbGluayh7IGdvLCBlbnRpdHk6IHRoaXMgfSlcbiAgfVxuICB0aGlzLnNwZWxscyA9IHtcbiAgICBmcm9zdGJvbHQ6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogdGhpcy5zcGVsbGJvb2suZnJvc3Rib2x0IH0pLmNhc3QsXG4gICAgYmxpbms6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogdGhpcy5zcGVsbGJvb2suYmxpbmsgfSkuY2FzdFxuICB9XG4gIHRoaXMuc2tpbGxzID0ge1xuICAgIGN1dF90cmVlOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IEN1dFRyZWUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdCxcbiAgICBicmVha19zdG9uZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBCcmVha1N0b25lKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3QsXG4gICAgbWFrZV9maXJlOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IE1ha2VGaXJlKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3RcbiAgfVxuICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKHsgZ28sIGVudGl0eTogdGhpcywgbWFuYTogNTAgfSk7XG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHlfb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMubWFuYV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMTAsIGNvbG91cjogXCJibHVlXCIgfSlcbiAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7IGdvLCBlbnRpdHk6IHRoaXMsIHJhZGl1czogMjAgfSlcbiAgdGhpcy5leHBlcmllbmNlX3BvaW50cyA9IDBcbiAgdGhpcy5sZXZlbCA9IDE7XG4gIHRoaXMudXBkYXRlX3hwID0gKGVudGl0eSkgPT4ge1xuICAgIHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgKz0gMTAwO1xuICAgIGlmICh0aGlzLmV4cGVyaWVuY2VfcG9pbnRzID49IDEwMDApIHtcbiAgICAgIHRoaXMubGV2ZWwgKz0gMTtcbiAgICAgIHRoaXMuZXhwZXJpZW5jZV9wb2ludHMgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMudXBkYXRlX2ZwcyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X21hbmEgPCB0aGlzLnN0YXRzLm1hbmEpIHRoaXMuc3RhdHMuY3VycmVudF9tYW5hICs9IHJhbmRvbSgxLCAzKVxuICAgIGlmIChuZWFyX2JvbmZpcmUoKSkge1xuICAgICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9ocCA8IHRoaXMuc3RhdHMuaHApIHRoaXMuc3RhdHMuY3VycmVudF9ocCArPSByYW5kb20oNCwgNylcbiAgICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiB0cmllcyB0byBzZWUgaWYgdGhlIHNlbGVjdGVkIGNsaWNrYWJsZSBoYXMgYSBkZWZhdWx0IGFjdGlvbiBzZXQgZm9yIGludGVyYWN0aW9uXG4gIHRoaXMuc2tpbGxfYWN0aW9uID0gKCkgPT4ge1xuICAgIGxldCBlbnRpdHkgPSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZVxuICAgIGlmIChlbnRpdHkgJiYgdGhpcy5za2lsbHNbZW50aXR5LmFjdGVkX2J5X3NraWxsXSkge1xuICAgICAgdGhpcy5za2lsbHNbZW50aXR5LmFjdGVkX2J5X3NraWxsXSgpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgbmVhcl9ib25maXJlID0gKCkgPT4gdGhpcy5nby5maXJlcy5zb21lKGZpcmUgPT4gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCBmaXJlKSA8IDEwMCk7XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLnRhcmdldF9tb3ZlbWVudCkgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCgpXG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIE1hdGguZmxvb3IodGhpcy53YWxrX2N5Y2xlX2luZGV4KSAqIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUoKSAqIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5zdGF0cy5ocCwgdGhpcy5zdGF0cy5jdXJyZW50X2hwKVxuICAgIHRoaXMubWFuYV9iYXIuZHJhdyh0aGlzLnN0YXRzLm1hbmEsIHRoaXMuc3RhdHMuY3VycmVudF9tYW5hKVxuICB9XG5cbiAgdGhpcy5kcmF3X2NoYXJhY3RlciA9ICh7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSkgPT4ge1xuICAgIHggPSB4ID09PSB1bmRlZmluZWQgPyB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54IDogeFxuICAgIHkgPSB5ID09PSB1bmRlZmluZWQgPyB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55IDogeVxuICAgIHdpZHRoID0gd2lkdGggPT09IHVuZGVmaW5lZCA/IHRoaXMud2lkdGggOiB3aWR0aFxuICAgIGhlaWdodCA9IGhlaWdodCA9PT0gdW5kZWZpbmVkID8gdGhpcy5oZWlnaHQgOiBoZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgTWF0aC5mbG9vcih0aGlzLndhbGtfY3ljbGVfaW5kZXgpICogdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSgpICogdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICB9XG5cbiAgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgcmV0dXJuIDJcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgcmV0dXJuIDNcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICByZXR1cm4gMVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIHJldHVybiAwXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZSA9IChkaXJlY3Rpb24pID0+IHtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICAgIGNvbnN0IGZ1dHVyZV9wb3NpdGlvbiA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnksIHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgaWYgKHRoaXMueCArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLndpZHRoICsgdGhpcy5nby53b3JsZC54X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi54ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICBpZiAodGhpcy55IC0gdGhpcy5zcGVlZCA+IHRoaXMuZ28ud29ybGQueV9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueSAtPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICBpZiAodGhpcy54IC0gdGhpcy5zcGVlZCA+IHRoaXMuZ28ud29ybGQueF9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueCAtPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQuaGVpZ2h0ICsgdGhpcy5nby53b3JsZC55X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi55ICs9IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ28udHJlZXMuc29tZSh0cmVlID0+IChpc19jb2xsaWRpbmcoZnV0dXJlX3Bvc2l0aW9uLCB0cmVlKSkpKSB7XG4gICAgICB0aGlzLnggPSBmdXR1cmVfcG9zaXRpb24ueFxuICAgICAgdGhpcy55ID0gZnV0dXJlX3Bvc2l0aW9uLnlcbiAgICAgIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9ICh0aGlzLndhbGtfY3ljbGVfaW5kZXggKyAoMC4wMyAqIHRoaXMuc3BlZWQpKSAlIDNcbiAgICAgIHRoaXMuZ28uY2FtZXJhLmZvY3VzKHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLy8gRXhwZXJpbWVudHNcblxuICBBcnJheS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXSB9XG4gIEFycmF5LnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXNbMF0gfVxuXG4gIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0X21vdmVtZW50ID0gdGhpcy50YXJnZXRfbW92ZW1lbnQpIHtcbiAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgIHRoaXMuZ28uY3R4LmFyYygodGFyZ2V0X21vdmVtZW50LnggLSB0aGlzLmdvLmNhbWVyYS54KSArIDEwLCAodGFyZ2V0X21vdmVtZW50LnkgLSB0aGlzLmdvLmNhbWVyYS55KSArIDEwLCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vIEFVVE8tTU9WRSAocGF0aGZpbmRlcikgLS0gcmVuYW1lIGl0IHRvIG1vdmUgd2hlbiB1c2luZyBwbGF5Z3JvdW5kXG4gIHRoaXMuYXV0b19tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmVtZW50X2JvYXJkLmxlbmd0aCA9PT0gMCkgeyB0aGlzLm1vdmVtZW50X2JvYXJkID0gW10uY29uY2F0KHRoaXMuZ28uYm9hcmQuZ3JpZCkgfVxuICAgIHRoaXMuZ28uYm9hcmQubW92ZSh0aGlzLCB0aGlzLmdvLmJvYXJkLnRhcmdldF9ub2RlKVxuICB9XG5cbiAgLy8gU3RvcmVzIHRoZSB0ZW1wb3JhcnkgdGFyZ2V0IG9mIHRoZSBtb3ZlbWVudCBiZWluZyBleGVjdXRlZFxuICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IG51bGxcbiAgLy8gU3RvcmVzIHRoZSBwYXRoIGJlaW5nIGNhbGN1bGF0ZWRcbiAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuXG4gIHRoaXMuZmluZF9wYXRoID0gKHRhcmdldF9tb3ZlbWVudCkgPT4ge1xuICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG5cbiAgICB0aGlzLnRhcmdldF9tb3ZlbWVudCA9IHRhcmdldF9tb3ZlbWVudFxuXG4gICAgaWYgKHRoaXMuY3VycmVudF9wYXRoLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgeDogdGhpcy54ICsgdGhpcy5zcGVlZCwgeTogdGhpcy55ICsgdGhpcy5zcGVlZCB9KVxuICAgIH1cblxuICAgIHZhciBsYXN0X3N0ZXAgPSB7fVxuICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7fVxuXG4gICAgZG8ge1xuICAgICAgbGFzdF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGhbdGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoIC0gMV1cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudCA9IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgICAvLyBUaGlzIGNvZGUgd2lsbCBrZWVwIHRyeWluZyB0byBnbyBiYWNrIHRvIHRoZSBzYW1lIHByZXZpb3VzIGZyb20gd2hpY2ggd2UganVzdCBicmFuY2hlZCBvdXRcbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuXG4gICAgICAvLyBUaGlzIGlzIHByZXR0eSBoZWF2eS4uLiBJdCdzIGNhbGN1bGF0aW5nIGFnYWluc3QgYWxsIHRoZSBiaXRzIGluIHRoZSBtYXAgPVtcbiAgICAgIHZhciBnb2luZ190b19jb2xsaWRlID0gdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSlcbiAgICAgIGlmIChnb2luZ190b19jb2xsaWRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb2xsaXNpb24gYWhlYWQhJylcbiAgICAgICAgdmFyIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueCA9IG5leHRfbW92ZW1lbnQueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBvbiBZXCIpXG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC55ID0gbmV4dF9tb3ZlbWVudC55IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIFhcIilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9KVxuICAgIH0gd2hpbGUgKChkaXN0YW5jZShsYXN0X3N0ZXAueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkgfHwgKGRpc3RhbmNlKGxhc3Rfc3RlcC55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSlcblxuICAgIHRoaXMubW92aW5nID0gdHJ1ZVxuICB9XG5cbiAgdGhpcy5tb3ZlX29uX3BhdGggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB2YXIgbmV4dF9zdGVwID0gdGhpcy5jdXJyZW50X3BhdGguc2hpZnQoKVxuICAgICAgaWYgKG5leHRfc3RlcCkge1xuICAgICAgICB0aGlzLnggPSBuZXh0X3N0ZXAueFxuICAgICAgICB0aGlzLnkgPSBuZXh0X3N0ZXAueVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdXG5cbiAgdGhpcy5tb3ZlX3RvX3dheXBvaW50ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jb29yZHMobm9kZSlcbiAgfVxuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIC8vdGhpcy5tb3ZlID0gZnVuY3Rpb24odGFyZ2V0X21vdmVtZW50KSB7XG4gIC8vICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgLy8gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxuXG4gIC8vICAgIGlmICgoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPD0gMSkgJiYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpIDw9IDEpKSB7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgLy8gICAgICB0YXJnZXRfbW92ZW1lbnQgPSB7fVxuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiU3RvcHBlZFwiKTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KHRhcmdldF9tb3ZlbWVudClcblxuICAvLyAgICAgIC8vIFBhdGhpbmdcbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSB0aGlzLnggKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgICBpZiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPiAxKSB7XG4gIC8vICAgICAgICBpZiAodGhpcy55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgLSAyO1xuICAvLyAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSB0aGlzLnkgKyAyO1xuICAvLyAgICAgICAgfVxuICAvLyAgICAgIH1cbiAgLy8gICAgfVxuXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC53aWR0aCA9IHRoaXMud2lkdGhcbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gICAgaWYgKCh0aGlzLmdvLmVudGl0aWVzLmV2ZXJ5KChlbnRpdHkpID0+IGVudGl0eS5pZCA9PT0gdGhpcy5pZCB8fCAhaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgZW50aXR5KSApKSAmJlxuICAvLyAgICAgICghdGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKGZ1dHVyZV9tb3ZlbWVudCwgYml0KSkpKSB7XG4gIC8vICAgICAgdGhpcy54ID0gZnV0dXJlX21vdmVtZW50LnhcbiAgLy8gICAgICB0aGlzLnkgPSBmdXR1cmVfbW92ZW1lbnQueVxuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGNvbnNvbGUubG9nKFwiQmxvY2tlZFwiKTtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIC8vICAgIH1cbiAgLy8gIH1cbiAgLy8gIC8vIEVORCAtIENoYXJhY3RlciBNb3ZlbWVudFxuICAvL31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDbGlja2FibGUoZ28sIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlX3NyYykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jbGlja2FibGVzLnB1c2godGhpcylcblxuICB0aGlzLm5hbWUgPSBpbWFnZV9zcmNcbiAgdGhpcy54ID0geFxuICB0aGlzLnkgPSB5XG4gIHRoaXMud2lkdGggPSB3aWR0aFxuICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgdGhpcy5pbWFnZS5zcmMgPSBpbWFnZV9zcmNcbiAgdGhpcy5hY3RpdmF0ZWQgPSBmYWxzZVxuICB0aGlzLnBhZGRpbmcgPSA1XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCwgdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIGlmICh0aGlzLmFjdGl2YXRlZCkge1xuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcIiNmZmZcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggLSB0aGlzLnBhZGRpbmcsIHRoaXMueSAtIHRoaXMucGFkZGluZywgdGhpcy53aWR0aCArICgyKnRoaXMucGFkZGluZyksIHRoaXMuaGVpZ2h0ICsgKDIqdGhpcy5wYWRkaW5nKSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ2xpY2tcIilcbiAgfVxufVxuIiwiaW1wb3J0IENsaWNrYWJsZSBmcm9tIFwiLi9jbGlja2FibGUuanNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb250cm9scyhnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jb250cm9scyA9IHRoaXNcbiAgdGhpcy53aWR0aCA9IHNjcmVlbi53aWR0aFxuICB0aGlzLmhlaWdodCA9IHNjcmVlbi5oZWlnaHQgKiAwLjRcbiAgdGhpcy5hcnJvd3MgPSB7XG4gICAgdXA6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMCwgODAsIDgwLCBcImFycm93X3VwLnBuZ1wiKSxcbiAgICBsZWZ0OiBuZXcgQ2xpY2thYmxlKGdvLCA1MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X2xlZnQucG5nXCIpLFxuICAgIHJpZ2h0OiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpICsgNzAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19yaWdodC5wbmdcIiksXG4gICAgZG93bjogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEyMCwgODAsIDgwLCBcImFycm93X2Rvd24ucG5nXCIpLFxuICB9XG4gIHRoaXMuYXJyb3dzLnVwLmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJ1cFwiKVxuICB0aGlzLmFycm93cy5kb3duLmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJkb3duXCIpXG4gIHRoaXMuYXJyb3dzLmxlZnQuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIilcbiAgdGhpcy5hcnJvd3MucmlnaHQuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCBzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIE9iamVjdC52YWx1ZXModGhpcy5hcnJvd3MpLmZvckVhY2goYXJyb3cgPT4gYXJyb3cuZHJhdygpKVxuICB9XG59XG4iLCJmdW5jdGlvbiBEb29kYWQoeyBnbyB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuXG4gIHRoaXMueCA9IDA7XG4gIHRoaXMueSA9IDA7XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcInBsYW50cy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICB0aGlzLndpZHRoID0gMzJcbiAgdGhpcy5oZWlnaHQgPSAzMlxuICB0aGlzLnJlc291cmNlX2JhciA9IG51bGxcblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAodGFyZ2V0X3Bvc2l0aW9uKSB7XG4gICAgbGV0IHggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnggPyB0YXJnZXRfcG9zaXRpb24ueCA6IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICBsZXQgeSA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueSA/IHRhcmdldF9wb3NpdGlvbi55IDogdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueVxuICAgIGxldCB3aWR0aCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ud2lkdGggPyB0YXJnZXRfcG9zaXRpb24ud2lkdGggOiB0aGlzLndpZHRoXG4gICAgbGV0IGhlaWdodCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0ID8gdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA6IHRoaXMuaGVpZ2h0XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHRoaXMuaW1hZ2VfeF9vZmZzZXQsIHRoaXMuaW1hZ2VfeV9vZmZzZXQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICAgIGlmICh0YXJnZXRfcG9zaXRpb24pIHJldHVyblxuXG4gICAgaWYgKHRoaXMucmVzb3VyY2VfYmFyKSB7XG4gICAgICB0aGlzLnJlc291cmNlX2Jhci5kcmF3KClcbiAgICB9XG4gIH1cblxuICB0aGlzLmNsaWNrID0gZnVuY3Rpb24gKCkgeyB9XG4gIHRoaXMudXBkYXRlX2ZwcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5mdWVsIDw9IDApIHtcbiAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCBnby5maXJlcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mdWVsIC09IDE7XG4gICAgICB0aGlzLnJlc291cmNlX2Jhci5jdXJyZW50IC09IDE7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERvb2RhZDtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEVkaXRvcih7IGdvIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmdvLmVkaXRvciA9IHRoaXNcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMgPSB7XG4gICAgICAgIHg6IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gMzAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuZ28uc2NyZWVuLmhlaWdodFxuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMud2lkdGgsIHRoaXMuZ28uc2NyZWVuLmhlaWdodClcbiAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIuZHJhd19jaGFyYWN0ZXIoe1xuICAgICAgICAgICAgeDogdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArICh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMiksXG4gICAgICAgICAgICB5OiA1MCxcbiAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgIGhlaWdodDogNTBcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyMXB4IHNhbnMtc2VyaWZcIlxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uY2hhcmFjdGVyLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5jaGFyYWN0ZXIueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy55ICsgNTAgKyA1MCArIDIwKVxuXG4gICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkgdGhpcy5kcmF3X3NlbGVjdGlvbigpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd19zZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmRyYXcoe1xuICAgICAgICAgICAgeDogdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArIHRoaXMucmlnaHRfcGFuZWxfY29vcmRzLndpZHRoIC8gMiAtIDM1LFxuICAgICAgICAgICAgeTogdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDIwMCxcbiAgICAgICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgICAgIGhlaWdodDogNzBcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IHRleHQgPSBgeDogJHt0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54LnRvRml4ZWQoMil9LCB5OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnkudG9GaXhlZCgyKX1gXG4gICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dCwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueCArICh0aGlzLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5yaWdodF9wYW5lbF9jb29yZHMueSArIDIwMCArIDEwMClcbiAgICB9XG59IiwiLy8gVGhlIGNhbGxiYWNrcyBzeXN0ZW1cbi8vIFxuLy8gVG8gdXNlIGl0OlxuLy9cbi8vICogaW1wb3J0IHRoZSBjYWxsYmFja3MgeW91IHdhbnRcbi8vXG4vLyAgICBpbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuLy9cbi8vICogY2FsbCB0aGVtIGFuZCBzdG9yZSB0aGUgYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zXG4vL1xuLy8gICAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKTtcbi8vXG4vLyAqIGFkZCBvciByZW1vdmUgY2FsbGJhY2tzIGZyb20gYXJyYXlcbi8vXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmZ1bmN0aW9uIHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4gIHJldHVybiBtb3VzZW1vdmVfY2FsbGJhY2tzO1xufVxuXG5cbmZ1bmN0aW9uIHNldENsaWNrQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fY2xpY2sgID0gKGV2KSA9PiB7XG4gICAgY2xpY2tfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcbiAgcmV0dXJuIGNsaWNrX2NhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0Q2FsbGJhY2soZ28sIGV2ZW50KSB7XG4gIGNvbnN0IGNhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4ge1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZSlcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSlcbiAgcmV0dXJuIGNhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vtb3ZlJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IGNhbGxiYWNrX3F1ZXVlID0gc2V0Q2FsbGJhY2soZ28sICdtb3VzZWRvd24nKTtcbiAgZ28ubW91c2Vkb3duX2NhbGxiYWNrcyA9IGNhbGxiYWNrX3F1ZXVlXG4gIHJldHVybiBjYWxsYmFja19xdWV1ZVxufVxuXG5mdW5jdGlvbiBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2V1cCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hzdGFydCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoZW5kJyk7XG59XG5cbmV4cG9ydCB7XG4gIHNldE1vdXNlbW92ZUNhbGxiYWNrLFxuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufTtcbiIsIi8vIFRoZSBHYW1lIExvb3Bcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBjb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuLy8gZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG4vLyBnYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBwcm9jZXNzX2tleXNfZG93blxuLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xuXG5mdW5jdGlvbiBHYW1lTG9vcCgpIHtcbiAgdGhpcy5kcmF3ID0gbnVsbFxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gbnVsbFxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHt9XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duKClcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIHRoaXMuZHJhdygpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVMb29wXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuY2FudmFzX3JlY3Qud2lkdGgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FudmFzX3JlY3QuaGVpZ2h0KTtcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNsaWNrYWJsZXMgPSBbXVxuICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgdGhpcy5zcGVsbHMgPSBbXSAvLyBTcGVsbCBzeXN0ZW0sIGNvdWxkIGJlIGluamVjdGVkIGJ5IGl0IGFzIHdlbGxcbiAgdGhpcy5za2lsbHMgPSBbXTtcbiAgdGhpcy50cmVlcyA9IFtdO1xuICB0aGlzLmZpcmVzID0gW107XG4gIHRoaXMuc3RvbmVzID0gW107XG4gIHRoaXMubWFuYWdlZF9vYmplY3RzID0gW10gLy8gUmFuZG9tIG9iamVjdHMgdG8gZHJhdy91cGRhdGVcblxuICB0aGlzLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5jdHguc2F2ZSgpXG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSBcInllbGxvd1wiXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwgMjU1LCAwLCAwLjcpYFxuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgIHRoaXMuY3R4LmFyYyhcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueCArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS53aWR0aCAvIDIpIC0gdGhpcy5jYW1lcmEueCxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueSArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS5oZWlnaHQgLyAyKSAtIHRoaXMuY2FtZXJhLnksXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoLCAwLCA1MFxuICAgICAgKVxuICAgICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZU9iamVjdCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludmVudG9yeSh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMubWF4X3Nsb3RzID0gMTJcbiAgdGhpcy5zbG90c19wZXJfcm93ID0gNFxuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5zbG90X3BhZGRpbmcgPSAxMFxuICB0aGlzLnNsb3Rfd2lkdGggPSA1MFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gNTBcbiAgdGhpcy5pbml0aWFsX3ggPSB0aGlzLmdvLnNjcmVlbi53aWR0aCAtICh0aGlzLnNsb3RzX3Blcl9yb3cgKiB0aGlzLnNsb3Rfd2lkdGgpIC0gNTA7XG4gIHRoaXMuaW5pdGlhbF95ID0gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF9oZWlnaHQpIC0gNDAwO1xuICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIHRoaXMueCA9ICgpID0+IHtcbiAgICBjb25zdCByaWdodF9wYW5lbF93aWR0aCA9IHRoaXMuZ28uZWRpdG9yLmFjdGl2ZSA/IHRoaXMuZ28uZWRpdG9yLnJpZ2h0X3BhbmVsX2Nvb3Jkcy53aWR0aCA6IDA7XG4gICAgcmV0dXJuIHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF93aWR0aCkgLSA1MCAtIHJpZ2h0X3BhbmVsX3dpZHRoO1xuICB9XG5cbiAgdGhpcy5hZGQgPSAoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nX2J1bmRsZSA9IHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUgPT0gaXRlbS5uYW1lXG4gICAgfSlcblxuICAgIGlmICgodGhpcy5zbG90cy5sZW5ndGggPj0gdGhpcy5tYXhfc2xvdHMpICYmICghZXhpc3RpbmdfYnVuZGxlKSkgcmV0dXJuXG5cbiAgICBjb25zb2xlLmxvZyhgKioqIEdvdCAke2l0ZW0ucXVhbnRpdHl9ICR7aXRlbS5uYW1lfWApXG4gICAgaWYgKGV4aXN0aW5nX2J1bmRsZSkge1xuICAgICAgZXhpc3RpbmdfYnVuZGxlLnF1YW50aXR5ICs9IGl0ZW0ucXVhbnRpdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zbG90cy5wdXNoKGl0ZW0pXG4gICAgfVxuICB9XG5cbiAgdGhpcy5maW5kID0gKGl0ZW1fbmFtZSkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gaXRlbV9uYW1lLnRvTG93ZXJDYXNlKClcbiAgICB9KVxuICB9XG5cbiAgdGhpcy50b2dnbGVfZGlzcGxheSA9ICgpID0+IHtcbiAgICB0aGlzLmFjdGl2ZSA9ICF0aGlzLmFjdGl2ZTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF4X3Nsb3RzOyBpKyspIHtcbiAgICAgIGxldCB4ID0gTWF0aC5mbG9vcihpICUgNClcbiAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihpIC8gNCk7XG5cbiAgICAgIGlmICgodGhpcy5zbG90c1tpXSAhPT0gdW5kZWZpbmVkKSAmJiAodGhpcy5zbG90c1tpXSAhPT0gbnVsbCkpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc2xvdHNbaV07XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShpdGVtLmltYWdlLCB0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgICBpZiAoaXRlbS5xdWFudGl0eSA+IDEpIHtcbiAgICAgICAgICBsZXQgdGV4dCA9IGl0ZW0ucXVhbnRpdHlcbiAgICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXG4gICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9IFwiMjRweCBzYW5zLXNlcmlmXCJcbiAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpICsgKHRoaXMuc2xvdF93aWR0aCAtIDE1KSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSkgKyAodGhpcy5zbG90X2hlaWdodCAtIDUpKVxuICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gMVxuICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVRleHQodGV4dCwgdGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSArICh0aGlzLnNsb3Rfd2lkdGggLSAxNSksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpICsgKHRoaXMuc2xvdF9oZWlnaHQgLSA1KSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLngoKSArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgICAgfVxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInJnYig2MCwgNDAsIDApXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54KCkgKyAodGhpcy5zbG90X3dpZHRoICogeCkgKyAoeCAqIHRoaXMuc2xvdF9wYWRkaW5nKSwgdGhpcy5pbml0aWFsX3kgKyAodGhpcy5zbG90X2hlaWdodCAqIHkpICsgKHRoaXMuc2xvdF9wYWRkaW5nICogeSksIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodClcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEl0ZW0obmFtZSwgaW1hZ2UsIHF1YW50aXR5ID0gMSwgc3JjX2ltYWdlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgaWYgKGltYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltYWdlLnNyYyA9IHNyY19pbWFnZVxuICB9IGVsc2Uge1xuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZVxuICB9XG4gIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxufVxuIiwiZnVuY3Rpb24gS2V5Ym9hcmRJbnB1dChnbykge1xuICBjb25zdCBvbl9rZXlkb3duID0gKGV2KSA9PiB7XG4gICAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2V2LmtleV0gPSB0cnVlXG4gICAgLy8gVGhlc2UgYXJlIGNhbGxiYWNrcyB0aGF0IG9ubHkgZ2V0IGNoZWNrZWQgb25jZSBvbiB0aGUgZXZlbnRcbiAgICBpZiAodGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XSA9IFtdXG4gICAgfVxuICAgIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3NbZXYua2V5XS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soZXYpKVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbl9rZXlkb3duLCBmYWxzZSlcbiAgY29uc3Qgb25fa2V5dXAgPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IGZhbHNlXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbl9rZXl1cCwgZmFsc2UpXG5cbiAgdGhpcy5nbyA9IGdvO1xuICB0aGlzLmdvLmtleWJvYXJkX2lucHV0ID0gdGhpc1xuICB0aGlzLmtleV9jYWxsYmFja3MgPSB7XG4gICAgZDogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJyaWdodFwiKV0sXG4gICAgdzogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJ1cFwiKV0sXG4gICAgYTogWygpID0+IHRoaXMuZ28uY2hhcmFjdGVyLm1vdmUoXCJsZWZ0XCIpXSxcbiAgICBzOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImRvd25cIildLFxuICB9XG4gIHRoaXMub25fa2V5ZG93bl9jYWxsYmFja3MgPSB7XG4gICAgMTogW11cbiAgfVxuXG4gIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24gPSAoKSA9PiB7XG4gICAgY29uc3Qga2V5c19kb3duID0gT2JqZWN0LmtleXModGhpcy5rZXlzX2N1cnJlbnRseV9kb3duKS5maWx0ZXIoKGtleSkgPT4gdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duW2tleV0gPT09IHRydWUpXG4gICAga2V5c19kb3duLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKCEoT2JqZWN0LmtleXModGhpcy5rZXlfY2FsbGJhY2tzKS5pbmNsdWRlcyhrZXkpKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMua2V5X2NhbGxiYWNrc1trZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjaygpKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLmtleW1hcCA9IHtcbiAgICBkOiBcInJpZ2h0XCIsXG4gICAgdzogXCJ1cFwiLFxuICAgIGE6IFwibGVmdFwiLFxuICAgIHM6IFwiZG93blwiLFxuICB9XG5cbiAgdGhpcy5rZXlzX2N1cnJlbnRseV9kb3duID0ge1xuICAgIGQ6IGZhbHNlLFxuICAgIHc6IGZhbHNlLFxuICAgIGE6IGZhbHNlLFxuICAgIHM6IGZhbHNlLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtleWJvYXJkSW5wdXQ7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb290IHtcbiAgICBjb25zdHJ1Y3RvcihpdGVtLCBxdWFudGl0eSA9IDEpIHtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbVxuICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHlcbiAgICB9XG59IiwiaW1wb3J0IHsgVmVjdG9yMiwgcmFuZG9tLCBkaWNlIH0gZnJvbSBcIi4vdGFwZXRlXCJcbmltcG9ydCBJdGVtIGZyb20gXCIuL2l0ZW1cIlxuaW1wb3J0IExvb3QgZnJvbSBcIi4vbG9vdFwiXG5cbmNsYXNzIExvb3RCb3gge1xuICAgIGNvbnN0cnVjdG9yKGdvKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICBnby5sb290X2JveCA9IHRoaXNcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgICAgIHRoaXMueCA9IDBcbiAgICAgICAgdGhpcy55ID0gMFxuICAgICAgICB0aGlzLndpZHRoID0gMzUwXG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybjtcblxuICAgICAgICAvLyBJZiB0aGUgcGxheWVyIG1vdmVzIGF3YXksIGRlbGV0ZSBpdGVtcyBhbmQgaGlkZSBsb290IGJveCBzY3JlZW5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKFZlY3RvcjIuZGlzdGFuY2UodGhpcywgdGhpcy5nby5jaGFyYWN0ZXIpID4gNTAwKSB8fFxuICAgICAgICAgICAgKHRoaXMuaXRlbXMubGVuZ3RoIDw9IDApXG4gICAgICAgICkge1xuXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVKb2luID0gJ2JldmVsJztcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNTtcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyMDAsIDI1NSwgMC41KVwiO1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggKyAyMCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSArIDIwIC0gdGhpcy5nby5jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5pdGVtcy5sZW5ndGggKiA2MCArIDUpO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGxvb3QgPSB0aGlzLml0ZW1zW2luZGV4XVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIlxuICAgICAgICAgICAgbG9vdC54ID0gdGhpcy54ICsgMjUgLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgICAgICAgICBsb290LnkgPSB0aGlzLnkgKyAoaW5kZXggKiA2MCkgKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICAgICAgICAgIGxvb3Qud2lkdGggPSAzNDBcbiAgICAgICAgICAgIGxvb3QuaGVpZ2h0ID0gNTVcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KGxvb3QueCwgbG9vdC55LCBsb290LndpZHRoLCBsb290LmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZShsb290Lml0ZW0uaW1hZ2UsIGxvb3QueCArIDUsIGxvb3QueSArIDUsIDQ1LCA0NSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnMjJweCBzZXJpZidcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QucXVhbnRpdHksIGxvb3QueCArIDY1LCBsb290LnkgKyAzNSlcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KGxvb3QuaXRlbS5uYW1lLCBsb290LnggKyAxMDAsIGxvb3QueSArIDM1KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZVxuICAgICAgICB0aGlzLnggPSB0aGlzLmdvLmNoYXJhY3Rlci54XG4gICAgICAgIHRoaXMueSA9IHRoaXMuZ28uY2hhcmFjdGVyLnlcbiAgICB9XG5cbiAgICB0YWtlX2xvb3QobG9vdF9pbmRleCkge1xuICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXMuc3BsaWNlKGxvb3RfaW5kZXgsIDEpWzBdXG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLmludmVudG9yeS5hZGQobG9vdC5pdGVtKVxuICAgIH1cblxuICAgIGNoZWNrX2l0ZW1fY2xpY2tlZChldikge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuXG5cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGxvb3QpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPj0gbG9vdC54KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRYIDw9IGxvb3QueCArIGxvb3Qud2lkdGgpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPj0gbG9vdC55KSAmJlxuICAgICAgICAgICAgICAgIChldi5jbGllbnRZIDw9IGxvb3QueSArIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgKVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnRha2VfbG9vdChpbmRleClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJvbGxfbG9vdChsb290X3RhYmxlKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBsb290X3RhYmxlLm1hcCgobG9vdF9lbnRyeSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJvbGwgPSBkaWNlKDEwMClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAqKiogTG9vdCByb2xsIGZvciAke2xvb3RfZW50cnkuaXRlbS5uYW1lfTogJHtyb2xsfSAoY2hhbmNlOiAke2xvb3RfZW50cnkuY2hhbmNlfSlgKVxuICAgICAgICAgICAgaWYgKHJvbGwgPD0gbG9vdF9lbnRyeS5jaGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtX2J1bmRsZSA9IG5ldyBJdGVtKGxvb3RfZW50cnkuaXRlbS5uYW1lKVxuICAgICAgICAgICAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IGxvb3RfZW50cnkuaXRlbS5pbWFnZV9zcmNcbiAgICAgICAgICAgICAgICBpdGVtX2J1bmRsZS5xdWFudGl0eSA9IHJhbmRvbShsb290X2VudHJ5Lm1pbiwgbG9vdF9lbnRyeS5tYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMb290KGl0ZW1fYnVuZGxlLCBpdGVtX2J1bmRsZS5xdWFudGl0eSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMb290Qm94IiwiZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gIHRoaXMuaWQgPSBkYXRhLmlkXG4gIHRoaXMueCA9IGRhdGEueFxuICB0aGlzLnkgPSBkYXRhLnlcbiAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodFxuICB0aGlzLmNvbG91ciA9IFwidHJhbnNwYXJlbnRcIlxuICB0aGlzLmJvcmRlcl9jb2xvdXIgPSBcImJsYWNrXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFydGljbGUoZ28pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKHsgeCwgeSB9KSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKHggLSB0aGlzLmdvLmNhbWVyYS54LCB5IC0gdGhpcy5nby5jYW1lcmEueSwgMTUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICdibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdsaWdodGJsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKTtcbiAgICB9XG59IiwiaW1wb3J0IFBhcnRpY2xlIGZyb20gXCIuL3BhcnRpY2xlLmpzXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3QgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLnBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKGdvKTtcbiAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0XG4gICAgdGhpcy50cmFjZV9jb3VudCA9IDdcbiAgICB0aGlzLmJvdW5kcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB3aWR0aDogNSwgaGVpZ2h0OiA1IH1cbiAgICB9XG4gICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLmFjdCA9ICh7IHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24gfSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gc3RhcnRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN0YXJ0X3Bvc2l0aW9uKVxuICAgICAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IGVuZF9wb3NpdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmVuZF9wb3NpdGlvbiwgdGhpcy5jdXJyZW50X3Bvc2l0aW9uKSA8IDUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdC5lbmQoKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZV9wb3NpdGlvbigpO1xuICAgICAgICB0aGlzLnRyYWNlLnB1c2goT2JqZWN0LmNyZWF0ZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24pKVxuICAgICAgICB0aGlzLnRyYWNlID0gdGhpcy50cmFjZS5zbGljZSgtMSAqIHRoaXMudHJhY2VfY291bnQpXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5kcmF3KHRoaXMuY3VycmVudF9wb3NpdGlvbik7XG4gICAgICAgIHRoaXMudHJhY2UuZm9yRWFjaCh0cmFjZWRfcG9zaXRpb24gPT4gdGhpcy5wYXJ0aWNsZS5kcmF3KHRyYWNlZF9wb3NpdGlvbikpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMi5hbmdsZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24sIHRoaXMuZW5kX3Bvc2l0aW9uKTtcbiAgICAgICAgY29uc3Qgc3BlZWQgPSByYW5kb20oMywgMTIpO1xuICAgICAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmN1cnJlbnRfcG9zaXRpb24ueCArIHNwZWVkICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICAgICAgeTogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnkgKyBzcGVlZCAqIE1hdGguc2luKGFuZ2xlKVxuICAgICAgICB9XG4gICAgfVxufSIsImZ1bmN0aW9uIFJlc291cmNlQmFyKHsgZ28sIHRhcmdldCwgeV9vZmZzZXQgPSAxMCwgY29sb3VyID0gXCJyZWRcIiwgYm9yZGVyLCBmaXhlZCB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLnRhcmdldCA9IHRhcmdldFxuICB0aGlzLmhlaWdodCA9IHRoaXMudGFyZ2V0LndpZHRoIC8gMTA7XG4gIHRoaXMuY29sb3VyID0gY29sb3VyXG4gIHRoaXMuZnVsbCA9IDEwMFxuICB0aGlzLmN1cnJlbnQgPSAxMDBcbiAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gIHRoaXMuYm9yZGVyID0gYm9yZGVyXG4gIHRoaXMuZml4ZWQgPSBmaXhlZCB8fCBmYWxzZVxuICB0aGlzLnggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuZml4ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC54O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQueCAtIHRoaXMuZ28uY2FtZXJhLng7XG4gICAgfVxuICB9XG4gIHRoaXMueSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5maXhlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Lnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC55IC0gdGhpcy5nby5jYW1lcmEueTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCwgZGVidWcgPSBmYWxzZSkgPT4ge1xuICAgIGxldCBiYXJfd2lkdGggPSAoKChNYXRoLm1pbihjdXJyZW50LCBmdWxsKSkgLyBmdWxsKSAqIHRoaXMudGFyZ2V0LndpZHRoKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5ib3JkZXIgfHwgXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54KCksIHRoaXMueSgpIC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpLCB0aGlzLnkoKSAtIHRoaXMueV9vZmZzZXQsIHRoaXMudGFyZ2V0LndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpLCB0aGlzLnkoKSAtIHRoaXMueV9vZmZzZXQsIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VCYXJcbiIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuXG5mdW5jdGlvbiBTY3JlZW4oZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uc2NyZWVuID0gdGhpc1xuICB0aGlzLndpZHRoICA9IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQ7XG4gIHRoaXMucmFkaXVzID0gNzAwXG5cbiAgdGhpcy5jbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jYW52YXMud2lkdGggPSB0aGlzLmdvLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuZ28uY2FudmFzLmhlaWdodCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuZ28uY2FudmFzX3JlY3QgPSB0aGlzLmdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMuY2xlYXIoKVxuICAgIHRoaXMuZ28ud29ybGQuZHJhdygpXG4gIH1cblxuICB0aGlzLmRyYXdfZ2FtZV9vdmVyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjcpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICB0aGlzLmdvLmN0eC5mb250ID0gJzcycHggc2VyaWYnXG4gICAgdGhpcy5nby5jdHguZmlsbFRleHQoXCJHYW1lIE92ZXJcIiwgKHRoaXMuZ28uY2FudmFzLndpZHRoIC8gMikgLSAodGhpcy5nby5jdHgubWVhc3VyZVRleHQoXCJHYW1lIE92ZXJcIikud2lkdGggLyAyKSwgdGhpcy5nby5jYW52YXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICB0aGlzLmRyYXdfZm9nID0gKCkgPT4ge1xuICAgIHZhciB4ID0gdGhpcy5nby5jaGFyYWN0ZXIueCArIHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMiAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICB2YXIgeSA9IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyB0aGlzLmdvLmNoYXJhY3Rlci5oZWlnaHQgLyAyIC0gdGhpcy5nby5jYW1lcmEueVxuICAgIHZhciBncmFkaWVudCA9IHRoaXMuZ28uY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHRoaXMucmFkaXVzKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMCwgMCwgMCwgMCknKVxuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLCAwLCAwLCAxKScpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnRcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NyZWVuXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZXJ2ZXIoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgLy90aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6ODk5OVwiKVxuICB0aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9udWJhcmlhLmhlcm9rdWFwcC5jb206NTQwODJcIilcbiAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMubG9naW4odGhpcy5nby5jaGFyYWN0ZXIpXG4gIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBwYXlsb2FkID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJsb2dpblwiOlxuICAgICAgICBsZXQgbmV3X2NoYXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuICAgICAgICBuZXdfY2hhci5uYW1lID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lXG4gICAgICAgIG5ld19jaGFyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbiAgICAgICAgbmV3X2NoYXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICBjb25zb2xlLmxvZyhgQWRkaW5nIG5ldyBjaGFyYClcbiAgICAgICAgcGxheWVycy5wdXNoKG5ld19jaGFyKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcInBpbmdcIjpcbiAgICAgICAgLy9nby5jdHguZmlsbFJlY3QocGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54LCBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnksIDUwLCA1MClcbiAgICAgICAgLy9nby5jdHguc3Ryb2tlKClcbiAgICAgICAgLy9sZXQgcGxheWVyID0gcGxheWVyc1swXSAvL3BsYXllcnMuZmluZChwbGF5ZXIgPT4gcGxheWVyLm5hbWUgPT09IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIubmFtZSlcbiAgICAgICAgLy9pZiAocGxheWVyKSB7XG4gICAgICAgIC8vICBwbGF5ZXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICAvLyAgcGxheWVyLnkgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnlcbiAgICAgICAgLy99XG4gICAgICAgIC8vYnJlYWs7XG4gICAgfVxuICB9IC8vXG4gIHRoaXMubG9naW4gPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJsb2dpblwiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSxcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG5cbiAgdGhpcy5waW5nID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICBhY3Rpb246IFwicGluZ1wiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSwgXG4gICAgICAgICAgeDogY2hhcmFjdGVyLngsXG4gICAgICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2tpbGwoeyBnbywgZW50aXR5LCBza2lsbCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnNraWxsID0gc2tpbGxcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNraWxsLmFjdCgpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiXG5pbXBvcnQgeyBWZWN0b3IyLCByZW1vdmVfY2xpY2thYmxlLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnJlYWtfc3RvbmUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eSB8fCBnby5jaGFyYWN0ZXJcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3N0b25lID0gdGhpcy5nby5zdG9uZXMuZmluZCgoc3RvbmUpID0+IHN0b25lID09PSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSlcbiAgICAgICAgaWYgKCghdGFyZ2V0ZWRfc3RvbmUpIHx8IChWZWN0b3IyLmRpc3RhbmNlKHRhcmdldGVkX3N0b25lLCB0aGlzLmVudGl0eSkgPiAxMDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdvLnN0b25lcy5pbmRleE9mKHRhcmdldGVkX3N0b25lKVxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QobG9vdF90YWJsZV9zdG9uZSlcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0YXJnZXRlZF9zdG9uZSwgdGhpcy5nby5zdG9uZXMpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF9zdG9uZSwgdGhpcy5nbylcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGxvb3RfdGFibGVfc3RvbmUgPSBbe1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiRmxpbnRzdG9uZVwiLCBpbWFnZV9zcmM6IFwiZmxpbnRzdG9uZS5wbmdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY2hhbmNlOiAxMDBcbiAgICB9XVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCByZW1vdmVfY2xpY2thYmxlIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEN1dFRyZWUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMubG9vdF9ib3ggPSBnby5sb290X2JveFxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IGVudGl0eSB9KVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7IC8vIE1heWJlIEdhbWVPYmplY3Qgc2hvdWxkIGNvbnRyb2wgdGhpcyB0b2dnbGVcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICBjb25zdCB0YXJnZXRlZF90cmVlID0gdGhpcy5nby50cmVlcy5maW5kKCh0cmVlKSA9PiB0cmVlID09PSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSlcbiAgICAgICAgaWYgKCghdGFyZ2V0ZWRfdHJlZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nby5jaGFyYWN0ZXIpID4gMjAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nby50cmVlcy5pbmRleE9mKHRhcmdldGVkX3RyZWUpXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGxvb3Rib3hlcyBoYXZlIHRvIG1vdmUgZnJvbSB3ZWlyZFxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmxvb3RfdGFibGUpXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nby50cmVlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZV9jbGlja2FibGUodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nbylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5sb290X3RhYmxlID0gW3tcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIldvb2RcIiwgaW1hZ2Vfc3JjOiBcImJyYW5jaC5wbmdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMyxcbiAgICAgICAgY2hhbmNlOiA5NVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIkRyeSBMZWF2ZXNcIiwgaW1hZ2Vfc3JjOiBcImxlYXZlcy5qcGVnXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDMsXG4gICAgICAgIGNoYW5jZTogMTAwXG4gICAgICB9XVxuICAgICAgXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiO1xuaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCI7XG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4uL3Jlc291cmNlX2JhclwiO1xuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYWtlRmlyZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eSB8fCBnby5jaGFyYWN0ZXJcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGxldCBkcnlfbGVhdmVzID0gdGhpcy5lbnRpdHkuaW52ZW50b3J5LmZpbmQoXCJkcnkgbGVhdmVzXCIpXG4gICAgICAgIGxldCB3b29kID0gdGhpcy5lbnRpdHkuaW52ZW50b3J5LmZpbmQoXCJ3b29kXCIpXG4gICAgICAgIGxldCBmbGludHN0b25lID0gdGhpcy5lbnRpdHkuaW52ZW50b3J5LmZpbmQoXCJmbGludHN0b25lXCIpXG4gICAgICAgIGlmIChkcnlfbGVhdmVzICYmIGRyeV9sZWF2ZXMucXVhbnRpdHkgPiAwICYmXG4gICAgICAgICAgICB3b29kICYmIHdvb2QucXVhbnRpdHkgPiAwICYmXG4gICAgICAgICAgICBmbGludHN0b25lICYmIGZsaW50c3RvbmUucXVhbnRpdHkgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDE1MDApXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRyeV9sZWF2ZXMucXVhbnRpdHkgLT0gMVxuICAgICAgICAgICAgICAgIHdvb2QucXVhbnRpdHkgLT0gMVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS50eXBlID09PSBcIkJPTkZJUkVcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyZSA9IHRoaXMuZ28uZmlyZXMuZmluZCgoZmlyZSkgPT4gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IGZpcmUpO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLmZ1ZWwgKz0gMjA7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgKz0gMjA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpcmUgPSBuZXcgRG9vZGFkKHsgZ28gfSlcbiAgICAgICAgICAgICAgICAgICAgZmlyZS50eXBlID0gXCJCT05GSVJFXCJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZS5zcmMgPSBcImJvbmZpcmUucG5nXCJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV94X29mZnNldCA9IDI1MFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3lfb2Zmc2V0ID0gMjUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfaGVpZ2h0ID0gMzUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2Vfd2lkdGggPSAzMDBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS53aWR0aCA9IDY0XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaGVpZ2h0ID0gNjRcbiAgICAgICAgICAgICAgICAgICAgZmlyZS54ID0gdGhpcy5lbnRpdHkueDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS55ID0gdGhpcy5lbnRpdHkueTtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5mdWVsID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ286IHRoaXMuZ28sIHRhcmdldDogZmlyZSB9KVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5zdGF0aWMgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmZ1bGwgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLmZpcmVzLnB1c2goZmlyZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nby5jbGlja2FibGVzLnB1c2goZmlyZSlcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDE1MDApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIllvdSBkb250IGhhdmUgYWxsIHJlcXVpcmVkIG1hdGVyaWFscyB0byBtYWtlIGEgZmlyZS5cIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGluayh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuaWQgPSBcInNwZWxsX2JsaW5rXCJcbiAgICB0aGlzLmljb24gPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLmljb24uc3JjID0gXCJibGlua19zcGVsbC5qcGdcIlxuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubWFuYV9jb3N0ID0gN1xuICAgIHRoaXMuY2FzdGluZ190aW1lX2luX21zID0gMFxuICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gbnVsbFxuICAgIHRoaXMuY29vbGRvd25fdGltZV9pbl9tcyA9IDcwMDBcbiAgICB0aGlzLm9uX2Nvb2xkb3duID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0X2Nhc3RfYXQgJiYgRGF0ZS5ub3coKSAtIHRoaXMubGFzdF9jYXN0X2F0IDwgdGhpcy5jb29sZG93bl90aW1lX2luX21zXG4gICAgfVxuXG4gICAgdGhpcy5pc192YWxpZCA9ICgpID0+ICF0aGlzLm9uX2Nvb2xkb3duKClcbiAgICBcbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVyblxuXG4gICAgICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpXG4gICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDM7XG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gJ3B1cnBsZSdcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMuZ28ubW91c2VfcG9zaXRpb24ueSAtIHRoaXMuZ28uY2FtZXJhLnksIDUwLCAwLCBNYXRoLlBJICogMilcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlKClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc3BlbGxzKVxuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KGNsaWNrX2NhbGxiYWNrLCB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuZ28uc3BlbGxzLnB1c2godGhpcylcbiAgICAgICAgICAgIHRoaXMuZ28ubW91c2Vkb3duX2NhbGxiYWNrcy5wdXNoKGNsaWNrX2NhbGxiYWNrKVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVuZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLmVudGl0eS5jdXJyZW50X21hbmEgLT0gdGhpcy5tYW5hX2Nvc3RcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc3BlbGxzKVxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQoY2xpY2tfY2FsbGJhY2ssIHRoaXMuZ28ubW91c2Vkb3duX2NhbGxiYWNrcylcbiAgICAgICAgdGhpcy5sYXN0X2Nhc3RfYXQgPSBEYXRlLm5vdygpXG4gICAgfVxuXG4gICAgY29uc3QgY2xpY2tfY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50aXR5LnggPSB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLng7XG4gICAgICAgIHRoaXMuZW50aXR5LnkgPSB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnk7XG4gICAgICAgIHRoaXMuZW5kKCk7XG4gICAgfVxufSIsImltcG9ydCBQcm9qZWN0aWxlIGZyb20gXCIuLi9wcm9qZWN0aWxlXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgaXNfY29sbGlkaW5nLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRnJvc3Rib2x0KHsgZ28gfSkge1xuICAgIHRoaXMuaWQgPSBcInNwZWxsX2Zyb3N0Ym9sdFwiXG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5pY29uID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmljb24uc3JjID0gXCJodHRwczovL2NkbmEuYXJ0c3RhdGlvbi5jb20vcC9hc3NldHMvaW1hZ2VzL2ltYWdlcy8wMDkvMDMxLzE5MC9sYXJnZS9yaWNoYXJkLXRob21hcy1wYWludHMtMTEtdjIuanBnXCJcbiAgICB0aGlzLnByb2plY3RpbGUgPSBuZXcgUHJvamVjdGlsZSh7IGdvLCBzdWJqZWN0OiB0aGlzIH0pXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubWFuYV9jb3N0ID0gMTVcbiAgICB0aGlzLmNhc3RpbmdfdGltZV9pbl9tcyA9IDE1MDBcbiAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IG51bGxcbiAgICB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXMgPSAxMDBcbiAgICB0aGlzLm9uX2Nvb2xkb3duID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0X2Nhc3RfYXQgJiYgRGF0ZS5ub3coKSAtIHRoaXMubGFzdF9jYXN0X2F0IDwgdGhpcy5jb29sZG93bl90aW1lX2luX21zXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5kcmF3KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3Nsb3QgPSAoc2xvdCkgPT4ge1xuICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHgsIHksIHRoaXMuZ28uYWN0aW9uX2Jhci5zbG90X3dpZHRoLCB0aGlzLmdvLmFjdGlvbl9iYXIuc2xvdF9oZWlnaHQpXG4gICAgICAgIFxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm5cblxuICAgICAgICBpZiAoKGlzX2NvbGxpZGluZyh0aGlzLnByb2plY3RpbGUuYm91bmRzKCksIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSkpIHtcbiAgICAgICAgICAgIGlmIChkYW1hZ2VhYmxlKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhbWFnZSA9IHJhbmRvbSg1LCAxMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuc3RhdHMudGFrZV9kYW1hZ2UoeyBkYW1hZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aWxlLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzX3ZhbGlkID0gKCkgPT4gIXRoaXMub25fY29vbGRvd24oKSAmJiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSAmJiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cztcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gbnVsbCkgfHwgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB1bmRlZmluZWQpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc3RhcnRfcG9zaXRpb24gPSB7IHg6IHRoaXMuZ28uY2hhcmFjdGVyLnggKyA1MCwgeTogdGhpcy5nby5jaGFyYWN0ZXIueSArIDUwIH1cbiAgICAgICAgY29uc3QgZW5kX3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueCArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnkgKyB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5oZWlnaHQgLyAyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmFjdCh7IHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24gfSlcblxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy5nby5zcGVsbHMucHVzaCh0aGlzKVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpO1xuICAgICAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IERhdGUubm93KClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYW1hZ2VhYmxlKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0LnN0YXRzICE9PSB1bmRlZmluZWQgJiYgb2JqZWN0LnN0YXRzLnRha2VfZGFtYWdlICE9PSB1bmRlZmluZWRcbiAgICB9XG59IiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSksXG4gIGFuZ2xlOiAoY3VycmVudF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiBNYXRoLmF0YW4yKGVuZF9wb3NpdGlvbi55IC0gY3VycmVudF9wb3NpdGlvbi55LCBlbmRfcG9zaXRpb24ueCAtIGN1cnJlbnRfcG9zaXRpb24ueClcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGlmIChcbiAgICAoc2VsZi54IDwgdGFyZ2V0LnggKyB0YXJnZXQud2lkdGgpICYmXG4gICAgKHNlbGYueCArIHNlbGYud2lkdGggPiB0YXJnZXQueCkgJiZcbiAgICAoc2VsZi55IDwgdGFyZ2V0LnkgKyB0YXJnZXQuaGVpZ2h0KSAmJlxuICAgIChzZWxmLnkgKyBzZWxmLmhlaWdodCA+IHRhcmdldC55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuY29uc3QgcmFuZG9tID0gKHN0YXJ0LCBlbmQpID0+IHtcbiAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydFxuICAgIHN0YXJ0ID0gMFxuICB9XG4gIHJldHVybiBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBlbmQpICsgc3RhcnQgIFxufVxuXG5mdW5jdGlvbiByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQob2JqZWN0LCBsaXN0KSB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKG9iamVjdCk7XG4gIGlmIChpbmRleCA+IC0xKSB7XG4gICAgcmV0dXJuIGxpc3Quc3BsaWNlKGluZGV4LCAxKVswXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9jbGlja2FibGUoZG9vZGFkLCBnbykge1xuICBjb25zdCBjbGlja2FibGVfaW5kZXggPSBnby5jbGlja2FibGVzLmluZGV4T2YoZG9vZGFkKVxuICBpZiAoY2xpY2thYmxlX2luZGV4ID4gLTEpIHtcbiAgICBnby5jbGlja2FibGVzLnNwbGljZShjbGlja2FibGVfaW5kZXgsIDEpXG4gIH1cbiAgaWYgKGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZG9vZGFkKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB9XG59XG5cbmNvbnN0IGRpY2UgPSAoc2lkZXMsIHRpbWVzID0gMSkgPT4ge1xuICByZXR1cm4gQXJyYXkuZnJvbShBcnJheSh0aW1lcykpLm1hcCgoaSkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2lkZXMpICsgMSk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgZGljZSwgcmVtb3ZlX2NsaWNrYWJsZSB9XG4iLCJjbGFzcyBUaWxlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZV9zcmMsIHhfb2Zmc2V0ID0gMCwgeV9vZmZzZXQgPSAwLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICAgICAgICB0aGlzLnhfb2Zmc2V0ID0geF9vZmZzZXRcbiAgICAgICAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGlsZSIsImltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGVcIlxuXG4vLyBUaGUgV29ybGQgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgaXRzZWxmLlxuZnVuY3Rpb24gV29ybGQoZ28pIHtcbiAgdGhpcy5nbyA9IGdvO1xuICB0aGlzLmdvLndvcmxkID0gdGhpcztcbiAgdGhpcy53aWR0aCA9IDEwMDAwO1xuICB0aGlzLmhlaWdodCA9IDEwMDAwO1xuICB0aGlzLnhfb2Zmc2V0ID0gMDtcbiAgdGhpcy55X29mZnNldCA9IDA7XG4gIHRoaXMudGlsZV9zZXQgPSB7XG4gICAgZ3Jhc3M6IG5ldyBUaWxlKFwiZ3Jhc3MucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgZGlydDogbmV3IFRpbGUoXCJkaXJ0Mi5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBzdG9uZTogbmV3IFRpbGUoXCJmbGludHN0b25lLnBuZ1wiLCAwLCAwLCA4NDAsIDg1OSksXG4gIH1cbiAgdGhpcy5waWNrX3JhbmRvbV90aWxlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRpbGVfc2V0LmdyYXNzXG4gIH1cbiAgdGhpcy50aWxlX3dpZHRoID0gNjRcbiAgdGhpcy50aWxlX2hlaWdodCA9IDY0XG4gIHRoaXMudGlsZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmModGhpcy53aWR0aCAvIHRoaXMudGlsZV93aWR0aCkgKyAxO1xuICB0aGlzLnRpbGVzX3Blcl9jb2x1bW4gPSBNYXRoLnRydW5jKHRoaXMuaGVpZ2h0IC8gdGhpcy50aWxlX2hlaWdodCkgKyAxO1xuICB0aGlzLnRpbGVzID0gbnVsbDtcbiAgdGhpcy5nZW5lcmF0ZV9tYXAgPSAoKSA9PiB7XG4gICAgdGhpcy50aWxlcyA9IG5ldyBBcnJheSh0aGlzLnRpbGVzX3Blcl9yb3cpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBpZiAodGhpcy50aWxlc1tyb3ddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10gPSBbdGhpcy5waWNrX3JhbmRvbV90aWxlKCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddLnB1c2godGhpcy5waWNrX3JhbmRvbV90aWxlKCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMudGlsZXNbcm93XVtjb2x1bW5dXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGVfc2V0LmdyYXNzKSB7XG4gICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMudGlsZV9zZXQuZ3Jhc3MuaW1hZ2UsXG4gICAgICAgICAgICB0aGlzLnRpbGVfc2V0LmdyYXNzLnhfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLnlfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLndpZHRoLCB0aGlzLnRpbGVfc2V0LmdyYXNzLmhlaWdodCxcbiAgICAgICAgICAgIHRoaXMueF9vZmZzZXQgKyAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsXG4gICAgICAgICAgICB0aGlzLnlfb2Zmc2V0ICsgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDYzKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aWxlLmltYWdlLFxuICAgICAgICAgIHRpbGUueF9vZmZzZXQsIHRpbGUueV9vZmZzZXQsIHRpbGUud2lkdGgsIHRpbGUuaGVpZ2h0LFxuICAgICAgICAgIHRoaXMueF9vZmZzZXQgKyAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsXG4gICAgICAgICAgdGhpcy55X29mZnNldCArIChjb2x1bW4gKiB0aGlzLnRpbGVfaGVpZ2h0KSAtIHRoaXMuZ28uY2FtZXJhLnksIDY1LCA2NSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV29ybGQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gXCIuL2dhbWVfb2JqZWN0LmpzXCJcbmltcG9ydCBTY3JlZW4gZnJvbSBcIi4vc2NyZWVuLmpzXCJcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vY2FtZXJhLmpzXCJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyLmpzXCJcbmltcG9ydCBLZXlib2FyZElucHV0IGZyb20gXCIuL2tleWJvYXJkX2lucHV0LmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiwgcmFuZG9tLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IHtcbiAgc2V0Q2xpY2tDYWxsYmFjayxcbiAgc2V0TW91c2VNb3ZlQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldFRvdWNoc3RhcnRDYWxsYmFjayxcbiAgc2V0VG91Y2hlbmRDYWxsYmFjayxcbn0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG5pbXBvcnQgR2FtZUxvb3AgZnJvbSBcIi4vZ2FtZV9sb29wLmpzXCJcbmltcG9ydCBXb3JsZCBmcm9tIFwiLi93b3JsZC5qc1wiXG5pbXBvcnQgRG9vZGFkIGZyb20gXCIuL2Rvb2RhZC5qc1wiXG5pbXBvcnQgQ29udHJvbHMgZnJvbSBcIi4vY29udHJvbHMuanNcIlxuaW1wb3J0IFNlcnZlciBmcm9tIFwiLi9zZXJ2ZXJcIlxuaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4vbG9vdF9ib3guanNcIlxuaW1wb3J0IENyZWVwIGZyb20gXCIuL2JlaW5ncy9jcmVlcC5qc1wiXG5pbXBvcnQgQWN0aW9uQmFyIGZyb20gXCIuL2FjdGlvbl9iYXIuanNcIlxuaW1wb3J0IFN0b25lIGZyb20gXCIuL2JlaW5ncy9zdG9uZS5qc1wiXG5pbXBvcnQgVHJlZSBmcm9tIFwiLi9iZWluZ3MvdHJlZS5qc1wiXG5pbXBvcnQgRWRpdG9yIGZyb20gXCIuL2VkaXRvci9pbmRleC5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyLmpzXCJcblxuY29uc3QgZ28gPSBuZXcgR2FtZU9iamVjdCgpXG5jb25zdCBzY3JlZW4gPSBuZXcgU2NyZWVuKGdvKVxuY29uc3QgY2FtZXJhID0gbmV3IENhbWVyYShnbylcbmNvbnN0IGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG5jb25zdCBrZXlib2FyZF9pbnB1dCA9IG5ldyBLZXlib2FyZElucHV0KGdvKVxuY29uc3Qgd29ybGQgPSBuZXcgV29ybGQoZ28pXG5jb25zdCBjb250cm9scyA9IG5ldyBDb250cm9scyhnbylcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoZ28pXG5jb25zdCBsb290X2JveCA9IG5ldyBMb290Qm94KGdvKVxuY29uc3QgYWN0aW9uX2JhciA9IG5ldyBBY3Rpb25CYXIoZ28pXG5jb25zdCBlZGl0b3IgPSBuZXcgRWRpdG9yKHsgZ28gfSlcbmNvbnN0IGV4cGVyaWVuY2VfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogeyB4OiBnby5zY3JlZW4ud2lkdGggLyAyIC0gNTAwLCB5OiBnby5zY3JlZW4uaGVpZ2h0IC0gMzAsIHdpZHRoOiAxMDAwLCBoZWlnaHQ6IDUgfSwgY29sb3VyOiBcInB1cnBsZVwiLCBib3JkZXI6IFwid2hpdGVcIiwgZml4ZWQ6IHRydWUgfSk7XG5leHBlcmllbmNlX2Jhci5oZWlnaHQgPSAzMFxuXG4vLyBEaXNhYmxlIHJpZ2h0IG1vdXNlIGNsaWNrXG5nby5jYW52YXMub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7IGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfVxuXG5jb25zdCBjbGlja19jYWxsYmFja3MgPSBzZXRDbGlja0NhbGxiYWNrKGdvKVxuY2xpY2tfY2FsbGJhY2tzLnB1c2goY2xpY2thYmxlX2NsaWNrZWQpXG5mdW5jdGlvbiBjbGlja2FibGVfY2xpY2tlZChldikge1xuICBsZXQgY2xpY2sgPSB7IHg6IGV2LmNsaWVudFggKyBnby5jYW1lcmEueCwgeTogZXYuY2xpZW50WSArIGdvLmNhbWVyYS55LCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgY29uc3QgY2xpY2thYmxlID0gZ28uY2xpY2thYmxlcy5maW5kKChjbGlja2FibGUpID0+IGlzX2NvbGxpZGluZyhjbGlja2FibGUsIGNsaWNrKSlcbiAgaWYgKGNsaWNrYWJsZSkge1xuICAgIGNsaWNrYWJsZS5hY3RpdmF0ZWQgPSAhY2xpY2thYmxlLmFjdGl2YXRlZFxuICB9XG4gIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IGNsaWNrYWJsZVxufVxuXG5sZXQgbW91c2VfaXNfZG93biA9IGZhbHNlXG5nby5tb3VzZV9wb3NpdGlvbiA9IHt9XG5jb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pXG5tb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5mdW5jdGlvbiB0cmFja19tb3VzZV9wb3NpdGlvbihldnQpIHtcbiAgdmFyIHJlY3QgPSBnby5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgZ28ubW91c2VfcG9zaXRpb24gPSB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQgKyBjYW1lcmEueCxcbiAgICB5OiBldnQuY2xpZW50WSAtIHJlY3QudG9wICsgY2FtZXJhLnlcbiAgfVxufVxuY29uc3QgbW91c2Vkb3duX2NhbGxiYWNrcyA9IHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKVxubW91c2Vkb3duX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5jb25zdCBtb3VzZXVwX2NhbGxiYWNrcyA9IHNldE1vdXNldXBDYWxsYmFjayhnbylcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKGxvb3RfYm94LmNoZWNrX2l0ZW1fY2xpY2tlZC5iaW5kKGxvb3RfYm94KSlcbmNvbnN0IHRvdWNoc3RhcnRfY2FsbGJhY2tzID0gc2V0VG91Y2hzdGFydENhbGxiYWNrKGdvKVxudG91Y2hzdGFydF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSB0cnVlKVxuY29uc3QgdG91Y2hlbmRfY2FsbGJhY2tzID0gc2V0VG91Y2hlbmRDYWxsYmFjayhnbylcbnRvdWNoZW5kX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxuZnVuY3Rpb24gY29udHJvbHNfbW92ZW1lbnQoKSB7XG4gIC8vIGdvLmNsaWNrYWJsZXMuZm9yRWFjaCgoY2xpY2thYmxlKSA9PiB7XG4gIC8vICAgaWYgKGNsaWNrYWJsZS5hY3RpdmF0ZWQpIHtcbiAgLy8gICAgIGNsaWNrYWJsZS5jbGljaygpXG4gIC8vICAgfVxuICAvLyB9KVxufVxuXG5cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmYgPSBbY2hhcmFjdGVyLnNraWxsX2FjdGlvbl1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWzBdID0gW2NoYXJhY3Rlci5za2lsbHMubWFrZV9maXJlXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMV0gPSBbY2hhcmFjdGVyLnNwZWxscy5mcm9zdGJvbHRdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1syXSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmJsaW5rXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuaSA9IFtjaGFyYWN0ZXIuaW52ZW50b3J5LnRvZ2dsZV9kaXNwbGF5XVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuYiA9IFtjaGFyYWN0ZXIuYm9hcmQudG9nZ2xlX2dyaWRdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5lID0gWygpID0+IGVkaXRvci5hY3RpdmUgPSAhZWRpdG9yLmFjdGl2ZV1cbi8va2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MucCA9IFtib2FyZC53YXlfdG9fcGxheWVyXVxuXG5sZXQgRlBTID0gMFxubGV0IGxhc3RfdGljayA9IERhdGUubm93KClcbmNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgRlBTID0gRGF0ZS5ub3coKSAtIGxhc3RfdGlja1xuICBpZiAoKEZQUykgPiAxMDAwKSB7XG4gICAgdXBkYXRlX2ZwcygpXG4gICAgY29uc29sZS5sb2coRlBTKVxuICAgIGxhc3RfdGljayA9IERhdGUubm93KClcbiAgfVxuICBpZiAoIWNoYXJhY3Rlci5zdGF0cy5pc19hbGl2ZSgpKSB7XG4gICAgY29udHJvbHNfbW92ZW1lbnQoKVxuICB9IGVsc2Uge1xuICAgIGdvLnNwZWxscy5mb3JFYWNoKHNwZWxsID0+IHNwZWxsLnVwZGF0ZSgpKVxuICAgIGdvLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IudXBkYXRlKCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlX2ZwcygpIHtcbiAgaWYgKGNoYXJhY3Rlci5zdGF0cy5pc19hbGl2ZSgpKSB7XG4gICAgY2hhcmFjdGVyLnVwZGF0ZV9mcHMoKVxuICB9XG4gIGdvLmZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLnVwZGF0ZV9mcHMoKSlcbn1cbi8vIENvbW1lbnRcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIGlmIChjaGFyYWN0ZXIuc3RhdHMuaXNfZGVhZCgpKSB7XG4gICAgc2NyZWVuLmRyYXdfZ2FtZV9vdmVyKClcbiAgfSBlbHNlIHtcbiAgICBzY3JlZW4uZHJhdygpXG4gICAgZ28uZHJhd19zZWxlY3RlZF9jbGlja2FibGUoKVxuICAgIGdvLnN0b25lcy5mb3JFYWNoKHN0b25lID0+IHN0b25lLmRyYXcoKSlcbiAgICBnby50cmVlcy5mb3JFYWNoKHRyZWUgPT4gdHJlZS5kcmF3KCkpXG4gICAgZ28uZmlyZXMuZm9yRWFjaChmaXJlID0+IGZpcmUuZHJhdygpKVxuICAgIGdvLnNwZWxscy5mb3JFYWNoKHNwZWxsID0+IHNwZWxsLmRyYXcoKSlcbiAgICBnby5za2lsbHMuZm9yRWFjaChza2lsbCA9PiBza2lsbC5kcmF3KCkpXG4gICAgY2hhcmFjdGVyLmRyYXcoKVxuICAgIGdvLm1hbmFnZWRfb2JqZWN0cy5mb3JFYWNoKG1vYiA9PiBtb2IuZHJhdygpKVxuICAgIGdvLmNyZWVwcy5mb3JFYWNoKGNyZWVwID0+IGNyZWVwLmRyYXcoKSlcbiAgICBzY3JlZW4uZHJhd19mb2coKVxuICAgIGxvb3RfYm94LmRyYXcoKVxuICAgIGdvLmNoYXJhY3Rlci5pbnZlbnRvcnkuZHJhdygpXG4gICAgYWN0aW9uX2Jhci5kcmF3KClcbiAgICBjaGFyYWN0ZXIuYm9hcmQuZHJhdygpXG4gICAgZWRpdG9yLmRyYXcoKVxuICAgIGV4cGVyaWVuY2VfYmFyLmRyYXcoMTAwMCwgZ28uY2hhcmFjdGVyLmV4cGVyaWVuY2VfcG9pbnRzKVxuICAgIGlmIChzaG93X2NvbnRyb2xfd2hlZWwpIGRyYXdfY29udHJvbF93aGVlbCgpXG4gIH1cbn0gXG5cbi8vIFRyZWVzXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgbGV0IHRyZWUgPSBuZXcgVHJlZSh7IGdvIH0pXG4gIGdvLnRyZWVzLnB1c2godHJlZSlcbiAgZ28uY2xpY2thYmxlcy5wdXNoKHRyZWUpXG59KVxuLy8gU3RvbmVzXG5BcnJheS5mcm9tKEFycmF5KDMwMCkpLmZvckVhY2goKGosIGkpID0+IHtcbiAgY29uc3Qgc3RvbmUgPSBuZXcgU3RvbmUoeyBnbyB9KTtcbiAgZ28uc3RvbmVzLnB1c2goc3RvbmUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaChzdG9uZSlcbn0pXG4vLyBDcmVlcFxuZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gIGxldCBjcmVlcCA9IG5ldyBDcmVlcCh7IGdvIH0pO1xuICBnby5jbGlja2FibGVzLnB1c2goY3JlZXApO1xufVxuY29uc3QgZHVtbXkgPSBuZXcgQ3JlZXAoeyBnbyB9KVxuZHVtbXkueCA9IDgwMDtcbmR1bW15LnkgPSAyMDA7XG5nby5jbGlja2FibGVzLnB1c2goZHVtbXkpXG5cbmxldCBvcmRlcmVkX2NsaWNrYWJsZXMgPSBbXTtcbmNvbnN0IHRhYl9jeWNsaW5nID0gKGV2KSA9PiB7XG4gIGV2LnByZXZlbnREZWZhdWx0KClcbiAgb3JkZXJlZF9jbGlja2FibGVzID0gZ28uY3JlZXBzLnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gVmVjdG9yMi5kaXN0YW5jZShhLCBjaGFyYWN0ZXIpIC0gVmVjdG9yMi5kaXN0YW5jZShiLCBjaGFyYWN0ZXIpO1xuICB9KVxuICBpZiAoVmVjdG9yMi5kaXN0YW5jZShvcmRlcmVkX2NsaWNrYWJsZXNbMF0sIGNoYXJhY3RlcikgPiA1MDApIHJldHVybjtcblxuICBpZiAob3JkZXJlZF9jbGlja2FibGVzWzBdID09PSBnby5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBvcmRlcmVkX2NsaWNrYWJsZXNbMV07XG4gIH0gZWxzZSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gb3JkZXJlZF9jbGlja2FibGVzWzBdXG4gIH1cbn1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wiVGFiXCJdID0gW3RhYl9jeWNsaW5nXVxuXG5sZXQgc2hvd19jb250cm9sX3doZWVsID0gZmFsc2VcbmNvbnN0IGRyYXdfY29udHJvbF93aGVlbCA9ICgpID0+IHtcbiAgZ28uY3R4LmJlZ2luUGF0aCgpXG4gIGdvLmN0eC5hcmMoXG4gICAgY2hhcmFjdGVyLnggKyAoY2hhcmFjdGVyLndpZHRoIC8gMikgLSBnby5jYW1lcmEueCxcbiAgICBjaGFyYWN0ZXIueSArIChjaGFyYWN0ZXIuaGVpZ2h0IC8gMikgLSBnby5jYW1lcmEueSxcbiAgICAyMDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gIGdvLmN0eC5saW5lV2lkdGggPSA1XG4gIGdvLmN0eC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIlxuICBnby5jdHguc3Ryb2tlKCk7XG59XG5jb25zdCB0b2dnbGVfY29udHJvbF93aGVlbCA9ICgpID0+IHsgc2hvd19jb250cm9sX3doZWVsID0gIXNob3dfY29udHJvbF93aGVlbCB9XG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1tcImNcIl0gPSBbdG9nZ2xlX2NvbnRyb2xfd2hlZWxdXG5cbmNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG5nYW1lX2xvb3AuZHJhdyA9IGRyYXdcbmdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IGdvLmtleWJvYXJkX2lucHV0LnByb2Nlc3Nfa2V5c19kb3duXG5nYW1lX2xvb3AudXBkYXRlID0gdXBkYXRlXG5cbmNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICBjaGFyYWN0ZXIueCA9IDEwMFxuICBjaGFyYWN0ZXIueSA9IDEwMFxuICBnby53b3JsZC5nZW5lcmF0ZV9tYXAoKVxuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZV9sb29wLmxvb3AuYmluZChnYW1lX2xvb3ApKTtcbn1cblxuc3RhcnQoKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==