import { isPoint } from "../../utils/isPoint"
import { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue, {
    FunctionPtr
} from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"
import Appendable from "../../api/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"
import unsafeSetValue from "../../utils/unsafeSetValue"

const filterSchema = (schema: any, includeKeys: Array<string> | undefined) => {
    if (!includeKeys) return schema
    const _schema: any = {}
    for (const key of includeKeys) _schema[key] = schema[key]
    return _schema
}

const isObject = (val: any): val is object =>
    val && typeof val === "object" && !Array.isArray(val)

export default (
    manager: Appendable,
    schema: any,
    defaults: any,
    includeKeys: Array<string> | undefined,
    skipFunctions: boolean
) => {
    const params: Record<string, any> = {}
    if (!schema) return [params, manager] as const

    const options = defaultsOptionsMap.get(defaults)
    const schemaKeyParamMap = new Map<string, object>()

    for (const schemaKey of Object.keys(filterSchema(schema, includeKeys))) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        const functionPtr: FunctionPtr = [undefined]
        const defaultValue = structuredClone(
            getDefaultValue(
                defaults,
                schemaKey,
                true,
                true,
                functionPtr,
                manager
            )
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
        new Proxy(manager, {
            get(_, prop: string) {
                if (schemaKeyParamMap.has(prop))
                    return schemaKeyParamMap.get(prop)
                return unsafeGetValue(manager, prop)
            },
            set(_, prop: string, val) {
                //pass callback functions directly to manager
                if (schemaKeyParamMap.has(prop) && typeof val !== "function")
                    schemaKeyParamMap.set(prop, val)
                else unsafeSetValue(manager, prop, val)
                return true
            }
        })
    ] as const
}
