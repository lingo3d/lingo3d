import { clearCollectionEffectSystem } from "../../systems/configSystems/clearCollectionEffectSystem"
import { createUnloadMap } from "../../utils/createUnloadMap"

export default <Item, Return>(cb: (item: Item) => Return) => {
    const cache = createUnloadMap<Item, Return>()
    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        clearCollectionEffectSystem.add(cache)
        return result
    }
}
