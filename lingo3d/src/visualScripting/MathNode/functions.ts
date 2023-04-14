import { deg2Rad, mapRange, Point3d, rad2Deg } from "@lincode/math"
import { random } from "nanoid"

export default {
    abs: Math.abs,
    log: Math.log,
    sqrt: Math.sqrt,
    min: Math.min,
    max: Math.max,
    randomRange: random,
    mapRange: mapRange,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    sign: Math.sign,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    atan2: Math.atan2,
    radToDeg: (rad: number) => rad * rad2Deg,
    degToRad: (deg: number) => deg * deg2Rad,
    mToCM: (m: number) => m * 100,
    cmToM: (cm: number) => cm / 100,
    lerp: (a: number, b: number, t: number) => a + (b - a) * t,
    inverseLerp: (a: number, b: number, t: number) => (t - a) / (b - a),
    smoothStep: (a: number, b: number, t: number) =>
        t * t * (3 - 2 * t) * (b - a) + a,
    clamp: (val: number, min: number, max: number) =>
        Math.min(Math.max(val, min), max),
    fraction: (val: number) => val - Math.floor(val),
    trunc: (val: number) => Math.trunc(val),
    cross: (a: Point3d, b: Point3d) =>
        new Point3d(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        ),
    dot: (a: Point3d, b: Point3d) => a.x * b.x + a.y * b.y + a.z * b.z,
    length: (a: Point3d) => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),
    distance: (a: Point3d, b: Point3d) =>
        Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2),
    normalize: (a: Point3d) => {
        const length = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
        return new Point3d(a.x / length, a.y / length, a.z / length)
    },
    reflect: (a: Point3d, b: Point3d) => {
        const dot = a.x * b.x + a.y * b.y + a.z * b.z
        return new Point3d(
            a.x - 2 * dot * b.x,
            a.y - 2 * dot * b.y,
            a.z - 2 * dot * b.z
        )
    },
    project: (a: Point3d, b: Point3d) => {
        const dot = a.x * b.x + a.y * b.y + a.z * b.z
        return new Point3d(dot * b.x, dot * b.y, dot * b.z)
    },
    angle: (a: Point3d, b: Point3d) => {
        const dot = a.x * b.x + a.y * b.y + a.z * b.z
        const length =
            Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) *
            Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z)
        return Math.acos(dot / length)
    },
    rotate: (a: Point3d, axis: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const dot = a.x * axis.x + a.y * axis.y + a.z * axis.z
        return new Point3d(
            (a.x - axis.x * dot) * cos +
                dot * axis.x +
                (-axis.z * a.y + axis.y * a.z) * sin,
            (a.y - axis.y * dot) * cos +
                dot * axis.y +
                (axis.z * a.x - axis.x * a.z) * sin,
            (a.z - axis.z * dot) * cos +
                dot * axis.z +
                (-axis.y * a.x + axis.x * a.y) * sin
        )
    },
    rotateX: (a: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Point3d(a.x, a.y * cos - a.z * sin, a.y * sin + a.z * cos)
    },
    rotateY: (a: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Point3d(a.x * cos + a.z * sin, a.y, -a.x * sin + a.z * cos)
    },
    rotateZ: (a: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Point3d(a.x * cos - a.y * sin, a.x * sin + a.y * cos, a.z)
    },
    rotateXY: (a: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Point3d(a.x * cos - a.y * sin, a.x * sin + a.y * cos, a.z)
    },
    rotateXZ: (a: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Point3d(a.x * cos + a.z * sin, a.y, -a.x * sin + a.z * cos)
    },
    rotateYZ: (a: Point3d, angle: number) => {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Point3d(a.x, a.y * cos - a.z * sin, a.y * sin + a.z * cos)
    }
}
