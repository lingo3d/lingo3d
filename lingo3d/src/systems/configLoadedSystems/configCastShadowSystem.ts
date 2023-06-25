import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import isOpaque from "../../memo/isOpaque"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configCastShadowSystem = createLoadedEffectSystem(
    "configCastShadowSystem",
    {
        effect: (self: VisibleMixin | PhysicsObjectManager) => {
            const bool = self.castShadow
            self.outerObject3d.traverse(
                (child) =>
                    (child.castShadow =
                        bool && child.receiveShadow && isOpaque(child))
            )
        }
    }
)
