import SimpleObjectManager from "../display/core/SimpleObjectManager"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export default interface ITrigger extends IEventLoop {
    onEnter: ((target: SimpleObjectManager) => void) | undefined
    onExit: ((target: SimpleObjectManager) => void) | undefined
    targetIds?: Array<string>
    radius: number
    interval: number
    helper: boolean
}

export const triggerSchema: Required<ExtractProps<ITrigger>> = {
    ...eventLoopSchema,
    onEnter: Function,
    onExit: Function,
    targetIds: Array,
    radius: Number,
    interval: Number,
    helper: Boolean
}

export const triggerDefaults: ITrigger ={
    ...eventLoopDefaults,
    onEnter: undefined,
    onExit: undefined,
    radius: 100,
    interval: 300,
    helper: true
}