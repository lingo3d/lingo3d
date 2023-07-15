import HelperSphere from "../display/core/helperPrimitives/HelperSphere"
import { Point3dType } from "../typeGuards/isPoint"

export const curveHelperSpherePointMap = new WeakMap<
    HelperSphere,
    Point3dType
>()
