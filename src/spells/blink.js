import { remove_object_if_present } from "../tapete";

export default function Blink({ go, entity }) {
    this.id = "spell_blink"
    this.icon = new Image();
    this.icon.src = "blink_spell.jpg"
    this.go = go
    this.entity = entity
    this.active = false
    this.mana_cost = 7
    this.casting_time_in_ms = 0
    this.last_cast_at = null
    this.cooldown_time_in_ms = 7000
    this.on_cooldown = () => {
        return this.last_cast_at && Date.now() - this.last_cast_at < this.cooldown_time_in_ms
    }

    this.is_valid = () => !this.on_cooldown()
    
    this.draw = () => {
        if (!this.active) return

        this.go.ctx.beginPath()
        this.go.ctx.lineWidth = 3;
        this.go.ctx.strokeStyle = 'purple'
        this.go.ctx.arc(this.go.mouse_position.x - this.go.camera.x, this.go.mouse_position.y - this.go.camera.y, 50, 0, Math.PI * 2)
        this.go.ctx.stroke()
    }

    this.update = () => { }

    this.act = () => {
        if (this.active) {
            this.active = false
            remove_object_if_present(this, this.go.spells)
            remove_object_if_present(click_callback, this.go.mousedown_callbacks)
        } else {
            this.active = true
            this.go.spells.push(this)
            this.go.mousedown_callbacks.push(click_callback)

        }
    }

    this.end = () => {
        this.active = false
        this.entity.current_mana -= this.mana_cost
        remove_object_if_present(this, this.go.spells)
        remove_object_if_present(click_callback, this.go.mousedown_callbacks)
        this.last_cast_at = Date.now()
    }

    const click_callback = () => {
        this.entity.x = this.go.mouse_position.x;
        this.entity.y = this.go.mouse_position.y;
        this.end();
    }
}