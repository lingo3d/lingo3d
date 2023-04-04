import LightBase from "../display/core/LightBase"
import renderSystem from "./utils/renderSystem"

export const [addDynamicPointLightSystem, deleteDynamicPointLightSystem] =
    renderSystem((self: LightBase<any>) => {
        // self.queryNearby()
    })
