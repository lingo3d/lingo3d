import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"

import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"

export default interface IPrimitive
    extends IPhysicsObjectManager,
        ITexturedStandard {}

export const primitiveSchema: Required<ExtractProps<IPrimitive>> = {
    ...physicsObjectManagerSchema,
    ...texturedStandardSchema
}

export const primitiveDefaults = extendDefaults<IPrimitive>(
    [physicsObjectManagerDefaults, texturedStandardDefaults],
    {}
)
