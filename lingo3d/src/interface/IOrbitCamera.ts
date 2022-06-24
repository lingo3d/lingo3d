import ICameraBase, { cameraBaseDefaults, cameraBaseSchema } from "./ICameraBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IOrbitCamera extends ICameraBase {
    targetId: Nullable<string>

    enableDamping: boolean
    enableZoom: boolean
    autoRotate: boolean | number
}

export const orbitCameraSchema: Required<ExtractProps<IOrbitCamera>> = {
    ...cameraBaseSchema,

    targetId: String,

    enableDamping: Boolean,
    enableZoom: Boolean,
    autoRotate: [Boolean, Number]
}

export const orbitCameraDefaults: Defaults<IOrbitCamera> = {
    ...cameraBaseDefaults,

    innerZ: 500,
    mouseControl: "drag",

    targetId: undefined,
    
    enableDamping: false,
    enableZoom: false,
    autoRotate: false
}