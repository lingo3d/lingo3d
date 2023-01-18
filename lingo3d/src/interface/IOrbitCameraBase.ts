import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IOrbitCameraBase extends ICameraBase {}

export const orbitCameraBaseSchema: Required<ExtractProps<IOrbitCameraBase>> = {
    ...cameraBaseSchema
}

export const orbitCameraBaseDefaults = extendDefaults<IOrbitCameraBase>(
    [cameraBaseDefaults],
    {}
)
