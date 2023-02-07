import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"

export default interface ISprite
    extends IPhysicsObjectManager,
        ITexturedBasic {}

export const spriteSchema: Required<ExtractProps<ISprite>> = {
    ...physicsObjectManagerSchema,
    ...texturedBasicSchema
}

export const spriteDefaults = extendDefaults<ISprite>(
    [physicsObjectManagerDefaults, texturedBasicDefaults],
    { scaleZ: 0, depth: 0 }
)
