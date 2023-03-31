import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystem from "../utils/configSystem"

export const [addTransformChangedSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {
        if (!("updatePhysicsTransform" in self)) return
        if (self.userData.updatePhysicsShape) {
            self.userData.updatePhysicsShape = false
            self.updatePhysicsShape()
            return
        }
        self.updatePhysicsTransform()
    }
)
