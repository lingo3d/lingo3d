import LightBase from "../display/core/LightBase"
import renderSystem from "./utils/renderSystem"

export const [addShadowPhysicsSystem, deleteShadowPhysicsSystem] = renderSystem(
    (self: LightBase<any> & { distance: number }) => {
        console.log(self.queryNearby(self.distance))
    }
)
