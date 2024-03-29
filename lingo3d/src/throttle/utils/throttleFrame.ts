import { clearBooleanPtrEffectSystem } from "../../systems/configSystems/clearBooleanPtrEffectSystem"

export default <Result>(fn: () => Result) => {
    const scheduledPtr = [false]
    let result: Result
    return () => {
        if (scheduledPtr[0]) return result
        scheduledPtr[0] = true
        clearBooleanPtrEffectSystem.add(scheduledPtr)
        return (result = fn())
    }
}
