import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export default interface IEnvironment extends IEventLoop {
    texture?: string
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...eventLoopSchema,
    texture: String
}

export const environmentDefaults: IEnvironment = {
    ...eventLoopDefaults
}