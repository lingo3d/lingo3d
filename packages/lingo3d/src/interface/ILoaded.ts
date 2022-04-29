import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export default interface ILoaded extends IObjectManager {
    src?: string
    onLoad?: () => void
    boxVisible: boolean
}

export const loadedSchema: Required<ExtractProps<ILoaded>> = {
    ...objectManagerSchema,
    src: String,
    onLoad: Function,
    boxVisible: Boolean
}

export const loadedDefaults: ILoaded = {
    ...objectManagerDefaults,
    boxVisible: false
}