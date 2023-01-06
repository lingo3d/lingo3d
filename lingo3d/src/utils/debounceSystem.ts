import { debounceTrailing } from "@lincode/utils"

export default <T, RestParams extends Array<unknown>>(
    cb: (target: T, ...restParams: RestParams) => void
) => {
    const queued = new Map<T, RestParams>()
    const run = debounceTrailing(() => {
        for (const [target, restParams] of queued) cb(target, ...restParams)
        queued.clear()
    })
    return (item: T, ...restParams: RestParams) => {
        queued.set(item, restParams)
        run()
    }
}
