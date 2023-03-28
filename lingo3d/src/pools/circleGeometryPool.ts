import { CircleGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export const [
    increaseCircleGeometry,
    decreaseCircleGeometry,
    allocateDefaultCircleGeometry
] = createInstancePool<CircleGeometry>(
    (params) => new CircleGeometry(...params),
    (geometry) => geometry.dispose()
)
