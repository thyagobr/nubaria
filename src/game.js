import { distance, is_colliding } from "./tapete.js"

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

// Constants
const canvas_rect = canvas.getBoundingClientRect()
const tile_size = 20;
const SCREEN_WIDTH = canvas_rect.width;
const SCREEN_HEIGHT = canvas_rect.height;
const camera = { x: 0, y: 0 }

const game_object = {
  ctx,
  canvas_rect,
  tile_size,
  camera
}

import Editor from "./editor.js"
const editor = new Editor(game_object)

import ActionBar from "./action_bar.js"
const action_bar = new ActionBar(game_object)

import Character from "./character.js"
const character = new Character(game_object, editor, 1)

var entities = [character]
game_object.entities = entities

var target_movement = {
  x: 0,
  y: 0
}

const click_callbacks = []

const set_mouse_click_movement = function(ev) {
  target_movement.x = ev.clientX + camera.x - (character.width / 2)
  target_movement.y = ev.clientY + camera.y - (character.height / 2)
  character.moving = true
}

// Click callbacks
const edit_mode_callbacks = [editor.paint_on_click_callback]
const game_mode_callbacks = [set_mouse_click_movement]
const on_click = function (ev) {
  if (editor.paint_mode) {
    edit_mode_callbacks.forEach((callback) => {
      callback(ev)
    })
  } else {
    game_mode_callbacks.forEach((callback) => {
      callback(ev)
    })
  }
}
canvas.addEventListener("click", on_click, false);
// END - Click callbacks

var tracking_mouse_map_move = false

const scroll_speed = 2
const MAP_WIDTH = 2800
const MAP_HEIGHT = 3200
canvas.addEventListener("mousemove", function(e) {
  if (tracking_mouse_map_move) {
    var horizontal = (e.clientX > canvas_rect.width / 2 ? "right" : "left")
    var vertical = (e.clientY > canvas_rect.height / 2 ? "up" : "down")
    // 60 is this specific map's offset - not needed if map changes
    if ((horizontal === "right") && (camera.x + 60 + scroll_speed < MAP_WIDTH)) {
      camera.x = camera.x + scroll_speed
    }
    if ((horizontal === "left") && (camera.x - scroll_speed >= 60)) {
      camera.x = camera.x - scroll_speed
    }2048
    if ((vertical === "up") && (camera.y + 150 + scroll_speed <= MAP_HEIGHT)) {
      camera.y = camera.y + scroll_speed
    }
    if ((vertical === "down") && (camera.y - scroll_speed >= 150)) {
      camera.y = camera.y - scroll_speed
    }
  }
}, false)

window.addEventListener("keydown", function (e) {
  switch (e.key) {
  case "Shift":
    tracking_mouse_map_move = true
    break;
  case "z":
    var x = character.x - canvas_rect.width / 2
    var y = character.y - canvas_rect.height / 2
    // specific map cuts (it has a map offset of 60,160)
    if (x < 60) { x = 60 }
    if (y < 140) { y = 140 }
    // offset changes end
    camera.x = x
    camera.y = y
    break;
  case "r":
    console.log("Character")
    console.log(character)
    console.log("Camera")
    console.log(camera)
    break
  case "p":
    //map paint mode
    editor.paint_mode = !editor.paint_mode
    // Expand the screen for editor buttons
    if (editor.paint_mode) {
      canvas.width = canvas.width + 200
    } else {
      canvas.width = canvas.width - 200
    }

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

const clear_screen = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const draw = function() {
  entities.forEach((entity) => entity.draw())
}

const game_map = new Image()
game_map.src = "map4096.jpeg"
var map_width = 4096

var t0 = performance.now()
var t1 = performance.now()
const FPS = 30

const draw_map = function() {
  ctx.drawImage(game_map,
    camera.x + 60,
    camera.y + 160,
    canvas_rect.width,
    canvas_rect.height,
    0, 0,
    canvas_rect.width, canvas_rect.height)
}

function game_loop() {
  // FPS sync
  if (t1 - t0 < FPS) {
    t1 = performance.now()
    requestAnimationFrame(game_loop)
  } else {
    t0 = t1
  // END - FPS sync

    clear_screen()
    draw_map()
    draw()
    if (editor.paint_mode) {
      editor.draw()
    }
    character.move(target_movement)
    action_bar.draw()

    requestAnimationFrame(game_loop)
  }
};

requestAnimationFrame(game_loop)
