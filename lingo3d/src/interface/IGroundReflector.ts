import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export default interface IGroundReflector extends IObjectManager {
}

export const groundReflectorSchema: Required<ExtractProps<IGroundReflector>> = {
    ...objectManagerSchema
}

export const groundReflectorDefaults: IGroundReflector = {
    ...objectManagerDefaults
}