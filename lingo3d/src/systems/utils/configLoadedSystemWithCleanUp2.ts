import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import Appendable from "../../display/core/Appendable"

export default <T extends Appendable | Loaded>(
    cb: (target: T) => void | false,
    cleanup: (target: T) => void
) => {
    const queued = new Set<T>()
    const needsCleanUp = new WeakSet<T>()

    const execute = () => {
        for (const target of queued) {
            if (target instanceof Loaded && !target.$loadedObject3d) continue
            if (needsCleanUp.has(target)) {
                cleanup(target)
                needsCleanUp.delete(target)
            }
            cb(target) !== false && needsCleanUp.add(target)
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
