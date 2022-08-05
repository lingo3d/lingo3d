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
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IFound
    extends IAnimatedObjectManager,
        ITexturedBasic,
        ITexturedStandard {}

export const foundSchema: Required<ExtractProps<IFound>> = {
    ...animatedObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const foundDefaults: Defaults<IFound> = {
    ...animatedObjectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}
