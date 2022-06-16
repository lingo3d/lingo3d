import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IEnvironment extends IEventLoop {
    texture: Nullable<string>
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...eventLoopSchema,
    texture: String
}

export const environmentDefaults: Defaults<IEnvironment> = {
    ...eventLoopDefaults,
    texture: undefined
}