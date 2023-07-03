import { isPoint } from "../../typeGuards/isPoint"
import getDefaultValue, {
    FunctionPtr
} from "../../interface/utils/getDefaultValue"
import Appendable from "../../display/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { extendFunction, omitFunction } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { disableSchema } from "../../collections/disableSchema"
import { runtimeSchemaMap } from "../../collections/runtimeCollections"
import { getFixedRuntimeValue } from "../../utils/getRuntimeValue"
import {
    isDefaultMethodArg,
    defaultMethodArgs,
    DefaultMethodArgType
} from "../../typeGuards/isDefaultMethodArg"
import {
    NullableCallbackParamType,
    isNullableCallbackParam,
    nullableCallbackParams
} from "../../typeGuards/isNullableCallbackParam"
import { isObject } from "../../typeGuards/isObject"
import NullableCallback from "../../interface/utils/NullableCallback"

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
): [Record<string, any>, Appendable] => {
    const { schema } = getStaticProperties(manager)
    if (!schema) return [{}, manager]

    const schemaKeyNullableCallbackParamMap = new Map<
        string,
        NullableCallbackParamType
    >()
    const schemaKeyDefaultMethodArgMap = new Map<string, DefaultMethodArgType>()

    const rawParams: Record<string, any> = {}
    const methodParams: Record<string, any> = {}
    const callbackParams: Record<string, any> = {}

    for (const schemaKey of Object.keys(
        filterSchema(schema, runtimeSchemaMap.get(manager), includeKeys)
    )) {
        if (disableSchema.has(schemaKey)) continue

        const functionPtr: FunctionPtr = [undefined]
        const [defaultValue, isDefaultValue] = structuredCloneDefaultValue(
            getDefaultValue(manager, schemaKey, true, true, functionPtr)
        )
        if (isObject(defaultValue) && !isPoint(defaultValue) && !isDefaultValue)
            continue

        const [fn] = functionPtr
        if (skipFunctions && fn) continue

        if (fn instanceof NullableCallback) {
            schemaKeyNullableCallbackParamMap.set(schemaKey, fn.param)
            callbackParams[schemaKey] = defaultValue
            continue
        }
        if (fn) {
            schemaKeyDefaultMethodArgMap.set(schemaKey, fn.arg)
            methodParams[schemaKey] = defaultValue
            continue
        }
        rawParams[schemaKey] =
            getFixedRuntimeValue(manager, schemaKey) ?? defaultValue
    }
    return [
        { ...rawParams, ...callbackParams, ...methodParams },
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
    ]
}
