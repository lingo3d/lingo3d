import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void | (() => void),
    check: (target: T, data: Data) => boolean,
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Map<T, Data>()
    const cleanupMap = new WeakMap<T, () => void>()

    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(() => {
            for (const [target, data] of queued) {
                const prevCleanup = cleanupMap.get(target)
                if (prevCleanup) {
                    prevCleanup()
                    cleanupMap.delete(target)
                }
                const cleanup = cb(target, data)
                cleanup && cleanupMap.set(target, cleanup)
            }
            queued.clear()
            started = false
        }, true)
    }

    return <const>[
        (item: T, data: Data) => {
            if (!check(item, data)) return
            start()
            queued.set(item, data)
        },
        (item: T) => {
            const prevCleanup = cleanupMap.get(item)
            if (prevCleanup) {
                prevCleanup()
                cleanupMap.delete(item)
            }
            queued.delete(item)
        }
    ]
}
