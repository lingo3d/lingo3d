import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import { onDispose } from "../../events/onDispose"

export default <T extends Loaded | VisibleMixin>(
    cb: (target: T) => boolean | undefined,
    dispose: (target: T) => void,
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()
    const disposeQueued = new Set<T>()

    onDispose((target) => {
        if (disposeQueued.has(target as T)) {
            disposeQueued.delete(target as T)
            dispose(target as T)
        }
    })
    const execute = () => {
        for (const target of queued) {
            if (target.done) {
                deleteSystem(target)
                continue
            }
            if ("$loadedObject3d" in target && !target.$loadedObject3d) continue

            cb(target)
                ? disposeQueued.add(target)
                : disposeQueued.delete(target)
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
