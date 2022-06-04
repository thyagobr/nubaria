import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import KeyboardInput from "./keyboard_input.js"
import { is_colliding, Vector2 } from "./tapete.js"
import { setMousemoveCallback } from "./events_callbacks.js"
import GameLoop from "./game_loop.js"

const go = new GameObject()
const screen = new Screen(go)
const camera = new Camera(go)
const keyboard_input = new KeyboardInput(go)
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

const draw = () => {
  screen.draw()
  character.draw()
}

const game_loop = new GameLoop()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down

const start = () => {
  character.x = 100
  character.y = 100

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()
