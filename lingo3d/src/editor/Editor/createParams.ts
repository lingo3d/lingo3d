import { isPoint } from "../../typeGuards/isPoint"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import Appendable from "../../display/core/Appendable"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { disableSchema } from "../../collections/disableSchema"
import { runtimeSchemaMap } from "../../collections/runtimeCollections"
import { getFixedRuntimeValue } from "../../utils/getRuntimeValue"
import { isObject } from "../../typeGuards/isObject"

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

export default (
    manager: Appendable,
    includeKeys: Array<string> | undefined
): Record<string, any> => {
    const { schema } = getStaticProperties(manager)
    if (!schema) return {}

    const rawParams: Record<string, any> = {}
    for (const [schemaKey, schemaValue] of Object.entries(
        filterSchema(schema, runtimeSchemaMap.get(manager), includeKeys)
    )) {
        if (schemaValue === Function || disableSchema.has(schemaKey)) continue

        const defaultValue = getDefaultValue(manager, schemaKey, true)
        if (isObject(defaultValue) && !isPoint(defaultValue)) continue

        rawParams[schemaKey] =
            getFixedRuntimeValue(manager, schemaKey) ??
            structuredClone(defaultValue)
    }
    return rawParams
}
