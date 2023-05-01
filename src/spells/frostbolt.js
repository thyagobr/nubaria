import Projectile from "../projectile"
import { remove_object_if_present, is_colliding, random } from "../tapete"

export default function Frostbolt({ go }) {
    this.go = go
    this.projectile = new Projectile({ go, subject: this })
    this.active = false

    this.draw = () => {
        if (!this.active) return;
        console.log("drawing Frostbolt")
        this.projectile.draw();
    }

    this.update = () => {
        if ((this.active) && (is_colliding(this.projectile.bounds(), this.go.selected_clickable))) {
            this.go.selected_clickable.current_hp -= random(5, 10);
            if (this.go.selected_clickable.current_hp <= 0) {
                remove_object_if_present(this.go.selected_clickable, this.go.creeps) || console.log("Not on list of creeps")
                remove_object_if_present(this.go.selected_clickable, this.go.clickables) || console.log("Not on list of clickables")
                this.go.selected_clickable = null;
            }
            this.active = false;
        }
    }

    this.act = () => {
        console.log("casting Frostbolt")
        if (this.active) return;
        if ((this.go.selected_clickable === null) || (this.go.selected_clickable === undefined)) return;

        this.projectile.start_position = { x: this.go.character.x + 50, y: this.go.character.y + 50 }
        this.projectile.current_position = { x: this.go.character.x + 50, y: this.go.character.y + 50 }
        this.projectile.end_position = {
            x: this.go.selected_clickable.x + this.go.selected_clickable.width / 2,
            y: this.go.selected_clickable.y + this.go.selected_clickable.height / 2
        }
        this.projectile.active = true
        this.active = true
        this.go.spells.push(this)
    }

    this.end = () => {
        console.log("ending frostbolt")
        this.active = false;
        remove_object_if_present(this, this.go.spells);
    }
}