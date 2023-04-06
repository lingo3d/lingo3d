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
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Range from "./utils/Range"

export default interface IMeshAppendable extends IAppendable {
    x: number
    y: number
    z: number

    rotationX: number
    rotationY: number
    rotationZ: number
    rotation: number

    onMove: Nullable<() => void>
    onMoveToEnd: Nullable<() => void>
    onLookToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>
    placeAt: Function | Array<any>

    translateX: Function | Array<any>
    translateY: Function | Array<any>
    translateZ: Function | Array<any>

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
    rotation: Number,

    onMove: Function,
    onMoveToEnd: Function,
    onLookToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],
    placeAt: [Function, Array],

    translateX: [Function, Array],
    translateY: [Function, Array],
    translateZ: [Function, Array],

    lookAt: [Function, Array],
    lookTo: [Function, Array]
}
hideSchema(["rotation"])

export const meshAppendableDefaults = extendDefaults<IMeshAppendable>(
    [appendableDefaults],
    {
        x: 0,
        y: 0,
        z: 0,

        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        rotation: 0,

        onMove: nullableCallback(),
        onMoveToEnd: nullableCallback(),
        onLookToEnd: nullableCallback(),

        moveTo: defaultMethod(defaultMethodPt3dArg),
        lerpTo: defaultMethod(defaultMethodPt3dArg),
        placeAt: defaultMethod(defaultMethodPt3dArg),

        translateX: defaultMethod(defaultMethodNumberArg),
        translateY: defaultMethod(defaultMethodNumberArg),
        translateZ: defaultMethod(defaultMethodNumberArg),

        lookAt: defaultMethod(defaultMethodPt3dArg),
        lookTo: defaultMethod(defaultMethodPt3dArg)
    },
    {
        rotationX: new Range(0, 360),
        rotationY: new Range(0, 360),
        rotationZ: new Range(0, 360),
        rotation: new Range(0, 360)
    }
)
