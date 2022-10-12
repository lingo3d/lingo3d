import IAnimatedObjectManager, {
    animatedObjectManagerDefaults,
    animatedObjectManagerSchema
} from "./IAnimatedObjectManager"
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
    extends IAnimatedObjectManager,
        ITexturedBasic,
        ITexturedStandard,
        IVisible {}

export const foundSchema: Required<ExtractProps<IFound>> = {
    ...animatedObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema,
    ...visibleSchema
}

export const foundDefaults = extendDefaults<IFound>([
    animatedObjectManagerDefaults,
    texturedBasicDefaults,
    texturedStandardDefaults,
    visibleDefaults
])
