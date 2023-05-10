import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import Appendable from "../../api/core/Appendable"

export default <T extends MeshAppendable | Loaded | PhysicsObjectManager>(
    cb: (target: T) => void,
    cleanup: (target: T) => void
) => {
    const queued = new Set<T>()
    const needsCleanUp = new WeakSet<T>()

    const execute = () => {
        for (const target of queued) {
            if ("$loadedObject3d" in target && !target.$loadedObject3d) continue
            needsCleanUp.has(target) && cleanup(target)
            needsCleanUp.add(target)
            cb(target)
            if (queued.delete(target) && queued.size === 0) handle?.cancel()
        }
    }
    let handle: Cancellable | undefined
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        item instanceof Appendable && item.$deleteSystemSet.delete(deleteSystem)
        if (needsCleanUp.has(item)) {
            cleanup(item)
            needsCleanUp.delete(item)
        }
        if (queued.delete(item) && queued.size === 0) handle?.cancel()
    }
    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            item instanceof Appendable &&
                item.$deleteSystemSet.add(deleteSystem)
            if (queued.size === 1) start()
        },
        deleteSystem
    ]
}
