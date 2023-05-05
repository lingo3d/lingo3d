export default <Item extends object, Return>(cb: (item: Item) => Return) => {
    const cache = new WeakMap<Item, Return>()
    return (item: Item): Return => {
        if (cache.has(item)) return cache.get(item)!
        const result = cb(item)
        cache.set(item, result)
        return result
    }
}
