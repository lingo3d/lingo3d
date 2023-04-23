import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import { castShadowPtr } from "../../pointers/castShadowPtr"
import configSystem from "../utils/configSystem"

export const [addConfigCastShadowSystem] = configSystem(
    (self: VisibleMixin | PhysicsObjectManager) => {
        // if (!castShadowPtr)

        const bool = !!self.castShadow
        self.outerObject3d.traverse((child) => (child.castShadow = bool))
    }
)
