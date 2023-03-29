import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"

export default <T, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void,
    ticker = onBeforeRender
) => {
    const queued = new Map<T, Data>()

    let handle: Cancellable | undefined
    const start = () => {
        handle = ticker(() => {
            for (const [target, data] of queued) cb(target, data)
        })
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) return
            queued.set(item, data)
            if (queued.size === 1) start()
        },
        (item: T) => {
            if (queued.delete(item) && queued.size === 0) handle?.cancel()
        }
    ]
}
