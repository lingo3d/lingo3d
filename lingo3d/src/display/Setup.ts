import Appendable from "../api/core/Appendable"
import ISetup, { setupDefaults, setupSchema } from "../interface/ISetup"
import {
    pullSetupStack,
    pushSetupStack,
    refreshSetupStack
} from "../states/useSetupStack"

class Setup extends Appendable {
    public static componentName = "setup"
    public static defaults = setupDefaults
    public static schema = setupSchema

    protected data: Partial<ISetup> = {}

    public constructor() {
        super()
        pushSetupStack(this.data)
        this.then(() => pullSetupStack(this.data))
    }
}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(Setup.prototype, key, {
        get() {
            return this.data[key]
        },
        set(value) {
            this.data[key] = value
            refreshSetupStack()
        }
    })
interface Setup extends Appendable, ISetup {}
export default Setup
