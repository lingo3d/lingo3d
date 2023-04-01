import Template from "../display/Template"
import { DefaultMethodArgType } from "../interface/utils/DefaultMethod"
import { NullableCallbackParamType } from "../interface/utils/NullableCallback"
import TemplateNode from "../visualScripting/TemplateNode"

export const templateSet = new WeakSet<Template>()
export const isTemplate = (val: any): val is Template => templateSet.has(val)

export const templateNodeSet = new WeakSet<TemplateNode>()
export const isTemplateNode = (val: any): val is TemplateNode =>
    templateNodeSet.has(val)

export const defaultMethodArgs = new WeakSet<DefaultMethodArgType>()
export const isDefaultMethodArg = (value: any): value is DefaultMethodArgType =>
    defaultMethodArgs.has(value)

export const nullableCallbackParams = new WeakSet<NullableCallbackParamType>()
export const isNullableCallbackParam = (
    value: any
): value is NullableCallbackParamType => nullableCallbackParams.has(value)
