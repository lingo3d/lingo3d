import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IAimationManager extends IEventLoop {
    paused: boolean
}

export const animationSchema: Required<ExtractProps<IAimationManager>> = {
    ...eventLoopSchema,
    paused: Boolean
}

export const animationDefaults = extendDefaults<IAimationManager>(
    [eventLoopDefaults],
    { paused: true }
)
