import { onAfterRender } from "../../events/onAfterRender"

export default <Args extends Array<unknown>, Result>(
    fn: (...args: Args) => Result
) => {
    let scheduled = false
    let latestArgs: Args
    return (...args: Args) => {
        latestArgs = args
        if (scheduled) return
        scheduled = true
        onAfterRender(() => {
            scheduled = false
            fn(...latestArgs)
        }, true)
    }
}
