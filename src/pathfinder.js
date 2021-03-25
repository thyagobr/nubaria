import { is_colliding } from "./tapete.js"
const distance = function(a, b) { return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) }

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const canvas_rect = canvas.getBoundingClientRect()
const tile_size = 20;

const grid = []
const already_visited = [] // for movement

var current_origin_index = null
var initial_position_index = null

function Node(data) {
  this.id = data.id
  this.x = data.x
  this.y = data.y
  this.width = tile_size
  this.height = tile_size
  this.colour = "white"
  this.border_colour = "black"
}

for (var j = 0; j <= (canvas_rect.height / tile_size); j++) {
  for (var i = 0; i <= (canvas_rect.width / tile_size); i++) {
    grid.push(new Node({ id: grid.length, x: i * tile_size, y: j * tile_size }))
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
      //if (current_origin_index !== null) {
      //  grid[current_origin_index].colour = "white"
      //}
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
    node.blocked = true
    node.colour = "gray"
    break
  }
}
canvas.addEventListener("click", handle_click, false)


const walk_the_path = function(closest_node) {
  // Step: Select all neighbours
  let visited = []
  let nodes_per_row = Math.trunc(canvas_rect.width / tile_size)
  let origin_index = (closest_node == null ? current_origin_index : closest_node.id)

  // This neighbours-fetching method uses the Node's index in the array to calculate
  // the indices for all its neighbours.
  // This method doesn't check if we're out of bounds
  // Positions  
  let neighbours = [
    grid[origin_index - (nodes_per_row + 1)], // North
    grid[origin_index - nodes_per_row - 2], // Northwest
    grid[origin_index - 1], // West
    grid[origin_index + nodes_per_row], // Southwest
    grid[origin_index + (nodes_per_row + 1)], // South
    grid[origin_index + (nodes_per_row + 2)], // Southeast
    grid[origin_index + 1], // East
    grid[origin_index - nodes_per_row] // Northeast
  ].filter((neighbour) => neighbour != null && neighbour != undefined)

  // Step: Sort neighbours by distance (smaller distance first)
  let neighbours_sorted_by_distance_asc = neighbours.sort((a, b) => {
    a.distance = distance(a, grid[current_target_index])
    b.distance = distance(b, grid[current_target_index])
    return a.distance - b.distance
  })

  // Step: Select only neighbour nodes that are not blocked && haven't already been visited
  neighbours_sorted_by_distance_asc = neighbours_sorted_by_distance_asc.filter((node) => {
    return node.blocked !== true && !already_visited.some((visited_node) => visited_node.id == node.id)
  })

  // Step: Return the closest valid node to the target
  return neighbours_sorted_by_distance_asc[0];
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
    if ((last_closest_node === null) || (last_closest_node.x == grid[current_target_index].x) && (last_closest_node.y == grid[current_target_index].y)) {
      console.log("here")
    } else {
      last_closest_node = walk_the_path(last_closest_node);
      if (last_closest_node) {
        already_visited.push(last_closest_node)
        last_closest_node.colour = "cyan"
      } else {
        console.log("no path")
      }
    }
    break
  }
}
window.addEventListener("keydown", handle_keydown, false)

function game_loop() {
  draw_grid(ctx, canvas_rect, tile_size)

  requestAnimationFrame(game_loop)
}
requestAnimationFrame(game_loop)

