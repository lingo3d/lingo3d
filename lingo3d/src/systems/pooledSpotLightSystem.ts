import PooledSpotLight from "../display/lights/PooledSpotLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releaseSpotLight,
    requestSpotLight
} from "../pools/objectPools/spotLightPool"
import { spotLightPoolPtr } from "../pointers/spotLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"
import getWorldPosition from "../memo/getWorldPosition"

let count = 0

export const pooledSpotLightSystem = createInternalSystem(
    "pooledSpotLightSystem",
    {
        data: { visible: false },
        afterTick: () => {
            count = 0
        },
        update: (self: PooledSpotLight, data) => {
            const intensityFactor = getIntensityFactor(self)
            const visible = !!intensityFactor && ++count <= spotLightPoolPtr[0]
            if (visible && !data.visible)
                self.$light = requestSpotLight([], "", self)
            else if (!visible && data.visible) {
                releaseSpotLight(self.$light)
                self.$light = undefined
            }
            data.visible = visible
            visible &&
                self.$light!.position.copy(getWorldPosition(self.object3d))
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
