import Loaded from "../../display/core/Loaded"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import renderSystem from "../utils/renderSystem"

export const [addConfigCastShadowSystem, deleteConfigCastShadowSystem] =
    renderSystem((self: VisibleMixin | PhysicsObjectManager | Loaded) => {
        if (self.done) {
            deleteConfigCastShadowSystem(self)
            return
        }
        if ("loadedObject3d" in self && !self.loadedObject3d) return

        const bool = !!self.castShadow
        self.outerObject3d.traverse((child) => (child.castShadow = bool))
        deleteConfigCastShadowSystem(self)
    })
