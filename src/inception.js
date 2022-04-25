import GameObject from "./game_object.js"
import Screen from "./screen.js"
import Camera from "./camera.js"
import Character from "./character.js"
import Creep from "./creep.js"
import { is_colliding, Vector2 } from "./tapete.js"

const go = new GameObject()
const screen = new Screen(go)
const camera = new Camera(go)
const character = new Character(go)
character.name = `Player ${String(Math.floor(Math.random() * 10)).slice(0, 2)}`
const players = []

const FPS = 16.66

const mousemove_callbacks = [go.camera.move_camera_with_mouse, track_mouse_position]
const on_mousemove = (ev) => {
  mousemove_callbacks.forEach((callback) => {
    callback(ev)
  })
}
function track_mouse_position(evt) {
  var rect = go.canvas.getBoundingClientRect()
  mouse_position = {
    x: evt.clientX - rect.left + camera.x,
    y: evt.clientY - rect.top + camera.y
  }
}
go.canvas.addEventListener("mousemove", on_mousemove, false)
// END Mousemove callbacks

//function Server() {
//  this.conn = new WebSocket("ws://localhost:8999")
//  this.conn.onopen = () => this.login(character)
//  this.conn.onmessage = function(event) {
//    let payload = JSON.parse(event.data)
//    switch (payload.action) {
//      case "login":
//        let new_char = new Character(go)
//        new_char.name = payload.data.character.name
//        new_char.x = payload.data.character.x
//        new_char.y = payload.data.character.y
//        console.log(`Adding new char`)
//        players.push(new_char)
//        break;
//
//      case "ping":
//        go.ctx.fillRect(payload.data.character.x, payload.data.character.y, 50, 50)
//        go.ctx.stroke()
//        let player = players[0] //players.find(player => player.name === payload.data.character.name)
//        if (player) {
//          player.x = payload.data.character.x
//          player.y = payload.data.character.y
//        }
//        break;
//    }
//  } //
//  this.login = function(character) {
//    let payload = {
//      action: "login",
//      data: {
//        character: {
//          name: "Archon",
//          x: character.x,
//          y: character.y
//        }
//      }
//    }
//    this.conn.send(JSON.stringify(payload))
//  }
//
//  this.ping = function(character) {
//    let payload = {
//      action: "ping",
//      data: {
//        character: {
//          name: character.name, 
//          x: character.x,
//          y: character.y
//        }
//      }
//    }
//    this.conn.send(JSON.stringify(payload))
//  }
//}
//const server = new Server()

function spawn_creep() {
  let creep = new Creep(go)
  creep.image.src = "zergling.png"
  creep.image_width = 150
  creep.image_height = 150
  creep.width = go.tile_size * 4
  creep.height = go.tile_size * 4
  creep.x = 900
  creep.y = 20
  return creep
}

const creeps = [spawn_creep()]
const projectiles = []
let game_over = false

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

const tower = new Tower(go)

const draw = () => {
  screen.draw()
  players.forEach(player => {
    console.log("Drawing a player")
    player.draw()
  })
  creeps.forEach((creep) => {
    if (creep.is_alive()) {
      move_creep(creep)
      creep.draw()
    }
  })
  character.draw()
  projectile.draw()
  tower.draw()
  draw_score()
}

const start = () => {
  character.x = 100
  character.y = 100

  setTimeout(game_loop, FPS)
}

let last_time = Date.now()
let tower_shot_last_time = Date.now()

function game_loop() {
  if ((Date.now() - last_time) > 3000 - (creeps_killed * 20)) {
    last_time = Date.now()
    creeps.push(spawn_creep())
  }

  if ((Date.now() - tower_shot_last_time) > 1000) {
    tower_shot_last_time = Date.now()
    var targeted_creep = creeps.find(creep => Vector2.distance(creep, tower) < 500)
    if (targeted_creep) {
      tower.attack(targeted_creep)
    }
  }

  //server.ping(character)

  check_collisions(projectiles)
  check_collisions(tower_projectiles)
  process_keys_down()
  draw()

  // This is ending the game_loop
  // On a real case, we don't want the game over to cancel the loop
  if (character.is_dead()) {
    game_over = true
    screen.draw_game_over()
  } else {
    setTimeout(game_loop, 33.33)
  }
}

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

        current.current.x = (current.origin.x) + current.distance * -Math.sin(angle)
        current.current.y = (current.origin.y) + current.distance * -Math.cos(angle)

        go.ctx.beginPath()
        go.ctx.fillStyle = "red"
        go.ctx.fillRect(current.current.x - camera.x, current.current.y - camera.y, 10, 10)
        go.ctx.stroke()
      }
    }
  }
}

function move_creep(creep) {
  var angle = Math.atan2(creep.x - tower.collision_box.x,
    creep.y - tower.collision_box.y)

  let future = {
    ...creep,
    x: (creep.x) + creep.speed * -Math.sin(angle),
    y: (creep.y) + creep.speed * -Math.cos(angle)
  }

  if (!is_colliding(tower.collision_box, future)) {
    creep.x = future.x
    creep.y = future.y
  }
}

let creeps_killed = 0;
function check_collisions(projectiles) {
  // creeps collision
  for (var i = 0; i < projectiles.length; i++) {
    let projectile = projectiles[i]
    // console.log(`Projectile: (${projectile.current.x}, ${projectile.current.y},${projectile.current.width},${projectile.current.height})`)
    // console.log(`Creep:      (${creep.x}, ${creep.y},${creep.width},${creep.height})`)
    for (var creep_index = 0; creep_index < creeps.length; creep_index++) {
      let creep = creeps[creep_index]
      if (is_colliding(projectile.current, creep)) {
        // remove projectiles from existence
        projectiles.splice(i, 1)
        // damage
        creep.current_hp -= 5
        if (creep.is_dead()) {
          creeps.splice(creep_index, 1)
          creeps_killed += 1
        }
      }
    }
  }

  // player collisions
  for (var creep_index = 0; creep_index < creeps.length; creep_index++) {
    let creep = creeps[creep_index]
    if (is_colliding(character, creep)) {
      character.current_hp -= 5
    }
  }
}

// game ---
function draw_score() {
  go.ctx.font = "48px serif"
  go.ctx.fillText(`Creeps killed: ${creeps_killed}`, 10, 50)
}

const tower_projectiles = []
function Tower(go) {
  this.image = new Image();
  this.image.src = "radiant_tower.png"
  this.image_width = 32
  this.image_height = 32
  this.projectile_image = new Image()
  this.projectile_image.src = "blue_fire.png"
  this.id = 1
  this.x = 335
  this.y = 220
  this.width = 140
  this.height = this.image.height
  this.collision_box = {
    x: this.x + 30,
    y: this.y + 180,
    width: this.width,
    height: this.height
  },
  this.draw = function() {
    go.ctx.drawImage(this.image, this.x - go.camera.x, this.y - go.camera.y)
    this.draw_projectiles()
  }
  this.draw_projectiles = function() {
    for (var i = 0; i < tower_projectiles.length; i++) {
      let current = tower_projectiles[i]
      if (current.distance > 500) {
        tower_projectiles.splice(i, 1)
      } else {
        current.distance += 5

        var angle = Math.atan2(current.origin.x - current.target.x,
          current.origin.y - current.target.y)

        current.current.x = (current.origin.x) + current.distance * -Math.sin(angle)
        current.current.y = (current.origin.y) + current.distance * -Math.cos(angle)

        go.ctx.drawImage(this.projectile_image, current.current.x - camera.x, current.current.y - camera.y, 50, 50)
      }
    }
  }
  this.attack = function(target) {
    tower_projectiles.push({
      current: {
        x: this.x + (this.image.width / 2),
        y: this.y + (this.image.height / 2),
        width: 10,
        height: 10
      },
      origin: {
        x: this.x + (this.image.width / 2),
        y: this.y + (this.image.height / 2)
      },
      target: target,
      distance: 20,
    })
  }
}

start()
