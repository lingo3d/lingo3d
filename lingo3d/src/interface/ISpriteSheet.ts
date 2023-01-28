import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"

export default interface ISpriteSheet extends IVisibleObjectManager {
    textureStart: Nullable<string>
    textureEnd: Nullable<string>
}

export const spriteSheetSchema: Required<ExtractProps<ISpriteSheet>> = {
    ...visibleObjectManagerSchema,
    textureStart: String,
    textureEnd: String
}

export const spriteSheetDefaults = extendDefaults<ISpriteSheet>(
    [visibleObjectManagerDefaults],
    { scaleZ: 0, depth: 0, textureStart: undefined, textureEnd: undefined }
)
