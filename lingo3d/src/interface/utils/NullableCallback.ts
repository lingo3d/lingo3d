import { Point } from "@lincode/math"
import { forceGetInstance } from "@lincode/utils"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import { LingoKeyboardEvent } from "../IKeyboard"
import { LingoMouseEvent, SimpleMouseEvent } from "../IMouse"
import { HitEvent } from "../IVisible"
import {
    isNullableCallbackParam,
    nullableCallbackParams
} from "../../collections/typeGuards"
import { Point3dType } from "../../utils/isPoint"

export class NullableCallbackParam {
    public constructor(
        public value?: string | number | boolean,
        public allowInput = true
    ) {
        Object.freeze(this)
    }
}

export type NullableCallbackParamType =
    | Point3dType
    | Point
    | HitEvent
    | LingoMouseEvent
    | SimpleMouseEvent
    | LingoKeyboardEvent
    | NullableCallbackParam

export const nullableCallbackVoidParam = new NullableCallbackParam()
export const nullableCallbackNumberParam = new NullableCallbackParam(0)
export const nullableCallbackDtParam = new NullableCallbackParam(
    INVERSE_STANDARD_FRAME,
    false
)
export const nullableCallbackPtParam = Object.freeze(new Point(0, 0))

export const isNullableCallbackParamInstance = (
    value: any
): value is NullableCallbackParam =>
    isNullableCallbackParam(value) && "value" in value

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
) => forceGetInstance(nullableCallbackMap, value, NullableCallback, [value])
