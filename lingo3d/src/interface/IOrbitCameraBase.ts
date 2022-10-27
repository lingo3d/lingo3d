import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import MeshItem from "../display/core/MeshItem"

export default interface IOrbitCameraBase extends ICameraBase {
    target: Nullable<string | MeshItem>
}

export const orbitCameraBaseSchema: Required<ExtractProps<IOrbitCameraBase>> = {
    ...cameraBaseSchema,
    target: [String, Object]
}

export const orbitCameraBaseDefaults = extendDefaults<IOrbitCameraBase>(
    [cameraBaseDefaults],
    { target: undefined }
)
