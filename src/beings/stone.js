import Doodad from "../doodad";
import { random } from "../tapete";

export default function Stone({ go }) {
    this.__proto__ = new Doodad({ go })

    this.image.src = "flintstone.png"
    this.x = random(1, this.go.world.width);
    this.y = random(1, this.go.world.height);
    this.image_width = 840
    this.image_height = 859
    this.image_x_offset = 0
    this.image_y_offset = 0
    this.width = 32
    this.height = 32
}