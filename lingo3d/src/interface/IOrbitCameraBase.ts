import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import MeshManager from "../display/core/MeshManager"

export default interface IOrbitCameraBase extends ICameraBase {
    target: Nullable<string | MeshManager>
}

export const orbitCameraBaseSchema: Required<ExtractProps<IOrbitCameraBase>> = {
    ...cameraBaseSchema,
    target: [String, Object]
}

export const orbitCameraBaseDefaults = extendDefaults<IOrbitCameraBase>(
    [cameraBaseDefaults],
    { target: undefined }
)
