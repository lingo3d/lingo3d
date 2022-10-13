import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import IVisible, { visibleDefaults, visibleSchema } from "./IVisible"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IFound
    extends ISimpleObjectManager,
        ITexturedBasic,
        ITexturedStandard,
        IVisible {}

export const foundSchema: Required<ExtractProps<IFound>> = {
    ...simpleObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema,
    ...visibleSchema
}

export const foundDefaults = extendDefaults<IFound>([
    simpleObjectManagerDefaults,
    texturedBasicDefaults,
    texturedStandardDefaults,
    visibleDefaults
])
