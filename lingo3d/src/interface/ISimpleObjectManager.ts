import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { MouseInteractionPayload } from "./IMouse"
import IPhysics, { physicsDefaults } from "./IPhysics"

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
    innerVisible: boolean
    frustumCulled: boolean

    metalnessFactor: number
    roughnessFactor: number
    toon: boolean
}

export const simpleObjectManagerDefaults: ISimpleObjectManager = {
    ...physicsDefaults,

    name: "",

    width: 100,
    height: 100,
    depth: 100,

    x: 0,
    y: 0,
    z: 0,

    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    scale: 1,

    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    rotation: 0,

    bloom: false,
    reflection: false,
    visible: true,
    innerVisible: true,
    frustumCulled: true,

    metalnessFactor: 1,
    roughnessFactor: 1,
    toon: false
}