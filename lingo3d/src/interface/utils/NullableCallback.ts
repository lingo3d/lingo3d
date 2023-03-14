import { Point, Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { LingoKeyboardEvent } from "../IKeyboard"
import { LingoMouseEvent, SimpleMouseEvent } from "../IMouse"
import { HitEvent } from "../IVisible"

export class NullableCallbackParam {
    public constructor(public value?: string | number | boolean) {
        Object.freeze(this)
    }
}

export type NullableCallbackParamType =
    | Point3d
    | Point
    | HitEvent
    | LingoMouseEvent
    | SimpleMouseEvent
    | LingoKeyboardEvent
    | NullableCallbackParam

export const nullableCallbackVoidParam = new NullableCallbackParam()
export const nullableCallbackNumberParam = new NullableCallbackParam(0)
export const nullableCallbackPtParam = Object.freeze(new Point(0, 0))

export const nullableCallbackParams = new WeakSet<NullableCallbackParamType>()
export const isNullableCallbackParam = (
    value: any
): value is NullableCallbackParamType => nullableCallbackParams.has(value)

export default class NullableCallback {
    public constructor(public param: NullableCallbackParamType) {
        nullableCallbackParams.add(param)
    }
}

const nullableCallbackMap = new Map<
    NullableCallbackParamType,
    NullableCallback
>()
export const nullableCallback = (
    value: NullableCallbackParamType = nullableCallbackVoidParam
) => forceGet(nullableCallbackMap, value, () => new NullableCallback(value))
