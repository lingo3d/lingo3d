import { createEffect } from "@lincode/reactivity"
import { finalSetup } from "../api/settings"
import Setup from "../display/Setup"
import { setupDefaults } from "../interface/ISetup"
import NullableDefault from "../interface/utils/NullableDefault"
import { getSetupStack } from "../states/useSetupStack"
import setupStruct from "./setupStruct"

export default {}

const setupDefaultsMapped = Object.fromEntries(
    Object.entries(setupDefaults).map(([key, value]) => [
        key,
        value instanceof NullableDefault ? undefined : value
    ])
)

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
