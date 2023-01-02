import { onAfterRender } from "../events/onAfterRender"

const caches: Array<Map<object, any>> = []
onAfterRender(() => {
    for (const cache of caches) cache.clear()
})

export default <Item extends object, Return>(
    cb: (item: Item) => Return,
    clone = true
) => {
    const cache = new Map<Item, Return>()
    caches.push(cache)

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
            //@ts-ignore
            return result.clone()
        }

    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        return result
    }
}
