import Appendable from "../api/core/Appendable"
import ISetup, { setupDefaults, setupSchema } from "../interface/ISetup"
import {
    pullSetupStack,
    pushSetupStack,
    refreshSetupStack
} from "../states/useSetupStack"

export const dataSetupMap = new WeakMap<Partial<ISetup>, Setup>()

class Setup extends Appendable {
    public static componentName = "setup"
    public static defaults = setupDefaults
    public static schema = setupSchema

    protected data: Partial<ISetup> = {}

    public constructor(protected noEffect?: boolean) {
        super()
        if (noEffect) return
        pushSetupStack(this.data)
        this.then(() => pullSetupStack(this.data))
        dataSetupMap.set(this.data, this)
    }
}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(Setup.prototype, key, {
        get() {
            return this.data[key]
        },
        set(value) {
            this.data[key] = value
            !this.noEffect && refreshSetupStack()
        }
    })
interface Setup extends Appendable, ISetup {}
export default Setup
