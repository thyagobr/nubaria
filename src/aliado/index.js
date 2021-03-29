import GameObject from "../game_object.js"

const go = new GameObject()
go.canvas.height = 1000

const FPS = 33.33

const start = () => {
  setTimeout(game_loop, FPS)
}

const house_size = 150
const square_size = 50
const starting_point = { x: 10, y: house_size + 10 }
const colours = ["blue", "purple", "white", "yellow", "red", "green"]
const squares = []

const draw_house = (x, y, colour) => {
  go.ctx.strokeStyle = "black"
  go.ctx.lineWidth = 5
  go.ctx.fillStyle = colour
  go.ctx.strokeRect(x, y, house_size, house_size)
  go.ctx.fillRect(x, y, house_size, house_size)
}

const draw_square = (x, y, w, h, colour) => {
  go.ctx.strokeStyle = "black"
  go.ctx.lineWidth = 5
  go.ctx.fillStyle = colour
  go.ctx.fillRect(x, y, w, h)
  go.ctx.strokeRect(x, y, w, h)
}

const draw = () => {
  draw_house(10, 10, "red")
  draw_house(810, 10, "white")
  draw_house(10, 810, "purple")
  draw_house(810, 810, "green")

  // left outter lane
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: 10,
      y: starting_point.y + (i * square_size),
      size: square_size,
      colour: colours[i % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  // left-bottom outter intermission
  var left_bottom_init_post = {
    x: squares[squares.length - 1].x + square_size,
    y: squares[squares.length - 1].y
  }
  for (var i = 0; i < 3; i++) {
    let square = { 
      x: left_bottom_init_post.x + (i * square_size),
      y: left_bottom_init_post.y,
      size: square_size,
      colour: colours[(i + 1) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }
  for (var i = 0; i < 2; i++) {
    var y_offset = 0
    let square = { 
      x: squares[squares.length - 1].x,
      y: squares[squares.length - 1].y + (i + 1 * square_size),
      size: square_size,
      colour: colours[(i + 4) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }


  // bottom outter lane
  var bottom_outter_init_pos = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y + square_size
  }
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: bottom_outter_init_pos.x + (i * square_size),
      y: bottom_outter_init_pos.y,
      size: square_size,
      colour: colours[i % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  // bottom-right outter intermission
  var bottom_right_outter_init_pos = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y - square_size
  }
  for (var i = 0; i < 3; i++) {
    let square = { 
      x: bottom_right_outter_init_pos.x,
      y: bottom_right_outter_init_pos.y - (i * square_size),
      size: square_size,
      colour: colours[(i + 1) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  for (var i = 0; i < 2; i++) {
    var x_offset = square_size + 5
    let square = { 
      x: squares[squares.length - 1].x + (i + 1 * square_size),
      y: squares[squares.length - 1].y,
      size: square_size,
      colour: colours[(i + 4) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }


  // right outter lane
  var right_outter_init_pos = {
    x: squares[squares.length - 1].x + square_size,
    y: squares[squares.length - 1].y
  }
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: right_outter_init_pos.x,
      y: right_outter_init_pos.y - (i * square_size),
      size: square_size,
      colour: colours[i % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  // right-top outter intermission
  for (var i = 0; i < 3; i++) {
    var y_offset = 0
    let square = { 
      x: squares[squares.length - 1].x - (i + 1 * square_size),
      y: squares[squares.length - 1].y,
      size: square_size,
      colour: colours[(i + 1) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  var x_offset = squares[squares.length - 1].x
  for (var i = 0; i < 2; i++) {
    let square = { 
      x: x_offset,
      y: squares[squares.length - 1].y - (i + 1 * square_size),
      size: square_size,
      colour: colours[(i + 4) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  // top outter lane
  var top_outter_init_post = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y - square_size,
  }
  for (var i = 0; i < 13; i++) {
    let square = { 
      x: top_outter_init_post.x - (i * square_size),
      y: top_outter_init_post.y,
      size: square_size,
      colour: colours[i % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  // top-left outter intermission
  var top_left_outter_init_pos = {
    x: squares[squares.length - 1].x,
    y: squares[squares.length - 1].y + square_size,
  }
  for (var i = 0; i < 3; i++) {
    let square = { 
      x: top_left_outter_init_pos.x,
      y: top_left_outter_init_pos.y + (i * square_size),
      size: square_size,
      colour: colours[(i + 1) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }

  var x_offset = squares[squares.length - 1].x - square_size
  var y_offset = squares[squares.length - 1].y
  for (var i = 0; i < 2; i++) {
    let square = { 
      x: x_offset - (i * square_size),
      y: y_offset,
      size: square_size,
      colour: colours[(i + 1) % colours.length]
    }

    squares.push(square)

    draw_square(
      square.x,
      square.y,
      square.size,
      square.size,
      square.colour
    )
  }
}

function game_loop() {
  draw()

  setTimeout(game_loop, FPS)
}

start()

