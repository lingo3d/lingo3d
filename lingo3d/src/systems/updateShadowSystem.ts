import updateShadow from "../display/utils/updateShadow"
import PointLightBase from "../display/core/PointLightBase"
import { shadowResolutionPtr } from "../pointers/shadowResolutionPtr"
import createInternalSystem from "./utils/createInternalSystem"
import getIntensityFactor from "../memo/getIntensityFactor"
import { mapRange } from "@lincode/math"
import frameSync from "../api/frameSync"

const maxResolution = 2048

export const updateShadowSystem = createInternalSystem("updateShadowSystem", {
    data: { skipped: 0 },
    afterTick: () => {
        shadowResolutionPtr[0] = 0
    },
    update: (self: PointLightBase<any>, data) => {
        const intensityFactor = getIntensityFactor(self)
        if (!intensityFactor || !self.shadows) return
        if (
            shadowResolutionPtr[0] >= maxResolution &&
            ++data.skipped < frameSync(mapRange(intensityFactor, 0, 1, 10, 0))
        )
            return

        updateShadow(self.object3d.shadow)
        data.skipped = 0
    },
    sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
})
