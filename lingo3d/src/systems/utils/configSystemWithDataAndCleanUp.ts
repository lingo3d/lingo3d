import Appendable from "../../api/core/Appendable"

export default <T extends object, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void | (() => void)
) => {
    const queued = new Map<T, Data>()
    const cleanupMap = new WeakMap<T, () => void>()

    const execute = () => {
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
    }

    let started = false
    const start = () => {
        if (started) return
        started = true
        queueMicrotask(execute)
    }

    const deleteSystem = (item: T) => {
        item instanceof Appendable && item.$deleteSystemSet.delete(deleteSystem)
        const prevCleanup = cleanupMap.get(item)
        if (prevCleanup) {
            prevCleanup()
            cleanupMap.delete(item)
        }
        queued.delete(item)
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) {
                queued.set(item, data)
                return
            }
            start()
            queued.set(item, data)
            item instanceof Appendable &&
                item.$deleteSystemSet.add(deleteSystem)
        },
        deleteSystem
    ]
}
