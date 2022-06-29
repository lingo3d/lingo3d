import { Point } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IReticle extends IEventLoop {
    onMove: Nullable<(e: Point) => void>
    onMoveStart: Nullable<(e: Point) => void>
    onMoveEnd: Nullable<(e: Point) => void>
}

export const reticleSchema: Required<ExtractProps<IReticle>> = {
    ...eventLoopSchema,
    onMove: Function,
    onMoveStart: Function,
    onMoveEnd: Function,
}

export const reticleDefaults: Defaults<IReticle> = {
    ...eventLoopDefaults,
    onMove: undefined,
    onMoveStart: undefined,
    onMoveEnd: undefined,
}