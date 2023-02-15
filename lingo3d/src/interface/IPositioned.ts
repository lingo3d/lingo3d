import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../events/onTransformControls"
import { defaultMethod } from "./utils/DefaultMethod"
import { nullableCallback } from "./utils/NullableCallback"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import { pt3d } from "../display/utils/reusables"

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
    onMove: nullableCallback(undefined),
    onMoveToEnd: nullableCallback(undefined),

    moveTo: defaultMethod(pt3d),
    lerpTo: defaultMethod(pt3d),
    placeAt: defaultMethod(pt3d),

    translateX: defaultMethod(0),
    translateY: defaultMethod(0),
    translateZ: defaultMethod(0)
})
