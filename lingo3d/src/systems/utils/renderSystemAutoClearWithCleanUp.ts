import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object>(
    cb: (target: T) => void | (() => void),
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()
    const cleanupMap = new WeakMap<T, () => void>()
    ticker(() => {
        for (const target of queued) {
            if (cleanupMap.has(target)) {
                cleanupMap.get(target)!()
                cleanupMap.delete(target)
            }
            const cleanup = cb(target)
            cleanup && cleanupMap.set(target, cleanup)
        }
        queued.clear()
    })
    return <const>[
        (item: T) => void queued.add(item),
        (item: T) => {
            if (cleanupMap.has(item)) {
                cleanupMap.get(item)!()
                cleanupMap.delete(item)
            }
            queued.delete(item)
        }
    ]
}
