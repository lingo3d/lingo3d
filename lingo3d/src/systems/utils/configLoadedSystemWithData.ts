import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import MeshAppendable from "../../api/core/MeshAppendable"

export default <
    T extends MeshAppendable | Loaded,
    Data extends Record<string, any>
>(
    cb: (target: T, data: Data) => void,
    ticker = onBeforeRender
) => {
    const queued = new Map<T, Data>()

    const execute = () => {
        for (const [target, data] of queued) {
            if (target.done) {
                deleteSystem(target)
                continue
            }
            if ("$loadedObject3d" in target && !target.$loadedObject3d) continue
            cb(target, data)
            deleteSystem(target)
        }
    }
    let handle: Cancellable | undefined
    const start = () => {
        handle = ticker(execute)
    }
    const deleteSystem = (item: T) => {
        if (queued.delete(item) && queued.size === 0) handle?.cancel()
    }
    return <const>[
        (item: T, data: Data) => {
            if (queued.has(item)) return
            queued.set(item, data)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
