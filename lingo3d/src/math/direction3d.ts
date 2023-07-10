import { vector3 } from "../display/utils/reusables"
import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (fromPoint: Point3dType, toPoint: Point3dType) => {
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()
    return new Point3d(vector3.x, vector3.y, vector3.z)
}
