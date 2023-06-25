import updateShadow from "../display/utils/updateShadow"
import PointLightBase from "../display/core/PointLightBase"
import { shadowResolutionPtr } from "../pointers/shadowResolutionPtr"
import deferredRenderSystemWithData from "./utils/deferredRenderSystemWithData"

const maxResolution = 1024

export const updateShadowSystem = deferredRenderSystemWithData(
    "updateShadowSystem",
    (self: PointLightBase<any>) => {
        if (!self.object3d.intensity || !self.shadows)
            return shadowResolutionPtr[0] >= maxResolution

        updateShadow(self.object3d.shadow)
        return shadowResolutionPtr[0] >= maxResolution
    }
)
