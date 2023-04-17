import Model from "../display/Model"
import mathFn from "../math/mathFn"

const model = new Model()
model.src = "bentley1.glb"

model.onLoad = () => {
    for (const part of model.findAll()) {
        const direction = mathFn.normalize(part.getCenter())
        part.onLoop = () => {
            part.translateX(direction.x * 0.1)
            part.translateY(direction.y * 0.1)
            part.translateZ(direction.z * 0.1)
        }
    }
}
