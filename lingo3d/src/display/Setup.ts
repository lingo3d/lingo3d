import Appendable from "../api/core/Appendable"
import setupStruct from "../engine/setupStruct"
import ISetup, { setupDefaults, setupSchema } from "../interface/ISetup"
import unsafeGetValue from "../utils/unsafeGetValue"
import unsafeSetValue from "../utils/unsafeSetValue"

let setup: Setup | undefined
const setupStructDefaults = { ...setupStruct }

class Setup extends Appendable {
    public static componentName = "setup"
    public static defaults = setupDefaults
    public static schema = setupSchema

    public constructor() {
        super()
        setup?.dispose()
        setup = this
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        setup = undefined
        Object.assign(setupStruct, setupStructDefaults)
        return this
    }
}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(Setup.prototype, key, {
        get() {
            return unsafeGetValue(setupStruct, key)
        },
        set(value) {
            unsafeSetValue(setupStruct, key, value)
        }
    })
interface Setup extends Appendable, ISetup {}
export default Setup
