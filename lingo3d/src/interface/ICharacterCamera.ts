import ICamera, { cameraDefaults, cameraSchema } from "./ICamera"
import IPositioned from "./IPositioned"
import ISimpleObjectManager from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"

export type LockTargetRotationValue = boolean | "follow"

export default interface ICharacterCamera extends ICamera {
    target?: ISimpleObjectManager | IPositioned
    lockTargetRotation: LockTargetRotationValue
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...cameraSchema,
    target: Object,
    lockTargetRotation: [Boolean, String]
}

export const characterCameraDefaults: ICharacterCamera = {
    ...cameraDefaults,
    lockTargetRotation: true
}