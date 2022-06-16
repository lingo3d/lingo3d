import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ILoaded extends IObjectManager {
    src: Nullable<string>
    onLoad: Nullable<() => void>
    boxVisible: boolean
}

export const loadedSchema: Required<ExtractProps<ILoaded>> = {
    ...objectManagerSchema,
    src: String,
    onLoad: Function,
    boxVisible: Boolean
}

export const loadedDefaults: Defaults<ILoaded> = {
    ...objectManagerDefaults,
    src: undefined,
    onLoad: undefined,
    boxVisible: false
}