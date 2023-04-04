import { CylinderGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export type CylinderParams = ConstructorParameters<typeof CylinderGeometry>

export const [
    increaseCylinderGeometry,
    decreaseCylinderGeometry,
    allocateDefaultCylinderGeometry
] = createInstancePool<CylinderGeometry, CylinderParams>(
    (params) => new CylinderGeometry(...params),
    (geometry) => geometry.dispose()
)
