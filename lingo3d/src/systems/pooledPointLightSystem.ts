import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import { pointLightPool } from "../pools/objectPools/pointLightPool"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"

let count = 0

export const pooledPointLightSystem = createInternalSystem(
    "pooledPointLightSystem",
    {
        data: { visible: false },
        afterTick: () => {
            count = 0
        },
        update: (self: PooledPointLight, data) => {
            const intensityFactor = getIntensityFactor(self)
            const visible = !!intensityFactor && ++count <= pointLightPoolPtr[0]
            if (visible && !data.visible)
                self.$light = pointLightPool.request([], "", self)
            else if (!visible && data.visible) {
                pointLightPool.release(self.$light)
                self.$light = undefined
            }
            data.visible = visible
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
