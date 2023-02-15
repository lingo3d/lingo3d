import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"

export class LingoKeyboardEvent {
    public constructor(public key: string, public keys: Set<string>) {}
}
const lingoKeyboardEvent = new LingoKeyboardEvent("", new Set())

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
        onKeyPress: nullableCallback(lingoKeyboardEvent),
        onKeyUp: nullableCallback(lingoKeyboardEvent),
        onKeyDown: nullableCallback(lingoKeyboardEvent)
    }
)
