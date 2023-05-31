import scene from "../../engine/scene"
import MeshAppendable from "../../display/core/MeshAppendable"
import createSystem from "../utils/createInternalSystem"

export const configMeshAppendableSystem = createSystem(
    "configMeshAppendableSystem",
    {
        effect: (self: MeshAppendable) => {
            !self.outerObject3d.parent && scene.add(self.outerObject3d)
        }
    }
)
