import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Range from "./utils/Range"

export default interface IText extends IAppendable {
    value: string
    opacity: number
}

export const textSchema: Required<ExtractProps<IText>> = {
    ...appendableSchema,
    value: String,
    opacity: Number
}

export const textDefaults = extendDefaults<IText>(
    [appendableDefaults],
    { value: "text", opacity: 1 },
    { opacity: new Range(0, 1) }
)
