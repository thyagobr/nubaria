export default function Inventory({ go }) {
  this.go = go
  this.max_slots = 12
  this.slots_per_row = 4
  this.slots = []
  this.slot_padding = 10
  this.slot_width = 50
  this.slot_height = 50
  this.initial_x = this.go.screen.width - (this.slots_per_row * this.slot_width) - 50;
  this.initial_y = this.go.screen.height - (this.slots_per_row * this.slot_height) - 400;
  this.active = false;

  this.add = (item) => {
    const existing_bundle = this.slots.find((bundle) => {
      return bundle.name == item.name
    })

    if ((this.slots.length >= this.max_slots) && (!existing_bundle)) return

    console.log(`*** Got ${item.quantity} ${item.name}`)
    if (existing_bundle) {
      existing_bundle.quantity += item.quantity
    } else {
      this.slots.push(item)
    }
  }
  this.find = (item_name) => {
    return this.slots.find((bundle) => {
      return bundle.name.toLowerCase() == item_name.toLowerCase()
    })
  }

  this.toggle_display = () => {
    this.active = !this.active;
  }

  this.draw = () => {
    if (!this.active) return;

    for (let i = 0; i < this.max_slots; i++) {
      let x = Math.floor(i % 4)
      let y = Math.floor(i / 4);

      if ((this.slots[i] !== undefined) && (this.slots[i] !== null)) {
        const item = this.slots[i];
        this.go.ctx.drawImage(item.image, this.initial_x + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
      } else {
        this.go.ctx.fillStyle = "rgb(0, 0, 0)"
        this.go.ctx.fillRect(this.initial_x + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
      }
      this.go.ctx.strokeStyle = "rgb(60, 40, 0)"
      this.go.ctx.strokeRect(this.initial_x + (this.slot_width * x) + (x * this.slot_padding), this.initial_y + (this.slot_height * y) + (this.slot_padding * y), this.slot_width, this.slot_height)
    }
  }
}
