import { CylinderGeometry } from "three"
import createInstancePool from "./utils/createInstancePool"

export type CylinderParams = ConstructorParameters<typeof CylinderGeometry>

export const [
    requestCylinderGeometry,
    releaseCylinderGeometry,
    allocateDefaultCylinderGeometry
] = createInstancePool<CylinderGeometry, CylinderParams>(
    (params) => new CylinderGeometry(...params),
    (geometry) => geometry.dispose()
)
