function GameObject() {
  this.canvas = document.getElementById('screen')
  this.canvas_rect = this.canvas.getBoundingClientRect()
  this.ctx = this.canvas.getContext('2d')
  this.tile_size = 20
  this.creeps = []
  this.players = []
}

export default GameObject
