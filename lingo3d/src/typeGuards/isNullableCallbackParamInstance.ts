import { NullableCallbackParam } from "../interface/utils/NullableCallback"
import { isNullableCallbackParam } from "./isNullableCallbackParam"

export const isNullableCallbackParamInstance = (
    value: any
): value is NullableCallbackParam =>
    isNullableCallbackParam(value) && "value" in value
