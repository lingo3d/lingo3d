import ICamera from "./ICamera"
import IObjectManager from "./IObjectManager"

export default interface ICharacterCamera extends ICamera {
    target?: IObjectManager
}