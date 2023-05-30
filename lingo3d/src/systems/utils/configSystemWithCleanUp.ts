import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object>(
    cb: (target: T) => void | (() => void),
    ticker:
        | [() => Promise<void>]
        | typeof onBeforeRender
        | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()
    const cleanupMap = new WeakMap<T, () => void>()

    const execute = () => {
        for (const target of queued) {
            const prevCleanup = cleanupMap.get(target)
            if (prevCleanup) {
                prevCleanup()
                cleanupMap.delete(target)
            }
            const cleanup = cb(target)
            cleanup && cleanupMap.set(target, cleanup)
        }
        queued.clear()
        started = false
    }

    let started = false
    const start = () => {
        if (started) return
        started = true
        if (Array.isArray(ticker)) ticker[0]().then(execute)
        else ticker(execute, true)
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
        (item: T) => {
            if (queued.has(item)) return
            start()
            queued.add(item)
            item instanceof Appendable &&
                item.$deleteSystemSet.add(deleteSystem)
        },
        deleteSystem
    ]
}
