import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Appendable from "../../display/core/Appendable"

export default <T, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void,
    compare: (a: T, b: T) => number
) => {
    const queued = new Map<T, Data>()

    const execute = () => {
        for (const target of [...queued.keys()].sort(compare))
            cb(target, queued.get(target)!)
    }

    let handle: Cancellable | undefined
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        if (!queued.delete(item)) return
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
