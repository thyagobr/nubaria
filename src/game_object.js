const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d')

function GameObject() {
  this.canvas = canvas
  this.canvas_rect = canvas.getBoundingClientRect()
  this.canvas.setAttribute('width', this.canvas_rect.width);
  this.canvas.setAttribute('height', this.canvas_rect.height);
  this.ctx = ctx
  this.tile_size = 20
  this.character = {}
  this.clickables = []
  this.messages = []
  this.selected_clickable = null
  this.players = []
  this.spells = [] // Spell system, could be injected by it as well
  this.skills = [];
  this.trees = [];
  this.fires = [];
  this.stones = [];
  this.loot_bags = [];
  this.managed_objects = [] // Random objects to draw/update

  this.draw_objects = () => {
    this.stones.forEach(stone => stone.draw())
    this.trees.forEach(tree => tree.draw())
    this.players.forEach(player => player.draw())
    this.fires.forEach(fire => fire.draw())
    this.spells.forEach(spell => spell.draw())
    this.skills.forEach(skill => skill.draw())
    this.creeps.forEach(creep => creep.draw())
    this.loot_bags.forEach(loot_bag => loot_bag.draw())
    this.managed_objects.forEach(mob => mob.draw())
  }

  this.update_objects = () => {
    this.spells.forEach(spell => spell.update())
    this.loot_bags.forEach(loot_bag => loot_bag.update())
    this.managed_objects.forEach(mob => mob.update())
  }

  this.update_fps_objects = () => {
    this.fires.forEach(fire => fire.update_fps())
  }

  this.draw_selected_clickable = function () {
    if (this.selected_clickable) {
      this.ctx.save()
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = "yellow"
      this.ctx.strokeStyle = `rgba(255, 255, 0, 0.7)`
      this.ctx.beginPath()
      this.ctx.arc(
        this.selected_clickable.x + (this.selected_clickable.width / 2) - this.camera.x,
        this.selected_clickable.y + (this.selected_clickable.height / 2) - this.camera.y,
        this.selected_clickable.width, 0, 50
      )
      this.ctx.stroke()
      this.ctx.restore();
    }
  }
}

export default GameObject