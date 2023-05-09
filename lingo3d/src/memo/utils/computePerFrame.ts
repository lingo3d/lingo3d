import { addClearAfterRenderSystem } from "../../systems/configSystems/clearAfterRenderSystem"

export default <Item, Return>(cb: (item: Item) => Return) => {
    const cache = new Map<Item, Return>()
    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        addClearAfterRenderSystem(cache)
        return result
    }
}