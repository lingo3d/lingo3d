import { isPoint } from "../../typeGuards/isPoint"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import Appendable from "../../display/core/Appendable"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { disableSchema } from "../../collections/disableSchema"
import { isObject } from "../../typeGuards/isObject"
import { getFixedValue } from "../../api/serializer/toFixed"

const filterSchema = (
    schema: Record<string, unknown>,
    includeKeys: Array<string> | undefined
) => {
    if (!includeKeys) return schema
    const result: Record<string, any> = {}
    for (const key of includeKeys) result[key] = schema[key]
    return result
}

export default (
    manager: Appendable,
    includeKeys: Array<string> | undefined
): Record<string, any> => {
    const { schema } = getStaticProperties(manager)
    if (!schema) return {}

    const rawParams: Record<string, any> = {}
    for (const [schemaKey, schemaValue] of Object.entries(
        filterSchema(schema, includeKeys)
    )) {
        if (schemaValue === Function || disableSchema.has(schemaKey)) continue

        const defaultValue = getDefaultValue(manager, schemaKey, true)
        if (isObject(defaultValue) && !isPoint(defaultValue)) continue

        rawParams[schemaKey] =
            getFixedValue(manager, schemaKey) ??
            structuredClone(defaultValue)
    }
    return rawParams
}
