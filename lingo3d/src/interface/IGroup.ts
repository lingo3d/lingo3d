import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IGroup extends IObjectManager {}

export const groupSchema: Required<ExtractProps<IGroup>> = {
    ...objectManagerSchema
}

export const groupDefaults: Defaults<IGroup> = {
    ...objectManagerDefaults
}