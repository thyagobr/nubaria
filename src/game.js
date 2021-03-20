const canvas = document.getElementById('screen');
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
  var slot_height = tile_size * 2;
  var slot_width = tile_size * 2;
  var action_bar_width = number_of_slots * slot_width
  var action_bar_height = number_of_slots * slot_height
  var slots = ["mage_mm", "free", "free", "free"]

  for (var slot_index = 0; slot_index <= slots.length; slot_index++) {
    var slot = slots[slot_index];
    switch(slot) {
    case "mage_mm":
      var x = (SCREEN_WIDTH / 2) - (action_bar_width / 2) + (slot_width * slot_index)
      var y = tile_size * 36
      ctx.drawImage(img, x, y, slot_width, slot_height)

      ctx.strokeStyle = "blueviolet"
      ctx.lineWidth = 2;
      ctx.strokeRect(
        x, y,
        slot_width, slot_height
      )
      break;

    case "free":
      var x = (SCREEN_WIDTH / 2) - (action_bar_width / 2) + (slot_width * slot_index)
      var y = tile_size * 36
      ctx.fillStyle = "#4d0a0c"
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

var character = {
  x: tile_size * (Math.floor(canvas_rect.width / tile_size) / 2),
  y: tile_size * (Math.floor(canvas_rect.height / tile_size) / 2),
  moving: false
}

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
  console.log(target_movement)
}, false)

const distance = function (a, b) {
  return Math.abs(Math.floor(a) - Math.floor(b));
}

const clear_screen = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const spawn_creep = function () {
}

function game_loop() {
  clear_screen()
  // draw_grid(ctx, canvas_rect, tile_size);

  // Character Movement
  if (character.moving) {
    if ((distance(character.x, target_movement.x) <= 1) && (distance(character.y, target_movement.y) <= 1)) {
      character.moving = false;
      console.log("Stopped");
    }
    // If the distance from the character position to the target is 1 or less
    if (distance(character.x, target_movement.x) > 1) {
      if (character.x > target_movement.x) {
        character.x = character.x - 2;
      } else {
        character.x = character.x + 2;
      }
    }
    if (distance(character.y, target_movement.y) > 1) {
      if (character.y > target_movement.y) {
        character.y = character.y - 2;
      } else {
        character.y = character.y + 2;
      }
    }
  }
  // END - Character Movement

  // First base
  draw_square(0, tile_size * 30, tile_size * 6, tile_size * 6)

  // Second base
  draw_square(tile_size * (Math.floor(canvas_rect.right / tile_size) - 6), 0, tile_size * 6, tile_size * 6)

  // Draw character
  draw_square(character.x,
    character.y,
    20, 20, "blueviolet"
  );

  draw_action_bar()

  requestAnimationFrame(game_loop)
};

requestAnimationFrame(game_loop)
