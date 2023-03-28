import { CylinderGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export const [
    increaseCylinderGeometry,
    decreaseCylinderGeometry,
    allocateDefaultCylinderGeometry
] = createInstancePool<CylinderGeometry>(
    (params) => new CylinderGeometry(...params),
    (geometry) => geometry.dispose()
)
