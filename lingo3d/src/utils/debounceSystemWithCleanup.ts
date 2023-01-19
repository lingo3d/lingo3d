import debounceFrame from "./debounceFrame"

const cleanupMap = new WeakMap<any, (() => void) | void>()

export default <T, RestParams extends Array<unknown>>(
    cb: (target: T, ...restParams: RestParams) => (() => void) | void
) => {
    const queued = new Map<T, RestParams>()
    const run = debounceFrame(() => {
        for (const [target, restParams] of queued) {
            cleanupMap.get(target)?.()
            const cleanup = cb(target, ...restParams)
            cleanupMap.set(target, cleanup)
        }
        queued.clear()
    })
    return (item: T, ...restParams: RestParams) => {
        queued.set(item, restParams)
        run()
    }
}
