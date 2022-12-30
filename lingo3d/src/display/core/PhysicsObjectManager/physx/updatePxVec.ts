import { Point3d } from "@lincode/math"
import { Object3D, Quaternion } from "three"
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

export const setPxVec_ = (x: number, y: number, z: number) => {
    pxVec_.set_x(x)
    pxVec_.set_y(y)
    pxVec_.set_z(z)
    return pxVec_
}

export const assignPxVec = (pt: Point3d) => setPxVec(pt.x, pt.y, pt.z)

export const assignPxVec_ = (pt: Point3d) => setPxVec_(pt.x, pt.y, pt.z)

export const setPxQuat = (x: number, y: number, z: number, w: number) => {
    pxQuat.set_x(x)
    pxQuat.set_y(y)
    pxQuat.set_z(z)
    pxQuat.set_w(w)
    return pxQuat
}

export const assignPxQuat = (q: Quaternion) => setPxQuat(q.x, q.y, q.z, q.w)

export const assignPxPose = (target: Object3D) => {
    pxPose.set_p(assignPxVec(target.position))
    pxPose.set_q(assignPxQuat(target.quaternion))
    return pxPose
}

export const setPxPose = (
    x: number,
    y: number,
    z: number,
    qx = 0,
    qy = 0,
    qz = 0,
    qw = 1
) => {
    pxPose.set_p(setPxVec(x, y, z))
    pxPose.set_q(setPxQuat(qx, qy, qz, qw))
    return pxPose
}
