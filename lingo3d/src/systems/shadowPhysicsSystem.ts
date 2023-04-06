import { mapRange } from "@lincode/math"
import renderSystem from "./utils/renderSystem"
import { positionChanged } from "../display/utils/trackObject"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"

export const [addShadowPhysicsSystem, deleteShadowPhysicsSystem] = renderSystem(
    (self: PointLight | SpotLight) => {
        for (const manager of self.queryNearby(
            self.distance * mapRange(self.decay, 0, 10, 1, 0)
        )) {
            if (positionChanged(manager.object3d)) {
                console.log(self.light.shadow.needsUpdate)
                self.light.shadow.needsUpdate = true
            }
        }
    }
)
