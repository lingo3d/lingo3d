import ICamera, { cameraDefaults } from "./ICamera"
import IObjectManager from "./IObjectManager"

export default interface ICharacterCamera extends ICamera {
    target?: IObjectManager
}

export const characterCameraDefaults: ICharacterCamera = {
    ...cameraDefaults
}