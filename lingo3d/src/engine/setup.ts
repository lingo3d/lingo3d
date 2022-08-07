import { createEffect } from "@lincode/reactivity"
import settings from "../api/settings"
import Setup from "../display/Setup"
import { setupDefaults } from "../interface/ISetup"
import { getSetupStack } from "../states/useSetupStack"

export default {}

createEffect(function (this: Setup) {
    const result: Record<string, any> = { ...setupDefaults }
    for (const setup of getSetupStack()) {
        for (const [key, value] of Object.entries(setup.data))
            value !== undefined && (result[key] = value)
        
        console.log(setup.data)
    }

    console.log(result)

    Object.assign(settings, result)

}, [getSetupStack])