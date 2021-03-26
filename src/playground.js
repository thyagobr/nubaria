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

function game_loop() {
  screen.clear()
  if (character.moving) {
    board.move()
  }
  board.draw()
  character.draw()
  setTimeout(game_loop, 30)
}
setTimeout(game_loop, 500)
