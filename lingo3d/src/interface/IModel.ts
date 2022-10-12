import IAdjustMaterial, {
    adjustMaterialDefaults,
    adjustMaterialSchema
} from "./IAdjustMaterial"
import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IModel extends ILoaded, IAdjustMaterial {
    resize: boolean
}

export const modelSchema: Required<ExtractProps<IModel>> = {
    ...loadedSchema,
    ...adjustMaterialSchema,
    resize: Boolean
}

export const modelDefaults: Defaults<IModel> = {
    ...loadedDefaults,
    ...adjustMaterialDefaults,
    resize: true
}
