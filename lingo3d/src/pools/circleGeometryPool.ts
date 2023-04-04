import { CircleGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export type CircleParams = ConstructorParameters<typeof CircleGeometry>

export const [
    increaseCircleGeometry,
    decreaseCircleGeometry,
    allocateDefaultCircleGeometry
] = createInstancePool<CircleGeometry, CircleParams>(
    (params) => new CircleGeometry(...params),
    (geometry) => geometry.dispose()
)
