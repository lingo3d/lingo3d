import { clearCollectionAfterRenderSystem } from "../../systems/configSystems/clearCollectionAfterRenderSystem"

export default <Item extends object, Return, Data extends Record<string, any>>(
    cb: (item: Item, data: Data) => Return
) => {
    const cache = new Map<Item, Return>()
    return (item: Item, data: Data): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item, data)
        cache.set(item, result)
        clearCollectionAfterRenderSystem.add(cache)
        return result
    }
}
