import Character from "../src/character.js"
import Screen from "../src/screen.js"
import GameObject from "../src/game_object.js"

export default function CharacterTest() {
    this.run = () => {
        let name = "Archon"
        const go = new GameObject()
        const screen = new Screen(go)
        const character = new Character(go)
        character.name = name

        if (character.name === name) {
            console.log("*PASS*")
        } else {
            console.log("*FAIL*")
        }
    }
}