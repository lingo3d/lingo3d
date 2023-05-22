import { CircleGeometry } from "three"
import createSharedPool from "./utils/createSharedPool"

export type CircleParams = ConstructorParameters<typeof CircleGeometry>

export const [requestCircleGeometry, releaseCircleGeometry] = createSharedPool<
    CircleGeometry,
    CircleParams
>(
    (params) => new CircleGeometry(...params),
    (geometry) => geometry.dispose()
)
