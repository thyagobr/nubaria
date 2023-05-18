import Board from "../board"
import { Vector2, random } from "../tapete"
import { Move } from "./move"

export default function Aggro({ go, entity, radius = 20 }) {
    this.go = go
    this.entity = entity
    this.radius = radius
    this.board = new Board({ go, entity, radius: Math.floor(this.radius / this.go.tile_size) })
    this.move = new Move({ go, entity, target_position: this.go.character })

    this.act = () => {
        let distance = Vector2.distance(this.go.character, entity)
        if (distance < this.radius) {
            this.move.act();
            // this.board.draw();
        if (distance < 5) {
            this.entity.stats.attack(this.go.character)
        }}

    }

    this.draw_path = () => {

    }

    const neighbor_positions = () => {
        const current_position = {
            x: this.entity.x,
            y: this.entity.y,
            width: this.entity.width,
            height: this.entity.height
        }

        const left = { ...current_position, x: this.entity.x -= this.entity.speed }
        const right = { ...current_position, x: this.entity.x += this.entity.speed }
        const up = { ...current_position, y: this.entity.y -= this.entity.speed }
        const down = { ...current_position, y: this.entity.y += this.entity.speed }
    }
} 