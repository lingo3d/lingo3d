import { inheritOptions } from "./defaultsOptionsMap"
import NullableDefault from "./NullableDefault"

type Defaults<T> = {
    [key in keyof T]: T[key] | NullableDefault<T[key]>
}
export default Defaults

export const extendDefaults = <T>(defaultsArray: Array<Defaults<any>>) => {
    const result = {} as Defaults<T>
    for (const defaults of defaultsArray) {
        Object.assign(result, defaults)
        inheritOptions(result, defaults)
    }
    return result
}
