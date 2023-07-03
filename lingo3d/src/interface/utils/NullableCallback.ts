import { Point } from "@lincode/math"
import { forceGetInstance } from "@lincode/utils"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import {
    NullableCallbackParamType,
    nullableCallbackParams
} from "../../typeGuards/isNullableCallbackParam"

export class NullableCallbackParam {
    public constructor(
        public value?: string | number | boolean,
        public allowInput = true
    ) {
        Object.freeze(this)
    }
}

export const nullableCallbackVoidParam = new NullableCallbackParam()
export const nullableCallbackNumberParam = new NullableCallbackParam(0)
export const nullableCallbackDtParam = new NullableCallbackParam(
    INVERSE_STANDARD_FRAME,
    false
)
export const nullableCallbackPtParam = Object.freeze(new Point(0, 0))

export default class NullableCallback {
    public constructor(public param: NullableCallbackParamType) {
        nullableCallbackParams.add(param)
    }
}

const nullableCallbackMap = new WeakMap<
    NullableCallbackParamType,
    NullableCallback
>()
export const nullableCallback = (
    value: NullableCallbackParamType = nullableCallbackVoidParam
) => forceGetInstance(nullableCallbackMap, value, NullableCallback, [value])
