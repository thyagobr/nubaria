function Camera(go) {
  this.go = go
  this.go.camera = this
  this.x = 0
  this.y = 0
  this.camera_speed = 3

  this.move_camera_with_mouse = (ev) => {
    if ((this.go.canvas_rect.height - ev.clientY) < 100) {
      this.go.camera.y = this.go.camera.y + this.camera_speed
    } else if ((this.go.canvas_rect.height - ev.clientY) > this.go.canvas_rect.height - 100) {
      this.go.camera.y = this.go.camera.y - this.camera_speed
    }

    if ((this.go.canvas_rect.width - ev.clientX) < 100) {
      this.go.camera.x = this.go.camera.x + this.camera_speed
    } else if ((this.go.canvas_rect.width - ev.clientX) > this.go.canvas_rect.width - 100) {
      this.go.camera.x = this.go.camera.x - this.camera_speed
    }
  }
}

export default Camera
