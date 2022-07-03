import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import KeyboardInput from "./keyboard_input.js"
import { is_colliding, Vector2, random } from "./tapete.js"
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
import Controls from "./controls.js"
import Item from "./item"
import Server from "./server"
import Tile from "./tile.js"
import LootBox from "./loot_box.js"
import Loot from "./loot.js"

const go = new GameObject()
const screen = new Screen(go)
const camera = new Camera(go)
const character = new Character(go)
const keyboard_input = new KeyboardInput(go)
const world = new World(go)
const controls = new Controls(go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const server = new Server(go)
const loot_box = new LootBox(go)

const click_callbacks = setClickCallback(go)
click_callbacks.push(clickable_clicked)
function clickable_clicked(ev) {
  go.clickables.forEach((clickable) => {
    let click = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
    if (is_colliding(clickable, click)) {
      clickable.activated = !clickable.activated
    }
  })
}

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
mouseup_callbacks.push(loot_box.check_item_clicked.bind(loot_box))
const touchstart_callbacks = setTouchstartCallback(go)
touchstart_callbacks.push((ev) => mouse_is_down = true)
const touchend_callbacks = setTouchendCallback(go)
touchend_callbacks.push((ev) => mouse_is_down = false)
function controls_movement() {
  go.clickables.forEach((clickable) => {
    if (clickable.activated) {
      clickable.click()
    }
  })
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
  controls_movement()
}

const draw = () => {
  screen.draw()
  character.draw()
  trees.forEach(tree => tree.draw())
  screen.draw_fog()
  loot_box.draw()
  // controls.draw()
}

const dice = (sides, times = 1) => {
  return Array.from(Array(times)).map((i) => Math.floor(Math.random() * sides) + 1);
}


const make_fire = () => {
  let dry_leaves = character.inventory.find("dry leaves")
  let wood = character.inventory.find("wood")
  if (dry_leaves && dry_leaves.quantity > 0 && wood && wood.quantity > 0) {
    dry_leaves.quantity -= 1
    wood.quantity -= 1
    let row_index = Math.floor(character.x / 64)
    let column_index = Math.floor(character.y / 64)
    go.world.tiles[row_index][column_index] = new Tile("bonfire.png", 250, 300, 290, 250)
  } else {
    console.log("You dont have all required materials to make a fire.")
  }
}

let loot_table_tree = [{
  item: { name: "Wood", image_src: "branch.png" },
  min: 1,
  max: 3,
  chance: 95
},
{
  item: { name: "Dry Leaves", image_src: "leaves.jpeg" },
  min: 1,
  max: 3,
  chance: 60
}]

const roll_loot = (loot_table) => {
  let result = loot_table.map((loot_entry) => {
      let roll = dice(100)
      if (roll <= loot_entry.chance) {
        const item_bundle = new Item(loot_entry.item.name)
        item_bundle.image.src = loot_entry.item.image_src
        item_bundle.quantity = random(loot_entry.min, loot_entry.max)
        return new Loot(item_bundle, item_bundle.quantity)
      }
  }).filter((entry) => entry !== undefined)
  return result
}

const cut_tree = () => {
  const targeted_tree = trees.find((tree) => Vector2.distance(tree, character) < 100)
  if (targeted_tree) {
    const index = trees.indexOf(targeted_tree)
    if (index > -1) {
      loot_box.items = roll_loot(loot_table_tree)
      loot_box.show()
      trees.splice(index, 1)
    }
  }
}

keyboard_input.key_callbacks["f"] = [cut_tree]

const game_loop = new GameLoop()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down
game_loop.update = update
keyboard_input.on_keydown_callbacks[1].push(() => make_fire())

const start = () => {
  character.x = 100
  character.y = 100
  go.world.generate_map()

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()
