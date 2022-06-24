import ICamera, { cameraDefaults, cameraSchema } from "./ICamera"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IOrbitCamera extends ICamera {
    targetId: Nullable<string>
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
    ...cameraSchema,

    targetId: String,
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

export const orbitCameraDefaults: Defaults<IOrbitCamera> = {
    ...cameraDefaults,

    innerZ: 500,
    mouseControl: "drag",

    targetId: undefined,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    
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