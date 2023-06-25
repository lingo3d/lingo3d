import updateShadow from "../display/utils/updateShadow"
import PointLightBase from "../display/core/PointLightBase"
import { shadowResolutionPtr } from "../pointers/shadowResolutionPtr"
import createInternalSystem from "./utils/createInternalSystem"
import getIntensityFactor from "../memo/getIntensityFactor"

const maxResolution = 2048

export const updateShadowSystem = createInternalSystem("updateShadowSystem", {
    afterTick: () => {
        shadowResolutionPtr[0] = 0
    },
    update: (self: PointLightBase<any>) => {
        if (
            !self.object3d.intensity ||
            !self.shadows ||
            shadowResolutionPtr[0] >= maxResolution
        )
            return

        updateShadow(self.object3d.shadow)
    },
    sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
})
