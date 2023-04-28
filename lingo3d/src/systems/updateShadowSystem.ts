import { castShadowChanged } from "../utilsCached/castShadowChanged"
import { positionChanged } from "../utilsCached/positionChanged"
import { quaternionChanged } from "../utilsCached/quaternionChanged"
import { shadowModePtr } from "../pointers/shadowModePtr"
import updateShadow from "../display/utils/updateShadow"
import deferredRenderSystemWithData from "./utils/deferredRenderSystemWithData"
import PointLightBase from "../display/core/PointLightBase"
import { shadowResolutionPtr } from "../pointers/shadowResolutionPtr"

const maxResolution = 1024

export const [addUpdateShadowSystem, deleteUpdateShadowSystem] =
    deferredRenderSystemWithData(
        (self: PointLightBase<any>, data: { count: number | undefined }) => {
            if (!self.object3d.visible || !self.castShadow || !shadowModePtr[0])
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
    )
