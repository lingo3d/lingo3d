import { forceGet } from "@lincode/utils"
import NullableDefault from "./NullableDefault"
import Options from "./Options"

type Defaults<T> = {
    [key in keyof T]: T[key] | NullableDefault<T[key]>
}
export default Defaults

export const defaultsOptionsMap = new WeakMap<Defaults<any>, Options<any>>()
export const defaultsOwnKeysRecordMap = new WeakMap<
    Defaults<any>,
    Partial<Record<string, true>>
>()

const makeRecord = () => ({})
const inheritOptions = <T>(
    defaults: Partial<Defaults<T>>,
    parentDefaults: Partial<Defaults<T>>
) => {
    Object.assign(
        forceGet(defaultsOptionsMap, defaults, makeRecord),
        defaultsOptionsMap.get(parentDefaults)
    )
    Object.assign(
        forceGet(defaultsOwnKeysRecordMap, defaults, makeRecord),
        defaultsOwnKeysRecordMap.get(parentDefaults)
    )
}

export const extendDefaults = <T>(
    parentDefaults: Array<Partial<Defaults<T>>>,
    ownDefaults: Partial<Defaults<T>>,
    options?: Options<T>,
    ownKeysRecord?: Partial<Record<keyof T, true>>
) => {
    const result: Partial<Defaults<T>> = {}
    options && defaultsOptionsMap.set(result, options)
    ownKeysRecord && defaultsOwnKeysRecordMap.set(result, ownKeysRecord)
    for (const defaults of parentDefaults) {
        Object.assign(result, defaults)
        inheritOptions(result, defaults)
    }
    Object.assign(result, ownDefaults)
    inheritOptions(result, ownDefaults)
    return result
}
