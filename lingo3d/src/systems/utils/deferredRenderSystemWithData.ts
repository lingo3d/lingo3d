import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Appendable from "../../display/core/Appendable"

export default <T extends Appendable, Data extends Record<string, any>>(
    name: string,
    cb: (target: T, data: Data) => boolean
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
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        if (!queued.delete(item)) return
        processed.delete(item)
        item instanceof Appendable && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) {
                queued.set(item, data)
                return
            }
            queued.set(item, data)
            item instanceof Appendable &&
                item.$deleteSystemSet.add(deleteSystem)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
