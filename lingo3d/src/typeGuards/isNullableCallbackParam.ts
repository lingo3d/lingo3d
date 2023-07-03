import { Point } from "@lincode/math"
import { LingoKeyboardEvent } from "../interface/IKeyboard"
import { LingoMouseEvent, SimpleMouseEvent } from "../interface/IMouse"
import { HitEvent } from "../interface/IVisible"
import { NullableCallbackParam } from "../interface/utils/NullableCallback"
import { Point3dType } from "./isPoint"

export type NullableCallbackParamType =
    | Point3dType
    | Point
    | HitEvent
    | LingoMouseEvent
    | SimpleMouseEvent
    | LingoKeyboardEvent
    | NullableCallbackParam

export const nullableCallbackParams = new WeakSet<NullableCallbackParamType>()
export const isNullableCallbackParam = (
    val: any
): val is NullableCallbackParamType => val && nullableCallbackParams.has(val)
