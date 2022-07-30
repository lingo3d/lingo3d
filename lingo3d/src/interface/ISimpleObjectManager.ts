import StaticObjectManager from "../display/core/StaticObjectManager"
import IAnimatedObjectManager, { animatedObjectManagerDefaults, animatedObjectManagerSchema } from "./IAnimatedObjectManager"
import IPhysics, { physicsDefaults, physicsSchema } from "./IPhysics"
import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export type OnIntersectValue = (target: StaticObjectManager) => void

export default interface ISimpleObjectManager extends IAnimatedObjectManager, IPositioned, IPhysics {
    onIntersect: Nullable<OnIntersectValue>
    onIntersectOut: Nullable<OnIntersectValue>
    onMoveToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>

    intersectIds: Nullable<Array<string>>

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

    innerVisible: boolean
}

export const simpleObjectManagerSchema: Required<ExtractProps<ISimpleObjectManager>> = {
    ...animatedObjectManagerSchema,
    ...positionedSchema,
    ...physicsSchema,

    onIntersect: Function,
    onIntersectOut: Function,
    onMoveToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],

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

    innerVisible: Boolean
}

hideSchema(["intersectIds", "moveTo", "lerpTo"])

export const simpleObjectManagerDefaults: Defaults<ISimpleObjectManager> = {
    ...animatedObjectManagerDefaults,
    ...positionedDefaults,
    ...physicsDefaults,

    onIntersect: undefined,
    onIntersectOut: undefined,
    onMoveToEnd: undefined,

    moveTo: fn,
    lerpTo: fn,

    intersectIds: undefined,

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

    innerVisible: true
}