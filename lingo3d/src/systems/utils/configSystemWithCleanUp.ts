import { assert } from "@lincode/utils"
import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends object>(
    cb: (target: T) => void | (() => void),
    ticker:
        | [() => Promise<void>]
        | typeof onBeforeRender
        | typeof queueMicrotask = queueMicrotask
) => {
    const queued = new Set<T>()
    const cleanupMap = new WeakMap<T, () => void>()

    const execute = () => {
        for (const target of queued) {
            //@ts-ignore
            assert(!target.done)
            const prevCleanup = cleanupMap.get(target)
            if (prevCleanup) {
                prevCleanup()
                cleanupMap.delete(target)
            }
            const cleanup = cb(target)
            cleanup && cleanupMap.set(target, cleanup)
        }
        queued.clear()
        started = false
    }

    let started = false
    const start = () => {
        if (started) return
        started = true
        if (Array.isArray(ticker)) ticker[0]().then(execute)
        else ticker(execute, true)
    }

    return <const>[
        (item: T) => {
            start()
            queued.add(item)
        },
        (item: T) => {
            const prevCleanup = cleanupMap.get(item)
            if (prevCleanup) {
                prevCleanup()
                cleanupMap.delete(item)
            }
            queued.delete(item)
        }
    ]
}
