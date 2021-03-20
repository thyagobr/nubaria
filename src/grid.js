// Grid
const draw_grid = function (ctx, canvas_rect, tile_size) {
  for (var i = 1; i < (canvas_rect.height / tile_size); i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * tile_size)
    ctx.lineTo(canvas_rect.right, i * tile_size)
    ctx.stroke();
  }

  for (var i = 1; i < (canvas_rect.width / tile_size); i++) {
    ctx.beginPath()
    ctx.moveTo(i * tile_size, 0)
    ctx.lineTo(i * tile_size, canvas_rect.bottom)
    ctx.stroke();
  }
}

export default draw_grid;
