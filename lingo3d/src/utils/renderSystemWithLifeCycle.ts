import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../events/onBeforeRender"

export default <T>(
    cb?: (target: T) => void,
    init?: (data: Set<T>) => void,
    finish?: (data: Set<T>) => void,
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()

    let handle: Cancellable | undefined
    const start = () => {
        handle = ticker(() => {
            init!(queued)
            for (const target of queued) cb!(target)
            finish!(queued)
        })
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
