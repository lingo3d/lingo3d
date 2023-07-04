import Appendable from "../../display/core/Appendable"
import Defaults from "./Defaults"
import NullableDefault from "./NullableDefault"

const getDefaultValue = (
    manager: Appendable | Defaults<any>,
    key: string,
    fillNullableDefault?: boolean
) => {
    const constructorDefaults = (manager.constructor as any).defaults
    const runtimeManager = constructorDefaults ? manager : undefined
    if (runtimeManager instanceof Appendable) {
        const { runtimeDefaults } = runtimeManager
        if (runtimeDefaults && key in runtimeDefaults)
            return runtimeDefaults[key]
    }
    const result = (constructorDefaults ?? manager)[key]
    if (result instanceof NullableDefault)
        return fillNullableDefault ? result.value : undefined
    if (fillNullableDefault) return result ?? ""
    return result
}
export default getDefaultValue

const isEqual = (val0: any, val1: any) =>
    val0 === val1 ||
    (typeof val0 === typeof val1 &&
        JSON.stringify(val0) === JSON.stringify(val1))

export const equalsDefaultValue = (
    val: any,
    manager: Appendable | Defaults<any>,
    key: string
) => {
    const defaultValue = getDefaultValue(manager, key, true)
    return isEqual(val ?? defaultValue, defaultValue)
}
