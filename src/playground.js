import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Board from "./board.js"
import Camera from "./camera.js"
import Character from "./character.js"

const go = new GameObject()
const screen = new Screen(go)
const board = new Board(go)
const camera = new Camera(go)
const character = new Character(go)

const FPS = 16.66

// Click callbacks
const set_mouse_click_movement = function(ev) {
  let target_movement = {}
  target_movement.x = ev.clientX + camera.x
  target_movement.y = ev.clientY + camera.y
  target_movement = board.get_node_for(target_movement)
  board.set_target(target_movement)
  character.moving = true
}

const game_mode_callbacks = [set_mouse_click_movement]
const on_click = function (ev) {
  game_mode_callbacks.forEach((callback) => {
    callback(ev)
  })
}
go.canvas.addEventListener("click", on_click, false);
// END Click callbacks

// Mousemove callbacks
const mousemove_callbacks = [go.camera.move_camera_with_mouse]
const on_mousemove = (ev) => {
  mousemove_callbacks.forEach((callback) => {
    callback(ev)
  })
}
go.canvas.addEventListener("mousemove", on_mousemove, false)
// END Mousemove callbacks

const draw = () => {
  screen.draw()
  board.draw()
  character.draw()
}

function game_loop() {
  if (character.moving) {
    board.move()
  }

  draw()

  setTimeout(game_loop, FPS)
}
setTimeout(game_loop, FPS)
