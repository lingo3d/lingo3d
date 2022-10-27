import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IOrbitCameraBase, {
    orbitCameraBaseDefaults,
    orbitCameraBaseSchema
} from "./IOrbitCameraBase"

export default interface IOrbitCamera extends IOrbitCameraBase {
    enableZoom: boolean
    enableFly: boolean
    autoRotate: boolean | number
}

export const orbitCameraSchema: Required<ExtractProps<IOrbitCamera>> = {
    ...orbitCameraBaseSchema,

    enableZoom: Boolean,
    enableFly: Boolean,
    autoRotate: [Boolean, Number]
}

export const orbitCameraDefaults = extendDefaults<IOrbitCamera>(
    [orbitCameraBaseDefaults],
    {
        innerZ: 500,
        mouseControl: "drag",

        enableZoom: false,
        enableFly: false,
        autoRotate: false
    }
)
