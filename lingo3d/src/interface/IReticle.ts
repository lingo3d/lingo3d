import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IReticle extends IEventLoop {
    variant: 1 | 2 | 3 | 4
}

export const reticleSchema: Required<ExtractProps<IReticle>> = {
    ...eventLoopSchema,
    variant: Number
}

export const reticleDefaults: Defaults<IReticle> = {
    ...eventLoopDefaults,
    variant: 1
}