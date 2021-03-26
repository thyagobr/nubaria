const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d')

function GameObject() {
  this.canvas = canvas
  this.canvas_rect = canvas.getBoundingClientRect()
  this.ctx = ctx
  this.tile_size = 20
}

export default GameObject
