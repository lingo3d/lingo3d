import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ISkybox extends IEventLoop {
    texture: Nullable<string | Array<string>>
}

export const skyboxSchema: Required<ExtractProps<ISkybox>> = {
    ...eventLoopSchema,
    texture: [String, Array]
}

export const skyboxDefaults: Defaults<ISkybox> = {
    ...eventLoopDefaults,
    texture: undefined
}