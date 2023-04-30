import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import Range from "./utils/Range"

export default interface IOrbitCamera extends ICameraBase {
    enableZoom: boolean
    enableFly: boolean
    autoRotate: boolean
    autoRotateSpeed: number
}

export const orbitCameraSchema: Required<ExtractProps<IOrbitCamera>> = {
    ...cameraBaseSchema,
    enableZoom: Boolean,
    enableFly: Boolean,
    autoRotate: Boolean,
    autoRotateSpeed: Number
}

export const orbitCameraDefaults = extendDefaults<IOrbitCamera>(
    [cameraBaseDefaults],
    {
        innerZ: 500,
        mouseControl: "drag",

        enableZoom: false,
        enableFly: false,
        autoRotate: false,
        autoRotateSpeed: 2
    },
    { autoRotateSpeed: new Range(1, 10) }
)
