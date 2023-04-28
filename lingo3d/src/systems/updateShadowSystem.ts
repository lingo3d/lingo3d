import { castShadowChanged } from "../utilsCached/castShadowChanged"
import { positionChanged } from "../utilsCached/positionChanged"
import { quaternionChanged } from "../utilsCached/quaternionChanged"
import PointLightBase from "../display/core/PointLightBase"
import renderSystemWithData from "./utils/renderSystemWithData"
import { shadowModePtr } from "../pointers/shadowModePtr"

export const [addUpdateShadowSystem, deleteUpdateShadowSystem] =
    renderSystemWithData(
        (self: PointLightBase<any>, data: { count: number | undefined }) => {
            if (!self.object3d.visible || !self.castShadow || !shadowModePtr[0])
                return

            if (shadowModePtr[0] === "physics") {
                if (
                    positionChanged(self.object3d) ||
                    quaternionChanged(self.object3d)
                ) {
                    self.object3d.shadow.needsUpdate = true
                    return
                }
                const nearby = self.queryNearby(self.distance)
                if (data.count !== nearby.length) {
                    data.count = nearby.length
                    self.object3d.shadow.needsUpdate = true
                    return
                }
                for (const manager of nearby)
                    if (
                        positionChanged(manager.object3d) ||
                        quaternionChanged(manager.object3d) ||
                        castShadowChanged(manager.object3d)
                    ) {
                        self.object3d.shadow.needsUpdate = true
                        return
                    }
            } else self.object3d.shadow.needsUpdate = true
        }
    )
