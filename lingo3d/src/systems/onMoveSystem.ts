import { positionChanged } from "../memo/positionChanged"
import MeshAppendable from "../display/core/MeshAppendable"
import createInternalSystem from "./utils/createInternalSystem"

export const onMoveSystem = createInternalSystem("onMoveSystem", {
    update: (self: MeshAppendable) =>
        positionChanged(self.object3d) && self.onMove!()
})
