import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { MouseInteractionPayload } from "./IMouse"
import IPhysics from "./IPhysics"

export default interface ISimpleObjectManager extends IPhysics {
    onClick?: (e: MouseInteractionPayload) => void
    onMouseDown?: (e: MouseInteractionPayload) => void
    onMouseUp?: (e: MouseInteractionPayload) => void
    onMouseOver?: (e: MouseInteractionPayload) => void
    onMouseOut?: (e: MouseInteractionPayload) => void
    onMouseMove?: (e: MouseInteractionPayload) => void
    onIntersect?: (target: SimpleObjectManager) => void

    name: string
    id?: string
    intersectIDs?: Array<string>

    width: number
    height: number
    depth: number

    x: number
    y: number
    z: number

    scaleX: number
    scaleY: number
    scaleZ: number
    scale: number

    rotationX: number
    rotationY: number
    rotationZ: number
    rotation: number

    bloom: boolean
    reflection: boolean
    visible: boolean
}