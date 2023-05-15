import setupStruct from "./setupStruct"
import ISetup, { setupSchema } from "../../interface/ISetup"
import { AutoMount, getAutoMount, setAutoMount } from "../../states/useAutoMount"
import unsafeGetValue from "../../utils/unsafeGetValue"
import unsafeSetValue from "../../utils/unsafeSetValue"

const settings = {
    get autoMount() {
        return getAutoMount()
    },
    set autoMount(value) {
        setAutoMount(value)
    }
} as ISetup & {
    autoMount: AutoMount
}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(settings, key, {
        get() {
            return unsafeGetValue(setupStruct, key)
        },
        set(value) {
            unsafeSetValue(setupStruct, key, value)
        }
    })

export default settings
