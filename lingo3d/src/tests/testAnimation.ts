import Model from "../display/Model"
import Cube from "../display/primitives/Cube"

const box = new Cube()
box.animation = {
    rotationX: [0, 360]
}
console.log(box.uuid)
