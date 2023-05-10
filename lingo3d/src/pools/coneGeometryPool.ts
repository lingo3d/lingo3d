import { ConeGeometry } from "three"
import createInstancePool from "./utils/createInstancePool"

export type ConeParams = ConstructorParameters<typeof ConeGeometry>

export const [
    requestConeGeometry,
    releaseConeGeometry,
    allocateDefaultConeGeometry
] = createInstancePool<ConeGeometry, ConeParams>(
    (params) => new ConeGeometry(...params),
    (geometry) => geometry.dispose()
)
