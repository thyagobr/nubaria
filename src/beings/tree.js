import Doodad from "../doodad";
import { random } from "../tapete";

export default function Tree({ go }) {
    this.__proto__ = new Doodad({ go })

    this.image.src = "plants.png"
    this.x = random(1, this.go.world.width);
    this.y = random(1, this.go.world.height);
    this.image_width = 98
    this.image_x_offset = 127
    this.image_height = 126
    this.image_y_offset = 290
    this.width = 98
    this.height = 126
    this.acted_by_skill = "cut_tree"
}