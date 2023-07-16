import { Object3D } from "three"
import getWorldPosition from "./getWorldPosition"
import computePerFrame from "./utils/computePerFrame"
import { toFixedPoint } from "../api/serializer/toFixed"
import { Point3dType } from "../typeGuards/isPoint"
import equals from "../math/equals"

const positionCache = new WeakMap<Object3D, Point3dType>()

export const positionChanged = computePerFrame((target: Object3D) => {
    const position = toFixedPoint(getWorldPosition(target))
    const positionOld = positionCache.get(target)
    const result = positionOld ? !equals(position, positionOld) : true
    positionCache.set(target, position)
    return result
})
