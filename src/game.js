const canvas = document.getElementById('screen');
//canvas.width = document.body.clientWidth
//canvas.height = document.body.clientHeight
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
  // To determine what is the width to use, we have to pick the canvas width IF the canvas is less than the window width
  var biggest_width = window.innerWidth > canvas.width ? canvas.width : window.innerWidth
  var action_bar_x = (biggest_width / 2) - (action_bar_width / 2) 
  var action_bar_y = canvas_rect.height - tile_size * 4
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
const mage_img = new Image();
mage_img.src = "crisiscorepeeps.png"

var character = {
  id: 1,
  x: canvas_rect.width / 2,
  y: canvas_rect.height / 2,
  width: tile_size * 2,
  height: tile_size * 2,
  moving: false,
  draw: function() {
    ctx.drawImage(mage_img, 0, 0, 32, 32, this.x - camera.x, this.y - camera.y, this.width, this.height)
  }
}

var base_red = {
  id: 2,
  x: 0,
  y: tile_size * 30,
  width: tile_size * 6,
  height: tile_size * 6,
  draw: function() { draw_square(this.x, this.y, this.width, this.height, "rgba(0, 0, 0, 0.0)") }
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

var entities = [character]
// END - Entities

var target_movement = {
  x: 0,
  y: 0
}

var bitmap = []

const on_click = function (ev) {
  if (paint_mode) {
    console.log(ev.clientX)
    console.log(ev.clientY)
    bitmap.push({x:ev.clientX, y: ev.clientY, width: tile_size, height: tile_size})
  } else {
    target_movement.x = ev.clientX + camera.x - (character.width / 2)
    target_movement.y = ev.clientY + camera.y - (character.height / 2)
    character.moving = true
    console.log(target_movement)
  }
}

var tracking_mouse_map_move = false

const scroll_speed = 2
const MAP_WIDTH = 2800
const MAP_HEIGHT = 3200
canvas.addEventListener("mousemove", function(e) {
  if (tracking_mouse_map_move) {
    var horizontal = (e.clientX > canvas_rect.width / 2 ? "right" : "left")
    var vertical = (e.clientY > canvas_rect.height / 2 ? "up" : "down")
    if ((horizontal === "right") && (camera.x + scroll_speed < MAP_WIDTH)) {
      camera.x = camera.x + scroll_speed
    }
    if ((horizontal === "left") && (camera.x - scroll_speed >= 0)) {
      camera.x = camera.x - scroll_speed
    }2048
    if ((vertical === "up") && (camera.y + scroll_speed <= MAP_HEIGHT)) {
      camera.y = camera.y + scroll_speed
    }
    if ((vertical === "down") && (camera.y - scroll_speed >= 0)) {
      camera.y = camera.y - scroll_speed
    }
  }
}, false)

var paint_mode = false
canvas.addEventListener("click", on_click, false);
// debugger function
window.addEventListener("keydown", function (e) {
  switch (e.key) {
  case "ArrowLeft":
    camera.x = camera.x - 10
    break;
  case "ArrowRight":
    camera.x = camera.x + 10
    break;
  case "ArrowDown":
    camera.y = camera.y + 10
    break;
  case "ArrowUp":
    camera.y = camera.y - 10
    break;
  case "Shift":
    tracking_mouse_map_move = true
    break;
  case "z":
    camera.x = character.x - canvas_rect.width / 2
    camera.y = character.y - canvas_rect.height / 2
    break;
  case "r":
    console.log("Character")
    console.log(character)
    console.log("Camera")
    console.log(camera)
    break
  case "p":
    //map paint mode
    paint_mode = !paint_mode
    break;
  default:
    console.log(e.key)
  }
}, false)

window.addEventListener("keyup", function(e) {
  switch(e.key) {
  case "Shift":
    tracking_mouse_map_move= false
    break
  }
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

const camera = { x: 0, y: 0 }
const game_map = new Image()
game_map.src = "map4096.jpeg"
var map_width = 4096

function game_loop() {
  clear_screen()
  // Map
  ctx.drawImage(game_map, camera.x, camera.y, map_width, map_width, 0, 0, map_width, map_width)
  if (paint_mode) {
    draw_grid(ctx, canvas_rect, tile_size);
    bitmap.forEach((bit) => {
      draw_square(bit.x, bit.y, tile_size, tile_size, "purple")
    })
  }
  // END - Map
  draw()
  // Character Movement
  if (character.moving) {
    var future_movement = { ...character }

    if ((distance(character.x, target_movement.x) <= 1) && (distance(character.y, target_movement.y) <= 1)) {
      character.moving = false;
      target_movement = {}
      console.log("Stopped");
    } else {
      // Draw movement target
      ctx.beginPath()
      ctx.arc((target_movement.x - camera.x), (target_movement.y - camera.y), 20, 0, 2 * Math.PI, false)
      ctx.strokeStyle = "purple"
      ctx.lineWidth = 4;
      ctx.stroke()
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
    }

    if ((entities.every(function(entity) { return entity.id === character.id || !is_colliding(future_movement, entity) })) &&
      (!bitmap.some(function(bit) { return is_colliding(future_movement, bit) }))) {
      character.x = future_movement.x
      character.y = future_movement.y
    } else {
      console.log("Blocked");
      character.moving = false
    }
  }
  // END - Character Movement

  // Creep movement
  // If the distance from the character position to the target is 1 or less
  //var target = { ...base_red }
  //if (distance(creep.x, target.x) > 1 + tile_size) {
  //  if (creep.x > target.x) {
  //    creep.x = creep.x - 1;
  //  } else {
  //    creep.x = creep.x + 1;
  //  }
  //}
  //if (distance(creep.y, target.y) > 1 + tile_size) {
  //  if (creep.y > target.y) {
  //    creep.y = creep.y - 1;
  //  } else {
  //    creep.y = creep.y + 1;
  //  }
  //}
  // END - Creep movement

  draw_action_bar()

  requestAnimationFrame(game_loop)
};

requestAnimationFrame(game_loop)
