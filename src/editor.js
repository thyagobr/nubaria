import draw_grid from "./grid.js";

const editor = {
  game_object: null,
  // Bitmap stores pixels sellected for invisible collision
  bitmap: [],
  draw: function() {
    draw_grid(this.game_object.ctx, this.game_object.canvas_rect, this.game_object.tile_size);
    this.bitmap.forEach((bit) => {
      this.game_object.ctx.fillStyle = "purple";
      this.game_object.ctx.fillRect(bit.x, bit.y, this.game_object.tile_size, this.game_object.tile_size)
    })
  },
}

export default editor;
