import { TorusGeometry } from "three"
import createInstancePool from "./utils/createInstancePool"

export type TorusParams = ConstructorParameters<typeof TorusGeometry>

export const [
    requestTorusGeometry,
    releaseTorusGeometry,
    allocateDefaultTorusGeometry
] = createInstancePool<TorusGeometry, TorusParams>(
    (params) => new TorusGeometry(...params),
    (geometry) => geometry.dispose()
)
