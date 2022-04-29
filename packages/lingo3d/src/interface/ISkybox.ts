import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export default interface ISkybox extends IEventLoop {
    texture?: string | Array<string>
}

export const skyboxSchema: Required<ExtractProps<ISkybox>> = {
    ...eventLoopSchema,
    texture: [String, Array]
}

export const skyboxDefaults: ISkybox = {
    ...eventLoopDefaults
}