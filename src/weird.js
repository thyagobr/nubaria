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
import CastingBar from "./casting_bar.js"
import Creep from "./creep.js"
import Projectile from "./projectile.js"

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
// const cold = new ResourceBar({ go, x: 5, y: 5, width: 200, height: 20 })
const casting_bar = new CastingBar({ go })

// Creep
const creeps = [];
for (let i = 0; i < 10; i++) {
  let creep = new Creep(go);
  creep.x = Math.random() * go.world.width
  creep.y = Math.random() * go.world.height
  go.clickables.push(creep);
  creeps.push(creep);
}
// END - Creep

const click_callbacks = setClickCallback(go)
click_callbacks.push(clickable_clicked)
function clickable_clicked(ev) {
  let click = { x: ev.clientX + go.camera.x, y: ev.clientY + go.camera.y, width: 1, height: 1 }
  const clickable = go.clickables.find((clickable) => is_colliding(clickable, click))
  if (clickable) {
    clickable.activated = !clickable.activated
  }
  go.selected_clickable = clickable
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
  // go.clickables.forEach((clickable) => {
  //   if (clickable.activated) {
  //     clickable.click()
  //   }
  // })
}

let current_cold_level = 100
function update_cold_level() {
  if (fires.find((fire) => Vector2.distance(fire, character) <= 150)) {
    if (current_cold_level < 100) {
      if (current_cold_level + 5 > 100) {
        current_cold_level = 100
      } else {
        current_cold_level += 5;
      }
    }
  } else {
    current_cold_level -= 1;
  }
}

function update_boonfires_fuel() {
  for (let index = 0; index < fires.length; index++) {
    let fire = fires[index]
    if (fire.fuel <= 0) {
      fires.splice(index, 1);
    } else {
      fire.fuel -= 1;
      fire.resource_bar.current -= 1;
    }
  }
}

let FPS = 30
let last_tick = Date.now()

const spell = new Projectile(go);
const cast_spell = () => {
  if (spell.active) return;
  if ((go.selected_clickable === null) || (go.selected_clickable === undefined)) return;

  spell.start_position = { x: character.x + 50, y: character.y + 50 }
  spell.current_position = { x: character.x + 50, y: character.y + 50 }
  spell.end_position = {
    x: go.selected_clickable.x + go.selected_clickable.width / 2,
    y: go.selected_clickable.y + go.selected_clickable.height / 2
  }
  spell.active = true
}
keyboard_input.on_keydown_callbacks["q"] = [cast_spell]

const update = () => {
  if ((Date.now() - last_tick) > 1000) {
    update_fps()
    last_tick = Date.now()
  }
  controls_movement()
  check_collisions()
}

const check_collisions = () => {
  if ((spell.active) && (is_colliding(spell.bounds(), go.selected_clickable))) {
    go.selected_clickable.current_hp -= 10;
    if (go.selected_clickable.current_hp <= 0) {
      remove_object_if_present(go.selected_clickable, creeps)
      remove_object_if_present(go.selected_clickable, go.clickables)
      go.selected_clickable = null;
    }
    spell.active = false;
  }
}

function update_fps() {
  update_cold_level()
  update_boonfires_fuel()
}
// Comment
const draw = () => {
  screen.draw()
  stones.forEach(stone => stone.draw())
  trees.forEach(tree => tree.draw())
  fires.forEach(fire => fire.draw())
  go.draw_selected_clickable()
  spell.draw()
  character.draw()
  creeps.forEach(creep => creep.draw())
  screen.draw_fog()
  loot_box.draw()
  // cold.draw(100, current_cold_level)
  // casting_bar.draw()
  if (show_control_wheel) draw_control_wheel()
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
    casting_bar.start(1500)

    setTimeout(() => {
      dry_leaves.quantity -= 1
      wood.quantity -= 1
      if (go.selected_clickable &&
        go.selected_clickable.type === "BONFIRE") {
        let fire = fires.find((fire) => go.selected_clickable === fire);
        fire.fuel += 20;
        fire.resource_bar.current += 20;
      } else {
        let fire = new Doodad({ go })
        fire.type = "BONFIRE"
        fire.image.src = "bonfire.png"
        fire.image_x_offset = 250
        fire.image_y_offset = 250
        fire.image_height = 350
        fire.image_width = 300
        fire.width = 64
        fire.height = 64
        fire.x = character.x;
        fire.y = character.y;
        fire.fuel = 20;
        fire.resource_bar = new ResourceBar({ go, x: fire.x, y: fire.y + fire.height, width: fire.width, height: 5 })
        fire.resource_bar.static = true
        fire.resource_bar.full = 20;
        fire.resource_bar.current = 20;
        fires.push(fire)
        go.clickables.push(fire)
      }
    }, 1500)
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
  go.clickables.push(tree)
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
  chance: 100
}]

function remove_clickable(doodad) {
  const clickable_index = go.clickables.indexOf(doodad)
  if (clickable_index > -1) {
    go.clickables.splice(clickable_index, 1)
  }
  if (go.selected_clickable === doodad) {
    go.selected_clickable = null
  }
}

const cut_tree = () => {
  const targeted_tree = trees.find((tree) => tree === go.selected_clickable)
  if ((!targeted_tree) || (Vector2.distance(targeted_tree, character) > 100)) {
    return;
  }

  casting_bar.start(3000, () => {
    const index = trees.indexOf(targeted_tree)
    if (index > -1) {
      loot_box.items = roll_loot(loot_table_tree)
      loot_box.show()
      trees.splice(index, 1)
    }
    remove_clickable(targeted_tree)
  });
}
keyboard_input.key_callbacks["f"] = [cut_tree]

let ordered_clickables = [];
const tab_cycling = (ev) => {
  ev.preventDefault()
  ordered_clickables = go.clickables.sort((a, b) => {
    return Vector2.distance(a, character) - Vector2.distance(b, character);
  })
  if (Vector2.distance(ordered_clickables[0], character) > 500) return;

  if (ordered_clickables[0] === go.selected_clickable) {
    go.selected_clickable = ordered_clickables[1];
  } else {
    go.selected_clickable = ordered_clickables[0]
  }
}
keyboard_input.on_keydown_callbacks["Tab"] = [tab_cycling]

let show_control_wheel = false
const draw_control_wheel = () => {
  go.ctx.beginPath()
  go.ctx.arc(
    character.x + (character.width / 2) - go.camera.x,
    character.y + (character.height / 2) - go.camera.y,
    200, 2 * Math.PI, false);
  go.ctx.lineWidth = 5
  go.ctx.strokeStyle = "white"
  go.ctx.stroke();
}
const toggle_control_wheel = () => { show_control_wheel = !show_control_wheel }
keyboard_input.on_keydown_callbacks["c"] = [toggle_control_wheel]

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
  go.clickables.push(stone)
})

let loot_table_stone = [{
  item: { name: "Flintstone", image_src: "flintstone.png" },
  min: 1,
  max: 1,
  chance: 100
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
  const targeted_stone = stones.find((stone) => stone === go.selected_clickable)
  if ((!targeted_stone) || (Vector2.distance(targeted_stone, character) > 100)) {
    return;
  }

  casting_bar.start(3000, () => {
    const index = stones.indexOf(targeted_stone)
    if (index > -1) {
      loot_box.items = roll_loot(loot_table_stone)
      loot_box.show()
      stones.splice(index, 1)
      remove_clickable(targeted_stone)
    }
  })
}
keyboard_input.key_callbacks["f"].push(break_stone)

function remove_object_if_present(object, list) {
  const index = list.indexOf(object);
  if (index > -1) {
    return list.splice(index, 1)[0]
  } else {
    return false
  }
}

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