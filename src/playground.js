import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Board from "./board.js"
import Camera from "./camera.js"
import Character from "./character.js"
import Editor from "./editor.js"

const go = new GameObject()
const screen = new Screen(go)
const board = new Board(go)
const camera = new Camera(go)
const character = new Character(go)
const editor = new Editor(go)

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

const on_keydown = (ev) => {
  console.log(ev.key)
  switch (ev.key) {
  case "e":
    go.editor.paint_mode = !go.editor.paint_mode
    // Expand the screen for editor buttons
    if (go.editor.paint_mode) {
      go.canvas.width = go.canvas.width + 200
    } else {
      go.canvas.width = go.canvas.width - 200
    }
  }
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

function game_loop() {
  if (character.moving) {
    board.move()
  }

  draw()

  setTimeout(game_loop, FPS)
}
setTimeout(game_loop, FPS)
