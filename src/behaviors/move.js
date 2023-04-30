import { Vector2 } from "../tapete"

export class Move {
    constructor({ go, entity, speed = 1, target_position }) {
        this.go = go
        this.entity = entity
        this.speed = speed
        this.target_position = target_position

        this.act = () => {
            const next_step = {
                x: this.entity.x + this.speed * Math.cos(Vector2.angle(this.entity, this.target_position)),
                y: this.entity.y + this.speed * Math.sin(Vector2.angle(this.entity, this.target_position)),
            }
            this.entity.x = next_step.x
            this.entity.y = next_step.y
        }
    }
}