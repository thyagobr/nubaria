import Character from "../src/character.js"
import GameObject from "../src/game_object.js"

export default function CharacterTest() {
    this.run = () => {
        let name = "Archon"
        const go = new GameObject()
        const character = new Character(go)
        character.name = name

        if (character.name === name) {
            console.log("*PASS*")
        } else {
            console.log("*FAIL*")
        }
    }
}