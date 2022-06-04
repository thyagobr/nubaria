import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import KeyboardInput from "./keyboard_input.js"
import { is_colliding, Vector2 } from "./tapete.js"
import { setMousemoveCallback } from "./events_callbacks.js"
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

const trees = []
Array.from(Array(300)).forEach((j, i) => {
  let tree = new Doodad(go)
  tree.x = Math.trunc(Math.random() * go.world.width) - tree.width;
  tree.y = Math.trunc(Math.random() * go.world.height) - tree.height;
  trees.push(tree)
})

const FPS = 16.66

const draw = () => {
  screen.draw()
  character.draw()
  trees.forEach(tree => tree.draw())
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
