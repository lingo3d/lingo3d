import PointLight from "../../display/lights/PointLight"
import SpotLight from "../../display/lights/SpotLight"
import { shadowModePtr } from "../../pointers/shadowModePtr"
import { getShadowMode } from "../../states/useShadowMode"
import {
    addPointLightShadowResolutionSystem,
    deletePointLightShadowResolutionSystem
} from "../pointLightShadowResolutionSystem"
import {
    addSpotLightShadowResolutionSystem,
    deleteSpotLightShadowResolutionSystem
} from "../spotLightShadowResolutionSystem"
import configRepeatSystemWithDispose from "../utils/configRepeatSystemWithDispose"

export const [
    addConfigCastShadowResolutionSystem,
    deleteConfigCastShadowResolutionSystem
] = configRepeatSystemWithDispose(
    (self: PointLight | SpotLight) => {
        const castShadow = self.castShadow && !!shadowModePtr[0]
        if (castShadow) {
            self instanceof PointLight
                ? addPointLightShadowResolutionSystem(self, { step: undefined })
                : addSpotLightShadowResolutionSystem(self, { step: undefined })
            return true
        }
        self instanceof PointLight
            ? deletePointLightShadowResolutionSystem(self)
            : deleteSpotLightShadowResolutionSystem(self)
        return false
    },
    (self) =>
        self instanceof PointLight
            ? deletePointLightShadowResolutionSystem(self)
            : deleteSpotLightShadowResolutionSystem(self),
    getShadowMode
)
