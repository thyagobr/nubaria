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
const move_camera_on_canvas_bounds = (ev) => {
  if ((go.canvas_rect.height - ev.clientY) < 100) {
    go.camera.y = go.camera.y + 5
  } else if ((go.canvas_rect.height - ev.clientY) > go.canvas_rect.height - 100) {
    go.camera.y = go.camera.y - 5
  }

  if ((go.canvas_rect.width - ev.clientX) < 100) {
    go.camera.x = go.camera.x + 5
  } else if ((go.canvas_rect.width - ev.clientX) > go.canvas_rect.width - 100) {
    go.camera.x = go.camera.x - 5
  }
}
const mousemove_callbacks = [move_camera_on_canvas_bounds]
const on_mousemove = (ev) => {
  mousemove_callbacks.forEach((callback) => {
    callback(ev)
  })
}
go.canvas.addEventListener("mousemove", on_mousemove, false)
// END Mousemove callbacks

function game_loop() {
  screen.draw()
  if (character.moving) {
    board.move()
  }
  board.draw()
  character.draw()
  setTimeout(game_loop, 16.66)
}
setTimeout(game_loop, 500)
