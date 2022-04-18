import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Board from "./board.js"
import Camera from "./camera.js"
import Character from "./character.js"
import Editor from "./editor.js"
import Creep from "./creep.js"

const go = new GameObject()
const screen = new Screen(go)
const board = new Board(go)
const camera = new Camera(go)
const character = new Character(go)
const editor = new Editor(go)

const creep = new Creep(go)
creep.image.src = "zergling.png"
creep.image_width = 150
creep.image_height = 150
creep.width = go.tile_size * 4
creep.height = go.tile_size * 4
creep.moving = true

const FPS = 16.66

// Click callbacks
const set_mouse_click_movement = function(ev) {
  let target_movement = {}
  target_movement.x = ev.clientX + camera.x
  target_movement.y = ev.clientY + camera.y
  target_movement = board.get_node_for(target_movement)
  board.set_target(target_movement)
  character.movement_board = []
  character.moving = true
}

const edit_mode_callbacks = [editor.paint_on_click_callback]
const game_mode_callbacks = [set_mouse_click_movement]
const on_click = function (ev) {
  if (go.editor.paint_mode) {
    edit_mode_callbacks.forEach((callback) => {
      callback(ev)
    })
  } else {
    game_mode_callbacks.forEach((callback) => {
      callback(ev)
    })
  }
}
// go.canvas.addEventListener("click", on_click, false);
// END Click callbacks

// Mousemove callbacks
const mousemove_callbacks = [go.camera.move_camera_with_mouse]
const on_mousemove = (ev) => {
  mousemove_callbacks.forEach((callback) => {
    callback(ev)
  })
}
//go.canvas.addEventListener("mousemove", on_mousemove, false)
// END Mousemove callbacks

const on_keydown = (ev) => {
  switch (ev.key) {
    case "d":
      character.x += 10
    case "w":
      character.y -= 5
    case "a":
      character.x -= 5
    case "s":
      character.y += 5
  }
  console.log(ev.key)
}
window.addEventListener("keydown", on_keydown, false)

const draw = () => {
  screen.draw()
  board.draw()
  character.draw()
  if (go.editor.paint_mode) editor.draw()
  if (character.moving) {
    go.character.draw_movement_target(go.board.target_node)
  }
}

const start = () => {
  //character.move_to_waypoint("green_spawn_heroes")
  character.x = 100
  character.y = 100

  // Sample creep
  //creep.move_to_waypoint("black_middle_creep_spawn")
  //creep.set_movement_target("green_tower_mid_first")

  setTimeout(game_loop, FPS)
}

function game_loop() {
  if (character.moving) {
    character.move()
  }
  creep.move()

  draw()

  setTimeout(game_loop, 33.33)
}

start()
