import mouse from "../api/mouse"
import Cube from "../display/primitives/Cube"
import clientToWorld from "../display/utils/clientToWorld"

const box = new Cube()
box.height = 20
box.depth = 20

mouse.onMouseMove = (e) => {
    const { x, y, z } = clientToWorld(e.clientX, e.clientY)
    box.x = x
    box.y = y
    box.z = z
}

const box2 = new Cube()

box.hitTarget = [box2]
box.onHit = () => {

}

box.onLoop = () => {
    box.rotationZ += 1
    box2.rotationZ -= 1
}
