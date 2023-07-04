import { forceGetInstance } from "@lincode/utils"
import NullableDefault from "./NullableDefault"
import Options from "./Options"
import {
    defaultsOptionsMap,
    defaultsOwnKeysRecordMap
} from "../../collections/defaultsCollections"

type Defaults<T> = {
    [key in keyof T]: T[key] | NullableDefault<T[key]>
}
export default Defaults

const inheritOptions = <T>(
    defaults: Partial<Defaults<T>>,
    parentDefaults: Partial<Defaults<T>>
) => {
    Object.assign(
        forceGetInstance(defaultsOptionsMap, defaults, Object),
        defaultsOptionsMap.get(parentDefaults)
    )
    Object.assign(
        forceGetInstance(defaultsOwnKeysRecordMap, defaults, Object),
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
