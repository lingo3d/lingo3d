import { mapRange } from "@lincode/math"
import Model from "../display/Model"
import mathFn from "../math/mathFn"
import loadJSON from "../display/utils/loaders/loadJSON"
import deserialize from "../api/serializer/deserialize"
import { getAppendablesById } from "../collections/uuidCollections"

const data: any = await loadJSON("car/bentley.json")
deserialize(data)

const [found] = getAppendablesById("car")
const model = found as Model

// model.onLoad = () => {
//     setTimeout(async () => {
//         for (const part of model.findAllMeshes()) {
//             const direction = mathFn.normalize(part.getCenter())
//             direction.y =
//                 mapRange(direction.y, -1, 1, 0, 1, true) *
//                 mathFn.randomRange(1, 2)
//             direction.x = direction.x * mathFn.randomRange(0.5, 1)
//             direction.z = direction.z * mathFn.randomRange(0.5, 1)
//             const { x, y, z } = mathFn.multiply(direction, 50)
//             part.lerpTo(x, y, z)
//             await new Promise<void>((resolve) => setTimeout(resolve, 10))
//         }
//     }, 1000)
// }
