import { positionChanged } from "../memo/positionChanged"
import renderSystem from "./utils/renderSystem"
import MeshAppendable from "../display/core/MeshAppendable"

export const [addOnMoveSystem, deleteOnMoveSystem] = renderSystem(
    (self: MeshAppendable) => positionChanged(self.object3d) && self.onMove!()
)
