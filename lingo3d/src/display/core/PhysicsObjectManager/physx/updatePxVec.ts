import { Point3d } from "@lincode/math"
import { Object3D } from "three"
import { getPhysX } from "../../../../states/usePhysX"

let pxVec: any
let pxVec_: any
let pxQuat: any
let pxPose: any
getPhysX((val) => {
    pxVec = val.pxVec
    pxVec_ = val.pxVec_
    pxQuat = val.pxQuat
    pxPose = val.pxPose
})

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

export const assignPxVec_ = (pt: Point3d) => {
    pxVec_.set_x(pt.x)
    pxVec_.set_y(pt.y)
    pxVec_.set_z(pt.z)
    return pxVec_
}

export const setPxPose = (target: Object3D) => {
    const { position, quaternion } = target

    pxQuat.set_x(quaternion.x)
    pxQuat.set_y(quaternion.y)
    pxQuat.set_z(quaternion.z)
    pxQuat.set_w(quaternion.w)

    pxPose.set_p(assignPxVec(position))
    pxPose.set_q(pxQuat)

    return pxPose
}
