import { isPoint } from "../../utils/isPoint"
import { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue, {
    FunctionPtr
} from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"
import Appendable from "../../api/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { PassthroughCallback } from "./addInputs"
import { extendFunction, omitFunction } from "@lincode/utils"
import NullableCallback, {
    NullableCallbackParam
} from "../../interface/utils/NullableCallback"
import { DefaultMethodArg } from "../../interface/utils/DefaultMethod"

const filterSchema = (
    schema: Record<string, unknown>,
    runtimeSchema: Record<string, unknown> | undefined,
    includeKeys: Array<string> | undefined
) => {
    if (!includeKeys) return { ...schema, ...runtimeSchema }
    const result: Record<string, any> = {}
    for (const key of includeKeys)
        result[key] = schema[key] ?? runtimeSchema?.[key]
    return result
}

const isObject = (val: any): val is object =>
    val && typeof val === "object" && !Array.isArray(val)

const structuredCloneIfNotDefaultValue = <T>(val: T) => {
    if (val instanceof NullableCallbackParam || val instanceof DefaultMethodArg)
        return <const>[val, true]
    return <const>[structuredClone(val), false]
}

export default (
    manager: Appendable,
    includeKeys: Array<string> | undefined,
    skipFunctions: boolean
) => {
    const { schema, defaults } = unsafeGetValue(manager, "constructor")
    const params: Record<string, any> = {}
    if (!schema) return [params, manager] as const

    const options = defaultsOptionsMap.get(defaults)
    const schemaKeyNullableCallbackParamMap = new Map<string, unknown>()
    const schemaKeyDefaultMethodArgMap = new Map<string, unknown>()

    for (const schemaKey of Object.keys(
        filterSchema(
            schema,
            unsafeGetValue(manager, "runtimeSchema"),
            includeKeys
        )
    )) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        const functionPtr: FunctionPtr = [undefined]
        const [defaultValue, isDefaultValue] = structuredCloneIfNotDefaultValue(
            getDefaultValue(manager, schemaKey, true, true, functionPtr)
        )
        if (isObject(defaultValue) && !isPoint(defaultValue) && !isDefaultValue)
            continue

        const [fn] = functionPtr
        if (skipFunctions && fn) continue

        if (fn instanceof NullableCallback)
            schemaKeyNullableCallbackParamMap.set(schemaKey, fn.param)
        else if (fn) schemaKeyDefaultMethodArgMap.set(schemaKey, fn.arg)

        const choices = options?.[schemaKey]
        if (choices && "options" in choices && choices.acceptAny)
            params["preset " + schemaKey] = true

        params[schemaKey] = defaultValue
    }
    return [
        params,
        new Proxy(manager, {
            get(_, prop: string) {
                if (schemaKeyNullableCallbackParamMap.has(prop))
                    return schemaKeyNullableCallbackParamMap.get(prop)
                if (schemaKeyDefaultMethodArgMap.has(prop))
                    return schemaKeyDefaultMethodArgMap.get(prop)
                return unsafeGetValue(manager, prop)
            },
            set(_, prop: string, val) {
                if (
                    schemaKeyNullableCallbackParamMap.has(prop) &&
                    val instanceof PassthroughCallback
                ) {
                    const extended = unsafeSetValue(
                        manager,
                        prop,
                        extendFunction(
                            unsafeGetValue(manager, prop),
                            val.callback
                        )
                    )
                    val.handle.then(() => omitFunction(extended, val.callback))
                    return true
                }
                unsafeSetValue(manager, prop, val)
                return true
            }
        })
    ] as const
}
