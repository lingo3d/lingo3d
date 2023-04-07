import { mapRange } from "@lincode/math"
import {
    castShadowChanged,
    positionChanged,
    quaternionChanged
} from "../display/utils/trackObject"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addShadowPhysicsSystem, deleteShadowPhysicsSystem] =
    renderSystemWithData(
        (self: PointLight | SpotLight, data: { count: number }) => {
            const nearby = self.queryNearby(
                self.distance * mapRange(self.decay, 0, 10, 1, 0)
            )
            if (data.count !== nearby.length) {
                data.count = nearby.length
                self.light.shadow.needsUpdate = true
                return
            }
            for (const manager of nearby)
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
