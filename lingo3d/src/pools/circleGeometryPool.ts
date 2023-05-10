import { CircleGeometry } from "three"
import createInstancePool from "./utils/createInstancePool"

export type CircleParams = ConstructorParameters<typeof CircleGeometry>

export const [requestCircleGeometry, releaseCircleGeometry] =
    createInstancePool<CircleGeometry, CircleParams>(
        (params) => new CircleGeometry(...params),
        (geometry) => geometry.dispose()
    )
