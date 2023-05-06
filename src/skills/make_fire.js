import CastingBar from "../casting_bar";
import Doodad from "../doodad";

export default function MakeFire({ go , entity }) {
    this.go = go;
    this.entity = entity || go.character
    this.casting_bar = new CastingBar({ go, entity: this.entity })
    this.go.fires = this.go.fires || []
    this.entity.

    this.make_fire = () => {
        let dry_leaves = this.entity.inventory.find("dry leaves")
        let wood = this.entity.inventory.find("wood")
        let flintstone = this.entity.inventory.find("flintstone")
        if (dry_leaves && dry_leaves.quantity > 0 &&
            wood && wood.quantity > 0 &&
            flintstone && flintstone.quantity > 0) {
            this.casting_bar.start(1500)

            setTimeout(() => {
                dry_leaves.quantity -= 1
                wood.quantity -= 1
                if (this.go.selected_clickable &&
                    this.go.selected_clickable.type === "BONFIRE") {
                    let fire = this.go.fires.find((fire) => this.go.selected_clickable === fire);
                    fire.fuel += 20;
                    fire.resource_bar.current += 20;
                } else {
                    let fire = new Doodad({ go })
                    fire.type = "BONFIRE"
                    fire.image.src = "bonfire.png"
                    fire.image_x_offset = 250
                    fire.image_y_offset = 250
                    fire.image_height = 350
                    fire.image_width = 300
                    fire.width = 64
                    fire.height = 64
                    fire.x = entity.x;
                    fire.y = entity.y;
                    fire.fuel = 20;
                    fire.resource_bar = new ResourceBar({ go, x: fire.x, y: fire.y + fire.height, width: fire.width, height: 5 })
                    fire.resource_bar.static = true
                    fire.resource_bar.full = 20;
                    fire.resource_bar.current = 20;
                    this.go.fires.push(fire)
                    this.go.clickables.push(fire)
                }
            }, 1500)
        } else {
            console.log("You dont have all required materials to make a fire.")
        }
    }
}