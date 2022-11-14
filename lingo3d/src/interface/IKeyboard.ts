import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IKeyboard extends IAppendable {
    onKeyPress: Nullable<(key: string, keys: Set<string>) => void>
    onKeyUp: Nullable<(key: string, keys: Set<string>) => void>
    onKeyDown: Nullable<(key: string, keys: Set<string>) => void>
}

export const keyboardSchema: Required<ExtractProps<IKeyboard>> = {
    ...appendableSchema,
    onKeyPress: Function,
    onKeyUp: Function,
    onKeyDown: Function
}

export const keyboardDefaults = extendDefaults<IKeyboard>(
    [appendableDefaults],
    {
        onKeyPress: undefined,
        onKeyUp: undefined,
        onKeyDown: undefined
    }
)
