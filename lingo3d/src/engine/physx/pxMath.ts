import { Quaternion } from "three"
import MeshAppendable from "../../display/core/MeshAppendable"
import { getPhysXLoaded } from "../../states/usePhysXLoaded"
import { physxPtr } from "../../pointers/physxPtr"
import { Point3dType } from "../../typeGuards/isPoint"

let pxVec: any
let pxVec_: any
let pxVec__: any
let pxExtendedVec: any
let pxQuat: any
let pxTransform: any
let pxTransform_: any
let pxTransform__: any
getPhysXLoaded((loaded) => {
    if (!loaded) return
    const val = physxPtr[0]
    pxVec = val.pxVec
    pxVec_ = val.pxVec_
    pxVec__ = val.pxVec__
    pxExtendedVec = val.pxExtendedVec
    pxQuat = val.pxQuat
    pxTransform = val.pxTransform
    pxTransform_ = val.pxTransform_
    pxTransform__ = val.pxTransform__
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

export const setPxVec__ = (x: number, y: number, z: number) => {
    pxVec__.set_x(x)
    pxVec__.set_y(y)
    pxVec__.set_z(z)
    return pxVec__
}

export const setPxExtendedVec = (x: number, y: number, z: number) => {
    pxExtendedVec.set_x(x)
    pxExtendedVec.set_y(y)
    pxExtendedVec.set_z(z)
    return pxExtendedVec
}

export const assignPxVec = (pt: Point3dType) => setPxVec(pt.x, pt.y, pt.z)

export const assignPxVec_ = (pt: Point3dType) => setPxVec_(pt.x, pt.y, pt.z)

export const assignPxExtendedVec = (pt: Point3dType) =>
    setPxExtendedVec(pt.x, pt.y, pt.z)

export const setPxQuat = (x: number, y: number, z: number, w: number) => {
    pxQuat.set_x(x)
    pxQuat.set_y(y)
    pxQuat.set_z(z)
    pxQuat.set_w(w)
    return pxQuat
}

export const assignPxQuat = (q: Quaternion) => setPxQuat(q.x, q.y, q.z, q.w)

export const assignPxTransform = (manager: MeshAppendable) => {
    pxTransform.set_p(assignPxVec(manager.position))
    pxTransform.set_q(assignPxQuat(manager.quaternion))
    return pxTransform
}

export const assignPxTransform_ = (manager: MeshAppendable) => {
    pxTransform_.set_p(assignPxVec(manager.position))
    pxTransform_.set_q(assignPxQuat(manager.quaternion))
    return pxTransform_
}

export const setPxTransform = (
    x: number,
    y: number,
    z: number,
    qx = 0,
    qy = 0,
    qz = 0,
    qw = 1
) => {
    pxTransform.set_p(setPxVec(x, y, z))
    pxTransform.set_q(setPxQuat(qx, qy, qz, qw))
    return pxTransform
}

export const setPxTransform_ = (
    x: number,
    y: number,
    z: number,
    qx = 0,
    qy = 0,
    qz = 0,
    qw = 1
) => {
    pxTransform_.set_p(setPxVec(x, y, z))
    pxTransform_.set_q(setPxQuat(qx, qy, qz, qw))
    return pxTransform_
}

export const setPxTransform__ = (
    x: number,
    y: number,
    z: number,
    qx = 0,
    qy = 0,
    qz = 0,
    qw = 1
) => {
    pxTransform__.set_p(setPxVec(x, y, z))
    pxTransform__.set_q(setPxQuat(qx, qy, qz, qw))
    return pxTransform__
}

const rotate = (q0: any, v: any) => {
    const { w, x, y, z } = q0
    const vx = 2.0 * v.x
    const vy = 2.0 * v.y
    const vz = 2.0 * v.z
    const w2 = w * w - 0.5
    const dot2 = x * vx + y * vy + z * vz
    return setPxVec(
        vx * w2 + (y * vz - z * vy) * w + x * dot2,
        vy * w2 + (z * vx - x * vz) * w + y * dot2,
        vz * w2 + (x * vy - y * vx) * w + z * dot2
    )
}

const vecPlus = (v0: any, v: any) =>
    setPxVec_(v0.x + v.x, v0.y + v.y, v0.z + v.z)

const quatMult = (q0: any, q: any) => {
    const { w, x, y, z } = q0
    return setPxQuat(
        w * q.x + q.w * x + y * q.z - q.y * z,
        w * q.y + q.w * y + z * q.x - q.z * x,
        w * q.z + q.w * z + x * q.y - q.x * y,
        w * q.w - x * q.x - y * q.y - z * q.z
    )
}

export const multPxTransform = (t0: any, t1: any) => {
    pxTransform.set_p(vecPlus(rotate(t0.q, t1.p), t0.p))
    pxTransform.set_q(quatMult(t0.q, t1.q))
    return pxTransform
}
