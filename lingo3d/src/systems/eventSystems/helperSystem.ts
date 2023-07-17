import MeshAppendable from "../../display/core/MeshAppendable"
import { onWorldMode } from "../../events/onWorldMode"
import { configHelperSystem } from "../configSystems/configHelperSystem"
import createInternalSystem from "../utils/createInternalSystem"

export const helperSystem = createInternalSystem("helperSystem", {
    update: (
        self: MeshAppendable & { $createHelper: () => MeshAppendable }
    ) => {
        configHelperSystem.add(self)
    },
    updateTicker: onWorldMode
})
