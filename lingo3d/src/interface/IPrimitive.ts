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
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPrimitive
    extends IVisibleObjectManager,
        ITexturedBasic,
        ITexturedStandard {}

export const primitiveSchema: Required<ExtractProps<IPrimitive>> = {
    ...visibleObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const primitiveDefaults: Defaults<IPrimitive> = {
    ...visibleObjectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}
