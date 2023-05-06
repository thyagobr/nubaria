import CastingBar from "../casting_bar"
import { Vector2, remove_object_if_present, remove_clickable } from "../tapete"

export default function CutTree({ go, entity }) {
    this.go = go
    this.entity = entity
    this.loot_box = go.loot_box
    this.casting_bar = new CastingBar({ go, entity: entity })
    this.active = false; // Maybe GameObject should control this toggle

    this.act = () => {
        if (this.active) return;

        const targeted_tree = this.go.trees.find((tree) => tree === this.go.selected_clickable)
        if ((!targeted_tree) || (Vector2.distance(targeted_tree, this.go.character) > 100)) {
            return;
        }

        this.go.skills.push(this)
        this.casting_bar.start(3000, () => {
            const index = this.go.trees.indexOf(targeted_tree)
            if (index > -1) {
                // lootboxes have to move from weird
                this.go.loot_box.items = this.go.loot_box.roll_loot(this.loot_table)
                this.go.loot_box.show()
                remove_object_if_present(targeted_tree, this.go.trees)
            }
            remove_clickable(targeted_tree, this.go)
            remove_object_if_present(this, this.go.skills)
        });
    }

    this.loot_table = [{
        item: { name: "Wood", image_src: "branch.png" },
        min: 1,
        max: 3,
        chance: 95
      },
      {
        item: { name: "Dry Leaves", image_src: "leaves.jpeg" },
        min: 1,
        max: 3,
        chance: 100
      }]
      

    this.draw = () => {
        this.casting_bar.draw()
    }
}