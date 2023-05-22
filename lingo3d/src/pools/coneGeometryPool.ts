import { ConeGeometry } from "three"
import createSharedPool from "./utils/createSharedPool"

export type ConeParams = ConstructorParameters<typeof ConeGeometry>

export const [requestConeGeometry, releaseConeGeometry] = createSharedPool<
    ConeGeometry,
    ConeParams
>(
    (params) => new ConeGeometry(...params),
    (geometry) => geometry.dispose()
)
