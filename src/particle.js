export default function Particle(go) {
    this.go = go;
    this.active = true;

    this.draw = function ({ x, y }) {
        if (!this.active) return;

        this.go.ctx.beginPath();
        this.go.ctx.arc(x - this.go.camera.x, y - this.go.camera.y, 15, 0, 2 * Math.PI, false);
        this.go.ctx.fillStyle = 'blue';
        this.go.ctx.fill();
        this.go.ctx.lineWidth = 5;
        this.go.ctx.strokeStyle = 'lightblue';
        this.go.ctx.stroke();
    }
}