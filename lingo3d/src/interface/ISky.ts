import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISky extends IEventLoop {}

export const skySchema: Required<ExtractProps<ISky>> = {
    ...eventLoopSchema
}

export const skyDefaults = extendDefaults<ISky>([eventLoopDefaults])
