import Projectile from "../projectile"
import { remove_object_if_present, is_colliding, random } from "../tapete"

export default function Frostbolt({ go }) {
    this.go = go
    this.projectile = new Projectile({ go, subject: this })
    this.active = false
    this.mana_cost = 15

    this.draw = () => {
        if (!this.active) return;
        this.projectile.draw();
    }

    this.update = () => {
        if (!this.active) return

        if ((is_colliding(this.projectile.bounds(), this.go.selected_clickable))) {
            if (damageable(this.go.selected_clickable)) {
                const damage = random(5, 10);
                this.go.selected_clickable.stats.take_damage({ damage });
            }
            this.end();
        } else {
            this.projectile.update()
        }
    }

    this.act = () => {
        if (this.active) return;
        if ((this.go.selected_clickable === null) || (this.go.selected_clickable === undefined)) return;
        
        const start_position = { x: this.go.character.x + 50, y: this.go.character.y + 50 }
        const end_position = {
            x: this.go.selected_clickable.x + this.go.selected_clickable.width / 2,
            y: this.go.selected_clickable.y + this.go.selected_clickable.height / 2
        }
        this.projectile.act({ start_position, end_position })

        this.active = true
        this.go.spells.push(this)
    }

    this.end = () => {
        this.active = false;
        remove_object_if_present(this, this.go.spells);
    }

    function damageable(object) {
        return object.stats !== undefined && object.stats.take_damage !== undefined
    }
}