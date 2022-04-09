import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export default interface IKeyboard extends IEventLoop {
    onKeyPress?: (key: string) => void
    onKeyUp?: (key: string) => void
    onKeyDown?: (key: string) => void
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