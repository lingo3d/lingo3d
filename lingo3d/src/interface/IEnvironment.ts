import IEventLoop, { eventLoopDefaults, eventLoopRequiredDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IEnvironment extends IEventLoop {
    texture: Nullable<string>
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...eventLoopSchema,
    texture: String
}

export const environmentDefaults: IEnvironment = {
    ...eventLoopDefaults,
    texture: undefined
}

export const environmentRequiredDefaults: IEnvironment = {
    ...eventLoopRequiredDefaults,
    texture: ""
}