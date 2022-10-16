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

export default interface IFoundManager
    extends ISimpleObjectManager,
        ITexturedBasic,
        ITexturedStandard,
        IVisible {}

export const foundManagerSchema: Required<ExtractProps<IFoundManager>> = {
    ...simpleObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema,
    ...visibleSchema
}

export const foundManagerDefaults = extendDefaults<IFoundManager>(
    [
        simpleObjectManagerDefaults,
        texturedBasicDefaults,
        texturedStandardDefaults,
        visibleDefaults
    ],
    {}
)
