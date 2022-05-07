import Point3d from "../api/Point3d"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { ExtractProps } from "./utils/extractProps"

export type MouseEventPayload = { x: number, y: number, z: number, clientX: number, clientY: number, xNorm: number, yNorm: number }

export type MouseInteractionPayload = MouseEventPayload & { point: Point3d, distance: number }

export default interface IMouse extends IEventLoop {
    onClick?: (e: MouseEventPayload) => void
    onMouseMove?: (e: MouseEventPayload) => void
    onMouseDown?: (e: MouseEventPayload) => void
    onMouseUp?: (e: MouseEventPayload) => void
    onMousePress?: (e: MouseEventPayload) => void
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