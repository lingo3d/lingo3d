import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISprite
    extends IVisibleObjectManager,
        ITexturedBasic {}

export const spriteSchema: Required<ExtractProps<ISprite>> = {
    ...visibleObjectManagerSchema,
    ...texturedBasicSchema
}

export const spriteDefaults = extendDefaults<ISprite>(
    [visibleObjectManagerDefaults, texturedBasicDefaults],
    { scaleZ: 0, depth: 0 }
)
