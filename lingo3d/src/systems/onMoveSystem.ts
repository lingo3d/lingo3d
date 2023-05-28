import { positionChanged } from "../memo/positionChanged"
import MeshAppendable from "../display/core/MeshAppendable"
import gameSystem from "./utils/gameSystem"

export const onMoveSystem = gameSystem({
    update: (self: MeshAppendable) =>
        positionChanged(self.object3d) && self.onMove!()
})
