import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import {
    defaultMethod,
    defaultMethodPt3dArg,
    defaultMethodNumberArg
} from "./utils/DefaultMethod"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"
import Range from "./utils/Range"

export default interface IMeshAppendable extends IAppendable {
    x: number
    y: number
    z: number

    rotationX: number
    rotationY: number
    rotationZ: number

    onMove: Nullable<() => void>
    onMoveToEnd: Nullable<() => void>
    onLookToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>
    placeAt: Function | Array<any>

    translateX: Function | Array<any>
    translateY: Function | Array<any>
    translateZ: Function | Array<any>

    rotateX: Function | Array<any>
    rotateY: Function | Array<any>
    rotateZ: Function | Array<any>

    setRotationFromDirection: Function | Array<any>

    lookAt: Function | Array<any>
    lookTo: Function | Array<any>
}

export const meshAppendableSchema: Required<ExtractProps<IMeshAppendable>> = {
    ...appendableSchema,
    x: Number,
    y: Number,
    z: Number,

    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,

    onMove: Function,
    onMoveToEnd: Function,
    onLookToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],
    placeAt: [Function, Array],

    translateX: [Function, Array],
    translateY: [Function, Array],
    translateZ: [Function, Array],

    rotateX: [Function, Array],
    rotateY: [Function, Array],
    rotateZ: [Function, Array],

    setRotationFromDirection: [Function, Array],

    lookAt: [Function, Array],
    lookTo: [Function, Array]
}

export const meshAppendableDefaults = extendDefaults<IMeshAppendable>(
    [appendableDefaults],
    {
        x: 0,
        y: 0,
        z: 0,

        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,

        onMove: nullableCallback(),
        onMoveToEnd: nullableCallback(),
        onLookToEnd: nullableCallback(),

        moveTo: defaultMethod(defaultMethodPt3dArg),
        lerpTo: defaultMethod(defaultMethodPt3dArg),
        placeAt: defaultMethod(defaultMethodPt3dArg),

        translateX: defaultMethod(defaultMethodNumberArg),
        translateY: defaultMethod(defaultMethodNumberArg),
        translateZ: defaultMethod(defaultMethodNumberArg),

        rotateX: defaultMethod(defaultMethodNumberArg),
        rotateY: defaultMethod(defaultMethodNumberArg),
        rotateZ: defaultMethod(defaultMethodNumberArg),

        setRotationFromDirection: defaultMethod(defaultMethodPt3dArg),

        lookAt: defaultMethod(defaultMethodPt3dArg),
        lookTo: defaultMethod(defaultMethodPt3dArg)
    },
    {
        rotationX: new Range(0, 360),
        rotationY: new Range(0, 360),
        rotationZ: new Range(0, 360)
    }
)
