import { onAfterRender } from "../../events/onAfterRender"

export default <Result>(fn: () => Result) => {
    let scheduled = false
    return () => {
        if (scheduled) return
        scheduled = true
        onAfterRender(() => {
            scheduled = false
            fn()
        }, true)
    }
}
