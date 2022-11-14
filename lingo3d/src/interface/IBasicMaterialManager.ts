import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IBasicMaterialManager
    extends IAppendable,
        ITexturedBasic {}

export const basicMaterialManagerSchema: Required<
    ExtractProps<IBasicMaterialManager>
> = {
    ...appendableSchema,
    ...texturedBasicSchema
}

export const basicMaterialManagerDefaults =
    extendDefaults<IBasicMaterialManager>(
        [appendableDefaults, texturedBasicDefaults],
        {}
    )
