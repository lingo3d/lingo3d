import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import Appendable from "../../display/core/Appendable"

export default <T extends Appendable | Loaded>(cb: (target: T) => void) => {
    const queued = new Set<T>()

    const execute = () => {
        for (const target of queued) {
            if (target.done) {
                deleteSystem(target)
                continue
            }
            if (target instanceof Loaded && !target.$loadedObject3d) continue
            cb(target)
            deleteSystem(target)
        }
    }
    let handle: Cancellable | undefined
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        if (queued.delete(item) && queued.size === 0) handle?.cancel()
    }
    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
