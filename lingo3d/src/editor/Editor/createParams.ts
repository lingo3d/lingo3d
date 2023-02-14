import { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"
import NullableCallback from "../../interface/utils/NullableCallback"

const filterSchema = (schema: any, includeKeys: Array<string> | undefined) => {
    if (!includeKeys) return schema
    const _schema: any = {}
    for (const key of includeKeys) _schema[key] = schema[key]
    return _schema
}

export default (
    schema: any,
    defaults: any,
    includeKeys: Array<string> | undefined,
    skipCallbacks: boolean
) => {
    const params: Record<string, any> = {}
    if (!schema) return params

    const options = defaultsOptionsMap.get(defaults)

    for (let [schemaKey, schemaValue] of Object.entries(
        filterSchema(schema, includeKeys)
    )) {
        if (nonEditorSchemaSet.has(schemaKey)) continue

        let defaultValue: any
        if (
            schemaValue === Function ||
            (Array.isArray(schemaValue) && schemaValue.includes(Function))
        ) {
            if (skipCallbacks) continue

            console.log(defaults)

            const defaultVal: NullableCallback<any> | object | undefined =
                defaults[schemaKey]
            if (!defaultVal || !("param" in defaultVal)) continue
            defaultValue = defaultVal.param
        } else defaultValue = getDefaultValue(defaults, schemaKey, true)

        const choices = options?.[schemaKey]
        if (choices && "options" in choices && choices.acceptAny)
            params["preset " + schemaKey] = true

        params[schemaKey] = defaultValue
    }
    return params
}
