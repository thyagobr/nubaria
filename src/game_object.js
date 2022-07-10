const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d')

function GameObject() {
  this.canvas = canvas
  this.canvas_rect = canvas.getBoundingClientRect()
  this.canvas.setAttribute('width', this.canvas_rect.width);
  this.canvas.setAttribute('height', this.canvas_rect.height);
  this.ctx = ctx
  this.tile_size = 20
  this.clickables = []
  this.selected_clickable = null
  this.draw_selected_clickable = function () {
    if (this.selected_clickable) {
      this.ctx.save()
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = "yellow"
      this.ctx.strokeStyle = "rgba(255, 255, 0, 0.7)"
      this.ctx.strokeRect(
        this.selected_clickable.x - this.camera.x - 5,
        this.selected_clickable.y - this.camera.y - 5,
        this.selected_clickable.width + 10,
        this.selected_clickable.height + 10);
      this.ctx.restore();
    }
  }
}

export default GameObject