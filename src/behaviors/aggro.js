import { Vector2, random } from "../tapete"
import { Move } from "./move"

export default function Aggro({ go, entity, radius = 20 }) {
    this.go = go
    this.entity = entity
    this.radius = radius
    this.move = new Move({ go, entity, target_position: this.go.character })

    // Combat system
    this.last_attack_at = null;
    this.attack_speed = 1000;

    this.act = () => {
        let distance = Vector2.distance(this.go.character, entity)
        if (distance < this.radius) {
            this.move.act();
        if (distance < 5) {
            if (this.last_attack_at === null || (this.last_attack_at + this.attack_speed) < Date.now()) {
                this.go.character.stats.take_damage({ damage: random(5, 12) })
                this.last_attack_at = Date.now();
            }
        }}

    }
} 