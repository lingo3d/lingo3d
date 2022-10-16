import defaultsOptionsMap, { inheritOptions } from "./defaultsOptionsMap"
import NullableDefault from "./NullableDefault"
import Options from "./Options"

type Defaults<T> = {
    [key in keyof T]: T[key] | NullableDefault<T[key]>
}
export default Defaults

export const extendDefaults = <T>(
    parentDefaults: Array<Partial<Defaults<T>>>,
    ownDefaults: Partial<Defaults<T>>,
    options?: Options<T>
) => {
    const result: Partial<Defaults<T>> = {}
    options && defaultsOptionsMap.set(result, options)
    for (const defaults of parentDefaults) {
        Object.assign(result, defaults)
        inheritOptions(result, defaults)
    }
    Object.assign(result, ownDefaults)
    inheritOptions(result, ownDefaults)
    return result
}
