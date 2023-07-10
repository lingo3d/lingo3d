import { unloadClearCollectionSystem } from "../systems/eventSystems/unloadClearCollectionSystem"

export const createUnloadMap = <K, V>() => {
    const result = new Map<K, V>()
    unloadClearCollectionSystem.add(result)
    return result
}

export const createUnloadArray = <T>() => {
    const result: Array<T> = []
    unloadClearCollectionSystem.add(result)
    return result
}
