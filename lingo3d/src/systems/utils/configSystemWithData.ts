import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void,
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Map<T, Data>()

    const execute = () => {
        for (const [target, data] of queued) {
            //@ts-ignore
            if (target.done) continue
            cb(target, data)
        }
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
        (item: T, data: Data) => {
            start()
            queued.set(item, data)
        },
        (item: T) => void queued.delete(item)
    ]
}
