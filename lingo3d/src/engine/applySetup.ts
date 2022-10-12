import { createEffect } from "@lincode/reactivity"
import { finalSetup } from "../api/settings"
import Setup from "../display/Setup"
import { setupDefaults } from "../interface/ISetup"
import getDefaultValue from "../interface/utils/getDefaultValue"
import { getSetupStack } from "../states/useSetupStack"
import setupStruct from "./setupStruct"

const setupDefaultsMapped: Record<string, any> = {}
for (const key of Object.keys(setupDefaults))
    setupDefaultsMapped[key] = getDefaultValue(setupDefaults, key)

createEffect(
    function (this: Setup) {
        const result: Record<string, any> = {}
        for (const obj of [setupDefaultsMapped, ...getSetupStack(), finalSetup])
            for (const [key, value] of Object.entries(obj))
                value !== undefined && (result[key] = value)

        Object.assign(setupStruct, result)
    },
    [getSetupStack]
)
