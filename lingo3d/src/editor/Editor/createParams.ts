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
import { extendFunction, forceGet, omitFunction } from "@lincode/utils"

const filterSchema = (
    schema: Record<string, any>,
    runtimeSchema: Record<string, any> | undefined,
    includeKeys: Array<string> | undefined
) => {
    if (!includeKeys) return { ...schema, ...runtimeSchema }
    const result: any = {}
    for (const key of includeKeys)
        result[key] = schema[key] ?? runtimeSchema?.[key]
    return result
}

const isObject = (val: any): val is object =>
    val && typeof val === "object" && !Array.isArray(val)

const managerProxyMap = new WeakMap<Appendable, Appendable>()

export default (
    manager: Appendable,
    includeKeys: Array<string> | undefined,
    skipFunctions: boolean
) => {
    const { schema, defaults } = unsafeGetValue(manager, "constructor")
    const params: Record<string, any> = {}
    if (!schema) return [params, manager] as const

    const options = defaultsOptionsMap.get(defaults)
    const schemaKeyParamMap = new Map<string, object>()

    for (const schemaKey of Object.keys(
        filterSchema(
            schema,
            unsafeGetValue(manager, "runtimeSchema"),
            includeKeys
        )
    )) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        const functionPtr: FunctionPtr = [undefined]
        const defaultValue = structuredClone(
            getDefaultValue(manager, schemaKey, true, true, functionPtr)
        )
        if (isObject(defaultValue) && !isPoint(defaultValue)) continue
        if (skipFunctions && functionPtr[0]) continue

        if (functionPtr[0] && "param" in functionPtr[0])
            schemaKeyParamMap.set(schemaKey, functionPtr[0].param)

        const choices = options?.[schemaKey]
        if (choices && "options" in choices && choices.acceptAny)
            params["preset " + schemaKey] = true

        params[schemaKey] = defaultValue
    }
    return [
        params,
        forceGet(
            managerProxyMap,
            manager,
            () =>
                new Proxy(manager, {
                    get(_, prop: string) {
                        if (schemaKeyParamMap.has(prop))
                            return schemaKeyParamMap.get(prop)
                        return unsafeGetValue(manager, prop)
                    },
                    set(_, prop: string, val) {
                        if (
                            schemaKeyParamMap.has(prop) &&
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
                })
        )
    ] as const
}
