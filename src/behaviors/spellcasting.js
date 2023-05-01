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
      this.spell.act()
    }

    this.cast = () => {
      console.log("Spellcasting#cast")
      this.go.managed_objects.push(this)
      this.casting_bar.start(1500, this.end)
    }
  }