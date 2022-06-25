import Item from "./item";
import Loot from "./loot";

class LootBox {
    constructor(go) {
        this.visible = false
        this.go = go
        this.items = []
        this.x = 0
        this.y = 0
    }

    draw() {
        if (!this.visible) return;

        this.go.ctx.fillStyle = "rgba(255, 200, 255, 0.5)";
        this.go.ctx.lineJoin = 'bevel';
        this.go.ctx.fillRect(this.x + 20, this.y + 20, 350, this.items.length * 60 + 5);

        for (let index = 0; index < this.items.length; index++) {
            let loot = this.items[index]
            this.go.ctx.fillStyle = "rgb(0, 0, 0)"
            this.go.ctx.fillRect(this.x + 25, this.y + (index * 60) + 25, 340, 55)
            this.go.ctx.drawImage(loot.item.image, this.x + 30, this.y + (index * 60) + 30, 45, 45)
            this.go.ctx.fillStyle = "rgb(255, 255, 255)"
            this.go.ctx.font = '22px serif'
            this.go.ctx.fillText(loot.quantity, this.x + 85, this.y + (index * 60) + 60)
            this.go.ctx.fillText(loot.item.name, this.x + 110, this.y + (index * 60) + 60)
        }
    }
}

export default LootBox