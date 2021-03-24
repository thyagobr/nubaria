import { is_colliding } from "./tapete.js"

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

const canvas_rect = canvas.getBoundingClientRect()
const tile_size = 20;

const distance = function(a, b) { return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) }

function game_loop() {
  draw_grid(ctx, canvas_rect, tile_size)

  requestAnimationFrame(game_loop)
}
requestAnimationFrame(game_loop)

const grid = []
var current_origin_index = null
var initial_position_index = null

function Node(data) {
  this.x = data.x
  this.y = data.y
  this.width = tile_size
  this.height = tile_size
  this.colour = "white"
  this.border_colour = "black"
}

for (var j = 0; j <= (canvas_rect.height / tile_size); j++) {
  for (var i = 0; i <= (canvas_rect.width / tile_size); i++) {
    grid.push(new Node({ x: i * tile_size, y: j * tile_size }))
  }
}

var current_target_index = Math.trunc(Math.random() * grid.length)
grid[current_target_index].colour = "red"

const draw_grid = function (ctx, canvas_rect, tile_size) {
  grid.forEach((node) => {
    ctx.strokeStyle = node.border_colour
    ctx.fillStyle = node.colour
    ctx.fillRect(node.x, node.y, node.width, node.height)
    ctx.strokeRect(node.x, node.y, node.width, node.height)
  })
}

const find_node_index = function(x, y) {
  return grid.findIndex((node) => node.x == x && node.y == y)
}

let last_closest_node = {}
let brush_type = ""

const handle_click = function(event) {
  let node = null
  let index = null
  grid.forEach((each_node, each_index) => {
    var click_target = { x: event.clientX, y: event.clientY, width: 1, height: 1 }
    if (is_colliding(each_node, click_target)) {
      if (current_origin_index !== null) {
        grid[current_origin_index].colour = "white"
      }
      node = each_node
      index = each_index
      return
    }
  })

  switch (brush_type) {
  case "starting_point":
    node.colour = "blueviolet"
    last_closest_node = node
    current_origin_index = index
    initial_position_index = index
    break

  case "wall":
    node.block = true
    node.colour = "gray"
    break
  }
}
canvas.addEventListener("click", handle_click, false)


const walk_the_path = function(closest_node) {
  let visited = []
  let current_node = null
  var nodes_per_row = Math.trunc(canvas_rect.width / tile_size)

  var origin_index = (closest_node == null ? current_origin_index : find_node_index(closest_node.x, closest_node.y))

  // North node
  visited.push(grid[origin_index - (nodes_per_row + 1)])

  // Northwest node
  visited.push(grid[origin_index - nodes_per_row - 2])

  // West node
  visited.push(grid[origin_index - 1])

  // Southwest node
  visited.push(grid[origin_index + nodes_per_row])

  // South node
  visited.push(grid[origin_index + (nodes_per_row + 1)])

  // Southeast node
  visited.push(grid[origin_index + (nodes_per_row + 2)])

  // East node
  visited.push(grid[origin_index + 1])

  // Northeast node
  visited.push(grid[origin_index - nodes_per_row])

  //visited.forEach((node) => node.colour = "cyan")
  let closest_visited_node = null
  visited.forEach((node) => {
    node.distance = distance(node, grid[current_target_index])
    if ((closest_visited_node == null) || (closest_visited_node.distance > node.distance)) {
      closest_visited_node = node
    }
  })

  return closest_visited_node
}

const handle_keydown = function(event) {
  switch (event.key) {
  case "w":
    brush_type = "wall"
    break
  case "s":
    brush_type = "starting_point"
    break
  case "n":
    if ((last_closest_node.x == grid[current_target_index].x) && (last_closest_node.y == grid[current_target_index].y)) {
      console.log("here")
    } else {
      last_closest_node = walk_the_path(last_closest_node);
      last_closest_node.colour = "cyan"
    }
    break
  }
}
window.addEventListener("keydown", handle_keydown, false)
