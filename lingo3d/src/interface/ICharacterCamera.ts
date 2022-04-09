import ICamera, { cameraDefaults, cameraSchema } from "./ICamera"
import IObjectManager from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export default interface ICharacterCamera extends ICamera {
    target?: IObjectManager
}

export const characterCameraSchema: Required<ExtractProps<ICharacterCamera>> = {
    ...cameraSchema,
    target: Object
}

export const characterCameraDefaults: ICharacterCamera = {
    ...cameraDefaults
}