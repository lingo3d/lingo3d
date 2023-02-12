import { onAfterRender } from "../events/onAfterRender"

export default <Args extends Array<unknown>, Result>(
    fn: (...args: Args) => Result
) => {
    let scheduled = false
    let latestArgs: Args
    let result: Result

    return (...args: Args) => {
        latestArgs = args

        if (scheduled) return result
        scheduled = true

        result = fn(...latestArgs)

        const handle = onAfterRender(() => {
            handle.cancel()
            scheduled = false
        })
        return result
    }
}
