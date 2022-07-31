import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IModel extends ILoaded {
    resize: boolean
}

export const modelSchema: Required<ExtractProps<IModel>> = {
    ...loadedSchema,
    resize: Boolean
}

export const modelDefaults: Defaults<IModel> = {
    ...loadedDefaults,
    resize: true
}
