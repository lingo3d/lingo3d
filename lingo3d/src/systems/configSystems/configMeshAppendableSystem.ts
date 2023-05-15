import scene from "../../engine/scene"
import configSystem from "../utils/configSystem"
import MeshAppendable from "../../display/core/MeshAppendable"

export const [addConfigMeshAppendableSystem] = configSystem(
    (self: MeshAppendable) =>
        !self.outerObject3d.parent && scene.add(self.outerObject3d)
)
