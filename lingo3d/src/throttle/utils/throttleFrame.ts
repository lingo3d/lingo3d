import { addClearBooleanPtrAfterRenderSystem } from "../../systems/configSystems/clearBooleanPtrAfterRenderSystem"

export default <Args extends Array<unknown>>(fn: (...args: Args) => void) => {
    const scheduledPtr = [false]

    return (...args: Args) => {
        if (scheduledPtr[0]) return
        scheduledPtr[0] = true

        fn(...args)
        addClearBooleanPtrAfterRenderSystem(scheduledPtr)
    }
}
