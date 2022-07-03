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
import ResourceBar from "./resource_bar.js"

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
const cold = new ResourceBar({ go, x: 5, y: 5, width: 200, height: 20 })

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

let current_cold_level = 100
function update_cold_level() {
  if (fires.find((fire) => Vector2.distance(fire, character) <= 50)) {
    if (current_cold_level < 100) {
      if (current_cold_level + 5 > 100) {
        current_cold_level = 100
      } else {
      current_cold_level += 5;
      }
    }
  }
  current_cold_level -= 1;
}

let FPS = 30
let last_tick = Date.now()

const update = () => {
  if ((Date.now() - last_tick) > 1000) {
    update_fps()
    last_tick = Date.now()
  }
  controls_movement()
}

function update_fps() {
  update_cold_level()
}

const draw = () => {
  screen.draw()
  character.draw()
  trees.forEach(tree => tree.draw())
  stones.forEach(stone => stone.draw())
  screen.draw_fog()
  loot_box.draw()
  cold.draw(100, current_cold_level)
  // controls.draw()a
}

const dice = (sides, times = 1) => {
  return Array.from(Array(times)).map((i) => Math.floor(Math.random() * sides) + 1);
}

const fires = []
const make_fire = () => {
  let dry_leaves = character.inventory.find("dry leaves")
  let wood = character.inventory.find("wood")
  let flintstone = character.inventory.find("flintstone")
  if (dry_leaves && dry_leaves.quantity > 0 &&
     wood && wood.quantity > 0 && 
     flintstone && flintstone.quantity > 0) {
    dry_leaves.quantity -= 1
    wood.quantity -= 1
    let row_index = Math.floor(character.x / 64)
    let column_index = Math.floor(character.y / 64)
    go.world.tiles[row_index][column_index] = new Tile("bonfire.png", 250, 300, 290, 250)
    fires.push({ x: character.x, y: character.y })
  } else {
    console.log("You dont have all required materials to make a fire.")
  }
}
//= Doodads

const trees = []
Array.from(Array(300)).forEach((j, i) => {
  let tree = new Doodad({ go })
  tree.x = Math.trunc(Math.random() * go.world.width) - tree.width;
  tree.y = Math.trunc(Math.random() * go.world.height) - tree.height;
  trees.push(tree)
})

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

const stones = []
Array.from(Array(300)).forEach((j, i) => {
  let stone = new Doodad({ go })
  stone.image.src = "flintstone.png"
  stone.x = Math.trunc(Math.random() * go.world.width);
  stone.y = Math.trunc(Math.random() * go.world.height);
  stone.image_width = 840
  stone.image_height = 859
  stone.image_x_offset = 0
  stone.image_y_offset = 0
  stone.width = 32
  stone.height = 32
  stones.push(stone)
})

let loot_table_stone = [{
  item: { name: "Flintstone", image_src: "flintstone.png"},
  min: 1,
  max: 1,
  chance: 30
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

const break_stone = () => {
  const targeted_stone = stones.find((stone) => Vector2.distance(stone, character) < 100)
  if (targeted_stone) {
    const index = stones.indexOf(targeted_stone)
    if (index > -1) {
      loot_box.items = roll_loot(loot_table_stone)
      loot_box.show()
      stones.splice(index, 1)
    }
  }
}
keyboard_input.key_callbacks["f"].push(break_stone)

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
