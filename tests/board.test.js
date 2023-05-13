import GameObject from "../src/game_object.js"
import Board from "../src/board.js"
import World from "../src/world.js";
import Creep from "../src/beings/creep.js";
import Character from "../src/character.js";
import Screen from "../src/screen.js";
import { is_colliding } from "../src/tapete.js";

export default function BoardTest() {
    this.before = () => {
        this.go = new GameObject()
        this.world = new World(this.go)
        this.screen = new Screen(this.go)
    }

    this.run = () => {
        this.before()

        const radius = 20;
        const entity = new Creep({ go: this.go })
        entity.x = 10;
        entity.y = 10;
        entity.width = 1;
        entity.height = 1;
        const character = new Character(this.go)
        character.x = 15;
        character.y = 15;
        character.width = 1;
        character.height = 1;
        const board = new Board({ go: this.go, entity, radius })

        board.build_grid()

        console.log("Expect board.width == radius * 2...")
        if (board.width === radius * 2) {
            console.log("SUCCESS")
        } else {
            console.log("FAIL")
        }

        console.log("Expect board grid to have correct 2d sizes")
        if (board.grid.length === board.width + 1) {
            if (board.grid[0].length === board.height + 1) {
                console.log("SUCCESS")
            } else {
                console.log("FAIL")
                console.log(`-> expected board.grid[0].length to eq ${board.height}, but it is ${board.grid[0].length}`)
            }
        } else {
            console.log("FAIL")
            console.log(`-> expected board.grid.length to eq ${board.width}, but it is ${board.grid.length}`)
        }

        console.log("#get_node_for_character")
        const node = board.get_node_for(character)
        if (is_colliding(node, character)) {
            console.log("SUCCESS")
        } else {
            console.log("FAIL")
            console.log(`-> expected Character position ${character.x},${character.y} to collide with Node position ${node.x},${node.y}, but it didn't`)
        }
    }
}