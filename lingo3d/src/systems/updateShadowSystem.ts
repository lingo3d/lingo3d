import { castShadowChanged } from "../memo/castShadowChanged"
import { positionChanged } from "../memo/positionChanged"
import { quaternionChanged } from "../memo/quaternionChanged"
import { shadowModePtr } from "../pointers/shadowModePtr"
import updateShadow from "../display/utils/updateShadow"
import PointLightBase from "../display/core/PointLightBase"
import { shadowResolutionPtr } from "../pointers/shadowResolutionPtr"
import createSystem from "./utils/createSystem"

const maxResolution = 1024

export const updateShadowSystem = createSystem({
    data: () => ({
        count: undefined as number | undefined,
        shadowMode: shadowModePtr[0]
    }),
    update: (self: PointLightBase<any>, data) => {
        if (!shadowModePtr[0]) {
            data.shadowMode && updateShadow(self.object3d.shadow)
            data.shadowMode = shadowModePtr[0]
            return shadowResolutionPtr[0] >= maxResolution
        }
        data.shadowMode = shadowModePtr[0]

        if (!self.object3d.intensity || !self.shadows)
            return shadowResolutionPtr[0] >= maxResolution

        if (shadowModePtr[0] === "physics") {
            if (
                positionChanged(self.object3d) ||
                quaternionChanged(self.object3d)
            ) {
                updateShadow(self.object3d.shadow)
                return shadowResolutionPtr[0] >= maxResolution
            }

            const nearby = self.queryNearby(self.distance)
            if (data.count !== nearby.length) {
                data.count = nearby.length
                updateShadow(self.object3d.shadow)
                return shadowResolutionPtr[0] >= maxResolution
            }
            for (const manager of nearby)
                if (
                    positionChanged(manager.object3d) ||
                    quaternionChanged(manager.object3d) ||
                    castShadowChanged(manager.object3d)
                ) {
                    updateShadow(self.object3d.shadow)
                    return shadowResolutionPtr[0] >= maxResolution
                }
            return shadowResolutionPtr[0] >= maxResolution
        }
        updateShadow(self.object3d.shadow)
        return shadowResolutionPtr[0] >= maxResolution
    }
})
