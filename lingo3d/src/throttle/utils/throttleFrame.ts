import { addClearBooleanPtrAfterRenderSystem } from "../../systems/configSystems/clearBooleanPtrAfterRenderSystem"

export default <Args extends Array<unknown>, Result>(
    fn: (...args: Args) => Result
) => {
    const scheduledPtr = [false]
    let result: Result
    return (...args: Args) => {
        if (scheduledPtr[0]) return result
        scheduledPtr[0] = true
        addClearBooleanPtrAfterRenderSystem(scheduledPtr)
        return (result = fn(...args))
    }
}
