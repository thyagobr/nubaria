import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import KeyboardInput from "./keyboard_input.js"
import { is_colliding, Vector2, random, remove_object_if_present } from "./tapete.js"
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
import Server from "./server"
import LootBox from "./loot_box.js"
import Creep from "./beings/creep.js"
import ActionBar from "./action_bar.js"
import Stone from "./beings/stone.js"
import Tree from "./beings/tree.js"
import Editor from "./editor/index.js"
import ResourceBar from "./resource_bar.js"
import StartMenu from "./start_menu.js"

const go = new GameObject()
// ---
// Disable right mouse click
go.canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }

const click_callbacks = setClickCallback(go)
const mousemove_callbacks = setMouseMoveCallback(go)
const mousedown_callbacks = setMousedownCallback(go)
const mouseup_callbacks = setMouseupCallback(go)
const touchstart_callbacks = setTouchstartCallback(go)
const touchend_callbacks = setTouchendCallback(go)

//-----
const screen = new Screen(go)
const start_menu = new StartMenu({ go })
const camera = new Camera(go)
const character = new Character(go)
const keyboard_input = new KeyboardInput(go)
const world = new World(go)
const controls = new Controls(go)
const server = new Server(go)
const loot_box = new LootBox(go)
const action_bar = new ActionBar(go)
const editor = new Editor({ go })
const experience_bar = new ResourceBar({ go, target: { x: go.screen.width / 2 - 500, y: go.screen.height - 30, width: 1000, height: 5 }, colour: "purple", border: "white", fixed: true });
experience_bar.height = 30

// Callbacks
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  go.mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y,
    width: 1,
    height: 1
  }
}

go.mouse_position = {}
let mouse_is_down = false
mousedown_callbacks.push((ev) => mouse_is_down = true)
mouseup_callbacks.push((ev) => mouse_is_down = false)
mouseup_callbacks.push(loot_box.check_item_clicked.bind(loot_box))
touchstart_callbacks.push((ev) => mouse_is_down = true)
touchend_callbacks.push((ev) => mouse_is_down = false)

function clickable_clicked(ev) {
  let click = { x: ev.clientX + go.camera.x, y: ev.clientY + go.camera.y, width: 1, height: 1 }
  const clickable = go.clickables.find((clickable) => is_colliding(clickable, click))
  if (clickable) {
    clickable.activated = !clickable.activated
  }
  go.selected_clickable = clickable
}
click_callbacks.push(clickable_clicked)

mousemove_callbacks.push(track_mouse_position)

keyboard_input.on_keydown_callbacks['Escape'] = [character.escape_key]
keyboard_input.on_keydown_callbacks.f = [character.skill_action]
keyboard_input.on_keydown_callbacks[0] = [character.skills.make_fire]
keyboard_input.on_keydown_callbacks[1] = [character.spells.frostbolt]
keyboard_input.on_keydown_callbacks[2] = [character.spells.blink]
keyboard_input.on_keydown_callbacks.i = [character.inventory.toggle_display]
keyboard_input.on_keydown_callbacks.b = [character.board.toggle_grid]
keyboard_input.on_keydown_callbacks.e = [() => editor.active = !editor.active]
//keyboard_input.on_keydown_callbacks.p = [board.way_to_player]

// END -- Callbacks

let elapsed_time = 0
let last_tick = Date.now()
let frames = 0;
const update = () => {
  if (start_menu.active) {
    start_menu.update()
    return;
  }
  frames += 1;
  elapsed_time = Date.now() - last_tick
  if ((elapsed_time) > 1000) {
    frames = 0;
    last_tick = Date.now()
    update_fps()
  }
  if (!character.stats.is_alive()) {
    controls_movement()
  } else {
    go.update_objects()
  }
}

function update_fps() {
  if (start_menu.active) return;

  if (character.stats.is_alive()) {
    character.update_fps()
  }
  go.update_fps_objects()
}
// Comment
const draw = () => {
  if (start_menu.active) {
    start_menu.draw();
    return
  }
  if (character.stats.is_dead()) {
    screen.draw_game_over()
  } else {
    screen.draw()
    go.draw_selected_clickable()
    go.draw_objects()
    character.draw()
    screen.draw_fog()
    loot_box.draw()
    go.character.inventory.draw()
    action_bar.draw()
    character.board.draw()
    editor.draw()
    experience_bar.draw(1000, go.character.experience_points)
    if (show_control_wheel) draw_control_wheel()
  }
} 

// Trees
Array.from(Array(300)).forEach((j, i) => {
  let tree = new Tree({ go })
  go.trees.push(tree)
  go.clickables.push(tree)
})
// Stones
Array.from(Array(300)).forEach((j, i) => {
  const stone = new Stone({ go });
  go.stones.push(stone)
  go.clickables.push(stone)
})
// Creep
for (let i = 0; i < 50; i++) {
  let creep = new Creep({ go });
  go.clickables.push(creep);
}
const dummy = new Creep({ go })
dummy.x = 800;
dummy.y = 200;
go.clickables.push(dummy)

let ordered_clickables = [];
const tab_cycling = (ev) => {
  ev.preventDefault()
  ordered_clickables = go.creeps.sort((a, b) => {
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

const game_loop = new GameLoop()
game_loop.draw = draw
game_loop.process_keys_down = go.keyboard_input.process_keys_down
game_loop.update = update

const start = () => {
  character.x = 100
  character.y = 100
  go.world.generate_map()

  window.requestAnimationFrame(game_loop.loop.bind(game_loop));
}

start()