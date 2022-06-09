import SimpleObjectManager from "../display/core/SimpleObjectManager"
import IPhysics, { physicsDefaults, physicsSchema } from "./IPhysics"
import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import IStaticObjectManager, { staticObjectManagerDefaults, staticObjectManagerSchema } from "./IStaticObjectManaget"
import { ExtractProps } from "./utils/extractProps"

export type OnIntersectValue = (target: SimpleObjectManager) => void

export default interface ISimpleObjectManager extends IStaticObjectManager, IPositioned, IPhysics {
    onIntersect?: OnIntersectValue
    onIntersectOut?: OnIntersectValue

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

    innerVisible: boolean
}

export const simpleObjectManagerSchema: Required<ExtractProps<ISimpleObjectManager>> = {
    ...staticObjectManagerSchema,
    ...positionedSchema,
    ...physicsSchema,

    onIntersect: Function,
    onIntersectOut: Function,

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

export const simpleObjectManagerDefaults: ISimpleObjectManager = {
    ...staticObjectManagerDefaults,
    ...positionedDefaults,
    ...physicsDefaults,

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