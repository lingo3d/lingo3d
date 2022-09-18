import { Vector2 } from "three"
import { Cube } from ".."

const cube = new Cube()
cube.texture = "road.jpg"

setTimeout(() => {
    cube.textureRepeat = new Vector2(4, 4)
}, 1000)