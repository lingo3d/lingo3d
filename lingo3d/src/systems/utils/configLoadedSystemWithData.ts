import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import Appendable from "../../display/core/Appendable"

export default <
    T extends object | Appendable | Loaded,
    Data extends Record<string, any>
>(
    cb: (target: T, data: Data) => void
) => {
    const queued = new Map<T, Data>()

    const execute = () => {
        for (const [target, data] of queued) {
            if (target instanceof Appendable && target.done) {
                deleteSystem(target)
                continue
            }
            if (target instanceof Loaded && !target.$loadedObject3d) continue
            cb(target, data)
            deleteSystem(target)
        }
    }
    let handle: Cancellable | undefined
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        if (queued.delete(item) && queued.size === 0) handle?.cancel()
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) {
                queued.set(item, data)
                return
            }
            queued.set(item, data)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
