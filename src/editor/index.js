export default function Editor({ go }) {
    this.go = go
    this.left_panel_coords = {
        x: this.go.screen.width - 300,
        y: 0,
        width: 300,
        height: this.go.screen.height
    }

    this.draw = () => {
        this.go.ctx.fillStyle = 'white'
        this.go.ctx.fillRect(this.left_panel_coords.x, this.left_panel_coords.y, this.left_panel_coords.width, this.go.screen.height)
        this.go.character.draw_character({
            x: this.left_panel_coords.x + (this.left_panel_coords.width / 2) - (this.go.character.width / 2),
            y: 50,
            width: 50,
            height: 50
        })
        this.go.ctx.fillStyle = 'black'
        this.go.ctx.font = "21px sans-serif"
        let text = `x: ${this.go.character.x.toFixed(2)}, y: ${this.go.character.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.left_panel_coords.x + (this.left_panel_coords.width / 2) - (text_measurement.width / 2), this.left_panel_coords.y + 50 + 50 + 20)

        if (this.go.selected_clickable) this.draw_selection();
    }

    this.draw_selection = () => {
        this.go.selected_clickable.draw({
            x: this.left_panel_coords.x + this.left_panel_coords.width / 2 - 35,
            y: this.left_panel_coords.y + 200,
            width: 70,
            height: 70
        })
        let text = `x: ${this.go.selected_clickable.x.toFixed(2)}, y: ${this.go.selected_clickable.y.toFixed(2)}`
        var text_measurement = this.go.ctx.measureText(text)
        this.go.ctx.fillText(text, this.left_panel_coords.x + (this.left_panel_coords.width / 2) - (text_measurement.width / 2), this.left_panel_coords.y + 200 + 100)
    }
}