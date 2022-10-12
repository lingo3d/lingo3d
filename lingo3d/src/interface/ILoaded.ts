import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ILoaded extends IVisibleObjectManager {
    src: Nullable<string>
    onLoad: Nullable<() => void>
    boxVisible: boolean
}

export const loadedSchema: Required<ExtractProps<ILoaded>> = {
    ...visibleObjectManagerSchema,
    src: String,
    onLoad: Function,
    boxVisible: Boolean
}

export const loadedDefaults: Defaults<ILoaded> = {
    ...visibleObjectManagerDefaults,
    src: undefined,
    onLoad: undefined,
    boxVisible: false
}
