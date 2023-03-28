import { ConeGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export const [
    increaseConeGeometry,
    decreaseConeGeometry,
    allocateDefaultConeGeometry
] = createInstancePool<ConeGeometry>(
    (params) => new ConeGeometry(...params),
    (geometry) => geometry.dispose()
)
