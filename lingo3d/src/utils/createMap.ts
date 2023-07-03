import { unloadClearCollectionSystem } from "../systems/eventSystems/unloadClearCollectionSystem"

export default <K, V>() => {
    const result = new Map<K, V>()
    unloadClearCollectionSystem.add(result)
    return result
}
