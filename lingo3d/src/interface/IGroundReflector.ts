import IObjectManager, { objectManagerDefaults } from "./IObjectManager"
import { ReflectorShape } from "./IReflector"

export default interface IGroundReflector extends IObjectManager {
    shape?: ReflectorShape
}

export const groundReflectorDefaults: IGroundReflector = {
    ...objectManagerDefaults
}