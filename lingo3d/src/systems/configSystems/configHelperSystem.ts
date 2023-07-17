import MeshAppendable from "../../display/core/MeshAppendable"
import { worldModePtr } from "../../pointers/worldModePtr"
import createInternalSystem from "../utils/createInternalSystem"

export const configHelperSystem = createInternalSystem("configHelperSystem", {
    data: { helper: undefined as MeshAppendable | undefined },
    effect: (
        self: MeshAppendable & { $createHelper: () => MeshAppendable },
        data
    ) => {
        if (worldModePtr[0] !== "editor" || self.$disableSceneGraph) {
            data.helper = undefined
            return false
        }
        data.helper = self.$createHelper()
    },
    cleanup: (_, data) => {
        data.helper!.dispose()
    }
})
