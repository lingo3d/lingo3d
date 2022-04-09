import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ReflectorShape } from "./IReflector"
import { ExtractProps } from "./utils/extractProps"

export default interface IGroundReflector extends IObjectManager {
    shape?: ReflectorShape
}

export const groundReflectorSchema: Required<ExtractProps<IGroundReflector>> = {
    ...objectManagerSchema,
    shape: String
}

export const groundReflectorDefaults: IGroundReflector = {
    ...objectManagerDefaults
}