import StaticObjectManager from "../display/core/StaticObjectManager"
import IPhysics, { physicsDefaults, physicsSchema } from "./IPhysics"
import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import IStaticObjectManager, { staticObjectManagerDefaults, staticObjectManagerSchema } from "./IStaticObjectManaget"
import Callable from "./utils/Callable"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"

export type OnIntersectValue = (target: StaticObjectManager) => void

export default interface ISimpleObjectManager extends IStaticObjectManager, IPositioned, IPhysics {
    onIntersect: Nullable<OnIntersectValue>
    onIntersectOut: Nullable<OnIntersectValue>
    onMoveToEnd: Nullable<() => void>

    moveTo: Callable<[x: number, y: number | undefined, z: number, speed: number]>
    lerpTo: Callable<[x: number, y: number, z: number, alpha: number]>

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
    ...staticObjectManagerSchema,
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
    ...staticObjectManagerDefaults,
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