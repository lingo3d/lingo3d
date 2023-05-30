import scene from "../../engine/scene"
import MeshAppendable from "../../display/core/MeshAppendable"
import createSystem from "../utils/createSystem"

export const configMeshAppendableSystem = createSystem({
    setup: (self: MeshAppendable) =>
        !self.outerObject3d.parent && scene.add(self.outerObject3d)
})
