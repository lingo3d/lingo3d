import { castShadowChanged } from "../utilsCached/castShadowChanged"
import { positionChanged } from "../utilsCached/positionChanged"
import { quaternionChanged } from "../utilsCached/quaternionChanged"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import renderSystem from "./utils/renderSystem"

export const [addShadowPhysicsSystem, deleteShadowPhysicsSystem] = renderSystem(
    (self: PointLight | SpotLight) => {
        if (
            positionChanged(self.object3d) ||
            quaternionChanged(self.object3d)
        ) {
            self.light.shadow.needsUpdate = true
            return
        }
        for (const manager of self.queryNearby(self.distance))
            if (
                positionChanged(manager.object3d) ||
                quaternionChanged(manager.object3d) ||
                castShadowChanged(manager.object3d)
            ) {
                self.light.shadow.needsUpdate = true
                return
            }
    }
)
