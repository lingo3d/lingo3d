import { positionChanged } from "../utilsCached/positionChanged"
import renderSystem from "./utils/renderSystem"
import MeshAppendable from "../api/core/MeshAppendable"

export const [addOnMoveSystem, deleteOnMoveSystem] = renderSystem(
    (self: MeshAppendable) => positionChanged(self.object3d) && self.onMove!()
)
