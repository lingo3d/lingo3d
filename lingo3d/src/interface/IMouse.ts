import { Point3d } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export type LingoMouseEvent = { x: number, y: number, z: number, clientX: number, clientY: number, xNorm: number, yNorm: number }

export type MouseInteractionPayload = LingoMouseEvent & { point: Point3d, distance: number }

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