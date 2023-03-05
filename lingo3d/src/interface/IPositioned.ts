import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../events/onTransformControls"
import {
    defaultMethod,
    defaultMethodPt3dArg,
    defaultMethodNumberArg
} from "./utils/DefaultMethod"
import { nullableCallback } from "./utils/NullableCallback"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IPositioned {
    x: number
    y: number
    z: number

    onTransformControls: Nullable<
        (phase: TransformControlsPhase, mode: TransformControlsMode) => void
    >
    onMove: Nullable<() => void>
    onMoveToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>
    placeAt: Function | Array<any>

    translateX: Function | Array<any>
    translateY: Function | Array<any>
    translateZ: Function | Array<any>
}

export const positionedSchema: Required<ExtractProps<IPositioned>> = {
    x: Number,
    y: Number,
    z: Number,

    onTransformControls: Function,
    onMove: Function,
    onMoveToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],
    placeAt: [Function, Array],

    translateX: [Function, Array],
    translateY: [Function, Array],
    translateZ: [Function, Array]
}
hideSchema(["onTransformControls"])

export const positionedDefaults = extendDefaults<IPositioned>([], {
    x: 0,
    y: 0,
    z: 0,

    onTransformControls: undefined,
    onMove: nullableCallback(),
    onMoveToEnd: nullableCallback(),

    moveTo: defaultMethod(defaultMethodPt3dArg),
    lerpTo: defaultMethod(defaultMethodPt3dArg),
    placeAt: defaultMethod(defaultMethodPt3dArg),

    translateX: defaultMethod(defaultMethodNumberArg),
    translateY: defaultMethod(defaultMethodNumberArg),
    translateZ: defaultMethod(defaultMethodNumberArg)
})
