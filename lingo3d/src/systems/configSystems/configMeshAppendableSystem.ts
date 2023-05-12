import scene from "../../engine/scene"
import configSystem from "../utils/configSystem"
import MeshAppendable from "../../api/core/MeshAppendable"

export const [addConfigMeshAppendableSystem] = configSystem(
    (self: MeshAppendable) =>
        !self.outerObject3d.parent && scene.add(self.outerObject3d)
)
