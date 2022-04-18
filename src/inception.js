import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import Creep from "./creep.js"
import { is_colliding } from "./tapete.js"

const go = new GameObject()
const screen = new Screen(go)
const camera = new Camera(go)
const character = new Character(go)

const FPS = 16.66

const creep = new Creep(go)
creep.image.src = "zergling.png"
creep.image_width = 150
creep.image_height = 150
creep.width = go.tile_size * 4
creep.height = go.tile_size * 4

const projectiles = []

let keys_currently_down = {
  d: false,
  w: false,
  a: false,
  s: false,
}

let keymap = {
  d: "right",
  w: "up",
  a: "left",
  s: "down",
}

let mouse_position = { x: 0, y: 0 }

const on_keydown = (ev) => {
  keys_currently_down[ev.key] = true
}

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

window.addEventListener("keydown", on_keydown, false)

const on_keyup = (ev) => {
  keys_currently_down[ev.key] = false
}
window.addEventListener("keyup", on_keyup, false)

const draw = () => {
  screen.draw()
  if (creep.is_alive()) {
    creep.draw()
  }
  character.draw()
  projectile.draw()
}

const start = () => {
  character.x = 100
  character.y = 100
  creep.x = 300
  creep.y = 176

  setTimeout(game_loop, FPS)
}

function game_loop() {
  check_collisions()
  process_keys_down()
  draw()

  setTimeout(game_loop, 33.33)
}

function on_mousemove(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}
go.canvas.addEventListener('mousemove', on_mousemove, false)

function on_click(evt) {
  projectiles.push({
    current: {
      x: character.x + (character.width / 2),
      y: character.y + (character.height / 2),
      width: 10,
      height: 10
    },
    origin: {
      x: character.x + (character.width / 2),
      y: character.y + (character.height / 2)
    },
    target: {
      x: mouse_position.x,
      y: mouse_position.y
    },
    distance: 20,
  })
}
go.canvas.addEventListener('click', on_click, false)

const projectile = {
  draw() {
    for (var i = 0; i < projectiles.length; i++) {
      let current = projectiles[i]
      if (current.distance > 300) {
        projectiles.splice(i, 1)
      } else {
        current.distance += 5

        var angle = Math.atan2(current.origin.x - current.target.x,
          current.origin.y - current.target.y)

        current.current.x = (current.origin.x) + current.distance * -Math.sin(angle) - camera.x
        current.current.y = (current.origin.y) + current.distance * -Math.cos(angle) - camera.y

        go.ctx.beginPath()
        go.ctx.fillStyle = "red"
        go.ctx.fillRect(current.current.x, current.current.y, 10, 10)
        go.ctx.stroke()
      }
    }
  }
}

function check_collisions() {
    for (var i = 0; i < projectiles.length; i++) {
      let projectile = projectiles[i]
    // console.log(`Projectile: (${projectile.current.x}, ${projectile.current.y},${projectile.current.width},${projectile.current.height})`)
    // console.log(`Creep:      (${creep.x}, ${creep.y},${creep.width},${creep.height})`)
    if (is_colliding(projectile.current, creep)) {
      projectiles.splice(i, 1)
      creep.current_hp -= 5
    }
  }
}

start()
