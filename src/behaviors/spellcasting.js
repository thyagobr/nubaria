import CastingBar from "../casting_bar.js"
import { remove_object_if_present } from "../tapete.js"

export default function Spellcasting({ go, entity, spell, target }) {
    this.go = go
    this.target = target
    this.entity = entity
    this.spell = spell
    this.casting_bar = new CastingBar({ go, entity: entity })
    this.casting = false

    this.draw = () => {
        if (this.casting) this.casting_bar.draw()
    }

    this.update = () => { }

    // This logic won't work for channeling spells.
    // The effects and the casting bar happen at the same time.
    // Same thing for some skills
    this.end = () => {
        this.entity.is_busy_with = null
        remove_object_if_present(this, this.go.managed_objects)
        if (this.entity.stats.current_mana > this.spell.mana_cost) {
            this.entity.stats.current_mana -= this.spell.mana_cost
            this.spell.act()
        }
    }

    // is_self_cast: if true, the spell is being cast by the player
    this.cast = (is_self_cast = true) => {
        if (!this.spell.is_valid()) {
            console.log("spell is not valid")
            return;
        }

        this.entity.is_busy_with = this.casting_bar
        if (this.spell.casting_time_in_ms) {
            if (this.casting_bar.duration !== null) {
                this.casting = false
                remove_object_if_present(this, this.go.managed_objects)
                this.casting_bar.stop()
            } else if (this.entity.stats.current_mana > this.spell.mana_cost) {
                this.casting = true
                this.go.managed_objects.push(this)
                this.casting_bar.start(this.spell.casting_time_in_ms, this.end)

                if (is_self_cast) {
                    this.go.action_bar.highlight_cast(this.spell);
                    // TODO: extract
                    let payload = {
                        action: "spellcastingStarted",
                        args: {
                            spell: {
                                id: this.spell.id
                            },
                            target: {
                                id: this.target().id
                            },
                            caster: {
                                id: this.entity.id
                            }
                        }
                    }
                    this.go.server.conn.send(JSON.stringify(payload))
                    // END -- TODO: extract
                }

            }
        } else {
            this.end()
        }
    }
}