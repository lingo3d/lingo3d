import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystem from "../utils/configSystem"
import { addTransformChangedSystem } from "./transformChangedSystem"

export const [addUpdatePhysicsSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {
        addTransformChangedSystem(self)
        if (!("updatePhysicsTransform" in self)) return
        if (self.userData.updatePhysicsShape) {
            self.userData.updatePhysicsShape = false
            self.updatePhysicsShape()
            return
        }
        self.updatePhysicsTransform()
    }
)
