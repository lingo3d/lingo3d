import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import Loaded from "../../display/core/Loaded"
import { onDispose } from "../../events/onDispose"

export default <T extends Loaded>(
    cb: (target: T) => boolean | undefined,
    dispose: (target: T) => void,
    ticker = onBeforeRender
) => {
    const queued = new Set<T>()
    const disposeQueued = new Set<object>()

    onDispose((item) => {
        if (!disposeQueued.has(item)) return
        disposeQueued.delete(item)
        queued.delete(item as T)
        dispose(item as T)
    })
    const execute = () => {
        for (const target of queued) {
            if (!target.$loadedObject3d) continue
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
