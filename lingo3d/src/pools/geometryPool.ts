import { BufferGeometry } from "three"
import createInstancePool from "../display/core/utils/createInstancePool"

export const [increaseGeometry, decreaseGeometry, allocateDefaultGeometry] =
    createInstancePool<BufferGeometry>(
        (ClassVal, params) => new ClassVal(...params),
        (geometry) => geometry.dispose()
    )
