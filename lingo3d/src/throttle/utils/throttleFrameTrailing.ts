import { addAfterRenderSystem } from "../../systems/configSystems/afterRenderSystem"

export default <Args extends Array<unknown>>(fn: (...args: Args) => void) => {
    let scheduled = false
    let latestArgs: Args

    return (...args: Args) => {
        latestArgs = args

        if (scheduled) return
        scheduled = true

        addAfterRenderSystem(() => {
            scheduled = false
            fn(...latestArgs)
        })
    }
}
