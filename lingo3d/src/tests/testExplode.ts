import { mapRange } from "@lincode/math"
import Model from "../display/Model"
import mathFn from "../math/mathFn"

const model = new Model()
model.src = "bentley/scene.gltf"

// model.onLoad = () => {
//     setTimeout(() => {
//         for (const part of model.findAllMeshes()) {
//             const direction = mathFn.normalize(part.getCenter())
//             direction.y = mapRange(direction.y, -1, 1, 0.2, 1, true)
//             const { x, y, z } = mathFn.multiply(direction, 100)
//             part.lerpTo(x, y, z)
//         }
//     }, 1000)
// }
