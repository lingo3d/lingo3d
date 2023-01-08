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
        ITexturedStandard {}

export const primitiveSchema: Required<ExtractProps<IPrimitive>> = {
    ...visibleObjectManagerSchema,
    ...texturedStandardSchema
}

export const primitiveDefaults = extendDefaults<IPrimitive>(
    [visibleObjectManagerDefaults, texturedStandardDefaults],
    {}
)
