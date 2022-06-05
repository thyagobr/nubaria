import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import KeyboardInput from "./keyboard_input.js"
import { is_colliding, Vector2 } from "./tapete.js"
import {
  setClickCallback,
  setMouseMoveCallback,
  setMouseupCallback,
  setMousedownCallback,
  setTouchstartCallback,
  setTouchendCallback,
} from "./events_callbacks.js"
import GameLoop from "./game_loop.js"
import World from "./world.js"
import Doodad from "./doodad.js"

const go = new GameObject()
const screen = new Screen(go)
const camera = new Camera(go)
const keyboard_input = new KeyboardInput(go)
const character = new Character(go)
const world = new World(go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`

let mouse_is_down = false
let mouse_position = {}
const mousemove_callbacks = setMouseMoveCallback(go)
mousemove_callbacks.push(track_mouse_position)
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y
  }
}
const mousedown_callbacks = setMousedownCallback(go)
mousedown_callbacks.push((ev) => mouse_is_down = true)
const mouseup_callbacks = setMouseupCallback(go)
mouseup_callbacks.push((ev) => mouse_is_down = false)
const touchstart_callbacks = setTouchstartCallback(go)
touchstart_callbacks.push((ev) => mouse_is_down = true)
const touchend_callbacks = setTouchendCallback(go)
touchend_callbacks.push((ev) => mouse_is_down = false)
function mouse_movement() {
  if (!mouse_is_down) return;

  if (mouse_position.x > character.x) {
    character.move("right")
  }

  if (mouse_position.x < character.x) {
    character.move("left")
  }

  if (mouse_position.y < character.y) {
    character.move("up")
  }

  if (mouse_position.y > character.y) {
    character.move("down")
  }
}

const trees = []
Array.from(Array(300)).forEach((j, i) => {
  let tree = new Doodad(go)
  tree.x = Math.trunc(Math.random() * go.world.width) - tree.width;
  tree.y = Math.trunc(Math.random() * go.world.height) - tree.height;
  trees.push(tree)
})

const FPS = 16.66

const update = () => {
  mouse_movement()
}

const draw = () => {
  screen.draw()
  character.draw()
  trees.forEach(tree => tree.draw())
  screen.draw_fog()
}

const game_loop = new GameLoop()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down
game_loop.update = update

const start = () => {
  character.x = 100
  character.y = 100

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()
