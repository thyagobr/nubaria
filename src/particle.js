export default function Particle(go) {
    this.go = go;
    this.active = true;
    //SPell
    this.range = 200;
    this.current_movement = 0;
    this.speed = 10;

    this.draw = function (x, y) {
        if (!this.active) return;

        if ((this.x) && (this.y)) {
            this.go.ctx.beginPath();
            this.go.ctx.arc(x - this.go.camera.x, y - this.go.camera.y, 15, 0, 2 * Math.PI, false);
            this.go.ctx.fillStyle = 'blue';
            this.go.ctx.fill();
            this.go.ctx.lineWidth = 5;
            this.go.ctx.strokeStyle = 'lightblue';
            this.go.ctx.stroke();
        }
    }
}