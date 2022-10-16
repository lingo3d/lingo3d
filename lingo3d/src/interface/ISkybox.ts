import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"

export default interface ISkybox extends IEventLoop {
    texture: Nullable<string | Array<string>>
}

export const skyboxSchema: Required<ExtractProps<ISkybox>> = {
    ...eventLoopSchema,
    texture: [String, Array]
}

export const skyboxDefaults = extendDefaults<ISkybox>([eventLoopDefaults], {
    texture: undefined
})
