import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export type PositionedValue = Record<string, Array<number>>
export type Positioned = string | number | Array<string | number> | boolean | PositionedValue

export default interface IPositioned extends IEventLoop {
    x: number
    y: number
    z: number
}

export const positionedSchema: Required<ExtractProps<IPositioned>> = {
    ...eventLoopSchema,
    x: Number,
    y: Number,
    z: Number
}

export const positionedDefaults: IPositioned = {
    ...eventLoopDefaults,
    x: 0,
    y: 0,
    z: 0
}