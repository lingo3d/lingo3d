import { Point3d } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopRequiredDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import Nullable from "./utils/Nullable"

export class MouseEventPayload {
    public constructor(
        public clientX = 0,
        public clientY = 0,
        public x = 0,
        public y = 0,
        public z = 0,
        public xNorm = 0,
        public yNorm = 0
    ) {}
}

export class LingoMouseEvent extends MouseEventPayload {
    public constructor(
        clientX: number,
        clientY: number,
        x: number,
        y: number,
        z: number,
        xNorm: number,
        yNorm: number,
        public point: Point3d,
        public distance: number
    ) {
        super(x, y, z, clientX, clientY, xNorm, yNorm)
    }
}

export default interface IMouse extends IEventLoop {
    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMousePress: Nullable<(e: LingoMouseEvent) => void>
}

export const mouseSchema: Required<ExtractProps<IMouse>> = {
    ...eventLoopSchema,
    onClick: Function,
    onMouseMove: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMousePress: Function
}

export const mouseDefaults: IMouse = {
    ...eventLoopDefaults,
    onClick: undefined,
    onMouseMove: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onMousePress: undefined
}

export const mouseRequiredDefaults: IMouse = {
    ...eventLoopRequiredDefaults,
    onClick: fn,
    onMouseMove: fn,
    onMouseDown: fn,
    onMouseUp: fn,
    onMousePress: fn
}