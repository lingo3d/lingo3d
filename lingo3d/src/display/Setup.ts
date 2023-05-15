import Appendable from "./core/Appendable"
import setupStruct from "../api/settings/setupStruct"
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
        this.$disableSceneGraph = true
        setup?.dispose()
        setup = this
    }

    protected override disposeNode() {
        super.disposeNode()
        setup = undefined
        Object.assign(setupStruct, setupStructDefaults)
    }
}
for (const key of Object.keys(setupSchema))
    key !== "uuid" &&
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

export const defaultSetup = new Setup()
