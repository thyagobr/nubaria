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

import Board from "./board.js"
const board = new Board(game_object)
game_object.board = board

import Editor from "./editor.js"
const editor = new Editor(game_object)
game_object.editor = editor

import ActionBar from "./action_bar.js"
const action_bar = new ActionBar(game_object)

import Character from "./character.js"
const character = new Character(game_object, editor, 1)
var character_wp = editor.waypoints.find((wp) => wp.name === "spawn_character")
character.coords(character_wp)
game_object.character = character

const zergling = new Character(game_object, editor, 2)
var enemy_base_hero_spawn_wp = editor.waypoints.find((wp) => wp.name === "enemy_base_hero_spawn")
var ally_base_middle_tower_1 = editor.waypoints.find((wp) => wp.name === "ally_base_middle_tower_1") // target
zergling.coords(enemy_base_hero_spawn_wp)
// This should be refactored out
// Better idea is to put all the attributes in a object that is given to the class
zergling.image.src = "zergling.png"
zergling.image_width = 150
zergling.image_height = 150
zergling.width = game_object.tile_size * 4
zergling.height = game_object.tile_size * 4
zergling.moving = true

// Camera
const camera_focus_on = function(point) {
  var x = point.x - canvas_rect.width / 2
  var y = point.y - canvas_rect.height / 2
  // specific map cuts (it has a map offset of 60,160)
  if (x < 60) { x = 60 }
  if (y < 140) { y = 140 }
  // offset changes end
  camera.x = x
  camera.y = y
}
// END - Camera

camera_focus_on(character)

var entities = [character, zergling]
game_object.entities = entities

var target_movement = {
  x: 0,
  y: 0,
  width: 1,
  height: 1
}

const click_callbacks = []

const set_mouse_click_movement = function(ev) {
  console.log("click")
  target_movement.x = ev.clientX + camera.x //- (character.width / 2)
  target_movement.y = ev.clientY + camera.y //- (character.height / 2)
  //var click_target = { x: camera.x + event.clientX, y: camera.y + event.clientY, width: 1, height: 1 }
  target_movement = board.get_node_for(target_movement)
  board.set_target(target_movement)
  game_object.character.moving = true
  //character.find_path(target_movement)
  //character.moving = true
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
const mouse = { x: 0, y: 0 }
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

  mouse.x = e.clientX
  mouse.y = e.clientY
}, false)

const draw_ray_trace = function() {
  game_object.ctx.beginPath();
  game_object.ctx.strokeStyle = "blue"
  game_object.ctx.lineWidth = 5
  game_object.ctx.moveTo(character.x - camera.x + (character.width / 2), character.y - camera.y + (character.height / 2))
  game_object.ctx.lineTo(mouse.x, mouse.y)
  game_object.ctx.stroke();
}

var ray_trace_path = false
let current_node = null
window.addEventListener("keydown", function (e) {
  switch (e.key) {
  case "n":
    game_object.character.moving = true

    //if (current_node == null)
    //  current_node = board.get_node_for(character)
    //current_node = board.next_step(current_node, target_movement)
    //current_node.colour = "orange"
    break
  case "m":
    ray_trace_path = !ray_trace_path
    console.log(`Ray trace path ${ray_trace_path}`)
    break;
  case "Shift":
    tracking_mouse_map_move = true
    break;
  case "z":
    camera_focus_on(character)
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
    if (ray_trace_path) {
      draw_ray_trace()
    }
    if (editor.paint_mode) {
      editor.draw()
      board.draw()
    }
    if (character.moving) {
      console.log("ye")
      game_object.board.move()
    }
    //character.move_on_path()
    // This is making the purple-movement circle be activated for zerglings
    zergling.move(ally_base_middle_tower_1)
    action_bar.draw()

    requestAnimationFrame(game_loop)
  }
};

requestAnimationFrame(game_loop)
