import { onBeforeRender } from "../../events/onBeforeRender"

export default (
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Map<Function, Array<unknown>>()

    const execute = () => {
        for (const [cb, args] of queued) cb(...args)
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
        <Args extends Array<unknown>>(
            item: (...args: Args) => void,
            args: Args
        ) => {
            start()
            queued.set(item, args)
        },
        (item: () => void) => void queued.delete(item)
    ]
}
