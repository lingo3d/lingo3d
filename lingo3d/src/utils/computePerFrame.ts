import throttleSystem from "./throttleSystem"

const clearCacheSystem = throttleSystem((cache: Map<object, any>) =>
    cache.clear()
)

export default <Item extends object, Return>(
    cb: (item: Item) => Return,
    clone = true
) => {
    const cache = new Map<Item, Return>()

    if (clone)
        return (item: Item): Return => {
            const cached = cache.get(item)
            if (cached) {
                //@ts-ignore
                return cached.clone()
            }
            const result = cb(item)
            //@ts-ignore
            cache.set(item, result.clone())
            clearCacheSystem(cache)
            //@ts-ignore
            return result.clone()
        }

    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        clearCacheSystem(cache)
        return result
    }
}
