import { Point3d } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
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

export type SimpleMouseEvent = {
    clientX: number
    clientY: number
}

export default interface IMouse extends IEventLoop {
    onClick: Nullable<(e: SimpleMouseEvent) => void>
    onRightClick: Nullable<(e: SimpleMouseEvent) => void>
    onMouseMove: Nullable<(e: SimpleMouseEvent) => void>
    onMouseDown: Nullable<(e: SimpleMouseEvent) => void>
    onMouseUp: Nullable<(e: SimpleMouseEvent) => void>
    onMousePress: Nullable<(e: SimpleMouseEvent) => void>
}

export const mouseSchema: Required<ExtractProps<IMouse>> = {
    ...eventLoopSchema,
    onClick: Function,
    onRightClick: Function,
    onMouseMove: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMousePress: Function
}

export const mouseDefaults: Defaults<IMouse> = {
    ...eventLoopDefaults,
    onClick: undefined,
    onRightClick: undefined,
    onMouseMove: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onMousePress: undefined
}