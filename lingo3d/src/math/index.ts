import { mapRange } from "@lincode/math"
import average from "./average"
import mToCm from "./mToCm"
import {
    degToRad,
    inverseLerp,
    lerp,
    radToDeg,
    randInt,
    smootherstep,
    smoothstep,
    clamp
} from "three/src/math/MathUtils"
import cmToM from "./cmToM"
import fraction from "./fraction"
import trunc from "./trunc"
import cross from "./cross"
import dot from "./dot"
import length from "./length"
import distance from "./distance"
import normalize from "./normalize"
import reflect from "./reflect"
import project from "./project"
import angle from "./angle"
import rotate from "./rotate"
import rotateX from "./rotateX"
import rotateY from "./rotateY"
import rotateZ from "./rotateZ"
import rotateXY from "./rotateXY"
import rotateXZ from "./rotateXZ"
import rotateYZ from "./rotateYZ"
import multiply from "./multiply"
import multiplyScalar from "./multiplyScalar"

const math = {
    abs: Math.abs,
    log: Math.log,
    sqrt: Math.sqrt,
    min: Math.min,
    max: Math.max,
    randInt,
    mapRange,
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
    average,
    radToDeg,
    degToRad,
    mToCm,
    cmToM,
    lerp,
    inverseLerp,
    smoothstep,
    smootherstep,
    clamp,
    fraction,
    trunc,
    cross,
    dot,
    length,
    distance,
    normalize,
    reflect,
    project,
    angle,
    rotate,
    rotateX,
    rotateY,
    rotateZ,
    rotateXY,
    rotateXZ,
    rotateYZ,
    multiply,
    multiplyScalar
}

export default math
