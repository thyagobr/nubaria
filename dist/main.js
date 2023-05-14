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
function ActionBar(game_object) {
  this.game_object = game_object
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

  function Slot({ spell, x, y }) {
    this.spell = spell
    this.x = x;
    this.y = y;
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

    // Combat system
    this.last_attack_at = null;
    this.attack_speed = 1000;

    this.act = () => {
        let distance = _tapete__WEBPACK_IMPORTED_MODULE_1__.Vector2.distance(this.go.character, entity)
        if (distance < this.radius) {
            this.move.act();
            // this.board.draw();
        if (distance < 5) {
            if (this.last_attack_at === null || (this.last_attack_at + this.attack_speed) < Date.now()) {
                this.go.character.stats.take_damage({ damage: (0,_tapete__WEBPACK_IMPORTED_MODULE_1__.random)(5, 12) })
                this.last_attack_at = Date.now();
            }
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

  this.update_fps = () => {
    if (this.stats.current_mana < this.stats.mana) this.stats.current_mana += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    if (near_bonfire()) {
      if (this.stats.current_hp < this.stats.hp) this.stats.current_hp += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(4, 7)
    }
  }

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
    this.left_panel_coords = {
        x: this.go.screen.width - 300,
        y: 0,
        width: 300,
        height: this.go.screen.height
    }

    this.draw = () => {
        this.go.ctx.fillStyle = 'white'
        this.go.ctx.fillRect(this.left_panel_coords.x, this.left_panel_coords.y, this.left_panel_coords.width, this.go.screen.height)
        this.go.character.draw_character({
            x: this.left_panel_coords.x + (this.left_panel_coords.width / 2) - (this.go.character.width / 2),
            y: 50,
            width: 50,
            height: 50
        })
        this.go.ctx.fillStyle = 'black'
        this.go.ctx.font = "21px sans-serif"
        let text = `x: ${this.go.character.x.toFixed(2)}, y: ${this.go.character.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.left_panel_coords.x + (this.left_panel_coords.width / 2) - (text_measurement.width / 2), this.left_panel_coords.y + 50 + 50 + 20)

        if (this.go.selected_clickable) this.draw_selection();
    }

    this.draw_selection = () => {
        this.go.selected_clickable.draw({
            x: this.left_panel_coords.x + this.left_panel_coords.width / 2 - 35,
            y: this.left_panel_coords.y + 200,
            width: 70,
            height: 70
        })
        let text = `x: ${this.go.selected_clickable.x.toFixed(2)}, y: ${this.go.selected_clickable.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.left_panel_coords.x + (this.left_panel_coords.width / 2) - (text_measurement.width / 2), this.left_panel_coords.y + 200 + 100)
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
        this.go.ctx.drawImage(item.image, this.initial_x + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
      } else {
        this.go.ctx.fillStyle = "rgb(0, 0, 0)"
        this.go.ctx.fillRect(this.initial_x + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
      }
      this.go.ctx.strokeStyle = "rgb(60, 40, 0)"
      this.go.ctx.strokeRect(this.initial_x + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
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
    this.go = go
    this.icon = new Image()
    this.icon.src = "https://cdna.artstation.com/p/assets/images/images/009/031/190/large/richard-thomas-paints-11-v2.jpg"
    this.projectile = new _projectile__WEBPACK_IMPORTED_MODULE_0__["default"]({ go, subject: this })
    this.active = false
    this.mana_cost = 15
    this.casting_time_in_ms = 1500
    this.last_cast_at = null
    this.cooldown_time_in_ms = 2500
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
// keyboard_input.on_keydown_callbacks.q = [character.skills.break_stone]
// keyboard_input.on_keydown_callbacks.g = [character.skills.cut_tree]
// keyboard_input.on_keydown_callbacks.f = [character.skills.make_fire]

keyboard_input.on_keydown_callbacks[1] = [character.spells.frostbolt]
keyboard_input.on_keydown_callbacks[2] = [character.spells.blink]
keyboard_input.on_keydown_callbacks.i = [character.inventory.toggle_display]
keyboard_input.on_keydown_callbacks.b = [character.board.toggle_grid]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXNCLHFEQUFRO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FjdGlvbl9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvYWdncm8uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbW92ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3Mvc3RvbmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JvYXJkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FzdGluZ19iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jbGlja2FibGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jb250cm9scy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Rvb2RhZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2VkaXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2V2ZW50c19jYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX2xvb3AuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2l0ZW0uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9rZXlib2FyZF9pbnB1dC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290X2JveC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Byb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9yZXNvdXJjZV9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9za2lsbC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9icmVha19zdG9uZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9jdXRfdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxscy9tYWtlX2ZpcmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvYmxpbmsuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9zcGVsbHMvZnJvc3Rib2x0LmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGFwZXRlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dvcmxkLmpzIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL251YmFyaWEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3dlaXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIEFjdGlvbkJhcihnYW1lX29iamVjdCkge1xuICB0aGlzLmdhbWVfb2JqZWN0ID0gZ2FtZV9vYmplY3RcbiAgdGhpcy5udW1iZXJfb2Zfc2xvdHMgPSAxMFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gdGhpcy5nYW1lX29iamVjdC50aWxlX3NpemUgKiAzO1xuICB0aGlzLnNsb3Rfd2lkdGggPSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDM7XG4gIHRoaXMueV9vZmZzZXQgPSAxMDBcbiAgdGhpcy5hY3Rpb25fYmFyX3dpZHRoID0gdGhpcy5udW1iZXJfb2Zfc2xvdHMgKiB0aGlzLnNsb3Rfd2lkdGhcbiAgdGhpcy5hY3Rpb25fYmFyX2hlaWdodCA9IHRoaXMubnVtYmVyX29mX3Nsb3RzICogdGhpcy5zbG90X2hlaWdodFxuICB0aGlzLmFjdGlvbl9iYXJfeCA9ICh0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LndpZHRoIC8gMikgLSAodGhpcy5hY3Rpb25fYmFyX3dpZHRoIC8gMilcbiAgdGhpcy5hY3Rpb25fYmFyX3kgPSB0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LmhlaWdodCAtIHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogNCAtIHRoaXMueV9vZmZzZXRcblxuICAvLyBjaGFyYWN0ZXItc3BlY2lmaWNcbiAgdGhpcy5zbG90cyA9IFtdXG4gIHRoaXMuc2xvdF9zaXplID0gMTBcbiAgdGhpcy5zbG90c1swXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5mcm9zdGJvbHRcbiAgdGhpcy5zbG90c1sxXSA9IHRoaXMuZ2FtZV9vYmplY3QuY2hhcmFjdGVyLnNwZWxsYm9vay5ibGlua1xuICAvLyBFTkQgLS0gY2hhcmFjdGVyLXNwZWNpZmljXG5cbiAgZnVuY3Rpb24gU2xvdCh7IHNwZWxsLCB4LCB5IH0pIHtcbiAgICB0aGlzLnNwZWxsID0gc3BlbGxcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgc2xvdF9pbmRleCA9IDA7IHNsb3RfaW5kZXggPD0gdGhpcy5zbG90X3NpemU7IHNsb3RfaW5kZXgrKykge1xuICAgICAgdmFyIHNsb3QgPSB0aGlzLnNsb3RzW3Nsb3RfaW5kZXhdO1xuXG4gICAgICB2YXIgeCA9IHRoaXMuYWN0aW9uX2Jhcl94ICsgKHRoaXMuc2xvdF93aWR0aCAqIHNsb3RfaW5kZXgpXG4gICAgICB2YXIgeSA9IHRoaXMuYWN0aW9uX2Jhcl95XG5cbiAgICAgIGlmIChzbG90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDQ2LCA0NiwgNDYsIDEpXCJcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZmlsbFJlY3QoXG4gICAgICAgICAgeCwgeSxcbiAgICAgICAgICB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlU3R5bGUgPSBcImJsdWV2aW9sZXRcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0XG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZHJhd0ltYWdlKHNsb3QuaWNvbiwgeCwgeSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVN0eWxlID0gXCJibHVldmlvbGV0XCJcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQ29vbGRvd24gaW5kaWNhdG9yXG4gICAgICAgIGlmIChzbG90Lm9uX2Nvb2xkb3duKCkpIHtcbiAgICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IDEgLSAoKG5vdyAtIHNsb3QubGFzdF9jYXN0X2F0KSAvIHNsb3QuY29vbGRvd25fdGltZV9pbl9tcylcbiAgICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjcpJ1xuICAgICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxSZWN0KHgsIHksIHRoaXMuc2xvdF93aWR0aCAqIHBlcmNlbnRhZ2UsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbkJhclxuIiwiaW1wb3J0IEJvYXJkIGZyb20gXCIuLi9ib2FyZFwiXG5pbXBvcnQgeyBWZWN0b3IyLCByYW5kb20gfSBmcm9tIFwiLi4vdGFwZXRlXCJcbmltcG9ydCB7IE1vdmUgfSBmcm9tIFwiLi9tb3ZlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWdncm8oeyBnbywgZW50aXR5LCByYWRpdXMgPSAyMCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1c1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQoeyBnbywgZW50aXR5LCByYWRpdXM6IE1hdGguZmxvb3IodGhpcy5yYWRpdXMgLyB0aGlzLmdvLnRpbGVfc2l6ZSkgfSlcbiAgICB0aGlzLm1vdmUgPSBuZXcgTW92ZSh7IGdvLCBlbnRpdHksIHRhcmdldF9wb3NpdGlvbjogdGhpcy5nby5jaGFyYWN0ZXIgfSlcblxuICAgIC8vIENvbWJhdCBzeXN0ZW1cbiAgICB0aGlzLmxhc3RfYXR0YWNrX2F0ID0gbnVsbDtcbiAgICB0aGlzLmF0dGFja19zcGVlZCA9IDEwMDA7XG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmdvLmNoYXJhY3RlciwgZW50aXR5KVxuICAgICAgICBpZiAoZGlzdGFuY2UgPCB0aGlzLnJhZGl1cykge1xuICAgICAgICAgICAgdGhpcy5tb3ZlLmFjdCgpO1xuICAgICAgICAgICAgLy8gdGhpcy5ib2FyZC5kcmF3KCk7XG4gICAgICAgIGlmIChkaXN0YW5jZSA8IDUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RfYXR0YWNrX2F0ID09PSBudWxsIHx8ICh0aGlzLmxhc3RfYXR0YWNrX2F0ICsgdGhpcy5hdHRhY2tfc3BlZWQpIDwgRGF0ZS5ub3coKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlOiByYW5kb20oNSwgMTIpIH0pXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0X2F0dGFja19hdCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH19XG5cbiAgICB9XG5cbiAgICB0aGlzLmRyYXdfcGF0aCA9ICgpID0+IHtcblxuICAgIH1cblxuICAgIGNvbnN0IG5laWdoYm9yX3Bvc2l0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudF9wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LngsXG4gICAgICAgICAgICB5OiB0aGlzLmVudGl0eS55LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZW50aXR5LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmVudGl0eS5oZWlnaHRcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxlZnQgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHg6IHRoaXMuZW50aXR5LnggLT0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCByaWdodCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeDogdGhpcy5lbnRpdHkueCArPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IHVwID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB5OiB0aGlzLmVudGl0eS55IC09IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgZG93biA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeTogdGhpcy5lbnRpdHkueSArPSB0aGlzLmVudGl0eS5zcGVlZCB9XG5cbiAgICB9XG59ICIsImltcG9ydCB7IFZlY3RvcjIsIGlzX2NvbGxpZGluZyB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gICAgY29uc3RydWN0b3IoeyBnbywgZW50aXR5LCBzcGVlZCA9IDEsIHRhcmdldF9wb3NpdGlvbiB9KSB7XG4gICAgICAgIHRoaXMuZ28gPSBnb1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgdGhpcy50YXJnZXRfcG9zaXRpb24gPSB0YXJnZXRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5icHMgPSAwO1xuICAgICAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMucGF0aCA9IG51bGxcbiAgICAgICAgdGhpcy5uZXh0X3BhdGhfaW5kZXggPSBudWxsXG4gICAgfVxuXG4gICAgYWN0ID0gKCkgPT4ge1xuICAgICAgICAvLyB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgICAgICAvLyBpZiAoKHRoaXMuYnBzKSA+PSA4MDApIHtcbiAgICAgICAgLy8gICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgIC8vICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgLy8gICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZHJhdygpXG4gICAgICAgIC8vaWYgKHRoaXMucGF0aCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGF0aFt0aGlzLm5leHRfcGF0aF9pbmRleF0gPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIC8vY29uc3QgdGFyZ2V0ZWRfcG9zaXRpb24gPSB0aGlzLnBhdGhbdGhpcy5uZXh0X3BhdGhfaW5kZXhdXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3Bvc2l0aW9uID0geyAuLi50aGlzLnRhcmdldF9wb3NpdGlvbiB9XG4gICAgICAgIGNvbnN0IG5leHRfc3RlcCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuZW50aXR5LnggKyB0aGlzLnNwZWVkICogTWF0aC5jb3MoVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnkgKyB0aGlzLnNwZWVkICogTWF0aC5zaW4oVmVjdG9yMi5hbmdsZSh0aGlzLmVudGl0eSwgdGFyZ2V0ZWRfcG9zaXRpb24pKSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVudGl0eS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbnRpdHkuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdvLnRyZWVzLnNvbWUodHJlZSA9PiAoaXNfY29sbGlkaW5nKG5leHRfc3RlcCwgdHJlZSkpKSkge1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkueCA9IG5leHRfc3RlcC54XG4gICAgICAgICAgICB0aGlzLmVudGl0eS55ID0gbmV4dF9zdGVwLnlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaG1tbS4uLiB3aGVyZSB0bz9cIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZWRpY3RfbW92ZW1lbnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgICAgIGlmICgodGhpcy5icHMpID49IDMwMDApIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHRoaXMuZW50aXR5LmFnZ3JvLmJvYXJkLmZpbmRfcGF0aCh0aGlzLmVudGl0eSwgdGhpcy50YXJnZXRfcG9zaXRpb24pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGF0aCBsZW5ndGggJHt0aGlzLnBhdGgubGVuZ3RofWApXG4gICAgICAgICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IDBcbiAgICAgICAgICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2Jhci5qc1wiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eSwgc3BlbGwgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5zcGVsbCA9IHNwZWxsXG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSA+IHRoaXMuc3BlbGwubWFuYV9jb3N0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgLT0gdGhpcy5zcGVsbC5tYW5hX2Nvc3RcbiAgICAgICAgICAgIHRoaXMuc3BlbGwuYWN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2FzdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNwZWxsLmlzX3ZhbGlkKCkpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5zcGVsbC5jYXN0aW5nX3RpbWVfaW5fbXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc3RpbmdfYmFyLmR1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMpXG4gICAgICAgICAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdG9wKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSB0cnVlXG4gICAgICAgICAgICAgICAgdGhpcy5nby5tYW5hZ2VkX29iamVjdHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQodGhpcy5zcGVsbC5jYXN0aW5nX3RpbWVfaW5fbXMsIHRoaXMuZW5kKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmQoKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdGF0cyh7IGdvLCBlbnRpdHksIGhwID0gMTAwLCBjdXJyZW50X2hwLCBtYW5hLCBjdXJyZW50X21hbmEgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5ocCA9IGhwIHx8IDEwMFxuICAgIHRoaXMuY3VycmVudF9ocCA9IGN1cnJlbnRfaHAgfHwgaHBcbiAgICB0aGlzLm1hbmEgPSBtYW5hXG4gICAgdGhpcy5jdXJyZW50X21hbmEgPSBjdXJyZW50X21hbmEgfHwgbWFuYVxuXG4gICAgdGhpcy5oYXNfbWFuYSA9ICgpID0+IHRoaXMubWFuYSA9PT0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNfZGVhZCA9ICgpID0+IHRoaXMuY3VycmVudF9ocCA8PSAwO1xuICAgIHRoaXMuaXNfYWxpdmUgPSAoKSA9PiAhdGhpcy5pc19kZWFkKCk7XG4gICAgdGhpcy50YWtlX2RhbWFnZSA9ICh7IGRhbWFnZSB9KSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudF9ocCAtPSBkYW1hZ2U7XG4gICAgICAgIGlmICh0aGlzLmlzX2RlYWQoKSkgdGhpcy5kaWUoKVxuICAgIH1cbiAgICB0aGlzLmRpZSA9ICgpID0+IHtcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMuZW50aXR5LCB0aGlzLmdvLmNyZWVwcykgfHwgY29uc29sZS5sb2coXCJOb3Qgb24gbGlzdCBvZiBjcmVlcHNcIilcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMuZW50aXR5LCB0aGlzLmdvLmNsaWNrYWJsZXMpIHx8IGNvbnNvbGUubG9nKFwiTm90IG9uIGxpc3Qgb2YgY2xpY2thYmxlc1wiKVxuICAgICAgICBpZiAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IHRoaXMuZW50aXR5KSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGw7XG4gICAgfVxufSIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuaW1wb3J0IFJlc291cmNlQmFyIGZyb20gXCIuLi9yZXNvdXJjZV9iYXIuanNcIlxuaW1wb3J0IEFnZ3JvIGZyb20gXCIuLi9iZWhhdmlvcnMvYWdncm8uanNcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuXG5mdW5jdGlvbiBDcmVlcCh7IGdvIH0pIHtcbiAgaWYgKGdvLmNyZWVwcyA9PT0gdW5kZWZpbmVkKSBnby5jcmVlcHMgPSBbXVxuICB0aGlzLmlkID0gZ28uY3JlZXBzLmxlbmd0aFxuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jcmVlcHMucHVzaCh0aGlzKVxuXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IFwiemVyZ2xpbmcucG5nXCIgLy8gcGxhY2Vob2xkZXIgaW1hZ2VcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDE1MFxuICB0aGlzLmltYWdlX2hlaWdodCA9IDE1MFxuICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aClcbiAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KVxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiA0XG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBudWxsXG4gIHRoaXMuc3BlZWQgPSAyXG4gIC8vdGhpcy5tb3ZlbWVudF9ib2FyZCA9IHRoaXMuZ28uYm9hcmQuZ3JpZFxuICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbnVsbFxuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwLCBjb2xvdXI6IFwicmVkXCIgfSlcbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIGhwOiAyMCB9KTtcbiAgLy8gQmVoYXZpb3Vyc1xuICB0aGlzLmFnZ3JvID0gbmV3IEFnZ3JvKHsgZ28sIGVudGl0eTogdGhpcywgcmFkaXVzOiA1MDAgfSk7XG4gIC8vIEVORCAtIEJlaGF2aW91cnNcblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uKGNvb3Jkcykge1xuICAgIHRoaXMueCA9IGNvb3Jkcy54XG4gICAgdGhpcy55ID0gY29vcmRzLnlcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKHRhcmdldF9wb3NpdGlvbikge1xuICAgIGxldCB4ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi54ID8gdGFyZ2V0X3Bvc2l0aW9uLnggOiB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgbGV0IHkgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnkgPyB0YXJnZXRfcG9zaXRpb24ueSA6IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICBsZXQgd2lkdGggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLndpZHRoID8gdGFyZ2V0X3Bvc2l0aW9uLndpZHRoIDogdGhpcy53aWR0aFxuICAgIGxldCBoZWlnaHQgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA/IHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgOiB0aGlzLmhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLmltYWdlX3hfb2Zmc2V0LCB0aGlzLmltYWdlX3lfb2Zmc2V0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICBpZiAodGFyZ2V0X3Bvc2l0aW9uKSByZXR1cm5cblxuICAgIHRoaXMuYWdncm8uYWN0KCk7XG4gICAgdGhpcy5oZWFsdGhfYmFyLmRyYXcodGhpcy5zdGF0cy5ocCwgdGhpcy5zdGF0cy5jdXJyZW50X2hwKVxuICB9XG5cbiAgdGhpcy5zZXRfbW92ZW1lbnRfdGFyZ2V0ID0gKHdwX25hbWUpID0+IHtcbiAgICBsZXQgd3AgPSB0aGlzLmdvLmVkaXRvci53YXlwb2ludHMuZmluZCgod3ApID0+IHdwLm5hbWUgPT09IHdwX25hbWUpXG4gICAgbGV0IG5vZGUgPSB0aGlzLmdvLmJvYXJkLmdyaWRbd3AuaWRdXG4gICAgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCA9IG5vZGVcbiAgfVxuXG4gIHRoaXMubW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldCkge1xuICAgICAgdGhpcy5nby5ib2FyZC5tb3ZlKHRoaXMsIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENyZWVwXG4iLCJpbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RvbmUoeyBnbyB9KSB7XG4gICAgdGhpcy5fX3Byb3RvX18gPSBuZXcgRG9vZGFkKHsgZ28gfSlcblxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gXCJmbGludHN0b25lLnBuZ1wiXG4gICAgdGhpcy54ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQud2lkdGgpO1xuICAgIHRoaXMueSA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLmhlaWdodCk7XG4gICAgdGhpcy5pbWFnZV93aWR0aCA9IDg0MFxuICAgIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gODU5XG4gICAgdGhpcy5pbWFnZV94X29mZnNldCA9IDBcbiAgICB0aGlzLmltYWdlX3lfb2Zmc2V0ID0gMFxuICAgIHRoaXMud2lkdGggPSAzMlxuICAgIHRoaXMuaGVpZ2h0ID0gMzJcbiAgICB0aGlzLmFjdGVkX2J5X3NraWxsID0gJ2JyZWFrX3N0b25lJ1xufSIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUcmVlKHsgZ28gfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gICAgdGhpcy54ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQud2lkdGgpO1xuICAgIHRoaXMueSA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLmhlaWdodCk7XG4gICAgdGhpcy5pbWFnZV93aWR0aCA9IDk4XG4gICAgdGhpcy5pbWFnZV94X29mZnNldCA9IDEyN1xuICAgIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTI2XG4gICAgdGhpcy5pbWFnZV95X29mZnNldCA9IDI5MFxuICAgIHRoaXMud2lkdGggPSA5OFxuICAgIHRoaXMuaGVpZ2h0ID0gMTI2XG4gICAgdGhpcy5hY3RlZF9ieV9za2lsbCA9IFwiY3V0X3RyZWVcIlxufSIsImltcG9ydCBOb2RlIGZyb20gXCIuL25vZGUuanNcIlxuaW1wb3J0IHsgaXNfY29sbGlkaW5nLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbi8vIEEgZ3JpZCBvZiB0aWxlcyBmb3IgdGhlIG1hbmlwdWxhdGlvblxuZnVuY3Rpb24gQm9hcmQoeyBnbywgZW50aXR5LCByYWRpdXMgfSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5ib2FyZCA9IHRoaXNcbiAgdGhpcy50aWxlX3NpemUgPSB0aGlzLmdvLnRpbGVfc2l6ZVxuICB0aGlzLmdyaWQgPSBbW11dXG4gIHRoaXMucmFkaXVzID0gcmFkaXVzXG4gIHRoaXMud2lkdGggPSB0aGlzLnJhZGl1cyAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDJcbiAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgdGhpcy5zaG91bGRfZHJhdyA9IGZhbHNlXG5cbiAgdGhpcy50b2dnbGVfZ3JpZCA9ICgpID0+IHtcbiAgICB0aGlzLnNob3VsZF9kcmF3ID0gIXRoaXMuc2hvdWxkX2RyYXdcbiAgICBpZiAodGhpcy5zaG91bGRfZHJhdykgdGhpcy5idWlsZF9ncmlkKClcbiAgfVxuXG4gIHRoaXMuYnBzID0gMDtcbiAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpO1xuXG4gIHRoaXMuYnVpbGRfZ3JpZCA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImJ1aWxkaW5nIGdyaWRcIilcbiAgICB0aGlzLmJwcyA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGlja1xuICAgIGlmICgodGhpcy5icHMpIDwgMTAwMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KClcbiAgICB0aGlzLmdyaWQgPSBuZXcgQXJyYXkodGhpcy53aWR0aClcblxuICAgIGNvbnN0IHhfcG9zaXRpb24gPSBNYXRoLmZsb29yKHRoaXMuZW50aXR5LnggKyB0aGlzLmVudGl0eS53aWR0aCAvIDIpXG4gICAgY29uc3QgeV9wb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCAvIDIpXG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgdGhpcy5ncmlkW3hdID0gbmV3IEFycmF5KHRoaXMuaGVpZ2h0KVxuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgTm9kZSh7XG4gICAgICAgICAgeDogKHhfcG9zaXRpb24gLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkgKyB4ICogdGhpcy50aWxlX3NpemUpLFxuICAgICAgICAgIHk6ICh5X3Bvc2l0aW9uIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpICsgeSAqIHRoaXMudGlsZV9zaXplKSxcbiAgICAgICAgICB3aWR0aDogdGhpcy50aWxlX3NpemUsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnRpbGVfc2l6ZSxcbiAgICAgICAgICBnOiBJbmZpbml0eSwgLy8gQ29zdCBzbyBmYXJcbiAgICAgICAgICBmOiBJbmZpbml0eSwgLy8gQ29zdCBmcm9tIGhlcmUgdG8gdGFyZ2V0XG4gICAgICAgICAgaDogbnVsbCwgLy9cbiAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgdmlzaXRlZDogZmFsc2UsXG4gICAgICAgICAgYm9yZGVyX2NvbG91cjogXCJibGFja1wiXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZ28udHJlZXMuZm9yRWFjaCh0cmVlID0+IHtcbiAgICAgICAgICBpZiAoaXNfY29sbGlkaW5nKG5vZGUsIHRyZWUpKSB7XG4gICAgICAgICAgICBub2RlLmNvbG91ciA9ICdyZWQnO1xuICAgICAgICAgICAgbm9kZS5ibG9ja2VkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5ncmlkW3hdW3ldID0gbm9kZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMud2F5X3RvX3BsYXllciA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUpIHtcbiAgICAgIHRoaXMuZmluZF9wYXRoKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLCB0aGlzLmdvLmNoYXJhY3RlcilcbiAgICB9XG4gIH1cblxuICAvLyBBKiBJbXBsZW1lbnRhdGlvblxuICAvLyBmOiBDb3N0IG9mIHRoZSBlbnRpcmUgdHJhdmVsIChzdW0gb2YgZyArIGgpXG4gIC8vIGc6IENvc3QgZnJvbSBzdGFydF9ub2RlIHRpbGwgbm9kZSAodHJhdmVsIGNvc3QpXG4gIC8vIGg6IENvc3QgZnJvbSBub2RlIHRpbGwgZW5kX25vZGUgKGxlZnRvdmVyIGNvc3QpXG4gIC8vIEFkZCB0aGUgY3VycmVudCBub2RlIGluIGEgbGlzdFxuICAvLyBQb3AgdGhlIG9uZSB3aG9zZSBmIGlzIHRoZSBsb3dlc3RhXG4gIC8vIEFkZCB0byBhIGxpc3Qgb2YgYWxyZWFkeS12aXNpdGVkIChjbG9zZWQpXG4gIC8vIFZpc2l0IGFsbCBpdHMgbmVpZ2hib3Vyc1xuICAvLyBVcGRhdGUgZm9yIGVhY2g6IHRoZSB0cmF2ZWwgY29zdCAoZykgeW91IG1hbmFnZWQgdG8gZG8gYW5kIHlvdXJzZWxmIGFzIHBhcmVudFxuICAvLy8vIFNvIHRoYXQgd2UgY2FuIHJldHJhY2UgaG93IHdlIGdvdCBoZXJlXG4gIHRoaXMuZmluZF9wYXRoID0gKHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24pID0+IHtcbiAgICB0aGlzLmJ1aWxkX2dyaWQoKVxuICAgIGNvbnN0IHN0YXJ0X25vZGUgPSB0aGlzLmdldF9ub2RlX2ZvcihzdGFydF9wb3NpdGlvbik7XG4gICAgY29uc3QgZW5kX25vZGUgPSB0aGlzLmdldF9ub2RlX2ZvcihlbmRfcG9zaXRpb24pO1xuICAgIGlmICghc3RhcnRfbm9kZSB8fCAhZW5kX25vZGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm9kZXMgbm90IG1hdGNoZWRcIilcbiAgICAgIGRlYnVnZ2VyXG4gICAgfVxuXG4gICAgc3RhcnRfbm9kZS5jb2xvdXIgPSAnb3JhbmdlJ1xuICAgIGVuZF9ub2RlLmNvbG91ciA9ICdvcmFuZ2UnXG5cbiAgICBjb25zdCBvcGVuX3NldCA9IFtzdGFydF9ub2RlXTtcbiAgICBjb25zdCBjbG9zZWRfc2V0ID0gW107XG5cbiAgICBjb25zdCBjb3N0ID0gKG5vZGVfYSwgbm9kZV9iKSA9PiB7XG4gICAgICBjb25zdCBkeCA9IG5vZGVfYS54IC0gbm9kZV9iLng7XG4gICAgICBjb25zdCBkeSA9IG5vZGVfYS55IC0gbm9kZV9iLnk7XG4gICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICB9XG5cbiAgICBzdGFydF9ub2RlLmcgPSAwO1xuICAgIHN0YXJ0X25vZGUuZiA9IGNvc3Qoc3RhcnRfbm9kZSwgZW5kX25vZGUpO1xuXG4gICAgd2hpbGUgKG9wZW5fc2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRfbm9kZSA9IG9wZW5fc2V0LnNvcnQoKGEsIGIpID0+IChhLmYgPCBiLmYgPyAtMSA6IDEpKVswXSAvLyBHZXQgdGhlIG5vZGUgd2l0aCBsb3dlc3QgZiB2YWx1ZSBpbiB0aGUgb3BlbiBzZXRcbiAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjdXJyZW50X25vZGUsIG9wZW5fc2V0KVxuICAgICAgY2xvc2VkX3NldC5wdXNoKGN1cnJlbnRfbm9kZSlcbiAgICAgIFxuICAgICAgaWYgKGN1cnJlbnRfbm9kZSA9PT0gZW5kX25vZGUpIHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjdXJyZW50X25vZGU7XG4gICAgICAgIGxldCBwYXRoID0gW107XG4gICAgICAgIHdoaWxlIChjdXJyZW50LnBhcmVudCkge1xuICAgICAgICAgIGN1cnJlbnQuY29sb3VyID0gJ3B1cnBsZSdcbiAgICAgICAgICBwYXRoLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5uZWlnaGJvdXJzKGN1cnJlbnRfbm9kZSkuZm9yRWFjaChuZWlnaGJvdXJfbm9kZSA9PiB7XG4gICAgICAgIGlmICghbmVpZ2hib3VyX25vZGUuYmxvY2tlZCAmJiAhY2xvc2VkX3NldC5pbmNsdWRlcyhuZWlnaGJvdXJfbm9kZSkpIHtcbiAgICAgICAgICBsZXQgZ191c2VkID0gY3VycmVudF9ub2RlLmcgKyBjb3N0KGN1cnJlbnRfbm9kZSwgbmVpZ2hib3VyX25vZGUpXG4gICAgICAgICAgbGV0IGJlc3RfZyA9IGZhbHNlO1xuICAgICAgICAgIGlmICghb3Blbl9zZXQuaW5jbHVkZXMobmVpZ2hib3VyX25vZGUpKSB7XG4gICAgICAgICAgICBuZWlnaGJvdXJfbm9kZS5oID0gY29zdChuZWlnaGJvdXJfbm9kZSwgZW5kX25vZGUpXG4gICAgICAgICAgICBvcGVuX3NldC5wdXNoKG5laWdoYm91cl9ub2RlKVxuICAgICAgICAgICAgYmVzdF9nID0gdHJ1ZVxuICAgICAgICAgIH0gZWxzZSBpZiAoZ191c2VkIDwgbmVpZ2hib3VyX25vZGUuZykge1xuICAgICAgICAgICAgYmVzdF9nID0gdHJ1ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiZXN0X2cpIHtcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLnBhcmVudCA9IGN1cnJlbnRfbm9kZTtcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLmcgPSBnX3VzZWRcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLmYgPSBuZWlnaGJvdXJfbm9kZS5nICsgbmVpZ2hib3VyX25vZGUuaFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB0aGlzLm5laWdoYm91cnMgPSAobm9kZSkgPT4geyAvLyA1LDVcbiAgICBjb25zdCB4X29mZnNldCA9IChNYXRoLmZsb29yKHRoaXMuZW50aXR5LnggKyB0aGlzLmVudGl0eS53aWR0aCAvIDIpIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpKVxuICAgIGNvbnN0IHlfb2Zmc2V0ID0gKE1hdGguZmxvb3IodGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCAvIDIpIC0gKHRoaXMucmFkaXVzICogdGhpcy50aWxlX3NpemUpKVxuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKChub2RlLnggLSB4X29mZnNldCkgLyB0aGlzLnRpbGVfc2l6ZSlcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigobm9kZS55IC0geV9vZmZzZXQpIC8gdGhpcy50aWxlX3NpemUpXG5cbiAgICBmdW5jdGlvbiBmZXRjaF9ncmlkX2NlbGwoZ3JpZCwgbHgsIGx5KSB7XG4gICAgICByZXR1cm4gZ3JpZFtseF0gJiYgZ3JpZFtseF1bbHldXG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHgsIHkgLSAxKSwgLy8gdG9wXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4IC0gMSwgeSAtIDEpLCAvLyB0b3AgbGVmdFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCArIDEsIHkgLSAxKSwgLy8gdG9wIHJpZ2h0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4LCB5ICsgMSksIC8vIGJvdHRvbVxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkgKyAxKSwgLy8gYm90dG9tIGxlZnRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggKyAxLCB5ICsgMSksIC8vIGJvdHRvbSByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCAtIDEsIHkpLCAvLyByaWdodFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCArIDEsIHkpIC8vIGxlZnRcbiAgICBdLmZpbHRlcihub2RlID0+IG5vZGUgIT09IHVuZGVmaW5lZClcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkX2RyYXcpIHJldHVyblxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZ3JpZFt4XVt5XTtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gXCIxXCJcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBub2RlLmJvcmRlcl9jb2xvdXJcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gbm9kZS5jb2xvdXJcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3Qobm9kZS54IC0gdGhpcy5nby5jYW1lcmEueCwgbm9kZS55IC0gdGhpcy5nby5jYW1lcmEueSwgbm9kZS53aWR0aCwgbm9kZS5oZWlnaHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3Qobm9kZS54IC0gdGhpcy5nby5jYW1lcmEueCwgbm9kZS55IC0gdGhpcy5nby5jYW1lcmEueSwgbm9kZS53aWR0aCwgbm9kZS5oZWlnaHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZF9ncmlkKClcbiAgfVxuXG4gIC8vIFJlY2VpdmVzIGEgcmVjdCBhbmQgcmV0dXJucyBpdCdzIGZpcnN0IGNvbGxpZGluZyBOb2RlXG4gIHRoaXMuZ2V0X25vZGVfZm9yID0gKHJlY3QpID0+IHtcbiAgICBpZiAocmVjdC53aWR0aCA9PSB1bmRlZmluZWQpIHJlY3Qud2lkdGggPSAxXG4gICAgaWYgKHJlY3QuaGVpZ2h0ID09IHVuZGVmaW5lZCkgcmVjdC5oZWlnaHQgPSAxXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICBpZiAoKHRoaXMuZ3JpZFt4XSA9PT0gdW5kZWZpbmVkKSB8fCAodGhpcy5ncmlkW3hdW3ldID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7eH0sJHt5fSBjb29yZGluYXRlcyBpcyB1bmRlZmluZWRgKVxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBXaWR0aDogJHt0aGlzLndpZHRofTsgaGVpZ2h0OiAke3RoaXMuaGVpZ2h0fSAocmFkaXVzOiAke3RoaXMucmFkaXVzfSlgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpc19jb2xsaWRpbmcoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC4uLnJlY3QsXG4gICAgICAgICAgICB9LCB0aGlzLmdyaWRbeF1beV0pKSByZXR1cm4gdGhpcy5ncmlkW3hdW3ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvLyBVTlVTRUQgT0xEIEFMR09SSVRITVxuXG4gIC8vIFNldHMgYSBnbG9iYWwgdGFyZ2V0IG5vZGVcbiAgLy8gSXQgd2FzIHVzZWQgYmVmb3JlIHRoZSBtb3ZlbWVudCBnb3QgZGV0YWNoZWQgZnJvbSB0aGUgcGxheWVyIGNoYXJhY3RlclxuICB0aGlzLnRhcmdldF9ub2RlID0gbnVsbFxuICB0aGlzLnNldF90YXJnZXQgPSAobm9kZSkgPT4ge1xuICAgIHRoaXMuZ3JpZC5mb3JFYWNoKChub2RlKSA9PiBub2RlLmRpc3RhbmNlID0gMClcbiAgICB0aGlzLnRhcmdldF9ub2RlID0gbm9kZVxuICB9XG5cbiAgLy8gQ2FsY3VsYXRlcyBwb3NzaWJsZSBwb3NzaXRpb25zIGZvciB0aGUgbmV4dCBtb3ZlbWVudFxuICB0aGlzLmNhbGN1bGF0ZV9uZWlnaGJvdXJzID0gKGNoYXJhY3RlcikgPT4ge1xuICAgIGxldCBjaGFyYWN0ZXJfcmVjdCA9IHtcbiAgICAgIHg6IGNoYXJhY3Rlci54IC0gY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgeTogY2hhcmFjdGVyLnkgLSBjaGFyYWN0ZXIuc3BlZWQsXG4gICAgICB3aWR0aDogY2hhcmFjdGVyLndpZHRoICsgY2hhcmFjdGVyLnNwZWVkLFxuICAgICAgaGVpZ2h0OiBjaGFyYWN0ZXIuaGVpZ2h0ICsgY2hhcmFjdGVyLnNwZWVkXG4gICAgfVxuXG4gICAgbGV0IGZ1dHVyZV9tb3ZlbWVudF9jb2xsaXNpb25zID0gY2hhcmFjdGVyLm1vdmVtZW50X2JvYXJkLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIGlzX2NvbGxpZGluZyhjaGFyYWN0ZXJfcmVjdCwgbm9kZSlcbiAgICB9KVxuXG4gICAgLy8gSSdtIGdvbm5hIGNvcHkgdGhlbSBoZXJlIG90aGVyd2lzZSBkaWZmZXJlbnQgZW50aXRpZXMgY2FsY3VsYXRpbmcgZGlzdGFuY2VcbiAgICAvLyB3aWxsIGFmZmVjdCBlYWNoIG90aGVyJ3MgbnVtYmVycy4gVGhpcyBjYW4gYmUgc29sdmVkIHdpdGggYSBkaWZmZXJlbnRcbiAgICAvLyBjYWxjdWxhdGlvbiBhbGdvcml0aG0gYXMgd2VsbC5cbiAgICByZXR1cm4gZnV0dXJlX21vdmVtZW50X2NvbGxpc2lvbnNcbiAgfVxuXG5cbiAgdGhpcy5uZXh0X3N0ZXAgPSAoY2hhcmFjdGVyLCBjbG9zZXN0X25vZGUsIHRhcmdldF9ub2RlKSA9PiB7XG4gICAgLy8gU3RlcDogU2VsZWN0IGFsbCBuZWlnaGJvdXJzXG4gICAgbGV0IHZpc2l0ZWQgPSBbXVxuICAgIGxldCBub2Rlc19wZXJfcm93ID0gTWF0aC50cnVuYyg0MDk2IC8gZ28udGlsZV9zaXplKVxuICAgIGxldCBvcmlnaW5faW5kZXggPSBjbG9zZXN0X25vZGUuaWRcblxuICAgIGxldCBuZWlnaGJvdXJzID0gdGhpcy5jYWxjdWxhdGVfbmVpZ2hib3VycyhjaGFyYWN0ZXIpXG5cbiAgICAvLyBTdGVwOiBTb3J0IG5laWdoYm91cnMgYnkgZGlzdGFuY2UgKHNtYWxsZXIgZGlzdGFuY2UgZmlyc3QpXG4gICAgLy8gV2UgYWRkIHRoZSB3YWxrIG1vdmVtZW50IHRvIHJlLXZpc2l0ZWQgbm9kZXMgdG8gc2lnbmlmeSB0aGlzIGNvc3RcbiAgICBsZXQgbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjID0gbmVpZ2hib3Vycy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5kaXN0YW5jZSkge1xuICAgICAgICAvL2EuZGlzdGFuY2UgKz0gMiAqIGNoYXJhY3Rlci5zcGVlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYS5kaXN0YW5jZSA9IFZlY3RvcjIuZGlzdGFuY2UoYSwgdGFyZ2V0X25vZGUpXG4gICAgICB9XG5cbiAgICAgIGlmIChiLmRpc3RhbmNlKSB7XG4gICAgICAgIC8vYi5kaXN0YW5jZSArPSBjaGFyYWN0ZXIuc3BlZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGIuZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKGIsIHRhcmdldF9ub2RlKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2VcbiAgICB9KVxuXG4gICAgLy8gU3RlcDogU2VsZWN0IG9ubHkgbmVpZ2hib3VyIG5vZGVzIHRoYXQgYXJlIG5vdCBibG9ja2VkXG4gICAgbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjID0gbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGUuYmxvY2tlZCAhPT0gdHJ1ZVxuICAgIH0pXG5cbiAgICAvLyBTdGVwOiBSZXR1cm4gdGhlIGNsb3Nlc3QgdmFsaWQgbm9kZSB0byB0aGUgdGFyZ2V0XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmIHRoZSBjbG9zZXN0IHBvaW50IGlzIHRoZSB0YXJnZXQgaXRzZWxmXG4gICAgLy8gcmV0dXJucyBmYWxzZSBpZiB0aGVyZSBpcyBub3doZXJlIHRvIGdvXG4gICAgaWYgKG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzYy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmdXR1cmVfbm9kZSA9IG5laWdoYm91cnNfc29ydGVkX2J5X2Rpc3RhbmNlX2FzY1swXVxuICAgICAgcmV0dXJuIChmdXR1cmVfbm9kZS5pZCA9PSB0YXJnZXRfbm9kZS5pZCA/IHRydWUgOiBmdXR1cmVfbm9kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmUgPSBmdW5jdGlvbiAoY2hhcmFjdGVyLCB0YXJnZXRfbm9kZSkge1xuICAgIGxldCBjaGFyX3BvcyA9IHtcbiAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICB9XG5cbiAgICBsZXQgY3VycmVudF9ub2RlID0gdGhpcy5nZXRfbm9kZV9mb3IoY2hhcl9wb3MpXG4gICAgbGV0IGNsb3Nlc3Rfbm9kZSA9IHRoaXMubmV4dF9zdGVwKGNoYXJhY3RlciwgY3VycmVudF9ub2RlLCB0YXJnZXRfbm9kZSlcblxuICAgIC8vIFdlIGhhdmUgYSBuZXh0IHN0ZXBcbiAgICBpZiAodHlwZW9mIChjbG9zZXN0X25vZGUpID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBsZXQgZnV0dXJlX21vdmVtZW50ID0geyAuLi5jaGFyX3BvcyB9XG4gICAgICBsZXQgeF9zcGVlZCA9IDBcbiAgICAgIGxldCB5X3NwZWVkID0gMFxuICAgICAgaWYgKGNsb3Nlc3Rfbm9kZS54ICE9IGNoYXJhY3Rlci54KSB7XG4gICAgICAgIGxldCBkaXN0YW5jZV94ID0gY2hhcl9wb3MueCAtIGNsb3Nlc3Rfbm9kZS54XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZV94KSA+PSBjaGFyYWN0ZXIuc3BlZWQpIHtcbiAgICAgICAgICB4X3NwZWVkID0gKGRpc3RhbmNlX3ggPiAwID8gLWNoYXJhY3Rlci5zcGVlZCA6IGNoYXJhY3Rlci5zcGVlZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY2hhcl9wb3MueCA8IGNsb3Nlc3Rfbm9kZS54KSB7XG4gICAgICAgICAgICB4X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeCkgKiAtMVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsb3Nlc3Rfbm9kZS55ICE9IGNoYXJhY3Rlci55KSB7XG4gICAgICAgIGxldCBkaXN0YW5jZV95ID0gZnV0dXJlX21vdmVtZW50LnkgLSBjbG9zZXN0X25vZGUueVxuICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VfeSkgPj0gY2hhcmFjdGVyLnNwZWVkKSB7XG4gICAgICAgICAgeV9zcGVlZCA9IChkaXN0YW5jZV95ID4gMCA/IC1jaGFyYWN0ZXIuc3BlZWQgOiBjaGFyYWN0ZXIuc3BlZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55IDwgY2xvc2VzdF9ub2RlLnkpIHtcbiAgICAgICAgICAgIHlfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV95KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB5X3NwZWVkID0gTWF0aC5hYnMoZGlzdGFuY2VfeSkgKiAtMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGZ1dHVyZV9tb3ZlbWVudC54ICsgeF9zcGVlZFxuICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBmdXR1cmVfbW92ZW1lbnQueSArIHlfc3BlZWRcblxuICAgICAgY2hhcmFjdGVyLmNvb3JkcyhmdXR1cmVfbW92ZW1lbnQpXG4gICAgICAvLyBXZSdyZSBhbHJlYWR5IGF0IHRoZSBiZXN0IHNwb3RcbiAgICB9IGVsc2UgaWYgKGNsb3Nlc3Rfbm9kZSA9PT0gdHJ1ZSkge1xuICAgICAgY29uc29sZS5sb2coXCJyZWFjaGVkXCIpXG4gICAgICBjaGFyYWN0ZXIubW92ZW1lbnRfYm9hcmQgPSBbXVxuICAgICAgY2hhcmFjdGVyLm1vdmluZyA9IGZhbHNlXG4gICAgICAvLyBXZSdyZSBzdHVja1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPOiBnb3QgdGhpcyBvbmNlIGFmdGVyIGhhZCBhbHJlYWR5IHJlYWNoZWQuIFxuICAgICAgY29uc29sZS5sb2coXCJubyBwYXRoXCIpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkXG4iLCJmdW5jdGlvbiBDYW1lcmEoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2FtZXJhID0gdGhpc1xuICB0aGlzLnggPSAwXG4gIHRoaXMueSA9IDBcbiAgdGhpcy5jYW1lcmFfc3BlZWQgPSAzXG5cbiAgdGhpcy5tb3ZlX2NhbWVyYV93aXRoX21vdXNlID0gKGV2KSA9PiB7XG4gICAgLy9pZiAodGhpcy5nby5lZGl0b3IucGFpbnRfbW9kZSkgcmV0dXJuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpIDwgMTAwKSB7XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCB5ICsgdGhlIG1vdmVtZW50IHdlJ2xsIG1ha2UgZnVydGhlciB0aGVyZSBpcyBncmVhdGVyIHRoYW5cbiAgICAgIC8vIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIHNjcmVlbiBtaW51cyB0aGUgaGVpZ2h0IHRoYXQgd2lsbCBhbHJlYWR5IGJlIHZpc2libGVcbiAgICAgIC8vICh0aGUgY2FudmFzIGhlaWdodCksIGRvbid0IGdvIGZ1cnRoZXIgb3duXG4gICAgICBpZiAodGhpcy55ICsgdGhpcy5jYW1lcmFfc3BlZWQgPiB0aGlzLmdvLnNjcmVlbi5oZWlnaHQgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgdG9wIG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIGV2LmNsaWVudFkpID4gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQgLSAxMDApIHtcbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueSA9IHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXG4gICAgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPCAxMDApIHtcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS54ID0gdGhpcy5nby5jYW1lcmEueCArIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzXG4gICAgfSBlbHNlIGlmICgodGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIGV2LmNsaWVudFgpID4gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAtIDEwMCkge1xuICAgICAgLy8gRG9uJ3QgZ28gZnVydGhlciBsZWZ0XG4gICAgICBpZiAodGhpcy54ICsgdGhpcy5jYW1lcmFfc3BlZWQgPCAwKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54IC0gdGhpcy5jYW1lcmFfc3BlZWRcbiAgICB9XG4gIH1cblxuICB0aGlzLmZvY3VzID0gKHBvaW50KSA9PiB7XG4gICAgbGV0IHggPSBwb2ludC54IC0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCAvIDJcbiAgICBsZXQgeSA9IHBvaW50LnkgLSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAvIDJcbiAgICAvLyBzcGVjaWZpYyBtYXAgY3V0cyAoaXQgaGFzIGEgbWFwIG9mZnNldCBvZiA2MCwxNjApXG4gICAgaWYgKHkgPCAwKSB7IHkgPSAwIH1cbiAgICBpZiAoeCA8IDApIHsgeCA9IDAgfVxuICAgIGlmICh4ICsgdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aCA+IHRoaXMuZ28ud29ybGQud2lkdGgpIHsgeCA9IHRoaXMueCB9XG4gICAgaWYgKHkgKyB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCA+IHRoaXMuZ28ud29ybGQuaGVpZ2h0KSB7IHkgPSB0aGlzLnkgfVxuICAgIC8vIG9mZnNldCBjaGFuZ2VzIGVuZFxuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gIH1cblxuICB0aGlzLmdsb2JhbF9jb29yZHMgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9iaixcbiAgICAgIHg6IG9iai54IC0gdGhpcy54LFxuICAgICAgeTogb2JqLnkgLSB0aGlzLnlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FtZXJhXG4iLCJmdW5jdGlvbiBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmR1cmF0aW9uID0gbnVsbFxuICAgIHRoaXMud2lkdGggPSBnby5jaGFyYWN0ZXIud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IDVcbiAgICB0aGlzLmNvbG91ciA9IFwicHVycGxlXCJcbiAgICB0aGlzLmZ1bGwgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50ID0gMFxuICAgIHRoaXMuc3RhcnRpbmdfdGltZSA9IG51bGxcbiAgICB0aGlzLmxhc3RfdGltZSA9IG51bGxcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbFxuICAgIC8vIFN0YXlzIHN0YXRpYyBpbiBhIHBvc2l0aW9uIGluIHRoZSBtYXBcbiAgICAvLyBNZWFuaW5nOiBkb2Vzbid0IG1vdmUgd2l0aCB0aGUgY2FtZXJhXG4gICAgdGhpcy5zdGF0aWMgPSBmYWxzZVxuICAgIHRoaXMueF9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS54IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuICAgIHRoaXMueV9vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpYyA/XG4gICAgICAgICAgICB0aGlzLmdvLmNhbWVyYS55IDpcbiAgICAgICAgICAgIDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydCA9IChkdXJhdGlvbiwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgdGhpcy5zdGFydGluZ190aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMFxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb25cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgfVxuXG4gICAgdGhpcy5zdG9wID0gKCkgPT4gdGhpcy5kdXJhdGlvbiA9IG51bGxcblxuICAgIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZHJhd2luZyBjYXN0aW5nIGJhclwiKVxuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuZHVyYXRpb24gPT09IG51bGwpIHJldHVybjtcblxuICAgICAgICBsZXQgZWxhcHNlZF90aW1lID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aW1lO1xuICAgICAgICB0aGlzLmxhc3RfdGltZSA9IERhdGUubm93KClcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGVsYXBzZWRfdGltZTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCA8PSB0aGlzLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLmVudGl0eS54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgICAgICAgICAgdGhpcy55ID0gdGhpcy5lbnRpdHkueSArIHRoaXMuZW50aXR5LmhlaWdodCArIDEwIC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbGV0IGJhcl93aWR0aCA9ICgodGhpcy5jdXJyZW50IC8gdGhpcy5kdXJhdGlvbikgKiB0aGlzLndpZHRoKVxuICAgICAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmxpbmVXaWR0aCA9IDRcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLnggLSB0aGlzLnhfb2Zmc2V0KCksIHRoaXMueSAtIHRoaXMueV9vZmZzZXQoKSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmICgodGhpcy5jYWxsYmFjayAhPT0gbnVsbCkgJiYgKHRoaXMuY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkpIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FzdGluZ0JhclxuIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgcmFuZG9tLCBWZWN0b3IyIH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi9yZXNvdXJjZV9iYXJcIlxuaW1wb3J0IEludmVudG9yeSBmcm9tIFwiLi9pbnZlbnRvcnlcIlxuaW1wb3J0IFN0YXRzIGZyb20gXCIuL2JlaGF2aW9ycy9zdGF0cy5qc1wiXG5pbXBvcnQgU3BlbGxjYXN0aW5nIGZyb20gXCIuL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanNcIlxuaW1wb3J0IEZyb3N0Ym9sdCBmcm9tIFwiLi9zcGVsbHMvZnJvc3Rib2x0LmpzXCJcbmltcG9ydCBCbGluayBmcm9tIFwiLi9zcGVsbHMvYmxpbmsuanNcIlxuaW1wb3J0IEN1dFRyZWUgZnJvbSBcIi4vc2tpbGxzL2N1dF90cmVlLmpzXCJcbmltcG9ydCBTa2lsbCBmcm9tIFwiLi9za2lsbC5qc1wiXG5pbXBvcnQgQnJlYWtTdG9uZSBmcm9tIFwiLi9za2lsbHMvYnJlYWtfc3RvbmUuanNcIlxuaW1wb3J0IE1ha2VGaXJlIGZyb20gXCIuL3NraWxscy9tYWtlX2ZpcmUuanNcIlxuaW1wb3J0IEJvYXJkIGZyb20gXCIuL2JvYXJkLmpzXCJcblxuZnVuY3Rpb24gQ2hhcmFjdGVyKGdvLCBpZCkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jaGFyYWN0ZXIgPSB0aGlzXG4gIHRoaXMubmFtZSA9IGBQbGF5ZXIgJHtTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApKS5zbGljZSgwLCAyKX1gXG4gIHRoaXMuZWRpdG9yID0gZ28uZWRpdG9yXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWFnZS5zcmMgPSBcImNyaXNpc2NvcmVwZWVwcy5wbmdcIlxuICB0aGlzLmltYWdlX3dpZHRoID0gMzJcbiAgdGhpcy5pbWFnZV9oZWlnaHQgPSAzMlxuICB0aGlzLmlkID0gaWRcbiAgdGhpcy54ID0gMTAwXG4gIHRoaXMueSA9IDEwMFxuICB0aGlzLndpZHRoID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby50aWxlX3NpemUgKiAyXG4gIHRoaXMubW92aW5nID0gZmFsc2VcbiAgdGhpcy5kaXJlY3Rpb24gPSBcImRvd25cIlxuICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAwXG4gIHRoaXMuc3BlZWQgPSAxLjRcbiAgdGhpcy5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KHsgZ28gfSk7XG4gIHRoaXMuc3BlbGxib29rID0ge1xuICAgIGZyb3N0Ym9sdDogbmV3IEZyb3N0Ym9sdCh7IGdvLCBlbnRpdHk6IHRoaXMgfSksXG4gICAgYmxpbms6IG5ldyBCbGluayh7IGdvLCBlbnRpdHk6IHRoaXMgfSlcbiAgfVxuICB0aGlzLnNwZWxscyA9IHtcbiAgICBmcm9zdGJvbHQ6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogdGhpcy5zcGVsbGJvb2suZnJvc3Rib2x0IH0pLmNhc3QsXG4gICAgYmxpbms6IG5ldyBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5OiB0aGlzLCBzcGVsbDogdGhpcy5zcGVsbGJvb2suYmxpbmsgfSkuY2FzdFxuICB9XG4gIHRoaXMuc2tpbGxzID0ge1xuICAgIGN1dF90cmVlOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IEN1dFRyZWUoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmFjdCxcbiAgICBicmVha19zdG9uZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBCcmVha1N0b25lKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3QsXG4gICAgbWFrZV9maXJlOiBuZXcgU2tpbGwoeyBnbywgZW50aXR5OiB0aGlzLCBza2lsbDogbmV3IE1ha2VGaXJlKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3RcbiAgfVxuICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKHsgZ28sIGVudGl0eTogdGhpcywgbWFuYTogNTAgfSk7XG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHlfb2Zmc2V0OiAyMCwgY29sb3VyOiBcInJlZFwiIH0pXG4gIHRoaXMubWFuYV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMTAsIGNvbG91cjogXCJibHVlXCIgfSlcbiAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7IGdvLCBlbnRpdHk6IHRoaXMsIHJhZGl1czogMjAgfSlcblxuICB0aGlzLnVwZGF0ZV9mcHMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdHMuY3VycmVudF9tYW5hIDwgdGhpcy5zdGF0cy5tYW5hKSB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSArPSByYW5kb20oMSwgMylcbiAgICBpZiAobmVhcl9ib25maXJlKCkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfaHAgPCB0aGlzLnN0YXRzLmhwKSB0aGlzLnN0YXRzLmN1cnJlbnRfaHAgKz0gcmFuZG9tKDQsIDcpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5za2lsbF9hY3Rpb24gPSAoKSA9PiB7XG4gICAgbGV0IGVudGl0eSA9IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlXG4gICAgaWYgKGVudGl0eSAmJiB0aGlzLnNraWxsc1tlbnRpdHkuYWN0ZWRfYnlfc2tpbGxdKSB7XG4gICAgICB0aGlzLnNraWxsc1tlbnRpdHkuYWN0ZWRfYnlfc2tpbGxdKClcbiAgICB9XG4gIH1cblxuICBjb25zdCBuZWFyX2JvbmZpcmUgPSAoKSA9PiB0aGlzLmdvLmZpcmVzLnNvbWUoZmlyZSA9PiBWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIGZpcmUpIDwgMTAwKTtcblxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMudGFyZ2V0X21vdmVtZW50KSB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0KClcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgTWF0aC5mbG9vcih0aGlzLndhbGtfY3ljbGVfaW5kZXgpICogdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5nZXRfZGlyZWN0aW9uX3Nwcml0ZSgpICogdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gICAgdGhpcy5tYW5hX2Jhci5kcmF3KHRoaXMuc3RhdHMubWFuYSwgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEpXG4gIH1cblxuICB0aGlzLmRyYXdfY2hhcmFjdGVyID0gKHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9KSA9PiB7XG4gICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnggOiB4XG4gICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnkgOiB5XG4gICAgd2lkdGggPSB3aWR0aCA9PT0gdW5kZWZpbmVkID8gdGhpcy53aWR0aCA6IHdpZHRoXG4gICAgaGVpZ2h0ID0gaGVpZ2h0ID09PSB1bmRlZmluZWQgPyB0aGlzLmhlaWdodCA6IGhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gIH1cblxuICB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICByZXR1cm4gMlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICByZXR1cm4gM1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIHJldHVybiAxXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gICAgY29uc3QgZnV0dXJlX3Bvc2l0aW9uID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSwgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxuXG4gICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICBpZiAodGhpcy54ICsgdGhpcy5zcGVlZCA8IHRoaXMuZ28ud29ybGQud2lkdGggKyB0aGlzLmdvLndvcmxkLnhfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnggKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIGlmICh0aGlzLnkgLSB0aGlzLnNwZWVkID4gdGhpcy5nby53b3JsZC55X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi55IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgIGlmICh0aGlzLnggLSB0aGlzLnNwZWVkID4gdGhpcy5nby53b3JsZC54X29mZnNldCkge1xuICAgICAgICAgIGZ1dHVyZV9wb3NpdGlvbi54IC09IHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkb3duXCI6XG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC5oZWlnaHQgKyB0aGlzLmdvLndvcmxkLnlfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnkgKz0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5nby50cmVlcy5zb21lKHRyZWUgPT4gKGlzX2NvbGxpZGluZyhmdXR1cmVfcG9zaXRpb24sIHRyZWUpKSkpIHtcbiAgICAgIHRoaXMueCA9IGZ1dHVyZV9wb3NpdGlvbi54XG4gICAgICB0aGlzLnkgPSBmdXR1cmVfcG9zaXRpb24ueVxuICAgICAgdGhpcy53YWxrX2N5Y2xlX2luZGV4ID0gKHRoaXMud2Fsa19jeWNsZV9pbmRleCArICgwLjAzICogdGhpcy5zcGVlZCkpICUgM1xuICAgICAgdGhpcy5nby5jYW1lcmEuZm9jdXModGhpcylcbiAgICB9XG4gIH1cblxuICAvLyBFeHBlcmltZW50c1xuXG4gIEFycmF5LnByb3RvdHlwZS5sYXN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIH1cbiAgQXJyYXkucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1swXSB9XG5cbiAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXRfbW92ZW1lbnQgPSB0aGlzLnRhcmdldF9tb3ZlbWVudCkge1xuICAgIHRoaXMuZ28uY3R4LmJlZ2luUGF0aCgpXG4gICAgdGhpcy5nby5jdHguYXJjKCh0YXJnZXRfbW92ZW1lbnQueCAtIHRoaXMuZ28uY2FtZXJhLngpICsgMTAsICh0YXJnZXRfbW92ZW1lbnQueSAtIHRoaXMuZ28uY2FtZXJhLnkpICsgMTAsIDIwLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcInB1cnBsZVwiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNDtcbiAgICB0aGlzLmdvLmN0eC5zdHJva2UoKVxuICB9XG5cbiAgLy8gQVVUTy1NT1ZFIChwYXRoZmluZGVyKSAtLSByZW5hbWUgaXQgdG8gbW92ZSB3aGVuIHVzaW5nIHBsYXlncm91bmRcbiAgdGhpcy5hdXRvX21vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubW92ZW1lbnRfYm9hcmQubGVuZ3RoID09PSAwKSB7IHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXS5jb25jYXQodGhpcy5nby5ib2FyZC5ncmlkKSB9XG4gICAgdGhpcy5nby5ib2FyZC5tb3ZlKHRoaXMsIHRoaXMuZ28uYm9hcmQudGFyZ2V0X25vZGUpXG4gIH1cblxuICAvLyBTdG9yZXMgdGhlIHRlbXBvcmFyeSB0YXJnZXQgb2YgdGhlIG1vdmVtZW50IGJlaW5nIGV4ZWN1dGVkXG4gIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gbnVsbFxuICAvLyBTdG9yZXMgdGhlIHBhdGggYmVpbmcgY2FsY3VsYXRlZFxuICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG5cbiAgdGhpcy5maW5kX3BhdGggPSAodGFyZ2V0X21vdmVtZW50KSA9PiB7XG4gICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgIHRoaXMubW92aW5nID0gZmFsc2VcblxuICAgIHRoaXMudGFyZ2V0X21vdmVtZW50ID0gdGFyZ2V0X21vdmVtZW50XG5cbiAgICBpZiAodGhpcy5jdXJyZW50X3BhdGgubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyB4OiB0aGlzLnggKyB0aGlzLnNwZWVkLCB5OiB0aGlzLnkgKyB0aGlzLnNwZWVkIH0pXG4gICAgfVxuXG4gICAgdmFyIGxhc3Rfc3RlcCA9IHt9XG4gICAgdmFyIGZ1dHVyZV9tb3ZlbWVudCA9IHt9XG5cbiAgICBkbyB7XG4gICAgICBsYXN0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aFt0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggLSAxXVxuICAgICAgZnV0dXJlX21vdmVtZW50ID0geyB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9XG5cbiAgICAgIC8vIFRoaXMgY29kZSB3aWxsIGtlZXAgdHJ5aW5nIHRvIGdvIGJhY2sgdG8gdGhlIHNhbWUgcHJldmlvdXMgZnJvbSB3aGljaCB3ZSBqdXN0IGJyYW5jaGVkIG91dFxuICAgICAgaWYgKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB7XG4gICAgICAgIGlmIChsYXN0X3N0ZXAueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueCAtIHRoaXMuc3BlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54ICsgdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC54ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgIGlmIChmdXR1cmVfbW92ZW1lbnQueSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG5cbiAgICAgIC8vIFRoaXMgaXMgcHJldHR5IGhlYXZ5Li4uIEl0J3MgY2FsY3VsYXRpbmcgYWdhaW5zdCBhbGwgdGhlIGJpdHMgaW4gdGhlIG1hcCA9W1xuICAgICAgdmFyIGdvaW5nX3RvX2NvbGxpZGUgPSB0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKVxuICAgICAgaWYgKGdvaW5nX3RvX2NvbGxpZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbGxpc2lvbiBhaGVhZCEnKVxuICAgICAgICB2YXIgbmV4dF9tb3ZlbWVudCA9IHsgLi4uZnV0dXJlX21vdmVtZW50IH1cbiAgICAgICAgbmV4dF9tb3ZlbWVudC54ID0gbmV4dF9tb3ZlbWVudC54IC0gdGhpcy5zcGVlZFxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuYml0bWFwLnNvbWUoKGJpdCkgPT4gaXNfY29sbGlkaW5nKG5leHRfbW92ZW1lbnQsIGJpdCkpKSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FudCBtb3ZlIG9uIFlcIilcbiAgICAgICAgfVxuICAgICAgICBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnkgPSBuZXh0X21vdmVtZW50LnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgWFwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRfcGF0aC5wdXNoKHsgLi4uZnV0dXJlX21vdmVtZW50IH0pXG4gICAgfSB3aGlsZSAoKGRpc3RhbmNlKGxhc3Rfc3RlcC54LCB0YXJnZXRfbW92ZW1lbnQueCkgPiAxKSB8fCAoZGlzdGFuY2UobGFzdF9zdGVwLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpKVxuXG4gICAgdGhpcy5tb3ZpbmcgPSB0cnVlXG4gIH1cblxuICB0aGlzLm1vdmVfb25fcGF0aCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZpbmcpIHtcbiAgICAgIHZhciBuZXh0X3N0ZXAgPSB0aGlzLmN1cnJlbnRfcGF0aC5zaGlmdCgpXG4gICAgICBpZiAobmV4dF9zdGVwKSB7XG4gICAgICAgIHRoaXMueCA9IG5leHRfc3RlcC54XG4gICAgICAgIHRoaXMueSA9IG5leHRfc3RlcC55XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuY3VycmVudF9wYXRoID0gW11cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmVtZW50X2JvYXJkID0gW11cblxuICB0aGlzLm1vdmVfdG9fd2F5cG9pbnQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmNvb3Jkcyhub2RlKVxuICB9XG5cbiAgdGhpcy5jb29yZHMgPSBmdW5jdGlvbiAoY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgLy90aGlzLm1vdmUgPSBmdW5jdGlvbih0YXJnZXRfbW92ZW1lbnQpIHtcbiAgLy8gIGlmICh0aGlzLm1vdmluZykge1xuICAvLyAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9XG5cbiAgLy8gICAgaWYgKChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA8PSAxKSAmJiAoZGlzdGFuY2UodGhpcy55LCB0YXJnZXRfbW92ZW1lbnQueSkgPD0gMSkpIHtcbiAgLy8gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAvLyAgICAgIHRhcmdldF9tb3ZlbWVudCA9IHt9XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJTdG9wcGVkXCIpO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQodGFyZ2V0X21vdmVtZW50KVxuXG4gIC8vICAgICAgLy8gUGF0aGluZ1xuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnggPiB0YXJnZXRfbW92ZW1lbnQueCkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IHRoaXMueCArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICAgIGlmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA+IDEpIHtcbiAgLy8gICAgICAgIGlmICh0aGlzLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSAtIDI7XG4gIC8vICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IHRoaXMueSArIDI7XG4gIC8vICAgICAgICB9XG4gIC8vICAgICAgfVxuICAvLyAgICB9XG5cbiAgLy8gICAgZnV0dXJlX21vdmVtZW50LndpZHRoID0gdGhpcy53aWR0aFxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcblxuICAvLyAgICBpZiAoKHRoaXMuZ28uZW50aXRpZXMuZXZlcnkoKGVudGl0eSkgPT4gZW50aXR5LmlkID09PSB0aGlzLmlkIHx8ICFpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBlbnRpdHkpICkpICYmXG4gIC8vICAgICAgKCF0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcoZnV0dXJlX21vdmVtZW50LCBiaXQpKSkpIHtcbiAgLy8gICAgICB0aGlzLnggPSBmdXR1cmVfbW92ZW1lbnQueFxuICAvLyAgICAgIHRoaXMueSA9IGZ1dHVyZV9tb3ZlbWVudC55XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgY29uc29sZS5sb2coXCJCbG9ja2VkXCIpO1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgLy8gICAgfVxuICAvLyAgfVxuICAvLyAgLy8gRU5EIC0gQ2hhcmFjdGVyIE1vdmVtZW50XG4gIC8vfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENsaWNrYWJsZShnbywgeCwgeSwgd2lkdGgsIGhlaWdodCwgaW1hZ2Vfc3JjKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaCh0aGlzKVxuXG4gIHRoaXMubmFtZSA9IGltYWdlX3NyY1xuICB0aGlzLnggPSB4XG4gIHRoaXMueSA9IHlcbiAgdGhpcy53aWR0aCA9IHdpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICB0aGlzLmFjdGl2YXRlZCA9IGZhbHNlXG4gIHRoaXMucGFkZGluZyA9IDVcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIDAsIDAsIHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0LCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgaWYgKHRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwiI2ZmZlwiXG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCAtIHRoaXMucGFkZGluZywgdGhpcy55IC0gdGhpcy5wYWRkaW5nLCB0aGlzLndpZHRoICsgKDIqdGhpcy5wYWRkaW5nKSwgdGhpcy5oZWlnaHQgKyAoMip0aGlzLnBhZGRpbmcpKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDbGlja1wiKVxuICB9XG59XG4iLCJpbXBvcnQgQ2xpY2thYmxlIGZyb20gXCIuL2NsaWNrYWJsZS5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnRyb2xzKGdvKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNvbnRyb2xzID0gdGhpc1xuICB0aGlzLndpZHRoID0gc2NyZWVuLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gc2NyZWVuLmhlaWdodCAqIDAuNFxuICB0aGlzLmFycm93cyA9IHtcbiAgICB1cDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSAtICg4MCAvIDIpLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDEwLCA4MCwgODAsIFwiYXJyb3dfdXAucG5nXCIpLFxuICAgIGxlZnQ6IG5ldyBDbGlja2FibGUoZ28sIDUwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfbGVmdC5wbmdcIiksXG4gICAgcmlnaHQ6IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgKyA3MCwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyA2MCwgODAsIDgwLCBcImFycm93X3JpZ2h0LnBuZ1wiKSxcbiAgICBkb3duOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTIwLCA4MCwgODAsIFwiYXJyb3dfZG93bi5wbmdcIiksXG4gIH1cbiAgdGhpcy5hcnJvd3MudXAuY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXG4gIHRoaXMuYXJyb3dzLmRvd24uY2xpY2sgPSAoKSA9PiBnby5jaGFyYWN0ZXIubW92ZShcImRvd25cIilcbiAgdGhpcy5hcnJvd3MubGVmdC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwibGVmdFwiKVxuICB0aGlzLmFycm93cy5yaWdodC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwicmlnaHRcIilcblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMilcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFycm93cykuZm9yRWFjaChhcnJvdyA9PiBhcnJvdy5kcmF3KCkpXG4gIH1cbn1cbiIsImZ1bmN0aW9uIERvb2RhZCh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgdGhpcy54ID0gMDtcbiAgdGhpcy55ID0gMDtcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMud2lkdGggPSAzMlxuICB0aGlzLmhlaWdodCA9IDMyXG4gIHRoaXMucmVzb3VyY2VfYmFyID0gbnVsbFxuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICh0YXJnZXRfcG9zaXRpb24pIHtcbiAgICBsZXQgeCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueCA/IHRhcmdldF9wb3NpdGlvbi54IDogdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueFxuICAgIGxldCB5ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi55ID8gdGFyZ2V0X3Bvc2l0aW9uLnkgOiB0aGlzLnkgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgbGV0IHdpZHRoID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi53aWR0aCA/IHRhcmdldF9wb3NpdGlvbi53aWR0aCA6IHRoaXMud2lkdGhcbiAgICBsZXQgaGVpZ2h0ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgPyB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy5pbWFnZV94X29mZnNldCwgdGhpcy5pbWFnZV95X29mZnNldCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAgaWYgKHRhcmdldF9wb3NpdGlvbikgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5yZXNvdXJjZV9iYXIpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmRyYXcoKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuY2xpY2sgPSBmdW5jdGlvbiAoKSB7IH1cbiAgdGhpcy51cGRhdGVfZnBzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZ1ZWwgPD0gMCkge1xuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIGdvLmZpcmVzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZ1ZWwgLT0gMTtcbiAgICAgIHRoaXMucmVzb3VyY2VfYmFyLmN1cnJlbnQgLT0gMTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9vZGFkO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRWRpdG9yKHsgZ28gfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMubGVmdF9wYW5lbF9jb29yZHMgPSB7XG4gICAgICAgIHg6IHRoaXMuZ28uc2NyZWVuLndpZHRoIC0gMzAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuZ28uc2NyZWVuLmhlaWdodFxuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCh0aGlzLmxlZnRfcGFuZWxfY29vcmRzLngsIHRoaXMubGVmdF9wYW5lbF9jb29yZHMueSwgdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy53aWR0aCwgdGhpcy5nby5zY3JlZW4uaGVpZ2h0KVxuICAgICAgICB0aGlzLmdvLmNoYXJhY3Rlci5kcmF3X2NoYXJhY3Rlcih7XG4gICAgICAgICAgICB4OiB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMiksXG4gICAgICAgICAgICB5OiA1MCxcbiAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgIGhlaWdodDogNTBcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmdvLmN0eC5mb250ID0gXCIyMXB4IHNhbnMtc2VyaWZcIlxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uY2hhcmFjdGVyLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5jaGFyYWN0ZXIueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy55ICsgNTAgKyA1MCArIDIwKVxuXG4gICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkgdGhpcy5kcmF3X3NlbGVjdGlvbigpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd19zZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmRyYXcoe1xuICAgICAgICAgICAgeDogdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy54ICsgdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIgLSAzNSxcbiAgICAgICAgICAgIHk6IHRoaXMubGVmdF9wYW5lbF9jb29yZHMueSArIDIwMCxcbiAgICAgICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgICAgIGhlaWdodDogNzBcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IHRleHQgPSBgeDogJHt0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54LnRvRml4ZWQoMil9LCB5OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnkudG9GaXhlZCgyKX1gXG4gICAgICAgIHZhciB0ZXh0X21lYXN1cmVtZW50ID0gdGhpcy5nby5jdHgubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQodGV4dCwgdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy54ICsgKHRoaXMubGVmdF9wYW5lbF9jb29yZHMud2lkdGggLyAyKSAtICh0ZXh0X21lYXN1cmVtZW50LndpZHRoIC8gMiksIHRoaXMubGVmdF9wYW5lbF9jb29yZHMueSArIDIwMCArIDEwMClcbiAgICB9XG59IiwiLy8gVGhlIGNhbGxiYWNrcyBzeXN0ZW1cbi8vIFxuLy8gVG8gdXNlIGl0OlxuLy9cbi8vICogaW1wb3J0IHRoZSBjYWxsYmFja3MgeW91IHdhbnRcbi8vXG4vLyAgICBpbXBvcnQgeyBzZXRNb3VzZW1vdmVDYWxsYmFjayB9IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuLy9cbi8vICogY2FsbCB0aGVtIGFuZCBzdG9yZSB0aGUgYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zXG4vL1xuLy8gICAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKTtcbi8vXG4vLyAqIGFkZCBvciByZW1vdmUgY2FsbGJhY2tzIGZyb20gYXJyYXlcbi8vXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2goZ28uY2FtZXJhLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UpXG4vLyAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLnB1c2godHJhY2tfbW91c2VfcG9zaXRpb24pXG5cbmZ1bmN0aW9uIHNldE1vdXNlbW92ZUNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9tb3VzZW1vdmUgPSAoZXYpID0+IHtcbiAgICBtb3VzZW1vdmVfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uX21vdXNlbW92ZSwgZmFsc2UpXG4gIHJldHVybiBtb3VzZW1vdmVfY2FsbGJhY2tzO1xufVxuXG5cbmZ1bmN0aW9uIHNldENsaWNrQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgY2xpY2tfY2FsbGJhY2tzID0gW11cbiAgY29uc3Qgb25fY2xpY2sgID0gKGV2KSA9PiB7XG4gICAgY2xpY2tfY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhldilcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2NsaWNrLCBmYWxzZSlcbiAgcmV0dXJuIGNsaWNrX2NhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0Q2FsbGJhY2soZ28sIGV2ZW50KSB7XG4gIGNvbnN0IGNhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4ge1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZSlcbiAgICB9KVxuICB9XG4gIGdvLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSlcbiAgcmV0dXJuIGNhbGxiYWNrcztcbn1cblxuZnVuY3Rpb24gc2V0TW91c2VNb3ZlQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vtb3ZlJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNlZG93bkNhbGxiYWNrKGdvKSB7XG4gIGNvbnN0IGNhbGxiYWNrX3F1ZXVlID0gc2V0Q2FsbGJhY2soZ28sICdtb3VzZWRvd24nKTtcbiAgZ28ubW91c2Vkb3duX2NhbGxiYWNrcyA9IGNhbGxiYWNrX3F1ZXVlXG4gIHJldHVybiBjYWxsYmFja19xdWV1ZVxufVxuXG5mdW5jdGlvbiBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2V1cCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hzdGFydCcpO1xufVxuXG5mdW5jdGlvbiBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKSB7XG4gIHJldHVybiBzZXRDYWxsYmFjayhnbywgJ3RvdWNoZW5kJyk7XG59XG5cbmV4cG9ydCB7XG4gIHNldE1vdXNlbW92ZUNhbGxiYWNrLFxuICBzZXRDbGlja0NhbGxiYWNrLFxuICBzZXRNb3VzZU1vdmVDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0VG91Y2hzdGFydENhbGxiYWNrLFxuICBzZXRUb3VjaGVuZENhbGxiYWNrLFxufTtcbiIsIi8vIFRoZSBHYW1lIExvb3Bcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBjb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuLy8gZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG4vLyBnYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBwcm9jZXNzX2tleXNfZG93blxuLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xuXG5mdW5jdGlvbiBHYW1lTG9vcCgpIHtcbiAgdGhpcy5kcmF3ID0gbnVsbFxuICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duID0gbnVsbFxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHt9XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnByb2Nlc3Nfa2V5c19kb3duKClcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIHRoaXMuZHJhdygpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVMb29wXG4iLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmZ1bmN0aW9uIEdhbWVPYmplY3QoKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzXG4gIHRoaXMuY2FudmFzX3JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuY2FudmFzX3JlY3Qud2lkdGgpO1xuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMuY2FudmFzX3JlY3QuaGVpZ2h0KTtcbiAgdGhpcy5jdHggPSBjdHhcbiAgdGhpcy50aWxlX3NpemUgPSAyMFxuICB0aGlzLmNsaWNrYWJsZXMgPSBbXVxuICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgdGhpcy5zcGVsbHMgPSBbXSAvLyBTcGVsbCBzeXN0ZW0sIGNvdWxkIGJlIGluamVjdGVkIGJ5IGl0IGFzIHdlbGxcbiAgdGhpcy5za2lsbHMgPSBbXTtcbiAgdGhpcy50cmVlcyA9IFtdO1xuICB0aGlzLmZpcmVzID0gW107XG4gIHRoaXMuc3RvbmVzID0gW107XG4gIHRoaXMubWFuYWdlZF9vYmplY3RzID0gW10gLy8gUmFuZG9tIG9iamVjdHMgdG8gZHJhdy91cGRhdGVcblxuICB0aGlzLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5jdHguc2F2ZSgpXG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSBcInllbGxvd1wiXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwgMjU1LCAwLCAwLjcpYFxuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgIHRoaXMuY3R4LmFyYyhcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueCArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS53aWR0aCAvIDIpIC0gdGhpcy5jYW1lcmEueCxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUueSArICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS5oZWlnaHQgLyAyKSAtIHRoaXMuY2FtZXJhLnksXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoLCAwLCA1MFxuICAgICAgKVxuICAgICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZU9iamVjdCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludmVudG9yeSh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMubWF4X3Nsb3RzID0gMTJcbiAgdGhpcy5zbG90c19wZXJfcm93ID0gNFxuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5zbG90X3BhZGRpbmcgPSAxMFxuICB0aGlzLnNsb3Rfd2lkdGggPSA1MFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gNTBcbiAgdGhpcy5pbml0aWFsX3ggPSB0aGlzLmdvLnNjcmVlbi53aWR0aCAtICh0aGlzLnNsb3RzX3Blcl9yb3cgKiB0aGlzLnNsb3Rfd2lkdGgpIC0gNTA7XG4gIHRoaXMuaW5pdGlhbF95ID0gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF9oZWlnaHQpIC0gNDAwO1xuICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIHRoaXMuYWRkID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZ19idW5kbGUgPSB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lID09IGl0ZW0ubmFtZVxuICAgIH0pXG5cbiAgICBpZiAoKHRoaXMuc2xvdHMubGVuZ3RoID49IHRoaXMubWF4X3Nsb3RzKSAmJiAoIWV4aXN0aW5nX2J1bmRsZSkpIHJldHVyblxuXG4gICAgY29uc29sZS5sb2coYCoqKiBHb3QgJHtpdGVtLnF1YW50aXR5fSAke2l0ZW0ubmFtZX1gKVxuICAgIGlmIChleGlzdGluZ19idW5kbGUpIHtcbiAgICAgIGV4aXN0aW5nX2J1bmRsZS5xdWFudGl0eSArPSBpdGVtLnF1YW50aXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2xvdHMucHVzaChpdGVtKVxuICAgIH1cbiAgfVxuICB0aGlzLmZpbmQgPSAoaXRlbV9uYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBpdGVtX25hbWUudG9Mb3dlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnRvZ2dsZV9kaXNwbGF5ID0gKCkgPT4ge1xuICAgIHRoaXMuYWN0aXZlID0gIXRoaXMuYWN0aXZlO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXhfc2xvdHM7IGkrKykge1xuICAgICAgbGV0IHggPSBNYXRoLmZsb29yKGkgJSA0KVxuICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkgLyA0KTtcblxuICAgICAgaWYgKCh0aGlzLnNsb3RzW2ldICE9PSB1bmRlZmluZWQpICYmICh0aGlzLnNsb3RzW2ldICE9PSBudWxsKSkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zbG90c1tpXTtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGl0ZW0uaW1hZ2UsIHRoaXMuaW5pdGlhbF94ICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMuaW5pdGlhbF94ICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICB9XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDYwLCA0MCwgMClcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLmluaXRpYWxfeCArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXRlbShuYW1lLCBpbWFnZSwgcXVhbnRpdHkgPSAxLCBzcmNfaW1hZ2UpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICBpZiAoaW1hZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gc3JjX2ltYWdlXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlXG4gIH1cbiAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG59XG4iLCJmdW5jdGlvbiBLZXlib2FyZElucHV0KGdvKSB7XG4gIGNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbiAgICAvLyBUaGVzZSBhcmUgY2FsbGJhY2tzIHRoYXQgb25seSBnZXQgY2hlY2tlZCBvbmNlIG9uIHRoZSBldmVudFxuICAgIGlmICh0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID0gW11cbiAgICB9XG4gICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhldikpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uX2tleWRvd24sIGZhbHNlKVxuICBjb25zdCBvbl9rZXl1cCA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2VcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uX2tleXVwLCBmYWxzZSlcblxuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ua2V5Ym9hcmRfaW5wdXQgPSB0aGlzXG4gIHRoaXMua2V5X2NhbGxiYWNrcyA9IHtcbiAgICBkOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXSxcbiAgICB3OiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXSxcbiAgICBhOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIildLFxuICAgIHM6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKV0sXG4gIH1cbiAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrcyA9IHtcbiAgICAxOiBbXVxuICB9XG5cbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgICBjb25zdCBrZXlzX2Rvd24gPSBPYmplY3Qua2V5cyh0aGlzLmtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAgICBrZXlzX2Rvd24uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoIShPYmplY3Qua2V5cyh0aGlzLmtleV9jYWxsYmFja3MpLmluY2x1ZGVzKGtleSkpKSByZXR1cm5cblxuICAgICAgdGhpcy5rZXlfY2FsbGJhY2tzW2tleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMua2V5bWFwID0ge1xuICAgIGQ6IFwicmlnaHRcIixcbiAgICB3OiBcInVwXCIsXG4gICAgYTogXCJsZWZ0XCIsXG4gICAgczogXCJkb3duXCIsXG4gIH1cblxuICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd24gPSB7XG4gICAgZDogZmFsc2UsXG4gICAgdzogZmFsc2UsXG4gICAgYTogZmFsc2UsXG4gICAgczogZmFsc2UsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2V5Ym9hcmRJbnB1dDtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3Qge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW0sIHF1YW50aXR5ID0gMSkge1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyLCByYW5kb20sIGRpY2UgfSBmcm9tIFwiLi90YXBldGVcIlxuaW1wb3J0IEl0ZW0gZnJvbSBcIi4vaXRlbVwiXG5pbXBvcnQgTG9vdCBmcm9tIFwiLi9sb290XCJcblxuY2xhc3MgTG9vdEJveCB7XG4gICAgY29uc3RydWN0b3IoZ28pIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIGdvLmxvb3RfYm94ID0gdGhpc1xuICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgdGhpcy54ID0gMFxuICAgICAgICB0aGlzLnkgPSAwXG4gICAgICAgIHRoaXMud2lkdGggPSAzNTBcbiAgICB9XG5cbiAgICBkcmF3KCkge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgbW92ZXMgYXdheSwgZGVsZXRlIGl0ZW1zIGFuZCBoaWRlIGxvb3QgYm94IHNjcmVlblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCB0aGlzLmdvLmNoYXJhY3RlcikgPiA1MDApIHx8XG4gICAgICAgICAgICAodGhpcy5pdGVtcy5sZW5ndGggPD0gMClcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZUpvaW4gPSAnYmV2ZWwnO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDIwMCwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXNbaW5kZXhdXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgICAgICBsb290LnggPSB0aGlzLnggKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgICAgIGxvb3QueSA9IHRoaXMueSArIChpbmRleCAqIDYwKSArIDI1IC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbG9vdC53aWR0aCA9IDM0MFxuICAgICAgICAgICAgbG9vdC5oZWlnaHQgPSA1NVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QobG9vdC54LCBsb290LnksIGxvb3Qud2lkdGgsIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGxvb3QuaXRlbS5pbWFnZSwgbG9vdC54ICsgNSwgbG9vdC55ICsgNSwgNDUsIDQ1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9ICcyMnB4IHNlcmlmJ1xuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5xdWFudGl0eSwgbG9vdC54ICsgNjUsIGxvb3QueSArIDM1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5pdGVtLm5hbWUsIGxvb3QueCArIDEwMCwgbG9vdC55ICsgMzUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlXG4gICAgICAgIHRoaXMueCA9IHRoaXMuZ28uY2hhcmFjdGVyLnhcbiAgICAgICAgdGhpcy55ID0gdGhpcy5nby5jaGFyYWN0ZXIueVxuICAgIH1cblxuICAgIHRha2VfbG9vdChsb290X2luZGV4KSB7XG4gICAgICAgIGxldCBsb290ID0gdGhpcy5pdGVtcy5zcGxpY2UobG9vdF9pbmRleCwgMSlbMF1cbiAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIuaW52ZW50b3J5LmFkZChsb290Lml0ZW0pXG4gICAgfVxuXG4gICAgY2hlY2tfaXRlbV9jbGlja2VkKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm5cblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgobG9vdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA+PSBsb290LngpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPD0gbG9vdC54ICsgbG9vdC53aWR0aCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA+PSBsb290LnkpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPD0gbG9vdC55ICsgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICApXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudGFrZV9sb290KGluZGV4KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcm9sbF9sb290KGxvb3RfdGFibGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGxvb3RfdGFibGUubWFwKChsb290X2VudHJ5KSA9PiB7XG4gICAgICAgICAgICBsZXQgcm9sbCA9IGRpY2UoMTAwKVxuICAgICAgICAgICAgaWYgKHJvbGwgPD0gbG9vdF9lbnRyeS5jaGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtX2J1bmRsZSA9IG5ldyBJdGVtKGxvb3RfZW50cnkuaXRlbS5uYW1lKVxuICAgICAgICAgICAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IGxvb3RfZW50cnkuaXRlbS5pbWFnZV9zcmNcbiAgICAgICAgICAgICAgICBpdGVtX2J1bmRsZS5xdWFudGl0eSA9IHJhbmRvbShsb290X2VudHJ5Lm1pbiwgbG9vdF9lbnRyeS5tYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMb290KGl0ZW1fYnVuZGxlLCBpdGVtX2J1bmRsZS5xdWFudGl0eSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMb290Qm94IiwiZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gIHRoaXMuaWQgPSBkYXRhLmlkXG4gIHRoaXMueCA9IGRhdGEueFxuICB0aGlzLnkgPSBkYXRhLnlcbiAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodFxuICB0aGlzLmNvbG91ciA9IFwidHJhbnNwYXJlbnRcIlxuICB0aGlzLmJvcmRlcl9jb2xvdXIgPSBcImJsYWNrXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFydGljbGUoZ28pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKHsgeCwgeSB9KSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKHggLSB0aGlzLmdvLmNhbWVyYS54LCB5IC0gdGhpcy5nby5jYW1lcmEueSwgMTUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICdibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdsaWdodGJsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKTtcbiAgICB9XG59IiwiaW1wb3J0IFBhcnRpY2xlIGZyb20gXCIuL3BhcnRpY2xlLmpzXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3QgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLnBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKGdvKTtcbiAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0XG4gICAgdGhpcy50cmFjZV9jb3VudCA9IDdcbiAgICB0aGlzLmJvdW5kcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jdXJyZW50X3Bvc2l0aW9uLCB3aWR0aDogNSwgaGVpZ2h0OiA1IH1cbiAgICB9XG4gICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLmFjdCA9ICh7IHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24gfSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gc3RhcnRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN0YXJ0X3Bvc2l0aW9uKVxuICAgICAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IGVuZF9wb3NpdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLmVuZF9wb3NpdGlvbiwgdGhpcy5jdXJyZW50X3Bvc2l0aW9uKSA8IDUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdC5lbmQoKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZV9wb3NpdGlvbigpO1xuICAgICAgICB0aGlzLnRyYWNlLnB1c2goT2JqZWN0LmNyZWF0ZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24pKVxuICAgICAgICB0aGlzLnRyYWNlID0gdGhpcy50cmFjZS5zbGljZSgtMSAqIHRoaXMudHJhY2VfY291bnQpXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5kcmF3KHRoaXMuY3VycmVudF9wb3NpdGlvbik7XG4gICAgICAgIHRoaXMudHJhY2UuZm9yRWFjaCh0cmFjZWRfcG9zaXRpb24gPT4gdGhpcy5wYXJ0aWNsZS5kcmF3KHRyYWNlZF9wb3NpdGlvbikpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMi5hbmdsZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24sIHRoaXMuZW5kX3Bvc2l0aW9uKTtcbiAgICAgICAgY29uc3Qgc3BlZWQgPSByYW5kb20oMywgMTIpO1xuICAgICAgICB0aGlzLmN1cnJlbnRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmN1cnJlbnRfcG9zaXRpb24ueCArIHNwZWVkICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICAgICAgeTogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnkgKyBzcGVlZCAqIE1hdGguc2luKGFuZ2xlKVxuICAgICAgICB9XG4gICAgfVxufSIsImZ1bmN0aW9uIFJlc291cmNlQmFyKHsgZ28sIHRhcmdldCwgeV9vZmZzZXQgPSAxMCwgY29sb3VyID0gXCJyZWRcIiB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLnRhcmdldCA9IHRhcmdldFxuICB0aGlzLmhlaWdodCA9IHRoaXMudGFyZ2V0LndpZHRoIC8gMTA7XG4gIHRoaXMuY29sb3VyID0gY29sb3VyXG4gIHRoaXMuZnVsbCA9IDEwMFxuICB0aGlzLmN1cnJlbnQgPSAxMDBcbiAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gIHRoaXMueCA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQueDtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9IChmdWxsID0gdGhpcy5mdWxsLCBjdXJyZW50ID0gdGhpcy5jdXJyZW50KSA9PiB7XG4gICAgbGV0IGJhcl93aWR0aCA9ICgoKE1hdGgubWluKGN1cnJlbnQsIGZ1bGwpKSAvIGZ1bGwpICogdGhpcy50YXJnZXQud2lkdGgpXG4gICAgdGhpcy5nby5jdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLngoKSAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMudGFyZ2V0LnktIHRoaXMuZ28uY2FtZXJhLnkgLSB0aGlzLnlfb2Zmc2V0LCB0aGlzLnRhcmdldC53aWR0aCwgdGhpcy5oZWlnaHQpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCkgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnRhcmdldC55LSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54KCkgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnRhcmdldC55LSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy55X29mZnNldCwgYmFyX3dpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUJhclxuIiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5cbmZ1bmN0aW9uIFNjcmVlbihnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5zY3JlZW4gPSB0aGlzXG4gIHRoaXMud2lkdGggID0gdGhpcy5nby5jYW52YXNfcmVjdC53aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodDtcbiAgdGhpcy5yYWRpdXMgPSA3MDBcblxuICB0aGlzLmNsZWFyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmNhbnZhcy53aWR0aCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudFdpZHRoXG4gICAgdGhpcy5nby5jYW52YXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgdGhpcy5nby5jYW52YXNfcmVjdCA9IHRoaXMuZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5jbGVhcigpXG4gICAgdGhpcy5nby53b3JsZC5kcmF3KClcbiAgfVxuXG4gIHRoaXMuZHJhd19nYW1lX292ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuNylcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ28uY2FudmFzLndpZHRoLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxuICAgIHRoaXMuZ28uY3R4LmZvbnQgPSAnNzJweCBzZXJpZidcbiAgICB0aGlzLmdvLmN0eC5maWxsVGV4dChcIkdhbWUgT3ZlclwiLCAodGhpcy5nby5jYW52YXMud2lkdGggLyAyKSAtICh0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dChcIkdhbWUgT3ZlclwiKS53aWR0aCAvIDIpLCB0aGlzLmdvLmNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgfVxuXG4gIHRoaXMuZHJhd19mb2cgPSAoKSA9PiB7XG4gICAgdmFyIHggPSB0aGlzLmdvLmNoYXJhY3Rlci54ICsgdGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyIC0gdGhpcy5nby5jYW1lcmEueFxuICAgIHZhciB5ID0gdGhpcy5nby5jaGFyYWN0ZXIueSArIHRoaXMuZ28uY2hhcmFjdGVyLmhlaWdodCAvIDIgLSB0aGlzLmdvLmNhbWVyYS55XG4gICAgdmFyIGdyYWRpZW50ID0gdGhpcy5nby5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgdGhpcy5yYWRpdXMpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLCAwLCAwLCAwKScpXG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsIDAsIDAsIDEpJylcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBncmFkaWVudFxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KDAsIDAsIHNjcmVlbi53aWR0aCwgc2NyZWVuLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JlZW5cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlcnZlcihnbykge1xuICB0aGlzLmdvID0gZ29cblxuICAvL3RoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4OTk5XCIpXG4gIHRoaXMuY29ubiA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL251YmFyaWEuaGVyb2t1YXBwLmNvbTo1NDA4MlwiKVxuICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5sb2dpbih0aGlzLmdvLmNoYXJhY3RlcilcbiAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGV0IHBheWxvYWQgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpXG4gICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvbikge1xuICAgICAgY2FzZSBcImxvZ2luXCI6XG4gICAgICAgIGxldCBuZXdfY2hhciA9IG5ldyBDaGFyYWN0ZXIoZ28pXG4gICAgICAgIG5ld19jaGFyLm5hbWUgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLm5hbWVcbiAgICAgICAgbmV3X2NoYXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICBuZXdfY2hhci55ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci55XG4gICAgICAgIGNvbnNvbGUubG9nKGBBZGRpbmcgbmV3IGNoYXJgKVxuICAgICAgICBwbGF5ZXJzLnB1c2gobmV3X2NoYXIpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwicGluZ1wiOlxuICAgICAgICAvL2dvLmN0eC5maWxsUmVjdChwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLngsIHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueSwgNTAsIDUwKVxuICAgICAgICAvL2dvLmN0eC5zdHJva2UoKVxuICAgICAgICAvL2xldCBwbGF5ZXIgPSBwbGF5ZXJzWzBdIC8vcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIubmFtZSA9PT0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lKVxuICAgICAgICAvL2lmIChwbGF5ZXIpIHtcbiAgICAgICAgLy8gIHBsYXllci54ID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54XG4gICAgICAgIC8vICBwbGF5ZXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICAvL31cbiAgICAgICAgLy9icmVhaztcbiAgICB9XG4gIH0gLy9cbiAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uOiBcImxvZ2luXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLFxuICAgICAgICAgIHg6IGNoYXJhY3Rlci54LFxuICAgICAgICAgIHk6IGNoYXJhY3Rlci55XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25uLnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gIH1cblxuICB0aGlzLnBpbmcgPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJwaW5nXCIsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYXJhY3Rlcjoge1xuICAgICAgICAgIG5hbWU6IGNoYXJhY3Rlci5uYW1lLCBcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTa2lsbCh7IGdvLCBlbnRpdHksIHNraWxsIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuc2tpbGwgPSBza2lsbFxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2tpbGwuYWN0KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJlbW92ZV9jbGlja2FibGUsIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBicmVha19zdG9uZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5IHx8IGdvLmNoYXJhY3RlclxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IHRoaXMuZW50aXR5IH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfc3RvbmUgPSB0aGlzLmdvLnN0b25lcy5maW5kKChzdG9uZSkgPT4gc3RvbmUgPT09IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICAgICAgICBpZiAoKCF0YXJnZXRlZF9zdG9uZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfc3RvbmUsIHRoaXMuZW50aXR5KSA+IDEwMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5zdGFydCgzMDAwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ28uc3RvbmVzLmluZGV4T2YodGFyZ2V0ZWRfc3RvbmUpXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdChsb290X3RhYmxlX3N0b25lKVxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guc2hvdygpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRhcmdldGVkX3N0b25lLCB0aGlzLmdvLnN0b25lcylcbiAgICAgICAgICAgICAgICByZW1vdmVfY2xpY2thYmxlKHRhcmdldGVkX3N0b25lLCB0aGlzLmdvKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgbG9vdF90YWJsZV9zdG9uZSA9IFt7XG4gICAgICAgIGl0ZW06IHsgbmFtZTogXCJGbGludHN0b25lXCIsIGltYWdlX3NyYzogXCJmbGludHN0b25lLnBuZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBjaGFuY2U6IDEwMFxuICAgIH1dXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiXG5pbXBvcnQgeyBWZWN0b3IyLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIHJlbW92ZV9jbGlja2FibGUgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3V0VHJlZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnb1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgdGhpcy5sb290X2JveCA9IGdvLmxvb3RfYm94XG4gICAgdGhpcy5jYXN0aW5nX2JhciA9IG5ldyBDYXN0aW5nQmFyKHsgZ28sIGVudGl0eTogZW50aXR5IH0pXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTsgLy8gTWF5YmUgR2FtZU9iamVjdCBzaG91bGQgY29udHJvbCB0aGlzIHRvZ2dsZVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3RyZWUgPSB0aGlzLmdvLnRyZWVzLmZpbmQoKHRyZWUpID0+IHRyZWUgPT09IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKVxuICAgICAgICBpZiAoKCF0YXJnZXRlZF90cmVlKSB8fCAoVmVjdG9yMi5kaXN0YW5jZSh0YXJnZXRlZF90cmVlLCB0aGlzLmdvLmNoYXJhY3RlcikgPiAyMDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdvLnRyZWVzLmluZGV4T2YodGFyZ2V0ZWRfdHJlZSlcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vdGJveGVzIGhhdmUgdG8gbW92ZSBmcm9tIHdlaXJkXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5pdGVtcyA9IHRoaXMuZ28ubG9vdF9ib3gucm9sbF9sb290KHRoaXMubG9vdF90YWJsZSlcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0YXJnZXRlZF90cmVlLCB0aGlzLmdvLnRyZWVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF90cmVlLCB0aGlzLmdvKVxuICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmxvb3RfdGFibGUgPSBbe1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiV29vZFwiLCBpbWFnZV9zcmM6IFwiYnJhbmNoLnBuZ1wiIH0sXG4gICAgICAgIG1pbjogMSxcbiAgICAgICAgbWF4OiAzLFxuICAgICAgICBjaGFuY2U6IDk1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiRHJ5IExlYXZlc1wiLCBpbWFnZV9zcmM6IFwibGVhdmVzLmpwZWdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMyxcbiAgICAgICAgY2hhbmNlOiAxMDBcbiAgICAgIH1dXG4gICAgICBcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyXCI7XG5pbXBvcnQgRG9vZGFkIGZyb20gXCIuLi9kb29kYWRcIjtcbmltcG9ydCBSZXNvdXJjZUJhciBmcm9tIFwiLi4vcmVzb3VyY2VfYmFyXCI7XG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1ha2VGaXJlKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvO1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5IHx8IGdvLmNoYXJhY3RlclxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IHRoaXMuZW50aXR5IH0pXG5cbiAgICB0aGlzLmFjdCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGRyeV9sZWF2ZXMgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcImRyeSBsZWF2ZXNcIilcbiAgICAgICAgbGV0IHdvb2QgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcIndvb2RcIilcbiAgICAgICAgbGV0IGZsaW50c3RvbmUgPSB0aGlzLmVudGl0eS5pbnZlbnRvcnkuZmluZChcImZsaW50c3RvbmVcIilcbiAgICAgICAgaWYgKGRyeV9sZWF2ZXMgJiYgZHJ5X2xlYXZlcy5xdWFudGl0eSA+IDAgJiZcbiAgICAgICAgICAgIHdvb2QgJiYgd29vZC5xdWFudGl0eSA+IDAgJiZcbiAgICAgICAgICAgIGZsaW50c3RvbmUgJiYgZmxpbnRzdG9uZS5xdWFudGl0eSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZHJ5X2xlYXZlcy5xdWFudGl0eSAtPSAxXG4gICAgICAgICAgICAgICAgd29vZC5xdWFudGl0eSAtPSAxXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnR5cGUgPT09IFwiQk9ORklSRVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJlID0gdGhpcy5nby5maXJlcy5maW5kKChmaXJlKSA9PiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZmlyZSk7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuZnVlbCArPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCArPSAyMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyZSA9IG5ldyBEb29kYWQoeyBnbyB9KVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnR5cGUgPSBcIkJPTkZJUkVcIlxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlLnNyYyA9IFwiYm9uZmlyZS5wbmdcIlxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3hfb2Zmc2V0ID0gMjUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfeV9vZmZzZXQgPSAyNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV9oZWlnaHQgPSAzNTBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV93aWR0aCA9IDMwMFxuICAgICAgICAgICAgICAgICAgICBmaXJlLndpZHRoID0gNjRcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5oZWlnaHQgPSA2NFxuICAgICAgICAgICAgICAgICAgICBmaXJlLnggPSB0aGlzLmVudGl0eS54O1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnkgPSB0aGlzLmVudGl0eS55O1xuICAgICAgICAgICAgICAgICAgICBmaXJlLmZ1ZWwgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbzogdGhpcy5nbywgdGFyZ2V0OiBmaXJlIH0pXG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLnN0YXRpYyA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuZnVsbCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5jdXJyZW50ID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ28uZmlyZXMucHVzaChmaXJlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLmNsaWNrYWJsZXMucHVzaChmaXJlKVxuICAgICAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTUwMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWW91IGRvbnQgaGF2ZSBhbGwgcmVxdWlyZWQgbWF0ZXJpYWxzIHRvIG1ha2UgYSBmaXJlLlwiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsaW5rKHsgZ28sIGVudGl0eSB9KSB7XG4gICAgdGhpcy5pY29uID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5pY29uLnNyYyA9IFwiYmxpbmtfc3BlbGwuanBnXCJcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm1hbmFfY29zdCA9IDdcbiAgICB0aGlzLmNhc3RpbmdfdGltZV9pbl9tcyA9IDBcbiAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IG51bGxcbiAgICB0aGlzLmNvb2xkb3duX3RpbWVfaW5fbXMgPSA3MDAwXG4gICAgdGhpcy5vbl9jb29sZG93biA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdF9jYXN0X2F0ICYmIERhdGUubm93KCkgLSB0aGlzLmxhc3RfY2FzdF9hdCA8IHRoaXMuY29vbGRvd25fdGltZV9pbl9tc1xuICAgIH1cblxuICAgIHRoaXMuaXNfdmFsaWQgPSAoKSA9PiAhdGhpcy5vbl9jb29sZG93bigpXG4gICAgXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm5cblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKVxuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSAzO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdwdXJwbGUnXG4gICAgICAgIHRoaXMuZ28uY3R4LmFyYyh0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnggLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLmdvLm1vdXNlX3Bvc2l0aW9uLnkgLSB0aGlzLmdvLmNhbWVyYS55LCA1MCwgMCwgTWF0aC5QSSAqIDIpXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUgPSAoKSA9PiB7IH1cblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudChjbGlja19jYWxsYmFjaywgdGhpcy5nby5tb3VzZWRvd25fY2FsbGJhY2tzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgICAgICAgICB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MucHVzaChjbGlja19jYWxsYmFjaylcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbnRpdHkuY3VycmVudF9tYW5hIC09IHRoaXMubWFuYV9jb3N0XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscylcbiAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KGNsaWNrX2NhbGxiYWNrLCB0aGlzLmdvLm1vdXNlZG93bl9jYWxsYmFja3MpXG4gICAgICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gRGF0ZS5ub3coKVxuICAgIH1cblxuICAgIGNvbnN0IGNsaWNrX2NhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmVudGl0eS54ID0gdGhpcy5nby5tb3VzZV9wb3NpdGlvbi54O1xuICAgICAgICB0aGlzLmVudGl0eS55ID0gdGhpcy5nby5tb3VzZV9wb3NpdGlvbi55O1xuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH1cbn0iLCJpbXBvcnQgUHJvamVjdGlsZSBmcm9tIFwiLi4vcHJvamVjdGlsZVwiXG5pbXBvcnQgeyByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIGlzX2NvbGxpZGluZywgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZyb3N0Ym9sdCh7IGdvIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmljb24gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaWNvbi5zcmMgPSBcImh0dHBzOi8vY2RuYS5hcnRzdGF0aW9uLmNvbS9wL2Fzc2V0cy9pbWFnZXMvaW1hZ2VzLzAwOS8wMzEvMTkwL2xhcmdlL3JpY2hhcmQtdGhvbWFzLXBhaW50cy0xMS12Mi5qcGdcIlxuICAgIHRoaXMucHJvamVjdGlsZSA9IG5ldyBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3Q6IHRoaXMgfSlcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5tYW5hX2Nvc3QgPSAxNVxuICAgIHRoaXMuY2FzdGluZ190aW1lX2luX21zID0gMTUwMFxuICAgIHRoaXMubGFzdF9jYXN0X2F0ID0gbnVsbFxuICAgIHRoaXMuY29vbGRvd25fdGltZV9pbl9tcyA9IDI1MDBcbiAgICB0aGlzLm9uX2Nvb2xkb3duID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0X2Nhc3RfYXQgJiYgRGF0ZS5ub3coKSAtIHRoaXMubGFzdF9jYXN0X2F0IDwgdGhpcy5jb29sZG93bl90aW1lX2luX21zXG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgIHRoaXMucHJvamVjdGlsZS5kcmF3KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3Nsb3QgPSAoc2xvdCkgPT4ge1xuICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHgsIHksIHRoaXMuZ28uYWN0aW9uX2Jhci5zbG90X3dpZHRoLCB0aGlzLmdvLmFjdGlvbl9iYXIuc2xvdF9oZWlnaHQpXG4gICAgICAgIFxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSByZXR1cm5cblxuICAgICAgICBpZiAoKGlzX2NvbGxpZGluZyh0aGlzLnByb2plY3RpbGUuYm91bmRzKCksIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSkpIHtcbiAgICAgICAgICAgIGlmIChkYW1hZ2VhYmxlKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhbWFnZSA9IHJhbmRvbSg1LCAxMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuc3RhdHMudGFrZV9kYW1hZ2UoeyBkYW1hZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aWxlLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzX3ZhbGlkID0gKCkgPT4gIXRoaXMub25fY29vbGRvd24oKSAmJiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSAmJiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5zdGF0cztcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gbnVsbCkgfHwgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB1bmRlZmluZWQpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc3RhcnRfcG9zaXRpb24gPSB7IHg6IHRoaXMuZ28uY2hhcmFjdGVyLnggKyA1MCwgeTogdGhpcy5nby5jaGFyYWN0ZXIueSArIDUwIH1cbiAgICAgICAgY29uc3QgZW5kX3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueCArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLndpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnkgKyB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS5oZWlnaHQgLyAyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmFjdCh7IHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24gfSlcblxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgdGhpcy5nby5zcGVsbHMucHVzaCh0aGlzKVxuICAgIH1cblxuICAgIHRoaXMuZW5kID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5zcGVsbHMpO1xuICAgICAgICB0aGlzLmxhc3RfY2FzdF9hdCA9IERhdGUubm93KClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYW1hZ2VhYmxlKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0LnN0YXRzICE9PSB1bmRlZmluZWQgJiYgb2JqZWN0LnN0YXRzLnRha2VfZGFtYWdlICE9PSB1bmRlZmluZWRcbiAgICB9XG59IiwiY29uc3QgZGlzdGFuY2UgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoTWF0aC5mbG9vcihhKSAtIE1hdGguZmxvb3IoYikpO1xufVxuXG5jb25zdCBWZWN0b3IyID0ge1xuICBkaXN0YW5jZTogKGEsIGIpID0+IE1hdGgudHJ1bmMoTWF0aC5zcXJ0KE1hdGgucG93KGIueCAtIGEueCwgMikgKyBNYXRoLnBvdyhiLnkgLSBhLnksIDIpKSksXG4gIGFuZ2xlOiAoY3VycmVudF9wb3NpdGlvbiwgZW5kX3Bvc2l0aW9uKSA9PiBNYXRoLmF0YW4yKGVuZF9wb3NpdGlvbi55IC0gY3VycmVudF9wb3NpdGlvbi55LCBlbmRfcG9zaXRpb24ueCAtIGN1cnJlbnRfcG9zaXRpb24ueClcbn1cblxuY29uc3QgaXNfY29sbGlkaW5nID0gZnVuY3Rpb24oc2VsZiwgdGFyZ2V0KSB7XG4gIGlmIChcbiAgICAoc2VsZi54IDwgdGFyZ2V0LnggKyB0YXJnZXQud2lkdGgpICYmXG4gICAgKHNlbGYueCArIHNlbGYud2lkdGggPiB0YXJnZXQueCkgJiZcbiAgICAoc2VsZi55IDwgdGFyZ2V0LnkgKyB0YXJnZXQuaGVpZ2h0KSAmJlxuICAgIChzZWxmLnkgKyBzZWxmLmhlaWdodCA+IHRhcmdldC55KVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuY29uc3QgcmFuZG9tID0gKHN0YXJ0LCBlbmQpID0+IHtcbiAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydFxuICAgIHN0YXJ0ID0gMFxuICB9XG4gIHJldHVybiBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiBlbmQpICsgc3RhcnQgIFxufVxuXG5mdW5jdGlvbiByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQob2JqZWN0LCBsaXN0KSB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKG9iamVjdCk7XG4gIGlmIChpbmRleCA+IC0xKSB7XG4gICAgcmV0dXJuIGxpc3Quc3BsaWNlKGluZGV4LCAxKVswXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZV9jbGlja2FibGUoZG9vZGFkLCBnbykge1xuICBjb25zdCBjbGlja2FibGVfaW5kZXggPSBnby5jbGlja2FibGVzLmluZGV4T2YoZG9vZGFkKVxuICBpZiAoY2xpY2thYmxlX2luZGV4ID4gLTEpIHtcbiAgICBnby5jbGlja2FibGVzLnNwbGljZShjbGlja2FibGVfaW5kZXgsIDEpXG4gIH1cbiAgaWYgKGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gZG9vZGFkKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB9XG59XG5cbmNvbnN0IGRpY2UgPSAoc2lkZXMsIHRpbWVzID0gMSkgPT4ge1xuICByZXR1cm4gQXJyYXkuZnJvbShBcnJheSh0aW1lcykpLm1hcCgoaSkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2lkZXMpICsgMSk7XG59XG5cbmV4cG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIGRyYXdfc3F1YXJlLCBWZWN0b3IyLCByYW5kb20sIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCwgZGljZSwgcmVtb3ZlX2NsaWNrYWJsZSB9XG4iLCJjbGFzcyBUaWxlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZV9zcmMsIHhfb2Zmc2V0ID0gMCwgeV9vZmZzZXQgPSAwLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IGltYWdlX3NyY1xuICAgICAgICB0aGlzLnhfb2Zmc2V0ID0geF9vZmZzZXRcbiAgICAgICAgdGhpcy55X29mZnNldCA9IHlfb2Zmc2V0XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGlsZSIsImltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGVcIlxuXG4vLyBUaGUgV29ybGQgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgaXRzZWxmLlxuZnVuY3Rpb24gV29ybGQoZ28pIHtcbiAgdGhpcy5nbyA9IGdvO1xuICB0aGlzLmdvLndvcmxkID0gdGhpcztcbiAgdGhpcy53aWR0aCA9IDEwMDAwO1xuICB0aGlzLmhlaWdodCA9IDEwMDAwO1xuICB0aGlzLnhfb2Zmc2V0ID0gMDtcbiAgdGhpcy55X29mZnNldCA9IDA7XG4gIHRoaXMudGlsZV9zZXQgPSB7XG4gICAgZ3Jhc3M6IG5ldyBUaWxlKFwiZ3Jhc3MucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgZGlydDogbmV3IFRpbGUoXCJkaXJ0Mi5wbmdcIiwgMCwgMCwgNjQsIDYzKSxcbiAgICBzdG9uZTogbmV3IFRpbGUoXCJmbGludHN0b25lLnBuZ1wiLCAwLCAwLCA4NDAsIDg1OSksXG4gIH1cbiAgdGhpcy5waWNrX3JhbmRvbV90aWxlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnRpbGVfc2V0LmdyYXNzXG4gIH1cbiAgdGhpcy50aWxlX3dpZHRoID0gNjRcbiAgdGhpcy50aWxlX2hlaWdodCA9IDY0XG4gIHRoaXMudGlsZXNfcGVyX3JvdyA9IE1hdGgudHJ1bmModGhpcy53aWR0aCAvIHRoaXMudGlsZV93aWR0aCkgKyAxO1xuICB0aGlzLnRpbGVzX3Blcl9jb2x1bW4gPSBNYXRoLnRydW5jKHRoaXMuaGVpZ2h0IC8gdGhpcy50aWxlX2hlaWdodCkgKyAxO1xuICB0aGlzLnRpbGVzID0gbnVsbDtcbiAgdGhpcy5nZW5lcmF0ZV9tYXAgPSAoKSA9PiB7XG4gICAgdGhpcy50aWxlcyA9IG5ldyBBcnJheSh0aGlzLnRpbGVzX3Blcl9yb3cpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBpZiAodGhpcy50aWxlc1tyb3ddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnRpbGVzW3Jvd10gPSBbdGhpcy5waWNrX3JhbmRvbV90aWxlKCldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddLnB1c2godGhpcy5waWNrX3JhbmRvbV90aWxlKCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8PSB0aGlzLnRpbGVzX3Blcl9yb3c7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPD0gdGhpcy50aWxlc19wZXJfY29sdW1uOyBjb2x1bW4rKykge1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMudGlsZXNbcm93XVtjb2x1bW5dXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGVfc2V0LmdyYXNzKSB7XG4gICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMudGlsZV9zZXQuZ3Jhc3MuaW1hZ2UsXG4gICAgICAgICAgICB0aGlzLnRpbGVfc2V0LmdyYXNzLnhfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLnlfb2Zmc2V0LCB0aGlzLnRpbGVfc2V0LmdyYXNzLndpZHRoLCB0aGlzLnRpbGVfc2V0LmdyYXNzLmhlaWdodCxcbiAgICAgICAgICAgIHRoaXMueF9vZmZzZXQgKyAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsXG4gICAgICAgICAgICB0aGlzLnlfb2Zmc2V0ICsgKGNvbHVtbiAqIHRoaXMudGlsZV9oZWlnaHQpIC0gdGhpcy5nby5jYW1lcmEueSwgNjQsIDYzKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aWxlLmltYWdlLFxuICAgICAgICAgIHRpbGUueF9vZmZzZXQsIHRpbGUueV9vZmZzZXQsIHRpbGUud2lkdGgsIHRpbGUuaGVpZ2h0LFxuICAgICAgICAgIHRoaXMueF9vZmZzZXQgKyAocm93ICogdGhpcy50aWxlX3dpZHRoKSAtIHRoaXMuZ28uY2FtZXJhLngsXG4gICAgICAgICAgdGhpcy55X29mZnNldCArIChjb2x1bW4gKiB0aGlzLnRpbGVfaGVpZ2h0KSAtIHRoaXMuZ28uY2FtZXJhLnksIDY1LCA2NSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV29ybGQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gXCIuL2dhbWVfb2JqZWN0LmpzXCJcbmltcG9ydCBTY3JlZW4gZnJvbSBcIi4vc2NyZWVuLmpzXCJcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vY2FtZXJhLmpzXCJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyLmpzXCJcbmltcG9ydCBLZXlib2FyZElucHV0IGZyb20gXCIuL2tleWJvYXJkX2lucHV0LmpzXCJcbmltcG9ydCB7IGlzX2NvbGxpZGluZywgVmVjdG9yMiwgcmFuZG9tLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuaW1wb3J0IHtcbiAgc2V0Q2xpY2tDYWxsYmFjayxcbiAgc2V0TW91c2VNb3ZlQ2FsbGJhY2ssXG4gIHNldE1vdXNldXBDYWxsYmFjayxcbiAgc2V0TW91c2Vkb3duQ2FsbGJhY2ssXG4gIHNldFRvdWNoc3RhcnRDYWxsYmFjayxcbiAgc2V0VG91Y2hlbmRDYWxsYmFjayxcbn0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG5pbXBvcnQgR2FtZUxvb3AgZnJvbSBcIi4vZ2FtZV9sb29wLmpzXCJcbmltcG9ydCBXb3JsZCBmcm9tIFwiLi93b3JsZC5qc1wiXG5pbXBvcnQgRG9vZGFkIGZyb20gXCIuL2Rvb2RhZC5qc1wiXG5pbXBvcnQgQ29udHJvbHMgZnJvbSBcIi4vY29udHJvbHMuanNcIlxuaW1wb3J0IFNlcnZlciBmcm9tIFwiLi9zZXJ2ZXJcIlxuaW1wb3J0IExvb3RCb3ggZnJvbSBcIi4vbG9vdF9ib3guanNcIlxuaW1wb3J0IENyZWVwIGZyb20gXCIuL2JlaW5ncy9jcmVlcC5qc1wiXG5pbXBvcnQgQWN0aW9uQmFyIGZyb20gXCIuL2FjdGlvbl9iYXIuanNcIlxuaW1wb3J0IFN0b25lIGZyb20gXCIuL2JlaW5ncy9zdG9uZS5qc1wiXG5pbXBvcnQgVHJlZSBmcm9tIFwiLi9iZWluZ3MvdHJlZS5qc1wiXG5pbXBvcnQgRWRpdG9yIGZyb20gXCIuL2VkaXRvci9pbmRleC5qc1wiXG5cbmNvbnN0IGdvID0gbmV3IEdhbWVPYmplY3QoKVxuY29uc3Qgc2NyZWVuID0gbmV3IFNjcmVlbihnbylcbmNvbnN0IGNhbWVyYSA9IG5ldyBDYW1lcmEoZ28pXG5jb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuY29uc3Qga2V5Ym9hcmRfaW5wdXQgPSBuZXcgS2V5Ym9hcmRJbnB1dChnbylcbmNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKGdvKVxuY29uc3QgY29udHJvbHMgPSBuZXcgQ29udHJvbHMoZ28pXG5jb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKGdvKVxuY29uc3QgbG9vdF9ib3ggPSBuZXcgTG9vdEJveChnbylcbmNvbnN0IGFjdGlvbl9iYXIgPSBuZXcgQWN0aW9uQmFyKGdvKVxuY29uc3QgZWRpdG9yID0gbmV3IEVkaXRvcih7IGdvIH0pXG5cbi8vIERpc2FibGUgcmlnaHQgbW91c2UgY2xpY2tcbmdvLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9XG5cbmNvbnN0IGNsaWNrX2NhbGxiYWNrcyA9IHNldENsaWNrQ2FsbGJhY2soZ28pXG5jbGlja19jYWxsYmFja3MucHVzaChjbGlja2FibGVfY2xpY2tlZClcbmZ1bmN0aW9uIGNsaWNrYWJsZV9jbGlja2VkKGV2KSB7XG4gIGxldCBjbGljayA9IHsgeDogZXYuY2xpZW50WCArIGdvLmNhbWVyYS54LCB5OiBldi5jbGllbnRZICsgZ28uY2FtZXJhLnksIHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxuICBjb25zdCBjbGlja2FibGUgPSBnby5jbGlja2FibGVzLmZpbmQoKGNsaWNrYWJsZSkgPT4gaXNfY29sbGlkaW5nKGNsaWNrYWJsZSwgY2xpY2spKVxuICBpZiAoY2xpY2thYmxlKSB7XG4gICAgY2xpY2thYmxlLmFjdGl2YXRlZCA9ICFjbGlja2FibGUuYWN0aXZhdGVkXG4gIH1cbiAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gY2xpY2thYmxlXG59XG5cbmxldCBtb3VzZV9pc19kb3duID0gZmFsc2VcbmdvLm1vdXNlX3Bvc2l0aW9uID0ge31cbmNvbnN0IG1vdXNlbW92ZV9jYWxsYmFja3MgPSBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbylcbm1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcbmZ1bmN0aW9uIHRyYWNrX21vdXNlX3Bvc2l0aW9uKGV2dCkge1xuICB2YXIgcmVjdCA9IGdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBnby5tb3VzZV9wb3NpdGlvbiA9IHtcbiAgICB4OiBldnQuY2xpZW50WCAtIHJlY3QubGVmdCArIGNhbWVyYS54LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3AgKyBjYW1lcmEueVxuICB9XG59XG5jb25zdCBtb3VzZWRvd25fY2FsbGJhY2tzID0gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pXG5tb3VzZWRvd25fY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbmNvbnN0IG1vdXNldXBfY2FsbGJhY2tzID0gc2V0TW91c2V1cENhbGxiYWNrKGdvKVxubW91c2V1cF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSBmYWxzZSlcbm1vdXNldXBfY2FsbGJhY2tzLnB1c2gobG9vdF9ib3guY2hlY2tfaXRlbV9jbGlja2VkLmJpbmQobG9vdF9ib3gpKVxuY29uc3QgdG91Y2hzdGFydF9jYWxsYmFja3MgPSBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2soZ28pXG50b3VjaHN0YXJ0X2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IHRydWUpXG5jb25zdCB0b3VjaGVuZF9jYWxsYmFja3MgPSBzZXRUb3VjaGVuZENhbGxiYWNrKGdvKVxudG91Y2hlbmRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gZmFsc2UpXG5mdW5jdGlvbiBjb250cm9sc19tb3ZlbWVudCgpIHtcbiAgLy8gZ28uY2xpY2thYmxlcy5mb3JFYWNoKChjbGlja2FibGUpID0+IHtcbiAgLy8gICBpZiAoY2xpY2thYmxlLmFjdGl2YXRlZCkge1xuICAvLyAgICAgY2xpY2thYmxlLmNsaWNrKClcbiAgLy8gICB9XG4gIC8vIH0pXG59XG5cblxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuZiA9IFtjaGFyYWN0ZXIuc2tpbGxfYWN0aW9uXVxuLy8ga2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MucSA9IFtjaGFyYWN0ZXIuc2tpbGxzLmJyZWFrX3N0b25lXVxuLy8ga2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuZyA9IFtjaGFyYWN0ZXIuc2tpbGxzLmN1dF90cmVlXVxuLy8ga2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuZiA9IFtjaGFyYWN0ZXIuc2tpbGxzLm1ha2VfZmlyZV1cblxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbMV0gPSBbY2hhcmFjdGVyLnNwZWxscy5mcm9zdGJvbHRdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1syXSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmJsaW5rXVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuaSA9IFtjaGFyYWN0ZXIuaW52ZW50b3J5LnRvZ2dsZV9kaXNwbGF5XVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MuYiA9IFtjaGFyYWN0ZXIuYm9hcmQudG9nZ2xlX2dyaWRdXG4vL2tleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLnAgPSBbYm9hcmQud2F5X3RvX3BsYXllcl1cblxubGV0IEZQUyA9IDBcbmxldCBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIEZQUyA9IERhdGUubm93KCkgLSBsYXN0X3RpY2tcbiAgaWYgKChGUFMpID4gMTAwMCkge1xuICAgIHVwZGF0ZV9mcHMoKVxuICAgIGNvbnNvbGUubG9nKEZQUylcbiAgICBsYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gIH1cbiAgaWYgKCFjaGFyYWN0ZXIuc3RhdHMuaXNfYWxpdmUoKSkge1xuICAgIGNvbnRyb2xzX21vdmVtZW50KClcbiAgfSBlbHNlIHtcbiAgICBnby5zcGVsbHMuZm9yRWFjaChzcGVsbCA9PiBzcGVsbC51cGRhdGUoKSlcbiAgICBnby5tYW5hZ2VkX29iamVjdHMuZm9yRWFjaChtb2IgPT4gbW9iLnVwZGF0ZSgpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZV9mcHMoKSB7XG4gIGlmIChjaGFyYWN0ZXIuc3RhdHMuaXNfYWxpdmUoKSkge1xuICAgIGNoYXJhY3Rlci51cGRhdGVfZnBzKClcbiAgfVxuICBnby5maXJlcy5mb3JFYWNoKGZpcmUgPT4gZmlyZS51cGRhdGVfZnBzKCkpXG59XG4vLyBDb21tZW50XG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICBpZiAoY2hhcmFjdGVyLnN0YXRzLmlzX2RlYWQoKSkge1xuICAgIHNjcmVlbi5kcmF3X2dhbWVfb3ZlcigpXG4gIH0gZWxzZSB7XG4gICAgc2NyZWVuLmRyYXcoKVxuICAgIGdvLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlKClcbiAgICBnby5zdG9uZXMuZm9yRWFjaChzdG9uZSA9PiBzdG9uZS5kcmF3KCkpXG4gICAgZ28udHJlZXMuZm9yRWFjaCh0cmVlID0+IHRyZWUuZHJhdygpKVxuICAgIGdvLmZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLmRyYXcoKSlcbiAgICBnby5zcGVsbHMuZm9yRWFjaChzcGVsbCA9PiBzcGVsbC5kcmF3KCkpXG4gICAgZ28uc2tpbGxzLmZvckVhY2goc2tpbGwgPT4gc2tpbGwuZHJhdygpKVxuICAgIGNoYXJhY3Rlci5kcmF3KClcbiAgICBnby5tYW5hZ2VkX29iamVjdHMuZm9yRWFjaChtb2IgPT4gbW9iLmRyYXcoKSlcbiAgICBnby5jcmVlcHMuZm9yRWFjaChjcmVlcCA9PiBjcmVlcC5kcmF3KCkpXG4gICAgc2NyZWVuLmRyYXdfZm9nKClcbiAgICBsb290X2JveC5kcmF3KClcbiAgICBnby5jaGFyYWN0ZXIuaW52ZW50b3J5LmRyYXcoKVxuICAgIGFjdGlvbl9iYXIuZHJhdygpXG4gICAgY2hhcmFjdGVyLmJvYXJkLmRyYXcoKVxuICAgIGVkaXRvci5kcmF3KClcbiAgICBpZiAoc2hvd19jb250cm9sX3doZWVsKSBkcmF3X2NvbnRyb2xfd2hlZWwoKVxuICB9XG59IFxuXG4vLyBUcmVlc1xuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGxldCB0cmVlID0gbmV3IFRyZWUoeyBnbyB9KVxuICBnby50cmVlcy5wdXNoKHRyZWUpXG4gIGdvLmNsaWNrYWJsZXMucHVzaCh0cmVlKVxufSlcbi8vIFN0b25lc1xuQXJyYXkuZnJvbShBcnJheSgzMDApKS5mb3JFYWNoKChqLCBpKSA9PiB7XG4gIGNvbnN0IHN0b25lID0gbmV3IFN0b25lKHsgZ28gfSk7XG4gIGdvLnN0b25lcy5wdXNoKHN0b25lKVxuICBnby5jbGlja2FibGVzLnB1c2goc3RvbmUpXG59KVxuLy8gQ3JlZXBcbmZvciAobGV0IGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICBsZXQgY3JlZXAgPSBuZXcgQ3JlZXAoeyBnbyB9KTtcbiAgZ28uY2xpY2thYmxlcy5wdXNoKGNyZWVwKTtcbn1cbmNvbnN0IGR1bW15ID0gbmV3IENyZWVwKHsgZ28gfSlcbmR1bW15LnggPSA4MDA7XG5kdW1teS55ID0gMjAwO1xuZ28uY2xpY2thYmxlcy5wdXNoKGR1bW15KVxuXG5sZXQgb3JkZXJlZF9jbGlja2FibGVzID0gW107XG5jb25zdCB0YWJfY3ljbGluZyA9IChldikgPT4ge1xuICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gIG9yZGVyZWRfY2xpY2thYmxlcyA9IGdvLmNyZWVwcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgcmV0dXJuIFZlY3RvcjIuZGlzdGFuY2UoYSwgY2hhcmFjdGVyKSAtIFZlY3RvcjIuZGlzdGFuY2UoYiwgY2hhcmFjdGVyKTtcbiAgfSlcbiAgaWYgKFZlY3RvcjIuZGlzdGFuY2Uob3JkZXJlZF9jbGlja2FibGVzWzBdLCBjaGFyYWN0ZXIpID4gNTAwKSByZXR1cm47XG5cbiAgaWYgKG9yZGVyZWRfY2xpY2thYmxlc1swXSA9PT0gZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB7XG4gICAgZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gb3JkZXJlZF9jbGlja2FibGVzWzFdO1xuICB9IGVsc2Uge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG9yZGVyZWRfY2xpY2thYmxlc1swXVxuICB9XG59XG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1tcIlRhYlwiXSA9IFt0YWJfY3ljbGluZ11cblxubGV0IHNob3dfY29udHJvbF93aGVlbCA9IGZhbHNlXG5jb25zdCBkcmF3X2NvbnRyb2xfd2hlZWwgPSAoKSA9PiB7XG4gIGdvLmN0eC5iZWdpblBhdGgoKVxuICBnby5jdHguYXJjKFxuICAgIGNoYXJhY3Rlci54ICsgKGNoYXJhY3Rlci53aWR0aCAvIDIpIC0gZ28uY2FtZXJhLngsXG4gICAgY2hhcmFjdGVyLnkgKyAoY2hhcmFjdGVyLmhlaWdodCAvIDIpIC0gZ28uY2FtZXJhLnksXG4gICAgMjAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICBnby5jdHgubGluZVdpZHRoID0gNVxuICBnby5jdHguc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCJcbiAgZ28uY3R4LnN0cm9rZSgpO1xufVxuY29uc3QgdG9nZ2xlX2NvbnRyb2xfd2hlZWwgPSAoKSA9PiB7IHNob3dfY29udHJvbF93aGVlbCA9ICFzaG93X2NvbnRyb2xfd2hlZWwgfVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbXCJjXCJdID0gW3RvZ2dsZV9jb250cm9sX3doZWVsXVxuXG5jb25zdCBnYW1lX2xvb3AgPSBuZXcgR2FtZUxvb3AoKVxuZ2FtZV9sb29wLmRyYXcgPSBkcmF3XG5nYW1lX2xvb3AucHJvY2Vzc19rZXlzX2Rvd24gPSBnby5rZXlib2FyZF9pbnB1dC5wcm9jZXNzX2tleXNfZG93blxuZ2FtZV9sb29wLnVwZGF0ZSA9IHVwZGF0ZVxuXG5jb25zdCBzdGFydCA9ICgpID0+IHtcbiAgY2hhcmFjdGVyLnggPSAxMDBcbiAgY2hhcmFjdGVyLnkgPSAxMDBcbiAgZ28ud29ybGQuZ2VuZXJhdGVfbWFwKClcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG59XG5cbnN0YXJ0KCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=