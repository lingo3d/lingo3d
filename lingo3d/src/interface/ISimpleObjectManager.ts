import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { MouseInteractionPayload } from "./IMouse"
import IPhysics, { physicsDefaults, physicsSchema } from "./IPhysics"
import { ExtractProps } from "./utils/extractProps"

export type OnIntersectValue = (target: SimpleObjectManager) => void

export default interface ISimpleObjectManager extends IPhysics {
    onClick?: (e: MouseInteractionPayload) => void
    onMouseDown?: (e: MouseInteractionPayload) => void
    onMouseUp?: (e: MouseInteractionPayload) => void
    onMouseOver?: (e: MouseInteractionPayload) => void
    onMouseOut?: (e: MouseInteractionPayload) => void
    onMouseMove?: (e: MouseInteractionPayload) => void
    onIntersect?: OnIntersectValue
    onIntersectOut?: OnIntersectValue

    name: string
    id?: string
    intersectIds?: Array<string>

    width: number
    height: number
    depth: number

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
    outline: boolean

    visible: boolean
    innerVisible: boolean
    frustumCulled: boolean

    metalnessFactor: number
    roughnessFactor: number
    environmentFactor: number

    toon: boolean
    pbr: boolean
}

export const simpleObjectManagerSchema: Required<ExtractProps<ISimpleObjectManager>> = {
    ...physicsSchema,

    onClick: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseOver: Function,
    onMouseOut: Function,
    onMouseMove: Function,
    onIntersect: Function,
    onIntersectOut: Function,

    name: String,
    id: String,
    intersectIds: Array,

    width: Number,
    height: Number,
    depth: Number,

    scaleX: Number,
    scaleY: Number,
    scaleZ: Number,
    scale: Number,

    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,
    rotation: Number,

    bloom: Boolean,
    reflection: Boolean,
    outline: Boolean,

    visible: Boolean,
    innerVisible: Boolean,
    frustumCulled: Boolean,

    metalnessFactor: Number,
    roughnessFactor: Number,
    environmentFactor: Number,

    toon: Boolean,
    pbr: Boolean
}

export const simpleObjectManagerDefaults: ISimpleObjectManager = {
    ...physicsDefaults,

    name: "",

    width: 100,
    height: 100,
    depth: 100,

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
    outline: false,

    visible: true,
    innerVisible: true,
    frustumCulled: true,

    metalnessFactor: 0,
    roughnessFactor: 1,
    environmentFactor: 1,

    toon: false,
    pbr: false
}