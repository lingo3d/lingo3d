import { TorusGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export type TorusParams = ConstructorParameters<typeof TorusGeometry>

export const [
    increaseTorusGeometry,
    decreaseTorusGeometry,
    allocateDefaultTorusGeometry
] = createInstancePool<TorusGeometry, TorusParams>(
    (params) => new TorusGeometry(...params),
    (geometry) => geometry.dispose()
)
