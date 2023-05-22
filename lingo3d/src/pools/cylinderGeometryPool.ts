import { CylinderGeometry } from "three"
import createSharedPool from "./utils/createSharedPool"

export type CylinderParams = ConstructorParameters<typeof CylinderGeometry>

export const [requestCylinderGeometry, releaseCylinderGeometry] =
    createSharedPool<CylinderGeometry, CylinderParams>(
        (params) => new CylinderGeometry(...params),
        (geometry) => geometry.dispose()
    )
