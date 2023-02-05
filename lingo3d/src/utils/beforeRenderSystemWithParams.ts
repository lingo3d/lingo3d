import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../events/onBeforeRender"

export default <T, RestParams extends Array<unknown>>(
    cb: (target: T, ...restParams: RestParams) => void
) => {
    const queued = new Map<T, RestParams>()

    let handle: Cancellable | undefined
    const start = () => {
        handle = onBeforeRender(() => {
            for (const [target, restParams] of queued) cb(target, ...restParams)
        })
    }
    return <const>[
        (item: T, ...restParams: RestParams) => {
            if (queued.has(item)) return
            queued.set(item, restParams)
            if (queued.size === 1) start()
        },
        (item: T) => {
            if (queued.delete(item) && queued.size === 0) handle?.cancel()
        }
    ]
}
