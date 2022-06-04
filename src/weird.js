import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import Creep from "./creep.js"
import { is_colliding, Vector2 } from "./tapete.js"
import { setMousemoveCallback } from "./events_callbacks.js"
import GameLoop from "./game_loop.js"

const go = new GameObject()
const screen = new Screen(go)
const camera = new Camera(go)
const character = new Character(go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const players = []

const FPS = 16.66

const mousemove_callbacks = setMousemoveCallback(go);
mousemove_callbacks.push(go.camera.move_camera_with_mouse)
mousemove_callbacks.push(track_mouse_position)

let mouse_position = { x: 0, y: 0 }
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y
  }
}

// BEGIN: Key handling
let keymap = {
  d: "right",
  w: "up",
  a: "left",
  s: "down",
}

let keys_currently_down = {
  d: false,
  w: false,
  a: false,
  s: false,
}

const on_keydown = (ev) => {
  keys_currently_down[ev.key] = true
}
window.addEventListener("keydown", on_keydown, false)
const on_keyup = (ev) => {
  keys_currently_down[ev.key] = false
}
window.addEventListener("keyup", on_keyup, false)

const process_keys_down = () => {
  const keys_down = Object.keys(keys_currently_down).filter((key) => keys_currently_down[key] === true)
  keys_down.forEach((key) => {
    switch (key) {
      case "d":
      case "w":
      case "a":
      case "s":
        character.move(keymap[key])
        break
    }
  })
}
// END: Key handling

const draw = () => {
  screen.draw()
  character.draw()
}

const game_loop = new GameLoop()
game_loop.draw = draw
game_loop.process_keys_down = process_keys_down

const start = () => {
  character.x = 100
  character.y = 100

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()
