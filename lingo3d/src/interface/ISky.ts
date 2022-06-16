import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISky extends IEventLoop {}

export const skySchema: Required<ExtractProps<ISky>> = {
    ...eventLoopSchema
}

export const skyDefaults: Defaults<ISky> = {
    ...eventLoopDefaults
}