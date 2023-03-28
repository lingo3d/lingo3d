import { TorusGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export const [
    increaseTorusGeometry,
    decreaseTorusGeometry,
    allocateDefaultTorusGeometry
] = createInstancePool<TorusGeometry>(
    (params) => new TorusGeometry(...params),
    (geometry) => geometry.dispose()
)
