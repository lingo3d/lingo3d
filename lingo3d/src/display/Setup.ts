import EventLoopItem from "../api/core/EventLoopItem"
import ISetup, { setupDefaults, setupSchema } from "../interface/ISetup"
import getDefaultValue from "../interface/utils/getDefaultValue"
import {
    pullSetupStack,
    pushSetupStack,
    refreshSetupStack
} from "../states/useSetupStack"

class Setup extends EventLoopItem {
    public static componentName = "setup"
    public static defaults = setupDefaults
    public static schema = setupSchema

    public constructor() {
        super()
        pushSetupStack(this)
        this.then(() => pullSetupStack(this))
    }
}
for (const key of Object.keys(setupSchema)) {
    Object.defineProperty(Setup.prototype, key, {
        get() {
            return this["_" + key] ?? getDefaultValue(setupDefaults, key)
        },
        set(value) {
            this["_" + key] = value
            refreshSetupStack()
        }
    })
}
interface Setup extends EventLoopItem, ISetup {}
export default Setup
