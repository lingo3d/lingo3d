import { onAfterRender } from "../events/onAfterRender"

export default <Args extends Array<unknown>>(fn: (...args: Args) => void) => {
    let scheduled = false
    let latestArgs: Args

    return (...args: Args) => {
        latestArgs = args

        if (scheduled) return
        scheduled = true

        fn(...latestArgs)

        const handle = onAfterRender(() => {
            handle.cancel()
            scheduled = false
        })
    }
}
