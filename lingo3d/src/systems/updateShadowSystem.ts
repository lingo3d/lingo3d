import updateShadow from "../display/utils/updateShadow"
import PointLightBase from "../display/core/PointLightBase"
import { shadowResolutionPtr } from "../pointers/shadowResolutionPtr"
import createInternalSystem from "./utils/createInternalSystem"
import getIntensityFactor from "../memo/getIntensityFactor"
import frameSync from "../api/frameSync"
import { SHADOW_RESOLUTION_TARGET } from "../globals"
import { mapLinear } from "three/src/math/MathUtils"

export const updateShadowSystem = createInternalSystem("updateShadowSystem", {
    data: { skipped: 0 },
    afterTick: () => {
        shadowResolutionPtr[0] = 0
    },
    update: (self: PointLightBase<any>, data) => {
        const intensityFactor = getIntensityFactor(self)
        if (!intensityFactor || !self.shadows) return
        if (
            shadowResolutionPtr[0] >= SHADOW_RESOLUTION_TARGET &&
            (data.skipped += frameSync(1)) <
                mapLinear(intensityFactor, 0, 1, 10, 0)
        )
            return

        updateShadow(self.$innerObject.shadow)
        data.skipped = 0
    },
    sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
})
