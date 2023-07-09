import average from "./average"
import mToCm from "./mToCm"
import {
    degToRad,
    inverseLerp,
    lerp,
    radToDeg,
    randInt,
    randFloat,
    smootherstep,
    smoothstep,
    clamp,
    mapLinear
} from "three/src/math/MathUtils"
import cmToM from "./cmToM"
import fraction from "./fraction"
import trunc from "./trunc"
import cross from "./cross"
import dot from "./dot"
import length from "./length"
import distance3d from "./distance3d"
import normalize from "./normalize"
import reflect from "./reflect"
import project from "./project"
import angle from "./angle"
import rotate3d from "./rotate3d"
import rotateX from "./rotateX"
import rotateY from "./rotateY"
import rotateZ from "./rotateZ"
import rotateXY from "./rotateXY"
import rotateXZ from "./rotateXZ"
import rotateYZ from "./rotateYZ"
import multiply from "./multiply"
import multiplyScalar from "./multiplyScalar"
import quadrant from "./quadrant"
import average3d from "./average3d"
import polarTranslate from "./polarTranslate"
import distance from "./distance"
import vertexAngle from "./vertexAngle"
import rotate from "./rotate"

const math = {
    abs: Math.abs,
    log: Math.log,
    sqrt: Math.sqrt,
    min: Math.min,
    max: Math.max,
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
    radToDeg,
    degToRad,
    lerp,
    inverseLerp,
    smoothstep,
    smootherstep,
    randInt,
    randFloat,
    mapLinear,
    clamp,
    average,
    average3d,
    mToCm,
    cmToM,
    fraction,
    trunc,
    cross,
    dot,
    length,
    distance3d,
    distance,
    normalize,
    reflect,
    project,
    polarTranslate,
    angle,
    vertexAngle,
    rotate,
    rotate3d,
    rotateX,
    rotateY,
    rotateZ,
    rotateXY,
    rotateXZ,
    rotateYZ,
    multiply,
    multiplyScalar,
    quadrant
}

export default math
