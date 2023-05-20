import { is_colliding } from "./tapete"

export default function StartMenu({ go }) {
    this.go = go
    this.active = true
    this.button_width = 300
    this.button_height = 50

    this.check_button_clicked = (ev) => {
        let click = { x: ev.clientX, y: ev.clientY, width: 1, height: 1 }
        this.buttons.forEach((button) => {
            if (is_colliding(click, button)) {
                button.perform()
            }
        })
    }
    this.go.click_callbacks.push(this.check_button_clicked)

    this.draw = () => {
        if (!this.active) return;

        this.go.screen.draw_fog(0);
        const x = this.go.canvas_rect.width / 3;
        const y = this.go.canvas_rect.height / 3;
        this.go.ctx.fillStyle = 'gray';
        this.go.ctx.fillRect(x, y, x, y);
        const title = "Nubaria"
        this.go.ctx.fillStyle = 'black'
        this.go.ctx.font = '72px serif';
        this.go.ctx.fillText(title, x + x / 4, y + 70)

        for (let index = 0; index < this.buttons.length; index++) {
            const button = this.buttons[index];
            const x_offset = x + x / 2;
            const y_offset = y + y / 3 + index * 50 + index * 10;
            this.go.ctx.fillStyle = button.is_hovered ? "rgba(9, 100, 80, 1)" : "rgba(7, 1, 3, 1)"
            this.go.ctx.fillRect(x_offset - this.button_width / 2, y_offset, this.button_width, this.button_height)
            this.buttons[index].x = x_offset - this.button_width / 2;
            this.buttons[index].y = y_offset;
            this.buttons[index].width = this.button_width
            this.buttons[index].height = this.button_height
            this.go.ctx.fillStyle = "white";
            this.go.ctx.font = "21px sans-serif"
            var text_measurement = this.go.ctx.measureText(button.text)
            this.go.ctx.fillText(button.text, x_offset - (text_measurement.width / 2), y_offset + (this.button_height / 2) + this.approximate_line_height / 2)
        }
    }

    this.update = () => {
        this.buttons.find((button) => {
            if (is_colliding(this.go.mouse_position, button)) {
                button.is_hovered = true
            } else {
                button.is_hovered = false
            }
        })
    }

    // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
    this.approximate_line_height = this.go.ctx.measureText('M').width;

    this.buttons = [
        {
            menu: this,
            id: "new_game",
            text: "new",
            perform: function () {
                console.log("new_game button clicked")
                this.menu.active = false;
            }
        },
        {
            menu: this,
            id: "load_game",
            text: "load",
            perform: function () {
                console.log("load_game button clicked")
            }
        },
        {
            menu: this,
            id: "save_game",
            text: "save",
            perform: function () {
                console.log("save_game button clicked")
            }
        },
        {
            menu: this,
            id: "exit_game",
            text: "exit",
            perform: function () {
                console.log("exit_game button clicked")
            }
        }
    ]
}