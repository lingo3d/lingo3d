import StaticObjectManager from "../display/core/StaticObjectManager"
import IAnimatedObjectManager, {
    animatedObjectManagerDefaults,
    animatedObjectManagerSchema
} from "./IAnimatedObjectManager"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export type OnIntersectValue = (target: StaticObjectManager) => void

export default interface ISimpleObjectManager
    extends IAnimatedObjectManager,
        IPositioned {
    onIntersect: Nullable<OnIntersectValue>
    onIntersectOut: Nullable<OnIntersectValue>
    onMoveToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>
    placeAt: Function | Array<any>

    translateX: Function | Array<any>
    translateY: Function | Array<any>
    translateZ: Function | Array<any>

    intersectIds: Nullable<Array<string>>

    scaleX: number
    scaleY: number
    scaleZ: number
    scale: number

    rotationX: number
    rotationY: number
    rotationZ: number
    rotation: number
}

export const simpleObjectManagerSchema: Required<
    ExtractProps<ISimpleObjectManager>
> = {
    ...animatedObjectManagerSchema,
    ...positionedSchema,

    onIntersect: Function,
    onIntersectOut: Function,
    onMoveToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],
    placeAt: [Function, Array],

    translateX: [Function, Array],
    translateY: [Function, Array],
    translateZ: [Function, Array],

    intersectIds: Array,

    scaleX: Number,
    scaleY: Number,
    scaleZ: Number,
    scale: Number,

    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,
    rotation: Number
}

hideSchema(["intersectIds", "moveTo", "lerpTo"])

export const simpleObjectManagerDefaults: Defaults<ISimpleObjectManager> = {
    ...animatedObjectManagerDefaults,
    ...positionedDefaults,

    onIntersect: undefined,
    onIntersectOut: undefined,
    onMoveToEnd: undefined,

    moveTo: fn,
    lerpTo: fn,
    placeAt: fn,

    translateX: fn,
    translateY: fn,
    translateZ: fn,

    intersectIds: undefined,

    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    scale: 1,

    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    rotation: 0
}
