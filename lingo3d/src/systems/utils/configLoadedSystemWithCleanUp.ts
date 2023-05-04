import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import Appendable from "../../api/core/Appendable"

export default <T extends MeshAppendable | Loaded | PhysicsObjectManager>(
    cb: (target: T) => void | (() => void)
) => {
    const queued = new Set<T>()
    const cleanupMap = new WeakMap<T, () => void>()

    const execute = () => {
        for (const target of queued) {
            if ("$loadedObject3d" in target && !target.$loadedObject3d) continue
            const prevCleanup = cleanupMap.get(target)
            if (prevCleanup) {
                prevCleanup()
                cleanupMap.delete(target)
            }
            const cleanup = cb(target)
            cleanup && cleanupMap.set(target, cleanup)
            if (queued.delete(target) && queued.size === 0) handle?.cancel()
        }
    }
    let handle: Cancellable | undefined
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        item instanceof Appendable && item.$deleteSystemSet.delete(deleteSystem)
        const prevCleanup = cleanupMap.get(item)
        if (prevCleanup) {
            prevCleanup()
            cleanupMap.delete(item)
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
