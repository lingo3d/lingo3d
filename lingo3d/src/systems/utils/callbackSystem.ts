import { onBeforeRender } from "../../events/onBeforeRender"

export default (
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<() => void>()

    const execute = () => {
        for (const cb of queued) cb()
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
        (item: () => void) => {
            start()
            queued.add(item)
        },
        (item: () => void) => void queued.delete(item)
    ]
}
