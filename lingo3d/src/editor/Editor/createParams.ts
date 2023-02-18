import { isPoint } from "../../utils/isPoint"
import { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"
import Appendable from "../../api/core/Appendable"

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
    if (!schema) return params

    const options = defaultsOptionsMap.get(defaults)

    for (const schemaKey of Object.keys(filterSchema(schema, includeKeys))) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        const isFunctionPtr: ["method" | "callback" | ""] = [""]
        const defaultValue = structuredClone(
            getDefaultValue(
                defaults,
                schemaKey,
                true,
                true,
                isFunctionPtr,
                manager
            )
        )
        if (isObject(defaultValue) && !isPoint(defaultValue)) continue
        if (skipFunctions && isFunctionPtr[0]) continue

        const choices = options?.[schemaKey]
        if (choices && "options" in choices && choices.acceptAny)
            params["preset " + schemaKey] = true

        params[schemaKey] = defaultValue
    }
    return params
}
