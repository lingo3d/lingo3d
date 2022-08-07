import ISetup, { setupSchema } from "../interface/ISetup"
import { refreshSetupStack } from "../states/useSetupStack"

const settings: Partial<ISetup> = {}
export default settings

const data: Record<string, any> = {}
for (const key of Object.keys(setupSchema))
    Object.defineProperty(settings, key, {
        get() {
            return data[key]
        },
        set(value) {
            data[key] = value
            refreshSetupStack()
        },
        enumerable: true
    })
