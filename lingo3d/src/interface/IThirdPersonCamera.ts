import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema
} from "./ICharacterCamera"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IThirdPersonCamera extends ICharacterCamera {}

export const thirdPersonCameraSchema: Required<
    ExtractProps<IThirdPersonCamera>
> = {
    ...characterCameraSchema
}

export const thirdPersonCameraDefaults = extendDefaults<IThirdPersonCamera>(
    [characterCameraDefaults],
    { innerZ: 300 }
)
