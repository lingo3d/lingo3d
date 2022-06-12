import Model from "../display/Model"
import Plane from "../display/primitives/Plane"

const model = new Model()
model.src = "bot.fbx"

const plane = new Plane()
plane.z = -100
plane.scale = 10
plane.rotationX = -45
plane.onLoop = () => {
    plane.rotationX -= 0.1
}