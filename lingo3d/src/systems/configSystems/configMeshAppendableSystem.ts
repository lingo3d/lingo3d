import scene from "../../engine/scene"
import MeshAppendable from "../../display/core/MeshAppendable"
import createInternalSystem from "../utils/createInternalSystem"

export const configMeshAppendableSystem = createInternalSystem(
    "configMeshAppendableSystem",
    {
        effect: (self: MeshAppendable) => {
            !self.$object.parent && scene.add(self.$object)
        }
    }
)
