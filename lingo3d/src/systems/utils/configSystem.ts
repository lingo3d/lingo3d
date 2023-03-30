import { onBeforeRender } from "../../events/onBeforeRender"

export default <T>(
    cb: (target: T) => void,
    ticker: typeof onBeforeRender | typeof queueMicrotask = onBeforeRender
) => {
    const queued = new Set<T>()

    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(() => {
            for (const target of queued) cb(target)
            queued.clear()
            started = false
        }, true)
    }

    return <const>[
        (item: T) => {
            start()
            queued.add(item)
        },
        (item: T) => void queued.delete(item)
    ]
}
