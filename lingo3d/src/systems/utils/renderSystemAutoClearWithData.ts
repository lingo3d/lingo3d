import { onBeforeRender } from "../../events/onBeforeRender"

export default <T, Data extends Record<string, any>>(
    cb: (target: T, data: Data) => void,
    ticker = onBeforeRender
) => {
    const queued = new Map<T, Data>()
    ticker(() => {
        for (const [target, data] of queued) cb(target, data)
        queued.clear()
    })
    return <const>[
        (item: T, data: Data) => void queued.set(item, data),
        (item: T) => void queued.delete(item)
    ]
}
