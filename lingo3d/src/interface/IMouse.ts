import Point3d from "../api/Point3d"
import IEventLoop from "./IEventLoop"

export type MouseEventPayload = { x: number, y: number, clientX: number, clientY: number, xNorm: number, yNorm: number }

export type MouseInteractionPayload = MouseEventPayload & { point: Point3d, distance: number }

export default interface IMouse extends IEventLoop {
    onClick?: (e: MouseEventPayload) => void
    onMouseMove?: (e: MouseEventPayload) => void
    onMouseDown?: (e: MouseEventPayload) => void
    onMouseUp?: (e: MouseEventPayload) => void
    onMousePress?: (e: MouseEventPayload) => void
}