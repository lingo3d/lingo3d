import { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"

const filterSchema = (schema: any, includeKeys: Array<string> | undefined) => {
    if (!includeKeys) return schema
    const _schema: any = {}
    for (const key of includeKeys) _schema[key] = schema[key]
    return _schema
}

export default (
    schema: any,
    defaults: any,
    includeKeys: Array<string> | undefined
) => {
    const params: Record<string, any> = {}
    if (!schema) return params

    const options = defaultsOptionsMap.get(defaults)

    for (const schemaKey of Object.keys(filterSchema(schema, includeKeys))) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        const defaultValue = getDefaultValue(defaults, schemaKey, true, true)
        if (
            defaultValue &&
            typeof defaultValue === "object" &&
            !Array.isArray(defaultValue)
        )
            continue

        const choices = options?.[schemaKey]
        if (choices && "options" in choices && choices.acceptAny)
            params["preset " + schemaKey] = true

        params[schemaKey] = defaultValue
    }
    return params
}
