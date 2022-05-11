import { Vector2 } from "three"
import { Cube } from ".."
//@ts-ignore
import roadSrc from "../../assets-local/road.jpg"

export default {}

const cube = new Cube()
cube.texture = roadSrc

setTimeout(() => {
    cube.textureRepeat = new Vector2(4, 4)
}, 1000)