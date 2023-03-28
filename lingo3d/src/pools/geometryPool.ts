import { BufferGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export const [
    increaseGeometryCount,
    decreaseGeometryCount,
    allocateDefaultGeometry
] = createInstancePool<BufferGeometry>(
    (ClassVal, params) => new ClassVal(...params),
    (geometry) => geometry.dispose()
)
