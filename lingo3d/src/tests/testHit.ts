import mouse from "../api/mouse"
import Cube from "../display/primitives/Cube"
import clientToWorld from "../display/utils/clientToWorld"
import worldToCanvas from "../display/utils/worldToCanvas"

const box = new Cube()
box.height = 20
box.depth = 20

mouse.onMouseMove = (e) => {
    const { x, y, z } = clientToWorld(e.clientX, e.clientY, 500)
    box.x = x
    box.y = y
    box.z = z
}

const box2 = new Cube()

box.onLoop = () => {
    box.rotationZ += 1
    box2.rotationZ -= 1

    if (box.hitTest(box2)) {
        box.color = "red"
        box2.color = "red"
    }
    else {
        box.color = "white"
        box2.color = "white"
    }
}
