import defaultsOptionsMap, { inheritOptions } from "./defaultsOptionsMap"
import NullableDefault from "./NullableDefault"
import Options from "./Options"

type Defaults<T> = {
    [key in keyof T]: T[key] | NullableDefault<T[key]>
}
export default Defaults

export const extendDefaults = <T>(
    defaultsArray: Array<Defaults<any>>,
    options?: Options<T>
) => {
    const result = {} as Defaults<T>
    options && defaultsOptionsMap.set(result, options)
    for (const defaults of defaultsArray) {
        Object.assign(result, defaults)
        inheritOptions(result, defaults)
    }
    return result
}
