import ICamera, { cameraDefaults, cameraSchema } from "./ICamera"
import ISimpleObjectManager from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"

export default interface ICharacterCamera extends ICamera {
    target?: ISimpleObjectManager
    lockTargetRotation: boolean
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...cameraSchema,
    target: Object,
    lockTargetRotation: Boolean
}

export const characterCameraDefaults: ICharacterCamera = {
    ...cameraDefaults,
    lockTargetRotation: true
}