import { ConeGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export type ConeParams = ConstructorParameters<typeof ConeGeometry>

export const [
    increaseConeGeometry,
    decreaseConeGeometry,
    allocateDefaultConeGeometry
] = createInstancePool<ConeGeometry, ConeParams>(
    (params) => new ConeGeometry(...params),
    (geometry) => geometry.dispose()
)
