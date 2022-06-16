import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
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

export const keyboardDefaults: Defaults<IKeyboard> ={
    ...eventLoopDefaults,
    onKeyPress: undefined,
    onKeyUp: undefined,
    onKeyDown: undefined
}