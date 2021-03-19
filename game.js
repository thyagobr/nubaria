const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

const draw_square = function (x = 10, y = 10, w = 20, h = 20, color = "rgb(190, 20, 10)") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

const canvas_rect = canvas.getBoundingClientRect()

const tile_size = 20;

// Grid
// for (i = 1; i < (canvas_rect.height / tile_size); i++) {
//   ctx.beginPath()
//   ctx.moveTo(0, i * tile_size)
//   ctx.lineTo(canvas_rect.right, i * tile_size)
//   ctx.stroke();
// }

// for (i = 1; i < (canvas_rect.width / tile_size); i++) {
//   ctx.beginPath()
//   ctx.moveTo(i * tile_size, 0)
//   ctx.lineTo(i * tile_size, canvas_rect.bottom)
//   ctx.stroke();
// }

var character = {
  x: tile_size * (Math.floor(canvas_rect.width / tile_size) / 2),
  y: tile_size * (Math.floor(canvas_rect.height / tile_size) / 2),
  moving: false
}

var target_movement = {
  x: 0,
  y: 0
}

const on_click = function (ev) {
  target_movement.x = ev.clientX
  target_movement.y = ev.clientY
  character.moving = true
}

canvas.addEventListener("click", on_click, false);
// debugger function
window.addEventListener("keyup", function (e) {
  console.log(character)
  console.log(target_movement)
}, false)

const distance = function (a, b) {
  return Math.abs(Math.floor(a) - Math.floor(b));
}

// First base
function game_loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (character.moving) {
    if ((distance(character.x, target_movement.x) <= 1) && (distance(character.y, target_movement.y) <= 1)) {
      character.moving = false;
      console.log("Stopped");
    }
    // If the distance from the character position to the target is 1 or less
    if (distance(character.x, target_movement.x) > 1) {
      if (character.x > target_movement.x) {
        character.x = character.x - 2;
      } else {
        character.x = character.x + 2;
      }
    }
    if (distance(character.y, target_movement.y) > 1) {
      if (character.y > target_movement.y) {
        character.y = character.y - 2;
      } else {
        character.y = character.y + 2;
      }
    }
  }

  draw_square(0, tile_size * 30, tile_size * 6, tile_size * 6)

  // Second base
  draw_square(tile_size * (Math.floor(canvas_rect.right / tile_size) - 6), 0, tile_size * 6, tile_size * 6)

  // Draw character
  draw_square(character.x,
    character.y,
    20, 20, "blueviolet"
  );

  requestAnimationFrame(game_loop)
};

requestAnimationFrame(game_loop)
