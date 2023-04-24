import { onBeforeRender } from "../../events/onBeforeRender"
import { onDispose } from "../../events/onDispose"

export default <T extends object>(
    cb: (target: T) => boolean | undefined,
    dispose: (target: T) => void,
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()
    const disposeQueued = new Set<object>()

    onDispose((item) => {
        if (!disposeQueued.has(item)) return
        disposeQueued.delete(item)
        dispose(item as T)
    })
    const execute = () => {
        for (const target of queued)
            cb(target)
                ? disposeQueued.add(target)
                : disposeQueued.delete(target)
        queued.clear()
        started = false
    }
    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(execute, true)
    }
    return <const>[
        (item: T) => {
            start()
            queued.add(item)
        },
        (item: T) => void queued.delete(item)
    ]
}
