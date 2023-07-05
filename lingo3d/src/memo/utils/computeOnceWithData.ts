import { createUnloadMap } from "../../utils/createUnloadMap"

export default <Item, Return, Data>(cb: (item: Item, data: Data) => Return) => {
    const cache = createUnloadMap<Item, Return>()
    return (item: Item, data: Data): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item, data)
        cache.set(item, result)
        Object.freeze(result)
        return result
    }
}
