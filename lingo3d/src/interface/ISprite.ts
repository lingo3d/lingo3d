import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"

export default interface ISprite
    extends IVisibleObjectManager,
        ITexturedStandard {}

export const spriteSchema: Required<ExtractProps<ISprite>> = {
    ...visibleObjectManagerSchema,
    ...texturedStandardSchema
}

export const spriteDefaults = extendDefaults<ISprite>(
    [visibleObjectManagerDefaults, texturedStandardDefaults],
    { scaleZ: 0, depth: 0 }
)
