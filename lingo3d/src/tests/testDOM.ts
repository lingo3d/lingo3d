import mouse from "../api/mouse"
import Cube from "../display/primitives/Cube"

let cube = new Cube()

mouse.onMouseMove = () => {
    cube.x = mouse.x
    cube.y = mouse.y
    console.log(cube.clientX, cube.clientY)
}