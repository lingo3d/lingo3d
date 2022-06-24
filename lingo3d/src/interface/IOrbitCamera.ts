import ICameraBase, { cameraBaseDefaults, cameraBaseSchema } from "./ICameraBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IOrbitCamera extends ICameraBase {
    targetId: Nullable<string>

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
    ...cameraBaseSchema,

    targetId: String,

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
    ...cameraBaseDefaults,

    innerZ: 500,
    mouseControl: "drag",

    targetId: undefined,
    
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