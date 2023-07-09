import Character from "./character";

export default function Server(go, player) {
  this.go = go
  this.player = player
  this.go.character = player
  go.server = this

  this.conn = undefined;
  this.connect = () => {
    this.conn = new WebSocket("ws://127.0.0.1:3010");
    this.conn.onopen = () => this.login(this.go.character)
    this.conn.onmessage = function (event) {
      let payload = JSON.parse(event.data)
      console.log(payload)
      switch (payload.type) {
        case "login", "firstLoad":
          first_load(payload)
          break;
        case "moveLoad":
          console.log("moveLoad")

        case "ping":
        //go.ctx.fillRect(payload.data.character.x, payload.data.character.y, 50, 50)
        //go.ctx.stroke()
        //let player = players[0] //players.find(player => player.name === payload.data.character.name)
        //if (player) {
        //  player.x = payload.data.character.x
        //  player.y = payload.data.character.y
        //}
        //break;
      }
    }
  }

  function first_load(payload, player) {
    go.character.name = payload.currentPlayer.name
    go.character.x = payload.currentPlayer.position.x
    go.character.y = payload.currentPlayer.position.y
    go.camera.focus(go.character)
  }

  this.login = function (character) {
    let payload = {
      action: "login",
      data: {
        character: {
          name: character.name,
          x: character.x,
          y: character.y
        }
      }
    }
    this.conn.send(JSON.stringify(payload))
  }

  this.ping = function (character) {
    let payload = {
      action: "ping",
      data: {
        character: {
          name: character.name,
          x: character.x,
          y: character.y
        }
      }
    }
    this.conn.send(JSON.stringify(payload))
  }
}
