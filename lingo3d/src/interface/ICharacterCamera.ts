import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type LockTargetRotationValue =
    | boolean
    | "lock"
    | "follow"
    | "dynamic-lock"
    | "dynamic-follow"

export default interface ICharacterCamera extends ICameraBase {
    lockTargetRotation: LockTargetRotationValue
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...cameraBaseSchema,
    lockTargetRotation: [Boolean, String]
}

export const characterCameraDefaults = extendDefaults<ICharacterCamera>(
    [cameraBaseDefaults],
    { lockTargetRotation: true }
)
