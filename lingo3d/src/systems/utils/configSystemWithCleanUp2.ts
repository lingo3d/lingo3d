import Appendable from "../../api/core/Appendable"

export default <T extends object>(
    cb: (target: T) => void | false,
    cleanup: (target: T) => void,
    ticker: [() => Promise<void>] | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()
    const needsCleanUp = new WeakSet<T>()

    const execute = () => {
        for (const target of queued) {
            if (needsCleanUp.has(target)) {
                cleanup(target)
                needsCleanUp.delete(target)
            }
            cb(target) !== false && needsCleanUp.add(target)
        }
        queued.clear()
        started = false
    }

    let started = false
    const start = () => {
        if (started) return
        started = true
        if (Array.isArray(ticker)) ticker[0]().then(execute)
        else ticker(execute)
    }

    const deleteSystem = (item: T) => {
        item instanceof Appendable && item.$deleteSystemSet.delete(deleteSystem)
        if (needsCleanUp.has(item)) {
            cleanup(item)
            needsCleanUp.delete(item)
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
