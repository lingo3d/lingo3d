import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object>(
    cb: (target: T) => void,
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()

    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(() => {
            for (const target of queued) {
                //@ts-ignore
                if (target.done) continue
                cb(target)
            }
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
