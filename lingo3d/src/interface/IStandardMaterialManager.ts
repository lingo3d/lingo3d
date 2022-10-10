import IBasicMaterialManager, {
    basicMaterialManagerDefaults,
    basicMaterialManagerSchema
} from "./IBasicMaterialManager"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IStandardMaterialManager
    extends IBasicMaterialManager,
        ITexturedStandard {}

export const standardMaterialManagerSchema: Required<
    ExtractProps<IStandardMaterialManager>
> = {
    ...basicMaterialManagerSchema,
    ...texturedStandardSchema
}

export const standardMaterialManagerDefaults: Defaults<IStandardMaterialManager> =
    {
        ...basicMaterialManagerDefaults,
        ...texturedStandardDefaults
    }
