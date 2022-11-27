import setupStruct from "../engine/setupStruct"
import ISetup, { setupSchema } from "../interface/ISetup"
import { AutoMount, getAutoMount, setAutoMount } from "../states/useAutoMount"
import {
    getFirstLoadBeforeRender,
    setFirstLoadBeforeRender
} from "../states/useFirstLoadBeforeRender"
import { refreshSetupStack } from "../states/useSetupStack"
import unsafeGetValue from "../utils/unsafeGetValue"

const settings: Partial<ISetup> & {
    autoMount: AutoMount
    firstLoadBeforeRender: boolean
} = {
    get autoMount() {
        return getAutoMount()
    },
    set autoMount(value) {
        setAutoMount(value)
    },

    get firstLoadBeforeRender() {
        return getFirstLoadBeforeRender()
    },
    set firstLoadBeforeRender(value) {
        setFirstLoadBeforeRender(value)
    }
}
export default settings

export const finalSetup: Record<string, any> = {}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(settings, key, {
        get() {
            return unsafeGetValue(setupStruct, key)
        },
        set(value) {
            finalSetup[key] = value
            refreshSetupStack()
        },
        enumerable: true
    })
