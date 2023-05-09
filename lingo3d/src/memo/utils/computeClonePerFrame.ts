import { addClearAfterRenderSystem } from "../../systems/configSystems/clearAfterRenderSystem"

export default <Item extends object, Return extends { clone: () => Return }>(
    cb: (item: Item) => Return
) => {
    const cache = new Map<Item, Return>()
    return (item: Item): Return => {
        const cached = cache.get(item)
        if (cached) {
            return cached.clone()
        }
        const result = cb(item)
        cache.set(item, result.clone())
        addClearAfterRenderSystem(cache)
        return result.clone()
    }
}
