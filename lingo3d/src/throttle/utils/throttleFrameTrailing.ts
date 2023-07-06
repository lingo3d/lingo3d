import { onAfterRender } from "../../events/onAfterRender"

export default <Args extends Array<unknown>, Result>(
    fn: (...args: Args) => Result
) => {
    let scheduled = false
    return (...args: Args) => {
        if (scheduled) return
        scheduled = true
        onAfterRender(() => {
            scheduled = false
            fn(...args)
        }, true)
    }
}
