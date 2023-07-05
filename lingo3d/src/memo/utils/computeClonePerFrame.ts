import { clearCollectionEffectSystem } from "../../systems/configSystems/clearCollectionEffectSystem"
import { createUnloadMap } from "../../utils/createUnloadMap"

export default <Item extends object, Return extends { clone: () => Return }>(
    cb: (item: Item) => Return
) => {
    const cache = createUnloadMap<Item, Return>()
    return (item: Item): Return => {
        const cached = cache.get(item)
        if (cached) return cached.clone()
        const result = cb(item)
        cache.set(item, result.clone())
        clearCollectionEffectSystem.add(cache)
        return result.clone()
    }
}
