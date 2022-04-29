import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export default interface IGroup extends IObjectManager {}

export const groupSchema: Required<ExtractProps<IGroup>> = {
    ...objectManagerSchema
}

export const groupDefaults: IGroup = {
    ...objectManagerDefaults
}