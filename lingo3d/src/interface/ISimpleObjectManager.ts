import StaticObjectManager from "../display/core/StaticObjectManager"
import IAnimatedObjectManager, {
    animatedObjectManagerDefaults,
    animatedObjectManagerSchema
} from "./IAnimatedObjectManager"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import IDirectioned, {
    directionedDefaults,
    directionedSchema
} from "./IDirectioned"

export type OnIntersectValue = (target: StaticObjectManager) => void

export default interface ISimpleObjectManager
    extends IAnimatedObjectManager,
        IPositioned,
        IDirectioned {
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
}
hideSchema(["rotation"])

export const simpleObjectManagerSchema: Required<
    ExtractProps<ISimpleObjectManager>
> = {
    ...animatedObjectManagerSchema,
    ...positionedSchema,
    ...directionedSchema,

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
    scale: Number
}
hideSchema(["intersectIds"])

export const simpleObjectManagerDefaults = extendDefaults<ISimpleObjectManager>(
    [animatedObjectManagerDefaults, positionedDefaults, directionedDefaults],
    {
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
        scale: 1
    },
    {
        scale: new Range(0, 10),
        scaleX: new Range(0, 10),
        scaleY: new Range(0, 10),
        scaleZ: new Range(0, 10)
    }
)
