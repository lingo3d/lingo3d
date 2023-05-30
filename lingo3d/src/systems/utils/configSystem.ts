import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"

export default <T extends Appendable>(cb: (target: T) => void) => {
    const queued = new Set<T>()

    const execute = () => {
        for (const target of queued) !target.done && cb(target)
        queued.clear()
        started = false
    }

    let started = false
    const start = () => {
        if (started) return
        started = true
        onBeforeRender(execute, true)
    }

    return <const>[
        (item: T) => {
            start()
            queued.add(item)
        },
        (item: T) => void queued.delete(item)
    ]
}
