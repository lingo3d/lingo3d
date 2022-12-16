import { Point3d } from "@lincode/math"
import { getPhysX } from "../../../../states/usePhysX"

let pxVec: any
getPhysX((val) => (pxVec = val.pxVec))

export const setPxVec = (x: number, y: number, z: number) => {
    pxVec.set_x(x)
    pxVec.set_y(y)
    pxVec.set_z(z)
    return pxVec
}

export const assignPxVec = (pt: Point3d) => {
    pxVec.set_x(pt.x)
    pxVec.set_y(pt.y)
    pxVec.set_z(pt.z)
    return pxVec
}
