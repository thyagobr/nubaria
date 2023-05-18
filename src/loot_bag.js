import Position from "./position"

export default function LootBag({ go, entity }) {
    this.go = go
    this.id = `loot_bag`
    this.position = new Position({ x: entity.position.height, y: entity.y, width: 50, height: 50 })
    this.image = new Image()
    this.image.src = 'backpack.png'
    this.go.clickables.push(this);

    this.draw = () => {
        this.go.ctx.drawImage(this.image, 0, 0, 1000, 1000, this.position.x - this.go.camera.x, this.position.y - this.go.camera.y, this.position.width, this.position.height)
    }
}