import { Point, Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { nanoid } from "nanoid"
import { LingoKeyboardEvent } from "../IKeyboard"
import { LingoMouseEvent, SimpleMouseEvent } from "../IMouse"
import { HitEvent } from "../IVisible"

//mark
export class NullableCallbackParam {
    public constructor(public value: string | number | boolean = nanoid()) {
        Object.freeze(this)
    }
}

type NullableCallbackParamType =
    | Point3d
    | Point
    | HitEvent
    | LingoMouseEvent
    | SimpleMouseEvent
    | LingoKeyboardEvent
    | NullableCallbackParam

export const nullableCallbackVoidParam = new NullableCallbackParam()
export const nullableCallbackPtParam = Object.freeze(new Point(0, 0))

const nullableCallbackParams = new Set<NullableCallbackParamType>()
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
