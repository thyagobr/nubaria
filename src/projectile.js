import Particle from "./particle.js"

export default function Projectile(go) {
    this.go = go;
    this.particle = new Particle(go);
    this.start_position = { x: null, y: null };
    this.current_position = { x: null, y: null };
    this.end_position = { x: null, y: null };
    this.bounds = () => {
        return { ...this.current_position, width: 5, height: 5 }
    }
    this.active = false;
    this.distance = () => {
        return Math.sqrt(Math.pow((this.end_position.x - this.current_position.x), 2) + Math.pow((this.end_position.y - this.current_position.y), 2));
    }

    this.draw = () => {
        if (!this.active) return;
        if (this.distance() < 5) {
            this.active = false;
            return;
        }

        this.calculate_position();
        this.particle.draw(this.current_position);
    }

    this.calculate_position = () => {
        const angle = Math.atan2(this.end_position.y - this.current_position.y, this.end_position.x - this.current_position.x);
        this.current_position = {
            x: this.current_position.x + 5 * Math.cos(angle),
            y: this.current_position.y + 5 * Math.sin(angle)
        }
    }
}