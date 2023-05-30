import { positionChanged } from "../memo/positionChanged"
import MeshAppendable from "../display/core/MeshAppendable"
import createSystem from "./utils/createSystem"

export const onMoveSystem = createSystem({
    update: (self: MeshAppendable) =>
        positionChanged(self.object3d) && self.onMove!()
})
