import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IModel extends ILoaded {
    loadedScale: Nullable<number>
    loadedX: Nullable<number>
    loadedY: Nullable<number>
    loadedZ: Nullable<number>
}

export const modelSchema: Required<ExtractProps<IModel>> = {
    ...loadedSchema,
    loadedScale: Number,
    loadedX: Number,
    loadedY: Number,
    loadedZ: Number
}

export const modelDefaults: IModel = {
    ...loadedDefaults,
    loadedScale: undefined,
    loadedX: undefined,
    loadedY: undefined,
    loadedZ: undefined
}