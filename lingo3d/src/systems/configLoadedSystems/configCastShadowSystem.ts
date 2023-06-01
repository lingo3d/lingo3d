import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import isOpaque from "../../memo/isOpaque"
import { shadowModePtr } from "../../pointers/shadowModePtr"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configCastShadowSystem = createLoadedEffectSystem(
    "configCastShadowSystem",
    {
        effect: (self: VisibleMixin | PhysicsObjectManager) => {
            const physicsShadow = !!(
                shadowModePtr[0] === "physics" &&
                "physics" in self &&
                (self.physics || self.$jointCount)
            )
            const bool =
                self.castShadow && (physicsShadow || shadowModePtr[0] === true)
            self.outerObject3d.traverse(
                (child) =>
                    (child.castShadow =
                        bool && child.receiveShadow && isOpaque(child))
            )
        }
    }
)
