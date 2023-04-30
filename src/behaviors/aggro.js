import { Vector2 } from "../tapete"
import { Move } from "./move"

export default function Aggro({ go, entity, radius = 20 }) {
    this.go = go
    this.entity = entity
    this.radius = radius
    this.move = new Move({ go, entity, target_position: this.go.character })

    this.act = () => {
        if (Vector2.distance(this.go.character, entity) < this.radius) {
            this.move.act();
        }
    }
} 