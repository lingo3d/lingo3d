import Model from "../display/Model"
import mathFn from "../math/mathFn"

const model = new Model()
model.src = "bentley1.glb"

model.onLoad = () => {
    for (const part of model.findAll()) {
        const direction = mathFn.normalize(part.getCenter())
        part.onLoop = () => {
            part.moveDirection(direction, 0.1)
        }
    }
}
