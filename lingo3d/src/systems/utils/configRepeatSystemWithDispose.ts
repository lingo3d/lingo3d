import { Cancellable } from "@lincode/promiselikes"
import Appendable from "../../api/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onDispose } from "../../events/onDispose"

export default <T extends Appendable>(
    cb: (target: T) => boolean | undefined,
    dispose: (target: T) => void,
    repeatTicker: (cb: () => void) => Cancellable,
    ticker: typeof onBeforeRender | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()
    const disposeQueued = new Set<Appendable>()
    const alive = new Set<T>()

    onDispose((target) => {
        alive.delete(target as T)
        if (disposeQueued.has(target)) {
            disposeQueued.delete(target)
            dispose(target as T)
        }
    })
    const execute = () => {
        for (const target of queued) {
            //@ts-ignore
            if (target.done) continue
            cb(target)
                ? disposeQueued.add(target)
                : disposeQueued.delete(target)
        }
        queued.clear()
        started = false
    }
    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(execute, true)
    }
    repeatTicker(() => {
        start()
        for (const item of alive) queued.add(item)
    })

    return <const>[
        (item: T) => {
            start()
            queued.add(item)
            alive.add(item)
        },
        (item: T) => {
            queued.delete(item)
            alive.delete(item)
        }
    ]
}
