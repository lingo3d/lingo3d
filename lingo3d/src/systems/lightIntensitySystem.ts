import getIntensityFactor from "../memo/getIntensityFactor"
import PointLightBase from "../display/core/PointLightBase"
import createInternalSystem from "./utils/createInternalSystem"
import { mapRange } from "@lincode/math"
import frameSync from "../api/frameSync"
import { fpsPtr } from "../pointers/fpsPtr"

export const lightIntensitySystem = createInternalSystem(
    "lightIntensitySystem",
    {
        data: { count: 0 },
        update: (self: PointLightBase<any>, data) => {
            const targetIntensity = self.intensity * getIntensityFactor(self)
            if (data.count < fpsPtr[0]) {
                self.object3d.intensity = mapRange(
                    data.count,
                    0,
                    fpsPtr[0],
                    0,
                    targetIntensity
                )
                data.count += frameSync(1)
                return
            }
            self.object3d.intensity = targetIntensity
            // self.object3d.visible = !!intensityFactor
        }
    }
)
