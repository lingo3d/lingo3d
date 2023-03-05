import { Point, Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { LingoKeyboardEvent } from "../IKeyboard"
import { LingoMouseEvent, SimpleMouseEvent } from "../IMouse"
import { HitEvent } from "../IVisible"
import DefaultValue from "./DefaultValue"

type NullableCallbackParam =
    | Point3d
    | Point
    | HitEvent
    | LingoMouseEvent
    | SimpleMouseEvent
    | LingoKeyboardEvent
    | DefaultValue

export const nullableCallbackVoidParam = new DefaultValue()
export const nullableCallbackPtParam = Object.freeze(new Point(0, 0))

const nullableCallbackParams = new Set<NullableCallbackParam>()
export const isNullableCallbackParam = (
    value: any
): value is NullableCallbackParam => nullableCallbackParams.has(value)

export default class NullableCallback {
    public constructor(public param: NullableCallbackParam) {
        nullableCallbackParams.add(param)
    }
}

const nullableCallbackMap = new Map<NullableCallbackParam, NullableCallback>()
export const nullableCallback = (
    value: NullableCallbackParam = nullableCallbackVoidParam
) => forceGet(nullableCallbackMap, value, () => new NullableCallback(value))
