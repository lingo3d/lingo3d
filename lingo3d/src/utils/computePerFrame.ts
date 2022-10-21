import { onAfterRender } from "../events/onAfterRender"

export const computeValuePerFrame = <Item extends Object, Return>(
    cb: (item: Item) => Return
) => {
    const cache = new Map<Item, Return>()
    let blocked = false
    const clearCacheDebounced = () => {
        if (blocked) return
        blocked = true
        onAfterRender(() => {
            blocked = false
            cache.clear()
        }, true)
    }
    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        clearCacheDebounced()
        return result
    }
}
