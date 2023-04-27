import PointLightBase from "../../display/core/PointLightBase"
import { shadowModePtr } from "../../pointers/shadowModePtr"
import { getShadowMode } from "../../states/useShadowMode"
import {
    addShadowPhysicsSystem,
    deleteShadowPhysicsSystem
} from "../shadowPhysicsSystem"
import configRepeatSystemWithDispose from "../utils/configRepeatSystemWithDispose"

export const [
    addConfigCastShadowPhysicsSystem,
    deleteConfigCastShadowPhysicsSystem
] = configRepeatSystemWithDispose(
    (self: PointLightBase<any>) => {
        if (self.castShadow && shadowModePtr[0] === "physics") {
            self.$light.shadow.needsUpdate = true
            self.$light.shadow.autoUpdate = false
            addShadowPhysicsSystem(self, { count: undefined })
            return true
        }
        self.$light.shadow.autoUpdate = true
        deleteShadowPhysicsSystem(self)
        return false
    },
    deleteShadowPhysicsSystem,
    getShadowMode
)
