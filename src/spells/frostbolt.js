import Projectile from "../projectile"
import { remove_object_if_present, is_colliding, random } from "../tapete"

export default function Frostbolt({ go, entity }) {
    this.id = "spell_frostbolt"
    this.entity = entity
    this.go = go
    this.icon = new Image()
    this.icon.src = "https://cdna.artstation.com/p/assets/images/images/009/031/190/large/richard-thomas-paints-11-v2.jpg"
    this.projectile = new Projectile({ go, subject: this })
    this.active = false
    this.mana_cost = 15
    this.casting_time_in_ms = 1500
    this.last_cast_at = null
    this.cooldown_time_in_ms = 100
    this.on_cooldown = () => {
        return this.last_cast_at && Date.now() - this.last_cast_at < this.cooldown_time_in_ms
    }

    this.draw = () => {
        if (!this.active) return;
        this.projectile.draw();
    }

    this.draw_slot = (slot) => {
        this.go.ctx.drawImage(this.img, x, y, this.go.action_bar.slot_width, this.go.action_bar.slot_height)
        
    }

    this.update = () => {
        if (!this.active) return

        if ((is_colliding(this.projectile.bounds(), this.entity.spell_target()))) {
            if (damageable(this.entity.spell_target())) {
                const damage = random(5, 10);
                this.entity.spell_target().stats.take_damage({ damage });
            }
            this.end();
        } else {
            this.projectile.update()
        }
    }

    this.is_valid = () => !this.on_cooldown() && (this.entity.spell_target() && this.entity.spell_target().stats)

    this.act = () => {
        if (this.active) return;
        if ((this.entity.spell_target() === null) || (this.entity.spell_target() === undefined)) return;

        const start_position = { x: this.entity.x + 50, y: this.entity.y + 50 }
        const end_position = {
            x: this.entity.spell_target().x + this.entity.spell_target().width / 2,
            y: this.entity.spell_target().y + this.entity.spell_target().height / 2
        }
        this.projectile.act({ start_position, end_position })

        this.active = true
        this.go.spells.push(this)
    }

    this.end = () => {
        this.active = false;
        remove_object_if_present(this, this.go.spells);
        this.last_cast_at = Date.now()
    }

    function damageable(object) {
        return object.stats !== undefined && object.stats.take_damage !== undefined
    }
}