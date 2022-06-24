import ICamera, { cameraDefaults, cameraSchema } from "./ICamera"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export type LockTargetRotationValue = boolean | "lock" | "follow" | "dynamic-lock" | "dynamic-follow"

export default interface ICharacterCamera extends ICamera {
    lockTargetRotation: LockTargetRotationValue
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...cameraSchema,
    lockTargetRotation: [Boolean, String]
}

hideSchema(["target"])

export const characterCameraDefaults: Defaults<ICharacterCamera> = {
    ...cameraDefaults,
    lockTargetRotation: true
}