import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IReticle extends IEventLoop {
    variant: 1 | 2 | 3 | 4
}

export const reticleSchema: Required<ExtractProps<IReticle>> = {
    ...eventLoopSchema,
    variant: Number
}

export const reticleDefaults = extendDefaults<IReticle>([eventLoopDefaults], {
    variant: 1
})
