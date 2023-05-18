import Doodad from "../doodad"

export default function LootBag({ go, entity }) {
    this.__proto__ = new Doodad({ go })

    this.id = `loot_bag`
    this.go = go
    this.entity = entity
    this.x = entity.x
    this.y = entity.y
    this.width = 50
    this.height = 50
    this.image = new Image()
    this.image.src = 'backpack.png'
    this.go.clickables.push(this);

    this.draw = () => {
        this.go.ctx.drawImage(this.image, 0, 0, 1000, 1000, this.x - this.go.camera.x, this.y - this.go.camera.y, this.width, this.height)
    }

    this.acted_by_skill = 'loot'
}