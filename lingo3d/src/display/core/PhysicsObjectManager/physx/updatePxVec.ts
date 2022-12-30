import { Point3d } from "@lincode/math"
import { Object3D, Quaternion, Vector3 } from "three"
import { getPhysX } from "../../../../states/usePhysX"

let pxVec: any
let pxVec_: any
let pxVec__: any
let pxQuat: any
let pxPose: any
let pxPose_: any
let pxPose__: any
getPhysX((val) => {
    pxVec = val.pxVec
    pxVec_ = val.pxVec_
    pxVec__ = val.pxVec__
    pxQuat = val.pxQuat
    pxPose = val.pxPose
    pxPose_ = val.pxPose_
    pxPose__ = val.pxPose__
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

export const assignPxPoseFromVector = (vec: Vector3, quat: Quaternion) => {
    pxPose.set_p(assignPxVec(vec))
    pxPose.set_q(assignPxQuat(quat))
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

export const setPxPosePQ = (p: any, q?: any) => {
    pxPose.set_p(p)
    pxPose.set_q(q ?? setPxQuat(0, 0, 0, 1))
    return pxPose
}

export const setPxPosePQ_ = (p: any, q?: any) => {
    pxPose_.set_p(p)
    pxPose_.set_q(q ?? setPxQuat(0, 0, 0, 1))
    return pxPose_
}

export const setPxPosePQ__ = (p: any, q?: any) => {
    pxPose__.set_p(p)
    pxPose__.set_q(q ?? setPxQuat(0, 0, 0, 1))
    return pxPose__
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

const transform = (t0: any, src: any) =>
    setPxPosePQ(vecPlus(rotate(t0.q, src.p), t0.p), quatMult(t0.q, src.q))

export const multPxTransform = (t0: any, t1: any) => transform(t0, t1)
