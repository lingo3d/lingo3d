import setupStruct from "../engine/setupStruct"
import ISetup, { setupSchema } from "../interface/ISetup"
import { AutoMount, getAutoMount, setAutoMount } from "../states/useAutoMount"
import { refreshSetupStack } from "../states/useSetupStack"

const settings: Partial<ISetup> & { autoMount: AutoMount } = {
    get autoMount() {
        return getAutoMount()
    },
    set autoMount(value) {
        setAutoMount(value)
    }
}
export default settings

export const finalSetup: Record<string, any> = {}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(settings, key, {
        get() {
            // @ts-ignore
            return setupStruct[key]
        },
        set(value) {
            finalSetup[key] = value
            refreshSetupStack()
        },
        enumerable: true
    })
