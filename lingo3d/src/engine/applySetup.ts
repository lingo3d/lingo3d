import { createEffect } from "@lincode/reactivity"
import { finalSetup } from "../api/settings"
import Setup from "../display/Setup"
import { setupDefaults } from "../interface/ISetup"
import { getSetupStack } from "../states/useSetupStack"
import setupStruct from "./setupStruct"

export default {}

createEffect(
    function (this: Setup) {
        const result: Record<string, any> = {}
        for (const obj of [setupDefaults, ...getSetupStack(), finalSetup])
            for (const [key, value] of Object.entries(obj))
                value !== undefined && (result[key] = value)

        Object.assign(setupStruct, result)
    },
    [getSetupStack]
)
