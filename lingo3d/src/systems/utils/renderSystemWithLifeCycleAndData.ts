import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Appendable from "../../api/core/Appendable"

export default <T, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void,
    onEnterTick: (queued: Map<T, Data>) => void,
    onExitTick: (queued: Map<T, Data>) => void,
    ticker = onBeforeRender
) => {
    const queued = new Map<T, Data>()

    const execute = () => {
        onEnterTick(queued)
        for (const [target, data] of queued) cb(target, data)
        onExitTick(queued)
    }

    let handle: Cancellable | undefined
    const start = () => (handle = ticker(execute))

    const deleteSystem = (item: T) => {
        if (!queued.delete(item)) return
        item instanceof Appendable && item.$deleteSystemSet.delete(deleteSystem)
        queued.size === 0 && handle?.cancel()
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) return
            queued.set(item, data)
            item instanceof Appendable &&
                item.$deleteSystemSet.add(deleteSystem)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
