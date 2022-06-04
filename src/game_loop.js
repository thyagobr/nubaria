// The Game Loop
//
// Usage:
//
// const game_loop = new GameLoop()
// game_loop.draw = draw
// game_loop.process_keys_down = process_keys_down
// window.requestAnimationFrame(game_loop.loop.bind(game_loop));

function GameLoop() {
  this.draw = null
  this.process_keys_down = null
  this.loop = function() {
    try {
      this.process_keys_down()
      this.draw()
    } catch(e) {
    }

    window.requestAnimationFrame(this.loop.bind(this));
  }
}

export default GameLoop
