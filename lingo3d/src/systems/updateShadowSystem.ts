import { castShadowChanged } from "../utilsCached/castShadowChanged"
import { positionChanged } from "../utilsCached/positionChanged"
import { quaternionChanged } from "../utilsCached/quaternionChanged"
import { shadowModePtr } from "../pointers/shadowModePtr"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import updateShadow from "../display/utils/updateShadow"
import deferredRenderSystemWithData from "./utils/deferredRenderSystemWithData"

export const [addUpdateShadowSystem, deleteUpdateShadowSystem] =
    deferredRenderSystemWithData(
        (
            self: PointLight | SpotLight,
            data: { count: number | undefined }
        ): boolean => {
            if (!self.object3d.visible || !self.castShadow || !shadowModePtr[0])
                return false

            if (shadowModePtr[0] === "physics") {
                if (
                    positionChanged(self.object3d) ||
                    quaternionChanged(self.object3d)
                )
                    return updateShadow(self.object3d.shadow) >= 2048

                const nearby = self.queryNearby(self.distance)
                if (data.count !== nearby.length) {
                    data.count = nearby.length
                    return updateShadow(self.object3d.shadow) >= 2048
                }
                for (const manager of nearby)
                    if (
                        positionChanged(manager.object3d) ||
                        quaternionChanged(manager.object3d) ||
                        castShadowChanged(manager.object3d)
                    ) {
                        return updateShadow(self.object3d.shadow) >= 2048
                    }
            }
            return updateShadow(self.object3d.shadow) >= 2048
        }
    )
