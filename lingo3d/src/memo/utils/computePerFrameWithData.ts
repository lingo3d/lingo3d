import { clearCollectionEffectSystem } from "../../systems/configSystems/clearCollectionEffectSystem"

export default <Item extends object, Return, Data extends Record<string, any>>(
    cb: (item: Item, data: Data) => Return
) => {
    const cache = new Map<Item, Return>()
    return (item: Item, data: Data, noCache?: boolean): Return => {
        if (!noCache && cache.has(item)) return cache.get(item)!
        const result = cb(item, data)
        if (noCache) return result
        cache.set(item, result)
        clearCollectionEffectSystem.add(cache)
        return result
    }
}
