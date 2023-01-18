import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"

export default interface IOrbitCamera extends ICameraBase {
    enableZoom: boolean
    enableFly: boolean
    autoRotate: boolean | number
}

export const orbitCameraSchema: Required<ExtractProps<IOrbitCamera>> = {
    ...cameraBaseSchema,

    enableZoom: Boolean,
    enableFly: Boolean,
    autoRotate: [Boolean, Number]
}

export const orbitCameraDefaults = extendDefaults<IOrbitCamera>(
    [cameraBaseDefaults],
    {
        innerZ: 500,
        mouseControl: "drag",

        enableZoom: false,
        enableFly: false,
        autoRotate: false
    }
)
