export default function Loot({ go, entity, loot_bag }) {
    this.go = go
    this.entity = entity
    this.loot_bag = loot_bag

    this.act = () => {
        this.go.loot_box.items = this.go.loot_box.roll_loot(this.loot_bag.entity.loot_table)
        this.go.loot_box.show()
    }
}