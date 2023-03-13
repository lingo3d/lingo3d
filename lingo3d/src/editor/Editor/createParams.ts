import { isPoint } from "../../utils/isPoint"
import getDefaultValue, {
    FunctionPtr
} from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"
import Appendable from "../../api/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { extendFunction, omitFunction } from "@lincode/utils"
import NullableCallback, {
    isNullableCallbackParam,
    nullableCallbackParams,
    NullableCallbackParamType
} from "../../interface/utils/NullableCallback"
import {
    defaultMethodArgs,
    DefaultMethodArgType,
    isDefaultMethodArg
} from "../../interface/utils/DefaultMethod"
import { Cancellable } from "@lincode/promiselikes"
import getStaticProperties from "../../display/utils/getStaticProperties"

export class PassthroughCallback {
    public constructor(
        public callback: (val: any) => void,
        public handle: Cancellable
    ) {}
}

const proxyInstanceMap = new WeakMap<any, any>()
const setProxyInstance = (proxy: any, instance: any) => {
    proxyInstanceMap.set(proxy, instance)
    return proxy
}
export const getOriginalInstance = (manager: any) =>
    proxyInstanceMap.get(manager) ?? manager

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

const structuredCloneDefaultValue = <T>(val: T) => {
    if (isNullableCallbackParam(val)) {
        const cloned = structuredClone(val)
        nullableCallbackParams.add(cloned)
        return <const>[cloned, true]
    }
    if (isDefaultMethodArg(val)) {
        const cloned = structuredClone(val)
        defaultMethodArgs.add(cloned)
        return <const>[cloned, true]
    }
    return <const>[structuredClone(val), false]
}

export default (
    manager: Appendable,
    includeKeys: Array<string> | undefined,
    skipFunctions: boolean
) => {
    const { schema } = getStaticProperties(manager)
    const params: Record<string, any> = {}
    if (!schema) return [params, manager] as const

    const schemaKeyNullableCallbackParamMap = new Map<
        string,
        NullableCallbackParamType
    >()
    const schemaKeyDefaultMethodArgMap = new Map<string, DefaultMethodArgType>()

    for (const schemaKey of Object.keys(
        filterSchema(schema, manager.runtimeSchema, includeKeys)
    )) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        const functionPtr: FunctionPtr = [undefined]
        const [defaultValue, isDefaultValue] = structuredCloneDefaultValue(
            getDefaultValue(manager, schemaKey, true, true, functionPtr)
        )
        if (isObject(defaultValue) && !isPoint(defaultValue) && !isDefaultValue)
            continue

        const [fn] = functionPtr
        if (skipFunctions && fn) continue

        if (fn instanceof NullableCallback)
            schemaKeyNullableCallbackParamMap.set(schemaKey, fn.param)
        else if (fn) schemaKeyDefaultMethodArgMap.set(schemaKey, fn.arg)

        params[schemaKey] = defaultValue
    }
    return [
        params,
        setProxyInstance(
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
                        val.handle.then(() =>
                            omitFunction(extended, val.callback)
                        )
                        return true
                    }
                    unsafeSetValue(manager, prop, val)
                    return true
                }
            }),
            manager
        )
    ] as const
}
