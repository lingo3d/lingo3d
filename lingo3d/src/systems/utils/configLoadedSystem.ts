import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"

export default <T extends MeshAppendable | Loaded | PhysicsObjectManager>(
    cb: (target: T) => void,
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()

    const execute = () => {
        for (const target of queued) {
            if (target.done) {
                deleteSystem(target)
                continue
            }
            if ("$loadedObject3d" in target && !target.$loadedObject3d) continue

            cb(target)
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
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
