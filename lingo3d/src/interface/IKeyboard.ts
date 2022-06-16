import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import Nullable from "./utils/Nullable"

export default interface IKeyboard extends IEventLoop {
    onKeyPress: Nullable<(key: string, keys: Set<string>) => void>
    onKeyUp: Nullable<(key: string, keys: Set<string>) => void>
    onKeyDown: Nullable<(key: string, keys: Set<string>) => void>
}

export const keyboardSchema: Required<ExtractProps<IKeyboard>> = {
    ...eventLoopSchema,
    onKeyPress: Function,
    onKeyUp: Function,
    onKeyDown: Function
}

export const keyboardDefaults: IKeyboard ={
    ...eventLoopDefaults,
    onKeyPress: undefined,
    onKeyUp: undefined,
    onKeyDown: undefined
}

export const keyboardRequiredDefaults: IKeyboard ={
    ...keyboardDefaults,
    onKeyPress: fn,
    onKeyUp: fn,
    onKeyDown: fn
}