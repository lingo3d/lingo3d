import { clearCollectionEffectSystem } from "../../systems/configSystems/clearCollectionEffectSystem"

export default <Item, Return>(cb: (item: Item) => Return) => {
    const cache = new Map<Item, Return>()
    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        clearCollectionEffectSystem.add(cache)
        return result
    }
}
