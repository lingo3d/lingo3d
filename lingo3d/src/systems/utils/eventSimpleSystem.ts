import { Cancellable } from "@lincode/promiselikes"

export default <T, Payload>(
    cb: (target: T, payload: Payload) => void,
    ticker: (cb: (payload: Payload) => void) => Cancellable
) => {
    const queued = new Set<T>()

    const execute = (payload: Payload) => {
        for (const target of queued) cb(target, payload)
    }

    let handle: Cancellable | undefined
    const start = () => (handle = ticker(execute))

    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            if (queued.size === 1) start()
        },
        (item: T) => {
            if (!queued.delete(item)) return
            queued.size === 0 && handle?.cancel()
        }
    ]
}
