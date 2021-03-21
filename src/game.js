const canvas = document.getElementById('screen');
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
const ctx = canvas.getContext('2d');

// Constants
const canvas_rect = canvas.getBoundingClientRect()
const tile_size = 20;
const SCREEN_WIDTH = canvas_rect.width;
const SCREEN_HEIGHT = canvas_rect.height;

const draw_square = function (x = 10, y = 10, w = 20, h = 20, color = "rgb(190, 20, 10)") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

import draw_grid from "./grid.js";

// action bar
const img = new Image();
img.src = "https://cdna.artstation.com/p/assets/images/images/009/031/190/large/richard-thomas-paints-11-v2.jpg"

const draw_action_bar = function() {
  var number_of_slots = 4
  var slot_height = tile_size * 3;
  var slot_width = tile_size * 3;
  var action_bar_width = number_of_slots * slot_width
  var action_bar_height = number_of_slots * slot_height
  var action_bar_x = (SCREEN_WIDTH / 2) - (action_bar_width / 2) 
  var action_bar_y = tile_size * 33
  var slots = ["mage_mm", "free", "free", "free"]

  for (var slot_index = 0; slot_index <= slots.length; slot_index++) {
    var slot = slots[slot_index];
    var x = action_bar_x + (slot_width * slot_index)
    var y = action_bar_y

    switch(slot) {
    case "mage_mm":
      ctx.drawImage(img, x, y, slot_width, slot_height)

      ctx.strokeStyle = "blueviolet"
      ctx.lineWidth = 2;
      ctx.strokeRect(
        x, y,
        slot_width, slot_height
      )
      break;

    case "free":
      ctx.fillStyle = "rgba(46, 46, 46, 1)"
      ctx.fillRect(
        x, y,
        slot_width, slot_height)

      ctx.strokeStyle = "blueviolet"
      ctx.lineWidth = 2;
      ctx.strokeRect(
        x, y,
        slot_width, slot_height
      )

    }
  }
}
// END -- action bar

// Entities
var character = {
  id: 1,
  x: tile_size * (Math.floor(canvas_rect.width / tile_size) / 2),
  y: tile_size * (Math.floor(canvas_rect.height / tile_size) / 2),
  width: tile_size,
  height: tile_size,
  moving: false,
  draw: function() { draw_square(this.x, this.y, 20, 20, "blueviolet"); }
}

var base_red = {
  id: 2,
  x: 0,
  y: tile_size * 30,
  width: tile_size * 6,
  height: tile_size * 6,
  draw: function() { draw_square(this.x, this.y, this.width, this.height) }
}

var base_blue = {
  id: 3,
  x: tile_size * (Math.floor(canvas_rect.right / tile_size) - 6),
  y: 0,
  width: tile_size * 6,
  height: tile_size * 6,
  draw: function() { draw_square(this.x, this.y, this.width, this.height) }
}

var creep = {
  id: 4,
  x: canvas_rect.right,
  y: 20,
  width: tile_size,
  height: tile_size,
  moving: true,
  color: "green",
  draw: function () { draw_square(this.x, this.y, this.width, this.height, this.color) }
}

var entities = [character, base_red, base_blue, creep]
// END - Entities

var target_movement = {
  x: 0,
  y: 0
}

const on_click = function (ev) {
  target_movement.x = ev.clientX
  target_movement.y = ev.clientY
  character.moving = true
}

canvas.addEventListener("click", on_click, false);
// debugger function
window.addEventListener("keyup", function (e) {
  console.log(character)
  console.log(base_red)
}, false)

const distance = function (a, b) {
  return Math.abs(Math.floor(a) - Math.floor(b));
}

const clear_screen = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const draw = function() {
  entities.forEach((entity) => entity.draw())
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

function game_loop() {
  clear_screen()
  // draw_grid(ctx, canvas_rect, tile_size);

  draw()
  // Character Movement
  if (character.moving) {
    var future_movement = { ...character }
    if ((distance(character.x, target_movement.x) <= 1) && (distance(character.y, target_movement.y) <= 1)) {
      character.moving = false;
      console.log("Stopped");
    }
    // If the distance from the character position to the target is 1 or less
    if (distance(character.x, target_movement.x) > 1) {
      if (character.x > target_movement.x) {
        future_movement.x = character.x - 2;
      } else {
        future_movement.x = character.x + 2;
      }
    }
    if (distance(character.y, target_movement.y) > 1) {
      if (character.y > target_movement.y) {
        future_movement.y = character.y - 2;
      } else {
        future_movement.y = character.y + 2;
      }
    }

    if (entities.every(function(entity) { return entity.id === character.id || !is_colliding(future_movement, entity) })) {
      character.x = future_movement.x
      character.y = future_movement.y
    } else {
      console.log("Blocked");
      character.moving = false
    }
  }
  // END - Character Movement
  
  // Creep movement
  //if ((distance(creep.x, character.x) <= 1 + tile_size) && (distance(creep.y, character.y) <= 1 + tile_size)) {
  //  creep.moving = false;
  //}
  // If the distance from the character position to the target is 1 or less
  var target = { ...base_red }
  if (distance(creep.x, target.x) > 1 + tile_size) {
    if (creep.x > target.x) {
      creep.x = creep.x - 1;
    } else {
      creep.x = creep.x + 1;
    }
  }
  if (distance(creep.y, target.y) > 1 + tile_size) {
    if (creep.y > target.y) {
      creep.y = creep.y - 1;
    } else {
      creep.y = creep.y + 1;
    }
  }
  // END - Creep movement

  draw_action_bar()

  requestAnimationFrame(game_loop)
};

requestAnimationFrame(game_loop)
