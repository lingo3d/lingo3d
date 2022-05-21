import ICameraMixin, { cameraMixinDefaults, cameraMixinSchema } from "./ICameraMixin"
import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"

export default interface IOrbitCamera extends IPositioned, ICameraMixin {
    targetX: number
    targetY: number
    targetZ: number

    enableDamping: boolean
    enablePan: boolean
    enableZoom: boolean
    autoRotate: boolean
    autoRotateSpeed: number

    minAzimuthAngle: number
    maxAzimuthAngle: number

    azimuthAngle: number
    polarAngle: number
}

export const orbitCameraSchema: Required<ExtractProps<IOrbitCamera>> = {
    ...positionedSchema,
    ...cameraMixinSchema,

    targetX: Number,
    targetY: Number,
    targetZ: Number,

    enableDamping: Boolean,
    enablePan: Boolean,
    enableZoom: Boolean,
    autoRotate: Boolean,
    autoRotateSpeed: Number,

    minAzimuthAngle: Number,
    maxAzimuthAngle: Number,

    azimuthAngle: Number,
    polarAngle: Number
}

export const orbitCameraDefaults: IOrbitCamera = {
    ...positionedDefaults,
    ...cameraMixinDefaults,

    targetX: 0,
    targetY: 0,
    targetZ: 0,
    
    z: 500,

    enableDamping: false,
    enablePan: false,
    enableZoom: false,
    autoRotate: false,
    autoRotateSpeed: 2,

    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,

    azimuthAngle: 0,
    polarAngle: 0
}