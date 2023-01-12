import setupStruct from "../engine/setupStruct"
import ISetup, { setupSchema } from "../interface/ISetup"
import { refreshSetupStack } from "../states/useSetupStack"
import unsafeGetValue from "../utils/unsafeGetValue"

const settings: Partial<ISetup> = {}
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
