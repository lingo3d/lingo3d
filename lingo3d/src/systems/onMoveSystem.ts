import { positionChanged } from "../memo/positionChanged"
import MeshAppendable from "../display/core/MeshAppendable"
import createSystem from "./utils/createInternalSystem"

export const onMoveSystem = createSystem("onMoveSystem", {
    update: (self: MeshAppendable) =>
        positionChanged(self.object3d) && self.onMove!()
})
