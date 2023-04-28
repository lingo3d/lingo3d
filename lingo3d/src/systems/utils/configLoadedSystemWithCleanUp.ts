import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { assert } from "@lincode/utils"

export default <T extends MeshAppendable | Loaded | PhysicsObjectManager>(
    cb: (target: T) => void | (() => void),
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()
    const cleanupMap = new WeakMap<T, () => void>()

    const execute = () => {
        for (const target of queued) {
            assert(!target.done)
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
    const start = () => {
        handle = ticker(execute)
    }
    return <const>[
        (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            if (queued.size === 1) start()
        },
        (item: T) => {
            const prevCleanup = cleanupMap.get(item)
            if (prevCleanup) {
                prevCleanup()
                cleanupMap.delete(item)
            }
            if (queued.delete(item) && queued.size === 0) handle?.cancel()
        }
    ]
}
