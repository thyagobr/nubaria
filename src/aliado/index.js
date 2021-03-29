import GameObject from "../game_object.js"

const FPS = 33.33

const start = () => {
  setTimeout(game_loop, FPS)
}

function game_loop() {
  setTimeout(game_loop, FPS)
}

start()

