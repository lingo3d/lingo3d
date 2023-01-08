import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import IVisible, { visibleDefaults, visibleSchema } from "./IVisible"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IFoundManager
    extends ISimpleObjectManager,
        ITexturedStandard,
        IVisible {}

export const foundManagerSchema: Required<ExtractProps<IFoundManager>> = {
    ...simpleObjectManagerSchema,
    ...texturedStandardSchema,
    ...visibleSchema
}

export const foundManagerDefaults = extendDefaults<IFoundManager>(
    [simpleObjectManagerDefaults, texturedStandardDefaults, visibleDefaults],
    {}
)
