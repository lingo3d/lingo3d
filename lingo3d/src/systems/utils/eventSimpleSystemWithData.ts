import { Cancellable } from "@lincode/promiselikes"

export default <T, Data extends Record<string, any>, Payload>(
    cb: (target: T, data: Data, payload: Payload) => void,
    ticker: (cb: (payload: Payload) => void) => Cancellable
) => {
    const queued = new Map<T, Data>()

    const execute = (payload: Payload) => {
        for (const [target, data] of queued) cb(target, data, payload)
    }

    let handle: Cancellable | undefined
    const start = () => (handle = ticker(execute))

    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) return
            queued.set(item, data)
            if (queued.size === 1) start()
        },
        (item: T) => {
            if (!queued.delete(item)) return
            queued.size === 0 && handle?.cancel()
        }
    ]
}
