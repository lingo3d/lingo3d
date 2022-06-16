import MeshItem from "../display/core/MeshItem"
import ICamera, { cameraDefaults, cameraSchema } from "./ICamera"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export type LockTargetRotationValue = boolean | "follow"

export default interface ICharacterCamera extends ICamera {
    target: Nullable<MeshItem>
    lockTargetRotation: LockTargetRotationValue
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...cameraSchema,
    target: Object,
    lockTargetRotation: [Boolean, String]
}

export const characterCameraDefaults: ICharacterCamera = {
    ...cameraDefaults,
    lockTargetRotation: true,
    target: undefined
}