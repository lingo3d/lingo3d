import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "./ITexturedBasic"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IBasicMaterialManager
    extends IEventLoop,
        ITexturedBasic {}

export const basicMaterialManagerSchema: Required<
    ExtractProps<IBasicMaterialManager>
> = {
    ...eventLoopSchema,
    ...texturedBasicSchema
}

export const basicMaterialManagerDefaults =
    extendDefaults<IBasicMaterialManager>(
        [eventLoopDefaults, texturedBasicDefaults],
        {}
    )
