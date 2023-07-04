import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export class LingoKeyboardEvent {
    public constructor(public key: string, public keys: Set<string>) {}
}

export default interface IKeyboard extends IAppendable {
    onKeyPress: Nullable<(e: LingoKeyboardEvent) => void>
    onKeyUp: Nullable<(e: LingoKeyboardEvent) => void>
    onKeyDown: Nullable<(e: LingoKeyboardEvent) => void>
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
