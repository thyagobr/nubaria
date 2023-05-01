import CastingBar from "../casting_bar.js"
import { remove_object_if_present } from "../tapete.js"

export default function Spellcasting({ go, entity, spell }) {
    this.go = go
    this.entity = entity
    this.spell = spell
    this.casting_bar = new CastingBar({ go, entity: entity })

    this.draw = () => {
        this.casting_bar.draw()
    }

    this.update = () => { }

    this.end = () => {
        remove_object_if_present(this, this.go.managed_objects)
        console.log("Sellcasting#end")
        if (this.entity.stats.current_mana > this.spell.mana_cost) {
            this.entity.stats.current_mana -= this.spell.mana_cost
            this.spell.act()
        }
    }

    this.cast = () => {
        if (!this.go.selected_clickable || !this.go.selected_clickable.stats) return;
        if (this.casting_bar.duration !== null) {
            console.log("Spellcasting#stop")
            this.casting_bar.start(1500, this.end)
        } else if (this.entity.stats.current_mana > this.spell.mana_cost) {
            console.log("Spellcasting#cast")
            this.go.managed_objects.push(this)
            this.casting_bar.start(1500, this.end)
        }
    }
}