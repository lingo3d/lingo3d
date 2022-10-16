import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IPrimitive
    extends IVisibleObjectManager,
        ITexturedBasic,
        ITexturedStandard {}

export const primitiveSchema: Required<ExtractProps<IPrimitive>> = {
    ...visibleObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const primitiveDefaults = extendDefaults<IPrimitive>(
    [
        visibleObjectManagerDefaults,
        texturedBasicDefaults,
        texturedStandardDefaults
    ],
    {}
)
