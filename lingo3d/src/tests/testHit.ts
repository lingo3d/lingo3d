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

box2.moveTo(300, 300, -300)
box2.onMoveToEnd = () => {
    console.log("done")
}
box2.lookTo(100, 100, 100, 0.05)
box2.onLookToEnd = () => {
    console.log("look done")
}