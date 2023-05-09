import { forceGetInstance } from "@lincode/utils"

export default <
    Item extends object,
    Item2,
    Return,
    Data extends Record<string, any>
>(
    cb: (item: Item, item2: Item2, data: Data) => Return
) => {
    const cache = new WeakMap<Item, Map<Item2, Return>>()
    return (item: Item, item2: Item2, data: Data): Return => {
        const cache2 = forceGetInstance(cache, item, Map<Item2, Return>)
        if (cache2.has(item2)) return cache2.get(item2)!
        const result = cb(item, item2, data)
        cache2.set(item2, result)
        return result
    }
}
