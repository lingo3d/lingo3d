import { TorusGeometry } from "three"
import createSharedPool from "./utils/createSharedPool"

export type TorusParams = ConstructorParameters<typeof TorusGeometry>

export const torusGeometryPool = createSharedPool<TorusGeometry, TorusParams>(
    (params) => new TorusGeometry(...params),
    (geometry) => geometry.dispose()
)
