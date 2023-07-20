import { Object3D } from "three"
import { measure } from "./measure"
import computeOnceWithData from "./utils/computeOnceWithData"

export const measureResize = computeOnceWithData(
    (src: string, data: { target: Object3D }) => {
        const [size, center] = measure(src, data)
        const scale = 1 / size.y

        return <const>[
            size.clone().multiplyScalar(scale),
            center.clone().multiplyScalar(scale),
            scale
        ]
    }
)
