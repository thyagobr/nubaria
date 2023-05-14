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
  this.slots = ["mage_mm", "free", "free", "free", "free", "free", "free", "free", "free", "free"]
  this.img = new Image();
  this.img.src = "https://cdna.artstation.com/p/assets/images/images/009/031/190/large/richard-thomas-paints-11-v2.jpg"
  // END -- character-specific

  this.draw = function() {
    for (var slot_index = 0; slot_index <= this.slots.length; slot_index++) {
      var slot = this.slots[slot_index];

      var x = this.action_bar_x + (this.slot_width * slot_index)
      var y = this.action_bar_y

      switch(slot) {
        // class specific :O
      case "mage_mm":
        this.game_object.ctx.drawImage(this.img, x, y, this.slot_width, this.slot_height)

        this.game_object.ctx.strokeStyle = "blueviolet"
        this.game_object.ctx.lineWidth = 2;
        this.game_object.ctx.strokeRect(
          x, y,
          this.slot_width, this.slot_height
        )
        break;

      case "free":
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
/* harmony import */ var _skills_cut_tree_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./skills/cut_tree.js */ "./src/skills/cut_tree.js");
/* harmony import */ var _skill_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./skill.js */ "./src/skill.js");
/* harmony import */ var _skills_break_stone_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./skills/break_stone.js */ "./src/skills/break_stone.js");
/* harmony import */ var _skills_make_fire_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./skills/make_fire.js */ "./src/skills/make_fire.js");
/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./board.js */ "./src/board.js");












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
  this.spells = {
    frostbolt: new _behaviors_spellcasting_js__WEBPACK_IMPORTED_MODULE_4__["default"]({ go, entity: this, spell: new _spells_frostbolt_js__WEBPACK_IMPORTED_MODULE_5__["default"]({ go, entity: this }) }).cast
  }
  this.skills = {
    cut_tree: new _skill_js__WEBPACK_IMPORTED_MODULE_7__["default"]({ go, entity: this, skill: new _skills_cut_tree_js__WEBPACK_IMPORTED_MODULE_6__["default"]({ go, entity: this }) }).act,
    break_stone: new _skill_js__WEBPACK_IMPORTED_MODULE_7__["default"]({ go, entity: this, skill: new _skills_break_stone_js__WEBPACK_IMPORTED_MODULE_8__["default"]({ go, entity: this }) }).act,
    make_fire: new _skill_js__WEBPACK_IMPORTED_MODULE_7__["default"]({ go, entity: this, skill: new _skills_make_fire_js__WEBPACK_IMPORTED_MODULE_9__["default"]({ go, entity: this }) }).act
  }
  this.stats = new _behaviors_stats_js__WEBPACK_IMPORTED_MODULE_3__["default"]({ go, entity: this, mana: 50 });
  this.health_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 20, colour: "red" })
  this.mana_bar = new _resource_bar__WEBPACK_IMPORTED_MODULE_1__["default"]({ go, target: this, y_offset: 10, colour: "blue" })
  this.board = new _board_js__WEBPACK_IMPORTED_MODULE_10__["default"]({ go, entity: this, radius: 20 })

  this.update_fps = () => {
    if (this.stats.current_mana < this.stats.mana) this.stats.current_mana += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(1, 3)
    if (near_bonfire()) {
      if (this.stats.current_hp < this.stats.hp) this.stats.current_hp += (0,_tapete_js__WEBPACK_IMPORTED_MODULE_0__.random)(4, 7)
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
  this.skills = [];
  this.trees = [];
  this.fires = [];
  this.stones = [];
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

/***/ "./src/position.js":
/*!*************************!*\
  !*** ./src/position.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Position)
/* harmony export */ });
function Position({ x, y, width, height }) {
    this.x = x
    this.y = y
    this.width = width || 1
    this.height = height || 1
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
/* harmony import */ var _position_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./position.js */ "./src/position.js");
/* harmony import */ var _tapete_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tapete.js */ "./src/tapete.js");




function Projectile({ go, subject }) {
    this.go = go;
    this.particle = new _particle_js__WEBPACK_IMPORTED_MODULE_0__["default"](go);
    this.start_position = null
    this.current_position = null
    this.end_position = null
    this.subject = subject
    this.bounds = () => {
        return { ...this.current_position, width: 5, height: 5 }
    }
    this.active = false;

    this.trace = [];

    this.act = ({ start_position, end_position }) => {
        this.start_position = start_position
        this.current_position = Object.create(this.start_position)
        this.end_position = end_position
        this.active = true
    }

    this.draw = () => {
        if (!this.active) return;
        if (_tapete_js__WEBPACK_IMPORTED_MODULE_2__.Vector2.distance(this.end_position, this.current_position) < 5) {
            this.active = false;
            this.subject.end();
            return;
        }

        this.calculate_position();
        this.particle.draw(this.current_position);
    }

    this.calculate_position = () => {
        const angle = _tapete_js__WEBPACK_IMPORTED_MODULE_2__.Vector2.angle(this.current_position, this.end_position);
        const speed = 10;
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

keyboard_input.on_keydown_callbacks.q = [character.spells.frostbolt]
keyboard_input.on_keydown_callbacks.f = [character.skills.cut_tree]
keyboard_input.on_keydown_callbacks[1] = [character.skills.break_stone]
keyboard_input.on_keydown_callbacks[2] = [character.skills.make_fire]
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
    go.stones.forEach(stone => stone.draw())
    go.trees.forEach(tree => tree.draw())
    go.fires.forEach(fire => fire.draw())
    go.draw_selected_clickable()
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsd0RBQWdCLGlCQUFpQix3REFBZ0I7QUFDNUQsR0FBRztBQUNILE1BQU0sd0RBQWdCOztBQUV0QjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUEsc0JBQXNCLHFEQUFRO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2FjdGlvbl9iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvYWdncm8uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvbW92ZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JlaGF2aW9ycy9zcGVsbGNhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWhhdmlvcnMvc3RhdHMuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvY3JlZXAuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3Mvc3RvbmUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9iZWluZ3MvdHJlZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2JvYXJkLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FtZXJhLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvY2FzdGluZ19iYXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jbGlja2FibGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9jb250cm9scy5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2Rvb2RhZC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2VkaXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2V2ZW50c19jYWxsYmFja3MuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX2xvb3AuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9nYW1lX29iamVjdC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2l0ZW0uanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9rZXlib2FyZF9pbnB1dC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2xvb3QuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9sb290X2JveC5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy9wYXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Bvc2l0aW9uLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvcHJvamVjdGlsZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3Jlc291cmNlX2Jhci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NjcmVlbi5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NraWxsLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGxzL2JyZWFrX3N0b25lLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGxzL2N1dF90cmVlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvc2tpbGxzL21ha2VfZmlyZS5qcyIsIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL3NwZWxscy9mcm9zdGJvbHQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90YXBldGUuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS8uL3NyYy90aWxlLmpzIiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd29ybGQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL251YmFyaWEvLi9zcmMvd2VpcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQWN0aW9uQmFyKGdhbWVfb2JqZWN0KSB7XG4gIHRoaXMuZ2FtZV9vYmplY3QgPSBnYW1lX29iamVjdFxuICB0aGlzLm51bWJlcl9vZl9zbG90cyA9IDEwXG4gIHRoaXMuc2xvdF9oZWlnaHQgPSB0aGlzLmdhbWVfb2JqZWN0LnRpbGVfc2l6ZSAqIDM7XG4gIHRoaXMuc2xvdF93aWR0aCA9IHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogMztcbiAgdGhpcy55X29mZnNldCA9IDEwMFxuICB0aGlzLmFjdGlvbl9iYXJfd2lkdGggPSB0aGlzLm51bWJlcl9vZl9zbG90cyAqIHRoaXMuc2xvdF93aWR0aFxuICB0aGlzLmFjdGlvbl9iYXJfaGVpZ2h0ID0gdGhpcy5udW1iZXJfb2Zfc2xvdHMgKiB0aGlzLnNsb3RfaGVpZ2h0XG4gIHRoaXMuYWN0aW9uX2Jhcl94ID0gKHRoaXMuZ2FtZV9vYmplY3QuY2FudmFzX3JlY3Qud2lkdGggLyAyKSAtICh0aGlzLmFjdGlvbl9iYXJfd2lkdGggLyAyKSBcbiAgdGhpcy5hY3Rpb25fYmFyX3kgPSB0aGlzLmdhbWVfb2JqZWN0LmNhbnZhc19yZWN0LmhlaWdodCAtIHRoaXMuZ2FtZV9vYmplY3QudGlsZV9zaXplICogNCAtIHRoaXMueV9vZmZzZXRcblxuICAvLyBjaGFyYWN0ZXItc3BlY2lmaWNcbiAgdGhpcy5zbG90cyA9IFtcIm1hZ2VfbW1cIiwgXCJmcmVlXCIsIFwiZnJlZVwiLCBcImZyZWVcIiwgXCJmcmVlXCIsIFwiZnJlZVwiLCBcImZyZWVcIiwgXCJmcmVlXCIsIFwiZnJlZVwiLCBcImZyZWVcIl1cbiAgdGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgdGhpcy5pbWcuc3JjID0gXCJodHRwczovL2NkbmEuYXJ0c3RhdGlvbi5jb20vcC9hc3NldHMvaW1hZ2VzL2ltYWdlcy8wMDkvMDMxLzE5MC9sYXJnZS9yaWNoYXJkLXRob21hcy1wYWludHMtMTEtdjIuanBnXCJcbiAgLy8gRU5EIC0tIGNoYXJhY3Rlci1zcGVjaWZpY1xuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIHNsb3RfaW5kZXggPSAwOyBzbG90X2luZGV4IDw9IHRoaXMuc2xvdHMubGVuZ3RoOyBzbG90X2luZGV4KyspIHtcbiAgICAgIHZhciBzbG90ID0gdGhpcy5zbG90c1tzbG90X2luZGV4XTtcblxuICAgICAgdmFyIHggPSB0aGlzLmFjdGlvbl9iYXJfeCArICh0aGlzLnNsb3Rfd2lkdGggKiBzbG90X2luZGV4KVxuICAgICAgdmFyIHkgPSB0aGlzLmFjdGlvbl9iYXJfeVxuXG4gICAgICBzd2l0Y2goc2xvdCkge1xuICAgICAgICAvLyBjbGFzcyBzcGVjaWZpYyA6T1xuICAgICAgY2FzZSBcIm1hZ2VfbW1cIjpcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguZHJhd0ltYWdlKHRoaXMuaW1nLCB4LCB5LCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG5cbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlU3R5bGUgPSBcImJsdWV2aW9sZXRcIlxuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICB0aGlzLmdhbWVfb2JqZWN0LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0XG4gICAgICAgIClcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJmcmVlXCI6XG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSg0NiwgNDYsIDQ2LCAxKVwiXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LmZpbGxSZWN0KFxuICAgICAgICAgIHgsIHksXG4gICAgICAgICAgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuXG4gICAgICAgIHRoaXMuZ2FtZV9vYmplY3QuY3R4LnN0cm9rZVN0eWxlID0gXCJibHVldmlvbGV0XCJcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgdGhpcy5nYW1lX29iamVjdC5jdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICB4LCB5LFxuICAgICAgICAgIHRoaXMuc2xvdF93aWR0aCwgdGhpcy5zbG90X2hlaWdodFxuICAgICAgICApXG5cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0aW9uQmFyXG4iLCJpbXBvcnQgQm9hcmQgZnJvbSBcIi4uL2JvYXJkXCJcbmltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuL21vdmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBZ2dybyh7IGdvLCBlbnRpdHksIHJhZGl1cyA9IDIwIH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzXG4gICAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCh7IGdvLCBlbnRpdHksIHJhZGl1czogTWF0aC5mbG9vcih0aGlzLnJhZGl1cyAvIHRoaXMuZ28udGlsZV9zaXplKSB9KVxuICAgIHRoaXMubW92ZSA9IG5ldyBNb3ZlKHsgZ28sIGVudGl0eSwgdGFyZ2V0X3Bvc2l0aW9uOiB0aGlzLmdvLmNoYXJhY3RlciB9KVxuXG4gICAgLy8gQ29tYmF0IHN5c3RlbVxuICAgIHRoaXMubGFzdF9hdHRhY2tfYXQgPSBudWxsO1xuICAgIHRoaXMuYXR0YWNrX3NwZWVkID0gMTAwMDtcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBWZWN0b3IyLmRpc3RhbmNlKHRoaXMuZ28uY2hhcmFjdGVyLCBlbnRpdHkpXG4gICAgICAgIGlmIChkaXN0YW5jZSA8IHRoaXMucmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmUuYWN0KCk7XG4gICAgICAgICAgICAvLyB0aGlzLmJvYXJkLmRyYXcoKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgNSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGFzdF9hdHRhY2tfYXQgPT09IG51bGwgfHwgKHRoaXMubGFzdF9hdHRhY2tfYXQgKyB0aGlzLmF0dGFja19zcGVlZCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIuc3RhdHMudGFrZV9kYW1hZ2UoeyBkYW1hZ2U6IHJhbmRvbSg1LCAxMikgfSlcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RfYXR0YWNrX2F0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfX1cblxuICAgIH1cblxuICAgIHRoaXMuZHJhd19wYXRoID0gKCkgPT4ge1xuXG4gICAgfVxuXG4gICAgY29uc3QgbmVpZ2hib3JfcG9zaXRpb25zID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5lbnRpdHkueCxcbiAgICAgICAgICAgIHk6IHRoaXMuZW50aXR5LnksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5lbnRpdHkud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZW50aXR5LmhlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGVmdCA9IHsgLi4uY3VycmVudF9wb3NpdGlvbiwgeDogdGhpcy5lbnRpdHkueCAtPSB0aGlzLmVudGl0eS5zcGVlZCB9XG4gICAgICAgIGNvbnN0IHJpZ2h0ID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB4OiB0aGlzLmVudGl0eS54ICs9IHRoaXMuZW50aXR5LnNwZWVkIH1cbiAgICAgICAgY29uc3QgdXAgPSB7IC4uLmN1cnJlbnRfcG9zaXRpb24sIHk6IHRoaXMuZW50aXR5LnkgLT0gdGhpcy5lbnRpdHkuc3BlZWQgfVxuICAgICAgICBjb25zdCBkb3duID0geyAuLi5jdXJyZW50X3Bvc2l0aW9uLCB5OiB0aGlzLmVudGl0eS55ICs9IHRoaXMuZW50aXR5LnNwZWVkIH1cblxuICAgIH1cbn0gIiwiaW1wb3J0IHsgVmVjdG9yMiwgaXNfY29sbGlkaW5nIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBjbGFzcyBNb3ZlIHtcbiAgICBjb25zdHJ1Y3Rvcih7IGdvLCBlbnRpdHksIHNwZWVkID0gMSwgdGFyZ2V0X3Bvc2l0aW9uIH0pIHtcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxuICAgICAgICB0aGlzLnRhcmdldF9wb3NpdGlvbiA9IHRhcmdldF9wb3NpdGlvblxuICAgICAgICB0aGlzLmJwcyA9IDA7XG4gICAgICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5wYXRoID0gbnVsbFxuICAgICAgICB0aGlzLm5leHRfcGF0aF9pbmRleCA9IG51bGxcbiAgICB9XG5cbiAgICBhY3QgPSAoKSA9PiB7XG4gICAgICAgIC8vIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgICAgIC8vIGlmICgodGhpcy5icHMpID49IDgwMCkge1xuICAgICAgICAvLyAgICAgdGhpcy5wYXRoID0gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZmluZF9wYXRoKHRoaXMuZW50aXR5LCB0aGlzLnRhcmdldF9wb3NpdGlvbilcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGBQYXRoIGxlbmd0aCAke3RoaXMucGF0aC5sZW5ndGh9YClcbiAgICAgICAgLy8gICAgIHRoaXMubmV4dF9wYXRoX2luZGV4ID0gMFxuICAgICAgICAvLyAgICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyB0aGlzLmVudGl0eS5hZ2dyby5ib2FyZC5kcmF3KClcbiAgICAgICAgLy9pZiAodGhpcy5wYXRoID09PSB1bmRlZmluZWQgfHwgdGhpcy5wYXRoW3RoaXMubmV4dF9wYXRoX2luZGV4XSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgLy9jb25zdCB0YXJnZXRlZF9wb3NpdGlvbiA9IHRoaXMucGF0aFt0aGlzLm5leHRfcGF0aF9pbmRleF1cbiAgICAgICAgY29uc3QgdGFyZ2V0ZWRfcG9zaXRpb24gPSB7IC4uLnRoaXMudGFyZ2V0X3Bvc2l0aW9uIH1cbiAgICAgICAgY29uc3QgbmV4dF9zdGVwID0ge1xuICAgICAgICAgICAgeDogdGhpcy5lbnRpdHkueCArIHRoaXMuc3BlZWQgKiBNYXRoLmNvcyhWZWN0b3IyLmFuZ2xlKHRoaXMuZW50aXR5LCB0YXJnZXRlZF9wb3NpdGlvbikpLFxuICAgICAgICAgICAgeTogdGhpcy5lbnRpdHkueSArIHRoaXMuc3BlZWQgKiBNYXRoLnNpbihWZWN0b3IyLmFuZ2xlKHRoaXMuZW50aXR5LCB0YXJnZXRlZF9wb3NpdGlvbikpLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZW50aXR5LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmVudGl0eS5oZWlnaHRcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZ28udHJlZXMuc29tZSh0cmVlID0+IChpc19jb2xsaWRpbmcobmV4dF9zdGVwLCB0cmVlKSkpKSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnkgPSBuZXh0X3N0ZXAueVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJobW1tLi4uIHdoZXJlIHRvP1wiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJlZGljdF9tb3ZlbWVudCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5icHMgPSBEYXRlLm5vdygpIC0gdGhpcy5sYXN0X3RpY2tcbiAgICAgICAgaWYgKCh0aGlzLmJwcykgPj0gMzAwMCkge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5lbnRpdHkuYWdncm8uYm9hcmQuZmluZF9wYXRoKHRoaXMuZW50aXR5LCB0aGlzLnRhcmdldF9wb3NpdGlvbilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBQYXRoIGxlbmd0aCAke3RoaXMucGF0aC5sZW5ndGh9YClcbiAgICAgICAgICAgIHRoaXMubmV4dF9wYXRoX2luZGV4ID0gMFxuICAgICAgICAgICAgdGhpcy5sYXN0X3RpY2sgPSBEYXRlLm5vdygpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IENhc3RpbmdCYXIgZnJvbSBcIi4uL2Nhc3RpbmdfYmFyLmpzXCJcbmltcG9ydCB7IHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCB9IGZyb20gXCIuLi90YXBldGUuanNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTcGVsbGNhc3RpbmcoeyBnbywgZW50aXR5LCBzcGVsbCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnNwZWxsID0gc3BlbGxcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiBlbnRpdHkgfSlcblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHsgfVxuXG4gICAgLy8gVGhpcyBsb2dpYyB3b24ndCB3b3JrIGZvciBjaGFubmVsaW5nIHNwZWxscy5cbiAgICAvLyBUaGUgZWZmZWN0cyBhbmQgdGhlIGNhc3RpbmcgYmFyIGhhcHBlbiBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFNhbWUgdGhpbmcgZm9yIHNvbWUgc2tpbGxzXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLm1hbmFnZWRfb2JqZWN0cylcbiAgICAgICAgY29uc29sZS5sb2coXCJTZWxsY2FzdGluZyNlbmRcIilcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5LnN0YXRzLmN1cnJlbnRfbWFuYSA+IHRoaXMuc3BlbGwubWFuYV9jb3N0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS5zdGF0cy5jdXJyZW50X21hbmEgLT0gdGhpcy5zcGVsbC5tYW5hX2Nvc3RcbiAgICAgICAgICAgIHRoaXMuc3BlbGwuYWN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2FzdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSB8fCAhdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuc3RhdHMpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZ19iYXIuZHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlbGxjYXN0aW5nI3N0b3BcIilcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMCwgdGhpcy5lbmQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbnRpdHkuc3RhdHMuY3VycmVudF9tYW5hID4gdGhpcy5zcGVsbC5tYW5hX2Nvc3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlbGxjYXN0aW5nI2Nhc3RcIilcbiAgICAgICAgICAgIHRoaXMuZ28ubWFuYWdlZF9vYmplY3RzLnB1c2godGhpcylcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMTUwMCwgdGhpcy5lbmQpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YXRzKHsgZ28sIGVudGl0eSwgaHAgPSAxMDAsIGN1cnJlbnRfaHAsIG1hbmEsIGN1cnJlbnRfbWFuYSB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLmhwID0gaHAgfHwgMTAwXG4gICAgdGhpcy5jdXJyZW50X2hwID0gY3VycmVudF9ocCB8fCBocFxuICAgIHRoaXMubWFuYSA9IG1hbmFcbiAgICB0aGlzLmN1cnJlbnRfbWFuYSA9IGN1cnJlbnRfbWFuYSB8fCBtYW5hXG5cbiAgICB0aGlzLmhhc19tYW5hID0gKCkgPT4gdGhpcy5tYW5hID09PSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc19kZWFkID0gKCkgPT4gdGhpcy5jdXJyZW50X2hwIDw9IDA7XG4gICAgdGhpcy5pc19hbGl2ZSA9ICgpID0+ICF0aGlzLmlzX2RlYWQoKTtcbiAgICB0aGlzLnRha2VfZGFtYWdlID0gKHsgZGFtYWdlIH0pID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50X2hwIC09IGRhbWFnZTtcbiAgICAgICAgaWYgKHRoaXMuaXNfZGVhZCgpKSB0aGlzLmRpZSgpXG4gICAgfVxuICAgIHRoaXMuZGllID0gKCkgPT4ge1xuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcy5lbnRpdHksIHRoaXMuZ28uY3JlZXBzKSB8fCBjb25zb2xlLmxvZyhcIk5vdCBvbiBsaXN0IG9mIGNyZWVwc1wiKVxuICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcy5lbnRpdHksIHRoaXMuZ28uY2xpY2thYmxlcykgfHwgY29uc29sZS5sb2coXCJOb3Qgb24gbGlzdCBvZiBjbGlja2FibGVzXCIpXG4gICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gdGhpcy5lbnRpdHkpIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbDtcbiAgICB9XG59IiwiaW1wb3J0IHsgZGlzdGFuY2UsIGlzX2NvbGxpZGluZywgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4uL3Jlc291cmNlX2Jhci5qc1wiXG5pbXBvcnQgQWdncm8gZnJvbSBcIi4uL2JlaGF2aW9ycy9hZ2dyby5qc1wiXG5pbXBvcnQgU3RhdHMgZnJvbSBcIi4uL2JlaGF2aW9ycy9zdGF0cy5qc1wiXG5cbmZ1bmN0aW9uIENyZWVwKHsgZ28gfSkge1xuICBpZiAoZ28uY3JlZXBzID09PSB1bmRlZmluZWQpIGdvLmNyZWVwcyA9IFtdXG4gIHRoaXMuaWQgPSBnby5jcmVlcHMubGVuZ3RoXG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNyZWVwcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJ6ZXJnbGluZy5wbmdcIiAvLyBwbGFjZWhvbGRlciBpbWFnZVxuICB0aGlzLmltYWdlX3dpZHRoID0gMTUwXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTUwXG4gIHRoaXMuaW1hZ2VfeF9vZmZzZXQgPSAwXG4gIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gIHRoaXMueCA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLndpZHRoKVxuICB0aGlzLnkgPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC5oZWlnaHQpXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDRcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDRcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IG51bGxcbiAgdGhpcy5zcGVlZCA9IDJcbiAgLy90aGlzLm1vdmVtZW50X2JvYXJkID0gdGhpcy5nby5ib2FyZC5ncmlkXG4gIHRoaXMuY3VycmVudF9tb3ZlbWVudF90YXJnZXQgPSBudWxsXG4gIHRoaXMuaGVhbHRoX2JhciA9IG5ldyBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQ6IHRoaXMsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKHsgZ28sIGVudGl0eTogdGhpcywgaHA6IDIwIH0pO1xuICAvLyBCZWhhdmlvdXJzXG4gIHRoaXMuYWdncm8gPSBuZXcgQWdncm8oeyBnbywgZW50aXR5OiB0aGlzLCByYWRpdXM6IDUwMCB9KTtcbiAgLy8gRU5EIC0gQmVoYXZpb3Vyc1xuXG4gIHRoaXMuY29vcmRzID0gZnVuY3Rpb24oY29vcmRzKSB7XG4gICAgdGhpcy54ID0gY29vcmRzLnhcbiAgICB0aGlzLnkgPSBjb29yZHMueVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24odGFyZ2V0X3Bvc2l0aW9uKSB7XG4gICAgbGV0IHggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnggPyB0YXJnZXRfcG9zaXRpb24ueCA6IHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICBsZXQgeSA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ueSA/IHRhcmdldF9wb3NpdGlvbi55IDogdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueVxuICAgIGxldCB3aWR0aCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24ud2lkdGggPyB0YXJnZXRfcG9zaXRpb24ud2lkdGggOiB0aGlzLndpZHRoXG4gICAgbGV0IGhlaWdodCA9IHRhcmdldF9wb3NpdGlvbiAmJiB0YXJnZXRfcG9zaXRpb24uaGVpZ2h0ID8gdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA6IHRoaXMuaGVpZ2h0XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHRoaXMuaW1hZ2VfeF9vZmZzZXQsIHRoaXMuaW1hZ2VfeV9vZmZzZXQsIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuaW1hZ2VfaGVpZ2h0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICAgIGlmICh0YXJnZXRfcG9zaXRpb24pIHJldHVyblxuXG4gICAgdGhpcy5hZ2dyby5hY3QoKTtcbiAgICB0aGlzLmhlYWx0aF9iYXIuZHJhdyh0aGlzLnN0YXRzLmhwLCB0aGlzLnN0YXRzLmN1cnJlbnRfaHApXG4gIH1cblxuICB0aGlzLnNldF9tb3ZlbWVudF90YXJnZXQgPSAod3BfbmFtZSkgPT4ge1xuICAgIGxldCB3cCA9IHRoaXMuZ28uZWRpdG9yLndheXBvaW50cy5maW5kKCh3cCkgPT4gd3AubmFtZSA9PT0gd3BfbmFtZSlcbiAgICBsZXQgbm9kZSA9IHRoaXMuZ28uYm9hcmQuZ3JpZFt3cC5pZF1cbiAgICB0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0ID0gbm9kZVxuICB9XG5cbiAgdGhpcy5tb3ZlID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRfbW92ZW1lbnRfdGFyZ2V0KSB7XG4gICAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5jdXJyZW50X21vdmVtZW50X3RhcmdldClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JlZXBcbiIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9uZSh7IGdvIH0pIHtcbiAgICB0aGlzLl9fcHJvdG9fXyA9IG5ldyBEb29kYWQoeyBnbyB9KVxuXG4gICAgdGhpcy5pbWFnZS5zcmMgPSBcImZsaW50c3RvbmUucG5nXCJcbiAgICB0aGlzLnggPSByYW5kb20oMSwgdGhpcy5nby53b3JsZC53aWR0aCk7XG4gICAgdGhpcy55ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQuaGVpZ2h0KTtcbiAgICB0aGlzLmltYWdlX3dpZHRoID0gODQwXG4gICAgdGhpcy5pbWFnZV9oZWlnaHQgPSA4NTlcbiAgICB0aGlzLmltYWdlX3hfb2Zmc2V0ID0gMFxuICAgIHRoaXMuaW1hZ2VfeV9vZmZzZXQgPSAwXG4gICAgdGhpcy53aWR0aCA9IDMyXG4gICAgdGhpcy5oZWlnaHQgPSAzMlxufSIsImltcG9ydCBEb29kYWQgZnJvbSBcIi4uL2Rvb2RhZFwiO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUcmVlKHsgZ28gfSkge1xuICAgIHRoaXMuX19wcm90b19fID0gbmV3IERvb2RhZCh7IGdvIH0pXG5cbiAgICB0aGlzLmltYWdlLnNyYyA9IFwicGxhbnRzLnBuZ1wiXG4gICAgdGhpcy54ID0gcmFuZG9tKDEsIHRoaXMuZ28ud29ybGQud2lkdGgpO1xuICAgIHRoaXMueSA9IHJhbmRvbSgxLCB0aGlzLmdvLndvcmxkLmhlaWdodCk7XG4gICAgdGhpcy5pbWFnZV93aWR0aCA9IDk4XG4gICAgdGhpcy5pbWFnZV94X29mZnNldCA9IDEyN1xuICAgIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMTI2XG4gICAgdGhpcy5pbWFnZV95X29mZnNldCA9IDI5MFxuICAgIHRoaXMud2lkdGggPSA5OFxuICAgIHRoaXMuaGVpZ2h0ID0gMTI2XG59IiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZS5qc1wiXG5pbXBvcnQgeyBpc19jb2xsaWRpbmcsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcblxuLy8gQSBncmlkIG9mIHRpbGVzIGZvciB0aGUgbWFuaXB1bGF0aW9uXG5mdW5jdGlvbiBCb2FyZCh7IGdvLCBlbnRpdHksIHJhZGl1cyB9KSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmJvYXJkID0gdGhpc1xuICB0aGlzLnRpbGVfc2l6ZSA9IHRoaXMuZ28udGlsZV9zaXplXG4gIHRoaXMuZ3JpZCA9IFtbXV1cbiAgdGhpcy5yYWRpdXMgPSByYWRpdXNcbiAgdGhpcy53aWR0aCA9IHRoaXMucmFkaXVzICogMlxuICB0aGlzLmhlaWdodCA9IHRoaXMucmFkaXVzICogMlxuICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICB0aGlzLnNob3VsZF9kcmF3ID0gZmFsc2VcblxuICB0aGlzLnRvZ2dsZV9ncmlkID0gKCkgPT4ge1xuICAgIHRoaXMuc2hvdWxkX2RyYXcgPSAhdGhpcy5zaG91bGRfZHJhd1xuICAgIGlmICh0aGlzLnNob3VsZF9kcmF3KSB0aGlzLmJ1aWxkX2dyaWQoKVxuICB9XG5cbiAgdGhpcy5icHMgPSAwO1xuICB0aGlzLmxhc3RfdGljayA9IERhdGUubm93KCk7XG5cbiAgdGhpcy5idWlsZF9ncmlkID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgZ3JpZFwiKVxuICAgIHRoaXMuYnBzID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdF90aWNrXG4gICAgaWYgKCh0aGlzLmJwcykgPCAxMDAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuZ3JpZCA9IG5ldyBBcnJheSh0aGlzLndpZHRoKVxuXG4gICAgY29uc3QgeF9wb3NpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5lbnRpdHkueCArIHRoaXMuZW50aXR5LndpZHRoIC8gMilcbiAgICBjb25zdCB5X3Bvc2l0aW9uID0gTWF0aC5mbG9vcih0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0IC8gMilcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICB0aGlzLmdyaWRbeF0gPSBuZXcgQXJyYXkodGhpcy5oZWlnaHQpXG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKHtcbiAgICAgICAgICB4OiAoeF9wb3NpdGlvbiAtICh0aGlzLnJhZGl1cyAqIHRoaXMudGlsZV9zaXplKSArIHggKiB0aGlzLnRpbGVfc2l6ZSksXG4gICAgICAgICAgeTogKHlfcG9zaXRpb24gLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkgKyB5ICogdGhpcy50aWxlX3NpemUpLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnRpbGVfc2l6ZSxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMudGlsZV9zaXplLFxuICAgICAgICAgIGc6IEluZmluaXR5LCAvLyBDb3N0IHNvIGZhclxuICAgICAgICAgIGY6IEluZmluaXR5LCAvLyBDb3N0IGZyb20gaGVyZSB0byB0YXJnZXRcbiAgICAgICAgICBoOiBudWxsLCAvL1xuICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgICAgICBib3JkZXJfY29sb3VyOiBcImJsYWNrXCJcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5nby50cmVlcy5mb3JFYWNoKHRyZWUgPT4ge1xuICAgICAgICAgIGlmIChpc19jb2xsaWRpbmcobm9kZSwgdHJlZSkpIHtcbiAgICAgICAgICAgIG5vZGUuY29sb3VyID0gJ3JlZCc7XG4gICAgICAgICAgICBub2RlLmJsb2NrZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBub2RlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy53YXlfdG9fcGxheWVyID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5maW5kX3BhdGgodGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUsIHRoaXMuZ28uY2hhcmFjdGVyKVxuICAgIH1cbiAgfVxuXG4gIC8vIEEqIEltcGxlbWVudGF0aW9uXG4gIC8vIGY6IENvc3Qgb2YgdGhlIGVudGlyZSB0cmF2ZWwgKHN1bSBvZiBnICsgaClcbiAgLy8gZzogQ29zdCBmcm9tIHN0YXJ0X25vZGUgdGlsbCBub2RlICh0cmF2ZWwgY29zdClcbiAgLy8gaDogQ29zdCBmcm9tIG5vZGUgdGlsbCBlbmRfbm9kZSAobGVmdG92ZXIgY29zdClcbiAgLy8gQWRkIHRoZSBjdXJyZW50IG5vZGUgaW4gYSBsaXN0XG4gIC8vIFBvcCB0aGUgb25lIHdob3NlIGYgaXMgdGhlIGxvd2VzdGFcbiAgLy8gQWRkIHRvIGEgbGlzdCBvZiBhbHJlYWR5LXZpc2l0ZWQgKGNsb3NlZClcbiAgLy8gVmlzaXQgYWxsIGl0cyBuZWlnaGJvdXJzXG4gIC8vIFVwZGF0ZSBmb3IgZWFjaDogdGhlIHRyYXZlbCBjb3N0IChnKSB5b3UgbWFuYWdlZCB0byBkbyBhbmQgeW91cnNlbGYgYXMgcGFyZW50XG4gIC8vLy8gU28gdGhhdCB3ZSBjYW4gcmV0cmFjZSBob3cgd2UgZ290IGhlcmVcbiAgdGhpcy5maW5kX3BhdGggPSAoc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbikgPT4ge1xuICAgIHRoaXMuYnVpbGRfZ3JpZCgpXG4gICAgY29uc3Qgc3RhcnRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKHN0YXJ0X3Bvc2l0aW9uKTtcbiAgICBjb25zdCBlbmRfbm9kZSA9IHRoaXMuZ2V0X25vZGVfZm9yKGVuZF9wb3NpdGlvbik7XG4gICAgaWYgKCFzdGFydF9ub2RlIHx8ICFlbmRfbm9kZSkge1xuICAgICAgY29uc29sZS5sb2coXCJub2RlcyBub3QgbWF0Y2hlZFwiKVxuICAgICAgZGVidWdnZXJcbiAgICB9XG5cbiAgICBzdGFydF9ub2RlLmNvbG91ciA9ICdvcmFuZ2UnXG4gICAgZW5kX25vZGUuY29sb3VyID0gJ29yYW5nZSdcblxuICAgIGNvbnN0IG9wZW5fc2V0ID0gW3N0YXJ0X25vZGVdO1xuICAgIGNvbnN0IGNsb3NlZF9zZXQgPSBbXTtcblxuICAgIGNvbnN0IGNvc3QgPSAobm9kZV9hLCBub2RlX2IpID0+IHtcbiAgICAgIGNvbnN0IGR4ID0gbm9kZV9hLnggLSBub2RlX2IueDtcbiAgICAgIGNvbnN0IGR5ID0gbm9kZV9hLnkgLSBub2RlX2IueTtcbiAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH1cblxuICAgIHN0YXJ0X25vZGUuZyA9IDA7XG4gICAgc3RhcnRfbm9kZS5mID0gY29zdChzdGFydF9ub2RlLCBlbmRfbm9kZSk7XG5cbiAgICB3aGlsZSAob3Blbl9zZXQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY3VycmVudF9ub2RlID0gb3Blbl9zZXQuc29ydCgoYSwgYikgPT4gKGEuZiA8IGIuZiA/IC0xIDogMSkpWzBdIC8vIEdldCB0aGUgbm9kZSB3aXRoIGxvd2VzdCBmIHZhbHVlIGluIHRoZSBvcGVuIHNldFxuICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KGN1cnJlbnRfbm9kZSwgb3Blbl9zZXQpXG4gICAgICBjbG9zZWRfc2V0LnB1c2goY3VycmVudF9ub2RlKVxuICAgICAgXG4gICAgICBpZiAoY3VycmVudF9ub2RlID09PSBlbmRfbm9kZSkge1xuICAgICAgICBsZXQgY3VycmVudCA9IGN1cnJlbnRfbm9kZTtcbiAgICAgICAgbGV0IHBhdGggPSBbXTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQucGFyZW50KSB7XG4gICAgICAgICAgY3VycmVudC5jb2xvdXIgPSAncHVycGxlJ1xuICAgICAgICAgIHBhdGgucHVzaChjdXJyZW50KTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm5laWdoYm91cnMoY3VycmVudF9ub2RlKS5mb3JFYWNoKG5laWdoYm91cl9ub2RlID0+IHtcbiAgICAgICAgaWYgKCFuZWlnaGJvdXJfbm9kZS5ibG9ja2VkICYmICFjbG9zZWRfc2V0LmluY2x1ZGVzKG5laWdoYm91cl9ub2RlKSkge1xuICAgICAgICAgIGxldCBnX3VzZWQgPSBjdXJyZW50X25vZGUuZyArIGNvc3QoY3VycmVudF9ub2RlLCBuZWlnaGJvdXJfbm9kZSlcbiAgICAgICAgICBsZXQgYmVzdF9nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCFvcGVuX3NldC5pbmNsdWRlcyhuZWlnaGJvdXJfbm9kZSkpIHtcbiAgICAgICAgICAgIG5laWdoYm91cl9ub2RlLmggPSBjb3N0KG5laWdoYm91cl9ub2RlLCBlbmRfbm9kZSlcbiAgICAgICAgICAgIG9wZW5fc2V0LnB1c2gobmVpZ2hib3VyX25vZGUpXG4gICAgICAgICAgICBiZXN0X2cgPSB0cnVlXG4gICAgICAgICAgfSBlbHNlIGlmIChnX3VzZWQgPCBuZWlnaGJvdXJfbm9kZS5nKSB7XG4gICAgICAgICAgICBiZXN0X2cgPSB0cnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJlc3RfZykge1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUucGFyZW50ID0gY3VycmVudF9ub2RlO1xuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuZyA9IGdfdXNlZFxuICAgICAgICAgICAgbmVpZ2hib3VyX25vZGUuZiA9IG5laWdoYm91cl9ub2RlLmcgKyBuZWlnaGJvdXJfbm9kZS5oXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubmVpZ2hib3VycyA9IChub2RlKSA9PiB7IC8vIDUsNVxuICAgIGNvbnN0IHhfb2Zmc2V0ID0gKE1hdGguZmxvb3IodGhpcy5lbnRpdHkueCArIHRoaXMuZW50aXR5LndpZHRoIC8gMikgLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkpXG4gICAgY29uc3QgeV9vZmZzZXQgPSAoTWF0aC5mbG9vcih0aGlzLmVudGl0eS55ICsgdGhpcy5lbnRpdHkuaGVpZ2h0IC8gMikgLSAodGhpcy5yYWRpdXMgKiB0aGlzLnRpbGVfc2l6ZSkpXG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoKG5vZGUueCAtIHhfb2Zmc2V0KSAvIHRoaXMudGlsZV9zaXplKVxuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChub2RlLnkgLSB5X29mZnNldCkgLyB0aGlzLnRpbGVfc2l6ZSlcblxuICAgIGZ1bmN0aW9uIGZldGNoX2dyaWRfY2VsbChncmlkLCBseCwgbHkpIHtcbiAgICAgIHJldHVybiBncmlkW2x4XSAmJiBncmlkW2x4XVtseV1cbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCwgeSAtIDEpLCAvLyB0b3BcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHggLSAxLCB5IC0gMSksIC8vIHRvcCBsZWZ0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSAtIDEpLCAvLyB0b3AgcmlnaHRcbiAgICAgIGZldGNoX2dyaWRfY2VsbCh0aGlzLmdyaWQsIHgsIHkgKyAxKSwgLy8gYm90dG9tXG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4IC0gMSwgeSArIDEpLCAvLyBib3R0b20gbGVmdFxuICAgICAgZmV0Y2hfZ3JpZF9jZWxsKHRoaXMuZ3JpZCwgeCArIDEsIHkgKyAxKSwgLy8gYm90dG9tIHJpZ2h0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4IC0gMSwgeSksIC8vIHJpZ2h0XG4gICAgICBmZXRjaF9ncmlkX2NlbGwodGhpcy5ncmlkLCB4ICsgMSwgeSkgLy8gbGVmdFxuICAgIF0uZmlsdGVyKG5vZGUgPT4gbm9kZSAhPT0gdW5kZWZpbmVkKVxuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5zaG91bGRfZHJhdykgcmV0dXJuXG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5ncmlkW3hdW3ldO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSBcIjFcIlxuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IG5vZGUuYm9yZGVyX2NvbG91clxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBub2RlLmNvbG91clxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsUmVjdChub2RlLnggLSB0aGlzLmdvLmNhbWVyYS54LCBub2RlLnkgLSB0aGlzLmdvLmNhbWVyYS55LCBub2RlLndpZHRoLCBub2RlLmhlaWdodClcbiAgICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdChub2RlLnggLSB0aGlzLmdvLmNhbWVyYS54LCBub2RlLnkgLSB0aGlzLmdvLmNhbWVyYS55LCBub2RlLndpZHRoLCBub2RlLmhlaWdodClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkX2dyaWQoKVxuICB9XG5cbiAgLy8gUmVjZWl2ZXMgYSByZWN0IGFuZCByZXR1cm5zIGl0J3MgZmlyc3QgY29sbGlkaW5nIE5vZGVcbiAgdGhpcy5nZXRfbm9kZV9mb3IgPSAocmVjdCkgPT4ge1xuICAgIGlmIChyZWN0LndpZHRoID09IHVuZGVmaW5lZCkgcmVjdC53aWR0aCA9IDFcbiAgICBpZiAocmVjdC5oZWlnaHQgPT0gdW5kZWZpbmVkKSByZWN0LmhlaWdodCA9IDFcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGlmICgodGhpcy5ncmlkW3hdID09PSB1bmRlZmluZWQpIHx8ICh0aGlzLmdyaWRbeF1beV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHt4fSwke3l9IGNvb3JkaW5hdGVzIGlzIHVuZGVmaW5lZGApXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coYFdpZHRoOiAke3RoaXMud2lkdGh9OyBoZWlnaHQ6ICR7dGhpcy5oZWlnaHR9IChyYWRpdXM6ICR7dGhpcy5yYWRpdXN9KWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGlzX2NvbGxpZGluZyhcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4ucmVjdCxcbiAgICAgICAgICAgIH0sIHRoaXMuZ3JpZFt4XVt5XSkpIHJldHVybiB0aGlzLmdyaWRbeF1beV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8vIFVOVVNFRCBPTEQgQUxHT1JJVEhNXG5cbiAgLy8gU2V0cyBhIGdsb2JhbCB0YXJnZXQgbm9kZVxuICAvLyBJdCB3YXMgdXNlZCBiZWZvcmUgdGhlIG1vdmVtZW50IGdvdCBkZXRhY2hlZCBmcm9tIHRoZSBwbGF5ZXIgY2hhcmFjdGVyXG4gIHRoaXMudGFyZ2V0X25vZGUgPSBudWxsXG4gIHRoaXMuc2V0X3RhcmdldCA9IChub2RlKSA9PiB7XG4gICAgdGhpcy5ncmlkLmZvckVhY2goKG5vZGUpID0+IG5vZGUuZGlzdGFuY2UgPSAwKVxuICAgIHRoaXMudGFyZ2V0X25vZGUgPSBub2RlXG4gIH1cblxuICAvLyBDYWxjdWxhdGVzIHBvc3NpYmxlIHBvc3NpdGlvbnMgZm9yIHRoZSBuZXh0IG1vdmVtZW50XG4gIHRoaXMuY2FsY3VsYXRlX25laWdoYm91cnMgPSAoY2hhcmFjdGVyKSA9PiB7XG4gICAgbGV0IGNoYXJhY3Rlcl9yZWN0ID0ge1xuICAgICAgeDogY2hhcmFjdGVyLnggLSBjaGFyYWN0ZXIuc3BlZWQsXG4gICAgICB5OiBjaGFyYWN0ZXIueSAtIGNoYXJhY3Rlci5zcGVlZCxcbiAgICAgIHdpZHRoOiBjaGFyYWN0ZXIud2lkdGggKyBjaGFyYWN0ZXIuc3BlZWQsXG4gICAgICBoZWlnaHQ6IGNoYXJhY3Rlci5oZWlnaHQgKyBjaGFyYWN0ZXIuc3BlZWRcbiAgICB9XG5cbiAgICBsZXQgZnV0dXJlX21vdmVtZW50X2NvbGxpc2lvbnMgPSBjaGFyYWN0ZXIubW92ZW1lbnRfYm9hcmQuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gaXNfY29sbGlkaW5nKGNoYXJhY3Rlcl9yZWN0LCBub2RlKVxuICAgIH0pXG5cbiAgICAvLyBJJ20gZ29ubmEgY29weSB0aGVtIGhlcmUgb3RoZXJ3aXNlIGRpZmZlcmVudCBlbnRpdGllcyBjYWxjdWxhdGluZyBkaXN0YW5jZVxuICAgIC8vIHdpbGwgYWZmZWN0IGVhY2ggb3RoZXIncyBudW1iZXJzLiBUaGlzIGNhbiBiZSBzb2x2ZWQgd2l0aCBhIGRpZmZlcmVudFxuICAgIC8vIGNhbGN1bGF0aW9uIGFsZ29yaXRobSBhcyB3ZWxsLlxuICAgIHJldHVybiBmdXR1cmVfbW92ZW1lbnRfY29sbGlzaW9uc1xuICB9XG5cblxuICB0aGlzLm5leHRfc3RlcCA9IChjaGFyYWN0ZXIsIGNsb3Nlc3Rfbm9kZSwgdGFyZ2V0X25vZGUpID0+IHtcbiAgICAvLyBTdGVwOiBTZWxlY3QgYWxsIG5laWdoYm91cnNcbiAgICBsZXQgdmlzaXRlZCA9IFtdXG4gICAgbGV0IG5vZGVzX3Blcl9yb3cgPSBNYXRoLnRydW5jKDQwOTYgLyBnby50aWxlX3NpemUpXG4gICAgbGV0IG9yaWdpbl9pbmRleCA9IGNsb3Nlc3Rfbm9kZS5pZFxuXG4gICAgbGV0IG5laWdoYm91cnMgPSB0aGlzLmNhbGN1bGF0ZV9uZWlnaGJvdXJzKGNoYXJhY3RlcilcblxuICAgIC8vIFN0ZXA6IFNvcnQgbmVpZ2hib3VycyBieSBkaXN0YW5jZSAoc21hbGxlciBkaXN0YW5jZSBmaXJzdClcbiAgICAvLyBXZSBhZGQgdGhlIHdhbGsgbW92ZW1lbnQgdG8gcmUtdmlzaXRlZCBub2RlcyB0byBzaWduaWZ5IHRoaXMgY29zdFxuICAgIGxldCBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MgPSBuZWlnaGJvdXJzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmRpc3RhbmNlKSB7XG4gICAgICAgIC8vYS5kaXN0YW5jZSArPSAyICogY2hhcmFjdGVyLnNwZWVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhLmRpc3RhbmNlID0gVmVjdG9yMi5kaXN0YW5jZShhLCB0YXJnZXRfbm9kZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGIuZGlzdGFuY2UpIHtcbiAgICAgICAgLy9iLmRpc3RhbmNlICs9IGNoYXJhY3Rlci5zcGVlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYi5kaXN0YW5jZSA9IFZlY3RvcjIuZGlzdGFuY2UoYiwgdGFyZ2V0X25vZGUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhLmRpc3RhbmNlIC0gYi5kaXN0YW5jZVxuICAgIH0pXG5cbiAgICAvLyBTdGVwOiBTZWxlY3Qgb25seSBuZWlnaGJvdXIgbm9kZXMgdGhhdCBhcmUgbm90IGJsb2NrZWRcbiAgICBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MgPSBuZWlnaGJvdXJzX3NvcnRlZF9ieV9kaXN0YW5jZV9hc2MuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gbm9kZS5ibG9ja2VkICE9PSB0cnVlXG4gICAgfSlcblxuICAgIC8vIFN0ZXA6IFJldHVybiB0aGUgY2xvc2VzdCB2YWxpZCBub2RlIHRvIHRoZSB0YXJnZXRcbiAgICAvLyByZXR1cm5zIHRydWUgaWYgdGhlIGNsb3Nlc3QgcG9pbnQgaXMgdGhlIHRhcmdldCBpdHNlbGZcbiAgICAvLyByZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGlzIG5vd2hlcmUgdG8gZ29cbiAgICBpZiAobmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGZ1dHVyZV9ub2RlID0gbmVpZ2hib3Vyc19zb3J0ZWRfYnlfZGlzdGFuY2VfYXNjWzBdXG4gICAgICByZXR1cm4gKGZ1dHVyZV9ub2RlLmlkID09IHRhcmdldF9ub2RlLmlkID8gdHJ1ZSA6IGZ1dHVyZV9ub2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZSA9IGZ1bmN0aW9uIChjaGFyYWN0ZXIsIHRhcmdldF9ub2RlKSB7XG4gICAgbGV0IGNoYXJfcG9zID0ge1xuICAgICAgeDogY2hhcmFjdGVyLngsXG4gICAgICB5OiBjaGFyYWN0ZXIueVxuICAgIH1cblxuICAgIGxldCBjdXJyZW50X25vZGUgPSB0aGlzLmdldF9ub2RlX2ZvcihjaGFyX3BvcylcbiAgICBsZXQgY2xvc2VzdF9ub2RlID0gdGhpcy5uZXh0X3N0ZXAoY2hhcmFjdGVyLCBjdXJyZW50X25vZGUsIHRhcmdldF9ub2RlKVxuXG4gICAgLy8gV2UgaGF2ZSBhIG5leHQgc3RlcFxuICAgIGlmICh0eXBlb2YgKGNsb3Nlc3Rfbm9kZSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGxldCBmdXR1cmVfbW92ZW1lbnQgPSB7IC4uLmNoYXJfcG9zIH1cbiAgICAgIGxldCB4X3NwZWVkID0gMFxuICAgICAgbGV0IHlfc3BlZWQgPSAwXG4gICAgICBpZiAoY2xvc2VzdF9ub2RlLnggIT0gY2hhcmFjdGVyLngpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlX3ggPSBjaGFyX3Bvcy54IC0gY2xvc2VzdF9ub2RlLnhcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlX3gpID49IGNoYXJhY3Rlci5zcGVlZCkge1xuICAgICAgICAgIHhfc3BlZWQgPSAoZGlzdGFuY2VfeCA+IDAgPyAtY2hhcmFjdGVyLnNwZWVkIDogY2hhcmFjdGVyLnNwZWVkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChjaGFyX3Bvcy54IDwgY2xvc2VzdF9ub2RlLngpIHtcbiAgICAgICAgICAgIHhfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV94KSAqIC0xXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHhfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV94KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2xvc2VzdF9ub2RlLnkgIT0gY2hhcmFjdGVyLnkpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlX3kgPSBmdXR1cmVfbW92ZW1lbnQueSAtIGNsb3Nlc3Rfbm9kZS55XG4gICAgICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZV95KSA+PSBjaGFyYWN0ZXIuc3BlZWQpIHtcbiAgICAgICAgICB5X3NwZWVkID0gKGRpc3RhbmNlX3kgPiAwID8gLWNoYXJhY3Rlci5zcGVlZCA6IGNoYXJhY3Rlci5zcGVlZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnkgPCBjbG9zZXN0X25vZGUueSkge1xuICAgICAgICAgICAgeV9zcGVlZCA9IE1hdGguYWJzKGRpc3RhbmNlX3kpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHlfc3BlZWQgPSBNYXRoLmFicyhkaXN0YW5jZV95KSAqIC0xXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gZnV0dXJlX21vdmVtZW50LnggKyB4X3NwZWVkXG4gICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGZ1dHVyZV9tb3ZlbWVudC55ICsgeV9zcGVlZFxuXG4gICAgICBjaGFyYWN0ZXIuY29vcmRzKGZ1dHVyZV9tb3ZlbWVudClcbiAgICAgIC8vIFdlJ3JlIGFscmVhZHkgYXQgdGhlIGJlc3Qgc3BvdFxuICAgIH0gZWxzZSBpZiAoY2xvc2VzdF9ub2RlID09PSB0cnVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInJlYWNoZWRcIilcbiAgICAgIGNoYXJhY3Rlci5tb3ZlbWVudF9ib2FyZCA9IFtdXG4gICAgICBjaGFyYWN0ZXIubW92aW5nID0gZmFsc2VcbiAgICAgIC8vIFdlJ3JlIHN0dWNrXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE86IGdvdCB0aGlzIG9uY2UgYWZ0ZXIgaGFkIGFscmVhZHkgcmVhY2hlZC4gXG4gICAgICBjb25zb2xlLmxvZyhcIm5vIHBhdGhcIilcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9hcmRcbiIsImZ1bmN0aW9uIENhbWVyYShnbykge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy5nby5jYW1lcmEgPSB0aGlzXG4gIHRoaXMueCA9IDBcbiAgdGhpcy55ID0gMFxuICB0aGlzLmNhbWVyYV9zcGVlZCA9IDNcblxuICB0aGlzLm1vdmVfY2FtZXJhX3dpdGhfbW91c2UgPSAoZXYpID0+IHtcbiAgICAvL2lmICh0aGlzLmdvLmVkaXRvci5wYWludF9tb2RlKSByZXR1cm5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgMTAwIHBpeGVscyBjbG9zZSB0byB0aGUgYm90dG9tIG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPCAxMDApIHtcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IHkgKyB0aGUgbW92ZW1lbnQgd2UnbGwgbWFrZSBmdXJ0aGVyIHRoZXJlIGlzIGdyZWF0ZXIgdGhhblxuICAgICAgLy8gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgc2NyZWVuIG1pbnVzIHRoZSBoZWlnaHQgdGhhdCB3aWxsIGFscmVhZHkgYmUgdmlzaWJsZVxuICAgICAgLy8gKHRoZSBjYW52YXMgaGVpZ2h0KSwgZG9uJ3QgZ28gZnVydGhlciBvd25cbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmNhbWVyYV9zcGVlZCA+IHRoaXMuZ28uc2NyZWVuLmhlaWdodCAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnkgPSB0aGlzLmdvLmNhbWVyYS55ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSB0b3Agb2YgdGhlIGNhbnZhc1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC0gZXYuY2xpZW50WSkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LmhlaWdodCAtIDEwMCkge1xuICAgICAgaWYgKHRoaXMueSArIHRoaXMuY2FtZXJhX3NwZWVkIDwgMCkgcmV0dXJuXG4gICAgICB0aGlzLmdvLmNhbWVyYS55ID0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMuY2FtZXJhX3NwZWVkXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIDEwMCBwaXhlbHMgY2xvc2UgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcbiAgICBpZiAoKHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGggLSBldi5jbGllbnRYKSA8IDEwMCkge1xuICAgICAgaWYgKHRoaXMueCArIHRoaXMuY2FtZXJhX3NwZWVkID4gdGhpcy5nby5zY3JlZW4ud2lkdGggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoKSByZXR1cm5cbiAgICAgIHRoaXMuZ28uY2FtZXJhLnggPSB0aGlzLmdvLmNhbWVyYS54ICsgdGhpcy5jYW1lcmFfc3BlZWRcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyAxMDAgcGl4ZWxzIGNsb3NlIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXNcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gZXYuY2xpZW50WCkgPiB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC0gMTAwKSB7XG4gICAgICAvLyBEb24ndCBnbyBmdXJ0aGVyIGxlZnRcbiAgICAgIGlmICh0aGlzLnggKyB0aGlzLmNhbWVyYV9zcGVlZCA8IDApIHJldHVyblxuICAgICAgdGhpcy5nby5jYW1lcmEueCA9IHRoaXMuZ28uY2FtZXJhLnggLSB0aGlzLmNhbWVyYV9zcGVlZFxuICAgIH1cbiAgfVxuXG4gIHRoaXMuZm9jdXMgPSAocG9pbnQpID0+IHtcbiAgICBsZXQgeCA9IHBvaW50LnggLSB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoIC8gMlxuICAgIGxldCB5ID0gcG9pbnQueSAtIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0IC8gMlxuICAgIC8vIHNwZWNpZmljIG1hcCBjdXRzIChpdCBoYXMgYSBtYXAgb2Zmc2V0IG9mIDYwLDE2MClcbiAgICBpZiAoeSA8IDApIHsgeSA9IDAgfVxuICAgIGlmICh4IDwgMCkgeyB4ID0gMCB9XG4gICAgaWYgKHggKyB0aGlzLmdvLmNhbnZhc19yZWN0LndpZHRoID4gdGhpcy5nby53b3JsZC53aWR0aCkgeyB4ID0gdGhpcy54IH1cbiAgICBpZiAoeSArIHRoaXMuZ28uY2FudmFzX3JlY3QuaGVpZ2h0ID4gdGhpcy5nby53b3JsZC5oZWlnaHQpIHsgeSA9IHRoaXMueSB9XG4gICAgLy8gb2Zmc2V0IGNoYW5nZXMgZW5kXG4gICAgdGhpcy54ID0geFxuICAgIHRoaXMueSA9IHlcbiAgfVxuXG4gIHRoaXMuZ2xvYmFsX2Nvb3JkcyA9IChvYmopID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub2JqLFxuICAgICAgeDogb2JqLnggLSB0aGlzLngsXG4gICAgICB5OiBvYmoueSAtIHRoaXMueVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW1lcmFcbiIsImZ1bmN0aW9uIENhc3RpbmdCYXIoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMuZHVyYXRpb24gPSBudWxsXG4gICAgdGhpcy53aWR0aCA9IGdvLmNoYXJhY3Rlci53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gNVxuICAgIHRoaXMuY29sb3VyID0gXCJwdXJwbGVcIlxuICAgIHRoaXMuZnVsbCA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgdGhpcy5zdGFydGluZ190aW1lID0gbnVsbFxuICAgIHRoaXMubGFzdF90aW1lID0gbnVsbFxuICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsXG4gICAgLy8gU3RheXMgc3RhdGljIGluIGEgcG9zaXRpb24gaW4gdGhlIG1hcFxuICAgIC8vIE1lYW5pbmc6IGRvZXNuJ3QgbW92ZSB3aXRoIHRoZSBjYW1lcmFcbiAgICB0aGlzLnN0YXRpYyA9IGZhbHNlXG4gICAgdGhpcy54X29mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGljID9cbiAgICAgICAgICAgIHRoaXMuZ28uY2FtZXJhLnggOlxuICAgICAgICAgICAgMDtcbiAgICB9XG4gICAgdGhpcy55X29mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGljID9cbiAgICAgICAgICAgIHRoaXMuZ28uY2FtZXJhLnkgOlxuICAgICAgICAgICAgMDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0ID0gKGR1cmF0aW9uLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0aW5nX3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMubGFzdF90aW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImRyYXdpbmcgY2FzdGluZyBiYXJcIilcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmR1cmF0aW9uID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGVsYXBzZWRfdGltZSA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RfdGltZTtcbiAgICAgICAgdGhpcy5sYXN0X3RpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIHRoaXMuY3VycmVudCArPSBlbGFwc2VkX3RpbWU7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQgPD0gdGhpcy5kdXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy5lbnRpdHkueCAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgICAgIHRoaXMueSA9IHRoaXMuZW50aXR5LnkgKyB0aGlzLmVudGl0eS5oZWlnaHQgKyAxMCAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICAgICAgICAgIGxldCBiYXJfd2lkdGggPSAoKHRoaXMuY3VycmVudCAvIHRoaXMuZHVyYXRpb24pICogdGhpcy53aWR0aClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0XG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QodGhpcy54IC0gdGhpcy54X29mZnNldCgpLCB0aGlzLnkgLSB0aGlzLnlfb2Zmc2V0KCksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvdXJcbiAgICAgICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCAtIHRoaXMueF9vZmZzZXQoKSwgdGhpcy55IC0gdGhpcy55X29mZnNldCgpLCBiYXJfd2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kdXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoKHRoaXMuY2FsbGJhY2sgIT09IG51bGwpICYmICh0aGlzLmNhbGxiYWNrICE9PSB1bmRlZmluZWQpKSB0aGlzLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhc3RpbmdCYXJcbiIsImltcG9ydCB7IGRpc3RhbmNlLCBpc19jb2xsaWRpbmcsIHJhbmRvbSwgVmVjdG9yMiB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiXG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4vcmVzb3VyY2VfYmFyXCJcbmltcG9ydCBJbnZlbnRvcnkgZnJvbSBcIi4vaW52ZW50b3J5XCJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi9iZWhhdmlvcnMvc3RhdHMuanNcIlxuaW1wb3J0IFNwZWxsY2FzdGluZyBmcm9tIFwiLi9iZWhhdmlvcnMvc3BlbGxjYXN0aW5nLmpzXCJcbmltcG9ydCBGcm9zdGJvbHQgZnJvbSBcIi4vc3BlbGxzL2Zyb3N0Ym9sdC5qc1wiXG5pbXBvcnQgQ3V0VHJlZSBmcm9tIFwiLi9za2lsbHMvY3V0X3RyZWUuanNcIlxuaW1wb3J0IFNraWxsIGZyb20gXCIuL3NraWxsLmpzXCJcbmltcG9ydCBCcmVha1N0b25lIGZyb20gXCIuL3NraWxscy9icmVha19zdG9uZS5qc1wiXG5pbXBvcnQgTWFrZUZpcmUgZnJvbSBcIi4vc2tpbGxzL21ha2VfZmlyZS5qc1wiXG5pbXBvcnQgQm9hcmQgZnJvbSBcIi4vYm9hcmQuanNcIlxuXG5mdW5jdGlvbiBDaGFyYWN0ZXIoZ28sIGlkKSB7XG4gIHRoaXMuZ28gPSBnb1xuICB0aGlzLmdvLmNoYXJhY3RlciA9IHRoaXNcbiAgdGhpcy5uYW1lID0gYFBsYXllciAke1N0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkpLnNsaWNlKDAsIDIpfWBcbiAgdGhpcy5lZGl0b3IgPSBnby5lZGl0b3JcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICB0aGlzLmltYWdlLnNyYyA9IFwiY3Jpc2lzY29yZXBlZXBzLnBuZ1wiXG4gIHRoaXMuaW1hZ2Vfd2lkdGggPSAzMlxuICB0aGlzLmltYWdlX2hlaWdodCA9IDMyXG4gIHRoaXMuaWQgPSBpZFxuICB0aGlzLnggPSAxMDBcbiAgdGhpcy55ID0gMTAwXG4gIHRoaXMud2lkdGggPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmdvLnRpbGVfc2l6ZSAqIDJcbiAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICB0aGlzLmRpcmVjdGlvbiA9IFwiZG93blwiXG4gIHRoaXMud2Fsa19jeWNsZV9pbmRleCA9IDBcbiAgdGhpcy5zcGVlZCA9IDEuNFxuICB0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoeyBnbyB9KTtcbiAgdGhpcy5zcGVsbHMgPSB7XG4gICAgZnJvc3Rib2x0OiBuZXcgU3BlbGxjYXN0aW5nKHsgZ28sIGVudGl0eTogdGhpcywgc3BlbGw6IG5ldyBGcm9zdGJvbHQoeyBnbywgZW50aXR5OiB0aGlzIH0pIH0pLmNhc3RcbiAgfVxuICB0aGlzLnNraWxscyA9IHtcbiAgICBjdXRfdHJlZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBDdXRUcmVlKHsgZ28sIGVudGl0eTogdGhpcyB9KSB9KS5hY3QsXG4gICAgYnJlYWtfc3RvbmU6IG5ldyBTa2lsbCh7IGdvLCBlbnRpdHk6IHRoaXMsIHNraWxsOiBuZXcgQnJlYWtTdG9uZSh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuYWN0LFxuICAgIG1ha2VfZmlyZTogbmV3IFNraWxsKHsgZ28sIGVudGl0eTogdGhpcywgc2tpbGw6IG5ldyBNYWtlRmlyZSh7IGdvLCBlbnRpdHk6IHRoaXMgfSkgfSkuYWN0XG4gIH1cbiAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cyh7IGdvLCBlbnRpdHk6IHRoaXMsIG1hbmE6IDUwIH0pO1xuICB0aGlzLmhlYWx0aF9iYXIgPSBuZXcgUmVzb3VyY2VCYXIoeyBnbywgdGFyZ2V0OiB0aGlzLCB5X29mZnNldDogMjAsIGNvbG91cjogXCJyZWRcIiB9KVxuICB0aGlzLm1hbmFfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ28sIHRhcmdldDogdGhpcywgeV9vZmZzZXQ6IDEwLCBjb2xvdXI6IFwiYmx1ZVwiIH0pXG4gIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQoeyBnbywgZW50aXR5OiB0aGlzLCByYWRpdXM6IDIwIH0pXG5cbiAgdGhpcy51cGRhdGVfZnBzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSA8IHRoaXMuc3RhdHMubWFuYSkgdGhpcy5zdGF0cy5jdXJyZW50X21hbmEgKz0gcmFuZG9tKDEsIDMpXG4gICAgaWYgKG5lYXJfYm9uZmlyZSgpKSB7XG4gICAgICBpZiAodGhpcy5zdGF0cy5jdXJyZW50X2hwIDwgdGhpcy5zdGF0cy5ocCkgdGhpcy5zdGF0cy5jdXJyZW50X2hwICs9IHJhbmRvbSg0LCA3KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5lYXJfYm9uZmlyZSA9ICgpID0+IHRoaXMuZ28uZmlyZXMuc29tZShmaXJlID0+IFZlY3RvcjIuZGlzdGFuY2UodGhpcywgZmlyZSkgPCAxMDApO1xuXG4gIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy50YXJnZXRfbW92ZW1lbnQpIHRoaXMuZHJhd19tb3ZlbWVudF90YXJnZXQoKVxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBNYXRoLmZsb29yKHRoaXMud2Fsa19jeWNsZV9pbmRleCkgKiB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmdldF9kaXJlY3Rpb25fc3ByaXRlKCkgKiB0aGlzLmltYWdlX2hlaWdodCwgdGhpcy5pbWFnZV93aWR0aCwgdGhpcy5pbWFnZV9oZWlnaHQsIHRoaXMueCAtIHRoaXMuZ28uY2FtZXJhLngsIHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuaGVhbHRoX2Jhci5kcmF3KHRoaXMuc3RhdHMuaHAsIHRoaXMuc3RhdHMuY3VycmVudF9ocClcbiAgICB0aGlzLm1hbmFfYmFyLmRyYXcodGhpcy5zdGF0cy5tYW5hLCB0aGlzLnN0YXRzLmN1cnJlbnRfbWFuYSlcbiAgfVxuXG4gIHRoaXMuZHJhd19jaGFyYWN0ZXIgPSAoeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0pID0+IHtcbiAgICB4ID0geCA9PT0gdW5kZWZpbmVkID8gdGhpcy54IC0gdGhpcy5nby5jYW1lcmEueCA6IHhcbiAgICB5ID0geSA9PT0gdW5kZWZpbmVkID8gdGhpcy55IC0gdGhpcy5nby5jYW1lcmEueSA6IHlcbiAgICB3aWR0aCA9IHdpZHRoID09PSB1bmRlZmluZWQgPyB0aGlzLndpZHRoIDogd2lkdGhcbiAgICBoZWlnaHQgPSBoZWlnaHQgPT09IHVuZGVmaW5lZCA/IHRoaXMuaGVpZ2h0IDogaGVpZ2h0XG4gICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIE1hdGguZmxvb3IodGhpcy53YWxrX2N5Y2xlX2luZGV4KSAqIHRoaXMuaW1hZ2Vfd2lkdGgsIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUoKSAqIHRoaXMuaW1hZ2VfaGVpZ2h0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgfVxuXG4gIHRoaXMuZ2V0X2RpcmVjdGlvbl9zcHJpdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc3dpdGNoICh0aGlzLmRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIHJldHVybiAyXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgIHJldHVybiAzXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZG93blwiOlxuICAgICAgICByZXR1cm4gMFxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdmUgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgICBjb25zdCBmdXR1cmVfcG9zaXRpb24gPSB7IHg6IHRoaXMueCwgeTogdGhpcy55LCB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9XG5cbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgIGlmICh0aGlzLnggKyB0aGlzLnNwZWVkIDwgdGhpcy5nby53b3JsZC53aWR0aCArIHRoaXMuZ28ud29ybGQueF9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueCArPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidXBcIjpcbiAgICAgICAgaWYgKHRoaXMueSAtIHRoaXMuc3BlZWQgPiB0aGlzLmdvLndvcmxkLnlfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnkgLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgaWYgKHRoaXMueCAtIHRoaXMuc3BlZWQgPiB0aGlzLmdvLndvcmxkLnhfb2Zmc2V0KSB7XG4gICAgICAgICAgZnV0dXJlX3Bvc2l0aW9uLnggLT0gdGhpcy5zcGVlZFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgaWYgKHRoaXMueSArIHRoaXMuc3BlZWQgPCB0aGlzLmdvLndvcmxkLmhlaWdodCArIHRoaXMuZ28ud29ybGQueV9vZmZzZXQpIHtcbiAgICAgICAgICBmdXR1cmVfcG9zaXRpb24ueSArPSB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdvLnRyZWVzLnNvbWUodHJlZSA9PiAoaXNfY29sbGlkaW5nKGZ1dHVyZV9wb3NpdGlvbiwgdHJlZSkpKSkge1xuICAgICAgdGhpcy54ID0gZnV0dXJlX3Bvc2l0aW9uLnhcbiAgICAgIHRoaXMueSA9IGZ1dHVyZV9wb3NpdGlvbi55XG4gICAgICB0aGlzLndhbGtfY3ljbGVfaW5kZXggPSAodGhpcy53YWxrX2N5Y2xlX2luZGV4ICsgKDAuMDMgKiB0aGlzLnNwZWVkKSkgJSAzXG4gICAgICB0aGlzLmdvLmNhbWVyYS5mb2N1cyh0aGlzKVxuICAgIH1cbiAgfVxuXG4gIC8vIEV4cGVyaW1lbnRzXG5cbiAgQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gfVxuICBBcnJheS5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzWzBdIH1cblxuICB0aGlzLmRyYXdfbW92ZW1lbnRfdGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldF9tb3ZlbWVudCA9IHRoaXMudGFyZ2V0X21vdmVtZW50KSB7XG4gICAgdGhpcy5nby5jdHguYmVnaW5QYXRoKClcbiAgICB0aGlzLmdvLmN0eC5hcmMoKHRhcmdldF9tb3ZlbWVudC54IC0gdGhpcy5nby5jYW1lcmEueCkgKyAxMCwgKHRhcmdldF9tb3ZlbWVudC55IC0gdGhpcy5nby5jYW1lcmEueSkgKyAxMCwgMjAsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicHVycGxlXCJcbiAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA0O1xuICAgIHRoaXMuZ28uY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvLyBBVVRPLU1PVkUgKHBhdGhmaW5kZXIpIC0tIHJlbmFtZSBpdCB0byBtb3ZlIHdoZW4gdXNpbmcgcGxheWdyb3VuZFxuICB0aGlzLmF1dG9fbW92ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3ZlbWVudF9ib2FyZC5sZW5ndGggPT09IDApIHsgdGhpcy5tb3ZlbWVudF9ib2FyZCA9IFtdLmNvbmNhdCh0aGlzLmdvLmJvYXJkLmdyaWQpIH1cbiAgICB0aGlzLmdvLmJvYXJkLm1vdmUodGhpcywgdGhpcy5nby5ib2FyZC50YXJnZXRfbm9kZSlcbiAgfVxuXG4gIC8vIFN0b3JlcyB0aGUgdGVtcG9yYXJ5IHRhcmdldCBvZiB0aGUgbW92ZW1lbnQgYmVpbmcgZXhlY3V0ZWRcbiAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSBudWxsXG4gIC8vIFN0b3JlcyB0aGUgcGF0aCBiZWluZyBjYWxjdWxhdGVkXG4gIHRoaXMuY3VycmVudF9wYXRoID0gW11cblxuICB0aGlzLmZpbmRfcGF0aCA9ICh0YXJnZXRfbW92ZW1lbnQpID0+IHtcbiAgICB0aGlzLmN1cnJlbnRfcGF0aCA9IFtdXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy50YXJnZXRfbW92ZW1lbnQgPSB0YXJnZXRfbW92ZW1lbnRcblxuICAgIGlmICh0aGlzLmN1cnJlbnRfcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5jdXJyZW50X3BhdGgucHVzaCh7IHg6IHRoaXMueCArIHRoaXMuc3BlZWQsIHk6IHRoaXMueSArIHRoaXMuc3BlZWQgfSlcbiAgICB9XG5cbiAgICB2YXIgbGFzdF9zdGVwID0ge31cbiAgICB2YXIgZnV0dXJlX21vdmVtZW50ID0ge31cblxuICAgIGRvIHtcbiAgICAgIGxhc3Rfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoW3RoaXMuY3VycmVudF9wYXRoLmxlbmd0aCAtIDFdXG4gICAgICBmdXR1cmVfbW92ZW1lbnQgPSB7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH1cblxuICAgICAgLy8gVGhpcyBjb2RlIHdpbGwga2VlcCB0cnlpbmcgdG8gZ28gYmFjayB0byB0aGUgc2FtZSBwcmV2aW91cyBmcm9tIHdoaWNoIHdlIGp1c3QgYnJhbmNoZWQgb3V0XG4gICAgICBpZiAoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgICAgaWYgKGxhc3Rfc3RlcC54ID4gdGFyZ2V0X21vdmVtZW50LngpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueCA9IGxhc3Rfc3RlcC54IC0gdGhpcy5zcGVlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnggKyB0aGlzLnNwZWVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgICBpZiAobGFzdF9zdGVwLnkgPiB0YXJnZXRfbW92ZW1lbnQueSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnkgLSB0aGlzLnNwZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnV0dXJlX21vdmVtZW50LnkgPSBsYXN0X3N0ZXAueSArIHRoaXMuc3BlZWRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnV0dXJlX21vdmVtZW50LnggPT09IHVuZGVmaW5lZClcbiAgICAgICAgZnV0dXJlX21vdmVtZW50LnggPSBsYXN0X3N0ZXAueFxuICAgICAgaWYgKGZ1dHVyZV9tb3ZlbWVudC55ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gbGFzdF9zdGVwLnlcblxuICAgICAgLy8gVGhpcyBpcyBwcmV0dHkgaGVhdnkuLi4gSXQncyBjYWxjdWxhdGluZyBhZ2FpbnN0IGFsbCB0aGUgYml0cyBpbiB0aGUgbWFwID1bXG4gICAgICB2YXIgZ29pbmdfdG9fY29sbGlkZSA9IHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpXG4gICAgICBpZiAoZ29pbmdfdG9fY29sbGlkZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ29sbGlzaW9uIGFoZWFkIScpXG4gICAgICAgIHZhciBuZXh0X21vdmVtZW50ID0geyAuLi5mdXR1cmVfbW92ZW1lbnQgfVxuICAgICAgICBuZXh0X21vdmVtZW50LnggPSBuZXh0X21vdmVtZW50LnggLSB0aGlzLnNwZWVkXG4gICAgICAgIGlmICh0aGlzLmVkaXRvci5iaXRtYXAuc29tZSgoYml0KSA9PiBpc19jb2xsaWRpbmcobmV4dF9tb3ZlbWVudCwgYml0KSkpIHtcbiAgICAgICAgICBmdXR1cmVfbW92ZW1lbnQueSA9IGxhc3Rfc3RlcC55XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYW50IG1vdmUgb24gWVwiKVxuICAgICAgICB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQgPSB7IC4uLmZ1dHVyZV9tb3ZlbWVudCB9XG4gICAgICAgIG5leHRfbW92ZW1lbnQueSA9IG5leHRfbW92ZW1lbnQueSAtIHRoaXMuc3BlZWRcbiAgICAgICAgaWYgKHRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhuZXh0X21vdmVtZW50LCBiaXQpKSkge1xuICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gbGFzdF9zdGVwLnhcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbnQgbW92ZSBYXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudF9wYXRoLnB1c2goeyAuLi5mdXR1cmVfbW92ZW1lbnQgfSlcbiAgICB9IHdoaWxlICgoZGlzdGFuY2UobGFzdF9zdGVwLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHx8IChkaXN0YW5jZShsYXN0X3N0ZXAueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkpXG5cbiAgICB0aGlzLm1vdmluZyA9IHRydWVcbiAgfVxuXG4gIHRoaXMubW92ZV9vbl9wYXRoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdmFyIG5leHRfc3RlcCA9IHRoaXMuY3VycmVudF9wYXRoLnNoaWZ0KClcbiAgICAgIGlmIChuZXh0X3N0ZXApIHtcbiAgICAgICAgdGhpcy54ID0gbmV4dF9zdGVwLnhcbiAgICAgICAgdGhpcy55ID0gbmV4dF9zdGVwLnlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50X3BhdGggPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMubW92ZW1lbnRfYm9hcmQgPSBbXVxuXG4gIHRoaXMubW92ZV90b193YXlwb2ludCA9ICh3cF9uYW1lKSA9PiB7XG4gICAgbGV0IHdwID0gdGhpcy5nby5lZGl0b3Iud2F5cG9pbnRzLmZpbmQoKHdwKSA9PiB3cC5uYW1lID09PSB3cF9uYW1lKVxuICAgIGxldCBub2RlID0gdGhpcy5nby5ib2FyZC5ncmlkW3dwLmlkXVxuICAgIHRoaXMuY29vcmRzKG5vZGUpXG4gIH1cblxuICB0aGlzLmNvb3JkcyA9IGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICB0aGlzLnggPSBjb29yZHMueFxuICAgIHRoaXMueSA9IGNvb3Jkcy55XG4gIH1cblxuICAvL3RoaXMubW92ZSA9IGZ1bmN0aW9uKHRhcmdldF9tb3ZlbWVudCkge1xuICAvLyAgaWYgKHRoaXMubW92aW5nKSB7XG4gIC8vICAgIHZhciBmdXR1cmVfbW92ZW1lbnQgPSB7IHg6IHRoaXMueCwgeTogdGhpcy55IH1cblxuICAvLyAgICBpZiAoKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZSh0aGlzLnksIHRhcmdldF9tb3ZlbWVudC55KSA8PSAxKSkge1xuICAvLyAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gIC8vICAgICAgdGFyZ2V0X21vdmVtZW50ID0ge31cbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgdGhpcy5kcmF3X21vdmVtZW50X3RhcmdldCh0YXJnZXRfbW92ZW1lbnQpXG5cbiAgLy8gICAgICAvLyBQYXRoaW5nXG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueCwgdGFyZ2V0X21vdmVtZW50LngpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC54ID0gdGhpcy54ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgICAgaWYgKGRpc3RhbmNlKHRoaXMueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAvLyAgICAgICAgaWYgKHRoaXMueSA+IHRhcmdldF9tb3ZlbWVudC55KSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55IC0gMjtcbiAgLy8gICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgIGZ1dHVyZV9tb3ZlbWVudC55ID0gdGhpcy55ICsgMjtcbiAgLy8gICAgICAgIH1cbiAgLy8gICAgICB9XG4gIC8vICAgIH1cblxuICAvLyAgICBmdXR1cmVfbW92ZW1lbnQud2lkdGggPSB0aGlzLndpZHRoXG4gIC8vICAgIGZ1dHVyZV9tb3ZlbWVudC5oZWlnaHQgPSB0aGlzLmhlaWdodFxuXG4gIC8vICAgIGlmICgodGhpcy5nby5lbnRpdGllcy5ldmVyeSgoZW50aXR5KSA9PiBlbnRpdHkuaWQgPT09IHRoaXMuaWQgfHwgIWlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGVudGl0eSkgKSkgJiZcbiAgLy8gICAgICAoIXRoaXMuZWRpdG9yLmJpdG1hcC5zb21lKChiaXQpID0+IGlzX2NvbGxpZGluZyhmdXR1cmVfbW92ZW1lbnQsIGJpdCkpKSkge1xuICAvLyAgICAgIHRoaXMueCA9IGZ1dHVyZV9tb3ZlbWVudC54XG4gIC8vICAgICAgdGhpcy55ID0gZnV0dXJlX21vdmVtZW50LnlcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBjb25zb2xlLmxvZyhcIkJsb2NrZWRcIik7XG4gIC8vICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZVxuICAvLyAgICB9XG4gIC8vICB9XG4gIC8vICAvLyBFTkQgLSBDaGFyYWN0ZXIgTW92ZW1lbnRcbiAgLy99XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2xpY2thYmxlKGdvLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZV9zcmMpIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY2xpY2thYmxlcy5wdXNoKHRoaXMpXG5cbiAgdGhpcy5uYW1lID0gaW1hZ2Vfc3JjXG4gIHRoaXMueCA9IHhcbiAgdGhpcy55ID0geVxuICB0aGlzLndpZHRoID0gd2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpXG4gIHRoaXMuaW1hZ2Uuc3JjID0gaW1hZ2Vfc3JjXG4gIHRoaXMuYWN0aXZhdGVkID0gZmFsc2VcbiAgdGhpcy5wYWRkaW5nID0gNVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgdGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQsIHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCJcbiAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54IC0gdGhpcy5wYWRkaW5nLCB0aGlzLnkgLSB0aGlzLnBhZGRpbmcsIHRoaXMud2lkdGggKyAoMip0aGlzLnBhZGRpbmcpLCB0aGlzLmhlaWdodCArICgyKnRoaXMucGFkZGluZykpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNsaWNrXCIpXG4gIH1cbn1cbiIsImltcG9ydCBDbGlja2FibGUgZnJvbSBcIi4vY2xpY2thYmxlLmpzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udHJvbHMoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uY29udHJvbHMgPSB0aGlzXG4gIHRoaXMud2lkdGggPSBzY3JlZW4ud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBzY3JlZW4uaGVpZ2h0ICogMC40XG4gIHRoaXMuYXJyb3dzID0ge1xuICAgIHVwOiBuZXcgQ2xpY2thYmxlKGdvLCAodGhpcy53aWR0aCAvIDIpIC0gKDgwIC8gMiksIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgMTAsIDgwLCA4MCwgXCJhcnJvd191cC5wbmdcIiksXG4gICAgbGVmdDogbmV3IENsaWNrYWJsZShnbywgNTAsIChzY3JlZW4uaGVpZ2h0IC0gdGhpcy5oZWlnaHQpICsgNjAsIDgwLCA4MCwgXCJhcnJvd19sZWZ0LnBuZ1wiKSxcbiAgICByaWdodDogbmV3IENsaWNrYWJsZShnbywgKHRoaXMud2lkdGggLyAyKSArIDcwLCAoc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSArIDYwLCA4MCwgODAsIFwiYXJyb3dfcmlnaHQucG5nXCIpLFxuICAgIGRvd246IG5ldyBDbGlja2FibGUoZ28sICh0aGlzLndpZHRoIC8gMikgLSAoODAgLyAyKSwgKHNjcmVlbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKyAxMjAsIDgwLCA4MCwgXCJhcnJvd19kb3duLnBuZ1wiKSxcbiAgfVxuICB0aGlzLmFycm93cy51cC5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwidXBcIilcbiAgdGhpcy5hcnJvd3MuZG93bi5jbGljayA9ICgpID0+IGdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKVxuICB0aGlzLmFycm93cy5sZWZ0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJsZWZ0XCIpXG4gIHRoaXMuYXJyb3dzLnJpZ2h0LmNsaWNrID0gKCkgPT4gZ28uY2hhcmFjdGVyLm1vdmUoXCJyaWdodFwiKVxuXG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVwiXG4gICAgdGhpcy5nby5jdHguZmlsbFJlY3QoMCwgc2NyZWVuLmhlaWdodCAtIHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuYXJyb3dzKS5mb3JFYWNoKGFycm93ID0+IGFycm93LmRyYXcoKSlcbiAgfVxufVxuIiwiZnVuY3Rpb24gRG9vZGFkKHsgZ28gfSkge1xuICB0aGlzLmdvID0gZ29cblxuICB0aGlzLnggPSAwO1xuICB0aGlzLnkgPSAwO1xuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gIHRoaXMuaW1hZ2Uuc3JjID0gXCJwbGFudHMucG5nXCJcbiAgdGhpcy5pbWFnZV93aWR0aCA9IDMyXG4gIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gMzJcbiAgdGhpcy5pbWFnZV94X29mZnNldCA9IDBcbiAgdGhpcy5pbWFnZV95X29mZnNldCA9IDBcbiAgdGhpcy53aWR0aCA9IDMyXG4gIHRoaXMuaGVpZ2h0ID0gMzJcbiAgdGhpcy5yZXNvdXJjZV9iYXIgPSBudWxsXG5cbiAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKHRhcmdldF9wb3NpdGlvbikge1xuICAgIGxldCB4ID0gdGFyZ2V0X3Bvc2l0aW9uICYmIHRhcmdldF9wb3NpdGlvbi54ID8gdGFyZ2V0X3Bvc2l0aW9uLnggOiB0aGlzLnggLSB0aGlzLmdvLmNhbWVyYS54XG4gICAgbGV0IHkgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLnkgPyB0YXJnZXRfcG9zaXRpb24ueSA6IHRoaXMueSAtIHRoaXMuZ28uY2FtZXJhLnlcbiAgICBsZXQgd2lkdGggPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLndpZHRoID8gdGFyZ2V0X3Bvc2l0aW9uLndpZHRoIDogdGhpcy53aWR0aFxuICAgIGxldCBoZWlnaHQgPSB0YXJnZXRfcG9zaXRpb24gJiYgdGFyZ2V0X3Bvc2l0aW9uLmhlaWdodCA/IHRhcmdldF9wb3NpdGlvbi5oZWlnaHQgOiB0aGlzLmhlaWdodFxuICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLmltYWdlX3hfb2Zmc2V0LCB0aGlzLmltYWdlX3lfb2Zmc2V0LCB0aGlzLmltYWdlX3dpZHRoLCB0aGlzLmltYWdlX2hlaWdodCwgeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICBpZiAodGFyZ2V0X3Bvc2l0aW9uKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnJlc291cmNlX2Jhcikge1xuICAgICAgdGhpcy5yZXNvdXJjZV9iYXIuZHJhdygpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jbGljayA9IGZ1bmN0aW9uICgpIHsgfVxuICB0aGlzLnVwZGF0ZV9mcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZnVlbCA8PSAwKSB7XG4gICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgZ28uZmlyZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnVlbCAtPSAxO1xuICAgICAgdGhpcy5yZXNvdXJjZV9iYXIuY3VycmVudCAtPSAxO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEb29kYWQ7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFZGl0b3IoeyBnbyB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5sZWZ0X3BhbmVsX2Nvb3JkcyA9IHtcbiAgICAgICAgeDogdGhpcy5nby5zY3JlZW4ud2lkdGggLSAzMDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogdGhpcy5nby5zY3JlZW4uaGVpZ2h0XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMubGVmdF9wYW5lbF9jb29yZHMueCwgdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy55LCB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLndpZHRoLCB0aGlzLmdvLnNjcmVlbi5oZWlnaHQpXG4gICAgICAgIHRoaXMuZ28uY2hhcmFjdGVyLmRyYXdfY2hhcmFjdGVyKHtcbiAgICAgICAgICAgIHg6IHRoaXMubGVmdF9wYW5lbF9jb29yZHMueCArICh0aGlzLmxlZnRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGhpcy5nby5jaGFyYWN0ZXIud2lkdGggLyAyKSxcbiAgICAgICAgICAgIHk6IDUwLFxuICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MFxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuZ28uY3R4LmZvbnQgPSBcIjIxcHggc2Fucy1zZXJpZlwiXG4gICAgICAgIGxldCB0ZXh0ID0gYHg6ICR7dGhpcy5nby5jaGFyYWN0ZXIueC50b0ZpeGVkKDIpfSwgeTogJHt0aGlzLmdvLmNoYXJhY3Rlci55LnRvRml4ZWQoMil9YFxuICAgICAgICB2YXIgdGV4dF9tZWFzdXJlbWVudCA9IHRoaXMuZ28uY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxUZXh0KHRleHQsIHRoaXMubGVmdF9wYW5lbF9jb29yZHMueCArICh0aGlzLmxlZnRfcGFuZWxfY29vcmRzLndpZHRoIC8gMikgLSAodGV4dF9tZWFzdXJlbWVudC53aWR0aCAvIDIpLCB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLnkgKyA1MCArIDUwICsgMjApXG5cbiAgICAgICAgaWYgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlKSB0aGlzLmRyYXdfc2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3X3NlbGVjdGlvbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUuZHJhdyh7XG4gICAgICAgICAgICB4OiB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLnggKyB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLndpZHRoIC8gMiAtIDM1LFxuICAgICAgICAgICAgeTogdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwLFxuICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgaGVpZ2h0OiA3MFxuICAgICAgICB9KVxuICAgICAgICBsZXQgdGV4dCA9IGB4OiAke3RoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueS50b0ZpeGVkKDIpfWBcbiAgICAgICAgdmFyIHRleHRfbWVhc3VyZW1lbnQgPSB0aGlzLmdvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KVxuICAgICAgICB0aGlzLmdvLmN0eC5maWxsVGV4dCh0ZXh0LCB0aGlzLmxlZnRfcGFuZWxfY29vcmRzLnggKyAodGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy53aWR0aCAvIDIpIC0gKHRleHRfbWVhc3VyZW1lbnQud2lkdGggLyAyKSwgdGhpcy5sZWZ0X3BhbmVsX2Nvb3Jkcy55ICsgMjAwICsgMTAwKVxuICAgIH1cbn0iLCIvLyBUaGUgY2FsbGJhY2tzIHN5c3RlbVxuLy8gXG4vLyBUbyB1c2UgaXQ6XG4vL1xuLy8gKiBpbXBvcnQgdGhlIGNhbGxiYWNrcyB5b3Ugd2FudFxuLy9cbi8vICAgIGltcG9ydCB7IHNldE1vdXNlbW92ZUNhbGxiYWNrIH0gZnJvbSBcIi4vZXZlbnRzX2NhbGxiYWNrcy5qc1wiXG4vL1xuLy8gKiBjYWxsIHRoZW0gYW5kIHN0b3JlIHRoZSBhcnJheSBvZiBjYWxsYmFjayBmdW5jdGlvbnNcbi8vXG4vLyAgICBjb25zdCBtb3VzZW1vdmVfY2FsbGJhY2tzID0gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pO1xuLy9cbi8vICogYWRkIG9yIHJlbW92ZSBjYWxsYmFja3MgZnJvbSBhcnJheVxuLy9cbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaChnby5jYW1lcmEubW92ZV9jYW1lcmFfd2l0aF9tb3VzZSlcbi8vICAgIG1vdXNlbW92ZV9jYWxsYmFja3MucHVzaCh0cmFja19tb3VzZV9wb3NpdGlvbilcblxuZnVuY3Rpb24gc2V0TW91c2Vtb3ZlQ2FsbGJhY2soZ28pIHtcbiAgY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IFtdXG4gIGNvbnN0IG9uX21vdXNlbW92ZSA9IChldikgPT4ge1xuICAgIG1vdXNlbW92ZV9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25fbW91c2Vtb3ZlLCBmYWxzZSlcbiAgcmV0dXJuIG1vdXNlbW92ZV9jYWxsYmFja3M7XG59XG5cblxuZnVuY3Rpb24gc2V0Q2xpY2tDYWxsYmFjayhnbykge1xuICBjb25zdCBjbGlja19jYWxsYmFja3MgPSBbXVxuICBjb25zdCBvbl9jbGljayAgPSAoZXYpID0+IHtcbiAgICBjbGlja19jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2KVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fY2xpY2ssIGZhbHNlKVxuICByZXR1cm4gY2xpY2tfY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRDYWxsYmFjayhnbywgZXZlbnQpIHtcbiAgY29uc3QgY2FsbGJhY2tzID0gW11cbiAgY29uc3QgaGFuZGxlciA9IChlKSA9PiB7XG4gICAgY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhlKVxuICAgIH0pXG4gIH1cbiAgZ28uY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKVxuICByZXR1cm4gY2FsbGJhY2tzO1xufVxuXG5mdW5jdGlvbiBzZXRNb3VzZU1vdmVDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZW1vdmUnKTtcbn1cblxuZnVuY3Rpb24gc2V0TW91c2Vkb3duQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAnbW91c2Vkb3duJyk7XG59XG5cbmZ1bmN0aW9uIHNldE1vdXNldXBDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICdtb3VzZXVwJyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbykge1xuICByZXR1cm4gc2V0Q2FsbGJhY2soZ28sICd0b3VjaHN0YXJ0Jyk7XG59XG5cbmZ1bmN0aW9uIHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pIHtcbiAgcmV0dXJuIHNldENhbGxiYWNrKGdvLCAndG91Y2hlbmQnKTtcbn1cblxuZXhwb3J0IHtcbiAgc2V0TW91c2Vtb3ZlQ2FsbGJhY2ssXG4gIHNldENsaWNrQ2FsbGJhY2ssXG4gIHNldE1vdXNlTW92ZUNhbGxiYWNrLFxuICBzZXRNb3VzZWRvd25DYWxsYmFjayxcbiAgc2V0TW91c2V1cENhbGxiYWNrLFxuICBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2ssXG4gIHNldFRvdWNoZW5kQ2FsbGJhY2ssXG59O1xuIiwiLy8gVGhlIEdhbWUgTG9vcFxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGNvbnN0IGdhbWVfbG9vcCA9IG5ldyBHYW1lTG9vcCgpXG4vLyBnYW1lX2xvb3AuZHJhdyA9IGRyYXdcbi8vIGdhbWVfbG9vcC5wcm9jZXNzX2tleXNfZG93biA9IHByb2Nlc3Nfa2V5c19kb3duXG4vLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcC5sb29wLmJpbmQoZ2FtZV9sb29wKSk7XG5cbmZ1bmN0aW9uIEdhbWVMb29wKCkge1xuICB0aGlzLmRyYXcgPSBudWxsXG4gIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24gPSBudWxsXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge31cbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucHJvY2Vzc19rZXlzX2Rvd24oKVxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgdGhpcy5kcmF3KClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUxvb3BcbiIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4nKVxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcblxuZnVuY3Rpb24gR2FtZU9iamVjdCgpIHtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXNcbiAgdGhpcy5jYW52YXNfcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy5jYW52YXNfcmVjdC53aWR0aCk7XG4gIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5jYW52YXNfcmVjdC5oZWlnaHQpO1xuICB0aGlzLmN0eCA9IGN0eFxuICB0aGlzLnRpbGVfc2l6ZSA9IDIwXG4gIHRoaXMuY2xpY2thYmxlcyA9IFtdXG4gIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlID0gbnVsbFxuICB0aGlzLnNwZWxscyA9IFtdIC8vIFNwZWxsIHN5c3RlbSwgY291bGQgYmUgaW5qZWN0ZWQgYnkgaXQgYXMgd2VsbFxuICB0aGlzLnNraWxscyA9IFtdO1xuICB0aGlzLnRyZWVzID0gW107XG4gIHRoaXMuZmlyZXMgPSBbXTtcbiAgdGhpcy5zdG9uZXMgPSBbXTtcbiAgdGhpcy5tYW5hZ2VkX29iamVjdHMgPSBbXSAvLyBSYW5kb20gb2JqZWN0cyB0byBkcmF3L3VwZGF0ZVxuICB0aGlzLmRyYXdfc2VsZWN0ZWRfY2xpY2thYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgICAgdGhpcy5jdHguc2F2ZSgpXG4gICAgICB0aGlzLmN0eC5zaGFkb3dCbHVyID0gMTA7XG4gICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSBcInllbGxvd1wiXG4gICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMCwgMC43KVwiXG4gICAgICB0aGlzLmN0eC5zdHJva2VSZWN0KFxuICAgICAgICB0aGlzLnNlbGVjdGVkX2NsaWNrYWJsZS54IC0gdGhpcy5jYW1lcmEueCAtIDUsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnkgLSB0aGlzLmNhbWVyYS55IC0gNSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggKyAxMCxcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9jbGlja2FibGUuaGVpZ2h0ICsgKHRoaXMuc2VsZWN0ZWRfY2xpY2thYmxlLnJlc291cmNlX2JhciA/IDIwIDogMTApKTtcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZU9iamVjdCIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludmVudG9yeSh7IGdvIH0pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMubWF4X3Nsb3RzID0gMTJcbiAgdGhpcy5zbG90c19wZXJfcm93ID0gNFxuICB0aGlzLnNsb3RzID0gW11cbiAgdGhpcy5zbG90X3BhZGRpbmcgPSAxMFxuICB0aGlzLnNsb3Rfd2lkdGggPSA1MFxuICB0aGlzLnNsb3RfaGVpZ2h0ID0gNTBcbiAgdGhpcy5pbml0aWFsX3ggPSB0aGlzLmdvLnNjcmVlbi53aWR0aCAtICh0aGlzLnNsb3RzX3Blcl9yb3cgKiB0aGlzLnNsb3Rfd2lkdGgpIC0gNTA7XG4gIHRoaXMuaW5pdGlhbF95ID0gdGhpcy5nby5zY3JlZW4uaGVpZ2h0IC0gKHRoaXMuc2xvdHNfcGVyX3JvdyAqIHRoaXMuc2xvdF9oZWlnaHQpIC0gNDAwO1xuICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIHRoaXMuYWRkID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZ19idW5kbGUgPSB0aGlzLnNsb3RzLmZpbmQoKGJ1bmRsZSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1bmRsZS5uYW1lID09IGl0ZW0ubmFtZVxuICAgIH0pXG5cbiAgICBpZiAoKHRoaXMuc2xvdHMubGVuZ3RoID49IHRoaXMubWF4X3Nsb3RzKSAmJiAoIWV4aXN0aW5nX2J1bmRsZSkpIHJldHVyblxuXG4gICAgY29uc29sZS5sb2coYCoqKiBHb3QgJHtpdGVtLnF1YW50aXR5fSAke2l0ZW0ubmFtZX1gKVxuICAgIGlmIChleGlzdGluZ19idW5kbGUpIHtcbiAgICAgIGV4aXN0aW5nX2J1bmRsZS5xdWFudGl0eSArPSBpdGVtLnF1YW50aXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2xvdHMucHVzaChpdGVtKVxuICAgIH1cbiAgfVxuICB0aGlzLmZpbmQgPSAoaXRlbV9uYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2xvdHMuZmluZCgoYnVuZGxlKSA9PiB7XG4gICAgICByZXR1cm4gYnVuZGxlLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBpdGVtX25hbWUudG9Mb3dlckNhc2UoKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnRvZ2dsZV9kaXNwbGF5ID0gKCkgPT4ge1xuICAgIHRoaXMuYWN0aXZlID0gIXRoaXMuYWN0aXZlO1xuICB9XG5cbiAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXhfc2xvdHM7IGkrKykge1xuICAgICAgbGV0IHggPSBNYXRoLmZsb29yKGkgJSA0KVxuICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkgLyA0KTtcblxuICAgICAgaWYgKCh0aGlzLnNsb3RzW2ldICE9PSB1bmRlZmluZWQpICYmICh0aGlzLnNsb3RzW2ldICE9PSBudWxsKSkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zbG90c1tpXTtcbiAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGl0ZW0uaW1hZ2UsIHRoaXMuaW5pdGlhbF94ICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMuaW5pdGlhbF94ICsgKHRoaXMuc2xvdF93aWR0aCAqIHgpICsgKHggKiB0aGlzLnNsb3RfcGFkZGluZyksIHRoaXMuaW5pdGlhbF95ICsgKHRoaXMuc2xvdF9oZWlnaHQgKiB5KSArICh0aGlzLnNsb3RfcGFkZGluZyAqIHkpLCB0aGlzLnNsb3Rfd2lkdGgsIHRoaXMuc2xvdF9oZWlnaHQpXG4gICAgICB9XG4gICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDYwLCA0MCwgMClcIlxuICAgICAgdGhpcy5nby5jdHguc3Ryb2tlUmVjdCh0aGlzLmluaXRpYWxfeCArICh0aGlzLnNsb3Rfd2lkdGggKiB4KSArICh4ICogdGhpcy5zbG90X3BhZGRpbmcpLCB0aGlzLmluaXRpYWxfeSArICh0aGlzLnNsb3RfaGVpZ2h0ICogeSkgKyAodGhpcy5zbG90X3BhZGRpbmcgKiB5KSwgdGhpcy5zbG90X3dpZHRoLCB0aGlzLnNsb3RfaGVpZ2h0KVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXRlbShuYW1lLCBpbWFnZSwgcXVhbnRpdHkgPSAxLCBzcmNfaW1hZ2UpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICBpZiAoaW1hZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gc3JjX2ltYWdlXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlXG4gIH1cbiAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5XG59XG4iLCJmdW5jdGlvbiBLZXlib2FyZElucHV0KGdvKSB7XG4gIGNvbnN0IG9uX2tleWRvd24gPSAoZXYpID0+IHtcbiAgICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25bZXYua2V5XSA9IHRydWVcbiAgICAvLyBUaGVzZSBhcmUgY2FsbGJhY2tzIHRoYXQgb25seSBnZXQgY2hlY2tlZCBvbmNlIG9uIHRoZSBldmVudFxuICAgIGlmICh0aGlzLm9uX2tleWRvd25fY2FsbGJhY2tzW2V2LmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldID0gW11cbiAgICB9XG4gICAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrc1tldi5rZXldLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhldikpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uX2tleWRvd24sIGZhbHNlKVxuICBjb25zdCBvbl9rZXl1cCA9IChldikgPT4ge1xuICAgIHRoaXMua2V5c19jdXJyZW50bHlfZG93bltldi5rZXldID0gZmFsc2VcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uX2tleXVwLCBmYWxzZSlcblxuICB0aGlzLmdvID0gZ287XG4gIHRoaXMuZ28ua2V5Ym9hcmRfaW5wdXQgPSB0aGlzXG4gIHRoaXMua2V5X2NhbGxiYWNrcyA9IHtcbiAgICBkOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInJpZ2h0XCIpXSxcbiAgICB3OiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcInVwXCIpXSxcbiAgICBhOiBbKCkgPT4gdGhpcy5nby5jaGFyYWN0ZXIubW92ZShcImxlZnRcIildLFxuICAgIHM6IFsoKSA9PiB0aGlzLmdvLmNoYXJhY3Rlci5tb3ZlKFwiZG93blwiKV0sXG4gIH1cbiAgdGhpcy5vbl9rZXlkb3duX2NhbGxiYWNrcyA9IHtcbiAgICAxOiBbXVxuICB9XG5cbiAgdGhpcy5wcm9jZXNzX2tleXNfZG93biA9ICgpID0+IHtcbiAgICBjb25zdCBrZXlzX2Rvd24gPSBPYmplY3Qua2V5cyh0aGlzLmtleXNfY3VycmVudGx5X2Rvd24pLmZpbHRlcigoa2V5KSA9PiB0aGlzLmtleXNfY3VycmVudGx5X2Rvd25ba2V5XSA9PT0gdHJ1ZSlcbiAgICBrZXlzX2Rvd24uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoIShPYmplY3Qua2V5cyh0aGlzLmtleV9jYWxsYmFja3MpLmluY2x1ZGVzKGtleSkpKSByZXR1cm5cblxuICAgICAgdGhpcy5rZXlfY2FsbGJhY2tzW2tleV0uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMua2V5bWFwID0ge1xuICAgIGQ6IFwicmlnaHRcIixcbiAgICB3OiBcInVwXCIsXG4gICAgYTogXCJsZWZ0XCIsXG4gICAgczogXCJkb3duXCIsXG4gIH1cblxuICB0aGlzLmtleXNfY3VycmVudGx5X2Rvd24gPSB7XG4gICAgZDogZmFsc2UsXG4gICAgdzogZmFsc2UsXG4gICAgYTogZmFsc2UsXG4gICAgczogZmFsc2UsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2V5Ym9hcmRJbnB1dDtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3Qge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW0sIHF1YW50aXR5ID0gMSkge1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eVxuICAgIH1cbn0iLCJpbXBvcnQgeyBWZWN0b3IyLCByYW5kb20sIGRpY2UgfSBmcm9tIFwiLi90YXBldGVcIlxuaW1wb3J0IEl0ZW0gZnJvbSBcIi4vaXRlbVwiXG5pbXBvcnQgTG9vdCBmcm9tIFwiLi9sb290XCJcblxuY2xhc3MgTG9vdEJveCB7XG4gICAgY29uc3RydWN0b3IoZ28pIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgdGhpcy5nbyA9IGdvXG4gICAgICAgIGdvLmxvb3RfYm94ID0gdGhpc1xuICAgICAgICB0aGlzLml0ZW1zID0gW11cbiAgICAgICAgdGhpcy54ID0gMFxuICAgICAgICB0aGlzLnkgPSAwXG4gICAgICAgIHRoaXMud2lkdGggPSAzNTBcbiAgICB9XG5cbiAgICBkcmF3KCkge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgbW92ZXMgYXdheSwgZGVsZXRlIGl0ZW1zIGFuZCBoaWRlIGxvb3QgYm94IHNjcmVlblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCB0aGlzLmdvLmNoYXJhY3RlcikgPiA1MDApIHx8XG4gICAgICAgICAgICAodGhpcy5pdGVtcy5sZW5ndGggPD0gMClcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSlcIjtcbiAgICAgICAgdGhpcy5nby5jdHgubGluZUpvaW4gPSAnYmV2ZWwnO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDIwMCwgMjU1LCAwLjUpXCI7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCArIDIwIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy55ICsgMjAgLSB0aGlzLmdvLmNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLml0ZW1zLmxlbmd0aCAqIDYwICsgNSk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgbG9vdCA9IHRoaXMuaXRlbXNbaW5kZXhdXG4gICAgICAgICAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiXG4gICAgICAgICAgICBsb290LnggPSB0aGlzLnggKyAyNSAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICAgICAgICAgIGxvb3QueSA9IHRoaXMueSArIChpbmRleCAqIDYwKSArIDI1IC0gdGhpcy5nby5jYW1lcmEueVxuICAgICAgICAgICAgbG9vdC53aWR0aCA9IDM0MFxuICAgICAgICAgICAgbG9vdC5oZWlnaHQgPSA1NVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFJlY3QobG9vdC54LCBsb290LnksIGxvb3Qud2lkdGgsIGxvb3QuaGVpZ2h0KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZHJhd0ltYWdlKGxvb3QuaXRlbS5pbWFnZSwgbG9vdC54ICsgNSwgbG9vdC55ICsgNSwgNDUsIDQ1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxuICAgICAgICAgICAgdGhpcy5nby5jdHguZm9udCA9ICcyMnB4IHNlcmlmJ1xuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5xdWFudGl0eSwgbG9vdC54ICsgNjUsIGxvb3QueSArIDM1KVxuICAgICAgICAgICAgdGhpcy5nby5jdHguZmlsbFRleHQobG9vdC5pdGVtLm5hbWUsIGxvb3QueCArIDEwMCwgbG9vdC55ICsgMzUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlXG4gICAgICAgIHRoaXMueCA9IHRoaXMuZ28uY2hhcmFjdGVyLnhcbiAgICAgICAgdGhpcy55ID0gdGhpcy5nby5jaGFyYWN0ZXIueVxuICAgIH1cblxuICAgIHRha2VfbG9vdChsb290X2luZGV4KSB7XG4gICAgICAgIGxldCBsb290ID0gdGhpcy5pdGVtcy5zcGxpY2UobG9vdF9pbmRleCwgMSlbMF1cbiAgICAgICAgdGhpcy5nby5jaGFyYWN0ZXIuaW52ZW50b3J5LmFkZChsb290Lml0ZW0pXG4gICAgfVxuXG4gICAgY2hlY2tfaXRlbV9jbGlja2VkKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm5cblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgobG9vdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WCA+PSBsb290LngpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFggPD0gbG9vdC54ICsgbG9vdC53aWR0aCkgJiZcbiAgICAgICAgICAgICAgICAoZXYuY2xpZW50WSA+PSBsb290LnkpICYmXG4gICAgICAgICAgICAgICAgKGV2LmNsaWVudFkgPD0gbG9vdC55ICsgbG9vdC5oZWlnaHQpXG4gICAgICAgICAgICApXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudGFrZV9sb290KGluZGV4KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcm9sbF9sb290KGxvb3RfdGFibGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGxvb3RfdGFibGUubWFwKChsb290X2VudHJ5KSA9PiB7XG4gICAgICAgICAgICBsZXQgcm9sbCA9IGRpY2UoMTAwKVxuICAgICAgICAgICAgaWYgKHJvbGwgPD0gbG9vdF9lbnRyeS5jaGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtX2J1bmRsZSA9IG5ldyBJdGVtKGxvb3RfZW50cnkuaXRlbS5uYW1lKVxuICAgICAgICAgICAgICAgIGl0ZW1fYnVuZGxlLmltYWdlLnNyYyA9IGxvb3RfZW50cnkuaXRlbS5pbWFnZV9zcmNcbiAgICAgICAgICAgICAgICBpdGVtX2J1bmRsZS5xdWFudGl0eSA9IHJhbmRvbShsb290X2VudHJ5Lm1pbiwgbG9vdF9lbnRyeS5tYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMb290KGl0ZW1fYnVuZGxlLCBpdGVtX2J1bmRsZS5xdWFudGl0eSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMb290Qm94IiwiZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gIHRoaXMuaWQgPSBkYXRhLmlkXG4gIHRoaXMueCA9IGRhdGEueFxuICB0aGlzLnkgPSBkYXRhLnlcbiAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodFxuICB0aGlzLmNvbG91ciA9IFwidHJhbnNwYXJlbnRcIlxuICB0aGlzLmJvcmRlcl9jb2xvdXIgPSBcImJsYWNrXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFydGljbGUoZ28pIHtcbiAgICB0aGlzLmdvID0gZ287XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKHsgeCwgeSB9KSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLmdvLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5nby5jdHguYXJjKHggLSB0aGlzLmdvLmNhbWVyYS54LCB5IC0gdGhpcy5nby5jYW1lcmEueSwgMTUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9ICdibHVlJztcbiAgICAgICAgdGhpcy5nby5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmdvLmN0eC5saW5lV2lkdGggPSA1O1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2VTdHlsZSA9ICdsaWdodGJsdWUnO1xuICAgICAgICB0aGlzLmdvLmN0eC5zdHJva2UoKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUG9zaXRpb24oeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0pIHtcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCAxXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgMVxufSIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9wYXJ0aWNsZS5qc1wiXG5pbXBvcnQgUG9zaXRpb24gZnJvbSBcIi4vcG9zaXRpb24uanNcIjtcbmltcG9ydCB7IFZlY3RvcjIsIHJhbmRvbSB9IGZyb20gXCIuL3RhcGV0ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0aWxlKHsgZ28sIHN1YmplY3QgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLnBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKGdvKTtcbiAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gbnVsbFxuICAgIHRoaXMuY3VycmVudF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IG51bGxcbiAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0XG4gICAgdGhpcy5ib3VuZHMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuY3VycmVudF9wb3NpdGlvbiwgd2lkdGg6IDUsIGhlaWdodDogNSB9XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLnRyYWNlID0gW107XG5cbiAgICB0aGlzLmFjdCA9ICh7IHN0YXJ0X3Bvc2l0aW9uLCBlbmRfcG9zaXRpb24gfSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0X3Bvc2l0aW9uID0gc3RhcnRfcG9zaXRpb25cbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN0YXJ0X3Bvc2l0aW9uKVxuICAgICAgICB0aGlzLmVuZF9wb3NpdGlvbiA9IGVuZF9wb3NpdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKFZlY3RvcjIuZGlzdGFuY2UodGhpcy5lbmRfcG9zaXRpb24sIHRoaXMuY3VycmVudF9wb3NpdGlvbikgPCA1KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdWJqZWN0LmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5kcmF3KHRoaXMuY3VycmVudF9wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVfcG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMi5hbmdsZSh0aGlzLmN1cnJlbnRfcG9zaXRpb24sIHRoaXMuZW5kX3Bvc2l0aW9uKTtcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAxMDtcbiAgICAgICAgdGhpcy5jdXJyZW50X3Bvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5jdXJyZW50X3Bvc2l0aW9uLnggKyBzcGVlZCAqIE1hdGguY29zKGFuZ2xlKSxcbiAgICAgICAgICAgIHk6IHRoaXMuY3VycmVudF9wb3NpdGlvbi55ICsgc3BlZWQgKiBNYXRoLnNpbihhbmdsZSlcbiAgICAgICAgfVxuICAgIH1cbn0iLCJmdW5jdGlvbiBSZXNvdXJjZUJhcih7IGdvLCB0YXJnZXQsIHlfb2Zmc2V0ID0gMTAsIGNvbG91ciA9IFwicmVkXCIgfSkge1xuICB0aGlzLmdvID0gZ29cbiAgdGhpcy50YXJnZXQgPSB0YXJnZXRcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLnRhcmdldC53aWR0aCAvIDEwO1xuICB0aGlzLmNvbG91ciA9IGNvbG91clxuICB0aGlzLmZ1bGwgPSAxMDBcbiAgdGhpcy5jdXJyZW50ID0gMTAwXG4gIHRoaXMueV9vZmZzZXQgPSB5X29mZnNldFxuICB0aGlzLnggPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0Lng7XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoZnVsbCA9IHRoaXMuZnVsbCwgY3VycmVudCA9IHRoaXMuY3VycmVudCkgPT4ge1xuICAgIGxldCBiYXJfd2lkdGggPSAoKChNYXRoLm1pbihjdXJyZW50LCBmdWxsKSkgLyBmdWxsKSAqIHRoaXMudGFyZ2V0LndpZHRoKVxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG4gICAgdGhpcy5nby5jdHgubGluZVdpZHRoID0gNFxuICAgIHRoaXMuZ28uY3R4LnN0cm9rZVJlY3QodGhpcy54KCkgLSB0aGlzLmdvLmNhbWVyYS54LCB0aGlzLnRhcmdldC55LSB0aGlzLmdvLmNhbWVyYS55IC0gdGhpcy55X29mZnNldCwgdGhpcy50YXJnZXQud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy50YXJnZXQueS0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMueV9vZmZzZXQsIHRoaXMudGFyZ2V0LndpZHRoLCB0aGlzLmhlaWdodClcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG91clxuICAgIHRoaXMuZ28uY3R4LmZpbGxSZWN0KHRoaXMueCgpIC0gdGhpcy5nby5jYW1lcmEueCwgdGhpcy50YXJnZXQueS0gdGhpcy5nby5jYW1lcmEueSAtIHRoaXMueV9vZmZzZXQsIGJhcl93aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VCYXJcbiIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi90YXBldGUuanNcIlxuXG5mdW5jdGlvbiBTY3JlZW4oZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG4gIHRoaXMuZ28uc2NyZWVuID0gdGhpc1xuICB0aGlzLndpZHRoICA9IHRoaXMuZ28uY2FudmFzX3JlY3Qud2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5nby5jYW52YXNfcmVjdC5oZWlnaHQ7XG4gIHRoaXMucmFkaXVzID0gNzAwXG5cbiAgdGhpcy5jbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLmdvLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5nby5jYW52YXMud2lkdGgsIHRoaXMuZ28uY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgdGhpcy5nby5jYW52YXMud2lkdGggPSB0aGlzLmdvLmNhbnZhcy5jbGllbnRXaWR0aFxuICAgIHRoaXMuZ28uY2FudmFzLmhlaWdodCA9IHRoaXMuZ28uY2FudmFzLmNsaWVudEhlaWdodFxuICAgIHRoaXMuZ28uY2FudmFzX3JlY3QgPSB0aGlzLmdvLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMuY2xlYXIoKVxuICAgIHRoaXMuZ28ud29ybGQuZHJhdygpXG4gIH1cblxuICB0aGlzLmRyYXdfZ2FtZV9vdmVyID0gKCkgPT4ge1xuICAgIHRoaXMuZ28uY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjcpXCJcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmdvLmNhbnZhcy53aWR0aCwgdGhpcy5nby5jYW52YXMuaGVpZ2h0KTtcbiAgICB0aGlzLmdvLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcbiAgICB0aGlzLmdvLmN0eC5mb250ID0gJzcycHggc2VyaWYnXG4gICAgdGhpcy5nby5jdHguZmlsbFRleHQoXCJHYW1lIE92ZXJcIiwgKHRoaXMuZ28uY2FudmFzLndpZHRoIC8gMikgLSAodGhpcy5nby5jdHgubWVhc3VyZVRleHQoXCJHYW1lIE92ZXJcIikud2lkdGggLyAyKSwgdGhpcy5nby5jYW52YXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICB0aGlzLmRyYXdfZm9nID0gKCkgPT4ge1xuICAgIHZhciB4ID0gdGhpcy5nby5jaGFyYWN0ZXIueCArIHRoaXMuZ28uY2hhcmFjdGVyLndpZHRoIC8gMiAtIHRoaXMuZ28uY2FtZXJhLnhcbiAgICB2YXIgeSA9IHRoaXMuZ28uY2hhcmFjdGVyLnkgKyB0aGlzLmdvLmNoYXJhY3Rlci5oZWlnaHQgLyAyIC0gdGhpcy5nby5jYW1lcmEueVxuICAgIHZhciBncmFkaWVudCA9IHRoaXMuZ28uY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHRoaXMucmFkaXVzKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMCwgMCwgMCwgMCknKVxuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLCAwLCAwLCAxKScpXG4gICAgdGhpcy5nby5jdHguZmlsbFN0eWxlID0gZ3JhZGllbnRcbiAgICB0aGlzLmdvLmN0eC5maWxsUmVjdCgwLCAwLCBzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NyZWVuXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZXJ2ZXIoZ28pIHtcbiAgdGhpcy5nbyA9IGdvXG5cbiAgLy90aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6ODk5OVwiKVxuICB0aGlzLmNvbm4gPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9udWJhcmlhLmhlcm9rdWFwcC5jb206NTQwODJcIilcbiAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMubG9naW4odGhpcy5nby5jaGFyYWN0ZXIpXG4gIHRoaXMuY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBwYXlsb2FkID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb24pIHtcbiAgICAgIGNhc2UgXCJsb2dpblwiOlxuICAgICAgICBsZXQgbmV3X2NoYXIgPSBuZXcgQ2hhcmFjdGVyKGdvKVxuICAgICAgICBuZXdfY2hhci5uYW1lID0gcGF5bG9hZC5kYXRhLmNoYXJhY3Rlci5uYW1lXG4gICAgICAgIG5ld19jaGFyLnggPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnhcbiAgICAgICAgbmV3X2NoYXIueSA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueVxuICAgICAgICBjb25zb2xlLmxvZyhgQWRkaW5nIG5ldyBjaGFyYClcbiAgICAgICAgcGxheWVycy5wdXNoKG5ld19jaGFyKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcInBpbmdcIjpcbiAgICAgICAgLy9nby5jdHguZmlsbFJlY3QocGF5bG9hZC5kYXRhLmNoYXJhY3Rlci54LCBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnksIDUwLCA1MClcbiAgICAgICAgLy9nby5jdHguc3Ryb2tlKClcbiAgICAgICAgLy9sZXQgcGxheWVyID0gcGxheWVyc1swXSAvL3BsYXllcnMuZmluZChwbGF5ZXIgPT4gcGxheWVyLm5hbWUgPT09IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIubmFtZSlcbiAgICAgICAgLy9pZiAocGxheWVyKSB7XG4gICAgICAgIC8vICBwbGF5ZXIueCA9IHBheWxvYWQuZGF0YS5jaGFyYWN0ZXIueFxuICAgICAgICAvLyAgcGxheWVyLnkgPSBwYXlsb2FkLmRhdGEuY2hhcmFjdGVyLnlcbiAgICAgICAgLy99XG4gICAgICAgIC8vYnJlYWs7XG4gICAgfVxuICB9IC8vXG4gIHRoaXMubG9naW4gPSBmdW5jdGlvbihjaGFyYWN0ZXIpIHtcbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbjogXCJsb2dpblwiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSxcbiAgICAgICAgICB4OiBjaGFyYWN0ZXIueCxcbiAgICAgICAgICB5OiBjaGFyYWN0ZXIueVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ubi5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxuICB9XG5cbiAgdGhpcy5waW5nID0gZnVuY3Rpb24oY2hhcmFjdGVyKSB7XG4gICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICBhY3Rpb246IFwicGluZ1wiLFxuICAgICAgZGF0YToge1xuICAgICAgICBjaGFyYWN0ZXI6IHtcbiAgICAgICAgICBuYW1lOiBjaGFyYWN0ZXIubmFtZSwgXG4gICAgICAgICAgeDogY2hhcmFjdGVyLngsXG4gICAgICAgICAgeTogY2hhcmFjdGVyLnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbm4uc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2tpbGwoeyBnbywgZW50aXR5LCBza2lsbCB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHlcbiAgICB0aGlzLnNraWxsID0gc2tpbGxcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNraWxsLmFjdCgpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiXG5pbXBvcnQgeyBWZWN0b3IyLCByZW1vdmVfY2xpY2thYmxlLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQgfSBmcm9tIFwiLi4vdGFwZXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnJlYWtfc3RvbmUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eSB8fCBnby5jaGFyYWN0ZXJcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldGVkX3N0b25lID0gdGhpcy5nby5zdG9uZXMuZmluZCgoc3RvbmUpID0+IHN0b25lID09PSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSlcbiAgICAgICAgaWYgKCghdGFyZ2V0ZWRfc3RvbmUpIHx8IChWZWN0b3IyLmRpc3RhbmNlKHRhcmdldGVkX3N0b25lLCB0aGlzLmVudGl0eSkgPiAxMDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdvLnNraWxscy5wdXNoKHRoaXMpXG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuc3RhcnQoMzAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdvLnN0b25lcy5pbmRleE9mKHRhcmdldGVkX3N0b25lKVxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94Lml0ZW1zID0gdGhpcy5nby5sb290X2JveC5yb2xsX2xvb3QobG9vdF90YWJsZV9zdG9uZSlcbiAgICAgICAgICAgICAgICB0aGlzLmdvLmxvb3RfYm94LnNob3coKVxuICAgICAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0YXJnZXRlZF9zdG9uZSwgdGhpcy5nby5zdG9uZXMpXG4gICAgICAgICAgICAgICAgcmVtb3ZlX2NsaWNrYWJsZSh0YXJnZXRlZF9zdG9uZSwgdGhpcy5nbylcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGhpcywgdGhpcy5nby5za2lsbHMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGxvb3RfdGFibGVfc3RvbmUgPSBbe1xuICAgICAgICBpdGVtOiB7IG5hbWU6IFwiRmxpbnRzdG9uZVwiLCBpbWFnZV9zcmM6IFwiZmxpbnRzdG9uZS5wbmdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMSxcbiAgICAgICAgY2hhbmNlOiAxMDBcbiAgICB9XVxuXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLmRyYXcoKVxuICAgIH1cbn0iLCJpbXBvcnQgQ2FzdGluZ0JhciBmcm9tIFwiLi4vY2FzdGluZ19iYXJcIlxuaW1wb3J0IHsgVmVjdG9yMiwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCByZW1vdmVfY2xpY2thYmxlIH0gZnJvbSBcIi4uL3RhcGV0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEN1dFRyZWUoeyBnbywgZW50aXR5IH0pIHtcbiAgICB0aGlzLmdvID0gZ29cbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eVxuICAgIHRoaXMubG9vdF9ib3ggPSBnby5sb290X2JveFxuICAgIHRoaXMuY2FzdGluZ19iYXIgPSBuZXcgQ2FzdGluZ0Jhcih7IGdvLCBlbnRpdHk6IGVudGl0eSB9KVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7IC8vIE1heWJlIEdhbWVPYmplY3Qgc2hvdWxkIGNvbnRyb2wgdGhpcyB0b2dnbGVcblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcblxuICAgICAgICBjb25zdCB0YXJnZXRlZF90cmVlID0gdGhpcy5nby50cmVlcy5maW5kKCh0cmVlKSA9PiB0cmVlID09PSB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSlcbiAgICAgICAgaWYgKCghdGFyZ2V0ZWRfdHJlZSkgfHwgKFZlY3RvcjIuZGlzdGFuY2UodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nby5jaGFyYWN0ZXIpID4gMTAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nby5za2lsbHMucHVzaCh0aGlzKVxuICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDMwMDAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nby50cmVlcy5pbmRleE9mKHRhcmdldGVkX3RyZWUpXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGxvb3Rib3hlcyBoYXZlIHRvIG1vdmUgZnJvbSB3ZWlyZFxuICAgICAgICAgICAgICAgIHRoaXMuZ28ubG9vdF9ib3guaXRlbXMgPSB0aGlzLmdvLmxvb3RfYm94LnJvbGxfbG9vdCh0aGlzLmxvb3RfdGFibGUpXG4gICAgICAgICAgICAgICAgdGhpcy5nby5sb290X2JveC5zaG93KClcbiAgICAgICAgICAgICAgICByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nby50cmVlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZV9jbGlja2FibGUodGFyZ2V0ZWRfdHJlZSwgdGhpcy5nbylcbiAgICAgICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNraWxscylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5sb290X3RhYmxlID0gW3tcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIldvb2RcIiwgaW1hZ2Vfc3JjOiBcImJyYW5jaC5wbmdcIiB9LFxuICAgICAgICBtaW46IDEsXG4gICAgICAgIG1heDogMyxcbiAgICAgICAgY2hhbmNlOiA5NVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaXRlbTogeyBuYW1lOiBcIkRyeSBMZWF2ZXNcIiwgaW1hZ2Vfc3JjOiBcImxlYXZlcy5qcGVnXCIgfSxcbiAgICAgICAgbWluOiAxLFxuICAgICAgICBtYXg6IDMsXG4gICAgICAgIGNoYW5jZTogMTAwXG4gICAgICB9XVxuICAgICAgXG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FzdGluZ19iYXIuZHJhdygpXG4gICAgfVxufSIsImltcG9ydCBDYXN0aW5nQmFyIGZyb20gXCIuLi9jYXN0aW5nX2JhclwiO1xuaW1wb3J0IERvb2RhZCBmcm9tIFwiLi4vZG9vZGFkXCI7XG5pbXBvcnQgUmVzb3VyY2VCYXIgZnJvbSBcIi4uL3Jlc291cmNlX2JhclwiO1xuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4uL3RhcGV0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYWtlRmlyZSh7IGdvLCBlbnRpdHkgfSkge1xuICAgIHRoaXMuZ28gPSBnbztcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eSB8fCBnby5jaGFyYWN0ZXJcbiAgICB0aGlzLmNhc3RpbmdfYmFyID0gbmV3IENhc3RpbmdCYXIoeyBnbywgZW50aXR5OiB0aGlzLmVudGl0eSB9KVxuXG4gICAgdGhpcy5hY3QgPSAoKSA9PiB7XG4gICAgICAgIGxldCBkcnlfbGVhdmVzID0gdGhpcy5lbnRpdHkuaW52ZW50b3J5LmZpbmQoXCJkcnkgbGVhdmVzXCIpXG4gICAgICAgIGxldCB3b29kID0gdGhpcy5lbnRpdHkuaW52ZW50b3J5LmZpbmQoXCJ3b29kXCIpXG4gICAgICAgIGxldCBmbGludHN0b25lID0gdGhpcy5lbnRpdHkuaW52ZW50b3J5LmZpbmQoXCJmbGludHN0b25lXCIpXG4gICAgICAgIGlmIChkcnlfbGVhdmVzICYmIGRyeV9sZWF2ZXMucXVhbnRpdHkgPiAwICYmXG4gICAgICAgICAgICB3b29kICYmIHdvb2QucXVhbnRpdHkgPiAwICYmXG4gICAgICAgICAgICBmbGludHN0b25lICYmIGZsaW50c3RvbmUucXVhbnRpdHkgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNhc3RpbmdfYmFyLnN0YXJ0KDE1MDApXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZ28uc2tpbGxzLnB1c2godGhpcylcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRyeV9sZWF2ZXMucXVhbnRpdHkgLT0gMVxuICAgICAgICAgICAgICAgIHdvb2QucXVhbnRpdHkgLT0gMVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS50eXBlID09PSBcIkJPTkZJUkVcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyZSA9IHRoaXMuZ28uZmlyZXMuZmluZCgoZmlyZSkgPT4gdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUgPT09IGZpcmUpO1xuICAgICAgICAgICAgICAgICAgICBmaXJlLmZ1ZWwgKz0gMjA7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmN1cnJlbnQgKz0gMjA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpcmUgPSBuZXcgRG9vZGFkKHsgZ28gfSlcbiAgICAgICAgICAgICAgICAgICAgZmlyZS50eXBlID0gXCJCT05GSVJFXCJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZS5zcmMgPSBcImJvbmZpcmUucG5nXCJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5pbWFnZV94X29mZnNldCA9IDI1MFxuICAgICAgICAgICAgICAgICAgICBmaXJlLmltYWdlX3lfb2Zmc2V0ID0gMjUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2VfaGVpZ2h0ID0gMzUwXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaW1hZ2Vfd2lkdGggPSAzMDBcbiAgICAgICAgICAgICAgICAgICAgZmlyZS53aWR0aCA9IDY0XG4gICAgICAgICAgICAgICAgICAgIGZpcmUuaGVpZ2h0ID0gNjRcbiAgICAgICAgICAgICAgICAgICAgZmlyZS54ID0gdGhpcy5lbnRpdHkueDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS55ID0gdGhpcy5lbnRpdHkueTtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5mdWVsID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyID0gbmV3IFJlc291cmNlQmFyKHsgZ286IHRoaXMuZ28sIHRhcmdldDogZmlyZSB9KVxuICAgICAgICAgICAgICAgICAgICBmaXJlLnJlc291cmNlX2Jhci5zdGF0aWMgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGZpcmUucmVzb3VyY2VfYmFyLmZ1bGwgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5yZXNvdXJjZV9iYXIuY3VycmVudCA9IDIwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvLmZpcmVzLnB1c2goZmlyZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nby5jbGlja2FibGVzLnB1c2goZmlyZSlcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KHRoaXMsIHRoaXMuZ28uc2tpbGxzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDE1MDApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIllvdSBkb250IGhhdmUgYWxsIHJlcXVpcmVkIG1hdGVyaWFscyB0byBtYWtlIGEgZmlyZS5cIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYXN0aW5nX2Jhci5kcmF3KClcbiAgICB9XG59IiwiaW1wb3J0IFByb2plY3RpbGUgZnJvbSBcIi4uL3Byb2plY3RpbGVcIlxuaW1wb3J0IHsgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50LCBpc19jb2xsaWRpbmcsIHJhbmRvbSB9IGZyb20gXCIuLi90YXBldGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGcm9zdGJvbHQoeyBnbyB9KSB7XG4gICAgdGhpcy5nbyA9IGdvXG4gICAgdGhpcy5wcm9qZWN0aWxlID0gbmV3IFByb2plY3RpbGUoeyBnbywgc3ViamVjdDogdGhpcyB9KVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm1hbmFfY29zdCA9IDE1XG5cbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlLmRyYXcoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIChpc19jb2xsaWRpbmcodGhpcy5wcm9qZWN0aWxlLmJvdW5kcygpLCB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkpKSB7XG4gICAgICAgICAgICBpZiAoZGFtYWdlYWJsZSh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSByYW5kb20oNSwgMTApO1xuICAgICAgICAgICAgICAgIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLnN0YXRzLnRha2VfZGFtYWdlKHsgZGFtYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWN0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKCh0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9PT0gbnVsbCkgfHwgKHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlID09PSB1bmRlZmluZWQpKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdGFydF9wb3NpdGlvbiA9IHsgeDogdGhpcy5nby5jaGFyYWN0ZXIueCArIDUwLCB5OiB0aGlzLmdvLmNoYXJhY3Rlci55ICsgNTAgfVxuICAgICAgICBjb25zdCBlbmRfcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmdvLnNlbGVjdGVkX2NsaWNrYWJsZS54ICsgdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5nby5zZWxlY3RlZF9jbGlja2FibGUueSArIHRoaXMuZ28uc2VsZWN0ZWRfY2xpY2thYmxlLmhlaWdodCAvIDJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2plY3RpbGUuYWN0KHsgc3RhcnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbiB9KVxuXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLmdvLnNwZWxscy5wdXNoKHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5lbmQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZV9vYmplY3RfaWZfcHJlc2VudCh0aGlzLCB0aGlzLmdvLnNwZWxscyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGFtYWdlYWJsZShvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5zdGF0cyAhPT0gdW5kZWZpbmVkICYmIG9iamVjdC5zdGF0cy50YWtlX2RhbWFnZSAhPT0gdW5kZWZpbmVkXG4gICAgfVxufSIsImNvbnN0IGRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKE1hdGguZmxvb3IoYSkgLSBNYXRoLmZsb29yKGIpKTtcbn1cblxuY29uc3QgVmVjdG9yMiA9IHtcbiAgZGlzdGFuY2U6IChhLCBiKSA9PiBNYXRoLnRydW5jKE1hdGguc3FydChNYXRoLnBvdyhiLnggLSBhLngsIDIpICsgTWF0aC5wb3coYi55IC0gYS55LCAyKSkpLFxuICBhbmdsZTogKGN1cnJlbnRfcG9zaXRpb24sIGVuZF9wb3NpdGlvbikgPT4gTWF0aC5hdGFuMihlbmRfcG9zaXRpb24ueSAtIGN1cnJlbnRfcG9zaXRpb24ueSwgZW5kX3Bvc2l0aW9uLnggLSBjdXJyZW50X3Bvc2l0aW9uLngpXG59XG5cbmNvbnN0IGlzX2NvbGxpZGluZyA9IGZ1bmN0aW9uKHNlbGYsIHRhcmdldCkge1xuICBpZiAoXG4gICAgKHNlbGYueCA8IHRhcmdldC54ICsgdGFyZ2V0LndpZHRoKSAmJlxuICAgIChzZWxmLnggKyBzZWxmLndpZHRoID4gdGFyZ2V0LngpICYmXG4gICAgKHNlbGYueSA8IHRhcmdldC55ICsgdGFyZ2V0LmhlaWdodCkgJiZcbiAgICAoc2VsZi55ICsgc2VsZi5oZWlnaHQgPiB0YXJnZXQueSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBkcmF3X3NxdWFyZSA9IGZ1bmN0aW9uICh4ID0gMTAsIHkgPSAxMCwgdyA9IDIwLCBoID0gMjAsIGNvbG9yID0gXCJyZ2IoMTkwLCAyMCwgMTApXCIpIHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICBjdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XG59XG5cbmNvbnN0IHJhbmRvbSA9IChzdGFydCwgZW5kKSA9PiB7XG4gIGlmIChlbmQgPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gc3RhcnRcbiAgICBzdGFydCA9IDBcbiAgfVxuICByZXR1cm4gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogZW5kKSArIHN0YXJ0ICBcbn1cblxuZnVuY3Rpb24gcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50KG9iamVjdCwgbGlzdCkge1xuICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihvYmplY3QpO1xuICBpZiAoaW5kZXggPiAtMSkge1xuICAgIHJldHVybiBsaXN0LnNwbGljZShpbmRleCwgMSlbMF1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVfY2xpY2thYmxlKGRvb2RhZCwgZ28pIHtcbiAgY29uc3QgY2xpY2thYmxlX2luZGV4ID0gZ28uY2xpY2thYmxlcy5pbmRleE9mKGRvb2RhZClcbiAgaWYgKGNsaWNrYWJsZV9pbmRleCA+IC0xKSB7XG4gICAgZ28uY2xpY2thYmxlcy5zcGxpY2UoY2xpY2thYmxlX2luZGV4LCAxKVxuICB9XG4gIGlmIChnby5zZWxlY3RlZF9jbGlja2FibGUgPT09IGRvb2RhZCkge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG51bGxcbiAgfVxufVxuXG5jb25zdCBkaWNlID0gKHNpZGVzLCB0aW1lcyA9IDEpID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oQXJyYXkodGltZXMpKS5tYXAoKGkpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpZGVzKSArIDEpO1xufVxuXG5leHBvcnQgeyBkaXN0YW5jZSwgaXNfY29sbGlkaW5nLCBkcmF3X3NxdWFyZSwgVmVjdG9yMiwgcmFuZG9tLCByZW1vdmVfb2JqZWN0X2lmX3ByZXNlbnQsIGRpY2UsIHJlbW92ZV9jbGlja2FibGUgfVxuIiwiY2xhc3MgVGlsZSB7XG4gICAgY29uc3RydWN0b3IoaW1hZ2Vfc3JjLCB4X29mZnNldCA9IDAsIHlfb2Zmc2V0ID0gMCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKClcbiAgICAgICAgdGhpcy5pbWFnZS5zcmMgPSBpbWFnZV9zcmNcbiAgICAgICAgdGhpcy54X29mZnNldCA9IHhfb2Zmc2V0XG4gICAgICAgIHRoaXMueV9vZmZzZXQgPSB5X29mZnNldFxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbGUiLCJpbXBvcnQgVGlsZSBmcm9tIFwiLi90aWxlXCJcblxuLy8gVGhlIFdvcmxkIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGl0c2VsZi5cbmZ1bmN0aW9uIFdvcmxkKGdvKSB7XG4gIHRoaXMuZ28gPSBnbztcbiAgdGhpcy5nby53b3JsZCA9IHRoaXM7XG4gIHRoaXMud2lkdGggPSAxMDAwMDtcbiAgdGhpcy5oZWlnaHQgPSAxMDAwMDtcbiAgdGhpcy54X29mZnNldCA9IDA7XG4gIHRoaXMueV9vZmZzZXQgPSAwO1xuICB0aGlzLnRpbGVfc2V0ID0ge1xuICAgIGdyYXNzOiBuZXcgVGlsZShcImdyYXNzLnBuZ1wiLCAwLCAwLCA2NCwgNjMpLFxuICAgIGRpcnQ6IG5ldyBUaWxlKFwiZGlydDIucG5nXCIsIDAsIDAsIDY0LCA2MyksXG4gICAgc3RvbmU6IG5ldyBUaWxlKFwiZmxpbnRzdG9uZS5wbmdcIiwgMCwgMCwgODQwLCA4NTkpLFxuICB9XG4gIHRoaXMucGlja19yYW5kb21fdGlsZSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy50aWxlX3NldC5ncmFzc1xuICB9XG4gIHRoaXMudGlsZV93aWR0aCA9IDY0XG4gIHRoaXMudGlsZV9oZWlnaHQgPSA2NFxuICB0aGlzLnRpbGVzX3Blcl9yb3cgPSBNYXRoLnRydW5jKHRoaXMud2lkdGggLyB0aGlzLnRpbGVfd2lkdGgpICsgMTtcbiAgdGhpcy50aWxlc19wZXJfY29sdW1uID0gTWF0aC50cnVuYyh0aGlzLmhlaWdodCAvIHRoaXMudGlsZV9oZWlnaHQpICsgMTtcbiAgdGhpcy50aWxlcyA9IG51bGw7XG4gIHRoaXMuZ2VuZXJhdGVfbWFwID0gKCkgPT4ge1xuICAgIHRoaXMudGlsZXMgPSBuZXcgQXJyYXkodGhpcy50aWxlc19wZXJfcm93KTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPD0gdGhpcy50aWxlc19wZXJfcm93OyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDw9IHRoaXMudGlsZXNfcGVyX2NvbHVtbjsgY29sdW1uKyspIHtcbiAgICAgICAgaWYgKHRoaXMudGlsZXNbcm93XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy50aWxlc1tyb3ddID0gW3RoaXMucGlja19yYW5kb21fdGlsZSgpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGlsZXNbcm93XS5wdXNoKHRoaXMucGlja19yYW5kb21fdGlsZSgpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRoaXMuZHJhdyA9ICgpID0+IHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPD0gdGhpcy50aWxlc19wZXJfcm93OyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDw9IHRoaXMudGlsZXNfcGVyX2NvbHVtbjsgY29sdW1uKyspIHtcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLnRpbGVzW3Jvd11bY29sdW1uXVxuICAgICAgICBpZiAodGlsZSAhPT0gdGhpcy50aWxlX3NldC5ncmFzcykge1xuICAgICAgICAgIHRoaXMuZ28uY3R4LmRyYXdJbWFnZSh0aGlzLnRpbGVfc2V0LmdyYXNzLmltYWdlLFxuICAgICAgICAgICAgdGhpcy50aWxlX3NldC5ncmFzcy54X29mZnNldCwgdGhpcy50aWxlX3NldC5ncmFzcy55X29mZnNldCwgdGhpcy50aWxlX3NldC5ncmFzcy53aWR0aCwgdGhpcy50aWxlX3NldC5ncmFzcy5oZWlnaHQsXG4gICAgICAgICAgICB0aGlzLnhfb2Zmc2V0ICsgKHJvdyAqIHRoaXMudGlsZV93aWR0aCkgLSB0aGlzLmdvLmNhbWVyYS54LFxuICAgICAgICAgICAgdGhpcy55X29mZnNldCArIChjb2x1bW4gKiB0aGlzLnRpbGVfaGVpZ2h0KSAtIHRoaXMuZ28uY2FtZXJhLnksIDY0LCA2MylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdvLmN0eC5kcmF3SW1hZ2UodGlsZS5pbWFnZSxcbiAgICAgICAgICB0aWxlLnhfb2Zmc2V0LCB0aWxlLnlfb2Zmc2V0LCB0aWxlLndpZHRoLCB0aWxlLmhlaWdodCxcbiAgICAgICAgICB0aGlzLnhfb2Zmc2V0ICsgKHJvdyAqIHRoaXMudGlsZV93aWR0aCkgLSB0aGlzLmdvLmNhbWVyYS54LFxuICAgICAgICAgIHRoaXMueV9vZmZzZXQgKyAoY29sdW1uICogdGhpcy50aWxlX2hlaWdodCkgLSB0aGlzLmdvLmNhbWVyYS55LCA2NSwgNjUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdvcmxkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tIFwiLi9nYW1lX29iamVjdC5qc1wiXG5pbXBvcnQgU2NyZWVuIGZyb20gXCIuL3NjcmVlbi5qc1wiXG5pbXBvcnQgQ2FtZXJhIGZyb20gXCIuL2NhbWVyYS5qc1wiXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci5qc1wiXG5pbXBvcnQgS2V5Ym9hcmRJbnB1dCBmcm9tIFwiLi9rZXlib2FyZF9pbnB1dC5qc1wiXG5pbXBvcnQgeyBpc19jb2xsaWRpbmcsIFZlY3RvcjIsIHJhbmRvbSwgcmVtb3ZlX29iamVjdF9pZl9wcmVzZW50IH0gZnJvbSBcIi4vdGFwZXRlLmpzXCJcbmltcG9ydCB7XG4gIHNldENsaWNrQ2FsbGJhY2ssXG4gIHNldE1vdXNlTW92ZUNhbGxiYWNrLFxuICBzZXRNb3VzZXVwQ2FsbGJhY2ssXG4gIHNldE1vdXNlZG93bkNhbGxiYWNrLFxuICBzZXRUb3VjaHN0YXJ0Q2FsbGJhY2ssXG4gIHNldFRvdWNoZW5kQ2FsbGJhY2ssXG59IGZyb20gXCIuL2V2ZW50c19jYWxsYmFja3MuanNcIlxuaW1wb3J0IEdhbWVMb29wIGZyb20gXCIuL2dhbWVfbG9vcC5qc1wiXG5pbXBvcnQgV29ybGQgZnJvbSBcIi4vd29ybGQuanNcIlxuaW1wb3J0IERvb2RhZCBmcm9tIFwiLi9kb29kYWQuanNcIlxuaW1wb3J0IENvbnRyb2xzIGZyb20gXCIuL2NvbnRyb2xzLmpzXCJcbmltcG9ydCBTZXJ2ZXIgZnJvbSBcIi4vc2VydmVyXCJcbmltcG9ydCBMb290Qm94IGZyb20gXCIuL2xvb3RfYm94LmpzXCJcbmltcG9ydCBDcmVlcCBmcm9tIFwiLi9iZWluZ3MvY3JlZXAuanNcIlxuaW1wb3J0IEFjdGlvbkJhciBmcm9tIFwiLi9hY3Rpb25fYmFyLmpzXCJcbmltcG9ydCBTdG9uZSBmcm9tIFwiLi9iZWluZ3Mvc3RvbmUuanNcIlxuaW1wb3J0IFRyZWUgZnJvbSBcIi4vYmVpbmdzL3RyZWUuanNcIlxuaW1wb3J0IEVkaXRvciBmcm9tIFwiLi9lZGl0b3IvaW5kZXguanNcIlxuXG5jb25zdCBnbyA9IG5ldyBHYW1lT2JqZWN0KClcbmNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW4oZ28pXG5jb25zdCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGdvKVxuY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihnbylcbmNvbnN0IGtleWJvYXJkX2lucHV0ID0gbmV3IEtleWJvYXJkSW5wdXQoZ28pXG5jb25zdCB3b3JsZCA9IG5ldyBXb3JsZChnbylcbmNvbnN0IGNvbnRyb2xzID0gbmV3IENvbnRyb2xzKGdvKVxuY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcihnbylcbmNvbnN0IGxvb3RfYm94ID0gbmV3IExvb3RCb3goZ28pXG5jb25zdCBhY3Rpb25fYmFyID0gbmV3IEFjdGlvbkJhcihnbylcbmNvbnN0IGVkaXRvciA9IG5ldyBFZGl0b3IoeyBnbyB9KVxuXG4vLyBEaXNhYmxlIHJpZ2h0IG1vdXNlIGNsaWNrXG5nby5jYW52YXMub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7IGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfVxuXG5jb25zdCBjbGlja19jYWxsYmFja3MgPSBzZXRDbGlja0NhbGxiYWNrKGdvKVxuY2xpY2tfY2FsbGJhY2tzLnB1c2goY2xpY2thYmxlX2NsaWNrZWQpXG5mdW5jdGlvbiBjbGlja2FibGVfY2xpY2tlZChldikge1xuICBsZXQgY2xpY2sgPSB7IHg6IGV2LmNsaWVudFggKyBnby5jYW1lcmEueCwgeTogZXYuY2xpZW50WSArIGdvLmNhbWVyYS55LCB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cbiAgY29uc3QgY2xpY2thYmxlID0gZ28uY2xpY2thYmxlcy5maW5kKChjbGlja2FibGUpID0+IGlzX2NvbGxpZGluZyhjbGlja2FibGUsIGNsaWNrKSlcbiAgaWYgKGNsaWNrYWJsZSkge1xuICAgIGNsaWNrYWJsZS5hY3RpdmF0ZWQgPSAhY2xpY2thYmxlLmFjdGl2YXRlZFxuICB9XG4gIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IGNsaWNrYWJsZVxufVxuXG5sZXQgbW91c2VfaXNfZG93biA9IGZhbHNlXG5sZXQgbW91c2VfcG9zaXRpb24gPSB7fVxuY29uc3QgbW91c2Vtb3ZlX2NhbGxiYWNrcyA9IHNldE1vdXNlTW92ZUNhbGxiYWNrKGdvKVxubW91c2Vtb3ZlX2NhbGxiYWNrcy5wdXNoKHRyYWNrX21vdXNlX3Bvc2l0aW9uKVxuZnVuY3Rpb24gdHJhY2tfbW91c2VfcG9zaXRpb24oZXZ0KSB7XG4gIHZhciByZWN0ID0gZ28uY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIG1vdXNlX3Bvc2l0aW9uID0ge1xuICAgIHg6IGV2dC5jbGllbnRYIC0gcmVjdC5sZWZ0ICsgY2FtZXJhLngsXG4gICAgeTogZXZ0LmNsaWVudFkgLSByZWN0LnRvcCArIGNhbWVyYS55XG4gIH1cbn1cbmNvbnN0IG1vdXNlZG93bl9jYWxsYmFja3MgPSBzZXRNb3VzZWRvd25DYWxsYmFjayhnbylcbm1vdXNlZG93bl9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSB0cnVlKVxuY29uc3QgbW91c2V1cF9jYWxsYmFja3MgPSBzZXRNb3VzZXVwQ2FsbGJhY2soZ28pXG5tb3VzZXVwX2NhbGxiYWNrcy5wdXNoKChldikgPT4gbW91c2VfaXNfZG93biA9IGZhbHNlKVxubW91c2V1cF9jYWxsYmFja3MucHVzaChsb290X2JveC5jaGVja19pdGVtX2NsaWNrZWQuYmluZChsb290X2JveCkpXG5jb25zdCB0b3VjaHN0YXJ0X2NhbGxiYWNrcyA9IHNldFRvdWNoc3RhcnRDYWxsYmFjayhnbylcbnRvdWNoc3RhcnRfY2FsbGJhY2tzLnB1c2goKGV2KSA9PiBtb3VzZV9pc19kb3duID0gdHJ1ZSlcbmNvbnN0IHRvdWNoZW5kX2NhbGxiYWNrcyA9IHNldFRvdWNoZW5kQ2FsbGJhY2soZ28pXG50b3VjaGVuZF9jYWxsYmFja3MucHVzaCgoZXYpID0+IG1vdXNlX2lzX2Rvd24gPSBmYWxzZSlcbmZ1bmN0aW9uIGNvbnRyb2xzX21vdmVtZW50KCkge1xuICAvLyBnby5jbGlja2FibGVzLmZvckVhY2goKGNsaWNrYWJsZSkgPT4ge1xuICAvLyAgIGlmIChjbGlja2FibGUuYWN0aXZhdGVkKSB7XG4gIC8vICAgICBjbGlja2FibGUuY2xpY2soKVxuICAvLyAgIH1cbiAgLy8gfSlcbn1cblxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3MucSA9IFtjaGFyYWN0ZXIuc3BlbGxzLmZyb3N0Ym9sdF1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmYgPSBbY2hhcmFjdGVyLnNraWxscy5jdXRfdHJlZV1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzWzFdID0gW2NoYXJhY3Rlci5za2lsbHMuYnJlYWtfc3RvbmVdXG5rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrc1syXSA9IFtjaGFyYWN0ZXIuc2tpbGxzLm1ha2VfZmlyZV1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmkgPSBbY2hhcmFjdGVyLmludmVudG9yeS50b2dnbGVfZGlzcGxheV1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzLmIgPSBbY2hhcmFjdGVyLmJvYXJkLnRvZ2dsZV9ncmlkXVxuLy9rZXlib2FyZF9pbnB1dC5vbl9rZXlkb3duX2NhbGxiYWNrcy5wID0gW2JvYXJkLndheV90b19wbGF5ZXJdXG5cbmxldCBGUFMgPSAwXG5sZXQgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICBGUFMgPSBEYXRlLm5vdygpIC0gbGFzdF90aWNrXG4gIGlmICgoRlBTKSA+IDEwMDApIHtcbiAgICB1cGRhdGVfZnBzKClcbiAgICBjb25zb2xlLmxvZyhGUFMpXG4gICAgbGFzdF90aWNrID0gRGF0ZS5ub3coKVxuICB9XG4gIGlmICghY2hhcmFjdGVyLnN0YXRzLmlzX2FsaXZlKCkpIHtcbiAgICBjb250cm9sc19tb3ZlbWVudCgpXG4gIH0gZWxzZSB7XG4gICAgZ28uc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwudXBkYXRlKCkpXG4gICAgZ28ubWFuYWdlZF9vYmplY3RzLmZvckVhY2gobW9iID0+IG1vYi51cGRhdGUoKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVfZnBzKCkge1xuICBpZiAoY2hhcmFjdGVyLnN0YXRzLmlzX2FsaXZlKCkpIHtcbiAgICBjaGFyYWN0ZXIudXBkYXRlX2ZwcygpXG4gIH1cbiAgZ28uZmlyZXMuZm9yRWFjaChmaXJlID0+IGZpcmUudXBkYXRlX2ZwcygpKVxufVxuLy8gQ29tbWVudFxuY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgaWYgKGNoYXJhY3Rlci5zdGF0cy5pc19kZWFkKCkpIHtcbiAgICBzY3JlZW4uZHJhd19nYW1lX292ZXIoKVxuICB9IGVsc2Uge1xuICAgIHNjcmVlbi5kcmF3KClcbiAgICBnby5zdG9uZXMuZm9yRWFjaChzdG9uZSA9PiBzdG9uZS5kcmF3KCkpXG4gICAgZ28udHJlZXMuZm9yRWFjaCh0cmVlID0+IHRyZWUuZHJhdygpKVxuICAgIGdvLmZpcmVzLmZvckVhY2goZmlyZSA9PiBmaXJlLmRyYXcoKSlcbiAgICBnby5kcmF3X3NlbGVjdGVkX2NsaWNrYWJsZSgpXG4gICAgZ28uc3BlbGxzLmZvckVhY2goc3BlbGwgPT4gc3BlbGwuZHJhdygpKVxuICAgIGdvLnNraWxscy5mb3JFYWNoKHNraWxsID0+IHNraWxsLmRyYXcoKSlcbiAgICBjaGFyYWN0ZXIuZHJhdygpXG4gICAgZ28ubWFuYWdlZF9vYmplY3RzLmZvckVhY2gobW9iID0+IG1vYi5kcmF3KCkpXG4gICAgZ28uY3JlZXBzLmZvckVhY2goY3JlZXAgPT4gY3JlZXAuZHJhdygpKVxuICAgIHNjcmVlbi5kcmF3X2ZvZygpXG4gICAgbG9vdF9ib3guZHJhdygpXG4gICAgZ28uY2hhcmFjdGVyLmludmVudG9yeS5kcmF3KClcbiAgICBhY3Rpb25fYmFyLmRyYXcoKVxuICAgIGNoYXJhY3Rlci5ib2FyZC5kcmF3KClcbiAgICBlZGl0b3IuZHJhdygpXG4gICAgaWYgKHNob3dfY29udHJvbF93aGVlbCkgZHJhd19jb250cm9sX3doZWVsKClcbiAgfVxufSBcblxuLy8gVHJlZXNcbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBsZXQgdHJlZSA9IG5ldyBUcmVlKHsgZ28gfSlcbiAgZ28udHJlZXMucHVzaCh0cmVlKVxuICBnby5jbGlja2FibGVzLnB1c2godHJlZSlcbn0pXG4vLyBTdG9uZXNcbkFycmF5LmZyb20oQXJyYXkoMzAwKSkuZm9yRWFjaCgoaiwgaSkgPT4ge1xuICBjb25zdCBzdG9uZSA9IG5ldyBTdG9uZSh7IGdvIH0pO1xuICBnby5zdG9uZXMucHVzaChzdG9uZSlcbiAgZ28uY2xpY2thYmxlcy5wdXNoKHN0b25lKVxufSlcbi8vIENyZWVwXG5mb3IgKGxldCBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgbGV0IGNyZWVwID0gbmV3IENyZWVwKHsgZ28gfSk7XG4gIGdvLmNsaWNrYWJsZXMucHVzaChjcmVlcCk7XG59XG5jb25zdCBkdW1teSA9IG5ldyBDcmVlcCh7IGdvIH0pXG5kdW1teS54ID0gODAwO1xuZHVtbXkueSA9IDIwMDtcbmdvLmNsaWNrYWJsZXMucHVzaChkdW1teSlcblxubGV0IG9yZGVyZWRfY2xpY2thYmxlcyA9IFtdO1xuY29uc3QgdGFiX2N5Y2xpbmcgPSAoZXYpID0+IHtcbiAgZXYucHJldmVudERlZmF1bHQoKVxuICBvcmRlcmVkX2NsaWNrYWJsZXMgPSBnby5jcmVlcHMuc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBWZWN0b3IyLmRpc3RhbmNlKGEsIGNoYXJhY3RlcikgLSBWZWN0b3IyLmRpc3RhbmNlKGIsIGNoYXJhY3Rlcik7XG4gIH0pXG4gIGlmIChWZWN0b3IyLmRpc3RhbmNlKG9yZGVyZWRfY2xpY2thYmxlc1swXSwgY2hhcmFjdGVyKSA+IDUwMCkgcmV0dXJuO1xuXG4gIGlmIChvcmRlcmVkX2NsaWNrYWJsZXNbMF0gPT09IGdvLnNlbGVjdGVkX2NsaWNrYWJsZSkge1xuICAgIGdvLnNlbGVjdGVkX2NsaWNrYWJsZSA9IG9yZGVyZWRfY2xpY2thYmxlc1sxXTtcbiAgfSBlbHNlIHtcbiAgICBnby5zZWxlY3RlZF9jbGlja2FibGUgPSBvcmRlcmVkX2NsaWNrYWJsZXNbMF1cbiAgfVxufVxua2V5Ym9hcmRfaW5wdXQub25fa2V5ZG93bl9jYWxsYmFja3NbXCJUYWJcIl0gPSBbdGFiX2N5Y2xpbmddXG5cbmxldCBzaG93X2NvbnRyb2xfd2hlZWwgPSBmYWxzZVxuY29uc3QgZHJhd19jb250cm9sX3doZWVsID0gKCkgPT4ge1xuICBnby5jdHguYmVnaW5QYXRoKClcbiAgZ28uY3R4LmFyYyhcbiAgICBjaGFyYWN0ZXIueCArIChjaGFyYWN0ZXIud2lkdGggLyAyKSAtIGdvLmNhbWVyYS54LFxuICAgIGNoYXJhY3Rlci55ICsgKGNoYXJhY3Rlci5oZWlnaHQgLyAyKSAtIGdvLmNhbWVyYS55LFxuICAgIDIwMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgZ28uY3R4LmxpbmVXaWR0aCA9IDVcbiAgZ28uY3R4LnN0cm9rZVN0eWxlID0gXCJ3aGl0ZVwiXG4gIGdvLmN0eC5zdHJva2UoKTtcbn1cbmNvbnN0IHRvZ2dsZV9jb250cm9sX3doZWVsID0gKCkgPT4geyBzaG93X2NvbnRyb2xfd2hlZWwgPSAhc2hvd19jb250cm9sX3doZWVsIH1cbmtleWJvYXJkX2lucHV0Lm9uX2tleWRvd25fY2FsbGJhY2tzW1wiY1wiXSA9IFt0b2dnbGVfY29udHJvbF93aGVlbF1cblxuY29uc3QgZ2FtZV9sb29wID0gbmV3IEdhbWVMb29wKClcbmdhbWVfbG9vcC5kcmF3ID0gZHJhd1xuZ2FtZV9sb29wLnByb2Nlc3Nfa2V5c19kb3duID0gZ28ua2V5Ym9hcmRfaW5wdXQucHJvY2Vzc19rZXlzX2Rvd25cbmdhbWVfbG9vcC51cGRhdGUgPSB1cGRhdGVcblxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gIGNoYXJhY3Rlci54ID0gMTAwXG4gIGNoYXJhY3Rlci55ID0gMTAwXG4gIGdvLndvcmxkLmdlbmVyYXRlX21hcCgpXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3AubG9vcC5iaW5kKGdhbWVfbG9vcCkpO1xufVxuXG5zdGFydCgpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9