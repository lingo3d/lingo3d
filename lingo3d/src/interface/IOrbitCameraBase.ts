import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import MeshAppendable from "../api/core/MeshAppendable"

export default interface IOrbitCameraBase extends ICameraBase {
    target: Nullable<string | MeshAppendable>
}

export const orbitCameraBaseSchema: Required<ExtractProps<IOrbitCameraBase>> = {
    ...cameraBaseSchema,
    target: [String, Object]
}

export const orbitCameraBaseDefaults = extendDefaults<IOrbitCameraBase>(
    [cameraBaseDefaults],
    { target: undefined }
)
