import { Vector2, is_colliding } from "../tapete"

export class Move {
    constructor({ go, entity, speed = 1, target_position }) {
        this.go = go
        this.entity = entity
        this.speed = speed
        this.target_position = target_position
    }

    act = () => {
        const targeted_position = { ...this.target_position }
        const next_step = {
            x: this.entity.x + this.speed * Math.cos(Vector2.angle(this.entity, targeted_position)),
            y: this.entity.y + this.speed * Math.sin(Vector2.angle(this.entity, targeted_position)),
            width: this.entity.width,
            height: this.entity.height
        }
        if (!this.go.trees.some(tree => (is_colliding(next_step, tree)))) {
            this.entity.x = next_step.x
            this.entity.y = next_step.y
        } else {
            console.log("hmmm... where to?")
        }
    }
}

function Node() {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.neighbors = () => {
        
    }
}