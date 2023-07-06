import PooledSpotLight from "../display/lights/PooledSpotLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import { spotLightPool } from "../pools/objectPools/spotLightPool"
import { spotLightPoolPtr } from "../pointers/spotLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"

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
                self.$light = spotLightPool.request([], "", self)
            else if (!visible && data.visible) {
                spotLightPool.release(self.$light)
                self.$light = undefined
            }
            data.visible = visible
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
