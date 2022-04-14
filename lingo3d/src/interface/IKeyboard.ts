import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export default interface IKeyboard extends IEventLoop {
    onKeyPress?: (key: string, keys: Set<string>) => void
    onKeyUp?: (key: string, keys: Set<string>) => void
    onKeyDown?: (key: string, keys: Set<string>) => void
}

export const keyboardSchema: Required<ExtractProps<IKeyboard>> = {
    ...eventLoopSchema,
    onKeyPress: Function,
    onKeyUp: Function,
    onKeyDown: Function
}

export const keyboardDefaults: IKeyboard ={
    ...eventLoopDefaults
}