import getDefaultValue from "../../interface/utils/getDefaultValue"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"

export default (schema: any, defaults: any, target: any) => {
    const params: Record<string, any> = {}
    for (const [key, value] of Object.entries(schema)) {
        if (nonEditorSchemaSet.has(key)) continue

        let currentVal = target[key]
        if (
            value === Function ||
            (Array.isArray(value) && value.includes(Function)) ||
            typeof currentVal === "function"
        )
            continue

        if (
            value === Object ||
            (typeof currentVal === "object" && !Array.isArray(currentVal))
        )
            if (
                !currentVal ||
                typeof currentVal.x !== "number" ||
                typeof currentVal.y !== "number"
            )
                continue

        currentVal ??= getDefaultValue(defaults, key, true)

        if (Array.isArray(currentVal)) currentVal = JSON.stringify(currentVal)

        params[key] = currentVal
    }
    return params
}
