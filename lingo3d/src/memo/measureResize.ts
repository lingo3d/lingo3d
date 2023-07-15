import { Object3D } from "three"
import { measure } from "./measure"
import computeOnceWithData from "./utils/computeOnceWithData"

export const measureResize = computeOnceWithData(
    (src: string, data: { target: Object3D }) => {
        let [size, center] = measure(src, data)
        const scale = 1 / size.y

        center = center.clone().multiplyScalar(scale)
        size = size.clone().multiplyScalar(scale)

        return <const>[size, center, scale]
    }
)
