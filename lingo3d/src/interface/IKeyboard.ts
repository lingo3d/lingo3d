import IEventLoop, { eventLoopDefaults } from "./IEventLoop"

export default interface IKeyboard extends IEventLoop {
    onKeyPress?: (key: string) => void
    onKeyUp?: (key: string) => void
    onKeyDown?: (key: string) => void
}

export const keyboardDefaults: IKeyboard = {
    ...eventLoopDefaults
}