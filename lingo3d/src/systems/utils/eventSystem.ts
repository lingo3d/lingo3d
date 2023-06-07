import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"

export default <T extends Appendable, Payload>(
    name: string,
    cb: (target: T, payload: Payload) => void,
    ticker: (cb: (payload: Payload) => void) => Cancellable
) => {
    const queued = new Set<T>()

    const execute = (payload: Payload) => {
        for (const target of queued) cb(target, payload)
    }

    let handle: Cancellable | undefined
    const start = () => (handle = ticker(execute))

    const deleteSystem = (item: T) => {
        if (!queued.delete(item)) return
        item.$systems.delete(name)
        queued.size === 0 && handle?.cancel()
    }
    const system = {
        name,
        add: (item: T) => {
            if (queued.has(item)) return
            queued.add(item)
            item.$systems.set(name, system)
            if (queued.size === 1) start()
        },
        delete: deleteSystem,
        dispose: () => {
            for (const item of queued) deleteSystem(item)
        }
    }
    return system
}
