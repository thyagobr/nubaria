import Item from "./item";
import Loot from "./loot";

class LootBox {
    constructor(go) {
        this.visible = false
        this.go = go
        this.items = []
        this.x = 0
        this.y = 0
        this.width = 350
    }

    draw() {
        if (!this.visible) return;

        this.go.ctx.fillStyle = "rgba(255, 200, 255, 0.5)";
        this.go.ctx.lineJoin = 'bevel';
        this.go.ctx.fillRect(this.x + 20 - this.go.camera.x, this.y + 20 - this.go.camera.y, this.width, this.items.length * 60 + 5);

        for (let index = 0; index < this.items.length; index++) {
            let loot = this.items[index]
            this.go.ctx.fillStyle = "rgb(0, 0, 0)"
            loot.x = this.x + 25 - this.go.camera.x
            loot.y = this.y + (index * 60) + 25 - this.go.camera.y
            loot.width = 340
            loot.height = 55
            this.go.ctx.fillRect(loot.x, loot.y, loot.width, loot.height)
            this.go.ctx.drawImage(loot.item.image, loot.x + 5, loot.y + (index * 60) + 5, 45, 45)
            this.go.ctx.fillStyle = "rgb(255, 255, 255)"
            this.go.ctx.font = '22px serif'
            this.go.ctx.fillText(loot.quantity, loot.x + 65, loot.y + (index * 60) + 35)
            this.go.ctx.fillText(loot.item.name, loot.x + 100, loot.y + (index * 60) + 35)
        }
    }

    take_loot(loot_index) {
        let loot = this.items.splice(loot_index, 1)[0]
        this.go.character.inventory.add(loot.item)
        if (this.items.length <= 0) this.visible = false
    }

    check_item_clicked(ev) {
        if (!this.visible) return

        let index = this.items.findIndex((loot) => {
            return (
                (ev.clientX >= loot.x) &&
                (ev.clientX <= loot.x + loot.width) &&
                (ev.clientY >= loot.y) &&
                (ev.clientY <= loot.y + loot.height)
            )
        })

        if (index > -1) {
            this.take_loot(index)
        }
    }
}

export default LootBox