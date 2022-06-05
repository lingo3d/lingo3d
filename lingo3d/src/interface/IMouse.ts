import { Point3d } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export class MouseEventPayload {
    public constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public clientX: number = 0,
        public clientY: number = 0,
        public xNorm: number = 0,
        public yNorm: number = 0
    ) {}
}

export class LingoMouseEvent extends MouseEventPayload {
    public constructor(
        x: number = 0,
        y: number = 0,
        z: number = 0,
        clientX: number = 0,
        clientY: number = 0,
        xNorm: number = 0,
        yNorm: number = 0,
        public point: Point3d,
        public distance: number
    ) {
        super(x, y, z, clientX, clientY, xNorm, yNorm)
    }
}

export default interface IMouse extends IEventLoop {
    onClick?: (e: LingoMouseEvent) => void
    onMouseMove?: (e: LingoMouseEvent) => void
    onMouseDown?: (e: LingoMouseEvent) => void
    onMouseUp?: (e: LingoMouseEvent) => void
    onMousePress?: (e: LingoMouseEvent) => void
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
    ...eventLoopDefaults
}