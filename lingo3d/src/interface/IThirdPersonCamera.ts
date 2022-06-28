import ICharacterCamera, { characterCameraDefaults, characterCameraSchema } from "./ICharacterCamera"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IThirdPersonCamera extends ICharacterCamera {}

export const thirdPersonCameraSchema: Required<ExtractProps<IThirdPersonCamera>> = {
    ...characterCameraSchema
}

export const thirdPersonCameraDefaults: Defaults<IThirdPersonCamera> = {
    ...characterCameraDefaults,
    innerZ: 300
}