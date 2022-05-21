import SimpleObjectManager from "../display/core/SimpleObjectManager"
import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"

export default interface ITrigger extends IPositioned {
    onEnter: ((target: SimpleObjectManager) => void) | undefined
    onExit: ((target: SimpleObjectManager) => void) | undefined
    targetIds?: string | Array<string>
    radius: number
    interval: number
    helper: boolean
}

export const triggerSchema: Required<ExtractProps<ITrigger>> = {
    ...positionedSchema,
    onEnter: Function,
    onExit: Function,
    targetIds: [String, Array],
    radius: Number,
    interval: Number,
    helper: Boolean
}

export const triggerDefaults: ITrigger ={
    ...positionedDefaults,
    onEnter: undefined,
    onExit: undefined,
    radius: 50,
    interval: 300,
    helper: true
}