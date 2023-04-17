import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"

export default <T>(cb: (target: T) => void, ticker = onBeforeRender) => {
    const queued = new Set<T>()

    const execute = () => {
        for (const target of queued) cb(target)
    }

    let handle: Cancellable | undefined
    const start = () => {
        handle = ticker(execute)
    }
    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            if (queued.size === 1) start()
        },
        (item: T) => {
            if (queued.delete(item) && queued.size === 0) handle?.cancel()
        }
    ]
}
