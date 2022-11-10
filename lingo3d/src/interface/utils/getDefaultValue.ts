import Defaults from "./Defaults"
import NullableDefault from "./NullableDefault"

export default (
    defaults: Defaults<any>,
    key: string,
    fillNullableDefault?: boolean
) => {
    const result = defaults[key]
    if (result instanceof NullableDefault)
        return fillNullableDefault ? result.value : undefined
    if (fillNullableDefault) return result ?? ""
    return result
}

export const equalsDefaultValue = (
    val: any,
    defaults: Defaults<any>,
    key: string
) => {
    const result = defaults[key]
    if (result instanceof NullableDefault)
        return val === result.value || val === undefined
    return val === result || val === ""
}
