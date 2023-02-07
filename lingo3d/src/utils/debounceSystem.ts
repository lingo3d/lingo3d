import throttleFrame from "./throttleFrame"

export default <T>(cb: (target: T) => void) => {
    const queued = new Set<T>()
    const run = throttleFrame(() => {
        for (const target of queued) cb(target)
        queued.clear()
    })
    return (item: T) => {
        queued.add(item)
        run()
    }
}
