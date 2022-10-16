import IBasicMaterialManager, {
    basicMaterialManagerDefaults,
    basicMaterialManagerSchema
} from "./IBasicMaterialManager"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IStandardMaterialManager
    extends IBasicMaterialManager,
        ITexturedStandard {}

export const standardMaterialManagerSchema: Required<
    ExtractProps<IStandardMaterialManager>
> = {
    ...basicMaterialManagerSchema,
    ...texturedStandardSchema
}

export const standardMaterialManagerDefaults =
    extendDefaults<IStandardMaterialManager>(
        [basicMaterialManagerDefaults, texturedStandardDefaults],
        {}
    )
