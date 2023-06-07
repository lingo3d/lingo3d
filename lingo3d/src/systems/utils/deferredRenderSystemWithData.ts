import { Cancellable } from "@lincode/promiselikes"
import { onBeforeRender } from "../../events/onBeforeRender"
import type Appendable from "../../display/core/Appendable"

export default <T extends Appendable, Data extends Record<string, any>>(
    name: string,
    cb: (target: T, data: Data) => boolean
) => {
    const queued = new Map<T, Data>()
    const processed = new Map<T, Data>()

    const execute = () => {
        if (processed.size === 0)
            for (const [target, data] of queued) processed.set(target, data)

        for (const [target, data] of processed) {
            processed.delete(target)
            if (cb(target, data)) break
        }
    }

    let handle: Cancellable | undefined
    const start = () => (handle = onBeforeRender(execute))

    const deleteSystem = (item: T) => {
        if (!queued.delete(item)) return
        processed.delete(item)
        item.$systems.delete(name)
        queued.size === 0 && handle?.cancel()
    }
    const system = {
        name,
        add: (item: T, data: Data) => {
            if (queued.has(item)) {
                queued.set(item, data)
                return
            }
            queued.set(item, data)
            item.$systems.set(name, system)
            if (queued.size === 1) start()
        },
        delete: deleteSystem,
        dispose: () => {
            for (const [item] of queued) deleteSystem(item)
        },
        get queued() {
            return [...queued.keys()]
        }
    }
    return system
}
