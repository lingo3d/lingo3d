import IOrbitCameraBase, {
    orbitCameraBaseDefaults,
    orbitCameraBaseSchema
} from "./IOrbitCameraBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type LockTargetRotationValue =
    | boolean
    | "lock"
    | "follow"
    | "dynamic-lock"
    | "dynamic-follow"

export default interface ICharacterCamera extends IOrbitCameraBase {
    lockTargetRotation: LockTargetRotationValue
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...orbitCameraBaseSchema,
    lockTargetRotation: [Boolean, String]
}

export const characterCameraDefaults = extendDefaults<ICharacterCamera>(
    [orbitCameraBaseDefaults],
    { lockTargetRotation: true }
)
