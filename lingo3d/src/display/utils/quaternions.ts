import { Quaternion } from "three"

export const addQuaternions = (a: Quaternion, b: Quaternion) => {
    const qax = a.x,
        qay = a.y,
        qaz = a.z,
        qaw = a.w
    const qbx = b.x,
        qby = b.y,
        qbz = b.z,
        qbw = b.w

    a.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby
    a.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz
    a.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx
    a.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz

    return a
}

export const subQuaternions = (a: Quaternion, b: Quaternion) => {
    const qax = a.x,
        qay = a.y,
        qaz = a.z,
        qaw = a.w
    const qbx = b.x,
        qby = b.y,
        qbz = b.z,
        qbw = b.w

    a.x = qax * qbw - qaw * qbx - qay * qbz + qaz * qby
    a.y = qay * qbw - qaw * qby - qaz * qbx + qax * qbz
    a.z = qaz * qbw - qaw * qbz - qax * qby + qay * qbx
    a.w = qaw * qbw + qax * qbx + qay * qby + qaz * qbz

    return a
}
