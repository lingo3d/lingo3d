import Template from "../display/Template"
import { DefaultMethodArgType } from "../interface/utils/DefaultMethod"
import { NullableCallbackParamType } from "../interface/utils/NullableCallback"
import TemplateNode from "../visualScripting/TemplateNode"

export const templateSet = new WeakSet<Template>()
export const isTemplate = (val: any): val is Template =>
    val && templateSet.has(val)

export const templateNodeSet = new WeakSet<TemplateNode>()
export const isTemplateNode = (val: any): val is TemplateNode =>
    val && templateNodeSet.has(val)

export const defaultMethodArgs = new WeakSet<DefaultMethodArgType>()
export const isDefaultMethodArg = (val: any): val is DefaultMethodArgType =>
    val && defaultMethodArgs.has(val)

export const nullableCallbackParams = new WeakSet<NullableCallbackParamType>()
export const isNullableCallbackParam = (
    val: any
): val is NullableCallbackParamType => val && nullableCallbackParams.has(val)
