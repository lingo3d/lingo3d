import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import { ExtractProps } from "./utils/extractProps"

export default interface IModel extends ILoaded {
    loadedScale?: number
    loadedX?: number
    loadedY?: number
    loadedZ?: number
}

export const modelSchema: Required<ExtractProps<IModel>> = {
    ...loadedSchema,
    loadedScale: Number,
    loadedX: Number,
    loadedY: Number,
    loadedZ: Number
}

export const modelDefaults: IModel = {
    ...loadedDefaults
}