import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Appendable from "../../api/core/Appendable"

export default <T extends Appendable, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => boolean,
    ticker = onBeforeRender
) => {
    const queued = new Map<T, Data>()
    const processed = new Map<T, Data>()

    const execute = () => {
        if (processed.size === 0)
            for (const [target, data] of queued) processed.set(target, data)

        for (const [target, data] of processed) {
            processed.delete(target)
            if (cb(target, data)) break
        }
    }

    let handle: Cancellable | undefined
    const start = () => {
        handle = ticker(execute)
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) return
            queued.set(item, data)
            if (queued.size === 1) start()
        },
        (item: T) => {
            processed.delete(item)
            if (queued.delete(item) && queued.size === 0) handle?.cancel()
        }
    ]
}
