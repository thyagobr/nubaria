import Particle from "./particle.js"
import Position from "./position.js";
import { Vector2, random } from "./tapete.js";

export default function Projectile({ go, subject }) {
    this.go = go;
    this.particle = new Particle(go);
    this.start_position = null
    this.current_position = null
    this.end_position = null
    this.subject = subject
    this.bounds = () => {
        return { ...this.current_position, width: 5, height: 5 }
    }
    this.trace = [];
    this.active = false;

    this.act = ({ start_position, end_position }) => {
        this.start_position = start_position
        this.current_position = Object.create(this.start_position)
        this.end_position = end_position
        this.active = true
    }

    this.update = () => {
        if (Vector2.distance(this.end_position, this.current_position) < 5) {
            this.active = false;
            this.subject.end();
            return;
        }

        this.calculate_position();
    }

    this.draw = () => {
        if (!this.active) return;

        this.particle.draw(this.current_position);
    }

    this.calculate_position = () => {
        const angle = Vector2.angle(this.current_position, this.end_position);
        const speed = 10;
        this.current_position = {
            x: this.current_position.x + speed * Math.cos(angle),
            y: this.current_position.y + speed * Math.sin(angle)
        }
    }
}