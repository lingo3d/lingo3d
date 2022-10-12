import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISprite
    extends IVisibleObjectManager,
        ITexturedBasic {}

export const spriteSchema: Required<ExtractProps<ISprite>> = {
    ...visibleObjectManagerSchema,
    ...texturedBasicSchema
}

export const spriteDefaults: Defaults<ISprite> = {
    ...visibleObjectManagerDefaults,
    ...texturedBasicDefaults,
    scaleZ: 0,
    depth: 0
}
