import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import configLoadedSystem from "../utils/configLoadedSystem"

export const [addConfigCastShadowSystem] = configLoadedSystem(
    (self: VisibleMixin) => {
        const bool = !!self.castShadow
        self.outerObject3d.traverse((child) => (child.castShadow = bool))
    }
)
