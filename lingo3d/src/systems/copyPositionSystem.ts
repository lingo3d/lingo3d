import MeshAppendable from "../display/core/MeshAppendable"
import getWorldPosition from "../memo/getWorldPosition"
import createInternalSystem from "./utils/createInternalSystem"

export const copyPositionSystem = createInternalSystem("copyPositionSystem", {
    data: {} as { target: MeshAppendable },
    update: (manager: MeshAppendable, data) => {
        manager.position.copy(getWorldPosition(data.target.object3d))
    }
})
