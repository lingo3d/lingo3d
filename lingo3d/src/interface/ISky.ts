import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface ISky extends IAppendable {}

export const skySchema: Required<ExtractProps<ISky>> = {
    ...appendableSchema
}

export const skyDefaults = extendDefaults<ISky>([appendableDefaults], {})
